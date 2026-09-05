"use client";

import Script from "next/script";

export function BitrixCrmForm() {
  return (
    <section className="relative bg-charcoal pb-20 lg:pb-28">
      <div className="mx-auto w-full max-w-xl px-4">
        <p className="mb-6 text-center text-sm text-white/60">
          Или оставьте заявку с файлом в CRM
        </p>
        <div className="overflow-hidden rounded-2xl bg-white/5 p-2">
          <Script
            id="b24-crm-form-loader"
            src="https://cdn-ru.bitrix24.ru/b38643554/crm/form/loader_10.js"
            strategy="afterInteractive"
            data-b24-form="inline/10/nnbv5o"
            data-skip-moving="true"
          />
        </div>
      </div>
    </section>
  );
}
