import { en } from './locales/en';
import { de } from './locales/de';
import type { AchievementId, Locale, Project, Translation } from './types';

export type { AchievementId, Locale, Project, Translation } from './types';

export const achievementIds = [
  'language',
  'keyboard',
  'skip',
  'story',
  'light',
  'bug',
  'console',
  'source',
] as const;
export const mainAchievements: AchievementId[] = [
  'language',
  'keyboard',
  'skip',
  'story',
  'light',
  'bug',
];

export const translations: Record<Locale, Translation> = { en, de };

// Add real, approved case studies here. Empty lists render the coming-soon section.
export const projects: Record<Locale, Project[]> = { en: [], de: [] };
