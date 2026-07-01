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
    // Inicjalizacja danych postaci
    if (typeof initPlayers === 'function') initPlayers();
    
    // Nawigacja
    if (typeof initNavigation === 'function') initNavigation();
    
    // Info
    if (typeof initInfoTabs === 'function') initInfoTabs();
    
    // Canvas
    if (typeof initCanvasPanZoom === 'function') initCanvasPanZoom();
    
    // Avatar pickery
    if (typeof initAvatarPickers === 'function') initAvatarPickers();
    if (typeof initCombatantAvatarPicker === 'function') initCombatantAvatarPicker();
    if (typeof initEditTabs === 'function') initEditTabs();
    
    // Storage
    if (typeof initStorage === 'function') initStorage();

    // Renderowanie
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
            // Info hamburger na mobile
            if (window.innerWidth > 768) {
                var tabs = document.getElementById('infoTabs');
                if (tabs) tabs.classList.remove('open');
                var btn = document.querySelector('.info-hamburger');
                if (btn) btn.textContent = '☰ Zakładki';
            }
        }, 250);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}