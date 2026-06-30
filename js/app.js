// ============================================================
//  APP - MAIN ENTRY
// ============================================================

// ---- SCROLL REVEAL ----
var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.08 });

document.querySelectorAll('.card').forEach(function(c) { observer.observe(c); });

// ---- INIT ----
function init() {
  // Nawigacja
  if (typeof initNavigation === 'function') initNavigation();
  if (typeof initInfoTabs === 'function') initInfoTabs();
  if (typeof initCanvasPanZoom === 'function') initCanvasPanZoom();
  if (typeof initAvatarPicker === 'function') initAvatarPicker();
  if (typeof initCombatantAvatarPicker === 'function') initCombatantAvatarPicker();
  
  // Storage - wczytaj stan
  if (typeof initStorage === 'function') initStorage();

  // Render - sprawdź czy funkcje istnieją
  if (typeof renderPlayers === 'function') renderPlayers();
  if (typeof renderInit === 'function') renderInit();
  if (typeof updateFocusFire === 'function') updateFocusFire();
  if (typeof renderDistances === 'function') renderDistances();

  // Opóźnione renderowanie canvas
  setTimeout(function() {
    if (typeof renderSizeCanvas === 'function') renderSizeCanvas();
    if (typeof renderSpellCanvas === 'function') renderSpellCanvas();
  }, 200);

  // Resize handler
  var resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      if (typeof renderSizeCanvas === 'function') renderSizeCanvas();
      if (typeof renderSpellCanvas === 'function') renderSpellCanvas();
    }, 250);
  });
}

// Uruchom po DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}