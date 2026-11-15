import gsap from 'https://esm.sh/gsap@3.12.5';
import Lenis from 'https://esm.sh/lenis@1.1.18';

// Fixed-width hex glyphs prevent layout shift / jumping width during monospace decode
const CHARS = '0123456789ABCDEF';
const isReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenisInstance = null;

/**
 * Плавный инерционный скролл Lenis, интегрированный с GSAP ticker.
 */
export function initLenisScroll() {
  if (isReducedMotion()) return null;

  try {
    lenisInstance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      prevent: (node) =>
        Boolean(node?.closest?.('.hub-drawer, .profile-intro-drawer, .node-preview-card, dialog')),
    });

    gsap.ticker.add((time) => {
      lenisInstance?.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return lenisInstance;
  } catch (err) {
    console.warn('[Lenis] Initialization error:', err);
    return null;
  }
}

export function getLenis() {
  return lenisInstance;
}

/**
 * Безопасно находит целевой текстовый узел внутри элемента, игнорируя SVG и Canvas.
 */
function findTargetTextNode(node) {
  if (!node || !node.childNodes) return null;
  const TEXT_NODE = typeof Node !== 'undefined' ? Node.TEXT_NODE : 3;
  const ELEMENT_NODE = typeof Node !== 'undefined' ? Node.ELEMENT_NODE : 1;

  for (const child of node.childNodes) {
    if (child.nodeType === TEXT_NODE && child.nodeValue && child.nodeValue.trim().length > 0) {
      return child;
    }
  }

  for (const child of node.childNodes) {
    if (child.nodeType === ELEMENT_NODE) {
      const tag = (child.tagName || '').toLowerCase();
      if (['svg', 'path', 'circle', 'img', 'canvas', 'script', 'style'].includes(tag)) {
        continue;
      }
      const found = findTargetTextNode(child);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Спокойный и равномерный Scramble-эффект:
 * - Фиксирует ширину элемента и использует однородные символы (без смены размера и скачков)
 * - Подсвечивает только 2–3 ближайших символа на плавной скорости (шаг ~38ms), не мигая хаотично на 120Hz
 */
export function scrambleElement(el, { duration = 280, targetText = null } = {}) {
  if (!el || isReducedMotion()) return;

  const hasElementChildren = Boolean(el.children && el.children.length > 0);
  let textNode = findTargetTextNode(el);

  if (!textNode && hasElementChildren) {
    const container = el.querySelector?.('span:not(.status-dot), p, div, a') || el;
    if (typeof document !== 'undefined' && document.createTextNode) {
      textNode = document.createTextNode('');
      container.appendChild(textNode);
    }
  }

  const rawVal = textNode ? (textNode.nodeValue || '') : (el.textContent || '');
  const leadSpaces = (rawVal.match(/^\s*/) || [''])[0];
  const trailSpaces = (rawVal.match(/\s*$/) || [''])[0];
  const original = targetText ?? el.dataset?.scrambleText ?? rawVal.trim();
  if (el.dataset) {
    el.dataset.scrambleText = original;
  }

  if (el._scrambleRaf) {
    cancelAnimationFrame(el._scrambleRaf);
  }

  // Lock layout width briefly in browser environments so glyphs never shift surrounding controls
  let lockedPrevWidth = '';
  let lockedFontVariant = '';
  if (el.style && typeof el.getBoundingClientRect === 'function') {
    const w = el.getBoundingClientRect().width;
    if (w > 0) {
      lockedPrevWidth = el.style.minWidth || '';
      lockedFontVariant = el.style.fontVariantNumeric || '';
      el.style.minWidth = `${Math.ceil(w)}px`;
      el.style.fontVariantNumeric = 'tabular-nums';
    }
  }

  const start = performance.now();
  let lastStepAt = 0;
  const length = original.length;

  const restoreText = () => {
    if (textNode) {
      textNode.nodeValue = leadSpaces + original + trailSpaces;
    } else if (!hasElementChildren) {
      el.textContent = leadSpaces + original + trailSpaces;
    }
    if (el.style) {
      el.style.minWidth = lockedPrevWidth;
      el.style.fontVariantNumeric = lockedFontVariant;
    }
    el._scrambleRaf = null;
  };

  const frame = (now) => {
    const elapsed = now - start;
    const progress = Math.min(1, elapsed / duration);

    if (progress >= 1) {
      restoreText();
      return;
    }

    // Calm step cadence (~26 FPS) so characters stay legible and never shimmer chaotically
    if (now - lastStepAt >= 38) {
      lastStepAt = now;
      const revealedCount = Math.floor(progress * length);
      const waveLimit = Math.min(length, revealedCount + 3);

      let out = '';
      for (let i = 0; i < length; i++) {
        const ch = original[i];
        if (ch === ' ' || ch === '\n' || ch === '\t' || ch === '/' || ch === '.' || ch === '&') {
          out += ch;
        } else if (i < revealedCount || i >= waveLimit) {
          out += ch;
        } else {
          out += CHARS[(Math.floor(elapsed / 38) + i * 5) % CHARS.length];
        }
      }

      if (textNode) {
        textNode.nodeValue = leadSpaces + out + trailSpaces;
      } else if (!hasElementChildren) {
        el.textContent = leadSpaces + out + trailSpaces;
      }
    }

    el._scrambleRaf = requestAnimationFrame(frame);
  };

  el._scrambleRaf = requestAnimationFrame(frame);
}

/**
 * Запускает мягкую дешифровку при загрузке и при наведении на элементы с [data-scramble].
 */
export function initScrambleEffects() {
  if (isReducedMotion()) return;

  document.querySelectorAll('[data-scramble-on-load]').forEach((el, idx) => {
    setTimeout(() => scrambleElement(el, { duration: 300 }), idx * 80);
  });

  document.querySelectorAll('[data-scramble]').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      scrambleElement(el, { duration: 240 });
    });
  });
}

/**
 * Магнитные кнопки: мягко притягиваются к курсору и упруго возвращаются.
 */
export function initMagneticButtons() {
  if (isReducedMotion() || window.matchMedia('(pointer: coarse)').matches) {
    return () => {};
  }

  const bindMagnetic = (btn) => {
    if (!btn || btn.dataset.magneticBound) return;
    btn.dataset.magneticBound = 'true';

    const quickX = gsap.quickTo(btn, 'x', { duration: 0.3, ease: 'power3.out' });
    const quickY = gsap.quickTo(btn, 'y', { duration: 0.3, ease: 'power3.out' });
    let rect = null;

    btn.addEventListener('pointermove', (e) => {
      if (!rect) rect = btn.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      quickX(dx * 0.25);
      quickY(dy * 0.25);
    }, { passive: true });

    btn.addEventListener('pointerleave', () => {
      rect = null;
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.65,
        ease: 'elastic.out(1, 0.4)',
        overwrite: 'auto',
      });
    });
  };

  document.querySelectorAll('.magnetic').forEach(bindMagnetic);
  return bindMagnetic;
}
