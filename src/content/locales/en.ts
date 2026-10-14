import type { Translation } from '../types';

export const en = {
  meta: {
    title: 'Stuart Lee — Senior Frontend Engineer',
    description:
      'Stuart Lee, Senior Frontend Engineer based in the UK. React, TypeScript and accessible web applications.',
  },
  nav: {
    label: 'Main navigation',
    about: 'About',
    approach: 'Approach',
    projects: 'Projects',
    contact: 'Let’s talk',
    languages: 'Language',
    skip: 'Skip to content',
  },
  hero: {
    eyebrow: 'Senior Frontend Engineer / UK',
    title: 'Hi, I’m Stuart.\nI build for the web.',
    intro:
      'I build reliable, accessible web applications with React and TypeScript. I enjoy working through tricky problems and making complex interfaces easier to use.',
    contact: 'Connect on LinkedIn',
    more: 'A little about me',
    note: 'Based in the UK. Experienced in remote teams.',
  },
  about: {
    label: '01 / About',
    title: 'A frontend focus.\nA broader perspective.',
    paragraphs: [
      'I’m Stuart, a senior frontend engineer with a background spanning international e-commerce, digital agencies and bespoke web applications. I enjoy making complex things feel straightforward for the people using them.',
      'At Fruugo, I work on customer and retailer-facing applications for an international e-commerce platform, primarily with React and TypeScript. Before that, I spent eight years at DRPG, progressing from web developer to lead developer and senior JavaScript engineer.',
      'Earlier work in e-commerce at OGL and system testing at Inspired Gaming gave me a useful grounding in both building software and asking how it might fail. That perspective still shapes how I work today.',
    ],
    bugLabel: 'A little bug',
    caption: 'Frontend engineering, with the whole product in mind.',
  },
  approach: {
    label: '02 / How I work',
    title: 'The details make\nthe difference.',
    items: [
      {
        title: 'Built for people',
        text: 'Accessibility is part of the work from the start. Clear interfaces, keyboard support and responsive layouts help make a product useful to more people.',
      },
      {
        title: 'Made to last',
        text: 'I favour readable code, considered testing and practical choices. The goal is software that a team can understand, maintain and confidently improve.',
      },
      {
        title: 'Delivered together',
        text: 'Having worked in product teams and led agency development, I value clear communication, shared understanding and keeping delivery grounded in what matters.',
      },
    ],
  },
  projects: {
    label: '03 / Recent projects',
    title: 'A closer look,\ncoming soon.',
    status: 'Case studies in progress',
    intro:
      'I’m putting together a few recent project stories: the challenges, my contribution and the thinking behind the technical decisions.',
    note: 'In the meantime, my background and experience are on LinkedIn.',
    fields: {
      context: 'Context',
      contribution: 'My contribution',
      decisions: 'Technical decisions',
      outcomes: 'Outcomes',
    },
  },
  contact: {
    label: '04 / Get in touch',
    title: 'Say hello.',
    text: 'You can find me on LinkedIn and GitHub. I’m always happy to talk about frontend development, interesting projects or what you’re working on.',
    cta: 'Connect on LinkedIn',
    github: 'Find me on GitHub',
  },
  theme: {
    label: 'Appearance',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  },
  footer: { text: 'A few things to discover.', top: 'Back to top' },
  game: {
    control: 'Discoveries',
    close: 'Close',
    heading: 'A little curiosity goes a long way.',
    intro:
      'There are a few achievements tucked into this site. Explore at your own pace; hints are here if you want them.',
    mainLabel: 'Exploration',
    bonusLabel: 'Developer bonuses',
    locked: 'Not discovered yet',
    unlocked: 'Discovered',
    hint: 'Show hint',
    sourceLabel: 'Found something in the source?',
    sourcePlaceholder: 'Enter the source code',
    submit: 'Claim discovery',
    invalid: 'That code doesn’t match. Take another look at the page source.',
    sourceSuccess: 'Source discovery claimed.',
    reset: 'Reset discoveries',
    resetDone: 'Discoveries reset. Ready to explore again.',
    award: 'Achievement unlocked:',
    explorer: 'Explorer',
    complete:
      'All six exploration achievements found. Thanks for taking a closer look!',
    allComplete:
      'All eight discoveries found! Thanks for exploring every corner. ★',
    consoleClue:
      'Curious about how things work? Run helloThere() to claim a bonus discovery.',
    achievements: {
      language: {
        title: 'Hallo!',
        hint: 'Try reading the site in its other language.',
      },
      keyboard: {
        title: 'Keyboard navigator',
        hint: 'Use Tab to focus a link other than Skip to content and press Enter, or focus an appearance button and press Space.',
      },
      skip: {
        title: 'Skip ahead',
        hint: 'The first link in the keyboard order takes you straight to the content.',
      },
      story: {
        title: 'The full story',
        hint: 'Take a look at each section, including the introduction and the invitation to connect.',
      },
      light: {
        title: 'Different light',
        hint: 'Try changing the appearance of the page.',
      },
      bug: {
        title: 'Beeglebug',
        hint: 'There’s a little bug near the introduction to my background. Say hello.',
      },
      console: {
        title: 'Console curious',
        hint: 'The browser’s developer console has a message for you. This is an optional desktop bonus.',
      },
      source: {
        title: 'Under the hood',
        hint: 'View the HTML page source and look for an explorer’s code. Enter it below. This is an optional desktop bonus.',
      },
    },
  },
} satisfies Translation;
