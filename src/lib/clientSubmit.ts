const WEB3FORMS_URL = "https://api.web3forms.com/submit";
const FORMSUBMIT_URL = "https://formsubmit.co/ajax/zakaz@aldetali.ru";

export type LeadMeta = {
  source: "contact" | "estimator";
  subjectName?: string;
};

function web3formsKey(): string {
  return (process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? "").trim();
}

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

export async function sendLeadClient(
  data: FormData,
  meta: LeadMeta,
): Promise<void> {
  const key = web3formsKey();
  if (key) {
    await sendViaWeb3Forms(data, meta, key);
    return;
  }
  await sendViaFormSubmit(data, meta);
}

async function sendViaWeb3Forms(
  source: FormData,
  meta: LeadMeta,
  accessKey: string,
): Promise<void> {
  const fd = new FormData();
  fd.append("access_key", accessKey);
  fd.append(
    "subject",
    (meta.source === "estimator" ? "Заявка на расчёт" : "Заявка с сайта") +
      " — " +
      (meta.subjectName || "aldetali.ru"),
  );
  fd.append("from_name", "aldetali.ru");
  fd.append("source", meta.source);
  fd.append("submitted_at_msk", formatMskNow());
  fd.append("user_agent", navigator.userAgent.slice(0, 400));
  fd.append("page_url", window.location.href);

  for (const [name, value] of source.entries()) {
    if (name === "access_key") continue;
    if (value instanceof File) {
      if (value.size > 0) fd.append("attachment", value, value.name);
      continue;
    }
    fd.append(name, value);
  }

  const res = await fetch(WEB3FORMS_URL, { method: "POST", body: fd });
  const json = (await res.json().catch(() => null)) as {
    success?: boolean;
    message?: string;
  } | null;
  if (!res.ok || !json?.success) {
    throw new Error(json?.message || "Web3Forms rejected");
  }
}

async function sendViaFormSubmit(
  source: FormData,
  meta: LeadMeta,
): Promise<void> {
  const fd = new FormData();
  fd.append(
    "_subject",
    (meta.source === "estimator" ? "Заявка на расчёт" : "Заявка с сайта") +
      " — " +
      (meta.subjectName || "aldetali.ru"),
  );
  fd.append("_template", "table");
  fd.append("_captcha", "false");
  fd.append("source", meta.source);
  fd.append("submitted_at_msk", formatMskNow());
  fd.append("user_agent", navigator.userAgent.slice(0, 400));
  fd.append("page_url", window.location.href);

  const reply = source.get("email");
  if (typeof reply === "string" && reply) fd.append("_replyto", reply);

  for (const [name, value] of source.entries()) {
    if (name.startsWith("_")) continue;
    if (value instanceof File) {
      if (value.size > 0) fd.append("attachment", value, value.name);
      continue;
    }
    fd.append(name, value);
  }

  const res = await fetch(FORMSUBMIT_URL, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: fd,
  });
  const json = (await res.json().catch(() => null)) as {
    success?: string | boolean;
    message?: string;
  } | null;
  const ok = Boolean(res.ok) && (json?.success === true || json?.success === "true");
  if (!ok) {
    throw new Error(json?.message || "FormSubmit rejected");
  }
}
