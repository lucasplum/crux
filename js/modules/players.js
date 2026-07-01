// ============================================================
//  PLAYERS - PEŁNY SYSTEM POSTACI Z KLIKANIEM KART
// ============================================================
var players = [];
var selectedAvatar = '🧙';
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

// ====== MODAL DODAWANIA ======
function openAddPlayerModal() {
  selectedAvatar = '';
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
    name: name, hp: hp, maxHp: hp, ac: ac, role: role,
    conditions: [], exhaustionLevel: 0,
    deathSaves: { passes: 0, fails: 0 },
    avatar: selectedAvatarUrl || selectedAvatar
  });
  closeAddPlayerModal();
  renderPlayers();
  if (typeof playSound === 'function') playSound('add');
}

// ============================================================
//  RENDER KART POSTACI - Z KLIKANIEM OTWIERAJĄCYM SZCZEGÓŁY
// ============================================================
function renderPlayers() {
  var container = document.getElementById('playerTracker');
  if (!container) return;
  container.innerHTML = '';
  
  if (players.length === 0) {
    container.innerHTML = '<div style="color:var(--parchment-dim);font-size:.9rem;text-align:center;padding:40px;">👥 Brak postaci – kliknij „ Dodaj postać"</div>';
    return;
  }
  
  players.forEach(function(p, i) {
    var div = document.createElement('div');
    div.className = 'player-card';
    div.dataset.role = p.role;
    div.style.cursor = 'pointer';
    
    // Kliknięcie w kartę otwiera szczegóły
    div.onclick = function(e) {
      // Jeśli kliknięto w przycisk - nie otwieraj szczegółów
      if (e.target.closest('button')) return;
      openPlayerDetail(i);
    };
    
    var hpPct = p.maxHp > 0 ? Math.round((p.hp / p.maxHp) * 100) : 0;
    var hpColor = hpPct < 25 ? '#ff6b6b' : hpPct < 50 ? '#d4a843' : '#6bff9e';

    var condTags = (p.conditions || []).map(function(c) { 
      return '<span class="tag">' + getStateEmoji(c) + ' ' + c + '</span>'; 
    }).join('');

    var exhaustionTag = '';
    if (p.exhaustionLevel > 0) {
      var exLevel = p.exhaustionLevel > 6 ? 6 : p.exhaustionLevel;
      exhaustionTag = '<span class="tag" style="background:rgba(255,107,107,0.15);border-color:rgba(255,107,107,0.2);color:#ff6b6b;">🥱 Wyczerpanie ' + exLevel + '/6</span>';
    }

    var ds = p.deathSaves || { passes: 0, fails: 0 };
    var avatarHtml = p.avatar && p.avatar.startsWith('http')
      ? '<img src="' + p.avatar + '" onerror="this.parentNode.innerHTML=\'' + (p.avatar && p.avatar.length <= 2 ? p.avatar : '🧙') + '\'">'
      : (p.avatar || '🧙');

    var firstState = (p.conditions || [])[0];
    var stateOverlay = firstState
      ? '<div class="avatar-state-overlay" style="color:' + getStateColor(firstState) + '">' + getStateEmoji(firstState) + '</div>'
      : '';

    var stateBtnClass = (p.conditions && p.conditions.length > 0) || p.exhaustionLevel > 0 ? 'p-state-btn has-conds' : 'p-state-btn';
    var stateBtnText = ((p.conditions && p.conditions.length > 0) || p.exhaustionLevel > 0) 
      ? '⚙️ Stany (' + ((p.conditions ? p.conditions.length : 0) + (p.exhaustionLevel > 0 ? 1 : 0)) + ')' 
      : '️ Stany';

    var isDead = p.hp <= 0;
    var deathSaveText = isDead ? '💀 Death Saves: ✅' + ds.passes + ' ❌' + ds.fails : '';

    div.innerHTML = 
      '<div class="p-header">' +
        '<div class="p-avatar">' + avatarHtml + stateOverlay + '</div>' +
        '<div class="p-main">' +
          '<div class="p-name">' + p.name + ' <span class="' + getRoleBadge(p.role) + '">' + p.role + '</span>' + (isDead ? ' 💀' : '') + '</div>' +
          '<div class="p-stats-row">' +
            '<div class="p-ac-badge"><span class="ac-icon">🛡️</span><span class="ac-val">' + p.ac + '</span></div>' +
            '<div class="p-maxhp-badge"><span class="hp-icon">❤️</span><span class="hp-val">' + p.maxHp + '</span></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="p-hp-wrap">' +
        '<div class="p-hp-bar"><div class="p-hp-fill" style="width:' + hpPct + '%;background:' + hpColor + ';"></div></div>' +
        '<div class="p-hp-text" style="color:' + hpColor + '">' + p.hp + '</div>' +
      '</div>' +
      (isDead ? '<div style="font-size:.7rem;color:var(--parchment-dim);margin:4px 0;">' + deathSaveText + '</div>' : '') +
      '<div class="p-cond">' + condTags + exhaustionTag + '</div>' +
      '<button class="' + stateBtnClass + '" onclick="event.stopPropagation();showPlayerCondPopup(' + i + ')">' + stateBtnText + '</button>' +
      '<div class="p-controls">' +
        '<button class="primary" onclick="event.stopPropagation();openPlayerDetail(' + i + ')">📋 Szczegóły</button>' +
        '<button class="success" onclick="event.stopPropagation();addPlayerToInitiative(' + i + ')"> Do walki</button>' +
        '<button class="success" onclick="event.stopPropagation();shortRestPlayer(' + i + ')">☕ Krótki</button>' +
        '<button class="success" onclick="event.stopPropagation();longRestPlayer(' + i + ')">🛏️ Długi</button>' +
        (isDead ? '<button class="success" onclick="event.stopPropagation();deathSave(' + i + ')">💀 Death Save</button>' : '') +
        '<button class="danger" onclick="event.stopPropagation();removePlayer(' + i + ')">✕ Usuń</button>' +
      '</div>';
    
    container.appendChild(div);
  });
}

// ============================================================
//  WIDOK SZCZEGÓŁOWY POSTACI - DYNAMICZNY MODAL
// ============================================================
function openPlayerDetail(index) {
  var player = players[index];
  if (!player) return;
  
  // Oblicz modyfikatory
  var strMod = Math.floor((player.str || 10) - 10) / 2);
  var dexMod = Math.floor((player.dex || 10) - 10) / 2);
  var conMod = Math.floor((player.con || 10) - 10) / 2);
  var intMod = Math.floor((player.int || 10) - 10) / 2);
  var wisMod = Math.floor((player.wis || 10) - 10) / 2);
  var chaMod = Math.floor((player.cha || 10) - 10) / 2);
  
  var strModStr = strMod >= 0 ? '+' + strMod : strMod;
  var dexModStr = dexMod >= 0 ? '+' + dexMod : dexMod;
  var conModStr = conMod >= 0 ? '+' + conMod : conMod;
  var intModStr = intMod >= 0 ? '+' + intMod : intMod;
  var wisModStr = wisMod >= 0 ? '+' + wisMod : wisMod;
  var chaModStr = chaMod >= 0 ? '+' + chaMod : chaMod;
  
  var hpPercent = player.maxHp > 0 ? Math.round((player.hp / player.maxHp) * 100) : 0;
  var hpColor = hpPercent < 25 ? '#ff6b6b' : hpPercent < 50 ? '#d4a843' : '#6bff9e';
  
  var roleColor = getPlayerColor(player.role);
  var roleColorDark = getPlayerColorDark(player.role);
  
  var avatarHtml = player.avatar && player.avatar.startsWith('http')
    ? '<img src="' + player.avatar + '" style="width:100%;height:100%;object-fit:cover;border-radius:10px;" onerror="this.parentNode.innerHTML=\'🧙\'">'
    : (player.avatar || '🧙');
  
  var conditionsHtml = '';
  if (player.conditions && player.conditions.length > 0) {
    conditionsHtml = player.conditions.map(function(c) {
      return '<span class="char-condition-tag">' + getStateEmoji(c) + ' ' + c + '</span>';
    }).join('');
  }
  if (player.exhaustionLevel > 0) {
    conditionsHtml += '<span class="char-condition-tag exhaustion"> Wyczerpanie ' + Math.min(player.exhaustionLevel, 6) + '/6</span>';
  }
  
  // Znajdź lub utwórz modal
  var overlay = document.getElementById('characterDetailOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'characterDetailOverlay';
    overlay.className = 'character-detail-overlay';
    overlay.onclick = function(e) {
      if (e.target === overlay) closeCharacterDetail();
    };
    document.body.appendChild(overlay);
  }
  
  var content = document.getElementById('characterDetailContent');
  if (!content) {
    content = document.createElement('div');
    content.id = 'characterDetailContent';
    content.className = 'character-detail-container';
    overlay.appendChild(content);
  }
  
  content.innerHTML = 
    '<button class="character-detail-close" onclick="closeCharacterDetail()">← Powrót do biblioteki</button>' +
    
    '<div class="char-header" style="background: linear-gradient(135deg, ' + roleColor + ' 0%, ' + roleColorDark + ' 100%);">' +
      '<div class="char-avatar-large">' + avatarHtml + '</div>' +
      '<div class="char-title-group">' +
        '<h1 class="char-name">' + player.name + '</h1>' +
        '<div class="char-subtitle">' + (player.race || 'Nieznana rasa') + ' · ' + (player.class || player.role || 'Postać') + ' · Poziom ' + (player.level || 1) + '</div>' +
        '<div class="char-alignment">' + (player.alignment || 'Neutralny') + '</div>' +
      '</div>' +
    '</div>' +
    
    '<div class="char-main-stats">' +
      '<div class="char-stat-box char-stat-hp">' +
        '<div class="char-stat-value" style="color: ' + hpColor + '">' + player.hp + '/' + player.maxHp + '</div>' +
        '<div class="char-stat-label">PUNKTY WYTRZYMAŁOŚCI</div>' +
        '<div class="char-hp-bar-mini" style="background: ' + hpColor + '; width: ' + hpPercent + '%"></div>' +
      '</div>' +
      '<div class="char-stat-box"><div class="char-stat-value">' + player.ac + '</div><div class="char-stat-label">KLASA PANCERZA</div></div>' +
      '<div class="char-stat-box"><div class="char-stat-value">' + dexModStr + '</div><div class="char-stat-label">INICJATYWA</div></div>' +
      '<div class="char-stat-box"><div class="char-stat-value">' + (player.speed || '30') + '\'</div><div class="char-stat-label">PRĘDKOŚĆ</div></div>' +
      '<div class="char-stat-box"><div class="char-stat-value">+2</div><div class="char-stat-label">BIEGŁOŚĆ</div></div>' +
      '<div class="char-stat-box"><div class="char-stat-value">' + (10 + wisMod) + '</div><div class="char-stat-label">PASYWNA PERCEPCJA</div></div>' +
    '</div>' +
    
    '<div class="char-section">' +
      '<h2 class="char-section-title">ATRYBUTY</h2>' +
      '<div class="char-attributes-grid">' +
        '<div class="char-attr-box"><div class="char-attr-name">SIŁA</div><div class="char-attr-mod">' + strModStr + '</div><div class="char-attr-score">' + (player.str || 10) + '</div></div>' +
        '<div class="char-attr-box"><div class="char-attr-name">ZRĘCZNOŚĆ</div><div class="char-attr-mod">' + dexModStr + '</div><div class="char-attr-score">' + (player.dex || 10) + '</div></div>' +
        '<div class="char-attr-box"><div class="char-attr-name">KONDYCJA</div><div class="char-attr-mod">' + conModStr + '</div><div class="char-attr-score">' + (player.con || 10) + '</div></div>' +
        '<div class="char-attr-box"><div class="char-attr-name">INTELIGENCJA</div><div class="char-attr-mod">' + intModStr + '</div><div class="char-attr-score">' + (player.int || 10) + '</div></div>' +
        '<div class="char-attr-box"><div class="char-attr-name">MĄDROŚĆ</div><div class="char-attr-mod">' + wisModStr + '</div><div class="char-attr-score">' + (player.wis || 10) + '</div></div>' +
        '<div class="char-attr-box"><div class="char-attr-name">CHARYZMA</div><div class="char-attr-mod">' + chaModStr + '</div><div class="char-attr-score">' + (player.cha || 10) + '</div></div>' +
      '</div>' +
    '</div>' +
    
    (conditionsHtml ? 
    '<div class="char-section">' +
      '<h2 class="char-section-title">AKTUALNE STANY</h2>' +
      '<div class="char-conditions-list">' + conditionsHtml + '</div>' +
    '</div>' 
    : '') +
    
    (player.features && player.features.length > 0 ?
    '<div class="char-section">' +
      '<h2 class="char-section-title">CECHY I ZDOLNOŚCI</h2>' +
      '<div class="char-features-list">' + 
        player.features.map(function(f) {
          return '<div class="char-feature-item"><div class="char-feature-name">• ' + f.name + '</div><div class="char-feature-desc">' + f.description + '</div></div>';
        }).join('') +
      '</div>' +
    '</div>'
    : '') +
    
    (player.personality && (player.personality.trait || player.personality.ideal || player.personality.bond || player.personality.flaw) ?
    '<div class="char-section">' +
      '<h2 class="char-section-title">OSOBOWOŚĆ</h2>' +
      '<div class="char-personality-grid">' +
        (player.personality.trait ? '<div class="char-personality-box"><div class="char-personality-label">CECHA CHARAKTERU</div><div class="char-personality-text">' + player.personality.trait + '</div></div>' : '') +
        (player.personality.ideal ? '<div class="char-personality-box"><div class="char-personality-label">IDEAŁ</div><div class="char-personality-text">' + player.personality.ideal + '</div></div>' : '') +
        (player.personality.bond ? '<div class="char-personality-box"><div class="char-personality-label">WIĘŹ</div><div class="char-personality-text">' + player.personality.bond + '</div></div>' : '') +
        (player.personality.flaw ? '<div class="char-personality-box"><div class="char-personality-label">WADA</div><div class="char-personality-text">' + player.personality.flaw + '</div></div>' : '') +
      '</div>' +
    '</div>'
    : '') +
    
    (player.backstory ?
    '<div class="char-section">' +
      '<h2 class="char-section-title">HISTORIA</h2>' +
      '<div class="char-history-text">' + player.backstory + '</div>' +
    '</div>'
    : '') +
    
    (player.equipment ?
    '<div class="char-section">' +
      '<h2 class="char-section-title">EKWIPUNEK</h2>' +
      '<div class="equipment-list">' +
        (player.equipment.weapons ? '<div class="equipment-category"><div class="equipment-category-title">Broń</div><div class="equipment-items">' + player.equipment.weapons + '</div></div>' : '') +
        (player.equipment.armor ? '<div class="equipment-category"><div class="equipment-category-title">Zbroja</div><div class="equipment-items">' + player.equipment.armor + '</div></div>' : '') +
        (player.equipment.items ? '<div class="equipment-category"><div class="equipment-category-title">Przedmioty</div><div class="equipment-items">' + player.equipment.items + '</div></div>' : '') +
        (player.equipment.gold ? '<div class="equipment-category"><div class="equipment-category-title">Złoto</div><div class="equipment-items">' + player.equipment.gold + ' sz</div></div>' : '') +
      '</div>' +
    '</div>'
    : '') +
    
    '<div class="char-actions">' +
      '<button class="char-action-btn primary" onclick="closeCharacterDetail();addPlayerToInitiative(' + index + ');">⚡ Dodaj do potyczki</button>' +
      '<button class="char-action-btn" onclick="closeCharacterDetail();editPlayer(' + index + ');">✏️ Edytuj</button>' +
      '<button class="char-action-btn" onclick="exportPlayer(' + index + ');"> Eksportuj</button>' +
      '<button class="char-action-btn danger" onclick="closeCharacterDetail();removePlayer(' + index + ');">️ Usuń</button>' +
    '</div>';
  
  overlay.style.display = 'block';
  document.body.style.overflow = 'hidden';
  overlay.scrollTop = 0;
}

function closeCharacterDetail() {
  var overlay = document.getElementById('characterDetailOverlay');
  if (overlay) {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function getPlayerColor(role) {
  var colors = { 'Gracz': '#4a6fa5', 'Companion': '#4a7a5f', 'Wróg': '#8a2a22', 'NPC': '#6a5a3a' };
  return colors[role] || '#4a6fa5';
}

function getPlayerColorDark(role) {
  var colors = { 'Gracz': '#2d4a6f', 'Companion': '#2d5a4f', 'Wróg': '#5a1a14', 'NPC': '#4a3a2a' };
  return colors[role] || '#2d4a6f';
}

function editPlayer(index) {
  alert('Funkcja edycji w przygotowaniu. Na razie usuń i dodaj ponownie.');
}

function exportPlayer(index) {
  if (index < 0 || index >= players.length) return;
  var player = players[index];
  var dataStr = JSON.stringify(player, null, 2);
  var blob = new Blob([dataStr], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'postac_' + player.name.replace(/\s+/g, '_') + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function getRoleBadge(role) {
  var map = { 'Gracz': 'gracz', 'Companion': 'companion', 'Wróg': 'wrog', 'NPC': 'npc' };
  return 'p-role-badge ' + (map[role] || 'npc');
}

// ====== KRÓTKI/DŁUGI ODPOCZYNEK ======
function shortRestPlayer(index) {
  var p = players[index];
  if (!p) return;
  var healAmount = Math.ceil(p.maxHp / 4);
  var newHp = Math.min(p.maxHp, p.hp + healAmount);
  if (!confirm('☕ Krótki odpoczynek dla ' + p.name + '?\n\nLeczenie: +' + healAmount + ' HP')) return;
  p.hp = newHp;
  p.exhaustionLevel = Math.max(0, p.exhaustionLevel - 1);
  syncPlayerAfterRest(p);
  renderPlayers();
  if (typeof playSound === 'function') playSound('add');
}

function longRestPlayer(index) {
  var p = players[index];
  if (!p) return;
  if (!confirm('️ Długi odpoczynek dla ' + p.name + '?\n\nPełne HP, reset stanów.')) return;
  p.hp = p.maxHp;
  p.conditions = [];
  p.exhaustionLevel = 0;
  p.deathSaves = { passes: 0, fails: 0 };
  syncPlayerAfterRest(p);
  renderPlayers();
  if (typeof playSound === 'function') playSound('add');
}

function syncPlayerAfterRest(player) {
  if (typeof combatants === 'undefined') return;
  var combatant = combatants.find(function(c) {
    return c.name === player.name && c.role === player.role;
  });
  if (combatant) {
    combatant.hp = player.hp;
    combatant.conditions = player.conditions.slice();
    combatant.exhaustionLevel = player.exhaustionLevel;
    if (player.hp > 0) combatant.status = 'active';
    if (typeof renderInit === 'function') renderInit();
  }
}

function removePlayer(index) {
  if (!players[index]) return;
  if (confirm('Usunąć ' + players[index].name + '?')) {
    if (typeof combatants !== 'undefined') {
      var idx = combatants.findIndex(function(c) {
        return c.name === players[index].name && c.role === players[index].role;
      });
      if (idx > -1) combatants.splice(idx, 1);
    }
    players.splice(index, 1);
    renderPlayers();
  }
}

function deathSave(index) {
  var p = players[index];
  if (!p) return;
  var roll = Math.floor(Math.random() * 20) + 1;
  if (roll === 1) { p.deathSaves.fails += 2; if (typeof playSound === 'function') playSound('death'); }
  else if (roll === 20) { p.hp = 1; p.deathSaves = { passes: 0, fails: 0 }; if (typeof playSound === 'function') playSound('crit'); }
  else if (roll >= 10) p.deathSaves.passes++;
  else p.deathSaves.fails++;
  if (p.deathSaves.fails >= 3) {
    if (typeof playSound === 'function') playSound('death');
    if (confirm('💀 ' + p.name + ' umiera! Usunąć?')) { removePlayer(index); return; }
  }
  if (p.deathSaves.passes >= 3) {
    p.hp = 1;
    p.deathSaves = { passes: 0, fails: 0 };
    if (typeof playSound === 'function') playSound('add');
  }
  renderPlayers();
  syncToCombat();
}

function addPlayerToInitiative(index) {
  var p = players[index];
  if (!p) return;
  if (typeof combatants !== 'undefined') {
    var exists = combatants.some(function(c) { return c.name === p.name && c.role === p.role; });
    if (exists) { alert('Ta postać jest już w potyczce!'); return; }
  }
  var initVal = prompt('Inicjatywa dla ' + p.name + ':', '0');
  if (initVal === null) return;
  if (typeof addCombatant === 'function') {
    addCombatant({
      name: p.name, init: parseInt(initVal) || 0, hp: p.hp, maxHp: p.maxHp,
      ac: p.ac, role: p.role,
      conditions: p.conditions ? p.conditions.slice() : [],
      exhaustionLevel: p.exhaustionLevel || 0,
      avatar: p.avatar
    });
    if (typeof playSound === 'function') playSound('add');
  }
}

function showPlayerCondPopup(index) {
  conditionPopupTarget = { type: 'player', index: index };
  var p = players[index];
  if (!p) return;
  if (typeof showCondPopup === 'function') {
    showCondPopup(p.name, p.conditions || [], p.exhaustionLevel || 0, function(cond, exhaustionLevel) {
      if (cond) {
        var idx = p.conditions.indexOf(cond);
        if (idx > -1) p.conditions.splice(idx, 1);
        else p.conditions.push(cond);
      }
      if (exhaustionLevel !== undefined) p.exhaustionLevel = Math.max(0, Math.min(6, exhaustionLevel));
      renderPlayers();
      syncToCombat();
    });
  }
}

// ====== ESC zamyka modal ======
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeCharacterDetail();
});

// ====== EKSPORT ======
window.openAddPlayerModal = openAddPlayerModal;
window.closeAddPlayerModal = closeAddPlayerModal;
window.confirmAddPlayer = confirmAddPlayer;
window.renderPlayers = renderPlayers;
window.openPlayerDetail = openPlayerDetail;
window.closeCharacterDetail = closeCharacterDetail;
window.editPlayer = editPlayer;
window.exportPlayer = exportPlayer;
window.removePlayer = removePlayer;
window.deathSave = deathSave;
window.addPlayerToInitiative = addPlayerToInitiative;
window.showPlayerCondPopup = showPlayerCondPopup;
window.shortRestPlayer = shortRestPlayer;
window.longRestPlayer = longRestPlayer;
window.syncToCombat = syncToCombat;
window.players = players;