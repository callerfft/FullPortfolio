/**
 * Сверхлёгкий динамический 3D-фон без WebGL и CSS filter:blur:
 * - Рендерится в низком внутреннем буфере (~340px по ширине), за счёт чего GPU-апскейл
 *   бесплатно создаёт мягкое кинематографичное размытие без полноэкранного blur-шейдера.
 * - Предзапечённые спрайты боке-сфер + 2 лёгких 3D-орбитальных контура с параллаксом за курсором.
 * - Автопауза при скролле к Bento-сетке, открытии кейса или сворачивании вкладки (~30 FPS).
 */
export function init3DBackground(canvas) {
  if (!canvas) return () => {};

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return () => {};

  const prefersReduced = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = Math.max(1, window.innerWidth || 1);
  let height = Math.max(1, window.innerHeight || 1);
  let bufW = 340;
  let bufH = 192;

  function updateBufferSize() {
    width = Math.max(1, window.innerWidth || 1);
    height = Math.max(1, window.innerHeight || 1);
    const scale = Math.min(0.26, 340 / Math.max(1, width));
    bufW = Math.max(160, Math.round(width * scale));
    bufH = Math.max(120, Math.round(height * scale));
    canvas.width = bufW;
    canvas.height = bufH;
  }

  // Pre-baked soft radial glowing sphere sprites (cached once)
  const orbSpriteCache = new Map();
  function getOrbSprite(rgbTuple) {
    let sprite = orbSpriteCache.get(rgbTuple);
    if (sprite) return sprite;
    const size = 96;
    const half = size / 2;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const g = c.getContext('2d');
    if (g) {
      const grad = g.createRadialGradient(half, half, 0, half, half, half);
      grad.addColorStop(0, `rgba(${rgbTuple}, 0.72)`);
      grad.addColorStop(0.32, `rgba(${rgbTuple}, 0.34)`);
      grad.addColorStop(0.68, `rgba(${rgbTuple}, 0.09)`);
      grad.addColorStop(1, `rgba(${rgbTuple}, 0)`);
      g.fillStyle = grad;
      g.fillRect(0, 0, size, size);
    }
    orbSpriteCache.set(rgbTuple, c);
    return c;
  }

  // Deep matte monochrome smoked mist orbs (Monolith Ghost)
  const orbs = [
    { bx: -0.92, by: -0.5, bz: -0.35, radius: 0.48, color: '255, 255, 255', alpha: 0.11, speed: 0.18, phase: 0.2 },
    { bx: 0.88, by: 0.45, bz: 0.25, radius: 0.52, color: '161, 161, 170', alpha: 0.13, speed: -0.15, phase: 1.7 },
    { bx: -0.52, by: 0.65, bz: 0.48, radius: 0.44, color: '113, 113, 122', alpha: 0.14, speed: 0.13, phase: 3.1 },
    { bx: 0.62, by: -0.62, bz: -0.45, radius: 0.4, color: '212, 212, 216', alpha: 0.09, speed: -0.17, phase: 4.4 },
    { bx: 0.04, by: 0.04, bz: -0.6, radius: 0.62, color: '255, 255, 255', alpha: 0.06, speed: 0.09, phase: 2.5 },
  ];

  // Lightweight 3D projected ring helper (28 segments)
  const RING_SEGMENTS = 28;
  const ringAngles = Array.from({ length: RING_SEGMENTS + 1 }, (_, i) => (i / RING_SEGMENTS) * Math.PI * 2);

  function projectRing(radius, tiltX, tiltY, spinZ, fov) {
    const cosX = Math.cos(tiltX);
    const sinX = Math.sin(tiltX);
    const cosY = Math.cos(tiltY);
    const sinY = Math.sin(tiltY);
    const minDim = Math.min(bufW, bufH);

    ctx.beginPath();
    for (let i = 0; i <= RING_SEGMENTS; i++) {
      const a = ringAngles[i] + spinZ;
      const lx = Math.cos(a) * radius;
      const ly = Math.sin(a) * radius * 0.72;
      const lz = Math.sin(a * 2) * 0.12;

      // Rotate Y then X
      const rx = lx * cosY - lz * sinY;
      const rz1 = lx * sinY + lz * cosY;
      const ry = ly * cosX - rz1 * sinX;
      const rz = ly * sinX + rz1 * cosX;

      const persp = fov / (fov + rz + 2.4);
      const sx = bufW * 0.5 + rx * minDim * 0.48 * persp;
      const sy = bufH * 0.5 + ry * minDim * 0.48 * persp;

      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
  }

  let targetRotX = 0;
  let targetRotY = 0;
  let rotX = 0;
  let rotY = 0;
  let rafId = 0;
  let lastRenderTime = 0;
  let isActive = false;

  function shouldRender() {
    if (document.hidden) return false;
    if (!document.body.classList.contains('canvas-active')) return false;
    if ((window.scrollY || 0) > Math.max(1, height) * 0.85) return false;
    return true;
  }

  function syncLoopState() {
    isActive = shouldRender();
    if (isActive && !rafId) {
      lastRenderTime = 0;
      rafId = requestAnimationFrame(animate);
    }
  }

  function onPointerMove(e) {
    if (prefersReduced()) return;
    const nx = e.clientX / Math.max(1, width) - 0.5;
    const ny = e.clientY / Math.max(1, height) - 0.5;
    targetRotY = nx * 0.55;
    targetRotX = ny * 0.45;
  }

  function onResize() {
    updateBufferSize();
    syncLoopState();
  }

  const classObserver = new MutationObserver(syncLoopState);
  classObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('scroll', syncLoopState, { passive: true });
  document.addEventListener('visibilitychange', syncLoopState);

  function animate(now = performance.now()) {
    if (!isActive) {
      rafId = 0;
      return;
    }

    // Cap at ~30 FPS for soft background ambient motion
    if (now - lastRenderTime < 32) {
      rafId = requestAnimationFrame(animate);
      return;
    }
    lastRenderTime = now;

    const t = prefersReduced() ? 0 : now * 0.0005;
    rotX += (targetRotX - rotX) * 0.06;
    rotY += (targetRotY - rotY) * 0.06;

    ctx.clearRect(0, 0, bufW, bufH);

    const cosY = Math.cos(rotY + t * 0.14);
    const sinY = Math.sin(rotY + t * 0.14);
    const cosX = Math.cos(rotX + Math.sin(t * 0.25) * 0.12);
    const sinX = Math.sin(rotX + Math.sin(t * 0.25) * 0.12);
    const minDim = Math.min(bufW, bufH);

    // Draw blurred 3D bokeh depth spheres
    for (let i = 0; i < orbs.length; i++) {
      const o = orbs[i];
      const orbitA = t * o.speed + o.phase;
      const x0 = o.bx + Math.cos(orbitA) * 0.18;
      const y0 = o.by + Math.sin(orbitA * 0.85) * 0.14;
      const z0 = o.bz;

      const x1 = x0 * cosY - z0 * sinY;
      const z1 = x0 * sinY + z0 * cosY;
      const y1 = y0 * cosX - z1 * sinX;
      const z2 = y0 * sinX + z1 * cosX;

      const persp = 2.6 / (2.6 + z2 + 1.1);
      const sx = bufW * 0.5 + x1 * bufW * 0.36 * persp;
      const sy = bufH * 0.5 + y1 * bufH * 0.38 * persp;
      const sr = o.radius * minDim * 0.62 * persp;

      ctx.globalAlpha = o.alpha;
      ctx.drawImage(getOrbSprite(o.color), sx - sr, sy - sr, sr * 2, sr * 2);
    }

    // Subtle monochrome architectural gyroscope rings in depth
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = '#f4f4f6';
    ctx.lineWidth = 0.85;
    projectRing(1.08, rotX + 0.45, rotY + t * 0.16, t * 0.2, 2.8);

    ctx.globalAlpha = 0.1;
    ctx.strokeStyle = '#a1a1aa';
    ctx.lineWidth = 0.75;
    projectRing(0.76, -rotX + 0.95, rotY - t * 0.18, -t * 0.26, 2.8);

    ctx.globalAlpha = 0.07;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.65;
    projectRing(1.36, rotX * 0.6 + 1.25, rotY + 0.4, t * 0.11, 3.1);

    ctx.globalAlpha = 1;
    rafId = requestAnimationFrame(animate);
  }

  updateBufferSize();
  isActive = shouldRender();
  if (isActive) {
    rafId = requestAnimationFrame(animate);
  }

  return function destroy() {
    cancelAnimationFrame(rafId);
    classObserver.disconnect();
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('scroll', syncLoopState);
    document.removeEventListener('visibilitychange', syncLoopState);
    orbSpriteCache.clear();
  };
}
