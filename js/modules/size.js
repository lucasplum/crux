// ============================================================
//  SIZE
// ============================================================

var activeSize = 'sm';
var sizeCanvas = document.getElementById('sizeCanvas');
var sctx = sizeCanvas ? sizeCanvas.getContext('2d') : null;

function renderSizeCanvas() {
  var container = document.getElementById('sizeCanvasContainer');
  if (!container || container.offsetWidth === 0 || !sizeCanvas || !sctx) return;

  var dims = getCanvasDimensions('size');
  if (dims.width === 0 || dims.height === 0) {
    dims.width = container.offsetWidth;
    dims.height = Math.max(280, container.offsetHeight);
    canvasDimensions.size.width = dims.width;
    canvasDimensions.size.height = dims.height;
  }

  var state = canvasState.size;
  clampPan('size');

  var dpr = dims.dpr;
  var canvasW = dims.width;
  var canvasH = dims.height;

  // Ustawiamy canvas na stałe wymiary
  sizeCanvas.width = Math.round(canvasW * state.zoom * dpr);
  sizeCanvas.height = Math.round(canvasH * state.zoom * dpr);
  sizeCanvas.style.width = canvasW + 'px';
  sizeCanvas.style.height = canvasH + 'px';

  sctx.setTransform(1, 0, 0, 1, 0, 0);
  sctx.scale(dpr * state.zoom, dpr * state.zoom);

  var w = canvasW, h = canvasH;
  sctx.clearRect(
    -state.panX / state.zoom - 50,
    -state.panY / state.zoom - 50,
    w / state.zoom + 100,
    h / state.zoom + 100
  );

  var s = SIZE_DATA[activeSize];
  var baseR = isMobile() ? 18 : 22;
  var r = baseR;
  var cells = s.hexes;
  var centerX = w / 2 + state.panX / state.zoom;
  var centerY = h / 2 + state.panY / state.zoom;

  // Tło
  for (var q = -6; q <= 6; q++) {
    for (var rr = -5; rr <= 5; rr++) {
      var cx = centerX + r * 1.732 * (q + rr * 0.5);
      var cy = centerY + r * 1.5 * rr;
      if (cx < -r || cx > w + r || cy < -r || cy > h + r) continue;
      drawHexOnCtx(sctx, cx, cy, r - 1, '#14093000', '#2a1f4a33');
    }
  }

  // Główne
  cells.forEach(function(cell) {
    var q = cell[0], rr = cell[1];
    var cx = centerX + r * 1.732 * (q + rr * 0.5);
    var cy = centerY + r * 1.5 * rr;
    drawHexOnCtx(sctx, cx, cy, r - 1, s.color + '44', s.color + '99');
  });

  // Środek
  sctx.beginPath();
  sctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
  sctx.fillStyle = '#ff4444';
  sctx.fill();
  sctx.strokeStyle = '#fff8';
  sctx.lineWidth = 1.5;
  sctx.stroke();
}

// Inicjalizacja przycisków
document.querySelectorAll('.size-btn').forEach(function(btn) {
  btn.onclick = function() {
    document.querySelectorAll('.size-btn').forEach(function(x) { x.classList.remove('active'); });
    btn.classList.add('active');
    activeSize = btn.dataset.size;
    var s = SIZE_DATA[activeSize];
    var info = document.getElementById('sizeInfo');
    if (info) info.textContent = s.hexCount + ' · ' + s.name;
    renderSizeCanvas();
  };
});

// Inicjalne info
var sizeInfo = document.getElementById('sizeInfo');
if (sizeInfo) sizeInfo.textContent = '1×1 · Mały (Small)';

// Eksport
window.renderSizeCanvas = renderSizeCanvas;