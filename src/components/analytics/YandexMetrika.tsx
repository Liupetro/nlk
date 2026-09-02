import Script from "next/script";
import { headers } from "next/headers";

/** Yandex.Metrika counter ID for aldetali.com */
const METRIKA_COM = "111380704";
/** Yandex.Metrika counter ID for aldetali.ru */
const METRIKA_RU = "112187989";

function metrikaIdFromHost(host: string): typeof METRIKA_RU | typeof METRIKA_COM {
  const hostname = host.split(",")[0]?.trim().split(":")[0]?.toLowerCase() ?? "";
  if (hostname.includes("aldetali.ru")) return METRIKA_RU;
  return METRIKA_COM;
}

/**
 * One counter per page, chosen by hostname (single deploy, two domains).
 * JS uses location.hostname so a cached HTML still picks the right ID.
 * noscript uses the request Host header.
 */
export async function YandexMetrika() {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "";
  const noscriptId = metrikaIdFromHost(host);

  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">{`
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
        (function () {
          var host = (location.hostname || "").toLowerCase();
          var isRu = host.indexOf("aldetali.ru") !== -1;
          var id = isRu ? ${METRIKA_RU} : ${METRIKA_COM};
          if (isRu) {
            ym(id, "init", {
              ssr: true,
              webvisor: true,
              clickmap: true,
              ecommerce: "dataLayer",
              accurateTrackBounce: true,
              trackLinks: true
            });
          } else {
            ym(id, "init", {
              clickmap: true,
              trackLinks: true,
              accurateTrackBounce: true,
              webvisor: true
            });
          }
        })();
      `}</Script>
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${noscriptId}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
