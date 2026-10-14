export function initialiseDiscoveriesDialog() {
  const toggle = document.getElementById(
    'discoveries-toggle',
  ) as HTMLButtonElement;
  const panel = document.getElementById(
    'discoveries-panel',
  ) as HTMLDialogElement;
  toggle.addEventListener('click', () => {
    panel.showModal();
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('dialog-open');
  });

  document
    .getElementById('discoveries-close')!
    .addEventListener('click', () => panel.close());
  panel.addEventListener('click', (event) => {
    if (event.target !== panel) return;
    const bounds = panel.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      panel.close();
  });
  panel.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const controls = [
      ...panel.querySelectorAll<HTMLElement>('button, input, summary, a[href]'),
    ].filter((element) => element.getClientRects().length > 0);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  panel.addEventListener('close', () => {
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('dialog-open');
    toggle.focus({ preventScroll: true });
  });
}
