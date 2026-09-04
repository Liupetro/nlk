"use strict";

const { parentPort, workerData } = require("node:worker_threads");
const tls = require("node:tls");
const net = require("node:net");

function fail(message) {
  parentPort.postMessage({ ok: false, error: message });
}

function ok() {
  parentPort.postMessage({ ok: true });
}

function readReply(socket) {
  return new Promise((resolve, reject) => {
    let buf = "";
    const onData = (chunk) => {
      buf += chunk.toString("utf8");
      const lines = buf.split(/\r?\n/).filter((line) => line.length > 0);
      const last = lines[lines.length - 1];
      if (last && /^\d{3} /.test(last)) {
        cleanup();
        resolve({ code: Number(last.slice(0, 3)), text: buf });
      }
    };
    const onError = (err) => {
      cleanup();
      reject(err);
    };
    const cleanup = () => {
      socket.off("data", onData);
      socket.off("error", onError);
      socket.off("end", onEnd);
    };
    const onEnd = () => {
      cleanup();
      reject(new Error("SMTP connection closed"));
    };
    socket.on("data", onData);
    socket.on("error", onError);
    socket.on("end", onEnd);
  });
}

function writeLine(socket, line) {
  return new Promise((resolve, reject) => {
    socket.write(`${line}\r\n`, "utf8", (err) => (err ? reject(err) : resolve()));
  });
}

async function command(socket, line, expected) {
  await writeLine(socket, line);
  const reply = await readReply(socket);
  const okCodes = Array.isArray(expected) ? expected : [expected];
  if (!okCodes.includes(reply.code)) {
    throw new Error(`SMTP ${line.split(" ")[0]} failed (${reply.code}): ${String(reply.text).trim()}`);
  }
  return reply;
}

function connectPort(host, port, timeoutMs) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const socket =
      port === 465
        ? tls.connect({ host, port, servername: host })
        : net.connect({ host, port });
    const done = (err, value) => {
      if (settled) return;
      settled = true;
      if (err) {
        socket.destroy();
        reject(err);
      } else resolve(value);
    };
    socket.on("error", (err) => done(err));
    socket.setTimeout(timeoutMs, () => done(new Error(`SMTP timeout on ${port}`)));
    socket.once(port === 465 ? "secureConnect" : "connect", () => done(null, socket));
  });
}

function startTls(socket, host, timeoutMs) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const tlsSocket = tls.connect({ socket, host, servername: host });
    const done = (err, value) => {
      if (settled) return;
      settled = true;
      if (err) {
        tlsSocket.destroy();
        reject(err);
      } else resolve(value);
    };
    tlsSocket.on("error", (err) => done(err));
    tlsSocket.setTimeout(timeoutMs, () => done(new Error("SMTP STARTTLS timeout")));
    tlsSocket.once("secureConnect", () => done(null, tlsSocket));
  });
}

function encodeSubject(subject) {
  if (!/[^\x20-\x7E]/.test(subject)) return subject;
  return `=?UTF-8?B?${Buffer.from(subject, "utf8").toString("base64")}?=`;
}

function encodeUtf8Header(value) {
  if (!/[^\x20-\x7E]/.test(value)) return value;
  return `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
}

function buildMime(data) {
  const date = new Date().toUTCString();
  const headers = [
    `From: ${encodeUtf8Header("НЛК")} <${data.from}>`,
    `To: <${data.to}>`,
    `Reply-To: <${data.replyTo}>`,
    `Subject: ${encodeSubject(data.subject)}`,
    `Date: ${date}`,
    "MIME-Version: 1.0",
  ];
  if (data.fileBase64 && data.fileName) {
    const boundary = `nlk-${Date.now().toString(16)}`;
    const ctype = data.fileType || "application/octet-stream";
    headers.push(`Content-Type: multipart/mixed; boundary="${boundary}"`, "");
    return [
      headers.join("\r\n"),
      `--${boundary}`,
      "Content-Type: text/plain; charset=UTF-8",
      "Content-Transfer-Encoding: 8bit",
      "",
      data.text.replace(/\r\n/g, "\n").replace(/\n/g, "\r\n"),
      `--${boundary}`,
      `Content-Type: ${ctype}; name="${data.fileName.replace(/"/g, "")}"`,
      "Content-Transfer-Encoding: base64",
      `Content-Disposition: attachment; filename="${data.fileName.replace(/"/g, "")}"`,
      "",
      data.fileBase64.replace(/(.{76})/g, "$1\r\n"),
      `--${boundary}--`,
      "",
    ].join("\r\n");
  }
  headers.push("Content-Type: text/plain; charset=UTF-8", "Content-Transfer-Encoding: 8bit", "");
  return `${headers.join("\r\n")}\r\n${data.text.replace(/\r\n/g, "\n").replace(/\n/g, "\r\n")}\r\n`;
}

function dotStuff(body) {
  return body.replace(/\r\n/g, "\n").replace(/\n/g, "\r\n").replace(/^\./gm, "..");
}

async function sendOnPort(data, port) {
  const timeoutMs = 15000;
  let socket = await connectPort(data.host, port, timeoutMs);
  try {
    if (port !== 465) {
      const greeting = await readReply(socket);
      if (greeting.code !== 220) throw new Error(`SMTP greeting failed (${greeting.code})`);
      await command(socket, "EHLO aldetali.ru", 250);
      await command(socket, "STARTTLS", 220);
      socket = await startTls(socket, data.host, timeoutMs);
    } else {
      const greeting = await readReply(socket);
      if (greeting.code !== 220) throw new Error(`SMTP greeting failed (${greeting.code})`);
    }
    await command(socket, "EHLO aldetali.ru", 250);
    await command(socket, "AUTH LOGIN", 334);
    await command(socket, Buffer.from(data.user, "utf8").toString("base64"), 334);
    await command(socket, Buffer.from(data.pass, "utf8").toString("base64"), 235);
    await command(socket, `MAIL FROM:<${data.from}>`, 250);
    await command(socket, `RCPT TO:<${data.to}>`, 250);
    await command(socket, "DATA", 354);
    await writeLine(socket, `${dotStuff(buildMime(data))}\r\n.`);
    const dataReply = await readReply(socket);
    if (dataReply.code !== 250) {
      throw new Error(`SMTP DATA failed (${dataReply.code}): ${String(dataReply.text).trim()}`);
    }
    await writeLine(socket, "QUIT").catch(() => undefined);
  } finally {
    socket.destroy();
  }
}

async function main() {
  const data = workerData;
  if (!data || !data.pass) {
    fail("SMTP is not configured");
    return;
  }
  const ports = data.port ? [Number(data.port)] : [465, 587];
  let lastError = "SMTP failed";
  for (const port of ports) {
    try {
      await sendOnPort(data, port);
      ok();
      return;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
  }
  fail(lastError);
}

main().catch((error) => fail(error instanceof Error ? error.message : String(error)));
