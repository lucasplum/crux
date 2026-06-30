// ============================================================
//  RENDER / VIEWPORT HELPERS
// ============================================================

var canvasState = {
  size: { zoom: 1, panX: 0, panY: 0 },
  spell: { zoom: 1, panX: 0, panY: 0 }
};

// Przechowujemy stałe wymiary canvas
var canvasDimensions = {
  size: { width: 0, height: 0, zoom: 1 },
  spell: { width: 0, height: 0, zoom: 1 }
};

// Stały DPR dla całej sesji
var _cachedDPR = null;

function getCanvasDPR() {
  if (_cachedDPR === null) {
    var isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
    _cachedDPR = isMobile ? Math.min(window.devicePixelRatio || 1, 1.5) : Math.min(window.devicePixelRatio || 1, 2);
  }
  return _cachedDPR;
}

function isMobile() {
  return window.innerWidth <= 768 || 'ontouchstart' in window;
}

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

function getCanvasDimensions(type) {
  var container = document.getElementById(type + 'CanvasContainer');
  if (!container) return { width: 0, height: 0, baseW: 0, baseH: 0, dpr: 1 };
  
  var dpr = getCanvasDPR();
  var state = canvasState[type];
  
  // Pobierz aktualne wymiary kontenera
  var baseW = container.offsetWidth;
  var baseH = Math.max(280, container.offsetHeight);
  
  // Jeśli wymiary nie są ustawione lub zmienił się zoom, zaktualizuj
  if (canvasDimensions[type].width === 0 || canvasDimensions[type].height === 0) {
    canvasDimensions[type].width = baseW;
    canvasDimensions[type].height = baseH;
    canvasDimensions[type].zoom = state.zoom;
  }
  
  // Jeśli zoom się zmienił, przelicz wymiary
  if (canvasDimensions[type].zoom !== state.zoom) {
    canvasDimensions[type].zoom = state.zoom;
    // Wymiary pozostają takie same, zoom jest stosowany w skali
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
  var maxPan = Math.max(800, 400 * state.zoom);
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
  
  // Aktualizuj zoom w wymiarach
  canvasDimensions[type].zoom = state.zoom;
  
  if (type === 'size' && typeof renderSizeCanvas === 'function') renderSizeCanvas();
  else if (type === 'spell' && typeof renderSpellCanvas === 'function') renderSpellCanvas();
}

function resetCanvas(type) {
  var state = canvasState[type];
  state.zoom = 1;
  state.panX = 0;
  state.panY = 0;
  
  canvasDimensions[type].zoom = 1;
  
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

    // Mouse events
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

    // Touch events - zoptymalizowane dla mobile
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

    // Wheel zoom
    container.addEventListener('wheel', function(e) {
      e.preventDefault();
      var direction = e.deltaY < 0 ? 1 : -1;
      zoomCanvas(type, direction);
    }, { passive: false });

    container.addEventListener('dblclick', function() { resetCanvas(type); });
  });
  
  // Obsługa resize - odświeżamy wymiary tylko gdy okno zmieniło rozmiar
  var resizeTimeout;
  var lastWidth = window.innerWidth;
  var lastHeight = window.innerHeight;
  
  window.addEventListener('resize', function() {
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    
    // Ignoruj małe zmiany (np. klawiatura na mobile)
    if (Math.abs(newWidth - lastWidth) < 20 && Math.abs(newHeight - lastHeight) < 20) {
      return;
    }
    
    lastWidth = newWidth;
    lastHeight = newHeight;
    
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      // Resetujemy wymiary tylko gdy naprawdę zmienił się rozmiar okna
      var sizeContainer = document.getElementById('sizeCanvasContainer');
      var spellContainer = document.getElementById('spellCanvasContainer');
      
      if (sizeContainer && sizeContainer.offsetWidth > 0) {
        canvasDimensions.size.width = sizeContainer.offsetWidth;
        canvasDimensions.size.height = Math.max(280, sizeContainer.offsetHeight);
      }
      if (spellContainer && spellContainer.offsetWidth > 0) {
        canvasDimensions.spell.width = spellContainer.offsetWidth;
        canvasDimensions.spell.height = Math.max(280, spellContainer.offsetHeight);
      }
      
      if (typeof renderSizeCanvas === 'function') renderSizeCanvas();
      if (typeof renderSpellCanvas === 'function') renderSpellCanvas();
    }, 300);
  });
  
  // Obsługa orientation change na mobile
  window.addEventListener('orientationchange', function() {
    setTimeout(function() {
      var sizeContainer = document.getElementById('sizeCanvasContainer');
      var spellContainer = document.getElementById('spellCanvasContainer');
      
      if (sizeContainer && sizeContainer.offsetWidth > 0) {
        canvasDimensions.size.width = sizeContainer.offsetWidth;
        canvasDimensions.size.height = Math.max(280, sizeContainer.offsetHeight);
      }
      if (spellContainer && spellContainer.offsetWidth > 0) {
        canvasDimensions.spell.width = spellContainer.offsetWidth;
        canvasDimensions.spell.height = Math.max(280, spellContainer.offsetHeight);
      }
      
      if (typeof renderSizeCanvas === 'function') renderSizeCanvas();
      if (typeof renderSpellCanvas === 'function') renderSpellCanvas();
    }, 400);
  });
}

// Eksport globalny
window.zoomCanvas = zoomCanvas;
window.resetCanvas = resetCanvas;
window.getCanvasDPR = getCanvasDPR;
window.getCanvasDimensions = getCanvasDimensions;
window.canvasDimensions = canvasDimensions;