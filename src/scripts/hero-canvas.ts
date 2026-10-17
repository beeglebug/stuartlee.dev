function initialiseHeroCanvas() {
  const canvas =
    document.querySelector<HTMLCanvasElement>('[data-hero-canvas]');
  if (!canvas) return;

  const context = canvas.getContext('2d');
  if (!context) return;

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const control =
    document.querySelector<HTMLButtonElement>('[data-hero-motion]');
  let isEnabled = !motion.matches;
  let width = 0;
  let height = 0;
  let animationFrameId = 0;
  let isVisible = false;
  let lastFrameTime = 0;
  let phase = 0;

  const draw = () => {
    context.clearRect(0, 0, width, height);
    const color = getComputedStyle(canvas).color;
    context.strokeStyle = color;
    context.lineWidth = 1;
    // Slow contour lines suggest terrain and procedural game worlds.
    for (let line = 0; line < 24; line++) {
      context.beginPath();
      for (let y = -20; y <= height + 20; y += 8) {
        const x =
          width * 0.76 +
          line * 18 +
          Math.sin(y * 0.007 + phase + line * 0.11) * 65 +
          Math.sin(y * 0.014 - phase * 0.6 + line * 0.08) * 24;
        if (y === -20) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.stroke();
    }
  };

  const tick = (now: number) => {
    animationFrameId = 0;
    if (!isVisible || document.hidden || !isEnabled) return;
    if (now - lastFrameTime >= 33) {
      // Clamp elapsed time so resuming never jumps the contours forward.
      phase += Math.min((now - lastFrameTime) / 1000, 0.05) * 0.12;
      lastFrameTime = now;
      draw();
    }
    animationFrameId = requestAnimationFrame(tick);
  };

  // Keep animation work paused off-screen, in hidden tabs, or when disabled.
  const sync = () => {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = 0;
    draw();
    if (control) {
      control.hidden = false;
      control.setAttribute('aria-pressed', String(isEnabled));
    }
    if (isVisible && !document.hidden && isEnabled) {
      lastFrameTime = performance.now();
      animationFrameId = requestAnimationFrame(tick);
    }
  };

  // Cap resolution to avoid excessive canvas work on high-density displays.
  new ResizeObserver(() => {
    const bounds = canvas.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    const scale = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0);
    sync();
  }).observe(canvas);

  new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
    sync();
  }).observe(canvas);

  new MutationObserver(draw).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  control?.addEventListener('click', () => {
    isEnabled = !isEnabled;
    sync();
  });
  motion.addEventListener('change', () => {
    isEnabled = !motion.matches;
    sync();
  });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', draw);
  document.addEventListener('visibilitychange', sync);
}

initialiseHeroCanvas();
