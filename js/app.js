// ============================================================
//  APP - MAIN ENTRY
// ============================================================

// Obserwator kart
var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
        if (e.isIntersecting) e.target.classList.add('visible');
    });
}, { threshold: 0.08 });

document.querySelectorAll('.card').forEach(function(c) { observer.observe(c); });

function init() {
    // Najpierw nawigacja
    if (typeof initNavigation === 'function') initNavigation();
    
    // Potem info (zakładki)
    if (typeof initInfoTabs === 'function') initInfoTabs();
    
    // Canvas
    if (typeof initCanvasPanZoom === 'function') initCanvasPanZoom();
    
    // Avatar pickery
    if (typeof initAvatarPicker === 'function') initAvatarPicker();
    if (typeof initCombatantAvatarPicker === 'function') initCombatantAvatarPicker();
    
    // Storage
    if (typeof initStorage === 'function') initStorage();

    // Renderowanie
    if (typeof renderPlayers === 'function') renderPlayers();
    if (typeof renderInit === 'function') renderInit();
    if (typeof updateFocusFire === 'function') updateFocusFire();
    if (typeof renderDistances === 'function') renderDistances();

    // Canvas - opóźnione
    setTimeout(function() {
        if (typeof renderSizeCanvas === 'function') renderSizeCanvas();
        if (typeof renderSpellCanvas === 'function') renderSpellCanvas();
    }, 200);

    if (typeof initAvatarPickers === 'function') initAvatarPickers();
    if (typeof initEditTabs === 'function') initEditTabs();

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