// ============================================================
//  PLAYERS - ROZBUDOWANY SYSTEM POSTACI
// ============================================================
var players = [];
var selectedAvatar = '🧙';
var selectedAvatarUrl = '';
var currentDetailPlayer = null;

// ====== RENDER GRID POSTACI ======
function renderPlayers() {
  var container = document.getElementById('playerTracker');
  if (!container) return;
  
  if (players.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:60px 20px;color:var(--parchment-dim);">
        <div style="font-size:3rem;margin-bottom:16px;">👥</div>
        <div style="font-family:'Cinzel',serif;font-size:var(--font-lg);margin-bottom:8px;">Brak postaci</div>
        <div style="font-size:var(--font-sm);">Kliknij "➕ Dodaj postać" aby dodać pierwszą postać</div>
      </div>
    `;
    return;
  }
  
  container.innerHTML = '';
  container.className = 'player-grid';
  
  players.forEach(function(player, index) {
    var card = createPlayerCard(player, index);
    container.appendChild(card);
  });
}

function createPlayerCard(player, index) {
  var div = document.createElement('div');
  div.className = 'player-card';
  div.onclick = function(e) {
    if (!e.target.closest('.player-card-btn')) {
      openPlayerDetail(index);
    }
  };
  
  var hpPercent = player.maxHp > 0 ? (player.hp / player.maxHp * 100) : 0;
  var roleClass = getRoleClass(player.role);
  var avatar = player.avatar || '🧙';
  
  div.innerHTML = `
    <div class="player-card-header ${roleClass}">
      <div class="player-card-icon">${getRoleIcon(player.role)}</div>
      <div class="player-card-name">${player.name}</div>
      <div class="player-card-subtitle">${player.race || ''} · ${player.class || player.role}</div>
    </div>
    <div class="player-card-stats">
      <div class="player-card-stat">
        <span class="player-card-stat-label">KP</span>
        <span class="player-card-stat-value">${player.ac || '—'}</span>
      </div>
      <div class="player-card-stat" style="flex:1;">
        <span class="player-card-stat-label">PW</span>
        <span class="player-card-stat-value">${player.hp || 0}/${player.maxHp || player.hp || 0}</span>
        <div class="player-card-hp-bar">
          <div class="player-card-hp-fill" style="width:${hpPercent}%"></div>
        </div>
      </div>
      <div class="player-card-stat">
        <span class="player-card-stat-label">SZ</span>
        <span class="player-card-stat-value">${player.speed || '30'}</span>
      </div>
    </div>
    <div class="player-card-footer">
      <button class="player-card-btn" onclick="event.stopPropagation();openPlayerDetail(${index})">📋 Szczegóły</button>
      <button class="player-card-btn danger" onclick="event.stopPropagation();removePlayer(${index})">✕ Usuń</button>
    </div>
  `;
  
  return div;
}

function getRoleClass(role) {
  var map = {
    'Gracz': 'gracz',
    'Companion': 'companion',
    'Wróg': 'wrog',
    'NPC': 'npc'
  };
  return map[role] || 'npc';
}

function getRoleIcon(role) {
  var icons = {
    'Gracz': '⚔️',
    'Companion': '🐾',
    'Wróg': '💀',
    'NPC': '📜'
  };
  return icons[role] || '👤';
}

// ====== SZCZEGÓŁOWY WIDOK POSTACI ======
function openPlayerDetail(index) {
  var player = players[index];
  if (!player) return;
  
  currentDetailPlayer = index;
  
  var overlay = document.createElement('div');
  overlay.className = 'player-detail-overlay active';
  overlay.id = 'playerDetailOverlay';
  overlay.onclick = function(e) {
    if (e.target === overlay) closePlayerDetail();
  };
  
  var hpPercent = player.maxHp > 0 ? Math.round((player.hp / player.maxHp) * 100) : 0;
  
  overlay.innerHTML = `
    <div class="player-detail-container">
      <div class="player-detail-header">
        <button class="player-detail-close" onclick="closePlayerDetail()">✕</button>
        
        <div class="player-detail-title-section">
          <div class="player-detail-avatar">${player.avatar || '🧙'}</div>
          <div class="player-detail-title-group">
            <div class="player-detail-name">${player.name}</div>
            <div class="player-detail-subtitle">${player.race || 'Człowiek'} · ${player.class || player.role || 'Postać'}</div>
            <div class="player-detail-alignment">${player.alignment || 'Neutralny'}</div>
          </div>
        </div>
        
        <div class="player-detail-main-stats">
          <div class="player-detail-stat-box player-detail-hp-box">
            <div class="player-detail-stat-value player-detail-hp-value">${player.hp || 0}/${player.maxHp || player.hp || 0}</div>
            <div class="player-detail-stat-label">Punkty Wytrzymałości</div>
          </div>
          <div class="player-detail-stat-box">
            <div class="player-detail-stat-value">${player.ac || '10'}</div>
            <div class="player-detail-stat-label">Klasa Pancerza</div>
          </div>
          <div class="player-detail-stat-box">
            <div class="player-detail-stat-value">${player.initiative || '+0'}</div>
            <div class="player-detail-stat-label">Inicjatywa</div>
          </div>
          <div class="player-detail-stat-box">
            <div class="player-detail-stat-value">${player.speed || '30'}'</div>
            <div class="player-detail-stat-label">Prędkość</div>
          </div>
          <div class="player-detail-stat-box">
            <div class="player-detail-stat-value">${player.proficiency || '+2'}</div>
            <div class="player-detail-stat-label">Biegłość</div>
          </div>
          <div class="player-detail-stat-box">
            <div class="player-detail-stat-value">${player.passivePerception || '10'}</div>
            <div class="player-detail-stat-label">Pasywna Percepcja</div>
          </div>
        </div>
      </div>
      
      <div class="player-detail-section">
        <div class="player-detail-section-title">ATRYBUTY</div>
        <div class="attributes-grid">
          ${renderAttribute('Siła', player.str, player.strMod)}
          ${renderAttribute('Zręczność', player.dex, player.dexMod)}
          ${renderAttribute('Kondycja', player.con, player.conMod)}
          ${renderAttribute('Inteligencja', player.int, player.intMod)}
          ${renderAttribute('Mądrość', player.wis, player.wisMod)}
          ${renderAttribute('Charyzma', player.cha, player.chaMod)}
        </div>
      </div>
      
      <div class="player-detail-section">
        <div class="player-detail-section-title">RATUNKI I UMIEJĘTNOŚCI</div>
        <div class="skills-grid">
          ${renderSkill('Siła', player.strMod, player.saveStr)}
          ${renderSkill('Zręczność', player.dexMod, player.saveDex)}
          ${renderSkill('Kondycja', player.conMod, player.saveCon)}
          ${renderSkill('Inteligencja', player.intMod, player.saveInt)}
          ${renderSkill('Mądrość', player.wisMod, player.saveWis)}
          ${renderSkill('Charyzma', player.chaMod, player.saveCha)}
          ${renderSkill('Akrobatyka', player.dexMod, player.skillAcrobatics, true)}
          ${renderSkill('Atletyka', player.strMod, player.skillAthletics, true)}
          ${renderSkill('Historia', player.intMod, player.skillHistory, true)}
          ${renderSkill('Medycyna', player.wisMod, player.skillMedicine, true)}
          ${renderSkill('Percepcja', player.wisMod, player.skillPerception, true)}
          ${renderSkill('Perswazja', player.chaMod, player.skillPersuasion, true)}
        </div>
      </div>
      
      ${player.spells ? `
      <div class="player-detail-section">
        <div class="player-detail-section-title">ZAKLĘCIA</div>
        <div class="spell-slots">
          <div class="spell-slot-box">
            <div class="spell-slot-level">Poziom 1</div>
            <div class="spell-slot-count">${player.spellSlots1 || '4/4'}</div>
          </div>
          <div class="spell-slot-box">
            <div class="spell-slot-level">Poziom 2</div>
            <div class="spell-slot-count">${player.spellSlots2 || '3/3'}</div>
          </div>
          <div class="spell-slot-box">
            <div class="spell-slot-level">Poziom 3</div>
            <div class="spell-slot-count">${player.spellSlots3 || '2/2'}</div>
          </div>
        </div>
      </div>
      ` : ''}
      
      ${player.features && player.features.length > 0 ? `
      <div class="player-detail-section">
        <div class="player-detail-section-title">CECHY I ZDOLNOŚCI</div>
        ${player.features.map(function(f) {
          return `
            <div class="feature-item">
              <div class="feature-name">${f.name}</div>
              <div class="feature-desc">${f.description}</div>
            </div>
          `;
        }).join('')}
      </div>
      ` : ''}
      
      ${player.personality ? `
      <div class="player-detail-section">
        <div class="player-detail-section-title">OSOBOWOŚĆ</div>
        <div class="personality-grid">
          ${player.personality.trait ? `
          <div class="personality-box">
            <div class="personality-label">Cecha charakteru</div>
            <div class="personality-text">${player.personality.trait}</div>
          </div>
          ` : ''}
          ${player.personality.ideal ? `
          <div class="personality-box">
            <div class="personality-label">Ideał</div>
            <div class="personality-text">${player.personality.ideal}</div>
          </div>
          ` : ''}
          ${player.personality.bond ? `
          <div class="personality-box">
            <div class="personality-label">Więź</div>
            <div class="personality-text">${player.personality.bond}</div>
          </div>
          ` : ''}
          ${player.personality.flaw ? `
          <div class="personality-box">
            <div class="personality-label">Wada</div>
            <div class="personality-text">${player.personality.flaw}</div>
          </div>
          ` : ''}
        </div>
      </div>
      ` : ''}
      
      ${player.backstory ? `
      <div class="player-detail-section">
        <div class="player-detail-section-title">HISTORIA</div>
        <div class="history-text">${player.backstory}</div>
      </div>
      ` : ''}
      
      ${player.equipment ? `
      <div class="player-detail-section">
        <div class="player-detail-section-title">EKWIPUNEK</div>
        <div class="equipment-list">
          ${player.equipment.weapons ? `
          <div class="equipment-category">
            <div class="equipment-category-title">Broń</div>
            <div class="equipment-items">${player.equipment.weapons}</div>
          </div>
          ` : ''}
          ${player.equipment.armor ? `
          <div class="equipment-category">
            <div class="equipment-category-title">Zbroja</div>
            <div class="equipment-items">${player.equipment.armor}</div>
          </div>
          ` : ''}
          ${player.equipment.items ? `
          <div class="equipment-category">
            <div class="equipment-category-title">Przedmioty</div>
            <div class="equipment-items">${player.equipment.items}</div>
          </div>
          ` : ''}
        </div>
      </div>
      ` : ''}
      
      <div class="player-detail-actions">
        <button class="btn" onclick="addPlayerToInitiative(${index})">⚡ Dodaj do potyczki</button>
        <button class="btn outline" onclick="editPlayer(${index})">✏️ Edytuj</button>
        <button class="btn danger" onclick="removePlayer(${index}); closePlayerDetail();">🗑️ Usuń postać</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
}

function renderAttribute(name, score, mod) {
  var modStr = mod >= 0 ? '+' + mod : '' + mod;
  return `
    <div class="attribute-box">
      <div class="attribute-name">${name}</div>
      <div class="attribute-modifier">${modStr}</div>
      <div class="attribute-score">${score || 10}</div>
    </div>
  `;
}

function renderSkill(name, mod, proficient, isSkill) {
  var modStr = mod >= 0 ? '+' + mod : '' + mod;
  var isProf = proficient ? 'proficient' : '';
  var totalMod = proficient ? (mod + 2) : mod;
  var totalStr = totalMod >= 0 ? '+' + totalMod : '' + totalMod;
  
  return `
    <div class="skill-item ${isProf}">
      <span class="skill-name">${name} ${isSkill ? '(ZRC)' : ''}</span>
      <span class="skill-modifier">${totalStr}</span>
    </div>
  `;
}

function closePlayerDetail() {
  var overlay = document.getElementById('playerDetailOverlay');
  if (overlay) {
    overlay.remove();
    document.body.style.overflow = '';
  }
  currentDetailPlayer = null;
}

// ====== DODAWANIE POSTACI ======
function openAddPlayerModal() {
  selectedAvatar = '🧙';
  var popup = document.getElementById('addPlayerPopup');
  if (popup) {
    popup.style.display = 'flex';
    setTimeout(function() {
      var input = document.getElementById('pName');
      if (input) input.focus();
    }, 100);
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
  
  if (!name) { 
    alert('Podaj imię postaci'); 
    return; 
  }
  
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
  playSound('add');
}

// ====== EDYCJA POSTACI ======
function editPlayer(index) {
  var player = players[index];
  if (!player) return;
  
  // Tutaj można dodać formularz edycji
  alert('Funkcja edycji w przygotowaniu - otwórz szczegółowy widok i kliknij w pola aby edytować');
}

// ====== USUWANIE POSTACI ======
function removePlayer(index) {
  if (!players[index]) return;
  if (confirm('Usunąć postać ' + players[index].name + '?')) {
    players.splice(index, 1);
    renderPlayers();
    saveState();
  }
}

// ====== DODAWANIE DO POTYCZKI ======
function addPlayerToInitiative(index) {
  var player = players[index];
  if (!player) return;
  
  if (typeof combatants !== 'undefined') {
    var exists = combatants.some(function(c) {
      return c.name === player.name;
    });
    
    if (exists) {
      alert('Ta postać jest już w potyczce!');
      return;
    }
  }
  
  var initVal = prompt('Inicjatywa dla ' + player.name + ':', player.initiative || '0');
  if (initVal === null) return;
  
  if (typeof addCombatant === 'function') {
    addCombatant({
      name: player.name,
      init: parseInt(initVal) || 0,
      hp: player.hp,
      maxHp: player.maxHp,
      ac: player.ac,
      role: player.role || 'Gracz',
      avatar: player.avatar || '🧙'
    });
    
    closePlayerDetail();
    
    var combatTab = document.querySelector('.nav-btn[data-tab="combat"]');
    if (combatTab) combatTab.click();
  } else {
    alert('Moduł potyczki nie jest dostępny!');
  }
}

// ====== INICJALIZACJA AVATARÓW ======
function initAvatarPicker() {
  var grid = document.getElementById('avatarGrid');
  if (!grid) return;
  
  var avatars = ['🧙', '🧝', '🧛', '', '🧞', '🧜', '🦹', '', '🥷', '🧚', '👑', '', '🐺', '🦅', '', '🦁'];
  
  grid.innerHTML = '';
  avatars.forEach(function(avatar) {
    var btn = document.createElement('button');
    btn.className = 'avatar-btn' + (avatar === selectedAvatar ? ' active' : '');
    btn.dataset.avatar = avatar;
    btn.textContent = avatar;
    btn.onclick = function() {
      grid.querySelectorAll('.avatar-btn').forEach(function(b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');
      selectedAvatar = avatar;
    };
    grid.appendChild(btn);
  });
}

// ====== EKSPORT ======
window.renderPlayers = renderPlayers;
window.openPlayerDetail = openPlayerDetail;
window.closePlayerDetail = closePlayerDetail;
window.openAddPlayerModal = openAddPlayerModal;
window.closeAddPlayerModal = closeAddPlayerModal;
window.confirmAddPlayer = confirmAddPlayer;
window.editPlayer = editPlayer;
window.removePlayer = removePlayer;
window.addPlayerToInitiative = addPlayerToInitiative;
window.initAvatarPicker = initAvatarPicker;
window.players = players;