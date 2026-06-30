// ============================================================
//  INFO
// ============================================================

function renderStatesInfoList() {
  var container = document.getElementById('statesInfoList');
  if (!container) return;
  container.innerHTML = '';

  var order = ['Blinded', 'Charmed', 'Deafened', 'Frightened', 'Grappled', 'Incapacitated',
    'Invisible', 'Paralyzed', 'Petrified', 'Poisoned', 'Prone', 'Restrained', 'Stunned',
    'Unconscious', 'Exhaustion'];

  var polishNames = {
    'Blinded': 'Oślepiony',
    'Charmed': 'Zauroczony',
    'Deafened': 'Ogłuszony',
    'Frightened': 'Przerażony',
    'Grappled': 'Pochwycony',
    'Incapacitated': 'Obezwładniony',
    'Invisible': 'Niewidzialny',
    'Paralyzed': 'Sparaliżowany',
    'Petrified': 'Spetryfikowany',
    'Poisoned': 'Zatruty',
    'Prone': 'Leżący',
    'Restrained': 'Skrępowany',
    'Stunned': 'Oszołomiony',
    'Unconscious': 'Nieprzytomny',
    'Exhaustion': 'Wyczerpanie'
  };

  order.forEach(function(state) {
    var item = document.createElement('div');
    item.className = 'info-item';
    item.innerHTML = `
      <div class="info-item-header">
        <span class="info-icon">${getStateEmoji(state)}</span>
        <span class="info-title">${polishNames[state] || state} <span style="color:var(--muted);font-weight:400;font-size:.8em;">(${state})</span></span>
      </div>
      <div class="info-desc">${STATE_DESCRIPTIONS[state] || ''}</div>
    `;
    container.appendChild(item);
  });
}

// Inicjalizacja
renderStatesInfoList();