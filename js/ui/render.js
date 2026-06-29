// ============================================================
//  RENDER / VIEWPORT HELPERS
// ============================================================

function isMobile() {
  return window.innerWidth <= 768 || 'ontouchstart' in window;
}

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

function optimizeCanvasForMobile(canvas) {
  return isMobile() ? Math.min(window.devicePixelRatio || 1, 1.5) : Math.min(window.devicePixelRatio || 1, 2);
}

var canvasState = {
  size: { zoom: 1, panX: 0, panY: 0 },
  spell: { zoom: 1, panX: 0, panY: 0 }
};

function clampPan(type) {
  var state = canvasState[type];
  var maxPan = 250;
  state.panX = Math.max(-maxPan, Math.min(maxPan, state.panX));
  state.panY = Math.max(-maxPan, Math.min(maxPan, state.panY));
}

// ====== ZOOM / PAN ======
function zoomCanvas(type, direction) {
  var state = canvasState[type];
  state.zoom = direction > 0 ? Math.min(3, state.zoom + 0.25) : Math.max(0.5, state.zoom - 0.25);
  var zd = document.getElementById(type + 'ZoomLevel');
  if (zd) zd.textContent = Math.round(state.zoom * 100) + '%';
  if (type === 'size' && typeof renderSizeCanvas === 'function') renderSizeCanvas();
  else if (type === 'spell' && typeof renderSpellCanvas === 'function') renderSpellCanvas();
}

function resetCanvas(type) {
  var state = canvasState[type];
  state.zoom = 1;
  state.panX = 0;
  state.panY = 0;
  var zd = document.getElementById(type + 'ZoomLevel');
  if (zd) zd.textContent = '100%';
  if (type === 'size' && typeof renderSizeCanvas === 'function') renderSizeCanvas();
  else if (type === 'spell' && typeof renderSpellCanvas === 'function') renderSpellCanvas();
}

function initCanvasPanZoom() {
  ['size', 'spell'].forEach(function(type) {
    var container = document.getElementById(type + 'CanvasContainer');
    if (!container) return;
    var state = canvasState[type];
    var isDragging = false, lastX = 0, lastY = 0;

    container.addEventListener('mousedown', function(e) {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      container.style.cursor = 'grabbing';
      e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      state.panX += e.clientX - lastX;
      state.panY += e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      clampPan(type);
      if (type === 'size' && typeof renderSizeCanvas === 'function') renderSizeCanvas();
      else if (type === 'spell' && typeof renderSpellCanvas === 'function') renderSpellCanvas();
    });

    document.addEventListener('mouseup', function() {
      if (isDragging) { isDragging = false; container.style.cursor = 'grab'; }
    });

    container.addEventListener('touchstart', function(e) {
      if (e.touches.length === 1) {
        isDragging = true;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
      }
    }, { passive: true });

    container.addEventListener('touchmove', function(e) {
      if (!isDragging || e.touches.length !== 1) return;
      state.panX += e.touches[0].clientX - lastX;
      state.panY += e.touches[0].clientY - lastY;
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
      clampPan(type);
      if (type === 'size' && typeof renderSizeCanvas === 'function') renderSizeCanvas();
      else if (type === 'spell' && typeof renderSpellCanvas === 'function') renderSpellCanvas();
      e.preventDefault();
    }, { passive: false });

    container.addEventListener('touchend', function() { isDragging = false; });

    container.addEventListener('wheel', function(e) {
      e.preventDefault();
      zoomCanvas(type, e.deltaY < 0 ? 1 : -1);
    });

    container.addEventListener('dblclick', function() { resetCanvas(type); });
  });
}

// Eksport globalny
window.zoomCanvas = zoomCanvas;
window.resetCanvas = resetCanvas;