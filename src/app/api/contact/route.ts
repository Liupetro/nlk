import { NextResponse } from "next/server";

const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? "zakaz@aldetali.ru";
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
  // Practical server-side check (not full RFC)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= MAX_FIELD.email;
}

/** Client IP from common proxy / CDN headers. */
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

/** Moscow local time for the email body, e.g. "07.08.2026 11:15 (МСК)". */
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
    const file = formData.get("file");

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

    // Only allow known sources
    if (source !== "contact" && source !== "estimator") {
      return NextResponse.json(
        { ok: false, error: "Invalid source" },
        { status: 400 },
      );
    }

    if (file instanceof File && file.size > 0) {
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

    const payload = {
      name: contactName,
      company: contactCompany,
      phone,
      email,
      materialLabel,
      volumeLabel,
      scopeLabel,
      message,
      source,
      clientIp,
      userAgent,
      submittedAt,
      file: file instanceof File && file.size > 0 ? file : null,
    };

    console.info("[contact] submission", {
      source: payload.source,
      email: payload.email,
      company: payload.company,
      clientIp: payload.clientIp,
      userAgent: payload.userAgent,
      submittedAt: payload.submittedAt,
      hasFile: Boolean(payload.file),
    });

    // Prefer Resend when configured
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const sent = await sendViaResend({
        apiKey: resendKey,
        to: TO_EMAIL,
        from: process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev",
        ...payload,
      });
      if (!sent.ok) {
        return NextResponse.json(
          { ok: false, error: sent.error ?? "Send failed" },
          { status: 502 },
        );
      }
      return NextResponse.json({ ok: true });
    }

    // Fallback: FormSubmit.co (first use requires one-time inbox confirmation)
    const sent = await sendViaFormSubmit({
      to: TO_EMAIL,
      ...payload,
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

type MailPayload = {
  name: string;
  company: string;
  phone: string;
  email: string;
  materialLabel: string;
  volumeLabel: string;
  scopeLabel: string;
  message: string;
  source: string;
  clientIp: string;
  userAgent: string;
  submittedAt: string;
  file: File | null;
};

function buildBodyText(params: Omit<MailPayload, "file">): string {
  const lines = [
    `Источник: ${params.source === "estimator" ? "Заявка на расчёт (/process)" : "Контакты"}`,
    "",
    `Имя: ${params.name}`,
    `Компания: ${params.company}`,
    `Телефон: ${params.phone || "—"}`,
    `Email: ${params.email}`,
    `Материал: ${params.materialLabel || "—"}`,
  ];

  if (params.volumeLabel) {
    lines.push(`Годовой объём: ${params.volumeLabel}`);
  }
  if (params.scopeLabel) {
    lines.push(`Что нужно: ${params.scopeLabel}`);
  }

  lines.push(
    "",
    "Комментарий:",
    params.message,
    "",
    "Технические данные",
    `IP: ${params.clientIp}`,
    `User-Agent: ${params.userAgent}`,
    `Время: ${params.submittedAt}`,
  );

  return lines.join("\n");
}

async function sendViaResend(
  params: MailPayload & { apiKey: string; to: string; from: string },
): Promise<{ ok: boolean; error?: string }> {
  const bodyText = buildBodyText(params);

  type ResendAttachment = { filename: string; content: string };
  const attachments: ResendAttachment[] = [];

  if (params.file) {
    const buffer = Buffer.from(await params.file.arrayBuffer());
    attachments.push({
      filename: params.file.name,
      content: buffer.toString("base64"),
    });
  }

  const subjectPrefix =
    params.source === "estimator" ? "Заявка на расчёт" : "Заявка с сайта";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: params.from,
      to: [params.to],
      reply_to: params.email,
      subject: `${subjectPrefix} — ${params.company || params.name}`,
      text: bodyText,
      attachments: attachments.length ? attachments : undefined,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("[contact/resend]", res.status, detail);
    return { ok: false, error: "Resend failed" };
  }

  return { ok: true };
}

async function sendViaFormSubmit(
  params: MailPayload & { to: string },
): Promise<{ ok: boolean; error?: string }> {
  const payload = new FormData();
  payload.append("name", params.name);
  payload.append("company", params.company);
  payload.append("phone", params.phone);
  payload.append("email", params.email);
  payload.append("material", params.materialLabel);
  if (params.volumeLabel) payload.append("volume", params.volumeLabel);
  if (params.scopeLabel) payload.append("scope", params.scopeLabel);
  payload.append("message", params.message);
  payload.append("source", params.source);
  payload.append("client_ip", params.clientIp);
  payload.append("user_agent", params.userAgent);
  payload.append("submitted_at", params.submittedAt);
  const subjectPrefix =
    params.source === "estimator" ? "Заявка на расчёт" : "Заявка с сайта";
  payload.append(
    "_subject",
    `${subjectPrefix} — ${params.company || params.name}`,
  );
  payload.append("_replyto", params.email);
  payload.append("_template", "table");
  payload.append("_captcha", "false");

  if (params.file) {
    payload.append("attachment", params.file, params.file.name);
  }

  const res = await fetch(`https://formsubmit.co/ajax/${params.to}`, {
    method: "POST",
    body: payload,
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("[contact/formsubmit]", res.status, detail);
    return { ok: false, error: "FormSubmit failed" };
  }

  const data = (await res.json().catch(() => null)) as
    | { success?: string | boolean }
    | null;

  if (data && data.success === false) {
    return { ok: false, error: "FormSubmit rejected" };
  }

  return { ok: true };
}
