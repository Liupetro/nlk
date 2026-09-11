const BITRIX_PROXY_URL = "https://nlk-bitrix-proxy.nlk-ion.workers.dev";
const WEB3FORMS_URL = "https://api.web3forms.com/submit";
const MAX_FILES = 5;
const MAX_FILE_BYTES = 8 * 1024 * 1024;
const PROXY_TIMEOUT_MS = 12000;

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

function notifyZakaz(payload: Record<string, string>): void {
  const key = (process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? "").trim();
  if (!key) return;
  const fd = new FormData();
  fd.append("access_key", key);
  fd.append("subject", payload.subject);
  fd.append("from_name", "aldetali.ru");
  for (const [name, value] of Object.entries(payload)) {
    if (name === "subject") continue;
    fd.append(name, value);
  }
  void fetch(WEB3FORMS_URL, { method: "POST", body: fd });
}

async function postProxy(body: unknown, timeoutMs: number): Promise<{ ok?: boolean; id?: number; error?: string }> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(BITRIX_PROXY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    const json = (await res.json().catch(() => null)) as {
      ok?: boolean;
      id?: number;
      error?: string;
    } | null;
    if (!res.ok || !json?.ok) {
      throw new Error(json?.error || "Bitrix proxy rejected");
    }
    return json;
  } finally {
    clearTimeout(timer);
  }
}

export async function sendLeadClient(
  data: FormData,
  meta: LeadMeta,
): Promise<void> {
  const rawFiles: File[] = [];
  for (const value of data.values()) {
    if (!(value instanceof File) || value.size <= 0) continue;
    if (value.size > MAX_FILE_BYTES) throw new Error("File too large");
    if (rawFiles.length >= MAX_FILES) break;
    rawFiles.push(value);
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
    files: rawFiles.map((file) => ({ name: file.name, content: "" })),
  };

  const created = await postProxy(payload, PROXY_TIMEOUT_MS);

  const title =
    (meta.source === "estimator" ? "Zayavka na raschet" : "Zayavka s sayta") +
    " — " +
    (meta.subjectName || payload.company || payload.name || "aldetali.ru");
  notifyZakaz({
    subject: title,
    source: payload.source,
    name: payload.name,
    company: payload.company,
    phone: payload.phone,
    email: payload.email,
    material: payload.materialLabel || payload.material,
    message: payload.message,
    files: rawFiles.map((f) => f.name).join(", ") || "net",
    bitrix_deal: String(created.id || ""),
    page_url: payload.pageUrl,
    submitted_at_msk: payload.submittedAtMsk,
    note: "Kopiya: sdelka v Bitrix24. Faili dogonyayut v kartochke.",
  });

  if (!rawFiles.length || !created.id) return;

  void (async () => {
    const files = [];
    for (const file of rawFiles) {
      files.push({ name: file.name, content: await fileToBase64(file) });
    }
    try {
      await postProxy({ dealId: created.id, files }, 60000);
    } catch {}
  })();
}
