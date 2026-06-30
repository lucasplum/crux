// ============================================================
//  POPUPY - POLSKIE NAZWY STANÓW
// ============================================================

function getStateEmoji(state) {
  var map = {
    'nieprzytomny': '💀',
    'niewidzialny': '👻',
    'obezwładniony': '💫',
    'ogłuchły': '🔇',
    'ogłuszony': '💥',
    'oślepiony': '👁️',
    'pochwycony': '🤝',
    'powalony': '⬇️',
    'przerażony': '😨',
    'skamieniały': '🪨',
    'sparaliżowany': '🧊',
    'unieruchomiony': '⛓️',
    'zatruty': '☠️',
    'zauroczony': '💗',
    'wyczerpanie': '🥱'
  };
  return map[state] || '⚡';
}

function getStateColor(state) {
  var map = {
    'nieprzytomny': '#555',
    'niewidzialny': '#6bb8ff',
    'obezwładniony': '#d4a843',
    'ogłuchły': '#777',
    'ogłuszony': '#a87cff',
    'oślepiony': '#aaa',
    'pochwycony': '#8b4',
    'powalony': '#c84',
    'przerażony': '#ff6b6b',
    'skamieniały': '#888',
    'sparaliżowany': '#a0f',
    'unieruchomiony': '#ba0',
    'zatruty': '#6bff9e',
    'zauroczony': '#f0a',
    'wyczerpanie': '#f55'
  };
  return map[state] || '#a87cff';
}

// Mapowanie polskich nazw na angielskie dla opisu
var STATE_EN_MAP = {
  'nieprzytomny': 'Unconscious',
  'niewidzialny': 'Invisible',
  'obezwładniony': 'Incapacitated',
  'ogłuchły': 'Deafened',
  'ogłuszony': 'Stunned',
  'oślepiony': 'Blinded',
  'pochwycony': 'Grappled',
  'powalony': 'Prone',
  'przerażony': 'Frightened',
  'skamieniały': 'Petrified',
  'sparaliżowany': 'Paralyzed',
  'unieruchomiony': 'Restrained',
  'zatruty': 'Poisoned',
  'zauroczony': 'Charmed',
  'wyczerpanie': 'Exhaustion'
};

// Lista stanów po polsku (kolejność dla popupu)
var POLISH_STATES = [
  'nieprzytomny', 'niewidzialny', 'obezwładniony', 'ogłuchły',
  'ogłuszony', 'oślepiony', 'pochwycony', 'powalony',
  'przerażony', 'skamieniały', 'sparaliżowany', 'unieruchomiony',
  'zatruty', 'zauroczony', 'wyczerpanie'
];

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

// Eksport
window.getStateEmoji = getStateEmoji;
window.getStateColor = getStateColor;
window.STATE_EN_MAP = STATE_EN_MAP;
window.POLISH_STATES = POLISH_STATES;