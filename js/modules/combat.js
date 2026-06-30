// ============================================================
//  COMBAT - Z SYNCHRONIZACJĄ DANYCH I NOWYM POPUPEM
// ============================================================

var combatants = [];
var currentTurn = 0;
var round = 1;
var focusFire = [];
var turnLog = [];
var lastInitCount = -1;
var combatActive = false;
var combatStats = {
  totalRounds: 0,
  totalDamage: 0,
  kills: 0,
  crits: 0,
  misses: 0,
  startTime: null,
  endTime: null
};

// ====== SYNCHRONIZACJA Z LISTĄ POSTACI ======
function syncPlayerData() {
  if (typeof players === 'undefined' || !players) return;
  
  combatants.forEach(function(c) {
    // Znajdź odpowiadającą postać w liście graczy (po nazwie)
    var player = players.find(function(p) { 
      return p.name === c.name && p.role === c.role; 
    });
    if (player) {
      // Synchronizuj HP
      if (player.hp !== c.hp) {
        player.hp = c.hp;
      }
      // Synchronizuj stany
      if (JSON.stringify(player.conditions) !== JSON.stringify(c.conditions)) {
        player.conditions = c.conditions.slice();
      }
      // Synchronizuj wyczerpanie
      if (player.exhaustionLevel !== c.exhaustionLevel) {
        player.exhaustionLevel = c.exhaustionLevel;
      }
      // Synchronizuj status śmierci
      if (player.hp <= 0 && !player.deathSaves) {
        player.deathSaves = { passes: 0, fails: 0 };
      }
    }
  });
  
  // Odśwież listę postaci
  if (typeof renderPlayers === 'function') {
    renderPlayers();
  }
}

// ====== DODAWANIE BOJOWNIKA ======
function addCombatant(data) {
  combatants.push({
    id: Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    name: data.name,
    init: data.init || 0,
    hp: data.hp || 0,
    maxHp: data.maxHp || data.hp || 0,
    tempHp: 0,
    ac: data.ac || '—',
    role: data.role || 'Wróg',
    conditions: data.conditions || [],
    exhaustionLevel: data.exhaustionLevel || 0,
    roundDamage: 0,
    totalDamage: 0,
    avatar: data.avatar || '⚔️',
    status: 'active',
    initiativeBonus: data.initBonus || 0,
    notes: data.notes || '',
    effects: [],
    timers: []
  });
  sortInit();
  if (!combatActive && combatants.length > 0) {
    combatActive = true;
    combatStats.startTime = new Date();
  }
  updateCombatStats();
  syncPlayerData();
}

// ====== SORTOWANIE INICJATYWY ======
function sortInit() {
  combatants.sort(function(a, b) { 
    if (b.init !== a.init) return b.init - a.init;
    return (b.initiativeBonus || 0) - (a.initiativeBonus || 0);
  });
  currentTurn = 0;
  round = 1;
  renderInit();
}

// ====== USUWANIE BOJOWNIKA ======
function removeCombatant(index) {
  if (index < 0 || index >= combatants.length) return;
  if (confirm('Usunąć ' + combatants[index].name + '?')) {
    combatants.splice(index, 1);
    if (currentTurn >= combatants.length) currentTurn = 0;
    lastInitCount = -1;
    renderInit();
    updateCombatStats();
  }
}

// ====== OTWÓRZ POPUP DODAWANIA Z BAZY (WIELOKROTNY) ======
function openAddFromPartyPopup() {
  if (typeof players === 'undefined' || players.length === 0) {
    alert('Dodaj najpierw postacie do "Postaci"!');
    return;
  }

  var existing = document.getElementById('addFromPartyPopup');
  if (existing) existing.remove();

  var popup = document.createElement('div');
  popup.className = 'popup-overlay';
  popup.id = 'addFromPartyPopup';
  
  var listItems = players.map(function(p, i) {
    var statusIcon = p.hp <= 0 ? '💀 ' : '';
    var roleClass = p.role ? p.role.toLowerCase() : 'npc';
    var checked = p.hp > 0 ? 'checked' : '';
    return `
      <div class="party-list-item">
        <input type="checkbox" class="party-checkbox" data-index="${i}" ${checked}>
        <span class="party-name">${statusIcon}${p.name}</span>
        <span class="party-hp">❤️ ${p.hp}/${p.maxHp}</span>
        <span class="party-role ${roleClass}">${p.role || 'NPC'}</span>
      </div>
    `;
  }).join('');

  popup.innerHTML = `
    <div class="popup-content" style="max-width:480px;">
      <div class="popup-title">👥 Dodaj z bazy</div>
      <div class="party-select-all">
        <input type="checkbox" id="partySelectAll" checked>
        <label for="partySelectAll">Zaznacz wszystkich</label>
        <span style="flex:1;"></span>
        <span style="font-size:0.7rem;color:var(--muted);">Tylko żywi będą dodani</span>
      </div>
      <div style="max-height:300px;overflow-y:auto;">
        ${listItems}
      </div>
      <div class="party-bulk-init">
        <label>Inicjatywa:</label>
        <input type="number" id="partyBulkInit" value="0" step="1" />
        <span style="flex:1;"></span>
        <button class="btn" onclick="confirmAddFromPartyBulk()" style="padding:6px 16px;min-height:36px;">✓ Dodaj zaznaczonych</button>
        <button class="btn outline" onclick="closeAddFromPartyPopup()" style="padding:6px 16px;min-height:36px;">Anuluj</button>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  // Zaznacz/odznacz wszystkich
  var selectAll = document.getElementById('partySelectAll');
  if (selectAll) {
    selectAll.addEventListener('change', function() {
      document.querySelectorAll('.party-checkbox').forEach(function(cb) {
        cb.checked = selectAll.checked;
      });
    });
  }
}

function closeAddFromPartyPopup() {
  var p = document.getElementById('addFromPartyPopup');
  if (p) p.remove();
}

function confirmAddFromPartyBulk() {
  var checkboxes = document.querySelectorAll('.party-checkbox:checked');
  var initInput = document.getElementById('partyBulkInit');
  var initVal = parseInt(initInput ? initInput.value : 0) || 0;
  
  if (checkboxes.length === 0) {
    alert('Zaznacz co najmniej jedną postać!');
    return;
  }
  
  var added = 0;
  checkboxes.forEach(function(cb) {
    var idx = parseInt(cb.dataset.index);
    var player = players[idx];
    if (!player) return;
    if (player.hp <= 0) {
      // Pomijamy martwych
      return;
    }
    
    // Sprawdź czy już jest w potyczce
    var exists = combatants.some(function(c) { 
      return c.name === player.name && c.role === player.role; 
    });
    if (exists) return;
    
    addCombatant({
      name: player.name,
      init: initVal + Math.floor(Math.random() * 5) - 2, // mała losowość
      hp: player.hp,
      maxHp: player.maxHp,
      ac: player.ac,
      role: player.role,
      conditions: player.conditions ? player.conditions.slice() : [],
      exhaustionLevel: player.exhaustionLevel || 0,
      avatar: player.avatar
    });
    added++;
  });
  
  closeAddFromPartyPopup();
  if (added > 0) {
    playSound('add');
    renderInit();
    updateCombatStats();
  } else {
    alert('Nie dodano żadnej nowej postaci. Sprawdź czy są żywe i czy nie są już w potyczce.');
  }
}

// ====== OTWÓRZ MODAL DODAWANIA ======
function openAddCombatantModal() {
  var popup = document.getElementById('addCombatantPopup');
  if (popup) {
    popup.style.display = 'flex';
    var nameInput = document.getElementById('cName');
    if (nameInput) {
      nameInput.value = '';
      setTimeout(function() { nameInput.focus(); }, 100);
    }
    var initInput = document.getElementById('cInit');
    var hpInput = document.getElementById('cHp');
    var acInput = document.getElementById('cAc');
    var roleSelect = document.getElementById('cRole');
    if (initInput) initInput.value = '';
    if (hpInput) hpInput.value = '';
    if (acInput) acInput.value = '';
    if (roleSelect) roleSelect.value = 'Wróg';
  }
}

function closeAddCombatantModal() {
  var popup = document.getElementById('addCombatantPopup');
  if (popup) popup.style.display = 'none';
}

function confirmAddCombatant() {
  var nameInput = document.getElementById('cName');
  var initInput = document.getElementById('cInit');
  var hpInput = document.getElementById('cHp');
  var acInput = document.getElementById('cAc');
  var roleSelect = document.getElementById('cRole');

  var name = nameInput ? nameInput.value.trim() : '';
  var init = parseInt(initInput ? initInput.value : 0) || 0;
  var hp = parseInt(hpInput ? hpInput.value : 0) || 0;
  var ac = parseInt(acInput ? acInput.value : 0) || 0;
  var role = roleSelect ? roleSelect.value : 'Wróg';

  if (!name) { alert('Podaj nazwę bojownika'); return; }

  addCombatant({
    name: name,
    init: init,
    hp: hp,
    maxHp: hp || null,
    ac: ac || '—',
    role: role,
    avatar: '⚔️'
  });

  closeAddCombatantModal();
  playSound('add');
}

// ====== SYSTEM TUR ======
function nextTurn() {
  if (combatants.length === 0) return;
  
  combatants.forEach(function(c) { c.roundDamage = 0; });
  
  currentTurn = (currentTurn + 1) % combatants.length;
  
  if (currentTurn === 0) {
    round++;
    combatStats.totalRounds++;
    combatants.forEach(function(c) {
      if (c.timers && c.timers.length > 0) {
        c.timers = c.timers.filter(function(t) {
          t.remaining--;
          return t.remaining > 0;
        });
      }
    });
    focusFire = [];
    turnLog = [];
    addTurnLog('⚔️', '🔄 Rozpoczęcie rundy ' + round);
  }
  
  var current = combatants[currentTurn];
  if (current && current.status === 'dead') {
    nextTurn();
    return;
  }
  
  if (current) {
    processTurnStartEffects(current);
  }
  
  playSound('turn');
  renderInit();
  updateFocusFire();
  updateCombatStats();
  syncPlayerData();
}

function processTurnStartEffects(combatant) {
  if (combatant.effects && combatant.effects.length > 0) {
    var toRemove = [];
    combatant.effects.forEach(function(effect, index) {
      if (effect.remaining > 0 && effect.remaining < 999) {
        effect.remaining--;
        if (effect.remaining <= 0) {
          toRemove.push(index);
          addTurnLog(combatant.name, '⏱️ ' + effect.name + ' wygasł');
          playSound('state');
        }
      }
    });
    toRemove.sort(function(a, b) { return b - a; });
    toRemove.forEach(function(idx) {
      combatant.effects.splice(idx, 1);
    });
  }
}

// ====== TIMERY ======
function openTimerPopup() {
  if (combatants.length === 0) {
    alert('Brak bojowników w potyczce!');
    return;
  }

  var existing = document.getElementById('timerPopup');
  if (existing) existing.remove();

  var current = combatants[currentTurn] || combatants[0];
  var currentName = current ? current.name : 'Brak';

  var popup = document.createElement('div');
  popup.className = 'popup-overlay';
  popup.id = 'timerPopup';
  
  var presetOptions = [
    { label: 'Koncentracja', value: 'Koncentracja' },
    { label: 'Oślepienie', value: 'Oślepienie' },
    { label: 'Ogłuszenie', value: 'Ogłuszenie' },
    { label: 'Paraliż', value: 'Paraliż' },
    { label: 'Trucizna', value: 'Trucizna' },
    { label: 'Prędkość', value: 'Prędkość' },
    { label: 'Ochrona', value: 'Ochrona' },
    { label: 'Płonący', value: 'Płonący' },
    { label: 'Zamrożony', value: 'Zamrożony' },
    { label: 'Przerażony', value: 'Przerażony' }
  ];
  
  var presetBtns = presetOptions.map(function(p) {
    return '<button class="timer-preset-btn" onclick="document.getElementById(\'timerNameInput\').value=\'' + p.value + '\'">' + p.value + '</button>';
  }).join('');

  var targetOptions = combatants.map(function(c, i) {
    var isCurrent = i === currentTurn ? ' ▶' : '';
    return '<option value="' + i + '" ' + (i === currentTurn ? 'selected' : '') + '>' + c.name + ' (' + c.role + ')' + isCurrent + '</option>';
  }).join('');

  popup.innerHTML = `
    <div class="popup-content timer-popup-content">
      <div class="popup-title">⏱️ Timer efektu</div>
      <div class="timer-current-target">🎯 Aktualny w turze: <strong>${currentName}</strong></div>
      <div class="attack-row">
        <label>Cel</label>
        <select id="timerTarget">${targetOptions}</select>
      </div>
      <div class="attack-row">
        <label>Nazwa efektu</label>
        <input id="timerNameInput" placeholder="Nazwa efektu..." />
      </div>
      <div class="timer-presets">${presetBtns}</div>
      <div class="attack-row">
        <label>Czas trwania (tury)</label>
        <input type="number" id="timerDuration" value="3" min="1" max="999" />
      </div>
      <div class="attack-actions">
        <button class="btn" onclick="addTimerToCombatant()">⏱️ Dodaj timer</button>
        <button class="btn outline" onclick="closeTimerPopup()">Anuluj</button>
      </div>
      <div id="timerListDisplay" style="margin-top:10px;"></div>
      <button class="popup-close" onclick="closeTimerPopup()">✕ Zamknij</button>
    </div>
  `;
  document.body.appendChild(popup);
  updateTimerListDisplay();
}

function closeTimerPopup() {
  var p = document.getElementById('timerPopup');
  if (p) p.remove();
}

function addTimerToCombatant() {
  var targetSelect = document.getElementById('timerTarget');
  var nameInput = document.getElementById('timerNameInput');
  var durationInput = document.getElementById('timerDuration');
  
  if (!targetSelect || !nameInput || !durationInput) return;
  
  var idx = parseInt(targetSelect.value);
  var name = nameInput.value.trim();
  var duration = parseInt(durationInput.value) || 3;
  
  if (!name) { alert('Podaj nazwę efektu'); return; }
  if (duration < 1) { alert('Czas trwania musi być większy niż 0'); return; }
  
  var c = combatants[idx];
  if (!c) return;
  
  if (!c.timers) c.timers = [];
  
  var existing = c.timers.find(function(t) { return t.name === name; });
  if (existing) {
    existing.remaining = duration;
  } else {
    c.timers.push({
      name: name,
      duration: duration,
      remaining: duration
    });
  }
  
  addTurnLog(c.name, '⏱️ ' + name + ' (' + duration + ' tur)');
  nameInput.value = '';
  updateTimerListDisplay();
  renderInit();
  playSound('state');
}

function updateTimerListDisplay() {
  var container = document.getElementById('timerListDisplay');
  if (!container) return;
  
  var allTimers = [];
  combatants.forEach(function(c, i) {
    if (c.timers && c.timers.length > 0) {
      c.timers.forEach(function(t) {
        allTimers.push({
          combatant: c.name,
          index: i,
          name: t.name,
          remaining: t.remaining
        });
      });
    }
  });
  
  if (allTimers.length === 0) {
    container.innerHTML = '<div style="color:var(--muted);font-size:.7rem;text-align:center;padding:6px;">Brak aktywnych timerów</div>';
    return;
  }
  
  container.innerHTML = allTimers.map(function(t) {
    return '<div class="timer-item"><span class="timer-name">' + t.combatant + ': ' + t.name + '</span><span class="timer-time">' + t.remaining + ' tur</span></div>';
  }).join('');
}

// ====== SYSTEM ATAKU ======
function openAttackPopup() {
  if (combatants.length === 0) {
    alert('Brak bojowników w potyczce!');
    return;
  }

  var existing = document.getElementById('attackPopup');
  if (existing) existing.remove();

  var popup = document.createElement('div');
  popup.className = 'popup-overlay';
  popup.id = 'attackPopup';
  
  var defaultAttacker = currentTurn < combatants.length ? currentTurn : 0;
  
  var attackerRole = combatants[defaultAttacker] ? combatants[defaultAttacker].role : '';
  var defaultTarget = -1;
  
  for (var i = 0; i < combatants.length; i++) {
    if (i !== defaultAttacker && combatants[i].status !== 'dead') {
      var isPlayer = combatants[i].role === 'Gracz' || combatants[i].role === 'Companion';
      var isAttackerPlayer = attackerRole === 'Gracz' || attackerRole === 'Companion';
      if (isPlayer !== isAttackerPlayer) {
        defaultTarget = i;
        break;
      }
    }
  }
  if (defaultTarget === -1) {
    for (var j = 0; j < combatants.length; j++) {
      if (j !== defaultAttacker && combatants[j].status !== 'dead') {
        defaultTarget = j;
        break;
      }
    }
  }
  
  var targetOptions = combatants.map(function(c, i) {
    var statusIcon = c.status === 'dead' ? '💀 ' : '';
    var hpText = typeof c.hp === 'number' ? c.hp + '/' + c.maxHp + ' HP' : '? HP';
    var condText = c.conditions && c.conditions.length > 0 ? ' ⚡' + c.conditions.length : '';
    var effectsText = c.timers && c.timers.length > 0 ? ' 🕐' + c.timers.length : '';
    var selected = (i === defaultTarget) ? 'selected' : '';
    return '<option value="' + i + '" ' + selected + ' ' + (c.status === 'dead' ? 'disabled' : '') + '>' + statusIcon + c.name + ' (' + hpText + ')' + condText + effectsText + '</option>';
  }).join('');

  var attackerOptions = combatants.map(function(c, i) {
    var statusIcon = c.status === 'dead' ? '💀 ' : '';
    var selected = (i === defaultAttacker) ? 'selected' : '';
    return '<option value="' + i + '" ' + selected + ' ' + (c.status === 'dead' ? 'disabled' : '') + '>' + statusIcon + c.name + ' (' + c.role + ')</option>';
  }).join('');

  popup.innerHTML = `
    <div class="popup-content attack-popup-content">
      <div class="popup-title">⚔️ Atak</div>
      <div class="attack-form">
        <div class="attack-row">
          <label>Atakujący</label>
          <select id="attackerSelect">${attackerOptions}</select>
        </div>
        <div class="attack-row">
          <label>Cel</label>
          <select id="targetSelect">${targetOptions}</select>
        </div>
        <div class="attack-row">
          <label>Bonus do trafienia</label>
          <input type="number" id="attackBonus" value="0" step="1" />
        </div>
        <div class="attack-row">
          <label>Kości obrażeń (np. 2d6+3)</label>
          <input type="text" id="damageDice" placeholder="np. 2d6+3" value="1d8" />
        </div>
        <div class="attack-row">
          <label>Typ obrażeń</label>
          <select id="damageType">
            <option value="obuchowe">⚡ Obuchowe</option>
            <option value="cięte">🗡️ Cięte</option>
            <option value="kłute">🏹 Kłute</option>
            <option value="ogniste">🔥 Ogniste</option>
            <option value="zimne">❄️ Zimne</option>
            <option value="elektryczne">⚡ Elektryczne</option>
            <option value="trucizna">☠️ Trucizna</option>
            <option value="nekrotyczne">💀 Nekrotyczne</option>
            <option value="kwas">🧪 Kwas</option>
            <option value="psychiczne">🧠 Psychiczne</option>
            <option value="promieniowanie">☀️ Promieniowanie</option>
            <option value="grzmot">🔊 Grzmot</option>
          </select>
        </div>
        <div class="attack-check">
          <input type="checkbox" id="attackAdvantage" />
          <label for="attackAdvantage">⚡ Przewaga</label>
          <input type="checkbox" id="attackDisadvantage" />
          <label for="attackDisadvantage">🌑 Utrudnienie</label>
        </div>
        <div class="attack-actions">
          <button class="btn" onclick="executeAttack()">⚔️ Rzuć atak</button>
          <button class="btn outline" onclick="closeAttackPopup()">Anuluj</button>
        </div>
        <div id="attackResultContainer"></div>
      </div>
    </div>
  `;
  document.body.appendChild(popup);
}

function closeAttackPopup() {
  var p = document.getElementById('attackPopup');
  if (p) p.remove();
}

function executeAttack() {
  var attackerIdx = parseInt(document.getElementById('attackerSelect').value);
  var targetIdx = parseInt(document.getElementById('targetSelect').value);
  var attackBonus = parseInt(document.getElementById('attackBonus').value) || 0;
  var damageDice = document.getElementById('damageDice').value || '1d8';
  var damageType = document.getElementById('damageType').value;
  var advantage = document.getElementById('attackAdvantage').checked;
  var disadvantage = document.getElementById('attackDisadvantage').checked;
  
  if (attackerIdx === targetIdx) {
    alert('Nie możesz atakować samego siebie!');
    return;
  }
  
  var result = performAttack(attackerIdx, targetIdx, attackBonus, damageDice, damageType, advantage, disadvantage);
  
  if (result) {
    var container = document.getElementById('attackResultContainer');
    if (container) {
      var resultHtml = '';
      if (result.miss) {
        resultHtml = `
          <div class="attack-result">
            <div class="attack-result-header">💨 PUDŁO!</div>
            <div class="attack-result-detail">Atak chybił celu</div>
          </div>
        `;
      } else if (!result.hit) {
        resultHtml = `
          <div class="attack-result">
            <div class="attack-result-header">🛡️ NIETRAFIONY!</div>
            <div class="attack-result-detail">${result.totalAttack || '?'} vs AC ${combatants[targetIdx].ac}</div>
          </div>
        `;
      } else {
        var critText = result.crit ? ' 💥 KRYTYK!' : '';
        resultHtml = `
          <div class="attack-result">
            <div class="attack-result-header">🎯 TRAFIONY!${critText}</div>
            <div class="attack-result-detail">
              ${result.attackRoll} + ${attackBonus} = ${result.totalAttack} (AC ${combatants[targetIdx].ac})<br>
              🎲 ${damageDice} → ${result.damageRolls.join(' + ')} = ${result.damage} ${damageType}
            </div>
            <div class="attack-result-damage">${combatants[targetIdx].name} ma ${combatants[targetIdx].hp}/${combatants[targetIdx].maxHp} HP</div>
            ${combatants[targetIdx].hp <= 0 ? '<div class="attack-result-death">💀 CEL PADA!</div>' : ''}
          </div>
        `;
      }
      container.innerHTML = resultHtml;
      container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    // Synchronizuj po ataku
    syncPlayerData();
  }
}

function performAttack(attackerIndex, targetIndex, attackBonus, damageDice, damageType, advantage, disadvantage) {
  var attacker = combatants[attackerIndex];
  var target = combatants[targetIndex];
  if (!attacker || !target) return null;
  
  if (attackerIndex === targetIndex) {
    alert('Nie możesz atakować samego siebie!');
    return null;
  }
  
  if (target.status === 'dead') {
    alert('Cel już nie żyje!');
    return null;
  }
  
  var roll1 = rollDice(20);
  var roll2 = rollDice(20);
  var attackRoll;
  
  if (advantage && !disadvantage) {
    attackRoll = Math.max(roll1, roll2);
  } else if (disadvantage && !advantage) {
    attackRoll = Math.min(roll1, roll2);
  } else {
    attackRoll = roll1;
  }
  
  var totalAttack = attackRoll + attackBonus;
  var isCrit = attackRoll === 20;
  var isMiss = attackRoll === 1;
  
  if (isMiss) {
    combatStats.misses++;
    addTurnLog(attacker.name, '💨 Pudło (krytyczne) na ' + target.name);
    playSound('hit');
    return { hit: false, crit: false, miss: true };
  }
  
  if (totalAttack < target.ac) {
    combatStats.misses++;
    addTurnLog(attacker.name, '💨 Pudło na ' + target.name + ' (' + totalAttack + ' vs AC ' + target.ac + ')');
    playSound('hit');
    return { hit: false, crit: false, miss: false };
  }
  
  var dmgMatch = damageDice.match(/^(\d+)d(\d+)([+-]\d+)?$/);
  var damage = 0;
  var damageRolls = [];
  
  if (dmgMatch) {
    var count = parseInt(dmgMatch[1]);
    var sides = parseInt(dmgMatch[2]);
    var bonus = dmgMatch[3] ? parseInt(dmgMatch[3]) : 0;
    var rollCount = isCrit ? count * 2 : count;
    
    for (var i = 0; i < rollCount; i++) {
      var r = rollDice(sides);
      damageRolls.push(r);
      damage += r;
    }
    damage += bonus;
  } else {
    damage = rollDice(8);
    damageRolls.push(damage);
  }
  
  dealDamage(attackerIndex, targetIndex, damage, damageType, isCrit);
  
  return {
    hit: true,
    crit: isCrit,
    miss: false,
    attackRoll: attackRoll,
    totalAttack: totalAttack,
    damage: damage,
    damageRolls: damageRolls,
    target: target.name
  };
}

// ====== SYSTEM OBRAŻEŃ ======
function dealDamage(attackerIndex, targetIndex, damage, damageType, isCrit) {
  var attacker = attackerIndex !== null && attackerIndex !== undefined ? combatants[attackerIndex] : null;
  var target = combatants[targetIndex];
  if (!target) return;
  
  var actualDamage = damage;
  var targetName = target.name;
  
  if (target.tempHp > 0) {
    var tempDamage = Math.min(target.tempHp, actualDamage);
    target.tempHp -= tempDamage;
    actualDamage -= tempDamage;
    addTurnLog(targetName, '🛡️ Tymczasowe HP zablokowało ' + tempDamage + ' obrażeń');
  }
  
  if (actualDamage > 0) {
    target.hp = Math.max(0, target.hp - actualDamage);
    target.roundDamage = (target.roundDamage || 0) + actualDamage;
    target.totalDamage = (target.totalDamage || 0) + actualDamage;
    combatStats.totalDamage += actualDamage;
    
    if (isCrit) {
      combatStats.crits++;
      addTurnLog(targetName, '💥 Krytyk! +' + actualDamage + ' ' + damageType);
    } else {
      addTurnLog(targetName, '⚔️ ' + actualDamage + ' ' + damageType + ' obrażeń');
    }
    
    if (target.hp <= 0) {
      target.status = 'dead';
      combatStats.kills++;
      addTurnLog(targetName, '💀 ŚMIERĆ!');
      playSound('death');
      if (attacker) {
        addTurnLog(attacker.name, '🏆 Zabił ' + targetName + '!');
      }
    } else {
      playSound(isCrit ? 'crit' : 'hit');
    }
  }
  
  var existing = focusFire.find(function(f) { return f.name === targetName; });
  if (existing) {
    existing.dmg += actualDamage;
    existing.status = '⚔️ ' + existing.dmg + ' ' + damageType;
  } else {
    focusFire.push({ 
      name: targetName, 
      dmg: actualDamage, 
      status: '⚔️ ' + actualDamage + ' ' + damageType 
    });
  }
  
  renderInit();
  updateFocusFire();
  updateCombatStats();
  syncPlayerData();
}

// ====== STATYSTYKI ======
function updateCombatStats() {
  var statsContainer = document.getElementById('combatStats');
  if (!statsContainer) return;
  
  var alive = combatants.filter(function(c) { return c.status === 'active' || c.status === 'down'; });
  var dead = combatants.filter(function(c) { return c.status === 'dead'; });
  
  statsContainer.innerHTML = `
    <div class="stats-grid">
      <div class="stat-item"><span class="stat-label">⚔️ Aktywni</span><span class="stat-value">${alive.length}</span></div>
      <div class="stat-item"><span class="stat-label">💀 Martwi</span><span class="stat-value">${dead.length}</span></div>
      <div class="stat-item"><span class="stat-label">💥 Krytyki</span><span class="stat-value">${combatStats.crits}</span></div>
      <div class="stat-item"><span class="stat-label">💨 Pudła</span><span class="stat-value">${combatStats.misses}</span></div>
      <div class="stat-item"><span class="stat-label">⚡ Zadane DMG</span><span class="stat-value">${combatStats.totalDamage}</span></div>
    </div>
  `;
}

// ====== FOCUS FIRE ======
function updateFocusFire() {
  var container = document.getElementById('focusFireList');
  if (!container) return;
  var logHtml = getTurnLogDisplay();
  container.innerHTML = logHtml || '<div style="color:var(--muted);font-size:.6rem;text-align:center;padding:3px;">Brak akcji w tej rundzie</div>';
}

function resetFocusFire() {
  focusFire = [];
  turnLog = [];
  updateFocusFire();
}

function addTurnLog(name, action) {
  turnLog.push({ name: name, action: action, turn: round });
  if (turnLog.length > 20) turnLog.shift();
  updateFocusFire();
}

function getTurnLogDisplay() {
  return turnLog.slice(-5).map(function(e) {
    return '<div class="ff-target"><span class="ff-name">' + e.name + '</span><span class="ff-status">' + e.action + '</span></div>';
  }).join('');
}

// ====== SHOW INIT DMG / COND ======
function showInitDmg(index) {
  if (typeof dmgPopupTarget !== 'undefined') {
    dmgPopupTarget = { type: 'init', index: index };
  }
  if (typeof showDamagePopup === 'function') {
    showDamagePopup(combatants[index] ? combatants[index].name : 'Bojownik');
  }
}

function showInitCondPopup(index) {
  var c = combatants[index];
  if (!c) return;
  if (typeof showCondPopup === 'function') {
    showCondPopup(c.name, c.conditions || [], c.exhaustionLevel || 0, function(cond, exhaustionLevel) {
      if (cond) {
        var idx = c.conditions.indexOf(cond);
        if (idx > -1) c.conditions.splice(idx, 1);
        else { c.conditions.push(cond); addTurnLog(c.name, '👤 ' + getStateEmoji(cond) + ' ' + cond); }
      }
      if (exhaustionLevel !== undefined) {
        c.exhaustionLevel = Math.max(0, Math.min(6, exhaustionLevel));
      }
      renderInit();
      syncPlayerData();
      var popup = document.getElementById('condPopup');
      if (popup && typeof updateCondPopup === 'function') updateCondPopup(popup, c.conditions, c.exhaustionLevel);
    });
  }
}

// ====== RENDER INICJATYWY ======
function renderInit() {
  var list = document.getElementById('initList');
  if (!list) return;

  lastInitCount = combatants.length;
  list.innerHTML = '';

  if (combatants.length === 0) {
    var badge = document.getElementById('roundBadge');
    if (badge) badge.textContent = '— Runda 1 —';
    var turnBtns = document.getElementById('turnBtns');
    if (turnBtns) turnBtns.style.display = 'none';
    updateFocusFire();
    updateCombatStats();
    return;
  }

  updateRoundBadge();
  var turnBtns = document.getElementById('turnBtns');
  if (turnBtns) turnBtns.style.display = 'flex';

  combatants.forEach(function(c, i) {
    var div = document.createElement('div');
    div.className = 'init-entry' + (i === currentTurn ? ' current' : '') + (c.status === 'dead' ? ' dead' : '');
    if (i === combatants.length - 1) div.classList.add('slide-in');
    renderInitEntry(div, c, i);
    list.appendChild(div);
  });

  updateFocusFire();
  scrollToCurrentTurn();
  updateCombatStats();
}

function renderInitEntry(div, c, i) {
  var hpText = typeof c.hp === 'number' ? c.hp + '/' + c.maxHp + ' HP' : '? HP';
  var hpClass = typeof c.hp === 'number' && c.maxHp && c.hp / c.maxHp < 0.33 ? ' low' : '';
  if (c.status === 'dead') hpClass += ' dead';
  
  var condTags = '';
  if (c.conditions && c.conditions.length > 0) {
    condTags = c.conditions.map(function(cond) { 
      return '<span class="cond-tag">' + getStateEmoji(cond) + ' ' + cond + '</span>'; 
    }).join('');
  }
  
  var exhaustionTag = '';
  if (c.exhaustionLevel > 0) {
    var exLevel = c.exhaustionLevel > 6 ? 6 : c.exhaustionLevel;
    exhaustionTag = '<span class="cond-tag" style="background:rgba(255,107,107,0.15);border-color:rgba(255,107,107,0.2);color:var(--red);">🥱 Wyczerpanie ' + exLevel + '/6</span>';
  }
  
  var effectsTags = '';
  if (c.effects && c.effects.length > 0) {
    effectsTags = c.effects.map(function(e) {
      var timeStr = e.remaining >= 999 ? '∞' : e.remaining;
      return '<span class="effect-tag">⏱️ ' + e.name + ' (' + timeStr + ')</span>';
    }).join('');
  }
  
  var timerTags = '';
  if (c.timers && c.timers.length > 0) {
    timerTags = c.timers.map(function(t) {
      return '<span class="effect-tag" style="background:rgba(212,168,67,0.12);color:var(--gold);border-color:rgba(212,168,67,0.15);">⏱️ ' + t.name + ' (' + t.remaining + ')</span>';
    }).join('');
  }
  
  var dmgCounter = c.roundDamage > 0 ? '<span class="init-dmg-counter">⚔️' + c.roundDamage + '</span>' : '';
  var statusIcon = c.status === 'dead' ? '💀 ' : '';

  div.innerHTML = `
    <div class="init-badge">${c.init}</div>
    <div class="init-name">
      ${i === currentTurn ? '▶ ' : ''} ${statusIcon}${c.name}
      ${condTags}${exhaustionTag}${effectsTags}${timerTags}${dmgCounter}
      <button class="init-cond-btn ${c.conditions && c.conditions.length > 0 ? 'has-cond' : ''}" onclick="event.stopPropagation();showInitCondPopup(${i})" title="Zarządzaj stanami">${c.conditions && c.conditions.length > 0 ? '🔄' : '⚙️'}</button>
      <button class="init-cond-btn" onclick="event.stopPropagation();showInitDmg(${i})" title="Zadaj obrażenia">⚔️</button>
      ${c.status !== 'dead' ? '<button class="init-cond-btn" onclick="event.stopPropagation();addEffectPopup(' + i + ')" title="Dodaj efekt">⏱️</button>' : ''}
    </div>
    ${c.ac && c.ac !== '—' ? '<div class="init-ac" title="Klasa Pancerza">🛡 ' + c.ac + '</div>' : ''}
    ${typeof c.hp === 'number' ? '<div class="init-hp ' + hpClass + '" onclick="event.stopPropagation();showInitDmg(' + i + ')">' + hpText + '</div>' : ''}
    ${c.tempHp > 0 ? '<div class="init-temp" title="Tymczasowe HP">🛡️+' + c.tempHp + '</div>' : ''}
    <div class="init-remove" onclick="event.stopPropagation();removeCombatant(${i})">✕</div>
  `;
}

function updateRoundBadge() {
  var badge = document.getElementById('roundBadge');
  if (badge) {
    badge.textContent = combatants.length > 0 ? '— Runda ' + round + ' —' : '— Runda 1 —';
  }
}

function scrollToCurrentTurn() {
  var isMobile = window.innerWidth <= 768 || ('ontouchstart' in window);
  if (isMobile) {
    var current = document.querySelector('.init-entry.current');
    if (current) {
      setTimeout(function() {
        current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      }, 150);
    }
  }
}

// ====== RESET ======
function resetInit() {
  if (combatants.length > 0 && !confirm('Wyczyścić potyczkę? Wszystkie dane zostaną usunięte!')) return;
  
  combatants = [];
  currentTurn = 0;
  round = 1;
  focusFire = [];
  turnLog = [];
  combatActive = false;
  combatStats = {
    totalRounds: 0,
    totalDamage: 0,
    kills: 0,
    crits: 0,
    misses: 0,
    startTime: null,
    endTime: null
  };
  renderInit();
  updateFocusFire();
  updateCombatStats();
  syncPlayerData();
}

// ====== EKSPORT GLOBALNY ======
window.combatants = combatants;
window.currentTurn = currentTurn;
window.round = round;
window.focusFire = focusFire;
window.turnLog = turnLog;

window.addCombatant = addCombatant;
window.removeCombatant = removeCombatant;
window.sortInit = sortInit;
window.nextTurn = nextTurn;
window.resetInit = resetInit;
window.renderInit = renderInit;
window.updateFocusFire = updateFocusFire;
window.updateCombatStats = updateCombatStats;
window.addTurnLog = addTurnLog;
window.addEffect = addEffect;
window.addEffectPopup = addEffectPopup;
window.dealDamage = dealDamage;
window.performAttack = performAttack;
window.openAttackPopup = openAttackPopup;
window.closeAttackPopup = closeAttackPopup;
window.executeAttack = executeAttack;
window.openAddCombatantModal = openAddCombatantModal;
window.closeAddCombatantModal = closeAddCombatantModal;
window.confirmAddCombatant = confirmAddCombatant;
window.openAddFromPartyPopup = openAddFromPartyPopup;
window.closeAddFromPartyPopup = closeAddFromPartyPopup;
window.confirmAddFromPartyBulk = confirmAddFromPartyBulk;
window.showInitDmg = showInitDmg;
window.showInitCondPopup = showInitCondPopup;
window.openTimerPopup = openTimerPopup;
window.closeTimerPopup = closeTimerPopup;
window.addTimerToCombatant = addTimerToCombatant;
window.syncPlayerData = syncPlayerData;