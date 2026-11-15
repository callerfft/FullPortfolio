import { HUBS, PROJECTS, RESUME_DATA } from '../data/projects.js';
import { renderCoverSvg } from './covers.js';
import { createGraphCanvas } from './graphCanvas.js';
import { mountLivePreview } from './livePreview.js';
import {
  initMagneticButtons,
  initScrambleEffects,
  initLenisScroll,
  getLenis,
  scrambleElement,
} from './effects.js';
import { init3DBackground } from './background3d.js';
import { initBentoGrid } from './bentoGrid.js';

const state = {
  activeProjectId: null,
  previewProjectId: null,
  previewStackTarget: null,
  activeHubId: null,
  activeStackFilter: null,
  bentoFilter: 'all',
  viewMode: 'projects', // 'projects' | 'stacks'
  showAll: false,
  introDismissed: false,
};

const dom = {
  canvasView: document.getElementById('canvas-view'),
  canvasIntro: document.querySelector('.canvas-intro'),
  floatingCloseBtn: document.getElementById('floating-close-btn'),
  bentoShowcase: document.getElementById('bento-showcase'),
  bentoGrid: document.getElementById('bento-grid'),
  bentoFilterBar: document.getElementById('bento-filter-bar'),
  bentoEyebrow: document.getElementById('bento-eyebrow'),
  bentoHeadline: document.getElementById('bento-headline'),
  canvasHeading: document.getElementById('canvas-heading'),
  viewModeSwitch: document.getElementById('view-mode-switch'),
  bg3dCanvas: document.getElementById('bg-3d-canvas'),
  detailView: document.getElementById('detail-view'),
  detailContent: document.getElementById('detail-content'),
  graphCanvas: document.getElementById('graph-canvas'),
  previewCard: document.getElementById('node-preview-card'),
  livePreviewCanvas: document.getElementById('live-preview-canvas'),
  previewCategory: document.getElementById('preview-category'),
  previewYear: document.getElementById('preview-year'),
  previewTitle: document.getElementById('preview-title'),
  previewTagline: document.getElementById('preview-tagline'),
  previewStack: document.getElementById('preview-stack'),
  previewHubs: document.getElementById('preview-hubs'),
  previewCloseBtn: document.getElementById('preview-close-btn'),
  openCaseBtn: document.getElementById('open-case-btn'),
  toggleAllBtn: document.getElementById('toggle-all-btn'),
  scrollToBento: document.getElementById('scroll-to-bento'),
  profileIntro: document.getElementById('profile-intro-drawer'),
  dismissIntroBtn: document.getElementById('dismiss-intro-btn'),
  introResumeBtn: document.getElementById('intro-resume-btn'),
  hubDrawer: document.getElementById('hub-drawer'),
  hubDrawerBadge: document.getElementById('hub-drawer-badge'),
  hubDrawerCount: document.getElementById('hub-drawer-count'),
  hubDrawerTitle: document.getElementById('hub-drawer-title'),
  hubDrawerDesc: document.getElementById('hub-drawer-desc'),
  hubStacksSection: document.getElementById('hub-stacks-section'),
  hubDrawerStacks: document.getElementById('hub-drawer-stacks'),
  hubDrawerProjects: document.getElementById('hub-drawer-projects'),
  closeHubDrawerBtn: document.getElementById('close-hub-drawer-btn'),
  navHint: document.getElementById('canvas-nav-hint'),
  backBtn: document.getElementById('back-to-graph-btn'),
  prevBtn: document.getElementById('prev-project-btn'),
  nextBtn: document.getElementById('next-project-btn'),
  brandLink: document.getElementById('brand-link'),
  contactDialog: document.getElementById('contact-dialog'),
  openContactBtn: document.getElementById('open-contact-btn'),
  closeContactBtn: document.getElementById('close-contact-btn'),
  resumeDialog: document.getElementById('resume-dialog'),
  openResumeBtn: document.getElementById('open-resume-btn'),
  closeResumeBtn: document.getElementById('close-resume-btn'),
  resumeAvailability: document.getElementById('resume-availability'),
  resumeRole: document.getElementById('resume-role'),
  resumeSummary: document.getElementById('resume-summary'),
  resumeSections: document.getElementById('resume-sections'),
  resumeFooter: document.getElementById('resume-footer'),
  screenshotDialog: document.getElementById('screenshot-dialog'),
  screenshotDialogImg: document.getElementById('screenshot-dialog-img'),
  screenshotDialogCaption: document.getElementById('screenshot-dialog-caption'),
  closeScreenshotBtn: document.getElementById('close-screenshot-btn'),
};

const supportsViewTransitions = typeof document.startViewTransition === 'function';
const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let graph = null;
let bentoApi = null;
let unmountLivePreview = () => {};

function syncFloatingCloseBtn() {
  if (!dom.floatingCloseBtn) return;
  const hasOpenPanel = Boolean(
    state.activeHubId || state.previewProjectId || state.previewStackTarget,
  );
  dom.floatingCloseBtn.hidden = state.activeProjectId !== null || !hasOpenPanel;
}

function syncCanvasIntroBackdrop() {
  if (!dom.canvasIntro) return;
  const isDetailOpen = state.activeProjectId !== null;
  const threshold = Math.max(120, window.innerHeight * 0.45);
  const scrolledOverBento = !isDetailOpen && (window.scrollY || 0) > threshold;
  dom.canvasIntro.classList.toggle('has-backdrop', scrolledOverBento);
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function pluralizeProjects(n) {
  if (n === 1) return 'проект';
  if (n >= 2 && n <= 4) return 'проекта';
  return 'проектов';
}

/* ==========================================================================
   Profile Intro & Hub Drawer (Stacks + Projects)
   ========================================================================== */

function dismissIntro() {
  if (state.introDismissed) return;
  state.introDismissed = true;
  dom.profileIntro?.classList.add('is-dismissed');
}

function openIntro() {
  state.introDismissed = false;
  dom.profileIntro?.classList.remove('is-dismissed');
}

function renderHubDrawerContent(hub) {
  const allCategoryProjects = PROJECTS.filter((p) => p.hubs.includes(hub.id));
  const stacks = hub.techStacks || [];

  // Render interactive tech stack chips for the hub
  if (dom.hubStacksSection && dom.hubDrawerStacks) {
    dom.hubStacksSection.hidden = stacks.length === 0;
    dom.hubDrawerStacks.innerHTML = stacks
      .map((st) => {
        const isSelected = state.activeStackFilter === st.name;
        return `
          <button
            type="button"
            class="stack-chip ${isSelected ? 'is-active' : ''}"
            data-stack-name="${escapeHtml(st.name)}"
            aria-pressed="${isSelected ? 'true' : 'false'}"
            style="--hub-color: ${hub.color};"
          >
            <span>${escapeHtml(st.name)}</span>
            <span class="stack-chip-count">${st.projects.length}</span>
          </button>
        `;
      })
      .join('');
  }

  // Filter projects if a stack chip is selected
  let displayedProjects = allCategoryProjects;
  if (state.activeStackFilter) {
    const matchedStack = stacks.find((s) => s.name === state.activeStackFilter);
    if (matchedStack) {
      displayedProjects = allCategoryProjects.filter((p) =>
        matchedStack.projects.includes(p.id),
      );
    }
  }

  dom.hubDrawerCount.textContent = `${displayedProjects.length} ${pluralizeProjects(displayedProjects.length)}`;

  dom.hubDrawerProjects.innerHTML = displayedProjects
    .map(
      (p) => `
      <div class="hub-project-item" data-project-id="${p.id}">
        <div class="hub-project-item-title">
          <span>${escapeHtml(p.title)}</span>
          <span style="font-size: 0.72rem; color: ${p.accent};">${escapeHtml(p.categoryLabel)}</span>
        </div>
        <div class="hub-project-item-tagline">${escapeHtml(p.tagline)}</div>
        <div class="preview-tags">
          ${p.stack.slice(0, 5).map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
        </div>
      </div>
    `,
    )
    .join('');
}

function openHubDrawer(hubId) {
  const hub = HUBS.find((h) => h.id === hubId);
  if (!hub || !dom.hubDrawer) return;

  state.activeHubId = hubId;
  state.activeStackFilter = null;

  dom.hubDrawerBadge.textContent = hub.label;
  dom.hubDrawerBadge.style.borderColor = `${hub.color}88`;
  dom.hubDrawerBadge.style.color = hub.color;
  dom.hubDrawerTitle.textContent = hub.label;
  dom.hubDrawerDesc.textContent = hub.description || hub.subtitle;

  renderHubDrawerContent(hub);

  dom.hubDrawer.hidden = false;
  void dom.hubDrawer.offsetWidth;
  dom.hubDrawer.classList.add('is-open');

  dismissIntro();
  graph?.clearSelection();
  syncFloatingCloseBtn();
}

function closeHubDrawer() {
  if (!dom.hubDrawer || !state.activeHubId) return;
  state.activeHubId = null;
  state.activeStackFilter = null;
  syncFloatingCloseBtn();
  dom.hubDrawer.classList.remove('is-open');
  setTimeout(() => {
    if (!state.activeHubId && dom.hubDrawer) {
      dom.hubDrawer.hidden = true;
    }
  }, 380);
}

/* ==========================================================================
   Resume Modal
   ========================================================================== */

function renderResumeModal() {
  if (!dom.resumeDialog) return;
  dom.resumeAvailability.textContent = RESUME_DATA.availability;
  dom.resumeRole.textContent = RESUME_DATA.role;
  dom.resumeSummary.textContent = RESUME_DATA.summary;

  dom.resumeSections.innerHTML = RESUME_DATA.sections
    .map(
      (sec) => `
      <div class="resume-block">
        <div class="resume-block-title">${escapeHtml(sec.title)}</div>
        <div class="resume-block-tags">
          ${sec.items.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join('')}
        </div>
      </div>
    `,
    )
    .join('');

  const links = RESUME_DATA.links || {};
  const linksHtml = [
    links.github &&
      `<a href="${escapeHtml(links.github)}" target="_blank" rel="noopener noreferrer" class="btn btn-subtle btn-sm">GitHub</a>`,
    links.linkedin &&
      `<a href="${escapeHtml(links.linkedin)}" target="_blank" rel="noopener noreferrer" class="btn btn-subtle btn-sm">LinkedIn</a>`,
    links.telegram &&
      `<a href="${escapeHtml(links.telegram)}" target="_blank" rel="noopener noreferrer" class="btn btn-subtle btn-sm">Telegram</a>`,
    links.email &&
      `<a href="mailto:${escapeHtml(links.email)}" class="btn btn-subtle btn-sm">${escapeHtml(links.email)}</a>`,
  ]
    .filter(Boolean)
    .join('');

  const pdfActionHtml = RESUME_DATA.pdfUrl
    ? `<a href="${escapeHtml(RESUME_DATA.pdfUrl)}" download class="btn btn-primary btn-sm">Скачать PDF-резюме</a>`
    : `<span class="resume-slot-note">PDF можно подключить в <code>RESUME_DATA.pdfUrl</code></span>`;

  dom.resumeFooter.innerHTML = `
    <div class="resume-footer-links">${linksHtml}</div>
    ${pdfActionHtml}
  `;
}

/* ==========================================================================
   Bento Filter Bar
   ========================================================================== */

function renderBentoFilters() {
  if (!dom.bentoFilterBar) return;
  const items = [{ id: 'all', label: 'Все', color: '#c8ff32' }, ...HUBS];
  dom.bentoFilterBar.innerHTML = items
    .map(
      (item) => `
      <button
        type="button"
        class="bento-filter-btn ${state.bentoFilter === item.id ? 'is-active' : ''}"
        data-bento-filter="${item.id}"
        aria-pressed="${state.bentoFilter === item.id ? 'true' : 'false'}"
        style="--filter-accent: ${item.color};"
      >${escapeHtml(item.label)}</button>
    `,
    )
    .join('');
}

function focusStackInHub(hubId, stackName) {
  graph?.clearSelection();
  if (graph?.getActiveHubId?.() !== hubId) {
    graph?.selectHub(hubId);
  } else {
    openHubDrawer(hubId);
  }
  state.activeStackFilter = stackName;
  const hub = HUBS.find((h) => h.id === hubId);
  if (hub) renderHubDrawerContent(hub);
}

function setViewMode(nextMode) {
  const normalized = nextMode === 'stacks' ? 'stacks' : 'projects';
  if (state.viewMode === normalized) return;
  state.viewMode = normalized;

  if (state.activeProjectId !== null) {
    closeProjectDetail();
  }

  dom.viewModeSwitch?.querySelectorAll('[data-view-mode]').forEach((btn) => {
    const isMatch = btn.dataset.viewMode === normalized;
    btn.classList.toggle('is-active', isMatch);
    btn.setAttribute('aria-pressed', String(isMatch));
  });

  const accentWord = dom.canvasHeading?.querySelector('.accent-word');
  if (accentWord) {
    const nextWord = normalized === 'stacks' ? 'стеки' : 'проекты';
    accentWord.textContent = nextWord;
    scrambleElement(accentWord, { duration: 240, targetText: nextWord });
  } else if (dom.canvasHeading) {
    dom.canvasHeading.innerHTML =
      normalized === 'stacks'
        ? 'Направления и <span class="accent-word" data-scramble>стеки</span>'
        : 'Направления и <span class="accent-word" data-scramble>проекты</span>';
  }
  if (dom.bentoEyebrow) {
    dom.bentoEyebrow.textContent = normalized === 'stacks' ? 'Tech Stack Map' : 'Projects Showcase';
  }
  if (dom.bentoHeadline) {
    const nextHeadline = normalized === 'stacks' ? 'Технологии и стеки' : 'Проекты';
    dom.bentoHeadline.textContent = nextHeadline;
    scrambleElement(dom.bentoHeadline, { duration: 240, targetText: nextHeadline });
  }

  graph?.setMode(normalized);
  bentoApi?.render(state.bentoFilter, normalized);
  syncCanvasIntroBackdrop();
}

/* ==========================================================================
   Adaptive Navigation Hint Controller
   ========================================================================== */

function initNavHintManager(hintEl, idleMs = 2800) {
  if (!hintEl) return;
  let timer = null;

  const onActive = () => {
    hintEl.classList.add('is-hidden');
    hintEl.classList.remove('is-pulsing');
    clearTimeout(timer);
    timer = setTimeout(() => {
      hintEl.classList.remove('is-hidden');
      hintEl.classList.add('is-pulsing');
    }, idleMs);
  };

  ['pointerdown', 'pointermove', 'wheel', 'touchstart', 'keydown'].forEach((evt) => {
    window.addEventListener(evt, onActive, { passive: true });
  });

  timer = setTimeout(() => {
    hintEl.classList.remove('is-hidden');
    hintEl.classList.add('is-pulsing');
  }, 1000);
}

/* ==========================================================================
   Preview Card & Details View
   ========================================================================== */

function positionPreviewCard(screenPos) {
  if (!screenPos || dom.previewCard.hidden) return;
  if (window.innerWidth <= 767) return;
  const cardW = Math.min(340, window.innerWidth - 32);
  const cardH = dom.previewCard.offsetHeight || 360;
  const pad = 16;
  const topSafe = 86;

  let x = screenPos.x + 26;
  if (x + cardW > window.innerWidth - pad) {
    x = screenPos.x - cardW - 26;
  }
  x = Math.max(pad, Math.min(window.innerWidth - cardW - pad, x));

  let y = screenPos.y - cardH * 0.4;
  y = Math.max(topSafe, Math.min(window.innerHeight - cardH - 76, y));

  dom.previewCard.style.setProperty('--px', `${Math.round(x)}px`);
  dom.previewCard.style.setProperty('--py', `${Math.round(y)}px`);
}

function showPreviewCard(item, screenPos) {
  unmountLivePreview();
  if (!item) {
    state.previewProjectId = null;
    state.previewStackTarget = null;
    dom.previewCard.hidden = true;
    syncFloatingCloseBtn();
    return;
  }

  if (item.nodeKind === 'stack') {
    const hub = HUBS.find((h) => h.id === item.hubId);
    const linkedProjects = (item.projectIds || [])
      .map((id) => PROJECTS.find((p) => p.id === id))
      .filter(Boolean);

    state.previewProjectId = null;
    state.previewStackTarget = { hubId: item.hubId, stackName: item.title };

    dom.previewCategory.textContent = `${hub?.label || item.hubId} · Стек`;
    dom.previewCategory.style.color = item.accent;
    dom.previewYear.textContent = `${linkedProjects.length} ${pluralizeProjects(linkedProjects.length)}`;
    dom.previewTitle.textContent = item.title;
    const countPhrase =
      linkedProjects.length === 1 ? '1 проекте' : `${linkedProjects.length} проектах`;
    dom.previewTagline.textContent = `Применяется в ${countPhrase}. Выберите кейс или отфильтруйте в панели:`;

    dom.previewStack.innerHTML = linkedProjects
      .map(
        (p) =>
          `<button type="button" class="tag preview-project-jump" data-jump-project="${p.id}">${escapeHtml(p.title)}</button>`,
      )
      .join('');

    dom.previewHubs.innerHTML = (item.hubs || [])
      .map((hId) => {
        const hObj = HUBS.find((h) => h.id === hId);
        if (!hObj) return '';
        return `<span class="hub-pill" style="border-color: ${hObj.color}55; color: ${hObj.color};">${escapeHtml(hObj.label)}</span>`;
      })
      .join('');

    if (dom.openCaseBtn) {
      dom.openCaseBtn.textContent = `Открыть в хабе (${linkedProjects.length})`;
    }

    dom.previewCard.hidden = false;
    syncFloatingCloseBtn();
    positionPreviewCard(screenPos);
    unmountLivePreview = mountLivePreview(dom.livePreviewCanvas, {
      title: item.title,
      accent: item.accent,
      previewMode: 'network',
      stack: linkedProjects.map((p) => p.title),
    });
    return;
  }

  state.previewProjectId = item.id;
  state.previewStackTarget = null;
  dom.previewCategory.textContent = item.categoryLabel;
  dom.previewCategory.style.color = item.accent;
  dom.previewYear.textContent = item.year;
  dom.previewTitle.textContent = item.title;
  dom.previewTagline.textContent = item.tagline;

  dom.previewStack.innerHTML = item.stack
    .slice(0, 4)
    .map((tech) => `<span class="tag">${escapeHtml(tech)}</span>`)
    .join('');

  dom.previewHubs.innerHTML = item.hubs
    .map((hId) => {
      const hub = HUBS.find((h) => h.id === hId);
      if (!hub) return '';
      return `<span class="hub-pill" style="border-color: ${hub.color}55; color: ${hub.color};">${escapeHtml(hub.label)}</span>`;
    })
    .join('');

  if (dom.openCaseBtn) {
    dom.openCaseBtn.textContent = 'Открыть кейс';
  }

  dom.previewCard.hidden = false;
  syncFloatingCloseBtn();
  positionPreviewCard(screenPos);
  unmountLivePreview = mountLivePreview(dom.livePreviewCanvas, item);
}

function renderDetailContent(project) {
  const hubPillsHtml = (project.hubs || [])
    .map((hId) => {
      const hub = HUBS.find((h) => h.id === hId);
      if (!hub) return '';
      return `
        <button
          type="button"
          class="hub-pill detail-hub-pill"
          data-jump-hub="${hub.id}"
          style="border-color: ${hub.color}66; color: ${hub.color};"
        >${escapeHtml(hub.label)}</button>
      `;
    })
    .join('');

  const metricsHtml =
    project.metrics && project.metrics.length > 0
      ? `
        <div class="detail-metrics">
          ${project.metrics
            .map(
              (m) => `
              <div class="metric-card">
                <span class="metric-label">${escapeHtml(m.label)}</span>
                <span class="metric-value" style="color: ${project.accent}">${escapeHtml(m.value)}</span>
              </div>
            `,
            )
            .join('')}
        </div>
      `
      : '';

  const architectureHtml =
    project.architecture && project.architecture.length > 0
      ? `
        <div class="detail-arch-section">
          <h2 class="section-label">Архитектурный конвейер</h2>
          <div class="detail-arch-grid">
            ${project.architecture
              .map(
                (step) => `
                <div class="arch-step">
                  <div class="arch-step-stage" style="color: ${project.accent}">${escapeHtml(step.stage)}</div>
                  <p class="arch-step-detail">${escapeHtml(step.detail)}</p>
                </div>
              `,
              )
              .join('')}
          </div>
        </div>
      `
      : '';

  const challengesHtml =
    project.challenges && project.challenges.length > 0
      ? `
        <div class="detail-challenges-section">
          <h2 class="section-label">Инженерные задачи и решения</h2>
          <div class="challenges-list">
            ${project.challenges
              .map(
                (ch) => `
                <div class="challenge-card">
                  <div class="challenge-row">
                    <span class="challenge-badge challenge-badge--problem">Задача</span>
                    <p>${escapeHtml(ch.problem)}</p>
                  </div>
                  <div class="challenge-row">
                    <span class="challenge-badge challenge-badge--solution" style="color: ${project.accent}; border-color: ${project.accent}55;">Решение</span>
                    <p>${escapeHtml(ch.solution)}</p>
                  </div>
                </div>
              `,
              )
              .join('')}
          </div>
        </div>
      `
      : '';

  const modulesHtml =
    project.modules && project.modules.length > 0
      ? `
        <div class="spec-row spec-row--stack">
          <span class="spec-key">МОДУЛИ</span>
          <div class="detail-modules">
            ${project.modules.map((m) => `<code class="module-chip">${escapeHtml(m)}</code>`).join('')}
          </div>
        </div>
      `
      : '';

  const coverHtml =
    project.screenshots && project.screenshots.length > 0
      ? `
        <button
          type="button"
          class="detail-cover-btn"
          data-screenshot-src="${escapeHtml(project.screenshots[0].src)}"
          data-screenshot-caption="${escapeHtml(project.screenshots[0].caption || project.title)}"
          aria-label="Увеличить скриншот ${escapeHtml(project.title)}"
        >
          <img
            class="detail-cover-img"
            src="${escapeHtml(project.screenshots[0].src)}"
            alt="${escapeHtml(project.screenshots[0].caption || project.title)}"
            decoding="async"
          />
          <span class="detail-cover-zoom">Открыть</span>
        </button>
      `
      : renderCoverSvg(project, 'detail-cover-svg');

  const valuePropHtml = project.valueProp
    ? `
      <div class="detail-value-prop" style="border-left-color: ${project.accent};">
        <div class="detail-value-prop-label">Чем полезен проект</div>
        <p>${escapeHtml(project.valueProp)}</p>
      </div>
    `
    : '';

  const featuresHtml =
    project.features && project.features.length > 0
      ? `
        <div class="detail-features-section">
          <h2 class="section-label">Основные функции</h2>
          <div class="detail-features-grid">
            ${project.features
              .map(
                (f) => `
                <article class="feature-card">
                  <h3 class="feature-card-title">${escapeHtml(f.title)}</h3>
                  <p class="feature-card-detail">${escapeHtml(f.detail)}</p>
                </article>
              `,
              )
              .join('')}
          </div>
        </div>
      `
      : '';

  const screenshotsHtml =
    project.screenshots && project.screenshots.length > 0
      ? `
        <div class="detail-screenshots-section">
          <h2 class="section-label">Скриншоты интерфейса</h2>
          <div class="detail-screenshots-grid">
            ${project.screenshots
              .map(
                (shot) => `
                <button
                  type="button"
                  class="screenshot-card${shot.portrait ? ' screenshot-card--portrait' : ''}"
                  data-screenshot-src="${escapeHtml(shot.src)}"
                  data-screenshot-caption="${escapeHtml(shot.caption || project.title)}"
                >
                  <img src="${escapeHtml(shot.src)}" alt="${escapeHtml(shot.caption || project.title)}" loading="lazy" decoding="async" />
                  <span class="screenshot-card-caption">${escapeHtml(shot.caption || project.title)}</span>
                </button>
              `,
              )
              .join('')}
          </div>
        </div>
      `
      : '';

  const uiPreviewHtml = project.uiPreview
    ? `
      <div class="ui-preview-section">
        <h2 class="section-label">${escapeHtml(project.uiPreview.title || 'Пример интерфейса')}</h2>
        <div class="ui-preview-card">
          <div class="ui-preview-header" style="color: ${project.accent};">${escapeHtml(project.uiPreview.header || '')}</div>
          <p class="ui-preview-body">${escapeHtml(project.uiPreview.body || '')}</p>
          <div class="ui-preview-buttons">
            ${(project.uiPreview.buttons || [])
              .map(
                (row) => `
                <div class="ui-preview-row">
                  ${row.map((btnLabel) => `<span class="ui-preview-btn-chip">${escapeHtml(btnLabel)}</span>`).join('')}
                </div>
              `,
              )
              .join('')}
          </div>
        </div>
      </div>
    `
    : '';

  dom.detailContent.innerHTML = `
    <div class="detail-hero">
      <div class="detail-cover">
        ${coverHtml}
      </div>

      <div class="detail-info">
        <div class="detail-meta">
          <span style="color: ${project.accent}">${escapeHtml(project.categoryLabel)}</span>
          <span>/ ${escapeHtml(project.year)}</span>
          <span>/ ${escapeHtml(project.status)}</span>
        </div>

        <h1 class="detail-title" id="detail-heading" tabindex="-1">
          ${escapeHtml(project.title)}
        </h1>

        ${project.role ? `<div class="detail-role">${escapeHtml(project.role)}</div>` : ''}

        <p class="detail-tagline">${escapeHtml(project.tagline)}</p>
        ${valuePropHtml}
        <p class="detail-description">${escapeHtml(project.description)}</p>

        <div class="preview-tags">
          ${project.stack.map((tech) => `<span class="tag">${escapeHtml(tech)}</span>`).join('')}
        </div>

        ${hubPillsHtml ? `<div class="detail-hubs-row">${hubPillsHtml}</div>` : ''}
      </div>
    </div>

    ${featuresHtml}
    ${screenshotsHtml}
    ${uiPreviewHtml}
    ${metricsHtml}
    ${architectureHtml}
    ${challengesHtml}

    <div class="detail-sections">
      <div>
        <h2 class="section-label">Ключевые особенности</h2>
        <ul class="highlights-list">
          ${project.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>
      </div>

      <div class="detail-specs">
        <div class="spec-row">
          <span class="spec-key">ИНДЕКС</span>
          <span class="spec-val">#${escapeHtml(project.index)}</span>
        </div>
        <div class="spec-row">
          <span class="spec-key">СТАТУС</span>
          <span class="spec-val">${escapeHtml(project.status)}</span>
        </div>
        <div class="spec-row">
          <span class="spec-key">ГОД</span>
          <span class="spec-val">${escapeHtml(project.year)}</span>
        </div>
        <div class="spec-row">
          <span class="spec-key">ДИРЕКТОРИЯ</span>
          <span class="spec-val">${escapeHtml(project.repoPath)}</span>
        </div>
        ${modulesHtml}
      </div>
    </div>
  `;
}

function openProjectDetail(projectId, { updateHash = true, direction = null } = {}) {
  const project = PROJECTS.find((p) => p.id === projectId);
  if (!project) return;

  const isAlreadyDetail = state.activeProjectId !== null;
  state.activeProjectId = project.id;

  if (updateHash) {
    history.pushState({ projectId: project.id }, '', `#project/${project.id}`);
  }

  const applyDOM = () => {
    renderDetailContent(project);
    document.body.classList.remove('canvas-active');
    dom.canvasView.hidden = true;
    if (dom.bentoShowcase) dom.bentoShowcase.hidden = true;
    dom.detailView.hidden = false;
    dom.detailView.dataset.active = 'true';
    syncFloatingCloseBtn();
    syncCanvasIntroBackdrop();
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  if (!supportsViewTransitions || prefersReducedMotion()) {
    applyDOM();
    document.getElementById('detail-heading')?.focus();
    return;
  }

  if (isAlreadyDetail && direction) {
    document.documentElement.dataset.navDirection = direction;
    dom.detailView.dataset.active = 'true';
    const transition = document.startViewTransition(() => {
      renderDetailContent(project);
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    transition.finished.finally(() => {
      delete document.documentElement.dataset.navDirection;
      document.getElementById('detail-heading')?.focus();
    });
    return;
  }

  if (!dom.previewCard.hidden) {
    dom.previewCard.dataset.transitioning = 'true';
  }
  const transition = document.startViewTransition(() => {
    applyDOM();
  });
  transition.finished.finally(() => {
    delete dom.previewCard.dataset.transitioning;
    document.getElementById('detail-heading')?.focus();
  });
}

function closeProjectDetail({ updateHash = true } = {}) {
  if (state.activeProjectId === null) return;
  state.activeProjectId = null;

  if (updateHash && location.hash.startsWith('#project/')) {
    history.pushState(null, '', '#canvas');
  }

  const applyDOM = () => {
    dom.detailView.hidden = true;
    dom.detailView.dataset.active = 'false';
    dom.canvasView.hidden = false;
    if (dom.bentoShowcase) dom.bentoShowcase.hidden = false;
    document.body.classList.add('canvas-active');
    syncFloatingCloseBtn();
    syncCanvasIntroBackdrop();
    graph?.wake?.();
  };

  if (!supportsViewTransitions || prefersReducedMotion()) {
    applyDOM();
    document.getElementById('canvas-heading')?.focus();
    return;
  }

  if (!dom.previewCard.hidden) {
    dom.previewCard.dataset.transitioning = 'true';
  }
  const transition = document.startViewTransition(() => {
    applyDOM();
  });
  transition.finished.finally(() => {
    delete dom.previewCard.dataset.transitioning;
    document.getElementById('canvas-heading')?.focus();
  });
}

function stepProject(delta) {
  if (!state.activeProjectId) return;
  const idx = PROJECTS.findIndex((p) => p.id === state.activeProjectId);
  const nextIdx = (idx + delta + PROJECTS.length) % PROJECTS.length;
  openProjectDetail(PROJECTS[nextIdx].id, {
    direction: delta > 0 ? 'next' : 'prev',
  });
}

function scrollToBento() {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo('#bento-showcase', { duration: 1.15 });
  } else {
    dom.bentoShowcase?.scrollIntoView({ behavior: 'smooth' });
  }
}

function initDialogClosedByFallback() {
  if ('closedBy' in HTMLDialogElement.prototype) return;
  const outside = (e, dialog) => {
    const r = dialog.getBoundingClientRect();
    return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
  };
  for (const dialog of document.querySelectorAll('dialog[closedby="any"]')) {
    let pressedOutside = false;
    dialog.addEventListener('pointerdown', (e) => {
      pressedOutside = outside(e, dialog);
    });
    dialog.addEventListener('pointerup', (e) => {
      if (pressedOutside && outside(e, dialog)) dialog.close();
    });
  }
}

function bindPanelScrollIsolation(panel, scrollerSelector) {
  if (!panel) return;
  panel.addEventListener(
    'wheel',
    (e) => {
      e.stopPropagation();
      const scroller = scrollerSelector ? panel.querySelector(scrollerSelector) || panel : panel;
      const canScroll = scroller.scrollHeight > scroller.clientHeight + 1;
      if (!canScroll) {
        e.preventDefault();
        return;
      }
      const atTop = scroller.scrollTop <= 0 && e.deltaY < 0;
      const atBottom =
        scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 1 && e.deltaY > 0;
      if (atTop || atBottom) {
        e.preventDefault();
      }
    },
    { passive: false },
  );
  panel.addEventListener('touchmove', (e) => e.stopPropagation(), { passive: true });
}

function bindEvents() {
  bindPanelScrollIsolation(dom.hubDrawer, '.hub-drawer-glass');
  bindPanelScrollIsolation(dom.profileIntro, '.profile-drawer-glass');
  bindPanelScrollIsolation(dom.previewCard);

  // Dismiss intro on any pointerdown outside the intro card
  window.addEventListener(
    'pointerdown',
    (e) => {
      if (!state.introDismissed && !e.target.closest('#dismiss-intro-btn')) {
        if (!e.target.closest('#profile-intro-drawer')) {
          dismissIntro();
        }
      }
    },
    { capture: true },
  );

  dom.dismissIntroBtn?.addEventListener('click', dismissIntro);

  // Viewport-fixed floating close button + scroll backdrop for canvas intro
  const closeActiveCanvasPanel = () => {
    if (state.previewProjectId || state.previewStackTarget) {
      graph?.clearSelection();
      return true;
    }
    if (state.activeHubId) {
      const prevHubId = state.activeHubId;
      closeHubDrawer();
      graph?.selectHub(prevHubId);
      return true;
    }
    return false;
  };

  dom.floatingCloseBtn?.addEventListener('click', closeActiveCanvasPanel);
  window.addEventListener('scroll', syncCanvasIntroBackdrop, { passive: true });

  // Hub Drawer events + stack filter chips
  dom.closeHubDrawerBtn?.addEventListener('click', () => {
    const prevHubId = state.activeHubId;
    closeHubDrawer();
    if (prevHubId) {
      graph?.selectHub(prevHubId);
    }
  });

  dom.hubDrawerStacks?.addEventListener('click', (e) => {
    const chip = e.target.closest('.stack-chip');
    if (!chip || !state.activeHubId) return;
    const stackName = chip.dataset.stackName;
    state.activeStackFilter = state.activeStackFilter === stackName ? null : stackName;
    const hub = HUBS.find((h) => h.id === state.activeHubId);
    if (hub) renderHubDrawerContent(hub);
  });

  dom.hubDrawerProjects?.addEventListener('click', (e) => {
    const item = e.target.closest('.hub-project-item');
    if (item?.dataset.projectId) {
      openProjectDetail(item.dataset.projectId);
    }
  });

  // Bento filter bar
  dom.bentoFilterBar?.addEventListener('click', (e) => {
    const btn = e.target.closest('.bento-filter-btn');
    if (!btn) return;
    const nextFilter = btn.dataset.bentoFilter;
    if (!nextFilter || nextFilter === state.bentoFilter) return;
    state.bentoFilter = nextFilter;
    renderBentoFilters();
    bentoApi?.render(state.bentoFilter, state.viewMode);
  });

  // Top mode switcher (Проекты / Стеки)
  dom.viewModeSwitch?.addEventListener('click', (e) => {
    const modeBtn = e.target.closest('[data-view-mode]');
    if (!modeBtn) return;
    setViewMode(modeBtn.dataset.viewMode);
  });

  // Clickable project pills inside stack preview card
  dom.previewStack?.addEventListener('click', (e) => {
    const jumpBtn = e.target.closest('[data-jump-project]');
    if (jumpBtn?.dataset.jumpProject) {
      openProjectDetail(jumpBtn.dataset.jumpProject);
    }
  });

  // Preview card events
  dom.previewCloseBtn?.addEventListener('click', () => {
    graph?.clearSelection();
  });

  dom.openCaseBtn?.addEventListener('click', () => {
    if (state.previewProjectId) {
      openProjectDetail(state.previewProjectId);
    } else if (state.previewStackTarget) {
      focusStackInHub(state.previewStackTarget.hubId, state.previewStackTarget.stackName);
    }
  });

  // Header controls
  dom.toggleAllBtn?.addEventListener('click', () => {
    state.showAll = !state.showAll;
    dom.toggleAllBtn.setAttribute('aria-pressed', String(state.showAll));
    graph?.setShowAll(state.showAll);
    if (state.showAll) {
      closeHubDrawer();
      dismissIntro();
    }
  });

  dom.scrollToBento?.addEventListener('click', (e) => {
    e.preventDefault();
    scrollToBento();
  });

  dom.backBtn?.addEventListener('click', () => closeProjectDetail());
  dom.prevBtn?.addEventListener('click', () => stepProject(-1));
  dom.nextBtn?.addEventListener('click', () => stepProject(1));

  dom.detailContent?.addEventListener('click', (e) => {
    const jumpHubBtn = e.target.closest('[data-jump-hub]');
    if (!jumpHubBtn) return;
    const hubId = jumpHubBtn.dataset.jumpHub;
    closeProjectDetail();
    if (hubId) {
      setTimeout(() => graph?.selectHub(hubId), 60);
    }
  });

  dom.brandLink?.addEventListener('click', (e) => {
    e.preventDefault();
    if (state.activeProjectId !== null) {
      closeProjectDetail();
    } else {
      graph?.resetView();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (dom.contactDialog?.open || dom.resumeDialog?.open) return;

    if (state.activeProjectId !== null) {
      if (e.key === 'Escape') closeProjectDetail();
      else if (e.key === 'ArrowLeft') stepProject(-1);
      else if (e.key === 'ArrowRight') stepProject(1);
    } else if (e.key === 'Escape') {
      if (!closeActiveCanvasPanel() && !state.introDismissed) {
        dismissIntro();
      }
    }
  });

  window.addEventListener('popstate', () => {
    const match = location.hash.match(/^#project\/(.+)$/);
    if (match) {
      openProjectDetail(match[1], { updateHash: false });
    } else {
      closeProjectDetail({ updateHash: false });
    }
  });

  // Resume modal dialog
  const openResume = () => {
    renderResumeModal();
    dom.resumeDialog?.showModal();
  };
  dom.openResumeBtn?.addEventListener('click', openResume);
  dom.introResumeBtn?.addEventListener('click', openResume);
  dom.closeResumeBtn?.addEventListener('click', () => dom.resumeDialog?.close());
  dom.resumeDialog?.addEventListener('close', () => {
    dom.resumeDialog.returnValue = '';
  });

  // Contact modal dialog
  dom.openContactBtn?.addEventListener('click', () => dom.contactDialog.showModal());
  dom.closeContactBtn?.addEventListener('click', () => dom.contactDialog.close());
  dom.contactDialog?.addEventListener('close', () => {
    dom.contactDialog.returnValue = '';
  });

  // Screenshot lightbox modal
  dom.detailContent?.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-screenshot-src]');
    if (!trigger || !dom.screenshotDialog || !dom.screenshotDialogImg) return;
    const src = trigger.dataset.screenshotSrc;
    const caption = trigger.dataset.screenshotCaption || '';
    dom.screenshotDialogImg.src = src;
    dom.screenshotDialogImg.alt = caption;
    if (dom.screenshotDialogCaption) {
      dom.screenshotDialogCaption.textContent = caption;
    }
    dom.screenshotDialog.showModal();
  });

  dom.closeScreenshotBtn?.addEventListener('click', () => dom.screenshotDialog?.close());
  dom.screenshotDialog?.addEventListener('close', () => {
    dom.screenshotDialog.returnValue = '';
    if (dom.screenshotDialogImg) dom.screenshotDialogImg.src = '';
  });

  dom.contactDialog?.addEventListener('click', async (e) => {
    const copyBtn = e.target.closest('[data-copy]');
    if (!copyBtn) return;
    const value = copyBtn.dataset.copy;
    const label = copyBtn.querySelector('[data-copy-label]');
    try {
      await navigator.clipboard.writeText(value);
      if (label) {
        label.textContent = 'Скопировано';
        setTimeout(() => {
          label.textContent = 'Копировать';
        }, 1800);
      }
    } catch {
      if (label) label.textContent = value;
    }
  });
}

function init() {
  init3DBackground(dom.bg3dCanvas);

  graph = createGraphCanvas(dom.graphCanvas, {
    onSelectProject: (project, screenPos) => {
      showPreviewCard(project, screenPos);
      if (project) {
        dismissIntro();
        closeHubDrawer();
      }
    },
    onTrackSelectedNode: (_project, screenPos) => positionPreviewCard(screenPos),
    onHubChange: (hubId) => {
      if (hubId) {
        if (state.showAll) {
          state.showAll = false;
          dom.toggleAllBtn.setAttribute('aria-pressed', 'false');
        }
        openHubDrawer(hubId);
      } else {
        closeHubDrawer();
      }
    },
    onSelectProfile: () => {
      openIntro();
      closeHubDrawer();
      graph?.clearSelection();
    },
    onScrollDown: () => {
      scrollToBento();
    },
  });

  renderBentoFilters();
  bentoApi = initBentoGrid(dom.bentoGrid, PROJECTS, {
    onSelectProject: (projectId) => {
      openProjectDetail(projectId);
    },
    onSelectStack: (hubId, stackName) => {
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.0 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setTimeout(() => focusStackInHub(hubId, stackName), 250);
    },
  });

  initLenisScroll();
  initNavHintManager(dom.navHint, 2800);

  bindEvents();
  initDialogClosedByFallback();
  initScrambleEffects();
  initMagneticButtons();
  syncFloatingCloseBtn();
  syncCanvasIntroBackdrop();

  const match = location.hash.match(/^#project\/(.+)$/);
  if (match) {
    openProjectDetail(match[1], { updateHash: false });
  }
}

init();
