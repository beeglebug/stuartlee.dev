import { initialiseKeyboardDiscovery } from './keyboard-discovery';
import { initialiseDiscoveriesDialog } from './discoveries-dialog';
const achievementIds = [
  'keyboard',
  'story',
  'light',
  'bug',
  'console',
  'source',
] as const;
type AchievementId = (typeof achievementIds)[number];
const mainAchievements: AchievementId[] = ['keyboard', 'story', 'light', 'bug'];

declare global {
  interface Window {
    helloThere: () => boolean;
  }
}

const storageKey = 'stuartlee:discoveries:v1';
const sectionIds = ['intro', 'about', 'approach', 'projects', 'contact'];
const sourceCode = 'BUILT-WITH-CARE';
const achievementsButton = document.getElementById(
  'discoveries-toggle',
) as HTMLButtonElement;
const achievementToast = document.getElementById('achievement-notification')!;
const completionToast = document.getElementById('completion-notification')!;
const explorerBadge = document.getElementById('explorer-badge')!;
const sourceFeedback = document.getElementById('source-feedback')!;
const awarded = new Set<AchievementId>();
const seenSections = new Set<string>();
let completionTimer: ReturnType<typeof setTimeout> | undefined;
let noticeTimer: ReturnType<typeof setTimeout>;
let announcementTimer: ReturnType<typeof setTimeout> | undefined;
let pendingAnnouncements: string[] = [];

// Storage is a convenience, never a requirement for using the page.
try {
  const saved: unknown = JSON.parse(localStorage.getItem(storageKey) || '{}');
  if (saved && typeof saved === 'object') {
    const state = saved as { awarded?: unknown; seen?: unknown };
    if (Array.isArray(state.awarded)) {
      state.awarded.forEach((id) => {
        if (achievementIds.includes(id)) awarded.add(id as AchievementId);
      });
    }
    if (Array.isArray(state.seen)) {
      state.seen.forEach((id) => {
        if (sectionIds.includes(id)) seenSections.add(id);
      });
    }
  }
} catch {
  /* Fall back to in-memory progress. */
}

function saveProgress() {
  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify({ awarded: [...awarded], seen: [...seenSections] }),
    );
  } catch {
    /* Keep the in-memory state. */
  }
}

function isExplorationComplete() {
  return mainAchievements.every((id) => awarded.has(id));
}

function isAllComplete() {
  return achievementIds.every((id) => awarded.has(id));
}

function renderProgress() {
  // Keep the control available after a reset, so it doesn't disappear beneath focus.
  if (awarded.size) achievementsButton.hidden = false;
  document.getElementById('discovery-count')!.textContent =
    `${awarded.size}/${achievementIds.length}`;
  for (const id of achievementIds) {
    const item = document.querySelector<HTMLElement>(
      `[data-achievement="${id}"]`,
    )!;
    const unlocked = awarded.has(id);
    item.toggleAttribute('data-unlocked', unlocked);
    item.querySelector('.achievement-mark')!.textContent = unlocked ? '✓' : '○';
    item.querySelector('.achievement-state')!.textContent = unlocked
      ? 'Unlocked'
      : 'Locked';
  }
  explorerBadge.hidden = !isExplorationComplete();
  document.getElementById('discovery-star')!.hidden = !isAllComplete();
}

function announce(message: string) {
  pendingAnnouncements.push(message);
  if (announcementTimer !== undefined) return;
  // One action can unlock two achievements. Combine their messages so the live
  // region doesn't replace an announcement before assistive technology reads it.
  announcementTimer = setTimeout(() => {
    clearTimeout(noticeTimer);
    achievementToast.showPopover();
    achievementToast.querySelector('button')!.textContent =
      pendingAnnouncements.join(' ');
    pendingAnnouncements = [];
    announcementTimer = undefined;
    noticeTimer = setTimeout(() => {
      achievementToast.querySelector('button')!.textContent = '';
      achievementToast.hidePopover();
    }, 7000);
  }, 0);
}

function celebrateCompletion() {
  // Let the final individual discovery appear first, then celebrate the set.
  completionTimer = setTimeout(() => {
    clearTimeout(noticeTimer);
    achievementToast.querySelector('button')!.textContent = '';
    achievementToast.hidePopover();
    completionToast.showPopover();
    completionToast.querySelector('button')!.textContent = document
      .getElementById('discovery-star')!
      .getAttribute('aria-label')!;
    completionTimer = setTimeout(() => {
      completionToast.querySelector('button')!.textContent = '';
      completionToast.hidePopover();
    }, 7000);
  }, 3500);
}

function award(id: AchievementId): boolean {
  if (awarded.has(id)) return false;
  const wasExplorationComplete = isExplorationComplete();
  const wasAllComplete = isAllComplete();
  awarded.add(id);
  saveProgress();
  renderProgress();
  const title = document.querySelector(
    `[data-achievement="${id}"] h4`,
  )!.textContent;
  let message = `Achievement unlocked: ${title}`;
  if (!wasExplorationComplete && isExplorationComplete()) {
    message += ` — Explorer. ${explorerBadge.querySelector('p')!.textContent}`;
  }
  announce(message);
  if (!wasAllComplete && isAllComplete()) celebrateCompletion();
  return true;
}

// Persist only recognised IDs when restoring older saved progress.
saveProgress();
renderProgress();
initialiseDiscoveriesDialog();

// Both unlock and completion toasts are shortcuts to the achievement list.
for (const toast of [achievementToast, completionToast]) {
  toast.querySelector('button')!.addEventListener('click', () => {
    clearTimeout(noticeTimer);
    clearTimeout(completionTimer);
    clearTimeout(announcementTimer);
    announcementTimer = undefined;
    pendingAnnouncements = [];
    for (const notice of [achievementToast, completionToast]) {
      notice.hidePopover();
      notice.querySelector('button')!.textContent = '';
    }
    achievementsButton.scrollIntoView({ behavior: 'instant', block: 'end' });
    achievementsButton.click();
  });
}

for (const button of document.querySelectorAll<HTMLButtonElement>(
  '[data-theme-choice]',
)) {
  button.addEventListener(
    'click',
    () => {
      if (button.getAttribute('aria-pressed') !== 'true') award('light');
    },
    { capture: true },
  );
}

const bug = document.getElementById('beeglebug') as HTMLButtonElement;
bug.hidden = false;
bug.addEventListener('click', () => award('bug'));

document.querySelector('[data-skip]')!.addEventListener('click', () => {
  document.getElementById('main')!.focus({ preventScroll: true });
});

initialiseKeyboardDiscovery(() => award('keyboard'));

// Section tracking also works when IntersectionObserver is unavailable.
const sections = [
  ...document.querySelectorAll<HTMLElement>('[data-discovery-section]'),
];

function recordVisibleSections() {
  for (const section of sections) {
    const bounds = section.getBoundingClientRect();
    const visible =
      Math.min(bounds.bottom, innerHeight) - Math.max(bounds.top, 0);
    if (visible >= Math.min(120, bounds.height * 0.5)) {
      const id = section.dataset.discoverySection!;
      if (!seenSections.has(id)) {
        seenSections.add(id);
        saveProgress();
      }
    }
  }
  if (sectionIds.every((id) => seenSections.has(id))) award('story');
}

if (typeof window.IntersectionObserver === 'function') {
  const observer = new IntersectionObserver(recordVisibleSections, {
    threshold: [0, 0.1, 0.2, 0.3, 0.5, 1],
  });
  sections.forEach((section) => observer.observe(section));
} else {
  let scheduled = false;
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      recordVisibleSections();
    });
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
}
recordVisibleSections();

window.helloThere = () => award('console');
console.info(
  'Stuart Lee — Curious about how things work? Run helloThere() to unlock a bonus achievement.',
);

document.getElementById('source-form')!.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.getElementById('source-code') as HTMLInputElement;
  const valid = input.value.trim().toUpperCase() === sourceCode;
  input.setAttribute('aria-invalid', String(!valid));
  sourceFeedback.textContent = valid
    ? 'Source achievement unlocked.'
    : 'That code doesn’t match. Take another look at the page source.';
  if (valid) award('source');
});

document.getElementById('reset-discoveries')!.addEventListener('click', () => {
  clearTimeout(completionTimer);
  completionToast.querySelector('button')!.textContent = '';
  completionToast.hidePopover();
  awarded.clear();
  seenSections.clear();
  saveProgress();
  renderProgress();
  const input = document.getElementById('source-code') as HTMLInputElement;
  input.value = '';
  input.removeAttribute('aria-invalid');
  sourceFeedback.textContent = '';
  announce('Achievements reset. Ready to explore again.');
});
