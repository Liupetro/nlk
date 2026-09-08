const BITRIX_PROXY_URL = "https://nlk-bitrix-proxy.nlk-ion.workers.dev";

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

export async function sendLeadClient(
  data: FormData,
  meta: LeadMeta,
): Promise<void> {
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
