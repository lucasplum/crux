// ============================================================
//  RENDER / VIEWPORT HELPERS
// ============================================================

var canvasState = {
  size: { zoom: 1, panX: 0, panY: 0 },
  spell: { zoom: 1, panX: 0, panY: 0 }
};

// Przechowujemy stałe wymiary canvas dla każdego typu
var canvasDimensions = {
  size: { width: 0, height: 0 },
  spell: { width: 0, height: 0 }
};

function isMobile() {
  return window.innerWidth <= 768 || 'ontouchstart' in window;
}

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

function getCanvasDPR() {
  // Stały DPR dla całej sesji - nie zmienia się przy każdym renderowaniu
  if (typeof getCanvasDPR._dpr === 'undefined') {
    getCanvasDPR._dpr = isMobile() ? Math.min(window.devicePixelRatio || 1, 1.5) : Math.min(window.devicePixelRatio || 1, 2);
  }
  return getCanvasDPR._dpr;
}

function getCanvasDimensions(type) {
  var container = document.getElementById(type + 'CanvasContainer');
  if (!container) return { width: 0, height: 0 };
  
  var dpr = getCanvasDPR();
  var state = canvasState[type];
  
  // Podstawowe wymiary kontenera
  var baseW = container.offsetWidth;
  var baseH = Math.max(280, container.offsetHeight);
  
  // Używamy stałych wymiarów jeśli już zostały ustawione
  if (canvasDimensions[type].width === 0 || canvasDimensions[type].height === 0) {
    canvasDimensions[type].width = baseW;
    canvasDimensions[type].height = baseH;
  }
  
  return {
    width: canvasDimensions[type].width,
    height: canvasDimensions[type].height,
    baseW: baseW,
    baseH: baseH,
    dpr: dpr
  };
}

function clampPan(type) {
  var state = canvasState[type];
  var maxPan = Math.max(500, 300 * state.zoom);
  state.panX = Math.max(-maxPan, Math.min(maxPan, state.panX));
  state.panY = Math.max(-maxPan, Math.min(maxPan, state.panY));
}

// ====== ZOOM / PAN ======
function zoomCanvas(type, direction) {
  var state = canvasState[type];
  var oldZoom = state.zoom;
  state.zoom = direction > 0 ? Math.min(3, state.zoom + 0.25) : Math.max(0.5, state.zoom - 0.25);
  clampPan(type);
  
  var zd = document.getElementById(type + 'ZoomLevel');
  if (zd) zd.textContent = Math.round(state.zoom * 100) + '%';
  
  // Przy zmianie zoomu resetujemy wymiary - będą ponownie obliczone
  canvasDimensions[type].width = 0;
  canvasDimensions[type].height = 0;
  
  if (type === 'size' && typeof renderSizeCanvas === 'function') renderSizeCanvas();
  else if (type === 'spell' && typeof renderSpellCanvas === 'function') renderSpellCanvas();
}

function resetCanvas(type) {
  var state = canvasState[type];
  state.zoom = 1;
  state.panX = 0;
  state.panY = 0;
  
  // Resetujemy wymiary
  canvasDimensions[type].width = 0;
  canvasDimensions[type].height = 0;
  
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
  
  // Obsługa resize - odświeżamy wymiary
  var resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      // Resetujemy wymiary przy zmianie rozmiaru okna
      canvasDimensions.size.width = 0;
      canvasDimensions.size.height = 0;
      canvasDimensions.spell.width = 0;
      canvasDimensions.spell.height = 0;
      if (typeof renderSizeCanvas === 'function') renderSizeCanvas();
      if (typeof renderSpellCanvas === 'function') renderSpellCanvas();
    }, 250);
  });
}

// Eksport globalny
window.zoomCanvas = zoomCanvas;
window.resetCanvas = resetCanvas;
window.getCanvasDPR = getCanvasDPR;
window.getCanvasDimensions = getCanvasDimensions;
window.canvasDimensions = canvasDimensions;