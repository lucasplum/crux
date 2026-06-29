// ============================================================
//  NAVIGATION
// ============================================================

function initNavigation() {
  var navButtons = document.querySelectorAll('.nav-btn, .bottom-nav-btn');
  var tabSections = document.querySelectorAll('.tab-section');

  navButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var targetTab = btn.dataset.tab;

      document.querySelectorAll('.nav-btn, .bottom-nav-btn').forEach(function(b) {
        if (b.dataset.tab === targetTab) b.classList.add('active');
        else b.classList.remove('active');
      });

      tabSections.forEach(function(section) {
        if (section.dataset.tab === targetTab) section.classList.add('active');
        else section.classList.remove('active');
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (targetTab === 'spells') {
        setTimeout(function() {
          if (typeof renderSizeCanvas === 'function') renderSizeCanvas();
          if (typeof renderSpellCanvas === 'function') renderSpellCanvas();
        }, 100);
      }
    });
  });
}

function initInfoTabs() {
  var infoTabButtons = document.querySelectorAll('.info-tab-btn');
  var infoContents = document.querySelectorAll('.info-content');

  infoTabButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var targetInfo = btn.dataset.info;

      infoTabButtons.forEach(function(b) {
        if (b.dataset.info === targetInfo) b.classList.add('active');
        else b.classList.remove('active');
      });

      infoContents.forEach(function(c) {
        if (c.dataset.info === targetInfo) c.classList.add('active');
        else c.classList.remove('active');
      });
    });
  });
}