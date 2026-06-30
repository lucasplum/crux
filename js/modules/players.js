// ============================================================
//  PLAYERS
// ============================================================

var players = [];
var selectedAvatar = '🧙';
var selectedAvatarUrl = '';
var conditionPopupTarget = null;
var dmgPopupTarget = null;

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
        selectedAvatar = '🧙';
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

// ====== MODAL ======
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
    deathSaves: { passes: 0, fails: 0 },
    avatar: selectedAvatarUrl || selectedAvatar
  });

  closeAddPlayerModal();
  renderPlayers();
  playSound('add');
}

// ====== RENDER ======
function renderPlayers() {
  var container = document.getElementById('playerTracker');
  if (!container) return;

  container.innerHTML = '';
  if (players.length === 0) {
    container.innerHTML = '<div style="color:var(--muted);font-size:.7rem;text-align:center;padding:12px;">👥 Brak postaci – kliknij „➕ Dodaj postać"</div>';
    return;
  }

  players.forEach(function(p, i) {
    var div = document.createElement('div');
    div.className = 'player-card';
    div.dataset.role = p.role;

    var hpPct = p.maxHp > 0 ? Math.round((p.hp / p.maxHp) * 100) : 0;
    var hpColor = hpPct < 25 ? 'var(--red)' : hpPct < 50 ? 'var(--gold)' : 'var(--green)';
    var condTags = p.conditions.map(function(c) { return '<span class="tag">' + getStateEmoji(c) + ' ' + c + '</span>'; }).join('');
    var ds = p.deathSaves || { passes: 0, fails: 0 };
    var avatarHtml = p.avatar && p.avatar.startsWith('http')
      ? '<img src="' + p.avatar + '" onerror="this.parentNode.innerHTML=\'' + (p.avatar && p.avatar.length <= 2 ? p.avatar : '🧙') + '\'">'
      : (p.avatar || '🧙');

    var firstState = p.conditions[0];
    var stateOverlay = firstState
      ? '<div class="avatar-state-overlay" style="color:' + getStateColor(firstState) + '">' + getStateEmoji(firstState) + '</div>'
      : '';

    var stateBtnClass = p.conditions.length > 0 ? 'p-state-btn has-conds' : 'p-state-btn';
    var stateBtnText = p.conditions.length > 0 ? '⚙️ Stany (' + p.conditions.length + ')' : '⚙️ Zarządzaj stanami';

    div.innerHTML = `
      <div class="p-header">
        <div class="p-avatar">${avatarHtml}${stateOverlay}</div>
        <div class="p-main">
          <div class="p-name">${p.name}<span class="${getRoleBadge(p.role)}">${p.role}</span>${p.hp <= 0 ? '💀' : ''}</div>
          <div class="p-stats-row">
            ${p.ac > 0 ? '<div class="p-ac-badge"><span class="ac-icon">🛡️</span><span class="ac-val">' + p.ac + '</span><span style="font-size:.6rem;color:var(--muted);margin-left:2px;">AC</span></div>' : ''}
            <div style="flex:1;"></div>
          </div>
        </div>
      </div>
      <div class="p-hp-wrap">
        <div class="p-hp-bar"><div class="p-hp-fill" style="width:${hpPct}%;background:linear-gradient(90deg,${hpColor},${hpColor}dd);"></div></div>
        <div class="p-hp-text" style="color:${hpColor}">${p.hp}/${p.maxHp}</div>
      </div>
      ${p.hp <= 0 ? '<div style="font-size:.55rem;color:var(--muted);margin:2px 0;">🪦 Death Saves: ✅' + ds.passes + ' ❌' + ds.fails + '</div>' : ''}
      <div class="p-stats">
        <span>❤️ ${p.hp}</span>
        ${p.conditions.length > 0 ? '<span>⚡ ' + p.conditions.length + '</span>' : ''}
      </div>
      <div class="p-cond">${condTags}</div>
      <button class="${stateBtnClass}" onclick="event.stopPropagation();showPlayerCondPopup(${i})">${stateBtnText}</button>
      <div class="p-controls">
        <button onclick="event.stopPropagation();showPlayerDmg(${i})">⚔️ Obrażenia</button>
        <button onclick="event.stopPropagation();addPlayerToInitiative(${i})">⚡ Do potyczki</button>
        ${p.hp <= 0 ? '<button class="success" onclick="event.stopPropagation();deathSave(' + i + ')">💀 Death Save</button>' : ''}
        <button class="danger" onclick="event.stopPropagation();removePlayer(${i})">✕</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function getRoleBadge(role) {
  var map = { 'Gracz': 'gracz', 'Companion': 'companion', 'Wróg': 'wrog', 'NPC': 'npc' };
  return 'p-role-badge ' + (map[role] || 'npc');
}

// ====== AKCJE ======
function removePlayer(index) {
  if (confirm('Usunąć ' + players[index]?.name + '?')) {
    players.splice(index, 1);
    renderPlayers();
  }
}

function deathSave(index) {
  var p = players[index];
  if (!p) return;
  var roll = rollDice(20);
  if (roll === 1) { p.deathSaves.fails += 2; playSound('death'); }
  else if (roll === 20) { p.hp = 1; p.deathSaves.passes = 0; p.deathSaves.fails = 0; playSound('crit'); renderPlayers(); return; }
  else if (roll >= 10) p.deathSaves.passes++;
  else p.deathSaves.fails++;

  if (p.deathSaves.fails >= 3) {
    playSound('death');
    if (confirm('💀 ' + p.name + ' umiera! Usunąć?')) {
      players.splice(index, 1);
      renderPlayers();
      return;
    }
  }
  if (p.deathSaves.passes >= 3) {
    p.hp = 1;
    p.deathSaves.passes = 0;
    p.deathSaves.fails = 0;
    playSound('add');
  }
  renderPlayers();
}

function addPlayerToInitiative(index) {
  var p = players[index];
  if (!p) return;
  var initVal = prompt('Inicjatywa dla ' + p.name + ':') || '0';
  addCombatant({
    name: p.name,
    init: parseInt(initVal) || 0,
    hp: p.hp,
    maxHp: p.maxHp,
    ac: p.ac,
    role: p.role,
    conditions: p.conditions.slice(),
    roundDamage: 0,
    avatar: p.avatar
  });
  renderInit();
  playSound('add');
}

function showPlayerDmg(index) {
  dmgPopupTarget = { type: 'player', index: index };
  showDamagePopup(players[index] ? players[index].name : 'Postać');
}

function showPlayerCondPopup(index) {
  conditionPopupTarget = { type: 'player', index: index };
  var p = players[index];
  if (!p) return;
  showCondPopup(p.name, p.conditions || [], function(cond) {
    var idx = p.conditions.indexOf(cond);
    if (idx > -1) p.conditions.splice(idx, 1);
    else { p.conditions.push(cond); addTurnLog(p.name, '👤 ' + getStateEmoji(cond) + ' ' + cond); }
    renderPlayers();
    var popup = document.getElementById('condPopup');
    if (popup) updateCondPopup(popup, p.conditions);
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
  popup.innerHTML = `
    <div class="popup-content dmg-popup-content">
      <div class="popup-title">⚔️ ${targetName}</div>
      <div class="dmg-sub">Wprowadź obrażenia lub rzuć kością</div>
      <div class="dmg-input-row"><input type="number" id="dmgAmount" placeholder="0" value="" step="1"/></div>
      <div class="dmg-btns">
        <button onclick="rollDmg(4)">🎲 k4</button>
        <button onclick="rollDmg(6)">🎲 k6</button>
        <button onclick="rollDmg(8)">🎲 k8</button>
        <button onclick="rollDmg(10)">🎲 k10</button>
        <button onclick="rollDmg(12)">🎲 k12</button>
        <button class="crit" onclick="rollDmg(20)">💀 k20</button>
      </div>
      <div class="dmg-check"><input type="checkbox" id="dmgCrit"/><label for="dmgCrit">💀 Krytyk (x2)</label></div>
      <div class="dmg-actions">
        <button class="btn-dmg" onclick="applyDamage()">⚔️ Zadaj</button>
        <button class="btn-cancel" onclick="closeDmgPopup()">Anuluj</button>
      </div>
    </div>
  `;
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
  if (input) { input.value = rollDice(sides); playSound('dice'); }
}

// ====== CONDITION POPUP ======
function showCondPopup(name, currentConds, onToggle) {
  var existing = document.getElementById('condPopup');
  if (existing) existing.remove();

  var allConds = ['Blinded', 'Charmed', 'Deafened', 'Frightened', 'Grappled', 'Incapacitated', 'Invisible', 'Paralyzed', 'Petrified', 'Poisoned', 'Prone', 'Restrained', 'Stunned', 'Unconscious', 'Exhaustion'];

  var popup = document.createElement('div');
  popup.className = 'popup-overlay';
  popup.id = 'condPopup';

  var btns = '';
  allConds.forEach(function(c) {
    var active = currentConds.indexOf(c) > -1 ? 'active' : '';
    btns += '<button class="cond-popup-btn ' + active + '" data-cond="' + c + '">' + getStateEmoji(c) + ' ' + c + '</button>';
  });

  popup.innerHTML = `
    <div class="popup-content cond-popup-content">
      <div class="popup-title">🐦‍⬛ ${name} — Stany</div>
      <div class="cond-popup-grid">${btns}</div>
      <button class="popup-close" onclick="closeCondPopup()">✕ Zamknij</button>
    </div>
  `;

  popup.querySelectorAll('.cond-popup-btn').forEach(function(b) {
    b.onclick = function() {
      var cond = b.dataset.cond;
      onToggle(cond);
      b.classList.toggle('active');
    };
  });

  document.body.appendChild(popup);
}

function updateCondPopup(popup, currentConds) {
  popup.querySelectorAll('.cond-popup-btn').forEach(function(b) {
    if (currentConds.indexOf(b.dataset.cond) > -1) b.classList.add('active');
    else b.classList.remove('active');
  });
}

function closeCondPopup() {
  var p = document.getElementById('condPopup');
  if (p) p.remove();
  conditionPopupTarget = null;
}
// ====== INICJALIZACJA PICKERA AWATARÓW ======
function initCombatantAvatarPicker() {
  // Prosta implementacja - jeśli istnieje grid avatarów dla bojowników
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

// Eksportuj
window.initCombatantAvatarPicker = initCombatantAvatarPicker;

// ====== Eksport globalny ======
window.openAddPlayerModal = openAddPlayerModal;
window.closeAddPlayerModal = closeAddPlayerModal;
window.confirmAddPlayer = confirmAddPlayer;
window.removePlayer = removePlayer;
window.deathSave = deathSave;
window.addPlayerToInitiative = addPlayerToInitiative;
window.showPlayerDmg = showPlayerDmg;
window.showPlayerCondPopup = showPlayerCondPopup;
window.closeDmgPopup = closeDmgPopup;
window.closeCondPopup = closeCondPopup;
window.rollDmg = rollDmg;
window.showDamagePopup = showDamagePopup;