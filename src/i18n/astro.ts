import type { APIContext, MiddlewareHandler } from 'astro';
import { defaultLocale, supportedLocales, type Locale } from './config';

export function parseLocaleFromPath(pathname: string): Locale {
  const seg = pathname.split('/').filter(Boolean)[0];
  if (supportedLocales.includes(seg as Locale)) return seg as Locale;
  return defaultLocale;
}

export const i18nMiddleware: MiddlewareHandler = async (ctx, next) => {
  const url = new URL(ctx.request.url);
  const locale = parseLocaleFromPath(url.pathname);
  // Attach on locals for pages
  (ctx.locals as any).locale = locale;
  return next();
};

export function localePath(locale: Locale, path: string) {
  if (!path.startsWith('/')) path = '/' + path;
  if (locale === defaultLocale) return path; // optional: omit default
  return `/${locale}${path}`;
}

export function getLocaleFromContext(Astro: any): Locale {
  return (Astro.locals?.locale) || defaultLocale;
}
