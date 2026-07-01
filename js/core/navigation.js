// ============================================================
//  NAVIGATION
// ============================================================

function initNavigation() {
    var navButtons = document.querySelectorAll('.nav-btn, .bottom-nav-btn');
    var tabSections = document.querySelectorAll('.tab-section');

    // Ukryj wszystkie sekcje poza pierwszą
    tabSections.forEach(function(section, index) {
        if (index === 0) {
            section.classList.add('active');
            section.style.display = 'block';
        } else {
            section.classList.remove('active');
            section.style.display = 'none';
        }
    });

    // Ustaw pierwszy przycisk jako aktywny
    navButtons.forEach(function(b, index) {
        if (index === 0) {
            b.classList.add('active');
        } else {
            b.classList.remove('active');
        }
    });

    navButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var targetTab = btn.dataset.tab;

            // Przyciski
            document.querySelectorAll('.nav-btn, .bottom-nav-btn').forEach(function(b) {
                if (b.dataset.tab === targetTab) {
                    b.classList.add('active');
                } else {
                    b.classList.remove('active');
                }
            });

            // Sekcje
            tabSections.forEach(function(section) {
                if (section.dataset.tab === targetTab) {
                    section.classList.add('active');
                    section.style.display = 'block';
                } else {
                    section.classList.remove('active');
                    section.style.display = 'none';
                }
            });

            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Odśwież canvas po przejściu
            if (targetTab === 'spells') {
                setTimeout(function() {
                    if (typeof renderSizeCanvas === 'function') renderSizeCanvas();
                    if (typeof renderSpellCanvas === 'function') renderSpellCanvas();
                }, 100);
            }
        });
    });
}

// Auto-inicjalizacja
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
} else {
    initNavigation();
}