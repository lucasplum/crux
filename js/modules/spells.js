// ============================================================
//  SPELLS
// ============================================================

var selectedSpell = null;

var spellCanvas = document.getElementById('spellCanvas');
var pctx = spellCanvas ? spellCanvas.getContext('2d') : null;

// ---- LISTA ZAKLĘĆ Z POLSKIMI I ANGIELSKIMI NAZWAMI ----
var SPELLS = [
  { name: 'Kula Ognia (Fireball)', shape: 'sphere', size: 20, desc: '🔥 8k6, promień 20 ft', school: 'Ewokacja', level: 3 },
  { name: 'Kula Lodu (Ice Storm)', shape: 'sphere', size: 20, desc: '❄️ 8k6, promień 20 ft', school: 'Ewokacja', level: 3 },
  { name: 'Meteor (Meteor Swarm)', shape: 'sphere', size: 40, desc: '☄️ 20k6, promień 40 ft', school: 'Ewokacja', level: 9 },
  { name: 'Stożek Zimna (Cone of Cold)', shape: 'cone', size: 60, desc: '❄️ 8k6, stożek 60 ft', school: 'Ewokacja', level: 5 },
  { name: 'Ognisty Oddech (Dragon\'s Breath)', shape: 'cone', size: 30, desc: '🔥 5k6, stożek 30 ft', school: 'Ewokacja', level: 2 },
  { name: 'Promień Światła (Sunbeam)', shape: 'line', size: 120, desc: '💫 10k6, linia 120 ft', school: 'Ewokacja', level: 6 },
  { name: 'Piorun (Lightning Bolt)', shape: 'line', size: 100, desc: '⚡ 8k6, linia 100 ft', school: 'Ewokacja', level: 3 },
  { name: 'Kula Śmierci (Circle of Death)', shape: 'sphere', size: 30, desc: '💀 12k6 nekrotycznych, promień 30 ft', school: 'Nekromancja', level: 6 },
  { name: 'Sześcian Ognia (Fire Cube)', shape: 'cube', size: 30, desc: '🔥 10k6, sześcian 30 ft', school: 'Ewokacja', level: 4 },
  { name: 'Błogosławieństwo (Bless)', shape: 'sphere', size: 30, desc: '✨ Buff, promień 30 ft', school: 'Oczarowanie', level: 1 },
  { name: 'Mroczna Moc (Revivify)', shape: 'sphere', size: 20, desc: '🌑 Przywraca życie, promień 20 ft', school: 'Nekromancja', level: 3 },
  { name: 'Aura Życia (Aura of Life)', shape: 'sphere', size: 30, desc: '💚 Leczenie, promień 30 ft', school: 'Oczarowanie', level: 4 },
  { name: 'Bariera (Shield of Faith)', shape: 'sphere', size: 10, desc: '🛡️ +2 KP, promień 10 ft', school: 'Ochrona', level: 1 },
  { name: 'Mroczna Chmura (Dark Cloud)', shape: 'sphere', size: 30, desc: '☁️ Zasłona, promień 30 ft', school: 'Czarowanie', level: 2 },
  { name: 'Ściana Ognia (Wall of Fire)', shape: 'line', size: 60, desc: '🔥 Ściana 60 ft', school: 'Ewokacja', level: 4 },
  { name: 'Krąg Ochrony (Circle of Power)', shape: 'sphere', size: 30, desc: '🔮 Antymagia, promień 30 ft', school: 'Ochrona', level: 6 },
  { name: 'Uścisk Ziemi (Earthbind)', shape: 'cube', size: 20, desc: '🪨 Trzyma wrogów, sześcian 20 ft', school: 'Przyzywanie', level: 2 },
  { name: 'Mroczne Oczy (Eyebite)', shape: 'cone', size: 30, desc: '👁️ Paraliż, stożek 30 ft', school: 'Nekromancja', level: 4 },
  { name: 'Tarcza Światła (Sunburst)', shape: 'sphere', size: 15, desc: '✨ Oślepia, promień 15 ft', school: 'Ewokacja', level: 2 },
];

// ====== RENDER LISTY ZAKLĘĆ ======
function renderSpellList(filter, levelFilter, schoolFilter) {
  filter = filter || '';
  levelFilter = levelFilter || 'all';
  schoolFilter = schoolFilter || 'all';

  var container = document.getElementById('spellList');
  if (!container) return;
  container.innerHTML = '';

  var filtered = SPELLS.filter(function(s) {
    return s.name.toLowerCase().includes(filter.toLowerCase()) ||
           s.desc.toLowerCase().includes(filter.toLowerCase());
  });

  if (levelFilter !== 'all') {
    filtered = filtered.filter(function(s) { return s.level === parseInt(levelFilter); });
  }
  if (schoolFilter !== 'all') {
    filtered = filtered.filter(function(s) { return s.school === schoolFilter; });
  }

  if (filtered.length === 0) {
    container.innerHTML = '<span style="font-size:.6rem;color:var(--muted);">Brak zaklęć</span>';
    return;
  }

  filtered.forEach(function(spell) {
    var tag = document.createElement('span');
    tag.className = 'spell-tag' + (selectedSpell === spell ? ' selected' : '');
    tag.textContent = spell.name + ' (Lvl ' + spell.level + ')';
    tag.title = spell.desc + ' | ' + spell.school;
    tag.onclick = function() {
      selectedSpell = spell;
      var shapeSelect = document.getElementById('shape');
      var sizeSelect = document.getElementById('spellSize');
      if (shapeSelect) shapeSelect.value = spell.shape;
      if (sizeSelect) sizeSelect.value = spell.size;
      renderSpellList(
        document.getElementById('spellSearch') ? document.getElementById('spellSearch').value : '',
        document.getElementById('spellLevel') ? document.getElementById('spellLevel').value : 'all',
        document.getElementById('spellSchool') ? document.getElementById('spellSchool').value : 'all'
      );
      renderSpellCanvas();
      playSound('add');
    };
    container.appendChild(tag);
  });
}

// ====== RENDER CANVAS ZAKLĘĆ ======
function renderSpellCanvas() {
  var container = document.getElementById('spellCanvasContainer');
  if (!container || container.offsetWidth === 0 || !spellCanvas || !pctx) return;

  var dims = getCanvasDimensions('spell');
  if (dims.width === 0 || dims.height === 0) {
    dims.width = container.offsetWidth;
    dims.height = Math.max(280, container.offsetHeight);
    canvasDimensions.spell.width = dims.width;
    canvasDimensions.spell.height = dims.height;
  }

  var state = canvasState.spell;
  clampPan('spell');

  var dpr = dims.dpr;
  var canvasW = dims.width;
  var canvasH = dims.height;

  // Ustawiamy canvas na stałe wymiary
  spellCanvas.width = Math.round(canvasW * state.zoom * dpr);
  spellCanvas.height = Math.round(canvasH * state.zoom * dpr);
  spellCanvas.style.width = canvasW + 'px';
  spellCanvas.style.height = canvasH + 'px';

  pctx.setTransform(1, 0, 0, 1, 0, 0);
  pctx.scale(dpr * state.zoom, dpr * state.zoom);

  var w = canvasW, h = canvasH;
  pctx.clearRect(
    -state.panX / state.zoom - 50,
    -state.panY / state.zoom - 50,
    w / state.zoom + 100,
    h / state.zoom + 100
  );

  var shape = document.getElementById('shape') ? document.getElementById('shape').value : 'sphere';
  var radiusHexes = Math.max(1, Math.round(Number(document.getElementById('spellSize') ? document.getElementById('spellSize').value : 20) / 5));
  var dirIndex = Number(document.getElementById('direction') ? document.getElementById('direction').value : 0);
  var cubeOrigin = document.getElementById('cubeOrigin') ? document.getElementById('cubeOrigin').value : 'center';

  var baseR = isMobile() ? 12 : 14;
  var R = baseR;
  var HexW = R * 1.73205;
  var L = Math.min(radiusHexes * HexW, Math.min(w, h) / 2 - 10);
  var O = { x: w / 2 + state.panX / state.zoom, y: h / 2 + state.panY / state.zoom };

  var showDir = shape === 'cone' || shape === 'line' || shape === 'cube';
  var dirParent = document.getElementById('direction') ? document.getElementById('direction').parentElement : null;
  if (dirParent) dirParent.style.opacity = showDir ? '1' : '0.35';

  var originRow = document.getElementById('originRow');
  if (originRow) originRow.style.display = shape === 'cube' ? 'block' : 'none';

  var angleDeg = dirIndex * 30 - 90;
  var rad = (angleDeg * Math.PI) / 180;
  var F = { x: Math.cos(rad), y: Math.sin(rad) };
  var R_vec = { x: Math.cos(rad + Math.PI / 2), y: Math.sin(rad + Math.PI / 2) };

  var path = new Path2D();

  if (shape === 'sphere') {
    path.arc(O.x, O.y, L, 0, Math.PI * 2);
  } else if (shape === 'cone') {
    var P1 = { x: O.x + L * Math.cos(rad - Math.PI / 6), y: O.y + L * Math.sin(rad - Math.PI / 6) };
    var P2 = { x: O.x + L * Math.cos(rad + Math.PI / 6), y: O.y + L * Math.sin(rad + Math.PI / 6) };
    path.moveTo(O.x, O.y);
    path.lineTo(P1.x, P1.y);
    path.lineTo(P2.x, P2.y);
    path.closePath();
  } else if (shape === 'line') {
    var halfW = Math.min(HexW / 2, L / 6);
    var P1 = { x: O.x - R_vec.x * halfW, y: O.y - R_vec.y * halfW };
    var P2 = { x: O.x + R_vec.x * halfW, y: O.y + R_vec.y * halfW };
    var P3 = { x: P2.x + F.x * L, y: P2.y + F.y * L };
    var P4 = { x: P1.x + F.x * L, y: P1.y + F.y * L };
    path.moveTo(P1.x, P1.y);
    path.lineTo(P2.x, P2.y);
    path.lineTo(P3.x, P3.y);
    path.lineTo(P4.x, P4.y);
    path.closePath();
  } else if (shape === 'cube') {
    var cubeSize = Math.min(L, Math.min(w, h) / 2 - 10);
    var startO = { x: O.x, y: O.y };
    if (cubeOrigin === 'center') {
      startO = { x: O.x - (F.x * cubeSize / 2) - (R_vec.x * cubeSize / 2), y: O.y - (F.y * cubeSize / 2) - (R_vec.y * cubeSize / 2) };
    } else if (cubeOrigin === 'edge') {
      startO = { x: O.x - (R_vec.x * cubeSize / 2), y: O.y - (R_vec.y * cubeSize / 2) };
    } else if (cubeOrigin === 'corner_l') {
      startO = { x: O.x, y: O.y };
    } else if (cubeOrigin === 'corner_r') {
      startO = { x: O.x - (R_vec.x * cubeSize), y: O.y - (R_vec.y * cubeSize) };
    }
    var P2 = { x: startO.x + R_vec.x * cubeSize, y: startO.y + R_vec.y * cubeSize };
    var P3 = { x: startO.x + R_vec.x * cubeSize + F.x * cubeSize, y: startO.y + R_vec.y * cubeSize + F.y * cubeSize };
    var P4 = { x: startO.x + F.x * cubeSize, y: startO.y + F.y * cubeSize };
    path.moveTo(startO.x, startO.y);
    path.lineTo(P2.x, P2.y);
    path.lineTo(P3.x, P3.y);
    path.lineTo(P4.x, P4.y);
    path.closePath();
  }

  var count = 0;
  var hexR = Math.min(R, L / 4);

  for (var q = -12; q <= 12; q++) {
    for (var rr = -12; rr <= 12; rr++) {
      var cx = O.x + HexW * (q + rr * 0.5);
      var cy = O.y + 1.5 * R * rr;
      if (cx < -hexR || cx > w + hexR || cy < -hexR || cy > h + hexR) continue;

      var active = false;
      pctx.save();
      pctx.setTransform(dpr * state.zoom, 0, 0, dpr * state.zoom, 0, 0);
      if (q !== 0 || rr !== 0) {
        active = pctx.isPointInPath(path, cx, cy);
      } else if (shape === 'sphere' || (shape === 'cube' && cubeOrigin === 'center')) {
        active = pctx.isPointInPath(path, cx, cy);
      }
      pctx.restore();

      if (active) count++;
      drawHexOnCtx(pctx, cx, cy, hexR - 1, active ? '#a87cff66' : '#14093000', active ? '#c4a8ff99' : '#2a1f4a33');
    }
  }

  pctx.lineWidth = 1.5;
  pctx.strokeStyle = '#6bff9ecc';
  pctx.setLineDash([5, 3]);
  pctx.stroke(path);
  pctx.setLineDash([]);

  // Punkt centralny
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

  // Licznik hexów
  var showCount = document.getElementById('showCount');
  if (showCount && showCount.checked) {
    pctx.fillStyle = '#c4a8ffcc';
    pctx.font = 'bold 10px Inter,sans-serif';
    pctx.textAlign = 'center';
    pctx.fillText(count + ' hexów', O.x, h - 8 + state.panY / state.zoom);
  }
}

// ====== EVENTY ======
['shape', 'spellSize', 'direction', 'cubeOrigin'].forEach(function(id) {
  var el = document.getElementById(id);
  if (el) el.addEventListener('change', renderSpellCanvas);
});

var showCount = document.getElementById('showCount');
if (showCount) showCount.addEventListener('change', renderSpellCanvas);

// ====== INICJALIZACJA ======
var searchInput = document.getElementById('spellSearch');
var levelSelect = document.getElementById('spellLevel');
var schoolSelect = document.getElementById('spellSchool');

if (searchInput) {
  searchInput.addEventListener('input', function() {
    renderSpellList(this.value, levelSelect ? levelSelect.value : 'all', schoolSelect ? schoolSelect.value : 'all');
  });
}
if (levelSelect) {
  levelSelect.addEventListener('change', function() {
    renderSpellList(searchInput ? searchInput.value : '', this.value, schoolSelect ? schoolSelect.value : 'all');
  });
}
if (schoolSelect) {
  schoolSelect.addEventListener('change', function() {
    renderSpellList(searchInput ? searchInput.value : '', levelSelect ? levelSelect.value : 'all', this.value);
  });
}

// Render initial
renderSpellList();

// ====== EKSPORT GLOBALNY ======
window.renderSpellList = renderSpellList;
window.renderSpellCanvas = renderSpellCanvas;
window.SPELLS = SPELLS;