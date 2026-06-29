/* ========== CANVAS STATE (ZOOM & PAN) ========== */
const canvasState = {
  size: { zoom: 1, panX: 0, panY: 0 },
  spell: { zoom: 1, panX: 0, panY: 0 }
};

/* ========== MOBILE DETECTION ========== */
function isMobile() {
  return window.innerWidth <= 768 || 'ontouchstart' in window;
}

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

function optimizeCanvasForMobile(canvas) {
  if (isMobile()) {
    return Math.min(window.devicePixelRatio || 1, 1.5);
  }
  return Math.min(window.devicePixelRatio || 1, 2);
}

/* ========== HEX DRAWING ========== */
function hexCorners(cx, cy, r, flat = false) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i + (flat ? 0 : Math.PI / 6);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
}

function drawHexOnCtx(ctx, cx, cy, r, fill, stroke, flat = false) {
  const pts = hexCorners(cx, cy, r, flat);
  ctx.beginPath();
  pts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.2; ctx.stroke(); }
}

/* ========== CANVAS ZOOM & PAN ========== */
function zoomCanvas(type, direction) {
  const state = canvasState[type];
  if (direction > 0) {
    state.zoom = Math.min(3, state.zoom + 0.25);
  } else {
    state.zoom = Math.max(0.5, state.zoom - 0.25);
  }
  const zoomDisplay = document.getElementById(`${type}ZoomLevel`);
  if (zoomDisplay) {
    zoomDisplay.textContent = Math.round(state.zoom * 100) + '%';
  }
  if (type === 'size') renderSizeCanvas();
  else if (type === 'spell') renderSpellCanvas();
}

function resetCanvas(type) {
  const state = canvasState[type];
  state.zoom = 1;
  state.panX = 0;
  state.panY = 0;
  const zoomDisplay = document.getElementById(`${type}ZoomLevel`);
  if (zoomDisplay) {
    zoomDisplay.textContent = '100%';
  }
  if (type === 'size') renderSizeCanvas();
  else if (type === 'spell') renderSpellCanvas();
}

function initCanvasPanZoom() {
  ['size', 'spell'].forEach(type => {
    const container = document.getElementById(`${type}CanvasContainer`);
    if (!container) return;
    const state = canvasState[type];
    let isDragging = false;
    let lastX = 0, lastY = 0;

    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      container.style.cursor = 'grabbing';
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      state.panX += e.clientX - lastX;
      state.panY += e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      if (type === 'size') renderSizeCanvas();
      else if (type === 'spell') renderSpellCanvas();
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        container.style.cursor = 'grab';
      }
    });

    container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
      }
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      state.panX += e.touches[0].clientX - lastX;
      state.panY += e.touches[0].clientY - lastY;
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
      if (type === 'size') renderSizeCanvas();
      else if (type === 'spell') renderSpellCanvas();
      e.preventDefault();
    }, { passive: false });

    container.addEventListener('touchend', () => { isDragging = false; });

    container.addEventListener('wheel', (e) => {
      e.preventDefault();
      zoomCanvas(type, e.deltaY < 0 ? 1 : -1);
    });

    container.addEventListener('dblclick', () => { resetCanvas(type); });
  });
}

/* ========== SIZE CANVAS ========== */
const sizeCanvas = document.getElementById('sizeCanvas');
const sctx = sizeCanvas.getContext('2d');
let activeSize = 'sm';

function renderSizeCanvas() {
  const container = document.getElementById('sizeCanvasContainer');
  if (!container || container.offsetWidth === 0) return;
  const dpr = optimizeCanvasForMobile(sizeCanvas);
  const state = canvasState.size;
  const baseW = container.offsetWidth;
  const baseH = Math.max(280, container.offsetHeight);
  sizeCanvas.width = Math.round(baseW * state.zoom * dpr);
  sizeCanvas.height = Math.round(baseH * state.zoom * dpr);
  sizeCanvas.style.width = baseW + 'px';
  sizeCanvas.style.height = baseH + 'px';
  sctx.setTransform(1, 0, 0, 1, 0, 0);
  sctx.scale(dpr * state.zoom, dpr * state.zoom);
  const w = baseW, h = baseH;
  sctx.clearRect(-state.panX / state.zoom, -state.panY / state.zoom, w / state.zoom + 100, h / state.zoom + 100);
  const s = SIZE_DATA[activeSize];
  const baseR = isMobile() ? 18 : 22;
  const r = baseR;
  const cells = s.hexes;
  const centerX = w / 2 + state.panX / state.zoom;
  const centerY = h / 2 + state.panY / state.zoom;
  for (let q = -6; q <= 6; q++) {
    for (let rr = -5; rr <= 5; rr++) {
      const cx = centerX + r * 1.732 * (q + rr * 0.5);
      const cy = centerY + r * 1.5 * rr;
      if (cx < -r || cx > w + r || cy < -r || cy > h + r) continue;
      drawHexOnCtx(sctx, cx, cy, r - 1, '#14093000', '#2a1f4a33');
    }
  }
  cells.forEach(([q, rr]) => {
    const cx = centerX + r * 1.732 * (q + rr * 0.5);
    const cy = centerY + r * 1.5 * rr;
    drawHexOnCtx(sctx, cx, cy, r - 1, s.color + '44', s.color + '99');
  });
  sctx.beginPath();
  sctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
  sctx.fillStyle = '#ff4444';
  sctx.fill();
  sctx.strokeStyle = '#fff8';
  sctx.lineWidth = 1.5;
  sctx.stroke();
}

document.querySelectorAll('.size-btn').forEach(b => {
  b.onclick = () => {
    document.querySelectorAll('.size-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    activeSize = b.dataset.size;
    const s = SIZE_DATA[activeSize];
    document.getElementById('sizeInfo').textContent = `${s.hexCount} · ${s.name}`;
    renderSizeCanvas();
  };
});
document.getElementById('sizeInfo').textContent = '1×1 · Mały (Small)';

/* ========== SPELL CANVAS ========== */
const spellCanvas = document.getElementById('spellCanvas');
const pctx = spellCanvas.getContext('2d');
let selectedSpell = null;

function renderSpellCanvas() {
  const container = document.getElementById('spellCanvasContainer');
  if (!container || container.offsetWidth === 0) return;
  const dpr = optimizeCanvasForMobile(spellCanvas);
  const state = canvasState.spell;
  const baseW = container.offsetWidth;
  const baseH = Math.max(280, container.offsetHeight);
  spellCanvas.width = Math.round(baseW * state.zoom * dpr);
  spellCanvas.height = Math.round(baseH * state.zoom * dpr);
  spellCanvas.style.width = baseW + 'px';
  spellCanvas.style.height = baseH + 'px';
  pctx.setTransform(1, 0, 0, 1, 0, 0);
  pctx.scale(dpr * state.zoom, dpr * state.zoom);
  const w = baseW, h = baseH;
  pctx.clearRect(-state.panX / state.zoom, -state.panY / state.zoom, w / state.zoom + 100, h / state.zoom + 100);
  const shape = document.getElementById('shape').value;
  const radiusHexes = Math.max(1, Math.round(Number(document.getElementById('spellSize').value) / 5));
  const dirIndex = Number(document.getElementById('direction').value);
  const cubeOrigin = document.getElementById('cubeOrigin').value;
  const baseR = isMobile() ? 12 : 14;
  const R = baseR;
  const HexW = R * 1.73205;
  const L = Math.min(radiusHexes * HexW, Math.min(w, h) / 2 - 10);
  const O = { x: w / 2 + state.panX / state.zoom, y: h / 2 + state.panY / state.zoom };
  const showDir = shape === 'cone' || shape === 'line' || shape === 'cube';
  document.getElementById('direction').parentElement.style.opacity = showDir ? '1' : '0.35';
  document.getElementById('originRow').style.display = shape === 'cube' ? 'block' : 'none';
  const angleDeg = dirIndex * 30 - 90;
  const rad = (angleDeg * Math.PI) / 180;
  const F = { x: Math.cos(rad), y: Math.sin(rad) };
  const R_vec = { x: Math.cos(rad + Math.PI / 2), y: Math.sin(rad + Math.PI / 2) };
  let path = new Path2D();
  if (shape === 'sphere') {
    path.arc(O.x, O.y, L, 0, Math.PI * 2);
  } else if (shape === 'cone') {
    const P1 = { x: O.x + L * Math.cos(rad - Math.PI / 6), y: O.y + L * Math.sin(rad - Math.PI / 6) };
    const P2 = { x: O.x + L * Math.cos(rad + Math.PI / 6), y: O.y + L * Math.sin(rad + Math.PI / 6) };
    path.moveTo(O.x, O.y);
    path.lineTo(P1.x, P1.y);
    path.lineTo(P2.x, P2.y);
    path.closePath();
  } else if (shape === 'line') {
    const halfW = Math.min(HexW / 2, L / 6);
    const P1 = { x: O.x - R_vec.x * halfW, y: O.y - R_vec.y * halfW };
    const P2 = { x: O.x + R_vec.x * halfW, y: O.y + R_vec.y * halfW };
    const P3 = { x: P2.x + F.x * L, y: P2.y + F.y * L };
    const P4 = { x: P1.x + F.x * L, y: P1.y + F.y * L };
    path.moveTo(P1.x, P1.y);
    path.lineTo(P2.x, P2.y);
    path.lineTo(P3.x, P3.y);
    path.lineTo(P4.x, P4.y);
    path.closePath();
  } else if (shape === 'cube') {
    const cubeSize = Math.min(L, Math.min(w, h) / 2 - 10);
    let startO = { x: O.x, y: O.y };
    if (cubeOrigin === 'center') {
      startO = { x: O.x - (F.x * cubeSize / 2) - (R_vec.x * cubeSize / 2), y: O.y - (F.y * cubeSize / 2) - (R_vec.y * cubeSize / 2) };
    } else if (cubeOrigin === 'edge') {
      startO = { x: O.x - (R_vec.x * cubeSize / 2), y: O.y - (R_vec.y * cubeSize / 2) };
    } else if (cubeOrigin === 'corner_l') {
      startO = { x: O.x, y: O.y };
    } else if (cubeOrigin === 'corner_r') {
      startO = { x: O.x - (R_vec.x * cubeSize), y: O.y - (R_vec.y * cubeSize) };
    }
    const P2 = { x: startO.x + R_vec.x * cubeSize, y: startO.y + R_vec.y * cubeSize };
    const P3 = { x: startO.x + R_vec.x * cubeSize + F.x * cubeSize, y: startO.y + R_vec.y * cubeSize + F.y * cubeSize };
    const P4 = { x: startO.x + F.x * cubeSize, y: startO.y + F.y * cubeSize };
    path.moveTo(startO.x, startO.y);
    path.lineTo(P2.x, P2.y);
    path.lineTo(P3.x, P3.y);
    path.lineTo(P4.x, P4.y);
    path.closePath();
  }
  let count = 0;
  const hexR = Math.min(R, L / 4);
  for (let q = -12; q <= 12; q++) {
    for (let rr = -12; rr <= 12; rr++) {
      const cx = O.x + HexW * (q + rr * 0.5);
      const cy = O.y + 1.5 * R * rr;
      if (cx < -hexR || cx > w + hexR || cy < -hexR || cy > h + hexR) continue;
      let active = false;
      pctx.save();
      pctx.setTransform(dpr * state.zoom, 0, 0, dpr * state.zoom, 0, 0);
      if (q !== 0 || rr !== 0) {
        active = pctx.isPointInPath(path, cx, cy);
      } else if (shape === 'sphere' || (shape === 'cube' && cubeOrigin === 'center')) {
        active = pctx.isPointInPath(path, cx, cy);
      }
      pctx.restore();
      if (active) count++;
      drawHexOnCtx(pctx, cx, cy, hexR - 1,
        active ? '#a87cff66' : '#14093000',
        active ? '#c4a8ff99' : '#2a1f4a33'
      );
    }
  }
  pctx.lineWidth = 1.5;
  pctx.strokeStyle = '#6bff9ecc';
  pctx.setLineDash([5, 3]);
  pctx.stroke(path);
  pctx.setLineDash([]);
  pctx.beginPath();
  pctx.arc(O.x, O.y, hexR * 0.55, 0, Math.PI * 2);
  pctx.fillStyle = '#444a55';
  pctx.fill();
  pctx.strokeStyle = '#8090aa';
  pctx.lineWidth = 1.5;
  pctx.stroke();
  pctx.beginPath();
  pctx.arc(O.x, O.y, 3, 0, Math.PI * 2);
  pctx.fillStyle = '#aab';
  pctx.fill();
  if (document.getElementById('showCount').checked) {
    pctx.fillStyle = '#c4a8ffcc';
    pctx.font = 'bold 10px Inter,sans-serif';
    pctx.textAlign = 'center';
    pctx.fillText(`${count} hexów`, O.x, h - 8 + state.panY / state.zoom);
  }
}

['shape', 'spellSize', 'direction', 'cubeOrigin'].forEach(id => {
  document.getElementById(id).addEventListener('change', renderSpellCanvas);
});
document.getElementById('showCount').addEventListener('change', renderSpellCanvas);

function renderSpellList(filter = '', levelFilter = 'all', schoolFilter = 'all') {
  const container = document.getElementById('spellList');
  container.innerHTML = '';
  let filtered = SPELLS.filter(s =>
    s.name.toLowerCase().includes(filter.toLowerCase()) ||
    s.desc.toLowerCase().includes(filter.toLowerCase())
  );
  if (levelFilter !== 'all') {
    filtered = filtered.filter(s => s.level === parseInt(levelFilter));
  }
  if (schoolFilter !== 'all') {
    filtered = filtered.filter(s => s.school === schoolFilter);
  }
  if (filtered.length === 0) {
    container.innerHTML = '<span style="font-size:.6rem;color:var(--muted);">Brak zaklęć</span>';
    return;
  }
  filtered.forEach(spell => {
    const tag = document.createElement('span');
    tag.className = 'spell-tag' + (selectedSpell === spell ? ' selected' : '');
    tag.textContent = `${spell.name} (Lvl ${spell.level})`;
    tag.title = `${spell.desc} | Szkoła: ${spell.school}`;
    tag.onclick = () => {
      selectedSpell = spell;
      document.getElementById('shape').value = spell.shape;
      document.getElementById('spellSize').value = spell.size;
      renderSpellList(document.getElementById('spellSearch').value, document.getElementById('spellLevel').value, document.getElementById('spellSchool').value);
      renderSpellCanvas();
      if (typeof playSound === 'function') playSound('add');
    };
    container.appendChild(tag);
  });
}

document.getElementById('spellSearch').addEventListener('input', function () {
  renderSpellList(this.value, document.getElementById('spellLevel').value, document.getElementById('spellSchool').value);
});
document.getElementById('spellLevel').addEventListener('change', function () {
  renderSpellList(document.getElementById('spellSearch').value, this.value, document.getElementById('spellSchool').value);
});
document.getElementById('spellSchool').addEventListener('change', function () {
  renderSpellList(document.getElementById('spellSearch').value, document.getElementById('spellLevel').value, this.value);
});
renderSpellList();