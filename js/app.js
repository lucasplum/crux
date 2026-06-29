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
  initNavigation();
  initInfoTabs();
  initCanvasPanZoom();
  initAvatarPicker();
  initCombatantAvatarPicker();

  // Render
  renderPlayers();
  renderInit();
  updateFocusFire();
  renderDistances();

  // Opóźnione renderowanie canvas
  setTimeout(function() {
    renderSizeCanvas();
    renderSpellCanvas();
  }, 200);

  // Resize handler
  var resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      renderSizeCanvas();
      renderSpellCanvas();
    }, 250);
  });
}

// Uruchom po DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}