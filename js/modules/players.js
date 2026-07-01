// ============================================================
//  PLAYERS - Z KRÓTKIM I DŁUGIM ODPOCZYNKEM
// ============================================================
var players = [];
var selectedAvatar = '';
var selectedAvatarUrl = '';
var conditionPopupTarget = null;
var dmgPopupTarget = null;

// ====== SYNCHRONIZACJA Z POTYCZKĄ ======
function syncToCombat() {
  if (typeof combatants === 'undefined' || !combatants) return;
  players.forEach(function(p) {
    var combatant = combatants.find(function(c) {
      return c.name === p.name && c.role === p.role;
    });
    if (combatant) {
      if (combatant.hp !== p.hp) p.hp = combatant.hp;
      if (JSON.stringify(combatant.conditions) !== JSON.stringify(p.conditions)) {
        p.conditions = combatant.conditions.slice();
      }
      if (combatant.exhaustionLevel !== p.exhaustionLevel) {
        p.exhaustionLevel = combatant.exhaustionLevel;
      }
    }
  });
  renderPlayers();
}

// ====== AVATAR PICKER ======
function initAvatarPicker() {
  document.querySelectorAll('#avatarGrid .avatar-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('#avatarGrid .avatar-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      selectedAvatar = btn.dataset.avatar;
      selectedAvatarUrl = '';
      var urlInput = document.getElementById('avatarUrl');
      if (urlInput) urlInput.value = '';
      updateAvatarPreview();
    });
  });
  var urlInput = document.getElementById('avatarUrl');
  if (urlInput) {
    urlInput.addEventListener('input', function() {
      var url = this.value.trim();
      if (url) {
        selectedAvatarUrl = url;
        selectedAvatar = '';
        document.querySelectorAll('#avatarGrid .avatar-btn').forEach(function(b) { b.classList.remove('active'); });
      } else {
        selectedAvatarUrl = '';
        selectedAvatar = '';
      }
      updateAvatarPreview();
    });
  }
}

function updateAvatarPreview() {
  var preview = document.getElementById('avatarPreview');
  if (!preview) return;
  if (selectedAvatarUrl) {
    preview.innerHTML = '<img src="' + selectedAvatarUrl + '" onerror="this.parentNode.textContent=\'🧙\'">';
  } else {
    preview.textContent = selectedAvatar;
  }
}

// ====== MODAL DODAWANIA ======
function openAddPlayerModal() {
  selectedAvatar = '🧙';
  selectedAvatarUrl = '';
  var nameInput = document.getElementById('pName');
  var hpInput = document.getElementById('pHp');
  var acInput = document.getElementById('pAc');
  var roleSelect = document.getElementById('pRole');
  var urlInput = document.getElementById('avatarUrl');
  if (nameInput) nameInput.value = '';
  if (hpInput) hpInput.value = '';
  if (acInput) acInput.value = '';
  if (roleSelect) roleSelect.value = 'Gracz';
  if (urlInput) urlInput.value = '';
  updateAvatarPreview();
  document.querySelectorAll('#avatarGrid .avatar-btn').forEach(function(b) {
    if (b.dataset.avatar === '🧙') b.classList.add('active');
    else b.classList.remove('active');
  });
  var popup = document.getElementById('addPlayerPopup');
  if (popup) {
    popup.style.display = 'flex';
    setTimeout(function() { if (nameInput) nameInput.focus(); }, 100);
  }
}

function closeAddPlayerModal() {
  var popup = document.getElementById('addPlayerPopup');
  if (popup) popup.style.display = 'none';
}

function confirmAddPlayer() {
  var nameInput = document.getElementById('pName');
  var hpInput = document.getElementById('pHp');
  var acInput = document.getElementById('pAc');
  var roleSelect = document.getElementById('pRole');
  var name = nameInput ? nameInput.value.trim() : '';
  var hp = parseInt(hpInput ? hpInput.value : 0) || 0;
  var ac = parseInt(acInput ? acInput.value : 0) || 0;
  var role = roleSelect ? roleSelect.value : 'Gracz';
  if (!name) { alert('Podaj imię postaci'); return; }
  players.push({
    name: name,
    hp: hp,
    maxHp: hp,
    ac: ac,
    role: role,
    conditions: [],
    exhaustionLevel: 0,
    deathSaves: { passes: 0, fails: 0 },
    avatar: selectedAvatarUrl || selectedAvatar
  });
  closeAddPlayerModal();
  renderPlayers();
  if (typeof playSound === 'function') playSound('add');
}

// ====== IMPORT POSTACI ======
function importPlayer() {
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = function(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
      try {
        var playerData = JSON.parse(ev.target.result);
        if (!playerData.name) {
          alert('❌ Niepoprawny plik - brak nazwy postaci');
          return;
        }
        if (confirm('✅ Zaimportować postać "' + playerData.name + '"?')) {
          players.push(playerData);
          renderPlayers();
          if (typeof saveState === 'function') saveState();
          alert('✅ Postać zaimportowana pomyślnie!');
        }
      } catch (err) {
        alert('❌ Błąd importu: ' + err.message);
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

// ====== RENDER ======
function renderPlayers() {
  var container = document.getElementById('playerTracker');
  if (!container) return;
  container.innerHTML = '';
  if (players.length === 0) {
    container.innerHTML = '<div style="color:var(--parchment-dim);font-size:.7rem;text-align:center;padding:12px;">👥 Brak postaci – kliknij „➕ Dodaj postać"</div>';
    return;
  }
  players.forEach(function(p, i) {
    var div = document.createElement('div');
    div.className = 'player-card';
    div.onclick = function() { openCharacterDetail(i); };
    div.dataset.role = p.role;
    var hpPct = p.maxHp > 0 ? Math.round((p.hp / p.maxHp) * 100) : 0;
    var hpColor = hpPct < 25 ? 'var(--red)' : hpPct < 50 ? 'var(--gold)' : 'var(--green)';

    var condTags = p.conditions.map(function(c) { 
      return '<span class="tag">' + getStateEmoji(c) + ' ' + c + '</span>'; 
    }).join('');

    var exhaustionTag = '';
    if (p.exhaustionLevel > 0) {
      var exLevel = p.exhaustionLevel > 6 ? 6 : p.exhaustionLevel;
      exhaustionTag = '<span class="tag" style="background:rgba(255,107,107,0.15);border-color:rgba(255,107,107,0.2);color:var(--red);">🥱 Wyczerpanie ' + exLevel + '/6</span>';
    }

    var ds = p.deathSaves || { passes: 0, fails: 0 };
    var avatarHtml = p.avatar && p.avatar.startsWith('http')
      ? '<img src="' + p.avatar + '" onerror="this.parentNode.innerHTML=\'' + (p.avatar && p.avatar.length <= 2 ? p.avatar : '🧙') + '\'">'
      : (p.avatar || '🧙');

    var firstState = p.conditions[0];
    var stateOverlay = firstState
      ? '<div class="avatar-state-overlay" style="color:' + getStateColor(firstState) + '">' + getStateEmoji(firstState) + '</div>'
      : '';

    var stateBtnClass = p.conditions.length > 0 || p.exhaustionLevel > 0 ? 'p-state-btn has-conds' : 'p-state-btn';
    var stateBtnText = (p.conditions.length > 0 || p.exhaustionLevel > 0) ? '⚙️ Stany (' + (p.conditions.length + (p.exhaustionLevel > 0 ? 1 : 0)) + ')' : '⚙️ Stany';

    var isDead = p.hp <= 0;
    var deathSaveText = isDead ? ' Death Saves: ✅' + ds.passes + ' ❌' + ds.fails : '';

    div.innerHTML = `
      <div class="p-header">
        <div class="p-avatar">${avatarHtml}${stateOverlay}</div>
        <div class="p-main">
          <div class="p-name">${p.name} <span class="${getRoleBadge(p.role)}">${p.role}</span>${isDead ? ' 💀' : ''}</div>
          <div class="p-stats-row">
            <div class="p-ac-badge"><span class="ac-icon">️</span><span class="ac-val">${p.ac}</span></div>
            <div class="p-maxhp-badge"><span class="hp-icon">❤️</span><span class="hp-val">${p.maxHp}</span></div>
          </div>
        </div>
      </div>
      
      <div class="p-hp-wrap">
        <div class="p-hp-bar">
          <div class="p-hp-fill" style="width:${hpPct}%;background:${hpColor};"></div>
        </div>
        <div class="p-hp-text" style="color:${hpColor}">${p.hp}</div>
      </div>
      
      ${isDead ? '<div style="font-size:.55rem;color:var(--parchment-dim);margin:2px 0;">' + deathSaveText + '</div>' : ''}
      
      <div class="p-cond">${condTags}${exhaustionTag}</div>
      
      <button class="${stateBtnClass}" onclick="event.stopPropagation();showPlayerCondPopup(${i})">${stateBtnText}</button>
      
      <div class="p-controls">
        <button class="primary" onclick="event.stopPropagation();addPlayerToInitiative(${i})">⚡ Do walki</button>
        <button class="success" onclick="event.stopPropagation();shortRestPlayer(${i})">☕ Krótki</button>
        <button class="success" onclick="event.stopPropagation();longRestPlayer(${i})">️ Długi</button>
        ${isDead ? '<button class="success" onclick="event.stopPropagation();deathSave(' + i + ')">💀 Death Save</button>' : ''}
        <button class="danger" onclick="event.stopPropagation();removePlayer(${i})">✕ Usuń</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function getRoleBadge(role) {
  var map = { 'Gracz': 'gracz', 'Companion': 'companion', 'Wróg': 'wrog', 'NPC': 'npc' };
  return 'p-role-badge ' + (map[role] || 'npc');
}

// ====== KRÓTKI ODPOCZYNEK ======
function shortRestPlayer(index) {
  var p = players[index];
  if (!p) return;
  var healAmount = Math.ceil(p.maxHp / 4);
  var newHp = Math.min(p.maxHp, p.hp + healAmount);
  var exhaustionReduction = p.exhaustionLevel > 0 ? 1 : 0;
  var msg = '☕ Krótki odpoczynek dla ' + p.name + '\n\n';
  msg += '• Leczenie: +' + healAmount + ' HP (' + p.hp + ' → ' + newHp + ')\n';
  msg += '• Wyczerpanie: -' + exhaustionReduction + ' poziom' + (exhaustionReduction > 0 ? ' (' + p.exhaustionLevel + ' → ' + (p.exhaustionLevel - 1) + ')' : ' (brak)');
  if (!confirm(msg)) return;
  p.hp = newHp;
  p.exhaustionLevel = Math.max(0, p.exhaustionLevel - exhaustionReduction);
  syncPlayerAfterRest(p);
  renderPlayers();
  if (typeof playSound === 'function') playSound('add');
}

// ====== DŁUGI ODPOCZYNEK ======
function longRestPlayer(index) {
  var p = players[index];
  if (!p) return;
  if (p.hp >= p.maxHp && p.conditions.length === 0 && p.exhaustionLevel === 0) {
    alert(p.name + ' jest już w pełni wypoczęty!');
    return;
  }
  if (!confirm('🛏️ Długi odpoczynek dla ' + p.name + '?\n\n• Przywraca pełne HP (' + p.maxHp + ')\n• Usuwa wszystkie stany\n• Resetuje wyczerpanie\n• Resetuje Death Saves')) return;
  p.hp = p.maxHp;
  p.conditions = [];
  p.exhaustionLevel = 0;
  p.deathSaves = { passes: 0, fails: 0 };
  syncPlayerAfterRest(p);
  renderPlayers();
  if (typeof playSound === 'function') playSound('add');
}

// ====== SYNCHRONIZACJA PO ODPOCZYNKU ======
function syncPlayerAfterRest(player) {
  if (typeof combatants === 'undefined') return;
  var combatant = combatants.find(function(c) {
    return c.name === player.name && c.role === player.role;
  });
  if (combatant) {
    combatant.hp = player.hp;
    combatant.conditions = player.conditions.slice();
    combatant.exhaustionLevel = player.exhaustionLevel;
    if (player.hp > 0) {
      combatant.status = 'active';
    }
    if (typeof renderInit === 'function') renderInit();
    if (typeof updateCombatStats === 'function') updateCombatStats();
  }
}

// ====== AKCJE ======
function removePlayer(index) {
  if (confirm('Usunąć ' + players[index].name + '?')) {
    if (typeof combatants !== 'undefined') {
      var idx = combatants.findIndex(function(c) {
        return c.name === players[index].name && c.role === players[index].role;
      });
      if (idx > -1) {
        combatants.splice(idx, 1);
        if (typeof renderInit === 'function') renderInit();
        if (typeof updateCombatStats === 'function') updateCombatStats();
      }
    }
    players.splice(index, 1);
    renderPlayers();
  }
}

function deathSave(index) {
  var p = players[index];
  if (!p) return;
  var roll = rollDice(20);
  if (roll === 1) { p.deathSaves.fails += 2; if (typeof playSound === 'function') playSound('death'); }
  else if (roll === 20) { p.hp = 1; p.deathSaves.passes = 0; p.deathSaves.fails = 0; if (typeof playSound === 'function') playSound('crit'); renderPlayers(); syncToCombat(); return; }
  else if (roll >= 10) p.deathSaves.passes++;
  else p.deathSaves.fails++;
  if (p.deathSaves.fails >= 3) {
    if (typeof playSound === 'function') playSound('death');
    if (confirm('💀 ' + p.name + ' umiera! Usunąć?')) {
      removePlayer(index);
      return;
    }
  }
  if (p.deathSaves.passes >= 3) {
    p.hp = 1;
    p.deathSaves.passes = 0;
    p.deathSaves.fails = 0;
    if (typeof playSound === 'function') playSound('add');
  }
  renderPlayers();
  syncToCombat();
}

function addPlayerToInitiative(index) {
  var p = players[index];
  if (!p) return;
  if (typeof combatants !== 'undefined') {
    var exists = combatants.some(function(c) {
      return c.name === p.name && c.role === p.role;
    });
    if (exists) {
      alert('Ta postać jest już w potyczce!');
      return;
    }
  }
  var initVal = prompt('Inicjatywa dla ' + p.name + ':') || '0';
  if (typeof addCombatant === 'function') {
    addCombatant({
      name: p.name,
      init: parseInt(initVal) || 0,
      hp: p.hp,
      maxHp: p.maxHp,
      ac: p.ac,
      role: p.role,
      conditions: p.conditions.slice(),
      exhaustionLevel: p.exhaustionLevel || 0,
      roundDamage: 0,
      avatar: p.avatar
    });
  }
  if (typeof playSound === 'function') playSound('add');
}

function showPlayerCondPopup(index) {
  conditionPopupTarget = { type: 'player', index: index };
  var p = players[index];
  if (!p) return;
  showCondPopup(p.name, p.conditions || [], p.exhaustionLevel || 0, function(cond, exhaustionLevel) {
    if (cond) {
      var idx = p.conditions.indexOf(cond);
      if (idx > -1) p.conditions.splice(idx, 1);
      else { p.conditions.push(cond); if (typeof addTurnLog === 'function') addTurnLog(p.name, '👤 ' + getStateEmoji(cond) + ' ' + cond); }
    }
    if (exhaustionLevel !== undefined) {
      p.exhaustionLevel = Math.max(0, Math.min(6, exhaustionLevel));
    }
    renderPlayers();
    syncToCombat();
    var popup = document.getElementById('condPopup');
    if (popup && typeof updateCondPopup === 'function') updateCondPopup(popup, p.conditions, p.exhaustionLevel);
  });
}

function triggerHpHitAnimation(index) {
  var cards = document.querySelectorAll('.player-card');
  if (cards[index]) {
    cards[index].classList.remove('hp-hit');
    void cards[index].offsetWidth;
    cards[index].classList.add('hp-hit');
    setTimeout(function() { cards[index].classList.remove('hp-hit'); }, 600);
  }
}

// ====== DAMAGE POPUP ======
function showDamagePopup(targetName) {
  var existing = document.getElementById('dmgPopup');
  if (existing) existing.remove();
  var popup = document.createElement('div');
  popup.className = 'popup-overlay';
  popup.id = 'dmgPopup';
  popup.innerHTML = `<div class="popup-content dmg-popup-content">
    <div class="popup-title">⚔️ ${targetName}</div>
    <div class="dmg-sub">Wprowadź obrażenia lub rzuć kością</div>
    <div class="dmg-input-row">
      <input type="number" id="dmgAmount" placeholder="0" value="" step="1"/>
    </div>
    <div class="dmg-btns">
      <button onclick="rollDmg(4)">🎲 k4</button>
      <button onclick="rollDmg(6)">🎲 k6</button>
      <button onclick="rollDmg(8)">🎲 k8</button>
      <button onclick="rollDmg(10)">🎲 k10</button>
      <button onclick="rollDmg(12)">🎲 k12</button>
      <button class="crit" onclick="rollDmg(20)">💀 k20</button>
    </div>
    <div class="dmg-check">
      <input type="checkbox" id="dmgCrit"/>
      <label for="dmgCrit">💀 Krytyk (x2)</label>
    </div>
    <div class="dmg-actions">
      <button class="btn-dmg" onclick="applyDamage()">⚔️ Zadaj</button>
      <button class="btn-cancel" onclick="closeDmgPopup()">Anuluj</button>
    </div>
  </div>`;
  document.body.appendChild(popup);
  var input = document.getElementById('dmgAmount');
  if (input) {
    input.focus();
    setTimeout(function() { input.select(); }, 100);
  }
}

function closeDmgPopup() {
  var p = document.getElementById('dmgPopup');
  if (p) p.remove();
  dmgPopupTarget = null;
}

function rollDmg(sides) {
  var input = document.getElementById('dmgAmount');
  if (input) { input.value = rollDice(sides); if (typeof playSound === 'function') playSound('dice'); }
}

function applyDamage() {
  var input = document.getElementById('dmgAmount');
  var critCheck = document.getElementById('dmgCrit');
  if (!input) return;
  var dmg = parseInt(input.value);
  if (isNaN(dmg) || dmg < 0) { alert('Podaj poprawną wartość obrażeń'); return; }
  if (critCheck && critCheck.checked) dmg *= 2;
  if (dmgPopupTarget) {
    if (dmgPopupTarget.type === 'player') {
      var p = players[dmgPopupTarget.index];
      if (p) {
        p.hp = Math.max(0, p.hp - dmg);
        triggerHpHitAnimation(dmgPopupTarget.index);
        renderPlayers();
        syncToCombat();
        if (typeof playSound === 'function') playSound('hit');
      }
    } else if (dmgPopupTarget.type === 'init') {
      var c = combatants[dmgPopupTarget.index];
      if (c) {
        if (typeof dealDamage === 'function') {
          dealDamage(null, dmgPopupTarget.index, dmg, 'obrażenia', false);
        }
      }
    }
  }
  closeDmgPopup();
}

// ====== CONDITION POPUP ======
function showCondPopup(name, currentConds, exhaustionLevel, onToggle) {
  var existing = document.getElementById('condPopup');
  if (existing) existing.remove();
  var popup = document.createElement('div');
  popup.className = 'popup-overlay';
  popup.id = 'condPopup';
  var btns = '';
  POLISH_STATES.forEach(function(c) {
    var active = currentConds.indexOf(c) > -1 ? 'active' : '';
    btns += '<button class="cond-popup-btn ' + active + '" data-cond="' + c + '">' + getStateEmoji(c) + ' ' + c + '</button>';
  });
  var exLevel = exhaustionLevel || 0;
  var exBtns = '';
  for (var i = 0; i <= 6; i++) {
    var active = i === exLevel ? 'active' : '';
    exBtns += '<button class="cond-popup-btn ' + active + '" data-exhaustion="' + i + '" style="min-width:36px;justify-content:center;">' + i + '</button>';
  }
  popup.innerHTML = `<div class="popup-content cond-popup-content">
    <div class="popup-title">🐦‍⬛ ${name} — Stany</div>
    <div style="margin-bottom:8px;font-size:var(--font-sm);color:var(--parchment-dim);">🥱 Wyczerpanie (0-6):</div>
    <div class="cond-popup-grid" style="grid-template-columns:repeat(7,1fr);margin-bottom:12px;">${exBtns}</div>
    <div style="margin-bottom:8px;font-size:var(--font-sm);color:var(--parchment-dim);">📋 Stany:</div>
    <div class="cond-popup-grid">${btns}</div>
    <button class="popup-close" onclick="closeCondPopup()">✕ Zamknij</button>
  </div>`;
  var currentExhaustion = exLevel;
  popup.querySelectorAll('.cond-popup-btn[data-exhaustion]').forEach(function(b) {
    b.onclick = function() {
      var level = parseInt(b.dataset.exhaustion);
      currentExhaustion = level;
      popup.querySelectorAll('.cond-popup-btn[data-exhaustion]').forEach(function(bb) {
        bb.classList.toggle('active', parseInt(bb.dataset.exhaustion) === level);
      });
      onToggle(null, level);
    };
  });
  popup.querySelectorAll('.cond-popup-btn[data-cond]').forEach(function(b) {
    b.onclick = function() {
      var cond = b.dataset.cond;
      onToggle(cond, undefined);
      b.classList.toggle('active');
    };
  });
  document.body.appendChild(popup);
}

function updateCondPopup(popup, currentConds, exhaustionLevel) {
  popup.querySelectorAll('.cond-popup-btn[data-cond]').forEach(function(b) {
    if (currentConds.indexOf(b.dataset.cond) > -1) b.classList.add('active');
    else b.classList.remove('active');
  });
  popup.querySelectorAll('.cond-popup-btn[data-exhaustion]').forEach(function(b) {
    var level = parseInt(b.dataset.exhaustion);
    b.classList.toggle('active', level === (exhaustionLevel || 0));
  });
}

function closeCondPopup() {
  var p = document.getElementById('condPopup');
  if (p) p.remove();
  conditionPopupTarget = null;
}

// ====== INICJALIZACJA PICKERA AWATARÓW ======
function initCombatantAvatarPicker() {
  var grid = document.getElementById('combatantAvatarGrid');
  if (!grid) return;
  var buttons = grid.querySelectorAll('.avatar-btn');
  buttons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      buttons.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var preview = document.getElementById('combatantAvatarPreview');
      if (preview) preview.textContent = btn.dataset.avatar;
    });
  });
}

// ====== OTWIERANIE SZCZEGÓŁÓW POSTACI ======
function openCharacterDetail(index) {
    var p = players[index];
    if (!p) return;
    
    var overlay = document.getElementById('characterDetailOverlay');
    var content = document.getElementById('characterDetailContent');
    if (!overlay || !content) return;
    
    // Kolor nagłówka w zależności od roli
    var roleColors = {
        'Gracz': '#4a6fa5',
        'Companion': '#4a7a5f',
        'Wróg': '#8a2a22',
        'NPC': '#6a5a3a'
    };
    var headerColor = roleColors[p.role] || '#5a1a14';
    
    // Oblicz procent HP
    var hpPct = p.maxHp > 0 ? Math.round((p.hp / p.maxHp) * 100) : 0;
    var hpColor = hpPct < 25 ? '#ff6b6b' : hpPct < 50 ? '#d4a843' : '#6bff9e';
    
    // Stany
    var condHtml = p.conditions && p.conditions.length > 0 
        ? p.conditions.map(function(c) { 
            return '<span class="char-condition-tag">' + getStateEmoji(c) + ' ' + c + '</span>'; 
          }).join('')
        : '<span style="color:var(--parchment-dim);font-style:italic;">Brak stanów</span>';
    
    // Wyczerpanie
    var exHtml = p.exhaustionLevel > 0 
        ? '<span class="char-condition-tag exhaustion">🥱 Wyczerpanie ' + p.exhaustionLevel + '/6</span>'
        : '';
    
    // Death Saves
    var ds = p.deathSaves || { passes: 0, fails: 0 };
    var dsHtml = p.hp <= 0 
        ? '<div style="margin-top:8px;font-size:var(--font-sm);color:var(--parchment-dim);">💀 Death Saves: ✅' + ds.passes + ' ❌' + ds.fails + '</div>'
        : '';
    
    // Atrybuty (jeśli istnieją)
    var attrs = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    var attrLabels = {'str':'Siła','dex':'Zręczność','con':'Kondycja','int':'Inteligencja','wis':'Mądrość','cha':'Charyzma'};
    var attrIcons = {'str':'💪','dex':'🏃','con':'❤️','int':'🧠','wis':'👁️','cha':'💬'};
    
    var attrHtml = attrs.map(function(a) {
        var val = p[a] || 10;
        var mod = Math.floor((val - 10) / 2);
        var modStr = mod >= 0 ? '+' + mod : '' + mod;
        return '<div class="char-attr-box">' +
            '<div class="char-attr-name">' + attrIcons[a] + ' ' + attrLabels[a] + '</div>' +
            '<div class="char-attr-mod">' + modStr + '</div>' +
            '<div class="char-attr-score">' + val + '</div>' +
        '</div>';
    }).join('');
    
    // Biegłości (jeśli istnieją)
    var profHtml = '';
    if (p.proficiencies && p.proficiencies.length > 0) {
        profHtml = '<div class="char-section"><div class="char-section-title">🎯 Biegłości</div>' +
            '<div style="display:flex;flex-wrap:wrap;gap:6px;">' +
            p.proficiencies.map(function(prof) {
                return '<span style="background:rgba(185,146,74,0.08);border:1px solid var(--line);border-radius:4px;padding:4px 12px;font-size:var(--font-sm);">' + prof + '</span>';
            }).join('') +
            '</div></div>';
    }
    
    // Ekwipunek (jeśli istnieje)
    var equipHtml = '';
    if (p.weapons || p.armor || p.items) {
        equipHtml = '<div class="char-section"><div class="char-section-title">🎒 Ekwipunek</div><div class="equipment-list">';
        if (p.weapons) {
            equipHtml += '<div class="equipment-category"><div class="equipment-category-title">⚔️ Broń</div><div class="equipment-items">' + p.weapons + '</div></div>';
        }
        if (p.armor) {
            equipHtml += '<div class="equipment-category"><div class="equipment-category-title">🛡️ Zbroja</div><div class="equipment-items">' + p.armor + '</div></div>';
        }
        if (p.items) {
            equipHtml += '<div class="equipment-category"><div class="equipment-category-title">📦 Przedmioty</div><div class="equipment-items">' + p.items + '</div></div>';
        }
        if (p.gold !== undefined) {
            equipHtml += '<div class="equipment-category"><div class="equipment-category-title">💰 Waluta</div><div class="equipment-items">🪙 ' + p.gold + ' sztuk złota</div></div>';
        }
        equipHtml += '</div></div>';
    }
    
    // Osobowość (jeśli istnieje)
    var personalityHtml = '';
    if (p.personalityTrait || p.personalityIdeal || p.personalityBond || p.personalityFlaw) {
        personalityHtml = '<div class="char-section"><div class="char-section-title">🎭 Osobowość</div><div class="char-personality-grid">';
        if (p.personalityTrait) {
            personalityHtml += '<div class="char-personality-box"><div class="char-personality-label">Cecha</div><div class="char-personality-text">' + p.personalityTrait + '</div></div>';
        }
        if (p.personalityIdeal) {
            personalityHtml += '<div class="char-personality-box"><div class="char-personality-label">Ideał</div><div class="char-personality-text">' + p.personalityIdeal + '</div></div>';
        }
        if (p.personalityBond) {
            personalityHtml += '<div class="char-personality-box"><div class="char-personality-label">Więź</div><div class="char-personality-text">' + p.personalityBond + '</div></div>';
        }
        if (p.personalityFlaw) {
            personalityHtml += '<div class="char-personality-box"><div class="char-personality-label">Wada</div><div class="char-personality-text">' + p.personalityFlaw + '</div></div>';
        }
        personalityHtml += '</div></div>';
    }
    
    // Backstory
    var backstoryHtml = p.backstory 
        ? '<div class="char-section"><div class="char-section-title">📖 Historia</div><div class="char-history-text">' + p.backstory + '</div></div>'
        : '';
    
    // Awatar
    var avatarHtml = p.avatar && p.avatar.startsWith('http')
        ? '<img src="' + p.avatar + '" onerror="this.parentNode.textContent=\'🧙\'">'
        : (p.avatar || '🧙');
    
    content.innerHTML = `
        <div class="char-header" style="background:linear-gradient(135deg, ${headerColor}, ${headerColor}dd);">
            <div class="char-avatar-large">${avatarHtml}</div>
            <div class="char-title-group">
                <h1 class="char-name">${p.name}</h1>
                <div class="char-subtitle">${p.role}${p.class ? ' · ' + p.class : ''}${p.level ? ' (poziom ' + p.level + ')' : ''}</div>
                ${p.race ? '<div class="char-subtitle" style="font-size:var(--font-sm);">' + p.race + (p.background ? ' · ' + p.background : '') + '</div>' : ''}
                ${p.alignment ? '<div class="char-alignment">' + p.alignment + '</div>' : ''}
            </div>
        </div>
        
        <div class="char-main-stats">
            <div class="char-stat-box char-stat-hp">
                <div class="char-stat-value" style="color:${hpColor};">${p.hp}</div>
                <div class="char-stat-label">❤️ HP / ${p.maxHp}</div>
                <div class="char-hp-bar-mini" style="width:${hpPct}%;background:${hpColor};"></div>
            </div>
            <div class="char-stat-box">
                <div class="char-stat-value">${p.ac}</div>
                <div class="char-stat-label">🛡️ KP (AC)</div>
            </div>
            <div class="char-stat-box">
                <div class="char-stat-value">${p.speed || '30'}</div>
                <div class="char-stat-label">💨 Prędkość</div>
            </div>
            <div class="char-stat-box">
                <div class="char-stat-value">${p.passivePerception || 10}</div>
                <div class="char-stat-label">👁️ Pasywna Percepcja</div>
            </div>
        </div>
        
        ${dsHtml}
        
        <div class="char-section">
            <div class="char-section-title">💪 Atrybuty</div>
            <div class="char-attributes-grid">${attrHtml}</div>
        </div>
        
        <div class="char-section">
            <div class="char-section-title">⚡ Stany i efekty</div>
            <div class="char-conditions-list">${condHtml} ${exHtml}</div>
            <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;">
                <button class="char-action-btn" onclick="closeCharacterDetail();showPlayerCondPopup(${index});">⚙️ Zarządzaj stanami</button>
                <button class="char-action-btn" onclick="closeCharacterDetail();showDamagePopup('${p.name}');">⚔️ Zadaj obrażenia</button>
                ${p.hp <= 0 ? '<button class="char-action-btn" onclick="closeCharacterDetail();deathSave(' + index + ');">💀 Death Save</button>' : ''}
            </div>
        </div>
        
        ${profHtml}
        ${equipHtml}
        ${personalityHtml}
        ${backstoryHtml}
        
        <div class="char-actions">
            <button class="char-action-btn primary" onclick="closeCharacterDetail();addPlayerToInitiative(${index});">⚔️ Do potyczki</button>
            <button class="char-action-btn" onclick="closeCharacterDetail();shortRestPlayer(${index});">☕ Krótki odpoczynek</button>
            <button class="char-action-btn" onclick="closeCharacterDetail();longRestPlayer(${index});">🛏️ Długi odpoczynek</button>
            <button class="char-action-btn danger" onclick="if(confirm('Usunąć ${p.name}?')){closeCharacterDetail();removePlayer(${index});}">🗑️ Usuń</button>
        </div>
    `;
    
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeCharacterDetail() {
    var overlay = document.getElementById('characterDetailOverlay');
    if (overlay) {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Zamknij ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeCharacterDetail();
    }
});

// Kliknięcie w tło
document.addEventListener('click', function(e) {
    var overlay = document.getElementById('characterDetailOverlay');
    if (overlay && e.target === overlay) {
        closeCharacterDetail();
    }
});

// ====== EKSPORT GLOBALNY ======
window.openAddPlayerModal = openAddPlayerModal;
window.closeAddPlayerModal = closeAddPlayerModal;
window.confirmAddPlayer = confirmAddPlayer;
window.removePlayer = removePlayer;
window.deathSave = deathSave;
window.addPlayerToInitiative = addPlayerToInitiative;
window.showPlayerCondPopup = showPlayerCondPopup;
window.closeDmgPopup = closeDmgPopup;
window.closeCondPopup = closeCondPopup;
window.rollDmg = rollDmg;
window.showDamagePopup = showDamagePopup;
window.applyDamage = applyDamage;
window.players = players;
window.renderPlayers = renderPlayers;
window.syncToCombat = syncToCombat;
window.shortRestPlayer = shortRestPlayer;
window.longRestPlayer = longRestPlayer;
window.syncPlayerAfterRest = syncPlayerAfterRest;
window.importPlayer = importPlayer;
window.initCombatantAvatarPicker = initCombatantAvatarPicker;