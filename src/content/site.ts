export type Locale = 'en' | 'de';
export const achievementIds = ['language', 'keyboard', 'skip', 'story', 'console', 'source'] as const;
export type AchievementId = (typeof achievementIds)[number];
export const mainAchievements: AchievementId[] = ['language', 'keyboard', 'skip', 'story'];

export interface Project {
  id: string;
  title: string;
  context: string;
  contribution: string;
  decisions: string;
  outcomes: string;
}

export interface Translation {
  meta: { title: string; description: string };
  nav: { label: string; about: string; approach: string; projects: string; contact: string; languages: string; skip: string };
  hero: { eyebrow: string; title: string; intro: string; contact: string; more: string; note: string };
  about: { label: string; title: string; paragraphs: string[]; caption: string };
  approach: { label: string; title: string; items: { title: string; text: string }[] };
  projects: { label: string; title: string; status: string; intro: string; note: string; fields: { context: string; contribution: string; decisions: string; outcomes: string } };
  contact: { label: string; title: string; text: string; cta: string; github: string };
  theme: { label: string; light: string; dark: string; system: string };
  footer: { text: string; top: string };
  game: {
    control: string; close: string; heading: string; intro: string; mainLabel: string; bonusLabel: string; locked: string; unlocked: string;
    hint: string; sourceLabel: string; sourcePlaceholder: string; submit: string; invalid: string; sourceSuccess: string;
    reset: string; resetDone: string; award: string; explorer: string; complete: string; consoleClue: string;
    achievements: Record<AchievementId, { title: string; hint: string }>;
  };
}

export const translations: Record<Locale, Translation> = {
  en: {
    meta: {
      title: 'Stuart Lee — Senior Frontend Engineer',
      description: 'Stuart Lee, Senior Frontend Engineer based in the UK. React, TypeScript and accessible web applications.',
    },
    nav: { label: 'Main navigation', about: 'About', approach: 'Approach', projects: 'Projects', contact: 'Let’s talk', languages: 'Language', skip: 'Skip to content' },
    hero: {
      eyebrow: 'Senior Frontend Engineer / UK', title: 'Hi, I’m Stuart.\nI build for the web.',
      intro: 'I build reliable, accessible web applications with React and TypeScript. I enjoy working through tricky problems and making complex interfaces easier to use.',
      contact: 'Connect on LinkedIn', more: 'A little about me', note: 'Based in the UK. Experienced in remote teams.',
    },
    about: {
      label: '01 / About', title: 'A frontend focus.\nA broader perspective.',
      paragraphs: [
        'I’m Stuart, a senior frontend engineer with a background spanning international e-commerce, digital agencies and bespoke web applications. I enjoy making complex things feel straightforward for the people using them.',
        'At Fruugo, I work on customer and retailer-facing applications for an international e-commerce platform, primarily with React and TypeScript. Before that, I spent eight years at DRPG, progressing from web developer to lead developer and senior JavaScript engineer.',
        'Earlier work in e-commerce at OGL and system testing at Inspired Gaming gave me a useful grounding in both building software and asking how it might fail. That perspective still shapes how I work today.',
      ],
      caption: 'Frontend engineering, with the whole product in mind.',
    },
    approach: {
      label: '02 / How I work', title: 'The details make\nthe difference.',
      items: [
        { title: 'Built for people', text: 'Accessibility is part of the work from the start. Clear interfaces, keyboard support and responsive layouts help make a product useful to more people.' },
        { title: 'Made to last', text: 'I favour readable code, considered testing and practical choices. The goal is software that a team can understand, maintain and confidently improve.' },
        { title: 'Delivered together', text: 'Having worked in product teams and led agency development, I value clear communication, shared understanding and keeping delivery grounded in what matters.' },
      ],
    },
    projects: {
      label: '03 / Recent projects', title: 'A closer look,\ncoming soon.', status: 'Case studies in progress',
      intro: 'I’m putting together a few recent project stories: the challenges, my contribution and the thinking behind the technical decisions.',
      note: 'In the meantime, my background and experience are on LinkedIn.',
      fields: { context: 'Context', contribution: 'My contribution', decisions: 'Technical decisions', outcomes: 'Outcomes' },
    },
    contact: {
      label: '04 / Get in touch', title: 'Say hello.',
      text: 'You can find me on LinkedIn and GitHub. I’m always happy to talk about frontend development, interesting projects or what you’re working on.',
      cta: 'Connect on LinkedIn', github: 'Find me on GitHub',
    },
    theme: { label: 'Appearance', light: 'Light', dark: 'Dark', system: 'System' },
    footer: { text: 'A few things to discover.', top: 'Back to top' },
    game: {
      control: 'Discoveries', close: 'Close', heading: 'A little curiosity goes a long way.',
      intro: 'There are a few achievements tucked into this site. Explore at your own pace; hints are here if you want them.',
      mainLabel: 'Exploration', bonusLabel: 'Developer bonuses', locked: 'Not discovered yet', unlocked: 'Discovered', hint: 'Show hint',
      sourceLabel: 'Found something in the source?', sourcePlaceholder: 'Enter the source code', submit: 'Claim discovery',
      invalid: 'That code doesn’t match. Take another look at the page source.', sourceSuccess: 'Source discovery claimed.',
      reset: 'Reset discoveries', resetDone: 'Discoveries reset. Ready to explore again.', award: 'Achievement unlocked:',
      explorer: 'Explorer', complete: 'All four exploration achievements found. Thanks for taking a closer look!',
      consoleClue: 'Curious about how things work? Run helloThere() to claim a bonus discovery.',
      achievements: {
        language: { title: 'Hallo!', hint: 'Try reading the site in its other language.' },
        keyboard: { title: 'Keyboard navigator', hint: 'Use Tab to focus a link other than Skip to content and press Enter, or focus an appearance button and press Space.' },
        skip: { title: 'Skip ahead', hint: 'The first link in the keyboard order takes you straight to the content.' },
        story: { title: 'The full story', hint: 'Take a look at each section, including the introduction and the invitation to connect.' },
        console: { title: 'Console curious', hint: 'The browser’s developer console has a message for you. This is an optional desktop bonus.' },
        source: { title: 'Under the hood', hint: 'View the HTML page source and look for an explorer’s code. Enter it below. This is an optional desktop bonus.' },
      },
    },
  },
  de: {
    meta: {
      title: 'Stuart Lee — Senior Frontend Engineer',
      description: 'Stuart Lee, Senior Frontend Engineer in Großbritannien. React, TypeScript und barrierefreie Webanwendungen.',
    },
    nav: { label: 'Hauptnavigation', about: 'Über mich', approach: 'Arbeitsweise', projects: 'Projekte', contact: 'Kontakt', languages: 'Sprache', skip: 'Zum Inhalt springen' },
    hero: {
      eyebrow: 'Senior Frontend Engineer / Großbritannien', title: 'Hallo, ich bin Stuart.\nIch entwickle fürs Web.',
      intro: 'Ich entwickle zuverlässige, barrierefreie Webanwendungen mit React und TypeScript. Ich löse gerne knifflige Probleme und mache komplexe Oberflächen einfacher bedienbar.',
      contact: 'Auf LinkedIn vernetzen', more: 'Mehr über mich', note: 'In Großbritannien zu Hause. Erfahren in Remote-Teams.',
    },
    about: {
      label: '01 / Über mich', title: 'Fokus auf das Frontend.\nBlick auf das Ganze.',
      paragraphs: [
        'Ich bin Stuart, Senior Frontend Engineer mit Erfahrung im internationalen E-Commerce, in Digitalagenturen und in der Entwicklung individueller Webanwendungen. Ich mache komplexe Dinge gerne verständlich und einfach bedienbar.',
        'Bei Fruugo arbeite ich vor allem mit React und TypeScript an Anwendungen für Kunden und Händler einer internationalen E-Commerce-Plattform. Zuvor war ich acht Jahre bei DRPG tätig, vom Webentwickler über den Lead Developer bis zum Senior JavaScript Engineer.',
        'Meine frühere Arbeit im E-Commerce bei OGL und im Systemtest bei Inspired Gaming hat mir eine wertvolle Grundlage gegeben: Software entwickeln und zugleich fragen, wo sie scheitern könnte. Diese Perspektive prägt meine Arbeit bis heute.',
      ],
      caption: 'Frontend-Entwicklung mit Blick auf das gesamte Produkt.',
    },
    approach: {
      label: '02 / Meine Arbeitsweise', title: 'Die Details machen\nden Unterschied.',
      items: [
        { title: 'Für Menschen entwickelt', text: 'Barrierefreiheit gehört von Anfang an dazu. Klare Oberflächen, Tastaturbedienung und responsive Layouts machen ein Produkt für mehr Menschen nutzbar.' },
        { title: 'Für die Zukunft gebaut', text: 'Ich setze auf lesbaren Code, durchdachte Tests und pragmatische Entscheidungen. Software soll für das Team verständlich, wartbar und sicher weiterzuentwickeln sein.' },
        { title: 'Gemeinsam geliefert', text: 'Durch meine Arbeit in Produktteams und als Entwicklungsleiter in einer Agentur weiß ich klare Kommunikation, ein gemeinsames Verständnis und zielgerichtete Umsetzung zu schätzen.' },
      ],
    },
    projects: {
      label: '03 / Aktuelle Projekte', title: 'Ein genauerer Blick.\nDemnächst hier.', status: 'Fallstudien in Vorbereitung',
      intro: 'Ich bereite einige Einblicke in aktuelle Projekte vor: die Herausforderungen, meinen Beitrag und die Überlegungen hinter den technischen Entscheidungen.',
      note: 'Bis dahin finden Sie meinen beruflichen Hintergrund auf LinkedIn.',
      fields: { context: 'Kontext', contribution: 'Mein Beitrag', decisions: 'Technische Entscheidungen', outcomes: 'Ergebnisse' },
    },
    contact: {
      label: '04 / Kontakt', title: 'Sag hallo.',
      text: 'Du findest mich auf LinkedIn und GitHub. Ich tausche mich gerne über Frontend-Entwicklung, interessante Projekte oder deine aktuelle Arbeit aus.',
      cta: 'Auf LinkedIn vernetzen', github: 'Mein GitHub-Profil',
    },
    theme: { label: 'Darstellung', light: 'Hell', dark: 'Dunkel', system: 'System' },
    footer: { text: 'Ein paar Dinge zum Entdecken.', top: 'Nach oben' },
    game: {
      control: 'Entdeckungen', close: 'Schließen', heading: 'Ein wenig Neugier lohnt sich.',
      intro: 'Auf dieser Website sind einige Erfolge versteckt. Erkunden Sie sie in Ihrem eigenen Tempo. Bei Bedarf gibt es Hinweise.',
      mainLabel: 'Erkundung', bonusLabel: 'Entwickler-Bonus', locked: 'Noch nicht entdeckt', unlocked: 'Entdeckt', hint: 'Hinweis anzeigen',
      sourceLabel: 'Etwas im Quelltext gefunden?', sourcePlaceholder: 'Code aus dem Quelltext eingeben', submit: 'Entdeckung einlösen',
      invalid: 'Dieser Code stimmt nicht. Schauen Sie noch einmal in den Seitenquelltext.', sourceSuccess: 'Quelltext-Entdeckung eingelöst.',
      reset: 'Entdeckungen zurücksetzen', resetDone: 'Entdeckungen zurückgesetzt. Bereit für eine neue Erkundung.', award: 'Erfolg freigeschaltet:',
      explorer: 'Entdecker', complete: 'Alle vier Erkundungserfolge gefunden. Vielen Dank für den genaueren Blick!',
      consoleClue: 'Neugierig, wie alles funktioniert? Mit helloThere() erhalten Sie eine Bonus-Entdeckung.',
      achievements: {
        language: { title: 'Hallo!', hint: 'Lesen Sie die Website in der anderen Sprache.' },
        keyboard: { title: 'Tastatur-Profi', hint: 'Fokussieren Sie mit Tab einen Link außer „Zum Inhalt springen“ und drücken Sie Enter, oder eine Darstellungsschaltfläche und drücken Sie die Leertaste.' },
        skip: { title: 'Direkt zum Inhalt', hint: 'Der erste Link in der Tastaturreihenfolge führt direkt zum Inhalt.' },
        story: { title: 'Die ganze Geschichte', hint: 'Sehen Sie sich jeden Abschnitt an, einschließlich der Einleitung und der Einladung zum Gespräch.' },
        console: { title: 'Neugierig auf die Konsole', hint: 'In der Entwicklerkonsole Ihres Browsers wartet eine Nachricht. Ein optionaler Bonus für Desktop-Nutzer.' },
        source: { title: 'Unter der Haube', hint: 'Öffnen Sie den HTML-Seitenquelltext und suchen Sie den Entdecker-Code. Geben Sie ihn unten ein. Ein optionaler Bonus für Desktop-Nutzer.' },
      },
    },
  },
};

// Add real, approved case studies here. Empty lists render the coming-soon section.
export const projects: Record<Locale, Project[]> = { en: [], de: [] };
