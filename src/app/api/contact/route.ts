import { NextResponse } from "next/server";
import https from "node:https";
import dns from "node:dns";
import { URL } from "node:url";

export const runtime = "nodejs";

dns.setDefaultResultOrder("ipv4first");

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

function sourceUrl(request: Request): string {
  const referer = request.headers.get("referer")?.trim();
  if (referer) return referer;
  const host = (
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    "aldetali.ru"
  )
    .split(",")[0]
    ?.trim();
  const proto = (
    request.headers.get("x-forwarded-proto") ?? "https"
  )
    .split(",")[0]
    ?.trim();
  return `${proto}://${host}`;
}

function collectFiles(formData: FormData): File[] {
  const files: File[] = [];
  for (const value of formData.getAll("file")) {
    if (value instanceof File && value.size > 0) files.push(value);
  }
  return files;
}

function bitrixWebhookBase(): string | null {
  let raw = process.env.BITRIX_WEBHOOK_URL?.trim() ?? "";
  if (
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"))
  ) {
    raw = raw.slice(1, -1).trim();
  }
  if (!raw.startsWith("https://")) return null;
  return raw.endsWith("/") ? raw : `${raw}/`;
}

function redactBitrix(text: string): string {
  return text.replace(/\/rest\/\d+\/[A-Za-z0-9]+/gi, "/rest/***/***");
}

type BitrixResponse = {
  result?: unknown;
  error?: string;
  error_description?: string;
};

async function bitrixCall(
  method: string,
  params: Record<string, unknown>,
): Promise<{ ok: true; result: unknown } | { ok: false; error: string }> {
  const base = bitrixWebhookBase();
  if (!base) {
    console.error("[contact/bitrix] BITRIX_WEBHOOK_URL is not set");
    return { ok: false, error: "Bitrix is not configured" };
  }

  let url: URL;
  try {
    url = new URL(`${base}${method}`);
  } catch {
    console.error("[contact/bitrix] invalid webhook URL");
    return { ok: false, error: "Bitrix is not configured" };
  }

  const body = JSON.stringify(params);

  return new Promise((resolve) => {
    const req = https.request(
      {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || 443,
        path: `${url.pathname}${url.search}`,
        method: "POST",
        family: 4,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
        timeout: 15000,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk: Buffer) => chunks.push(chunk));
        res.on("error", (error) => {
          console.error("[contact/bitrix]", method, error.message);
          resolve({ ok: false, error: "Bitrix failed" });
        });
        res.on("end", () => {
          const raw = Buffer.concat(chunks).toString("utf8");
          let data: BitrixResponse | null = null;
          try {
            data = JSON.parse(raw) as BitrixResponse;
          } catch {
            console.error(
              "[contact/bitrix]",
              method,
              res.statusCode,
              redactBitrix(raw.slice(0, 300)),
            );
            resolve({ ok: false, error: "Bitrix failed" });
            return;
          }
          if ((res.statusCode ?? 500) >= 400 || data.error) {
            console.error(
              "[contact/bitrix]",
              method,
              data.error ?? res.statusCode,
              redactBitrix(data.error_description ?? ""),
            );
            resolve({ ok: false, error: "Bitrix failed" });
            return;
          }
          resolve({ ok: true, result: data.result });
        });
      },
    );
    req.on("error", (error) => {
      console.error("[contact/bitrix]", method, error.message);
      resolve({ ok: false, error: "Bitrix failed" });
    });
    req.on("timeout", () => {
      req.destroy();
      console.error("[contact/bitrix]", method, "timeout");
      resolve({ ok: false, error: "Bitrix failed" });
    });
    req.write(body);
    req.end();
  });
}

function buildComments(params: {
  source: string;
  materialLabel: string;
  volumeLabel: string;
  scopeLabel: string;
  message: string;
  clientIp: string;
  userAgent: string;
  submittedAt: string;
  pageUrl: string;
  fileNames: string[];
}): string {
  const lines = [
    `Источник: ${params.source === "estimator" ? "Заявка на расчёт (/process)" : "Контакты (/contact)"}`,
    `URL: ${params.pageUrl}`,
    "",
    `Материал: ${params.materialLabel || "—"}`,
  ];
  if (params.volumeLabel) lines.push(`Годовой объём: ${params.volumeLabel}`);
  if (params.scopeLabel) lines.push(`Что нужно: ${params.scopeLabel}`);
  lines.push("", "Текст заявки:", params.message, "");
  if (params.fileNames.length) {
    lines.push("Файлы:", ...params.fileNames.map((name) => `— ${name}`), "");
  }
  lines.push(
    "Технические данные",
    `IP: ${params.clientIp}`,
    `User-Agent: ${params.userAgent}`,
    `Время: ${params.submittedAt}`,
  );
  return lines.join("\n");
}

async function fileToBase64(file: File): Promise<[string, string]> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return [file.name, buffer.toString("base64")];
}

async function attachFilesToLead(leadId: number, files: File[]): Promise<boolean> {
  const storageList = await bitrixCall("disk.storage.getlist", {});
  let storageId: number | null = null;
  if (storageList.ok && Array.isArray(storageList.result) && storageList.result.length > 0) {
    const storages = storageList.result as { ID?: string | number }[];
    const parsed = Number(storages[0]?.ID);
    if (Number.isFinite(parsed) && parsed > 0) storageId = parsed;
  } else {
    console.error("[contact/bitrix] disk.storage.getlist failed");
  }

  for (const file of files) {
    const [filename, content] = await fileToBase64(file);

    if (storageId) {
      const uploaded = await bitrixCall("disk.storage.uploadfile", {
        id: storageId,
        data: { NAME: filename },
        fileContent: [filename, content],
        generateUniqueName: true,
      });
      if (!uploaded.ok) {
        console.error("[contact/bitrix] disk.storage.uploadfile failed", filename);
      }
    }

    const comment = await bitrixCall("crm.timeline.comment.add", {
      fields: {
        ENTITY_ID: leadId,
        ENTITY_TYPE: "lead",
        COMMENT: `Файл с сайта: ${filename}`,
        FILES: [[filename, content]],
      },
    });
    if (!comment.ok) {
      console.error("[contact/bitrix] crm.timeline.comment.add failed", filename);
      return false;
    }
  }

  return true;
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
    const pageUrl = sourceUrl(request);

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

    if (!bitrixWebhookBase()) {
      console.error("[contact/bitrix] BITRIX_WEBHOOK_URL is not set");
      return NextResponse.json(
        { ok: false, error: "Bitrix is not configured" },
        { status: 502 },
      );
    }

    const titlePrefix = source === "estimator" ? "Заявка на расчёт" : "Заявка с сайта";
    const title = `${titlePrefix} — ${contactCompany || contactName}`;
    const comments = buildComments({
      source,
      materialLabel,
      volumeLabel,
      scopeLabel,
      message,
      clientIp,
      userAgent,
      submittedAt,
      pageUrl,
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

    const fields: Record<string, unknown> = {
      TITLE: title,
      NAME: contactName,
      COMPANY_TITLE: contactCompany,
      COMMENTS: comments,
      SOURCE_ID: "WEB",
      SOURCE_DESCRIPTION: "aldetali.ru",
      OPENED: "Y",
      EMAIL: [{ VALUE: email, VALUE_TYPE: "WORK" }],
    };
    if (phone) {
      fields.PHONE = [{ VALUE: phone, VALUE_TYPE: "WORK" }];
    }

    const created = await bitrixCall("crm.lead.add", { fields });
    const leadId = Number(created.ok ? created.result : NaN);
    if (!created.ok || !Number.isFinite(leadId) || leadId <= 0) {
      return NextResponse.json(
        { ok: false, error: "Bitrix failed" },
        { status: 502 },
      );
    }

    if (files.length > 0) {
      const attached = await attachFilesToLead(leadId, files);
      if (!attached) {
        return NextResponse.json(
          { ok: false, error: "Bitrix file upload failed" },
          { status: 502 },
        );
      }
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
