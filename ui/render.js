// ============================================================
//  RENDER - POPRAWKA DLA POZYCJI HEXÓW
// ============================================================

// W funkcji renderSizeCanvas i renderSpellCanvas - poprawka dla centrowania

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

  // POPRAWKA: Czyszczenie z uwzględnieniem przesunięcia
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

  // POPRAWKA: L - ograniczenie do widocznego obszaru
  var L = Math.min(radiusHexes * HexW, Math.min(w, h) / 2 - 10);

  // POPRAWKA: Punkt centralny - uwzględniamy przesunięcie
  var O = { 
    x: w / 2 + state.panX / state.zoom, 
    y: h / 2 + state.panY / state.zoom 
  };

  // ... reszta funkcji bez zmian, ale hexR dostosowany do zoomu
  var hexR = Math.min(R, L / 4);

  // Rysowanie hexów - z uwzględnieniem przesunięcia
  for (var q = -12; q <= 12; q++) {
    for (var rr = -12; rr <= 12; rr++) {
      var cx = O.x + HexW * (q + rr * 0.5);
      var cy = O.y + 1.5 * R * rr;

      // POPRAWKA: Sprawdzanie czy hex jest w widocznym obszarze
      if (cx < -hexR - 20 || cx > w + hexR + 20 || cy < -hexR - 20 || cy > h + hexR + 20) continue;

      // ... reszta bez zmian
    }
  }
}