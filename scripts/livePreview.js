/**
 * Живое автовоспроизводящееся превью проекта на HTML5 Canvas (заменяет тяжелые GIF/видео).
 */
export function mountLivePreview(canvas, project) {
  if (!canvas) return () => {};
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const w = canvas.clientWidth || 320;
  const h = canvas.clientHeight || 168;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);

  const color = project.accent || '#f4f4f6';
  const mode = project.previewMode || 'orbital';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let raf = 0;
  let isVisible = !document.hidden;
  const start = performance.now();

  const drawFrame = (now) => {
    if (!isVisible && !reduced) {
      raf = 0;
      return;
    }
    const t = reduced ? 1.2 : (now - start) * 0.001;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#070709';
    ctx.fillRect(0, 0, w, h);

    // Subtle scan grid
    ctx.strokeStyle = 'rgba(255,255,255,0.035)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 24) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 24) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const cx = w / 2;
    const cy = h / 2;

    if (mode === 'orbital') {
      ctx.strokeStyle = `${color}44`;
      ctx.beginPath();
      ctx.arc(cx, cy, 52, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = `${color}88`;
      ctx.beginPath();
      ctx.arc(cx, cy, 30, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fill();

      const sx = cx + Math.cos(t * 1.4) * 52;
      const sy = cy + Math.sin(t * 1.4) * 52;
      ctx.fillStyle = '#f2f4f8';
      ctx.beginPath();
      ctx.arc(sx, sy, 4, 0, Math.PI * 2);
      ctx.fill();

      // Thrust vector
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx - Math.sin(t * 1.4) * 18, sy + Math.cos(t * 1.4) * 18);
      ctx.stroke();
    } else if (mode === 'vision') {
      const bx = cx + Math.sin(t * 1.1) * 65 - 32;
      const by = cy + Math.cos(t * 0.85) * 28 - 22;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(bx, by, 64, 44);
      ctx.fillStyle = `${color}22`;
      ctx.fillRect(bx, by, 64, 44);
      ctx.fillStyle = color;
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`TARGET 0.98`, bx, by - 6);

      // Scan line
      const sy = ((t * 50) % h);
      ctx.strokeStyle = `${color}55`;
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.lineTo(w, sy);
      ctx.stroke();
    } else if (mode === 'drone') {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let x = 16; x < w - 16; x += 6) {
        const y = cy + Math.sin(x * 0.03 + t * 2.5) * 22 + Math.cos(x * 0.015 - t) * 10;
        if (x === 16) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      const dx = cx;
      const dy = cy + Math.sin(dx * 0.03 + t * 2.5) * 22 + Math.cos(dx * 0.015 - t) * 10;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(dx, dy, 5, 0, Math.PI * 2);
      ctx.fill();
    } else if (mode === 'telemetry' || mode === 'schedule') {
      const cols = 8;
      const bw = (w - 64) / cols;
      for (let i = 0; i < cols; i++) {
        const val = 24 + Math.abs(Math.sin(t * 1.6 + i * 0.7)) * 68;
        ctx.fillStyle = i % 2 === 0 ? `${color}88` : 'rgba(255,255,255,0.18)';
        ctx.fillRect(32 + i * bw + 4, h - 24 - val, bw - 8, val);
      }
    } else if (mode === 'network') {
      const pts = [
        [cx - 85, cy - 28],
        [cx - 85, cy + 28],
        [cx, cy],
        [cx + 85, cy - 26],
        [cx + 85, cy + 26],
      ];
      ctx.strokeStyle = `${color}55`;
      ctx.lineWidth = 1.3;
      [0, 1].forEach((i) => {
        ctx.beginPath();
        ctx.moveTo(pts[i][0], pts[i][1]);
        ctx.lineTo(pts[2][0], pts[2][1]);
        ctx.stroke();
      });
      [3, 4].forEach((i) => {
        ctx.beginPath();
        ctx.moveTo(pts[2][0], pts[2][1]);
        ctx.lineTo(pts[i][0], pts[i][1]);
        ctx.stroke();
      });
      const p = (t * 0.9) % 1;
      const px = pts[0][0] + (pts[2][0] - pts[0][0]) * p;
      const py = pts[0][1] + (pts[2][1] - pts[0][1]) * p;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();

      pts.forEach(([x, y], idx) => {
        ctx.fillStyle = idx === 2 ? color : '#13161d';
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x, y, idx === 2 ? 10 : 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
    } else {
      // runner / binary
      const offset = (t * 60) % 40;
      ctx.strokeStyle = `${color}44`;
      for (let i = -1; i < 10; i++) {
        const x = i * 40 - offset;
        ctx.beginPath();
        ctx.moveTo(x, h - 20);
        ctx.lineTo(x + 60, 20);
        ctx.stroke();
      }
      ctx.fillStyle = color;
      ctx.fillRect(cx - 12, cy - 12 + Math.sin(t * 4) * 14, 24, 24);
    }

    // Live badge
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(16, 16, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(242, 244, 248, 0.75)';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText('LIVE SIMULATION', 25, 19);

    if (!reduced && isVisible) {
      raf = requestAnimationFrame(drawFrame);
    } else {
      raf = 0;
    }
  };

  const onVisibilityChange = () => {
    isVisible = !document.hidden;
    if (isVisible && !reduced && !raf) {
      raf = requestAnimationFrame(drawFrame);
    }
  };

  document.addEventListener('visibilitychange', onVisibilityChange);
  raf = requestAnimationFrame(drawFrame);
  return () => {
    cancelAnimationFrame(raf);
    document.removeEventListener('visibilitychange', onVisibilityChange);
  };
}
