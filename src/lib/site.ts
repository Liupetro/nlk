/** Canonical site origin. No www. */
export const SITE_ORIGIN = "https://aldetali.ru";
export const CANONICAL_HOST = "aldetali.ru";

export function pageUrl(path = "/"): string {
  if (!path || path === "/") return SITE_ORIGIN;
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

export function canonicalMeta(path = "/") {
  const url = pageUrl(path);
  return {
    alternates: { canonical: url },
    openGraph: { url },
  };
}
