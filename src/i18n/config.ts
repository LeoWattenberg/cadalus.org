export const supportedLocales = ['en','fr'] as const;
export type Locale = typeof supportedLocales[number];
export const defaultLocale: Locale = 'en';

// Eagerly import JSON (Vite will bundle + tree-shake)
import enFeatures from '../../public/locales/en/features.json';
import frFeatures from '../../public/locales/fr/features.json';

type Namespace = 'features';

type Resources = Record<Namespace, Record<string,string>>;

const resources: Record<Locale, Resources> = {
  en: { features: enFeatures as Record<string,string> },
  fr: { features: frFeatures as Record<string,string> },
};

export function getDictionary(locale: Locale) {
  return resources[locale] ?? resources[defaultLocale];
}

export function t(locale: Locale, key: string, namespace: Namespace = 'features'): string {
  const dict = getDictionary(locale)[namespace];
  return dict[key] ?? key;
}
