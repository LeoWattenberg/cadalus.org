export const supportedLocales = ['en','da','de'] as const;
export type Locale = typeof supportedLocales[number];
export const defaultLocale: Locale = 'en';

// Eagerly import JSON (Vite will bundle + tree-shake)
import enFeatures from '../../public/locales/en/features.json';
import daFeatures from '../../public/locales/da/features.json';
import enHero from '../../public/locales/en/hero.json';
import deHero from '../../public/locales/de/hero.json';
import enNavbar from '../../public/locales/en/navbar.json';
import deNavbar from '../../public/locales/de/navbar.json';
import enJoin from '../../public/locales/en/join.json';
import deJoin from '../../public/locales/de/join.json';
import enRoadmap from '../../public/locales/en/roadmap.json';
import deRoadmap from '../../public/locales/de/roadmap.json';
import enSitenotice from '../../public/locales/en/sitenotice.json';
import enPrograms from '../../public/locales/en/programs.json';

type Namespace = 'features' | 'hero' | 'navbar' | 'join' | 'roadmap' | 'sitenotice' | 'programs';

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
    sitenotice: enSitenotice,
    programs: enPrograms,
  },
  da: {
    features: daFeatures,
    hero: (await import('../../public/locales/da/hero.json')).default ?? ({} as any),
    navbar: (await import('../../public/locales/da/navbar.json')).default ?? ({} as any),
    join: (await import('../../public/locales/da/join.json')).default ?? ({} as any),
    roadmap: (await import('../../public/locales/da/roadmap.json')).default ?? ({} as any),
    sitenotice: (await import('../../public/locales/da/sitenotice.json')).default ?? ({} as any),
    programs: (await import('../../public/locales/da/programs.json')).default ?? ({} as any),
  },
  de: {
    features: (await import('../../public/locales/de/features.json')).default ?? ({} as any),
    hero: deHero,
    navbar: deNavbar,
    join: deJoin,
    roadmap: deRoadmap,
    sitenotice: (await import('../../public/locales/de/sitenotice.json')).default ?? ({} as any),
    programs: (await import('../../public/locales/de/programs.json')).default ?? ({} as any),
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
