const BITRIX_PROXY_URL = "https://nlk-bitrix-proxy.nlk-ion.workers.dev";
const MAX_FILES = 5;
const MAX_FILE_BYTES = 8 * 1024 * 1024;

export type LeadMeta = {
  source: "contact" | "estimator";
  subjectName?: string;
};

function formatMskNow(): string {
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

function field(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });
}

export async function sendLeadClient(
  data: FormData,
  meta: LeadMeta,
): Promise<void> {
  const files: { name: string; content: string }[] = [];
  for (const value of data.values()) {
    if (!(value instanceof File) || value.size <= 0) continue;
    if (value.size > MAX_FILE_BYTES) {
      throw new Error("File too large");
    }
    if (files.length >= MAX_FILES) break;
    files.push({
      name: value.name,
      content: await fileToBase64(value),
    });
  }

  const payload = {
    source: meta.source,
    name: field(data, "name"),
    company: field(data, "company"),
    phone: field(data, "phone"),
    email: field(data, "email"),
    material: field(data, "material"),
    materialLabel: field(data, "materialLabel"),
    volumeLabel: field(data, "volumeLabel"),
    scopeLabel: field(data, "scopeLabel"),
    message: field(data, "message"),
    pageUrl: window.location.href,
    submittedAtMsk: formatMskNow(),
    userAgent: navigator.userAgent.slice(0, 400),
    files,
  };

  const res = await fetch(BITRIX_PROXY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
  const json = (await res.json().catch(() => null)) as {
    ok?: boolean;
    error?: string;
  } | null;
  if (!res.ok || !json?.ok) {
    throw new Error(json?.error || "Bitrix proxy rejected");
  }
}
