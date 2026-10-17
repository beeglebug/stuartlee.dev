const root = document.documentElement;
const controls = [
  ...document.querySelectorAll<HTMLButtonElement>('[data-theme-choice]'),
];

function renderTheme() {
  const selected = root.dataset.theme || 'system';
  controls.forEach((button) =>
    button.setAttribute(
      'aria-pressed',
      String(button.dataset.themeChoice === selected),
    ),
  );
}

document.querySelector<HTMLElement>('.theme-control')!.hidden = false;
renderTheme();

controls.forEach((button) =>
  button.addEventListener('click', () => {
    const choice = button.dataset.themeChoice!;
    if (choice === 'system') delete root.dataset.theme;
    else root.dataset.theme = choice;
    try {
      localStorage.setItem('stuartlee:theme', choice);
    } catch {
      /* In-memory preference still works. */
    }
    renderTheme();
  }),
);

window.addEventListener('storage', (event) => {
  if (event.key !== 'stuartlee:theme' && event.key !== null) return;
  if (event.newValue === 'light' || event.newValue === 'dark')
    root.dataset.theme = event.newValue;
  else delete root.dataset.theme;
  renderTheme();
});
