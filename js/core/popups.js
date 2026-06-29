// ============================================================
//  POPUPY (warstwa podstawowa)
// ============================================================

function getStateEmoji(state) {
  var map = {
    'Blinded': '👁️',
    'Charmed': '💗',
    'Deafened': '🔇',
    'Frightened': '😨',
    'Grappled': '🤝',
    'Incapacitated': '💫',
    'Invisible': '👻',
    'Paralyzed': '🧊',
    'Petrified': '🪨',
    'Poisoned': '☠️',
    'Prone': '⬇️',
    'Restrained': '⛓️',
    'Stunned': '💥',
    'Unconscious': '💀',
    'Exhaustion': '🥱'
  };
  return map[state] || '⚡';
}

function getStateColor(state) {
  var map = {
    'Blinded': '#aaa',
    'Charmed': '#f0a',
    'Deafened': '#777',
    'Frightened': '#ff6b6b',
    'Grappled': '#8b4',
    'Incapacitated': '#d4a843',
    'Invisible': '#6bb8ff',
    'Paralyzed': '#a0f',
    'Petrified': '#888',
    'Poisoned': '#6bff9e',
    'Prone': '#c84',
    'Restrained': '#ba0',
    'Stunned': '#a87cff',
    'Unconscious': '#555',
    'Exhaustion': '#f55'
  };
  return map[state] || '#a87cff';
}

// ---- Obsługa ESC i kliknięć poza popupem ----
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    if (typeof closeCondPopup === 'function') closeCondPopup();
    if (typeof closeDmgPopup === 'function') closeDmgPopup();
    if (typeof closeDicePopup === 'function') closeDicePopup();
    if (typeof closeTimerPopup === 'function') closeTimerPopup();
    if (typeof closeAddPlayerModal === 'function') closeAddPlayerModal();
    if (typeof closeAddCombatantModal === 'function') closeAddCombatantModal();
  }
});

document.addEventListener('mousedown', function(e) {
  ['condPopup', 'dmgPopup', 'dicePopup', 'timerPopup'].forEach(function(id) {
    var p = document.getElementById(id);
    if (p && !p.contains(e.target) && e.target.closest('.popup-content') === null) {
      if (id === 'condPopup' && typeof closeCondPopup === 'function') closeCondPopup();
      else if (id === 'dmgPopup' && typeof closeDmgPopup === 'function') closeDmgPopup();
      else if (id === 'dicePopup' && typeof closeDicePopup === 'function') closeDicePopup();
      else if (id === 'timerPopup' && typeof closeTimerPopup === 'function') closeTimerPopup();
    }
  });

  var addP = document.getElementById('addPlayerPopup');
  if (addP && addP.style.display === 'flex' && e.target === addP) {
    if (typeof closeAddPlayerModal === 'function') closeAddPlayerModal();
  }
  var addC = document.getElementById('addCombatantPopup');
  if (addC && addC.style.display === 'flex' && e.target === addC) {
    if (typeof closeAddCombatantModal === 'function') closeAddCombatantModal();
  }
});

// Swipe to close (mobile)
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
  var touchStartY = 0;
  document.addEventListener('touchstart', function(e) {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', function(e) {
    var diff = touchStartY - e.changedTouches[0].clientY;
    if (diff < -100) {
      ['condPopup', 'dmgPopup', 'dicePopup', 'timerPopup'].forEach(function(id) {
        var p = document.getElementById(id);
        if (p) {
          var closeBtn = p.querySelector('.popup-close');
          if (closeBtn) closeBtn.click();
        }
      });
    }
  }, { passive: true });
}