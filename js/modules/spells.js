// ============================================================
//  SPELLS - Obszary zaklęć z autouzupełnianiem
// ============================================================

var spellCanvas = document.getElementById('spellCanvas');
var pctx = spellCanvas ? spellCanvas.getContext('2d') : null;
var allSpellsData = [];
var isLoadingSpells = false;

// ====== ŁADOWANIE ZAKLĘĆ DLA PODPOWIADAJKI ======
function loadSpellsForSuggestions() {
  if (allSpellsData.length > 0) return;
  if (isLoadingSpells) return;
  
  isLoadingSpells = true;
  var levels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  var loaded = 0;
  var total = levels.length;
  
  levels.forEach(function(level) {
    var url = 'data/spells/level-' + level + '.json';
    fetch(url)
      .then(function(r) { return r.json(); })
      .then(function(data) {
        allSpellsData = allSpellsData.concat(data || []);
        loaded++;
        if (loaded === total) {
          isLoadingSpells = false;
          // Posortuj po nazwie
          allSpellsData.sort(function(a, b) {
            return a.name_pl.localeCompare(b.name_pl);
          });
        }
      })
      .catch(function() {
        loaded++;
        if (loaded === total) {
          isLoadingSpells = false;
        }
      });
  });
}

// ====== AUTOUZUPEŁNIANIE ======
var suggestionTimeout = null;

function showSpellSuggestions(query) {
  var container = document.getElementById('spellSuggestions');
  if (!container) return;
  
  if (!query || query.length < 2) {
    container.classList.remove('active');
    container.innerHTML = '';
    return;
  }
  
  var results = allSpellsData.filter(function(s) {
    return s.name_pl.toLowerCase().includes(query.toLowerCase()) ||
           s.name_en.toLowerCase().includes(query.toLowerCase());
  }).slice(0, 10);
  
  if (results.length === 0) {
    container.classList.remove('active');
    container.innerHTML = '';
    return;
  }
  
  container.classList.add('active');
  container.innerHTML = '';
  
  results.forEach(function(spell) {
    var div = document.createElement('div');
    div.className = 'spell-suggestion';
    var levelText = spell.level === 0 ? 'Cantrip' : 'Lvl ' + spell.level;
    div.innerHTML = `
      <span>${spell.name_pl} <span style="color:var(--muted);font-weight:400;">(${spell.name_en})</span></span>
      <span class="suggestion-level">${levelText} · ${spell.school}</span>
    `;
    div.onclick = function() {
      var input = document.getElementById('spellSearch');
      if (input) {
        input.value = spell.name_pl;
        // Ustaw kształt i zasięg na podstawie zaklęcia
        setSpellFromData(spell);
        container.classList.remove('active');
        container.innerHTML = '';
      }
    };
    container.appendChild(div);
  });
}

function setSpellFromData(spell) {
  // Próbujemy dopasować kształt i zasięg
  var shapeMap = {
    'sphere': ['sfera', 'promień', 'kula', 'aura'],
    'cone': ['stożek', 'stożka'],
    'line': ['linia', 'promień', 'ściana'],
    'cube': ['sześcian', 'kostka']
  };
  
  var desc = (spell.desc_pl + ' ' + spell.desc_en).toLowerCase();
  var shapeSelect = document.getElementById('shape');
  var sizeSelect = document.getElementById('spellSize');
  
  if (shapeSelect) {
    var foundShape = 'sphere';
    for (var key in shapeMap) {
      for (var i = 0; i < shapeMap[key].length; i++) {
        if (desc.includes(shapeMap[key][i])) {
          foundShape = key;
          break;
        }
      }
      if (foundShape !== 'sphere') break;
    }
    shapeSelect.value = foundShape;
  }
  
  // Próba wyciągnięcia zasięgu z opisu
  if (sizeSelect) {
    var rangeMatch = desc.match(/(\d+)\s*ft/);
    if (rangeMatch) {
      var r = parseInt(rangeMatch[1]);
      var options = [5, 10, 15, 20, 30, 60, 90, 120];
      var closest = options.reduce(function(prev, curr) {
        return (Math.abs(curr - r) < Math.abs(prev - r) ? curr : prev);
      });
      sizeSelect.value = closest;
    }
  }
  
  // Wywołaj zmianę
  if (typeof renderSpellCanvas === 'function') {
    setTimeout(renderSpellCanvas, 50);
  }
  playSound('add');
}

// ====== RENDER CANVAS OBSZARÓW ======
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

  var displayW = Math.round(canvasW);
  var displayH = Math.round(canvasH);
  
  if (spellCanvas.style.width !== displayW + 'px' || spellCanvas.style.height !== displayH + 'px') {
    spellCanvas.style.width = displayW + 'px';
    spellCanvas.style.height = displayH + 'px';
  }
  
  spellCanvas.width = Math.round(canvasW * state.zoom * dpr);
  spellCanvas.height = Math.round(canvasH * state.zoom * dpr);

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
  
  var maxL = Math.min(w, h) / 2 - 20;
  var L = Math.min(radiusHexes * HexW, maxL);
  
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
      } else if (shape === 'cube') {
        active = pctx.isPointInPath(path, cx, cy);
      } else if (shape === 'cone' || shape === 'line') {
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

var searchInput = document.getElementById('spellSearch');
if (searchInput) {
  searchInput.addEventListener('input', function() {
    clearTimeout(suggestionTimeout);
    var query = this.value.trim();
    suggestionTimeout = setTimeout(function() {
      showSpellSuggestions(query);
    }, 200);
  });
  
  searchInput.addEventListener('blur', function() {
    setTimeout(function() {
      var container = document.getElementById('spellSuggestions');
      if (container) {
        container.classList.remove('active');
        container.innerHTML = '';
      }
    }, 300);
  });
  
  searchInput.addEventListener('focus', function() {
    var query = this.value.trim();
    if (query.length >= 2) {
      showSpellSuggestions(query);
    }
  });
}

// Załaduj zaklęcia dla podpowiadajki
loadSpellsForSuggestions();

// ====== EKSPORT ======
window.renderSpellCanvas = renderSpellCanvas;
window.allSpellsData = allSpellsData;
window.loadSpellsForSuggestions = loadSpellsForSuggestions;