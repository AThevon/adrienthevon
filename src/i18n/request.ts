import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export default getRequestConfig(async () => {
  // Try to get locale from cookie first, then Accept-Language header, then default
  const cookieStore = await cookies();
  const headerStore = await headers();

  let locale: Locale = defaultLocale;

  // Check cookie
  const cookieLocale = cookieStore.get("locale")?.value;
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    locale = cookieLocale as Locale;
  } else {
    // Check Accept-Language header
    const acceptLanguage = headerStore.get("accept-language");
    if (acceptLanguage) {
      const preferredLocale = acceptLanguage.split(",")[0].split("-")[0];
      if (locales.includes(preferredLocale as Locale)) {
        locale = preferredLocale as Locale;
      }
    }
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
