export const supportedLocales = ['en','fr','de'] as const;
export type Locale = typeof supportedLocales[number];
export const defaultLocale: Locale = 'en';

// Eagerly import JSON (Vite will bundle + tree-shake)
import enFeatures from '../../public/locales/en/features.json';
import frFeatures from '../../public/locales/fr/features.json';
import enHero from '../../public/locales/en/hero.json';
import frHero from '../../public/locales/fr/hero.json';
import deHero from '../../public/locales/de/hero.json';
import enNavbar from '../../public/locales/en/navbar.json';
import frNavbar from '../../public/locales/fr/navbar.json';
import deNavbar from '../../public/locales/de/navbar.json';
import enJoin from '../../public/locales/en/join.json';
import frJoin from '../../public/locales/fr/join.json';
import deJoin from '../../public/locales/de/join.json';
import enRoadmap from '../../public/locales/en/roadmap.json';
import frRoadmap from '../../public/locales/fr/roadmap.json';
import deRoadmap from '../../public/locales/de/roadmap.json';

type Namespace = 'features' | 'hero' | 'navbar' | 'join' | 'roadmap';

type FlatDict = Record<string,string>;
// Allow complex objects (roadmap has an array). Use unknown and resolve at access time.
type Resources = Record<Namespace, unknown>;

const resources: Record<Locale, Resources> = {
  en: {
    features: enFeatures,
    hero: enHero,
    navbar: enNavbar,
    join: enJoin,
    roadmap: enRoadmap,
  },
  fr: {
    features: frFeatures,
    hero: frHero,
    navbar: frNavbar,
    join: frJoin,
    roadmap: frRoadmap,
  },
  de: {
    features: (await import('../../public/locales/de/features.json')).default ?? ({} as any),
    hero: deHero,
    navbar: deNavbar,
    join: deJoin,
    roadmap: deRoadmap,
  },
};

export function getDictionary(locale: Locale) {
  return resources[locale] ?? resources[defaultLocale];
}

export function t(locale: Locale, key: string, namespace: Namespace): string {
  const dict = getDictionary(locale)[namespace];
  if (!dict) return key;
  // Support dot + numeric indexing e.g. steps.0.title
  const parts = key.split('.');
  let current: any = dict;
  for (const part of parts) {
    if (current == null) return key;
    const idx = Number(part);
    if (!Number.isNaN(idx) && Array.isArray(current)) {
      current = current[idx];
    } else {
      current = current[part];
    }
  }
  return typeof current === 'string' ? current : key;
}
