// ============================================================
//  APP - MAIN ENTRY
// ============================================================

var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.08 });

document.querySelectorAll('.card').forEach(function(c) { observer.observe(c); });

function init() {
  if (typeof initNavigation === 'function') initNavigation();
  if (typeof initInfoTabs === 'function') initInfoTabs();
  if (typeof initCanvasPanZoom === 'function') initCanvasPanZoom();
  if (typeof initAvatarPicker === 'function') initAvatarPicker();
  if (typeof initCombatantAvatarPicker === 'function') initCombatantAvatarPicker();
  
  if (typeof initStorage === 'function') initStorage();

  if (typeof renderPlayers === 'function') renderPlayers();
  if (typeof renderInit === 'function') renderInit();
  if (typeof updateFocusFire === 'function') updateFocusFire();
  if (typeof renderDistances === 'function') renderDistances();

  setTimeout(function() {
    if (typeof renderSizeCanvas === 'function') renderSizeCanvas();
    if (typeof renderSpellCanvas === 'function') renderSpellCanvas();
  }, 200);

  var resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      if (typeof renderSizeCanvas === 'function') renderSizeCanvas();
      if (typeof renderSpellCanvas === 'function') renderSpellCanvas();
    }, 250);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}