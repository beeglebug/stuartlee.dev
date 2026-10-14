export type Locale = 'en' | 'de';
export type AchievementId =
  | 'language'
  | 'keyboard'
  | 'skip'
  | 'story'
  | 'light'
  | 'bug'
  | 'console'
  | 'source';

export interface Project {
  id: string;
  title: string;
  context: string;
  contribution: string;
  decisions: string;
  outcomes: string;
}

export interface ApproachItem {
  title: string;
  text: string;
}

export interface ProjectFieldLabels {
  context: string;
  contribution: string;
  decisions: string;
  outcomes: string;
}

export interface AchievementCopy {
  title: string;
  hint: string;
}

export type AchievementTranslations = Record<AchievementId, AchievementCopy>;

export interface Translation {
  meta: { title: string; description: string };
  nav: {
    label: string;
    about: string;
    approach: string;
    projects: string;
    contact: string;
    languages: string;
    skip: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    intro: string;
    contact: string;
    more: string;
    note: string;
  };
  about: {
    label: string;
    title: string;
    paragraphs: string[];
    caption: string;
    bugLabel: string;
  };
  approach: {
    label: string;
    title: string;
    items: ApproachItem[];
  };
  projects: {
    label: string;
    title: string;
    status: string;
    intro: string;
    note: string;
    fields: ProjectFieldLabels;
  };
  contact: {
    label: string;
    title: string;
    text: string;
    cta: string;
    github: string;
  };
  theme: { label: string; light: string; dark: string; system: string };
  footer: { text: string; top: string };
  game: {
    control: string;
    close: string;
    heading: string;
    intro: string;
    mainLabel: string;
    bonusLabel: string;
    locked: string;
    unlocked: string;
    hint: string;
    sourceLabel: string;
    sourcePlaceholder: string;
    submit: string;
    invalid: string;
    sourceSuccess: string;
    reset: string;
    resetDone: string;
    award: string;
    explorer: string;
    complete: string;
    consoleClue: string;
    allComplete: string;
    achievements: AchievementTranslations;
  };
}
