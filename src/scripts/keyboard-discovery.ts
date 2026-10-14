// Award only after native keyboard activation, rather than focus alone.
export function initialiseKeyboardDiscovery(onDiscover: () => void) {
  let waitingForTabFocus = false;
  let tabFocused: Element | null = null;
  let activationTarget: Element | null = null;
  document.addEventListener('pointerdown', () => {
    waitingForTabFocus = false;
    tabFocused = null;
    activationTarget = null;
  });
  document.addEventListener('keydown', (event) => {
    if (!event.isTrusted) return;
    if (event.key === 'Tab') {
      waitingForTabFocus = true;
      tabFocused = null;
      activationTarget = null;
      return;
    }
    const target = event.target;
    if (
      !(target instanceof HTMLElement) ||
      target !== tabFocused ||
      target !== document.activeElement
    )
      return;
    const link =
      target instanceof HTMLAnchorElement && target.hasAttribute('href');
    const button = target instanceof HTMLButtonElement && !target.disabled;
    if (
      (event.key === 'Enter' && (link || button)) ||
      (event.key === ' ' && button)
    )
      activationTarget = target;
  });
  document.addEventListener('focusin', (event) => {
    tabFocused =
      waitingForTabFocus && event.target instanceof Element
        ? event.target
        : null;
    waitingForTabFocus = false;
  });
  document.addEventListener('click', (event) => {
    if (!event.isTrusted) return;
    const target =
      event.target instanceof Element
        ? event.target.closest('a, button')
        : null;
    // Firefox reports detail=1 even for Enter-generated clicks. The preceding
    // trusted key event and absence of pointer input establish keyboard use.
    if (
      activationTarget &&
      target === activationTarget &&
      !target?.hasAttribute('data-skip')
    )
      onDiscover();
    activationTarget = null;
  });
  document.addEventListener('keyup', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      // Native Space activation may click on keyup; expire unused attempts after it.
      setTimeout(() => {
        activationTarget = null;
      }, 0);
    }
  });
}
