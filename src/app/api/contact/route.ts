import { spawn } from "node:child_process";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const ALLOWED_EXT = new Set(["pdf", "stp", "step", "jpg", "jpeg", "png"]);
const MAX_FILE_BYTES = 15 * 1024 * 1024; // 15 MB
const MAX_FIELD = {
  name: 120,
  company: 160,
  phone: 40,
  email: 160,
  material: 80,
  materialLabel: 120,
  volumeLabel: 120,
  scopeLabel: 160,
  message: 4000,
  source: 40,
} as const;

function isAllowedFile(file: File): boolean {
  const name = file.name.toLowerCase();
  const ext = name.includes(".") ? name.split(".").pop() ?? "" : "";
  return ALLOWED_EXT.has(ext);
}

function clip(value: string, max: number): string {
  return value.length > max ? value.slice(0, max) : value;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= MAX_FIELD.email;
}

function getClientIp(request: Request): string {
  const headers = request.headers;
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  const cfIp = headers.get("cf-connecting-ip")?.trim();
  if (cfIp) return cfIp;
  const vercelIp = headers.get("x-vercel-forwarded-for")?.trim();
  if (vercelIp) return vercelIp.split(",")[0]?.trim() || vercelIp;
  return "unknown";
}

function getUserAgent(request: Request): string {
  const ua = request.headers.get("user-agent")?.trim() || "unknown";
  return ua.length > 400 ? ua.slice(0, 400) : ua;
}

function formatSubmittedAt(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";

  return `${get("day")}.${get("month")}.${get("year")} ${get("hour")}:${get("minute")} (МСК)`;
}

function collectFiles(formData: FormData): File[] {
  const files: File[] = [];
  for (const value of formData.getAll("file")) {
    if (value instanceof File && value.size > 0) files.push(value);
  }
  return files;
}

function buildBodyText(params: {
  source: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  materialLabel: string;
  volumeLabel: string;
  scopeLabel: string;
  message: string;
  clientIp: string;
  userAgent: string;
  submittedAt: string;
  fileNames: string[];
}): string {
  const lines = [
    `Источник: ${params.source === "estimator" ? "Заявка на расчёт (/process)" : "Контакты (/contact)"}`,
    "",
    `Имя: ${params.name}`,
    `Компания: ${params.company}`,
    `Телефон: ${params.phone || "—"}`,
    `Email: ${params.email}`,
    `Материал: ${params.materialLabel || "—"}`,
  ];
  if (params.volumeLabel) lines.push(`Годовой объём: ${params.volumeLabel}`);
  if (params.scopeLabel) lines.push(`Что нужно: ${params.scopeLabel}`);
  lines.push("", "Комментарий:", params.message, "");
  if (params.fileNames.length) {
    lines.push("Файлы (имена, без вложений):", ...params.fileNames.map((name) => `— ${name}`), "");
  }
  lines.push(
    "Технические данные",
    `IP: ${params.clientIp}`,
    `User-Agent: ${params.userAgent}`,
    `Время: ${params.submittedAt}`,
  );
  return lines.join("\n");
}

const RESEND_CHILD_SCRIPT = `
const https = require("https");
const key = process.env.RESEND_API_KEY || "";
const to = process.env.CONTACT_TO_EMAIL || "";
const from = process.env.CONTACT_FROM_EMAIL || "";
let payload;
try {
  payload = JSON.parse(process.env.CONTACT_MAIL_PAYLOAD || "{}");
} catch (e) {
  process.stdout.write(JSON.stringify({ ok: false, error: "bad payload" }));
  process.exit(2);
}
if (!key || !to || !from || !payload.subject || !payload.text) {
  process.stdout.write(JSON.stringify({ ok: false, error: "missing env" }));
  process.exit(2);
}
const body = JSON.stringify({
  from: from,
  to: [to],
  reply_to: payload.replyTo || undefined,
  subject: payload.subject,
  text: payload.text
});
const req = https.request({
  hostname: "api.resend.com",
  path: "/emails",
  method: "POST",
  family: 4,
  headers: {
    Authorization: "Bearer " + key,
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body)
  },
  timeout: 15000
}, (res) => {
  let data = "";
  res.on("data", (chunk) => { data += chunk; });
  res.on("end", () => {
    const ok = res.statusCode >= 200 && res.statusCode < 300;
    process.stdout.write(JSON.stringify({ ok: ok }));
    process.exit(ok ? 0 : 2);
  });
});
req.on("error", () => {
  process.stdout.write(JSON.stringify({ ok: false }));
  process.exit(2);
});
req.on("timeout", () => {
  req.destroy();
  process.stdout.write(JSON.stringify({ ok: false }));
  process.exit(2);
});
req.write(body);
req.end();
`;

function sendViaResendChild(payload: {
  replyTo: string;
  subject: string;
  text: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const key = process.env.RESEND_API_KEY?.trim() || "";
  const to = process.env.CONTACT_TO_EMAIL?.trim() || "";
  const from = process.env.CONTACT_FROM_EMAIL?.trim() || "";
  if (!key || !to || !from) {
    console.error("[contact/resend] missing RESEND_API_KEY or CONTACT_* email env");
    return Promise.resolve({ ok: false, error: "Mail is not configured" });
  }

  return new Promise((resolve) => {
    let settled = false;
    const finish = (result: { ok: true } | { ok: false; error: string }) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    let child;
    try {
      child = spawn(process.execPath, ["-e", RESEND_CHILD_SCRIPT], {
        env: {
          ...process.env,
          CONTACT_MAIL_PAYLOAD: JSON.stringify(payload),
        },
        stdio: ["ignore", "pipe", "pipe"],
        windowsHide: true,
      });
    } catch (error) {
      console.error("[contact/resend] spawn failed");
      finish({ ok: false, error: "Send failed" });
      return;
    }

    let stdout = "";
    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString("utf8");
    });
    child.stderr.on("data", () => {
      // keep parent alive; do not log secrets from child
    });

    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      console.error("[contact/resend] child timeout");
      finish({ ok: false, error: "Send failed" });
    }, 20000);

    child.on("error", () => {
      clearTimeout(timer);
      console.error("[contact/resend] child error");
      finish({ ok: false, error: "Send failed" });
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      try {
        const parsed = JSON.parse(stdout || "{}") as { ok?: boolean };
        if (parsed.ok === true) {
          finish({ ok: true });
          return;
        }
      } catch {
        // fall through
      }
      console.error("[contact/resend] child exit", code);
      finish({ ok: false, error: "Send failed" });
    });
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = clip(String(formData.get("name") ?? "").trim(), MAX_FIELD.name);
    const company = clip(String(formData.get("company") ?? "").trim(), MAX_FIELD.company);
    const phone = clip(String(formData.get("phone") ?? "").trim(), MAX_FIELD.phone);
    const email = clip(String(formData.get("email") ?? "").trim(), MAX_FIELD.email);
    const material = clip(String(formData.get("material") ?? "").trim(), MAX_FIELD.material);
    const materialLabel = clip(
      String(formData.get("materialLabel") ?? material).trim(),
      MAX_FIELD.materialLabel,
    );
    const volumeLabel = clip(
      String(formData.get("volumeLabel") ?? "").trim(),
      MAX_FIELD.volumeLabel,
    );
    const scopeLabel = clip(
      String(formData.get("scopeLabel") ?? "").trim(),
      MAX_FIELD.scopeLabel,
    );
    const message = clip(String(formData.get("message") ?? "").trim(), MAX_FIELD.message);
    const source = clip(String(formData.get("source") ?? "contact").trim(), MAX_FIELD.source);
    const files = collectFiles(formData);

    const clientIp = getClientIp(request);
    const userAgent = getUserAgent(request);
    const submittedAt = formatSubmittedAt();

    const contactName = name || company;
    const contactCompany = company || name;

    if (!contactName || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Invalid email" },
        { status: 400 },
      );
    }

    if (source !== "contact" && source !== "estimator") {
      return NextResponse.json(
        { ok: false, error: "Invalid source" },
        { status: 400 },
      );
    }

    for (const file of files) {
      if (!isAllowedFile(file)) {
        return NextResponse.json(
          { ok: false, error: "Unsupported file type" },
          { status: 400 },
        );
      }
      if (file.size > MAX_FILE_BYTES) {
        return NextResponse.json(
          { ok: false, error: "File too large" },
          { status: 400 },
        );
      }
    }

    const titlePrefix = source === "estimator" ? "Заявка на расчёт" : "Заявка с сайта";
    const subject = `${titlePrefix} — ${contactCompany || contactName}`;
    const text = buildBodyText({
      source,
      name: contactName,
      company: contactCompany,
      phone,
      email,
      materialLabel,
      volumeLabel,
      scopeLabel,
      message,
      clientIp,
      userAgent,
      submittedAt,
      fileNames: files.map((file) => file.name),
    });

    console.info("[contact] submission", {
      source,
      email,
      company: contactCompany,
      clientIp,
      submittedAt,
      fileCount: files.length,
    });

    const sent = await sendViaResendChild({
      replyTo: email,
      subject,
      text,
    });
    if (!sent.ok) {
      return NextResponse.json(
        { ok: false, error: sent.error ?? "Send failed" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact]", error);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 },
    );
  }
}
