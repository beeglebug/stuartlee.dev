import { achievementIds, mainAchievements, type AchievementId, type Locale, type Translation } from '../content/site';

declare global {
  interface Window { portfolio: { claim: (name: string) => boolean } }
}

const storageKey = 'stuartlee:discoveries:v1';
const sectionIds = ['intro', 'about', 'approach', 'projects', 'contact'];
const sourceCode = 'BUILT-WITH-CARE';
const locale = document.body.dataset.locale as Locale;
const t = JSON.parse(document.getElementById('game-translations')!.textContent!) as Translation['game'];
const toggle = document.getElementById('discoveries-toggle') as HTMLButtonElement;
const panel = document.getElementById('discoveries-panel')!;
const notification = document.getElementById('achievement-notification')!;
const badge = document.getElementById('explorer-badge')!;
const feedback = document.getElementById('source-feedback')!;
const awarded = new Set<AchievementId>();
const seen = new Set<string>();
let noticeTimer: ReturnType<typeof setTimeout>;

// Storage is a convenience, never a requirement for using the page.
try {
  const saved: unknown = JSON.parse(localStorage.getItem(storageKey) || '{}');
  if (saved && typeof saved === 'object') {
    const state = saved as { awarded?: unknown; seen?: unknown };
    if (Array.isArray(state.awarded)) {
      state.awarded.forEach(id => {
        if (achievementIds.includes(id)) awarded.add(id as AchievementId);
      });
    }
    if (Array.isArray(state.seen)) {
      state.seen.forEach(id => { if (sectionIds.includes(id)) seen.add(id); });
    }
  }
} catch { /* Fall back to in-memory progress. */ }

function save() {
  try { localStorage.setItem(storageKey, JSON.stringify({ awarded: [...awarded], seen: [...seen] })); }
  catch { /* Keep the in-memory state. */ }
}
function complete() { return mainAchievements.every(id => awarded.has(id)); }
function render() {
  // Keep the control available after a reset, so it doesn't disappear beneath focus.
  if (awarded.size) toggle.hidden = false;
  document.getElementById('discovery-count')!.textContent = `${awarded.size}/${achievementIds.length}`;
  for (const id of achievementIds) {
    const item = document.querySelector<HTMLElement>(`[data-achievement="${id}"]`)!;
    const unlocked = awarded.has(id);
    item.toggleAttribute('data-unlocked', unlocked);
    item.querySelector('.achievement-mark')!.textContent = unlocked ? '✓' : '○';
    item.querySelector('.achievement-state')!.textContent = unlocked ? t.unlocked : t.locked;
  }
  badge.hidden = !complete();
}
function announce(message: string) {
  clearTimeout(noticeTimer);
  notification.textContent = message;
  noticeTimer = setTimeout(() => { notification.textContent = ''; }, 7000);
}
function award(id: AchievementId): boolean {
  if (awarded.has(id)) return false;
  const wasComplete = complete();
  awarded.add(id);
  save();
  render();
  announce(`${t.award} ${t.achievements[id].title}${!wasComplete && complete() ? ` — ${t.explorer}. ${t.complete}` : ''}`);
  return true;
}

render();
toggle.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!expanded));
  panel.hidden = expanded;
});

// A navigation token proves arrival at the destination, works across tabs, and
// doesn't depend on storage. Remove it immediately so it isn't copied into links.
const currentUrl = new URL(location.href);
const fromLocale = currentUrl.searchParams.get('explore');
if ((fromLocale === 'en' || fromLocale === 'de') && fromLocale !== locale) award('language');
if (currentUrl.searchParams.has('explore')) {
  currentUrl.searchParams.delete('explore');
  history.replaceState(history.state, '', currentUrl.pathname + currentUrl.search + currentUrl.hash);
}
for (const link of document.querySelectorAll<HTMLAnchorElement>('a[data-language]')) {
  if (link.dataset.language !== locale) {
    const destination = new URL(link.href);
    destination.searchParams.set('explore', locale);
    link.href = destination.href;
  }
}

document.querySelector('[data-skip]')!.addEventListener('click', () => {
  document.getElementById('main')!.focus({ preventScroll: true });
  award('skip');
});

let waitingForTabFocus = false;
let tabFocused: Element | null = null;
let activationTarget: Element | null = null;
document.addEventListener('pointerdown', () => {
  waitingForTabFocus = false;
  tabFocused = null;
  activationTarget = null;
});
document.addEventListener('keydown', event => {
  if (!event.isTrusted) return;
  if (event.key === 'Tab') {
    waitingForTabFocus = true;
    tabFocused = null;
    activationTarget = null;
    return;
  }
  const target = event.target;
  if (!(target instanceof HTMLElement) || target !== tabFocused || target !== document.activeElement) return;
  const link = target instanceof HTMLAnchorElement && target.hasAttribute('href');
  const button = target instanceof HTMLButtonElement && !target.disabled;
  if ((event.key === 'Enter' && (link || button)) || (event.key === ' ' && button)) activationTarget = target;
});
document.addEventListener('focusin', event => {
  tabFocused = waitingForTabFocus && event.target instanceof Element ? event.target : null;
  waitingForTabFocus = false;
});
document.addEventListener('click', event => {
  if (!event.isTrusted) return;
  const target = event.target instanceof Element ? event.target.closest('a, button') : null;
  if (event.detail === 0 && activationTarget && target === activationTarget) award('keyboard');
  activationTarget = null;
});

const sections = [...document.querySelectorAll<HTMLElement>('[data-discovery-section]')];
function recordVisibleSections() {
  for (const section of sections) {
    const bounds = section.getBoundingClientRect();
    const visible = Math.min(bounds.bottom, innerHeight) - Math.max(bounds.top, 0);
    if (visible >= Math.min(120, bounds.height * .5)) {
      const id = section.dataset.discoverySection!;
      if (!seen.has(id)) { seen.add(id); save(); }
    }
  }
  if (sectionIds.every(id => seen.has(id))) award('story');
}
if (typeof window.IntersectionObserver === 'function') {
  const observer = new IntersectionObserver(recordVisibleSections, { threshold: [0, .1, .2, .3, .5, 1] });
  sections.forEach(section => observer.observe(section));
} else {
  let scheduled = false;
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; recordVisibleSections(); });
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
}
recordVisibleSections();

window.portfolio = Object.freeze({ claim: (name: string) => name === 'console' ? award('console') : false });
console.info(`Stuart Lee — ${t.consoleClue}`);

document.getElementById('source-form')!.addEventListener('submit', event => {
  event.preventDefault();
  const input = document.getElementById('source-code') as HTMLInputElement;
  const valid = input.value.trim().toUpperCase() === sourceCode;
  input.setAttribute('aria-invalid', String(!valid));
  feedback.textContent = valid ? t.sourceSuccess : t.invalid;
  if (valid) award('source');
});
document.getElementById('reset-discoveries')!.addEventListener('click', () => {
  awarded.clear();
  seen.clear();
  save();
  render();
  const input = document.getElementById('source-code') as HTMLInputElement;
  input.value = '';
  input.removeAttribute('aria-invalid');
  feedback.textContent = '';
  announce(t.resetDone);
});
