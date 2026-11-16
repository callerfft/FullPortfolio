import { HUBS, PROJECTS, PROFILE_NODE } from '../data/projects.js';

/**
 * Интерактивный бесконечный холст (Obsidian-style Graph View):
 * - Центральный узел профиля (Profile / Core) в (0, 0)
 * - Радиальные силовые магистрали ко всем 6 хабам с бегущими импульсами
 * - 6 категориальных хабов (GameDev, Web UI, RD Tools, Bots Info, AI Vision, Другие проекты)
 * - Pan & Zoom к курсору, dot-grid фон, параллакс «спящих» узлов
 * - Spring physics «выстрел» дочерних веток и затухание неактивных до 20%
 * - Перекрёстные связи при наведении на проект (эффект Obsidian)
 */
export function createGraphCanvas(canvas, callbacks = {}) {
  const ctx = canvas.getContext('2d');
  const reducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const getCanvasDpr = (w, h) =>
    w * h > 2_000_000 ? 1 : Math.min(window.devicePixelRatio || 1, 1.25);

  let width = window.innerWidth;
  let height = window.innerHeight;
  let dpr = getCanvasDpr(width, height);

  let profileAvatarImg = null;
  let profileAvatarReady = false;
  if (PROFILE_NODE.avatarUrl && typeof Image !== 'undefined') {
    profileAvatarImg = new Image();
    profileAvatarImg.onload = () => {
      profileAvatarReady =
        profileAvatarImg.naturalWidth > 0 && profileAvatarImg.naturalHeight > 0;
    };
    profileAvatarImg.src = PROFILE_NODE.avatarUrl;
  }

  // Camera state (world -> screen)
  const cam = {
    x: 0,
    y: 0,
    zoom: 1,
    targetX: 0,
    targetY: 0,
    targetZoom: 1,
  };

  // Interaction state
  let activeHubId = null;
  let showAllNodes = false;
  let hoveredNode = null; // { type: 'profile' | 'hub' | 'project', id: string }
  let selectedProjectId = null;

  const pointer = {
    screenX: -9999,
    screenY: -9999,
    worldX: 0,
    worldY: 0,
    isDown: false,
    isDragging: false,
    downX: 0,
    downY: 0,
    lastX: 0,
    lastY: 0,
  };

  // Ambient background parallax blurred bokeh spheres ("sleeping" nodes)
  const ambientColors = ['#52525b', '#71717a', '#a1a1aa', '#d4d4d8'];
  const ambientNodes = Array.from({ length: 18 }, (_, i) => {
    const angle = (i / 18) * Math.PI * 2 + (i % 3) * 0.45;
    const dist = 190 + ((i * 173) % 640);
    return {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist * 0.72,
      depth: i % 2 === 0 ? 0.28 : 0.52,
      radius: 18 + (i % 4) * 5,
      phase: i * 0.9,
      color: ambientColors[i % ambientColors.length],
    };
  });

  // Offscreen radial glow sprite cache to avoid per-frame createRadialGradient
  const glowSpriteCache = new Map();
  function getGlowSprite(hexColor) {
    let sprite = glowSpriteCache.get(hexColor);
    if (sprite) return sprite;
    const size = 128;
    const half = size / 2;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const gctx = c.getContext('2d');
    if (gctx) {
      const grad = gctx.createRadialGradient(half, half, 2, half, half, half);
      grad.addColorStop(0, `${hexColor}ff`);
      grad.addColorStop(0.35, `${hexColor}66`);
      grad.addColorStop(0.7, `${hexColor}1a`);
      grad.addColorStop(1, `${hexColor}00`);
      gctx.fillStyle = grad;
      gctx.fillRect(0, 0, size, size);
    }
    glowSpriteCache.set(hexColor, c);
    return c;
  }

  function drawGlow(color, cx, cy, outerRadius, peakAlpha = 0.35) {
    if (peakAlpha <= 0.01 || outerRadius <= 1) return;
    const sprite = getGlowSprite(color);
    const prevAlpha = ctx.globalAlpha;
    ctx.globalAlpha = prevAlpha * peakAlpha;
    ctx.drawImage(sprite, cx - outerRadius, cy - outerRadius, outerRadius * 2, outerRadius * 2);
    ctx.globalAlpha = prevAlpha;
  }

  // Hub runtime state with magnetic offset & alpha
  const hubMap = new Map();
  const hubNodes = HUBS.map((h) => {
    const node = {
      ...h,
      type: 'hub',
      ox: 0,
      oy: 0,
      vx: 0,
      vy: 0,
      alpha: 1,
      pulse: Math.random() * Math.PI * 2,
    };
    hubMap.set(h.id, node);
    return node;
  });

  // Build runtime project nodes
  const projectMap = new Map();
  const projectNodes = PROJECTS.map((p) => {
    const primaryHubId = p.hubs[0];
    const primaryHub = hubMap.get(primaryHubId) || hubNodes[0];
    const node = {
      ...p,
      type: 'project',
      nodeKind: 'project',
      primaryHubId,
      allX: primaryHub.x,
      allY: primaryHub.y,
      restX: primaryHub.x,
      restY: primaryHub.y,
      targetX: primaryHub.x,
      targetY: primaryHub.y,
      x: primaryHub.x,
      y: primaryHub.y,
      vx: 0,
      vy: 0,
      scale: 0,
      alpha: 0,
      visible: false,
    };
    projectMap.set(p.id, node);
    return node;
  });

  // Build runtime tech-stack nodes across all hubs
  const stackNodes = [];
  for (const h of HUBS) {
    for (const st of h.techStacks || []) {
      const linkedHubs = new Set([h.id]);
      for (const pid of st.projects || []) {
        const proj = projectMap.get(pid);
        if (proj) {
          for (const ph of proj.hubs) linkedHubs.add(ph);
        }
      }
      stackNodes.push({
        id: `stack:${h.id}:${st.name}`,
        title: st.name,
        type: 'project',
        nodeKind: 'stack',
        hubId: h.id,
        primaryHubId: h.id,
        hubs: [...linkedHubs],
        projectIds: st.projects || [],
        accent: h.color,
        allX: h.x,
        allY: h.y,
        restX: h.x,
        restY: h.y,
        targetX: h.x,
        targetY: h.y,
        x: h.x,
        y: h.y,
        vx: 0,
        vy: 0,
        scale: 0,
        alpha: 0,
        visible: false,
      });
    }
  }

  let graphMode = 'projects'; // 'projects' | 'stacks'
  const getActiveNodes = () => (graphMode === 'stacks' ? stackNodes : projectNodes);

  // Compute deterministic, label-collision-free resting coordinates for "Весь граф"
  function computeAllNodesRestPositions(nodeList) {
    const grouped = new Map();
    for (const p of nodeList) {
      if (!grouped.has(p.primaryHubId)) grouped.set(p.primaryHubId, []);
      grouped.get(p.primaryHubId).push(p);
    }

    for (const [hubId, siblings] of grouped.entries()) {
      const hub = hubMap.get(hubId) || hubNodes[0];
      const outwardAngle = Math.atan2(hub.y, hub.x) || -Math.PI / 2;
      const total = siblings.length;
      const spread = total > 1 ? Math.min(Math.PI * 0.72, (total - 1) * 0.52) : 0;

      siblings.forEach((p, idx) => {
        const angle =
          total > 1
            ? outwardAngle - spread / 2 + (idx / (total - 1)) * spread
            : outwardAngle;
        const orbitRadius = (nodeList.length > 20 ? 182 : 172) + (idx % 2) * 58;
        p.seedX = hub.x + Math.cos(angle) * orbitRadius;
        p.seedY = hub.y + Math.sin(angle) * orbitRadius;
        p.allX = p.seedX;
        p.allY = p.seedY;
      });
    }

    // Iterative pairwise repulsion keeping labels clear of each other, hubs, and center core
    for (let iter = 0; iter < 220; iter++) {
      // Soft tether back to primary hub sector
      for (const p of nodeList) {
        p.allX += (p.seedX - p.allX) * 0.055;
        p.allY += (p.seedY - p.allY) * 0.055;
      }

      // Repel node <-> node using horizontal label ellipse
      for (let i = 0; i < nodeList.length; i++) {
        for (let j = i + 1; j < nodeList.length; j++) {
          const a = nodeList[i];
          const b = nodeList[j];
          let dx = b.allX - a.allX;
          let dy = b.allY - a.allY;
          if (dx === 0 && dy === 0) {
            dx = 1;
            dy = 0.5;
          }
          const rx = nodeList.length > 20 ? 168 : 196;
          const ry = nodeList.length > 20 ? 68 : 76;
          const normDist = Math.hypot(dx / rx, dy / ry);
          if (normDist < 1) {
            const push = (1 - normDist) * 0.55;
            const len = Math.hypot(dx, dy) || 1;
            const px = (dx / len) * push * 42;
            const py = (dy / len) * push * 26;
            a.allX -= px;
            a.allY -= py;
            b.allX += px;
            b.allY += py;
          }
        }
      }

      // Repel node <-> hub labels
      for (const p of nodeList) {
        for (const h of hubNodes) {
          const dx = p.allX - h.x;
          const dy = p.allY - (h.y + 10);
          const rx = 172;
          const ry = 84;
          const normDist = Math.hypot(dx / rx, dy / ry);
          if (normDist < 1) {
            const len = Math.hypot(dx, dy) || 1;
            const push = (1 - normDist) * 58;
            p.allX += (dx / len) * push;
            p.allY += (dy / len) * push;
          }
        }

        // Keep outside center singularity ring
        const cDist = Math.hypot(p.allX, p.allY) || 1;
        if (cDist < 138) {
          const push = 138 - cDist;
          p.allX += (p.allX / cDist) * push;
          p.allY += (p.allY / cDist) * push;
        }
      }
    }

    for (const p of nodeList) {
      p.restX = p.allX;
      p.restY = p.allY;
      p.targetX = p.allX;
      p.targetY = p.allY;
    }
  }

  computeAllNodesRestPositions(projectNodes);
  computeAllNodesRestPositions(stackNodes);

  // Cluster every matching child node neatly around the clicked hub on an outward arc
  function applyHubFocusTargets(hubId, nodeList) {
    const hub = hubMap.get(hubId);
    if (!hub) return;

    const matching = nodeList.filter((p) =>
      p.nodeKind === 'stack' ? p.hubId === hubId : p.hubs.includes(hubId),
    );
    const total = matching.length;
    const outwardAngle = Math.atan2(hub.y, hub.x) || -Math.PI / 2;
    const spread =
      total <= 1
        ? 0
        : total === 2
          ? 1.28
          : total === 3
            ? Math.PI * 0.86
            : Math.PI * 1.12;

    matching.forEach((p, idx) => {
      const angle =
        total > 1
          ? outwardAngle - spread / 2 + (idx / (total - 1)) * spread
          : outwardAngle;
      const orbitRadius = total <= 2 ? 168 : 168 + (idx % 2) * 56;
      p.targetX = hub.x + Math.cos(angle) * orbitRadius;
      p.targetY = hub.y + Math.sin(angle) * orbitRadius;
    });
  }

  function frameHubCluster(hubId) {
    const hub = hubMap.get(hubId);
    if (!hub) return;
    const zoom = width < 520 ? 0.56 : width < 768 ? 0.68 : 0.9;
    const freeCenterX = width >= 960 ? (width - 450) / 2 : width / 2;
    const focusWorldX = hub.x * 0.95;
    const focusWorldY = hub.y * 0.95;
    cam.targetZoom = zoom;
    cam.targetX = (freeCenterX - width / 2) / zoom - focusWorldX;
    cam.targetY = (height * 0.53 - height / 2) / zoom - focusWorldY;
    callbacks.onZoomChange?.(Math.round(zoom * 100));
  }

  function frameFullGraph() {
    const fitZoom = Math.min(
      0.84,
      Math.max(0.32, Math.min((width - 48) / 1240, (height - 160) / 1060)),
    );
    cam.targetX = 0;
    cam.targetY = 18;
    cam.targetZoom = fitZoom;
    callbacks.onZoomChange?.(Math.round(fitZoom * 100));
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = getCanvasDpr(width, height);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }

  function worldToScreen(wx, wy) {
    return {
      x: width / 2 + (wx + cam.x) * cam.zoom,
      y: height / 2 + (wy + cam.y) * cam.zoom,
    };
  }

  function screenToWorld(sx, sy) {
    return {
      x: (sx - width / 2) / cam.zoom - cam.x,
      y: (sy - height / 2) / cam.zoom - cam.y,
    };
  }

  function isNodeVisible(node) {
    if (showAllNodes) return true;
    if (!activeHubId) return false;
    return node.nodeKind === 'stack' ? node.hubId === activeHubId : node.hubs.includes(activeHubId);
  }

  function triggerSpringBurst(sourceHubId) {
    const activeNodes = getActiveNodes();
    const sourceHub = hubMap.get(sourceHubId);
    if (activeHubId) {
      applyHubFocusTargets(activeHubId, activeNodes);
    }
    for (const pNode of activeNodes) {
      const shouldShow = isNodeVisible(pNode);
      if (shouldShow && !pNode.visible) {
        const origin = sourceHub || hubMap.get(pNode.primaryHubId);
        pNode.x = origin.x;
        pNode.y = origin.y;
        pNode.vx = (pNode.targetX - origin.x) * 0.22;
        pNode.vy = (pNode.targetY - origin.y) * 0.22;
        pNode.scale = 0.2;
      }
      pNode.visible = shouldShow;
    }
  }

  function selectHub(hubId) {
    if (activeHubId === hubId) {
      activeHubId = null;
      resetView();
    } else {
      activeHubId = hubId;
      frameHubCluster(hubId);
    }
    selectedProjectId = null;
    callbacks.onSelectProject?.(null);
    callbacks.onHubChange?.(activeHubId);
    triggerSpringBurst(hubId);
  }

  function setShowAll(value) {
    showAllNodes = Boolean(value);
    const activeNodes = getActiveNodes();
    if (showAllNodes) {
      activeHubId = null;
      callbacks.onHubChange?.(null);
      frameFullGraph();
    } else {
      resetView();
    }
    for (const pNode of activeNodes) {
      pNode.targetX = pNode.allX;
      pNode.targetY = pNode.allY;
      const shouldShow = isNodeVisible(pNode);
      if (shouldShow && !pNode.visible) {
        const origin = hubMap.get(pNode.primaryHubId);
        pNode.x = origin.x;
        pNode.y = origin.y;
        pNode.vx = (pNode.targetX - origin.x) * 0.18;
        pNode.vy = (pNode.targetY - origin.y) * 0.18;
        pNode.scale = 0.2;
      }
      pNode.visible = shouldShow;
    }
  }

  function setMode(nextMode) {
    const normalized = nextMode === 'stacks' ? 'stacks' : 'projects';
    if (normalized === graphMode) return;

    for (const node of getActiveNodes()) {
      node.visible = false;
      node.alpha = 0;
      node.scale = 0;
    }

    graphMode = normalized;
    hoveredNode = null;
    selectedProjectId = null;
    callbacks.onSelectProject?.(null);

    if (showAllNodes) {
      setShowAll(true);
    } else if (activeHubId) {
      triggerSpringBurst(activeHubId);
    }
  }

  function getDefaultCamera() {
    const z =
      width < 768
        ? Math.min(0.68, Math.max(0.42, (width - 48) / 720))
        : Math.min(1, Math.max(0.76, (height - 130) / 680));
    return { x: 0, y: width < 768 ? -42 : 28, zoom: z };
  }

  function resetView() {
    const def = getDefaultCamera();
    cam.targetX = def.x;
    cam.targetY = def.y;
    cam.targetZoom = def.zoom;
    selectedProjectId = null;
    callbacks.onSelectProject?.(null);
  }

  function zoomBy(factor, pivotX = width / 2, pivotY = height / 2) {
    const prevZoom = cam.targetZoom;
    const nextZoom = Math.min(2.3, Math.max(0.3, prevZoom * factor));
    if (nextZoom === prevZoom) return;

    const worldPivotX = (pivotX - width / 2) / prevZoom - cam.targetX;
    const worldPivotY = (pivotY - height / 2) / prevZoom - cam.targetY;

    cam.targetZoom = nextZoom;
    cam.targetX = (pivotX - width / 2) / nextZoom - worldPivotX;
    cam.targetY = (pivotY - height / 2) / nextZoom - worldPivotY;
    callbacks.onZoomChange?.(Math.round(nextZoom * 100));
  }

  function hitTest(sx, sy) {
    const activeNodes = getActiveNodes();
    // 1. Check visible child nodes first (drawn on top)
    for (let i = activeNodes.length - 1; i >= 0; i--) {
      const p = activeNodes[i];
      if (!p.visible || p.alpha < 0.25) continue;
      const pos = worldToScreen(p.x, p.y);
      const hitR = 22 * cam.zoom + 8;
      if (Math.hypot(sx - pos.x, sy - pos.y) <= hitR) {
        return { type: 'project', id: p.id, node: p };
      }
    }

    // 2. Check hub nodes
    for (let i = hubNodes.length - 1; i >= 0; i--) {
      const h = hubNodes[i];
      const pos = worldToScreen(h.x + h.ox, h.y + h.oy);
      const hitR = 32 * cam.zoom + 10;
      if (Math.hypot(sx - pos.x, sy - pos.y) <= hitR) {
        return { type: 'hub', id: h.id, node: h };
      }
    }

    // 3. Check central profile node at (0, 0)
    const centerPos = worldToScreen(0, 0);
    const centerHitR = 36 * cam.zoom + 12;
    if (Math.hypot(sx - centerPos.x, sy - centerPos.y) <= centerHitR) {
      return { type: 'profile', id: 'profile', node: PROFILE_NODE };
    }

    return null;
  }

  function handlePointerDown(e) {
    if (e.button !== 0) return;
    pointer.isDown = true;
    pointer.isDragging = false;
    pointer.downX = e.clientX;
    pointer.downY = e.clientY;
    pointer.lastX = e.clientX;
    pointer.lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e) {
    pointer.screenX = e.clientX;
    pointer.screenY = e.clientY;
    const wPos = screenToWorld(e.clientX, e.clientY);
    pointer.worldX = wPos.x;
    pointer.worldY = wPos.y;

    if (pointer.isDown) {
      const dx = e.clientX - pointer.lastX;
      const dy = e.clientY - pointer.lastY;
      if (Math.hypot(e.clientX - pointer.downX, e.clientY - pointer.downY) > 5) {
        pointer.isDragging = true;
        canvas.classList.add('is-panning');
      }
      if (pointer.isDragging) {
        cam.targetX += dx / cam.zoom;
        cam.targetY += dy / cam.zoom;
        cam.x = cam.targetX;
        cam.y = cam.targetY;
      }
      pointer.lastX = e.clientX;
      pointer.lastY = e.clientY;
      return;
    }

    const hit = hitTest(e.clientX, e.clientY);
    hoveredNode = hit ? { type: hit.type, id: hit.id } : null;
    canvas.style.cursor = hit ? 'pointer' : 'grab';
  }

  function handlePointerUp(e) {
    if (!pointer.isDown) return;
    pointer.isDown = false;
    canvas.classList.remove('is-panning');

    if (!pointer.isDragging) {
      const hit = hitTest(e.clientX, e.clientY);
      if (hit?.type === 'profile') {
        callbacks.onSelectProfile?.();
      } else if (hit?.type === 'hub') {
        selectHub(hit.id);
      } else if (hit?.type === 'project') {
        selectedProjectId = hit.id;
        const pNode = hit.node;
        const pos = worldToScreen(pNode.x, pNode.y);
        callbacks.onSelectProject?.(pNode, pos);
      } else {
        // Click on empty space closes preview or resets hub focus
        if (selectedProjectId) {
          selectedProjectId = null;
          callbacks.onSelectProject?.(null);
        } else if (activeHubId) {
          selectHub(activeHubId);
        }
      }
    }
    pointer.isDragging = false;
  }

  function handleWheel(e) {
    // If at minimum zoom and scrolling down, allow page to scroll down to Bento section
    if (e.deltaY > 0 && cam.targetZoom <= 0.6) {
      callbacks.onScrollDown?.();
      return;
    }

    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.91;
    zoomBy(factor, e.clientX, e.clientY);
  }

  // Draw helper: dot grid background using cached CanvasPattern (1 fillRect instead of hundreds)
  let dotPattern = null;
  let cachedTileSize = 0;

  function drawDotGrid() {
    const spacing = Math.round(44 * cam.zoom);
    if (spacing < 14) return;
    if (!dotPattern || cachedTileSize !== spacing) {
      cachedTileSize = spacing;
      const tile = document.createElement('canvas');
      tile.width = spacing;
      tile.height = spacing;
      const tctx = tile.getContext('2d');
      if (tctx) {
        tctx.fillStyle = 'rgba(255, 255, 255, 0.085)';
        tctx.fillRect(0, 0, 1.5, 1.5);
        dotPattern = ctx.createPattern(tile, 'repeat');
      }
    }
    if (!dotPattern) return;

    const offsetX = ((width / 2 + cam.x * cam.zoom) % spacing + spacing) % spacing;
    const offsetY = ((height / 2 + cam.y * cam.zoom) % spacing + spacing) % spacing;

    ctx.save();
    ctx.translate(offsetX - 0.75, offsetY - 0.75);
    ctx.fillStyle = dotPattern;
    ctx.fillRect(-spacing, -spacing, width + spacing * 2, height + spacing * 2);
    ctx.restore();
  }

  // Draw parallax ambient blurred bokeh "sleeping" spheres
  function drawAmbientParallax(time) {
    const scaleFactor = 0.65 + cam.zoom * 0.35;
    for (let i = 0; i < ambientNodes.length; i++) {
      const n = ambientNodes[i];
      const driftX = reducedMotion() ? 0 : Math.sin(time * 0.35 + n.phase) * 8;
      const driftY = reducedMotion() ? 0 : Math.cos(time * 0.28 + n.phase) * 8;
      const sx = width / 2 + (n.x + cam.x * n.depth + driftX) * scaleFactor;
      const sy = height / 2 + (n.y + cam.y * n.depth + driftY) * scaleFactor;
      const r = n.radius * scaleFactor;
      if (sx < -r || sx > width + r || sy < -r || sy > height + r) continue;
      drawGlow(n.color, sx, sy, r, 0.16);
    }
  }

  function updatePhysics(time) {
    // Smooth camera interpolation
    cam.x += (cam.targetX - cam.x) * 0.16;
    cam.y += (cam.targetY - cam.y) * 0.16;
    cam.zoom += (cam.targetZoom - cam.zoom) * 0.16;

    const activeNodes = getActiveNodes();
    const focusProjectId =
      hoveredNode?.type === 'project' ? hoveredNode.id : selectedProjectId;
    const focusedProject = focusProjectId
      ? activeNodes.find((p) => p.id === focusProjectId)
      : null;

    // Hub magnetic pull + focus dimming (20% opacity for inactive hubs)
    for (const h of hubNodes) {
      const pos = worldToScreen(h.x, h.y);
      const dist = Math.hypot(pointer.screenX - pos.x, pointer.screenY - pos.y);
      let targetOx = 0;
      let targetOy = 0;

      if (!pointer.isDragging && dist < 120 && !reducedMotion()) {
        const pull = (1 - dist / 120) * 0.24;
        targetOx = ((pointer.screenX - pos.x) / cam.zoom) * pull;
        targetOy = ((pointer.screenY - pos.y) / cam.zoom) * pull;
      }

      // Spring toward magnetic offset
      const stiffness = 0.14;
      const damping = 0.72;
      h.vx = (h.vx + (targetOx - h.ox) * stiffness) * damping;
      h.vy = (h.vy + (targetOy - h.oy) * stiffness) * damping;
      h.ox += h.vx;
      h.oy += h.vy;

      const isCrossLinked = focusedProject?.hubs.includes(h.id);
      const isHovered = hoveredNode?.type === 'hub' && hoveredNode.id === h.id;
      const targetAlpha =
        !activeHubId && !showAllNodes
          ? 1
          : activeHubId === h.id || isCrossLinked || isHovered || showAllNodes
            ? 1
            : 0.2;

      h.alpha += (targetAlpha - h.alpha) * 0.14;
      h.pulse = time * 2.2;
    }

    // Active child nodes spring physics
    for (const p of activeNodes) {
      const targetAlpha = p.visible ? 1 : 0;
      p.alpha += (targetAlpha - p.alpha) * 0.14;
      p.scale += ((p.visible ? 1 : 0.2) - p.scale) * 0.16;

      if (p.visible) {
        // Spring to active target position (hub-focused or full-graph layout)
        const k = 0.095;
        const damp = 0.76;
        p.vx = (p.vx + (p.targetX - p.x) * k) * damp;
        p.vy = (p.vy + (p.targetY - p.y) * k) * damp;
        p.x += p.vx;
        p.y += p.vy;
      }
    }
  }

  function drawEdges(time) {
    const focusProjectId =
      hoveredNode?.type === 'project' ? hoveredNode.id : selectedProjectId;

    const cScreen = worldToScreen(0, 0);

    // 1. Singularity harmonic wave streams from Center (Profile) to all Hubs
    for (let i = 0; i < hubNodes.length; i++) {
      const h = hubNodes[i];
      const hScreen = worldToScreen(h.x + h.ox, h.y + h.oy);

      const dx = hScreen.x - cScreen.x;
      const dy = hScreen.y - cScreen.y;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;

      ctx.save();
      ctx.globalAlpha = Math.max(0.22, h.alpha * 0.72);

      if (activeHubId === h.id) {
        // Moving wave crest gradient along the active stream
        const rawPhase = reducedMotion() ? 0.5 : (time * 0.38 + i * 0.17);
        const wavePhase = ((rawPhase % 1) + 1) % 1;
        const c1 = Math.max(0, wavePhase - 0.16);
        const c2 = Math.min(1, wavePhase + 0.16);

        const highwayGrad = ctx.createLinearGradient(cScreen.x, cScreen.y, hScreen.x, hScreen.y);
        highwayGrad.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
        highwayGrad.addColorStop(c1, `${h.color}28`);
        highwayGrad.addColorStop(wavePhase, `${h.color}aa`);
        highwayGrad.addColorStop(c2, `${h.color}28`);
        highwayGrad.addColorStop(1, `${h.color}55`);
        ctx.strokeStyle = highwayGrad;
      } else {
        ctx.strokeStyle = `${h.color}55`;
      }

      ctx.lineWidth = activeHubId === h.id ? 2.1 : 1.4;
      ctx.beginPath();

      const steps = 12;
      const amp = reducedMotion() ? 0 : 4.2 * Math.max(0.65, Math.min(1.2, cam.zoom));
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const envelope = Math.sin(t * Math.PI);
        const ripple = Math.sin(t * 10 - time * 2.6 + i * 1.1) * amp * envelope;
        const px = cScreen.x + dx * t + nx * ripple;
        const py = cScreen.y + dy * t + ny * ripple;
        if (s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();
    }

    // 2. Subtle resting constellation lines between neighbor hubs
    ctx.save();
    for (let i = 0; i < hubNodes.length; i++) {
      const a = hubNodes[i];
      const b = hubNodes[(i + 1) % hubNodes.length];
      const pa = worldToScreen(a.x + a.ox, a.y + a.oy);
      const pb = worldToScreen(b.x + b.ox, b.y + b.oy);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 7]);
      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.stroke();
    }
    ctx.restore();

    // 3. Neural edges from hubs -> visible active nodes (and Obsidian cross-links)
    const activeNodes = getActiveNodes();
    for (const p of activeNodes) {
      if (p.alpha < 0.04) continue;
      const pScreen = worldToScreen(p.x, p.y);
      const isFocusedProject = focusProjectId === p.id;

      for (const hId of p.hubs) {
        const hub = hubMap.get(hId);
        if (!hub) continue;
        const isPrimary = hId === activeHubId || (showAllNodes && hId === p.primaryHubId);
        const isCrossEdge =
          isFocusedProject &&
          (activeHubId ? hId !== activeHubId : hId !== p.primaryHubId);

        if (!isPrimary && !isCrossEdge) continue;

        const hScreen = worldToScreen(hub.x + hub.ox, hub.y + hub.oy);
        const midX = (hScreen.x + pScreen.x) / 2 + (pScreen.y - hScreen.y) * 0.1;
        const midY = (hScreen.y + pScreen.y) / 2 - (pScreen.x - hScreen.x) * 0.1;

        ctx.save();
        const edgeAlpha = isFocusedProject
          ? 0.92
          : focusProjectId
            ? 0.18
            : p.alpha * 0.65;

        ctx.globalAlpha = edgeAlpha;
        const edgeColor = isCrossEdge ? hub.color : p.accent;
        if (isFocusedProject || isCrossEdge) {
          const edgeGrad = ctx.createLinearGradient(hScreen.x, hScreen.y, pScreen.x, pScreen.y);
          const rawFlow = reducedMotion() ? 0.5 : time * 0.55 + p.targetX * 0.002;
          const flowT = ((rawFlow % 1) + 1) % 1;
          edgeGrad.addColorStop(0, `${edgeColor}55`);
          edgeGrad.addColorStop(Math.max(0, flowT - 0.15), `${edgeColor}88`);
          edgeGrad.addColorStop(flowT, '#ffffffcc');
          edgeGrad.addColorStop(Math.min(1, flowT + 0.15), `${edgeColor}88`);
          edgeGrad.addColorStop(1, `${edgeColor}66`);
          ctx.strokeStyle = edgeGrad;
        } else {
          ctx.strokeStyle = `${edgeColor}88`;
        }
        ctx.lineWidth = isFocusedProject ? 2.1 : 1.35;
        if (isCrossEdge) {
          ctx.setLineDash([5, 5]);
        }

        ctx.beginPath();
        ctx.moveTo(hScreen.x, hScreen.y);
        ctx.quadraticCurveTo(midX, midY, pScreen.x, pScreen.y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  function drawCentralProfile(time) {
    const pos = worldToScreen(0, 0);
    const isHovered = hoveredNode?.type === 'profile';
    const baseR = (isHovered ? 36 : 32) * Math.max(0.75, Math.min(1.25, cam.zoom));

    ctx.save();

    // 1. Singularity gravitational ripple waves expanding smoothly from center
    if (!reducedMotion()) {
      for (let w = 0; w < 3; w++) {
        const phase = (((time * 0.28 + w / 3) % 1) + 1) % 1;
        const waveR = baseR * (1.1 + phase * 2.5);
        const waveAlpha = (1 - phase) * 0.24;
        ctx.strokeStyle = `rgba(255, 255, 255, ${waveAlpha.toFixed(3)})`;
        ctx.lineWidth = 1.1 * (1 - phase * 0.5);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, waveR, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // 2. Soft accretion glow around the event horizon (cached offscreen sprite)
    const pulseFactor = reducedMotion() ? 1 : 1 + Math.sin(time * 2.2) * 0.08;
    drawGlow('#a1a1aa', pos.x, pos.y, baseR * 2.8 * pulseFactor, 0.16);
    drawGlow('#ffffff', pos.x, pos.y, baseR * 2.3 * pulseFactor, 0.22);

    // 3. Outer event-horizon background
    ctx.fillStyle = '#050507';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, baseR, 0, Math.PI * 2);
    ctx.fill();

    // 4. User avatar inside the singularity core (with fallback glyph)
    if (profileAvatarReady && profileAvatarImg) {
      const innerR = baseR * 0.88;
      const imgW = profileAvatarImg.naturalWidth;
      const imgH = profileAvatarImg.naturalHeight;
      const cropSize = Math.min(imgW, imgH);
      const sx = (imgW - cropSize) * 0.5;
      const sy = (imgH - cropSize) * 0.5;

      ctx.save();
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, innerR, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(
        profileAvatarImg,
        sx,
        sy,
        cropSize,
        cropSize,
        pos.x - innerR,
        pos.y - innerR,
        innerR * 2,
        innerR * 2,
      );
      ctx.restore();
    } else {
      ctx.strokeStyle = 'rgba(200, 255, 50, 0.32)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, baseR * 0.76, 0, Math.PI * 2);
      ctx.stroke();

      ctx.save();
      ctx.translate(pos.x, pos.y);
      const scale = (baseR / 32) * 0.95;
      ctx.scale(scale, scale);

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 1, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-9, -4);
      ctx.lineTo(-6, -12);
      ctx.lineTo(-1, -7);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(9, -4);
      ctx.lineTo(6, -12);
      ctx.lineTo(1, -7);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#0a0d14';
      ctx.beginPath();
      ctx.arc(-3.5, 0.5, 2.2, 0, Math.PI * 2);
      ctx.arc(3.5, 0.5, 2.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f4f4f6';
      ctx.beginPath();
      ctx.arc(-3.5, 0.5, 1, 0, Math.PI * 2);
      ctx.arc(3.5, 0.5, 1, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // Outer event-horizon border ring over avatar/core
    ctx.strokeStyle = isHovered ? '#ffffff' : 'rgba(244, 244, 246, 0.72)';
    ctx.lineWidth = isHovered ? 2.6 : 1.8;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, baseR, 0, Math.PI * 2);
    ctx.stroke();

    // 5. Label below profile node
    const fontSize = Math.round(13.5 * Math.max(0.85, Math.min(1.15, cam.zoom)));
    ctx.font = `700 ${fontSize}px "Syne", sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('Yohanson', pos.x, pos.y + baseR + 19);

    const subFontSize = Math.round(10 * Math.max(0.82, Math.min(1.1, cam.zoom)));
    ctx.font = `500 ${subFontSize}px "JetBrains Mono", monospace`;
    ctx.fillStyle = '#a1a1aa';
    ctx.fillText('CORE / PROFILE', pos.x, pos.y + baseR + 34);

    ctx.restore();
  }

  function drawHubNodes(time) {
    const labelFont = `700 ${Math.round(13 * Math.max(0.85, Math.min(1.15, cam.zoom)))}px "Syne", sans-serif`;
    const subFont = `400 ${Math.round(10.5 * Math.max(0.82, Math.min(1.1, cam.zoom)))}px "JetBrains Mono", monospace`;
    const zoomScale = Math.max(0.75, Math.min(1.25, cam.zoom));
    ctx.textAlign = 'center';

    for (const h of hubNodes) {
      const pos = worldToScreen(h.x + h.ox, h.y + h.oy);
      const isHovered = hoveredNode?.type === 'hub' && hoveredNode.id === h.id;
      const isActive = activeHubId === h.id;
      const baseR = (isActive ? 25 : 21) * zoomScale;

      ctx.save();
      ctx.globalAlpha = h.alpha;

      // Pulsing outer halo on hover or active (cached offscreen sprite)
      if ((isHovered || isActive) && !reducedMotion()) {
        const pulseScale = 1 + Math.sin(time * 4) * 0.14;
        drawGlow(h.color, pos.x, pos.y, baseR * 2.4 * pulseScale, 0.36);
      } else {
        drawGlow(h.color, pos.x, pos.y, baseR * 1.9, 0.2);
      }

      // Frosted core circle
      ctx.fillStyle = '#0e1118';
      ctx.strokeStyle = h.color;
      ctx.lineWidth = isActive || isHovered ? 2.4 : 1.6;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, baseR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Inner core dot
      ctx.fillStyle = h.color;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, isActive ? 6.5 : 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.font = labelFont;
      ctx.fillStyle = '#f2f4f8';
      ctx.fillText(h.label, pos.x, pos.y + baseR + 20);

      ctx.font = subFont;
      ctx.fillStyle = '#8b94a5';
      ctx.fillText(h.subtitle, pos.x, pos.y + baseR + 36);

      ctx.restore();
    }
  }

  function drawProjectNodes() {
    const activeNodes = getActiveNodes();
    const focusProjectId =
      hoveredNode?.type === 'project' ? hoveredNode.id : selectedProjectId;
    const zoomScale = Math.max(0.75, Math.min(1.25, cam.zoom));
    ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';

    for (const p of activeNodes) {
      if (p.alpha < 0.03) continue;
      const pos = worldToScreen(p.x, p.y);
      const isFocused = focusProjectId === p.id;
      const dimmed = focusProjectId && !isFocused ? 0.35 : 1;
      const baseSize = p.nodeKind === 'stack' ? (isFocused ? 15 : 12) : (isFocused ? 14 : 10.5);
      const r = baseSize * p.scale * zoomScale;

      ctx.save();
      ctx.globalAlpha = p.alpha * dimmed;

      // Glow (cached offscreen sprite)
      drawGlow(p.accent, pos.x, pos.y, r * 2.5, isFocused ? 0.45 : 0.32);

      // Node circle
      ctx.fillStyle = isFocused ? p.accent : '#121620';
      ctx.strokeStyle = p.accent;
      ctx.lineWidth = isFocused ? 2.2 : 1.5;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // For stack nodes, show linked project count cleanly inside the ring
      if (p.nodeKind === 'stack' && p.projectIds?.length && r >= 8) {
        ctx.font = '600 10px "JetBrains Mono", monospace';
        ctx.fillStyle = isFocused ? '#07080a' : p.accent;
        ctx.textBaseline = 'middle';
        ctx.fillText(String(p.projectIds.length), pos.x, pos.y + 0.5);
        ctx.textBaseline = 'alphabetic';
        ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
      }

      // Title (keep resting canvas labels concise; reveal full title on hover/focus)
      const label =
        isFocused || p.title.length <= 24 ? p.title : `${p.title.slice(0, 22).trimEnd()}…`;
      ctx.fillStyle = '#f2f4f8';
      ctx.fillText(label, pos.x, pos.y + r + 17);

      ctx.restore();
    }
  }

  let rafId = 0;
  let isCanvasInView = true;
  let isTabVisible = !document.hidden;
  const clockStart = performance.now();

  function canRenderFrame() {
    return isTabVisible && isCanvasInView && document.body.classList.contains('canvas-active');
  }

  function ensureRunning() {
    if (!rafId && canRenderFrame()) {
      rafId = requestAnimationFrame(frame);
    }
  }

  function frame(now) {
    if (!canRenderFrame()) {
      rafId = 0;
      return;
    }

    const time = Math.max(0, (now - clockStart) * 0.001);

    updatePhysics(time);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    drawDotGrid();
    drawAmbientParallax(time);
    drawEdges(time);
    drawCentralProfile(time);
    drawHubNodes(time);
    drawProjectNodes();

    if (selectedProjectId) {
      const pNode = getActiveNodes().find((p) => p.id === selectedProjectId);
      if (pNode) {
        callbacks.onTrackSelectedNode?.(pNode, worldToScreen(pNode.x, pNode.y));
      }
    }

    rafId = requestAnimationFrame(frame);
  }

  resize();
  const initialCam = getDefaultCamera();
  cam.x = initialCam.x;
  cam.y = initialCam.y;
  cam.zoom = initialCam.zoom;
  cam.targetX = initialCam.x;
  cam.targetY = initialCam.y;
  cam.targetZoom = initialCam.zoom;

  const onVisibilityChange = () => {
    isTabVisible = !document.hidden;
    ensureRunning();
  };

  let observer = null;
  if (typeof IntersectionObserver !== 'undefined') {
    observer = new IntersectionObserver(
      (entries) => {
        isCanvasInView = Boolean(entries[0]?.isIntersecting);
        ensureRunning();
      },
      { threshold: 0.01 },
    );
    observer.observe(canvas);
  }

  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', onVisibilityChange);
  canvas.addEventListener('pointerdown', handlePointerDown);
  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  window.addEventListener('pointerup', handlePointerUp);
  canvas.addEventListener('wheel', handleWheel, { passive: false });

  rafId = requestAnimationFrame(frame);

  return {
    selectHub,
    setShowAll,
    setMode,
    resetView,
    zoomBy,
    wake: ensureRunning,
    getActiveHubId: () => activeHubId,
    getZoomPercent: () => Math.round(cam.targetZoom * 100),
    clearSelection: () => {
      selectedProjectId = null;
      callbacks.onSelectProject?.(null);
    },
    destroy: () => {
      cancelAnimationFrame(rafId);
      observer?.disconnect();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('wheel', handleWheel);
    },
  };
}
