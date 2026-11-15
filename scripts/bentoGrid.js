import { HUBS } from '../data/projects.js';
import { renderCoverSvg } from './covers.js';

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * Инициализация Bento-сетки проектов с эффектом матового стекла,
 * подсветкой границ в стиле Linear и фильтрацией по направлениям.
 */
export function initBentoGrid(container, projects, callbacks = {}) {
  if (!container || !Array.isArray(projects)) return;

  const projectMap = new Map(projects.map((p) => [p.id, p]));

  function pluralizeProjects(n) {
    if (n === 1) return 'проект';
    if (n >= 2 && n <= 4) return 'проекта';
    return 'проектов';
  }

  function renderProjectCards(activeHubFilter) {
    const visibleProjects =
      activeHubFilter === 'all'
        ? projects
        : projects.filter((p) => p.hubs.includes(activeHubFilter));

    return visibleProjects
      .map((p) => {
        const mediaHtml =
          p.screenshots && p.screenshots.length > 0
            ? `<img class="bento-screenshot" src="${escapeHtml(p.screenshots[0].src)}" alt="${escapeHtml(p.title)}" loading="lazy" decoding="async">`
            : renderCoverSvg(p, 'bento-cover-svg');

        return `
          <article class="bento-card bento-span-4" data-project-id="${p.id}" style="--project-accent: ${p.accent};">
            <div class="bento-media">
              <div class="bento-cover-wrap">
                ${mediaHtml}
              </div>
              <div class="bento-badge-group">
                <span class="bento-cat-badge" style="color: ${p.accent};">${escapeHtml(p.categoryLabel)}</span>
                <span class="bento-year-badge">${escapeHtml(p.year)}</span>
              </div>
            </div>

            <div class="bento-body">
              <h3 class="bento-title">
                <a href="#project/${p.id}" class="bento-card-link card-link" data-project-id="${p.id}">
                  ${escapeHtml(p.title)}
                </a>
              </h3>
              <p class="bento-tagline">${escapeHtml(p.tagline)}</p>
            </div>
          </article>
        `;
      })
      .join('');
  }

  function renderStackCards(activeHubFilter) {
    const targetHubs =
      activeHubFilter === 'all' ? HUBS : HUBS.filter((h) => h.id === activeHubFilter);

    const cards = [];
    for (const hub of targetHubs) {
      for (const st of hub.techStacks || []) {
        const linkedProjects = (st.projects || [])
          .map((pid) => projectMap.get(pid))
          .filter(Boolean);

        const projectButtonsHtml = linkedProjects
          .map(
            (p) => `
              <button type="button" class="bento-stack-project-btn" data-project-id="${p.id}">
                <span>${escapeHtml(p.title)}</span>
                <span class="bento-stack-project-meta">${escapeHtml(p.year)}</span>
              </button>
            `,
          )
          .join('');

        cards.push(`
          <article class="bento-card bento-span-4 bento-card-stack" data-stack-name="${escapeHtml(st.name)}" style="--project-accent: ${hub.color};">
            <div class="bento-stack-head">
              <span class="bento-cat-badge" style="color: ${hub.color};">${escapeHtml(hub.label)}</span>
              <span class="bento-year-badge">${linkedProjects.length} ${pluralizeProjects(linkedProjects.length)}</span>
            </div>

            <div class="bento-body">
              <h3 class="bento-title">${escapeHtml(st.name)}</h3>
              <div class="bento-stack-projects">${projectButtonsHtml}</div>
            </div>
          </article>
        `);
      }
    }
    return cards.join('');
  }

  let currentMode = 'projects';
  const render = (activeHubFilter = 'all', viewMode = currentMode) => {
    currentMode = viewMode === 'stacks' ? 'stacks' : 'projects';
    container.innerHTML =
      currentMode === 'stacks'
        ? renderStackCards(activeHubFilter)
        : renderProjectCards(activeHubFilter);
  };

  // Delegated Linear Spotlight & Click (single listener set regardless of filter changes)
  let activeHoverCard = null;
  let pointerRaf = 0;
  let lastPointerEvent = null;

  container.addEventListener('pointermove', (e) => {
    const card = e.target.closest('.bento-card');
    if (!card) return;
    if (activeHoverCard && activeHoverCard !== card) {
      activeHoverCard.style.setProperty('--mouse-x', '-999px');
      activeHoverCard.style.setProperty('--mouse-y', '-999px');
    }
    activeHoverCard = card;
    lastPointerEvent = e;
    if (pointerRaf) return;
    pointerRaf = requestAnimationFrame(() => {
      pointerRaf = 0;
      if (!activeHoverCard || !lastPointerEvent) return;
      const rect = activeHoverCard.getBoundingClientRect();
      const x = lastPointerEvent.clientX - rect.left;
      const y = lastPointerEvent.clientY - rect.top;
      activeHoverCard.style.setProperty('--mouse-x', `${Math.round(x)}px`);
      activeHoverCard.style.setProperty('--mouse-y', `${Math.round(y)}px`);
    });
  }, { passive: true });

  container.addEventListener('pointerleave', () => {
    if (pointerRaf) {
      cancelAnimationFrame(pointerRaf);
      pointerRaf = 0;
    }
    if (activeHoverCard) {
      activeHoverCard.style.setProperty('--mouse-x', '-999px');
      activeHoverCard.style.setProperty('--mouse-y', '-999px');
      activeHoverCard = null;
    }
  });

  container.addEventListener('click', (e) => {
    const stackJumpBtn = e.target.closest('[data-select-stack-hub]');
    if (stackJumpBtn && callbacks.onSelectStack) {
      e.preventDefault();
      callbacks.onSelectStack(
        stackJumpBtn.dataset.selectStackHub,
        stackJumpBtn.dataset.selectStackName,
      );
      return;
    }

    const targetBtn = e.target.closest('[data-project-id]');
    const cardLink = e.target.closest('.bento-card-link');
    if (targetBtn || cardLink) {
      e.preventDefault();
      const pId = (targetBtn || cardLink).dataset.projectId;
      if (pId && callbacks.onSelectProject) {
        callbacks.onSelectProject(pId);
      }
    }
  });

  render('all', 'projects');
  return { render };
}
