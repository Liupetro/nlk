import { connect as tlsConnect, type TLSSocket } from "node:tls";
import { connect as netConnect, type Socket } from "node:net";
import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");

const DEFAULT_MAILBOX = "zakaz@aldetali.ru";

export type ContactMailInput = {
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  file: File | null;
};

type SmtpSocket = TLSSocket | Socket;

export function smtpSettings() {
  const user = process.env.SMTP_USER?.trim() || DEFAULT_MAILBOX;
  const pass = process.env.SMTP_PASS?.trim() || "";
  const host = process.env.SMTP_HOST?.trim() || "smtp.spaceweb.ru";
  const port = Number(process.env.SMTP_PORT || "465");
  const from = process.env.CONTACT_FROM_EMAIL?.trim() || user;
  return { host, port, user, pass, from };
}

function encodeHeader(value: string): string {
  if (!/[^\x20-\x7E]/.test(value)) return value;
  return `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
}

function dotStuff(body: string): string {
  return body.replace(/\r\n/g, "\n").replace(/\n/g, "\r\n").replace(/^\./gm, "..");
}

async function readReply(socket: SmtpSocket): Promise<{ code: number; text: string }> {
  let buf = "";
  for (;;) {
    const chunk: Buffer = await new Promise((resolve, reject) => {
      const onData = (data: Buffer) => {
        cleanup();
        resolve(data);
      };
      const onError = (err: Error) => {
        cleanup();
        reject(err);
      };
      const onEnd = () => {
        cleanup();
        reject(new Error("SMTP connection closed"));
      };
      const cleanup = () => {
        socket.off("data", onData);
        socket.off("error", onError);
        socket.off("end", onEnd);
      };
      socket.once("data", onData);
      socket.once("error", onError);
      socket.once("end", onEnd);
    });
    buf += chunk.toString("utf8");
    const lines = buf.split(/\r?\n/).filter((line) => line.length > 0);
    const last = lines[lines.length - 1];
    if (last && /^\d{3} /.test(last)) {
      return { code: Number(last.slice(0, 3)), text: buf };
    }
  }
}

function writeLine(socket: SmtpSocket, line: string): Promise<void> {
  return new Promise((resolve, reject) => {
    socket.write(`${line}\r\n`, "utf8", (err) => (err ? reject(err) : resolve()));
  });
}

async function command(socket: SmtpSocket, line: string, expected: number | number[]) {
  await writeLine(socket, line);
  const reply = await readReply(socket);
  const ok = Array.isArray(expected) ? expected.includes(reply.code) : reply.code === expected;
  if (!ok) {
    throw new Error(`SMTP ${line.split(" ")[0]} failed (${reply.code}): ${reply.text.trim()}`);
  }
  return reply;
}

function openSocket(host: string, port: number, implicitTls: boolean, timeoutMs: number): Promise<SmtpSocket> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const fail = (err: Error) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      reject(err);
    };
    const socket: SmtpSocket = implicitTls
      ? tlsConnect({ host, port, servername: host, family: 4 })
      : netConnect({ host, port, family: 4 });
    socket.on("error", (err: Error) => fail(err));
    socket.setTimeout(timeoutMs, () => fail(new Error(`SMTP timeout ${host}:${port}`)));
    socket.once(implicitTls ? "secureConnect" : "connect", () => {
      if (settled) return;
      settled = true;
      resolve(socket);
    });
  });
}

function upgradeTls(socket: Socket, host: string, timeoutMs: number): Promise<TLSSocket> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const fail = (err: Error) => {
      if (settled) return;
      settled = true;
      tlsSocket.destroy();
      reject(err);
    };
    const tlsSocket = tlsConnect({ socket, host, servername: host });
    tlsSocket.on("error", (err: Error) => fail(err));
    tlsSocket.setTimeout(timeoutMs, () => fail(new Error("SMTP STARTTLS timeout")));
    tlsSocket.once("secureConnect", () => {
      if (settled) return;
      settled = true;
      resolve(tlsSocket);
    });
  });
}

async function buildMime(input: ContactMailInput, from: string): Promise<string> {
  const headers = [
    `From: ${encodeHeader("НЛК")} <${from}>`,
    `To: <${input.to}>`,
    `Reply-To: <${input.replyTo}>`,
    `Subject: ${encodeHeader(input.subject)}`,
    `Date: ${new Date().toUTCString()}`,
    "MIME-Version: 1.0",
  ];

  if (input.file && input.file.size > 0) {
    const boundary = `nlk-${Date.now().toString(16)}`;
    const bytes = Buffer.from(await input.file.arrayBuffer());
    const ctype = input.file.type || "application/octet-stream";
    const safeName = input.file.name.replace(/"/g, "");
    headers.push(`Content-Type: multipart/mixed; boundary="${boundary}"`, "");
    return [
      headers.join("\r\n"),
      `--${boundary}`,
      "Content-Type: text/plain; charset=UTF-8",
      "Content-Transfer-Encoding: 8bit",
      "",
      input.text.replace(/\r\n/g, "\n").replace(/\n/g, "\r\n"),
      `--${boundary}`,
      `Content-Type: ${ctype}; name="${safeName}"`,
      "Content-Transfer-Encoding: base64",
      `Content-Disposition: attachment; filename="${safeName}"`,
      "",
      bytes.toString("base64").replace(/(.{76})/g, "$1\r\n"),
      `--${boundary}--`,
      "",
    ].join("\r\n");
  }

  headers.push("Content-Type: text/plain; charset=UTF-8", "Content-Transfer-Encoding: 8bit", "");
  return `${headers.join("\r\n")}\r\n${input.text.replace(/\r\n/g, "\n").replace(/\n/g, "\r\n")}\r\n`;
}

async function sendOnPort(
  input: ContactMailInput,
  smtp: ReturnType<typeof smtpSettings>,
  port: number,
): Promise<void> {
  const timeoutMs = 12000;
  const implicitTls = port === 465;
  let socket = await openSocket(smtp.host, port, implicitTls, timeoutMs);
  try {
    if (!implicitTls) {
      const greeting = await readReply(socket);
      if (greeting.code !== 220) throw new Error(`SMTP greeting ${greeting.code}`);
      await command(socket, "EHLO aldetali.ru", 250);
      await command(socket, "STARTTLS", 220);
      socket = await upgradeTls(socket as Socket, smtp.host, timeoutMs);
    } else {
      const greeting = await readReply(socket);
      if (greeting.code !== 220) throw new Error(`SMTP greeting ${greeting.code}`);
    }
    await command(socket, "EHLO aldetali.ru", 250);
    await command(socket, "AUTH LOGIN", 334);
    await command(socket, Buffer.from(smtp.user, "utf8").toString("base64"), 334);
    await command(socket, Buffer.from(smtp.pass, "utf8").toString("base64"), 235);
    await command(socket, `MAIL FROM:<${smtp.from}>`, 250);
    await command(socket, `RCPT TO:<${input.to}>`, 250);
    await command(socket, "DATA", 354);
    const mime = await buildMime(input, smtp.from);
    await writeLine(socket, `${dotStuff(mime)}\r\n.`);
    const dataReply = await readReply(socket);
    if (dataReply.code !== 250) {
      throw new Error(`SMTP DATA ${dataReply.code}: ${dataReply.text.trim()}`);
    }
    await writeLine(socket, "QUIT").catch(() => undefined);
  } finally {
    socket.destroy();
  }
}

export async function sendViaSpacewebSmtp(
  input: ContactMailInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const smtp = smtpSettings();
  if (!smtp.pass) {
    console.error("[contact/smtp] SMTP_PASS is not set");
    return { ok: false, error: "SMTP is not configured" };
  }

  const ports = smtp.port === 587 ? [587, 465] : [465, 587];
  let lastError = "SMTP failed";
  for (const port of ports) {
    try {
      await sendOnPort(input, smtp, port);
      return { ok: true };
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      console.error("[contact/smtp]", port, lastError);
    }
  }
  return { ok: false, error: "SMTP failed" };
}
