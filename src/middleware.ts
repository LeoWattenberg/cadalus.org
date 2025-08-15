import type { MiddlewareHandler } from 'astro';
import { i18nMiddleware } from './i18n/astro';

export const onRequest: MiddlewareHandler = async (context, next) => {
  return (await i18nMiddleware(context, next)) as Response;
};
