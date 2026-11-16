import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ ${message}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('\n========================================');
console.log('Automated Verification Test Suite');
console.log('Portfolio Milestone M1 (Features F1-F10)');
console.log('========================================\n');

// --- 1. Syntax check on all project JS files ---
console.log('[1/5] Syntax Verification (Node.js engine)');
const jsFiles = [
  'data/projects.js',
  'scripts/app.js',
  'scripts/background3d.js',
  'scripts/bentoGrid.js',
  'scripts/covers.js',
  'scripts/effects.js',
  'scripts/graphCanvas.js',
  'scripts/livePreview.js',
];

for (const file of jsFiles) {
  const filePath = resolve(rootDir, file);
  try {
    execFileSync(process.execPath, ['--check', filePath], { stdio: 'pipe' });
    assert(true, `Syntax check passed: ${file}`);
  } catch (err) {
    assert(false, `Syntax error in ${file}: ${err.message}`);
  }
}

// --- 2. Data model integrity check ---
console.log('\n[2/5] Data Model & Graph Topology Verification');
const dataMod = await import('../data/projects.js');

// 2.1 Central profile node & resume model
assert(Boolean(dataMod.PROFILE_NODE), 'PROFILE_NODE is exported');
assert(dataMod.PROFILE_NODE?.id === 'profile', 'PROFILE_NODE id is "profile"');
assert(dataMod.PROFILE_NODE?.x === 0 && dataMod.PROFILE_NODE?.y === 0, 'PROFILE_NODE position is centered at (0, 0)');
assert(typeof dataMod.PROFILE_NODE?.radius === 'number' && dataMod.PROFILE_NODE?.radius > 20, 'PROFILE_NODE has interactive radius');
assert(Array.isArray(dataMod.PROFILE_NODE?.domains) && dataMod.PROFILE_NODE.domains.length === 7, 'PROFILE_NODE contains 7 specialization domains');
const hasAiDomain = dataMod.PROFILE_NODE.domains?.some(d => /ai|vision/i.test(d.id + d.label));
const hasSecDomain = dataMod.PROFILE_NODE.domains?.some(d => /sec|reverse/i.test(d.id + d.label));
const hasBackendDomain = dataMod.PROFILE_NODE.domains?.some(d => /backend/i.test(d.id + d.label));
assert(hasAiDomain, 'PROFILE_NODE reflects AI & Computer Vision domain');
assert(hasSecDomain, 'PROFILE_NODE reflects CyberSecurity & Reverse Engineering domain');
assert(hasBackendDomain, 'PROFILE_NODE reflects Backend Engineering domain');

assert(Boolean(dataMod.RESUME_DATA), 'RESUME_DATA is exported for resume integration');
assert('pdfUrl' in dataMod.RESUME_DATA, 'RESUME_DATA includes pdfUrl slot');
assert(Array.isArray(dataMod.RESUME_DATA?.sections) && dataMod.RESUME_DATA.sections.length >= 2, 'RESUME_DATA has structured sections');

// 2.2 Hubs & Tech Stacks verification
assert(Array.isArray(dataMod.HUBS) && dataMod.HUBS.length === 7, 'HUBS contains 7 category hubs including Backend');
const hubIds = dataMod.HUBS.map(h => h.id);
assert(hubIds.includes('backend'), 'HUBS includes "backend"');
assert(hubIds.includes('web'), 'HUBS includes "web"');
assert(hubIds.includes('bots'), 'HUBS includes "bots"');
assert(hubIds.includes('extra'), 'HUBS includes "extra"');
assert(hubIds.includes('ai'), 'HUBS includes "ai"');
assert(hubIds.includes('cybersec'), 'HUBS includes "cybersec"');
assert(hubIds.includes('gamedev'), 'HUBS includes "gamedev"');

for (const hub of dataMod.HUBS) {
  const dist = Math.hypot(hub.x, hub.y);
  assert(dist > 200, `Hub "${hub.id}" is placed radially at distance ${Math.round(dist)}px > 200px`);
  assert(typeof hub.description === 'string' && hub.description.length > 10, `Hub "${hub.id}" has summary for drawer`);
  assert(Array.isArray(hub.techStacks) && hub.techStacks.length > 0, `Hub "${hub.id}" defines techStacks mapping`);
}

const backendHub = dataMod.HUBS.find(h => h.id === 'backend');
const backendStackNames = backendHub?.techStacks?.map(s => s.name) || [];
assert(backendStackNames.some(n => /docker/i.test(n)), 'Backend hub lists Docker stack');
assert(backendStackNames.some(n => /redis/i.test(n)), 'Backend hub lists Redis stack');
assert(backendStackNames.some(n => /kubernetes|k8s/i.test(n)), 'Backend hub lists Kubernetes stack');
assert(backendStackNames.some(n => /парсинг|parsing/i.test(n)), 'Backend hub lists Multiparsing stack');

// 2.3 Project topology links
const arena = dataMod.PROJECTS.find(p => p.id === 'reverse-arena-breakout');
assert(Boolean(arena), 'Project "reverse-arena-breakout" exists');
assert(!arena?.hubs?.includes('gamedev'), 'Arena Breakout R&D is separated from GameDev (lives in CyberSec & Reverse)');
assert(arena?.hubs?.includes('cybersec'), 'Arena Breakout R&D is linked to CyberSec & Reverse');
assert(!arena?.hubs?.includes('ai'), 'Arena Breakout R&D is NOT erroneously linked to AI Vision');

const decayZone = dataMod.PROJECTS.find(p => p.id === 'decay-zone-2d');
assert(Boolean(decayZone), 'Project "decay-zone-2d" (Decay Zone / Arena Breakout 2D) exists');
assert(decayZone?.hubs?.includes('gamedev'), 'Decay Zone (Arena Breakout 2D) is linked to GameDev');
assert(!decayZone?.hubs?.includes('cybersec'), 'Decay Zone (Arena Breakout 2D) is cleanly separated from CyberSec R&D');
assert((decayZone?.screenshots?.length || 0) >= 3, 'Decay Zone includes >= 3 gameplay screenshots');

const drone = dataMod.PROJECTS.find(p => p.id === 'drone-inersion');
assert(Boolean(drone), 'Project "drone-inersion" exists');
assert(drone?.hubs?.includes('gamedev'), 'Drone Inersion is linked to GameDev');
assert(!drone?.hubs?.includes('ai'), 'Drone Inersion is unlinked from AI Vision');

const lingua = dataMod.PROJECTS.find(p => p.id === 'linguatype');
assert(Boolean(lingua), 'Project "linguatype" exists in PROJECTS');
assert(lingua?.hubs?.includes('backend'), 'LangType is linked to "backend" hub');
assert(lingua?.hubs?.includes('web'), 'LangType is linked to "web" hub');
assert(lingua?.hubs?.includes('extra'), 'LangType is linked to "extra" hub');

const downloaderBot = dataMod.PROJECTS.find(p => p.id === 'downloader-bot');
assert(Boolean(downloaderBot), 'Project "downloader-bot" exists in PROJECTS');
assert(downloaderBot?.hubs?.includes('backend'), 'DownloaderBot is linked to "backend" hub');
assert(downloaderBot?.hubs?.includes('bots'), 'DownloaderBot is linked to "bots" hub');

const upscalerBot = dataMod.PROJECTS.find(p => p.id === 'upscaler-bot');
assert(Boolean(upscalerBot), 'Project "upscaler-bot" exists in PROJECTS');
assert(upscalerBot?.hubs?.includes('bots'), 'UpscalerBot is linked to "bots" hub');
assert(upscalerBot?.hubs?.includes('ai'), 'UpscalerBot is linked to "ai" hub');
assert(upscalerBot?.hubs?.includes('backend'), 'UpscalerBot is linked to "backend" hub');

const moodle = dataMod.PROJECTS.find(p => p.id === 'moodle-data-tools');
assert(Boolean(moodle), 'Project "moodle-data-tools" exists in PROJECTS');
assert(moodle?.hubs?.includes('backend'), 'UniMoodle Data Tools is linked to "backend" hub');
assert(moodle?.hubs?.includes('cybersec'), 'UniMoodle Data Tools is linked to "cybersec" hub');
assert(moodle?.hubs?.includes('extra'), 'UniMoodle Data Tools is linked to "extra" hub');

// 2.4 Deep project schema & newly integrated workspace projects
assert(typeof dataMod.defineProject === 'function', 'data/projects.js exports defineProject() helper');
assert(Boolean(dataMod.PROJECT_TEMPLATE), 'data/projects.js exports PROJECT_TEMPLATE');
assert(dataMod.PROJECTS.length >= 16, `PROJECTS catalog expanded to ${dataMod.PROJECTS.length} real workspace projects (>= 16)`);
assert(Boolean(dataMod.PROJECTS.find(p => p.id === 'secondpage')), 'Project "secondpage" (BMU SecondPage) added');
assert(Boolean(dataMod.PROJECTS.find(p => p.id === 'skillspace-test')), 'Project "skillspace-test" (Skill Space Assessment) added');
assert(Boolean(dataMod.PROJECTS.find(p => p.id === 'payment-portal')), 'Project "payment-portal" (Payment Portal) added');
const aiSeries = dataMod.PROJECTS.find(p => p.id === 'ai-series-studio');
assert(Boolean(aiSeries), 'Project "ai-series-studio" (AI Series Studio) added');
assert(aiSeries?.hubs?.includes('ai') && aiSeries?.hubs?.includes('web') && aiSeries?.hubs?.includes('extra'), 'AI Series Studio is linked to AI, Web & Extra hubs');

const validHubSet = new Set(hubIds);
const projectIdSet = new Set(dataMod.PROJECTS.map(p => p.id));
for (const p of dataMod.PROJECTS) {
  assert(Array.isArray(p.hubs) && p.hubs.length > 0 && p.hubs.every(h => validHubSet.has(h)), `Project "${p.id}" references valid hub IDs`);
  assert(typeof p.valueProp === 'string' && p.valueProp.trim().length > 20, `Project "${p.id}" defines plain-language valueProp`);
  assert(Array.isArray(p.features) && p.features.length >= 3, `Project "${p.id}" defines >= 3 user-facing features`);
  assert(Array.isArray(p.metrics) && p.metrics.length > 0, `Project "${p.id}" defines metrics`);
  assert(Array.isArray(p.architecture) && p.architecture.length >= 2, `Project "${p.id}" defines multi-stage architecture`);
  assert(Array.isArray(p.challenges) && p.challenges.length >= 1, `Project "${p.id}" defines engineering challenges`);
  assert(Array.isArray(p.modules) && p.modules.length >= 1, `Project "${p.id}" lists repository modules`);
  for (const shot of p.screenshots || []) {
    const absShot = resolve(rootDir, shot.src);
    assert(existsSync(absShot), `Project "${p.id}" screenshot exists on disk: ${shot.src}`);
  }
}
for (const hub of dataMod.HUBS) {
  for (const st of hub.techStacks) {
    assert(st.projects.every(pid => projectIdSet.has(pid)), `Hub "${hub.id}" stack "${st.name}" references valid project IDs`);
  }
}

// --- 3. DOM & Markup Structure Verification ---
console.log('\n[3/5] Markup & DOM Structure Verification (index.html)');
const htmlContent = readFileSync(resolve(rootDir, 'index.html'), 'utf-8');

assert(htmlContent.includes('id="bg-3d-canvas"'), 'index.html contains 3D WebGL canvas (#bg-3d-canvas)');
assert(htmlContent.includes('id="profile-intro-drawer"'), 'index.html contains lateral profile intro drawer (#profile-intro-drawer)');
assert(htmlContent.includes('id="dismiss-intro-btn"'), 'index.html contains dismiss intro button (#dismiss-intro-btn)');
assert(htmlContent.includes('id="hub-drawer"'), 'index.html contains category hub side drawer (#hub-drawer)');
assert(htmlContent.includes('id="hub-drawer-stacks"'), 'index.html contains hub tech stack filter container (#hub-drawer-stacks)');
assert(htmlContent.includes('id="close-hub-drawer-btn"'), 'index.html contains close hub drawer button (#close-hub-drawer-btn)');
assert(htmlContent.includes('id="open-resume-btn"'), 'index.html contains header resume button (#open-resume-btn)');
assert(htmlContent.includes('id="intro-resume-btn"'), 'index.html contains intro drawer resume button (#intro-resume-btn)');
assert(htmlContent.includes('id="resume-dialog"'), 'index.html contains resume dialog (#resume-dialog)');
assert(htmlContent.includes('id="canvas-nav-hint"'), 'index.html contains adaptive navigation hint (#canvas-nav-hint)');
assert(htmlContent.includes('id="scroll-to-bento"'), 'index.html contains scroll to bento hint button (#scroll-to-bento)');
assert(htmlContent.includes('id="bento-showcase"'), 'index.html contains Bento showcase section (#bento-showcase)');
assert(htmlContent.includes('id="bento-filter-bar"'), 'index.html contains Bento direction filter bar (#bento-filter-bar)');
assert(htmlContent.includes('id="bento-grid"'), 'index.html contains Bento grid container (#bento-grid)');
assert(htmlContent.includes('id="toggle-all-btn"'), 'index.html contains minimalist header toggle button (#toggle-all-btn)');
assert(htmlContent.includes('id="floating-close-btn"'), 'index.html contains viewport-fixed #floating-close-btn');
assert(htmlContent.includes('id="view-mode-switch"'), 'index.html contains top Projects/Stacks switcher (#view-mode-switch)');
assert(htmlContent.includes('data-view-mode="projects"') && htmlContent.includes('data-view-mode="stacks"'), 'Top mode switcher provides "Проекты" and "Стеки" toggles');
assert(!/<button[^>]*id="toggle-all-btn"[^>]*data-scramble/.test(htmlContent), '#toggle-all-btn button does not have data-scramble directly on button');
assert(htmlContent.includes('data-scramble'), 'index.html enables calm scramble on [data-scramble] UI triggers');
assert(!htmlContent.includes('id="nav-bento-link"'), 'Header Bento-сетка link (#nav-bento-link) is removed');

// Clunky bottom zoom buttons must be removed
assert(!htmlContent.includes('id="zoom-in-btn"'), 'Clunky bottom zoom-in button is removed');
assert(!htmlContent.includes('id="zoom-out-btn"'), 'Clunky bottom zoom-out button is removed');
assert(!htmlContent.includes('id="zoom-val"'), 'Clunky bottom zoom-val readout is removed');

// --- 4. CSS & Styling Verification ---
console.log('\n[4/5] CSS & Visual Styles Verification');
const cssContent = readFileSync(resolve(rootDir, 'styles/main.css'), 'utf-8');

assert(cssContent.includes('.bg-3d-canvas'), 'CSS defines styles for .bg-3d-canvas');
assert(cssContent.includes('.profile-intro-drawer'), 'CSS defines styles for .profile-intro-drawer');
assert(cssContent.includes('.profile-intro-drawer.is-dismissed'), 'CSS defines .is-dismissed state for intro drawer');
assert(cssContent.includes('.hub-drawer'), 'CSS defines styles for .hub-drawer');
assert(cssContent.includes('.hub-drawer.is-open'), 'CSS defines .is-open state for hub drawer');
assert(cssContent.includes('.stack-chip'), 'CSS defines styles for .stack-chip tech stack filters');
assert(cssContent.includes('.bento-filter-btn'), 'CSS defines styles for .bento-filter-btn');
assert(cssContent.includes('.canvas-nav-hint'), 'CSS defines styles for .canvas-nav-hint');
assert(cssContent.includes('.canvas-nav-hint.is-hidden'), 'CSS defines .is-hidden state for nav hint');
assert(cssContent.includes('@keyframes nav-hint-breathe'), 'CSS defines @keyframes nav-hint-breathe pulsing animation');
assert(cssContent.includes('.bento-showcase-section'), 'CSS defines .bento-showcase-section');
assert(cssContent.includes('.bento-grid'), 'CSS defines .bento-grid layout');
assert(cssContent.includes('.bento-card'), 'CSS defines .bento-card styling');
assert(cssContent.includes('.mode-switch') && cssContent.includes('.mode-switch-btn.is-active'), 'CSS defines .mode-switch header toggle styles');
assert(cssContent.includes('.bento-card-stack'), 'CSS defines .bento-card-stack styling for Stacks view mode');
assert(cssContent.includes('.canvas-intro.has-backdrop'), 'CSS defines borderless .canvas-intro.has-backdrop for scroll readability');
assert(cssContent.includes('.floating-close-btn'), 'CSS defines viewport-fixed .floating-close-btn');
assert(cssContent.includes('.bento-span-4'), 'CSS defines compact 3-column .bento-span-4 bento grid cards');
assert(cssContent.includes('-webkit-line-clamp: 2'), 'CSS clamps bento tagline to 2 compact lines');
assert(cssContent.includes('--mouse-x') && cssContent.includes('--mouse-y'), 'CSS uses --mouse-x and --mouse-y custom properties for Linear spotlight');
assert(cssContent.includes('mask-composite: exclude'), 'CSS uses mask-composite: exclude for border reveal spotlight');

// --- 5. Module exports and functions verification ---
console.log('\n[5/5] Module Exports & Functions Verification');
const effectsSource = readFileSync(resolve(rootDir, 'scripts/effects.js'), 'utf-8');
assert(/export\s+function\s+scrambleElement\b/.test(effectsSource), 'scripts/effects.js exports scrambleElement()');
assert(/export\s+function\s+initScrambleEffects\b/.test(effectsSource), 'scripts/effects.js exports initScrambleEffects()');
assert(/export\s+function\s+initMagneticButtons\b/.test(effectsSource), 'scripts/effects.js exports initMagneticButtons()');
assert(/export\s+function\s+initLenisScroll\b/.test(effectsSource), 'scripts/effects.js exports initLenisScroll()');
assert(/export\s+function\s+getLenis\b/.test(effectsSource), 'scripts/effects.js exports getLenis()');
assert(effectsSource.includes("'0123456789ABCDEF'") || effectsSource.includes('"0123456789ABCDEF"'), 'scripts/effects.js CHARS uses uniform hex glyph set');
assert(!effectsSource.includes('АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'), 'scripts/effects.js removes irregular-width Cyrillic scramble glyphs');
assert(!effectsSource.includes('pointerenter'), 'scripts/effects.js avoids pointerenter trigger');
assert(effectsSource.includes('mouseenter') && effectsSource.includes('data-scramble'), 'scripts/effects.js binds calm hover scramble via mouseenter on [data-scramble]');
assert(effectsSource.includes('minWidth'), 'scripts/effects.js locks minWidth during scramble to prevent layout jitter');
assert(effectsSource.includes('data-scramble-on-load'), 'scripts/effects.js preserves [data-scramble-on-load] initial decode');
assert(effectsSource.includes('findTargetTextNode'), 'scripts/effects.js implements findTargetTextNode()');

const graphSource = readFileSync(resolve(rootDir, 'scripts/graphCanvas.js'), 'utf-8');
assert(/export\s+function\s+createGraphCanvas\b/.test(graphSource), 'scripts/graphCanvas.js exports createGraphCanvas()');
assert(graphSource.includes('drawCentralProfile'), 'scripts/graphCanvas.js implements central profile rendering');
assert(graphSource.includes('onSelectProfile'), 'scripts/graphCanvas.js implements onSelectProfile callback on center hit');
assert(!graphSource.includes('particleProgress'), 'scripts/graphCanvas.js removes dot/ball particles along edges');

const bentoSource = readFileSync(resolve(rootDir, 'scripts/bentoGrid.js'), 'utf-8');
assert(/export\s+function\s+initBentoGrid\b/.test(bentoSource), 'scripts/bentoGrid.js exports initBentoGrid()');

const bg3dSource = readFileSync(resolve(rootDir, 'scripts/background3d.js'), 'utf-8');
assert(/export\s+function\s+init3DBackground\b/.test(bg3dSource), 'scripts/background3d.js exports init3DBackground()');
assert(bg3dSource.includes('Math.max(1, width)') && bg3dSource.includes('Math.max(1, height)'), 'scripts/background3d.js guards against zero dimensions with Math.max(1, width/height)');

// --- 6. Empirical DOM & Scramble SVG Preservation Verification ---
console.log('\n[6/6] Empirical Scramble SVG Preservation Verification');

class MockDOMNode {
  constructor(nodeType, tagName = '', nodeValue = '') {
    this.nodeType = nodeType;
    this.tagName = tagName;
    this.nodeValue = nodeValue;
    this.childNodes = [];
    this.dataset = {};
    this.style = {};
    this._scrambleRaf = null;
  }
  getBoundingClientRect() {
    return { width: 88, height: 24 };
  }
  get children() {
    return this.childNodes.filter(n => n.nodeType === 1);
  }
  get textContent() {
    if (this.nodeType === 3) return this.nodeValue;
    return this.childNodes.map(c => c.textContent).join('');
  }
  set textContent(val) {
    if (this.nodeType === 3) {
      this.nodeValue = val;
    } else {
      this.childNodes = [new MockDOMNode(3, '', val)];
    }
  }
  appendChild(child) {
    this.childNodes.push(child);
    return child;
  }
  querySelector(selector) {
    for (const child of this.childNodes) {
      if (child.nodeType === 1) {
        if (child.tagName.toLowerCase() === selector.toLowerCase()) return child;
        const sub = child.querySelector(selector);
        if (sub) return sub;
      }
    }
    return null;
  }
  querySelectorAll(selector) {
    const results = [];
    for (const child of this.childNodes) {
      if (child.nodeType === 1) {
        if (child.tagName.toLowerCase() === selector.toLowerCase()) results.push(child);
        results.push(...child.querySelectorAll(selector));
      }
    }
    return results;
  }
}

// Strip esm.sh imports and exports to execute scrambleElement in Node sandbox
const executableEffectsSource = effectsSource
  .replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '')
  .replace(/export\s+function/g, 'function')
  .replace(/export\s+const/g, 'const');

const evalScramble = new Function(
  'window',
  'document',
  'Node',
  'requestAnimationFrame',
  'cancelAnimationFrame',
  'performance',
  `${executableEffectsSource}\nreturn { scrambleElement, findTargetTextNode };`
);

let rafQueue = [];
const mockRaf = (cb) => {
  rafQueue.push(cb);
  return rafQueue.length;
};
const mockCancelRaf = (id) => {};

const mockWindow = {
  matchMedia: () => ({ matches: false }),
};
const mockDocument = {
  createTextNode: (val) => new MockDOMNode(3, '', val),
};
const mockNodeGlobal = {
  TEXT_NODE: 3,
  ELEMENT_NODE: 1,
};

const { scrambleElement: runScramble } = evalScramble(
  mockWindow,
  mockDocument,
  mockNodeGlobal,
  mockRaf,
  mockCancelRaf,
  performance
);

// Construct mock DOM mimicking #toggle-all-btn with nested SVG and inner span
const buttonEl = new MockDOMNode(1, 'BUTTON');
const svgEl = new MockDOMNode(1, 'SVG');
const circle1 = new MockDOMNode(1, 'CIRCLE');
const circle2 = new MockDOMNode(1, 'CIRCLE');
svgEl.appendChild(circle1);
svgEl.appendChild(circle2);

const spanEl = new MockDOMNode(1, 'SPAN');
const textChild = new MockDOMNode(3, '', 'Весь граф');
spanEl.appendChild(textChild);

buttonEl.appendChild(new MockDOMNode(3, '', '\n  '));
buttonEl.appendChild(svgEl);
buttonEl.appendChild(new MockDOMNode(3, '', '\n  '));
buttonEl.appendChild(spanEl);
buttonEl.appendChild(new MockDOMNode(3, '', '\n'));

// Run scramble directly on the parent button containing SVG and span
runScramble(buttonEl, { duration: 100 });

// Advance animation frame loop
let simulatedTime = performance.now();
for (let step = 0; step < 10; step++) {
  simulatedTime += 25;
  const currentQueue = [...rafQueue];
  rafQueue = [];
  for (const cb of currentQueue) {
    cb(simulatedTime);
  }
}

assert(buttonEl.querySelector('svg') !== null, 'Elements with nested SVG icons preserve the <svg> during scramble text processing');
assert(buttonEl.querySelectorAll('svg').length === 1, 'Exactly one <svg> element remains in button after scramble processing');
assert(buttonEl.querySelectorAll('circle').length === 2, 'Nested SVG child nodes (<circle>) remain fully intact');
assert(buttonEl.querySelector('span') !== null, 'Nested <span> element remains preserved');
assert(buttonEl.textContent.includes('Весь граф'), 'Text content is correctly preserved and restored');

// Also verify an element containing only SVG (no text) preserves the SVG
const svgOnlyBtn = new MockDOMNode(1, 'BUTTON');
const loneSvg = new MockDOMNode(1, 'SVG');
svgOnlyBtn.appendChild(loneSvg);
runScramble(svgOnlyBtn, { duration: 50 });
assert(svgOnlyBtn.querySelector('svg') !== null, 'Element containing only SVG preserves <svg> without textContent wipeout');

// Verify screenshot lightbox & detail UI markers exist
assert(htmlContent.includes('id="screenshot-dialog"'), 'HTML contains #screenshot-dialog modal');
assert(htmlContent.includes('id="screenshot-dialog-img"'), 'HTML contains #screenshot-dialog-img');

// Verify performance optimization markers
assert(htmlContent.includes('https://esm.sh'), 'HTML preconnects esm.sh CDN');
assert(cssContent.includes('content-visibility: auto'), 'CSS enables content-visibility: auto on offscreen Bento cards');
assert(!/\.bg-3d-canvas\s*\{[^}]*filter:/s.test(cssContent), 'CSS avoids expensive full-screen CSS blur shader on .bg-3d-canvas');
assert(!/\.bento-card\s*\{[^}]*backdrop-filter/s.test(cssContent), 'CSS avoids expensive per-card backdrop-filter blur');
assert(!/\.btn\s*\{[^}]*backdrop-filter/s.test(cssContent), 'CSS avoids backdrop-filter compositing on buttons (.btn)');
assert(!/\.canvas-nav-hint\s*\{[^}]*backdrop-filter/s.test(cssContent), 'CSS avoids backdrop-filter compositing on animated .canvas-nav-hint');
assert(!bg3dSource.includes('three@') && bg3dSource.includes('orbSpriteCache'), 'scripts/background3d.js uses lightweight pre-baked 2D depth orbs instead of heavy WebGL/Three.js');
assert(effectsSource.includes('gsap.quickTo'), 'scripts/effects.js uses gsap.quickTo for magnetic cursor tracking');
assert(graphSource.includes('createPattern') && graphSource.includes('IntersectionObserver'), 'scripts/graphCanvas.js uses cached dot CanvasPattern and IntersectionObserver auto-pause');
assert(graphSource.includes('glowSpriteCache') && !graphSource.includes('offsetParent'), 'scripts/graphCanvas.js caches glow sprites and avoids per-frame DOM layout reads');
assert(graphSource.includes('stackNodes') && graphSource.includes('setMode'), 'scripts/graphCanvas.js builds stackNodes and supports setMode(projects/stacks)');
assert(bentoSource.includes('renderStackCards'), 'scripts/bentoGrid.js supports rendering stack cards in "Стеки" mode');
assert(bentoSource.includes('bento-span-4') && !bentoSource.includes('bento-tags') && !bentoSource.includes('bento-footer'), 'scripts/bentoGrid.js renders compact 3-col cards without hashtags (.bento-tags) or bottom bars (.bento-footer)');
assert(bentoSource.includes('packBentoRows') && bentoSource.includes('getProjectWeight') && cssContent.includes('.bento-span-8'), 'Bento grid arranges projects and stacks in staggered checkerboard spans by content weight');

const appSource = readFileSync(resolve(rootDir, 'scripts/app.js'), 'utf-8');
assert(appSource.includes('syncFloatingCloseBtn') && appSource.includes('syncCanvasIntroBackdrop'), 'scripts/app.js wires syncFloatingCloseBtn() and syncCanvasIntroBackdrop()');
assert(appSource.includes('originReason') && dataMod.PROJECTS.every(p => typeof p.originReason === 'string' && p.originReason.length > 20), 'All 16 projects define originReason and app.js renders it on detail view');

assert(existsSync(resolve(rootDir, 'assets/avatar.jpg')), 'assets/avatar.jpg profile avatar file exists');
assert(dataMod.PROFILE_NODE?.avatarUrl === './assets/avatar.jpg', 'PROFILE_NODE configures avatarUrl');
assert(dataMod.PROFILE_NODE?.links?.github === 'https://github.com/callerfft', 'PROFILE_NODE sets GitHub link');
assert(dataMod.PROFILE_NODE?.links?.linkedin?.includes('kamron-nabiev-3b59943b7'), 'PROFILE_NODE sets LinkedIn link');
assert(dataMod.PROFILE_NODE?.links?.telegram === 'https://t.me/yfnntd', 'PROFILE_NODE sets Telegram link');
assert(dataMod.PROFILE_NODE?.links?.email === 'callerff01@gmail.com', 'PROFILE_NODE sets Email contact');
assert(backendStackNames.some(n => /postgresql/i.test(n)) && backendStackNames.some(n => /nginx/i.test(n)), 'Backend hub lists PostgreSQL and Nginx stacks');
assert(htmlContent.includes('callerff01@gmail.com') && htmlContent.includes('github.com/callerfft') && htmlContent.includes('kamron-nabiev-3b59943b7') && htmlContent.includes('t.me/yfnntd'), 'index.html contact modal contains real GitHub, LinkedIn, Telegram and Email');
assert(graphSource.includes('profileAvatarImg') && graphSource.includes('profileAvatarReady'), 'scripts/graphCanvas.js renders circular profile avatar inside singularity core');

// Summary
console.log('\n========================================');
console.log(`Results: ${passedTests} passed, ${failedTests} failed (Total: ${totalTests})`);
console.log('========================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('All automated integrity tests passed successfully!\n');
}
