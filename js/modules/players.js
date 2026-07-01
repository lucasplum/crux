// ============================================================
//  PLAYERS - PEŁNY SYSTEM POSTACI Z EDYCJĄ
// ============================================================
var players = [];
var selectedAvatar = '🧙';
var selectedAvatarUrl = '';
var conditionPopupTarget = null;
var dmgPopupTarget = null;
var editingPlayerIndex = null;

// ====== TWORZENIE NOWEJ POSTACI ======
function openAddPlayerModal() {
  editingPlayerIndex = null;
  selectedAvatar = '🧙';
  selectedAvatarUrl = '';
  
  var popup = document.getElementById('addPlayerPopup');
  if (popup) {
    popup.style.display = 'flex';
    resetPlayerForm();
    setTimeout(function() {
      var input = document.getElementById('pName');
      if (input) input.focus();
    }, 100);
  }
}

function resetPlayerForm() {
  // Reset wszystkich pól formularza
  var fields = [
    'pName', 'pRace', 'pClass', 'pLevel', 'pBackground',
    'pAlignment', 'pStr', 'pDex', 'pCon', 'pInt', 'pWis', 'pCha',
    'pHP', 'pMaxHP', 'pAC', 'pSpeed', 'pInitiative', 'pProficiency',
    'pPassivePerception', 'pInspiration', 'pHP', 'pTempHP'
  ];
  
  fields.forEach(function(field) {
    var el = document.getElementById(field);
    if (el) {
      if (el.type === 'number') el.value = el.defaultValue || (field === 'pLevel' ? '1' : '10');
      else if (el.tagName === 'SELECT') el.selectedIndex = 0;
      else el.value = '';
    }
  });
  
  // Reset checkboxów biegłości
  document.querySelectorAll('.proficiency-checkbox').forEach(function(cb) {
    cb.checked = false;
  });
  
  // Reset avatara
  selectedAvatar = '🧙';
  selectedAvatarUrl = '';
  updateAvatarPreview();
  document.querySelectorAll('#avatarGrid .avatar-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.avatar === '🧙');
  });
  
  // Reset sekcji
  document.getElementById('playerFormSection') ? document.getElementById('playerFormSection').scrollTop = 0 : null;
}

function closeAddPlayerModal() {
  var popup = document.getElementById('addPlayerPopup');
  if (popup) popup.style.display = 'none';
  editingPlayerIndex = null;
}

function confirmAddPlayer() {
  // Pobierz dane z formularza
  var playerData = collectPlayerFormData();
  
  if (!playerData.name) {
    alert('Podaj imię postaci');
    return;
  }
  
  if (editingPlayerIndex !== null) {
    // Edycja istniejącej postaci
    players[editingPlayerIndex] = playerData;
  } else {
    // Nowa postać
    players.push(playerData);
  }
  
  closeAddPlayerModal();
  renderPlayers();
  saveState();
  playSound('add');
}

function collectPlayerFormData() {
  // Pobranie wartości z formularza
  var getVal = function(id) {
    var el = document.getElementById(id);
    return el ? (el.type === 'number' ? parseFloat(el.value) || 0 : el.value) : '';
  };
  
  // Oblicz modyfikatory
  var str = parseInt(getVal('pStr')) || 10;
  var dex = parseInt(getVal('pDex')) || 10;
  var con = parseInt(getVal('pCon')) || 10;
  var int = parseInt(getVal('pInt')) || 10;
  var wis = parseInt(getVal('pWis')) || 10;
  var cha = parseInt(getVal('pCha')) || 10;
  
  var strMod = Math.floor((str - 10) / 2);
  var dexMod = Math.floor((dex - 10) / 2);
  var conMod = Math.floor((con - 10) / 2);
  var intMod = Math.floor((int - 10) / 2);
  var wisMod = Math.floor((wis - 10) / 2);
  var chaMod = Math.floor((cha - 10) / 2);
  
  // Pobranie biegłości
  var savingThrows = [];
  var skills = [];
  document.querySelectorAll('.saving-throw-checkbox:checked').forEach(function(cb) {
    savingThrows.push(cb.dataset.stat);
  });
  document.querySelectorAll('.skill-checkbox:checked').forEach(function(cb) {
    skills.push(cb.dataset.skill);
  });
  
  return {
    // Podstawowe
    name: getVal('pName'),
    race: getVal('pRace'),
    class: getVal('pClass'),
    level: parseInt(getVal('pLevel')) || 1,
    background: getVal('pBackground'),
    alignment: getVal('pAlignment'),
    
    // Atrybuty
    str: str, strMod: strMod,
    dex: dex, dexMod: dexMod,
    con: con, conMod: conMod,
    int: int, intMod: intMod,
    wis: wis, wisMod: wisMod,
    cha: cha, chaMod: chaMod,
    
    // Statystyki bojowe
    hp: parseInt(getVal('pHP')) || parseInt(getVal('pMaxHP')) || 10,
    maxHp: parseInt(getVal('pMaxHP')) || parseInt(getVal('pHP')) || 10,
    tempHp: parseInt(getVal('pTempHP')) || 0,
    ac: parseInt(getVal('pAC')) || 10,
    speed: getVal('pSpeed') || '30',
    initiative: dexMod,
    proficiency: calculateProficiencyBonus(parseInt(getVal('pLevel')) || 1),
    passivePerception: 10 + wisMod + (skills.includes('percepcja') ? calculateProficiencyBonus(parseInt(getVal('pLevel')) || 1) : 0),
    inspiration: 0,
    
    // Biegłości
    savingThrows: savingThrows,
    skills: skills,
    
    // Wygląd
    avatar: selectedAvatarUrl || selectedAvatar,
    role: document.getElementById('pRole') ? document.getElementById('pRole').value : 'Gracz',
    
    // Dodatkowe
    conditions: [],
    exhaustionLevel: 0,
    deathSaves: { passes: 0, fails: 0 },
    
    // Cechy i zdolności
    features: collectFeaturesData(),
    
    // Ekwipunek
    equipment: collectEquipmentData(),
    
    // Osobowość
    personality: collectPersonalityData(),
    
    // Historia
    backstory: getVal('pBackstory') || '',
    
    // Zaklęcia (dla czarujących)
    spells: collectSpellsData(),
    spellSlots: collectSpellSlotsData()
  };
}

function calculateProficiencyBonus(level) {
  if (level >= 17) return 6;
  if (level >= 13) return 5;
  if (level >= 9) return 4;
  if (level >= 5) return 3;
  return 2;
}

function collectFeaturesData() {
  var features = [];
  document.querySelectorAll('.feature-item').forEach(function(item) {
    features.push({
      name: item.querySelector('.feature-name-input').value,
      description: item.querySelector('.feature-desc-input').value
    });
  });
  return features;
}

function collectEquipmentData() {
  return {
    weapons: document.getElementById('pWeapons') ? document.getElementById('pWeapons').value : '',
    armor: document.getElementById('pArmor') ? document.getElementById('pArmor').value : '',
    items: document.getElementById('pItems') ? document.getElementById('pItems').value : '',
    gold: document.getElementById('pGold') ? parseFloat(document.getElementById('pGold').value) || 0 : 0
  };
}

function collectPersonalityData() {
  return {
    trait: document.getElementById('pPersonalityTrait') ? document.getElementById('pPersonalityTrait').value : '',
    ideal: document.getElementById('pPersonalityIdeal') ? document.getElementById('pPersonalityIdeal').value : '',
    bond: document.getElementById('pPersonalityBond') ? document.getElementById('pPersonalityBond').value : '',
    flaw: document.getElementById('pPersonalityFlaw') ? document.getElementById('pPersonalityFlaw').value : ''
  };
}

function collectSpellsData() {
  var spells = [];
  document.querySelectorAll('.spell-item').forEach(function(item) {
    spells.push(item.querySelector('.spell-name-input').value);
  });
  return spells;
}

function collectSpellSlotsData() {
  return {
    level1: { max: 0, current: 0 },
    level2: { max: 0, current: 0 },
    level3: { max: 0, current: 0 },
    level4: { max: 0, current: 0 },
    level5: { max: 0, current: 0 }
  };
}

// ====== EDYCJA POSTACI ======
function editPlayer(index) {
  if (index < 0 || index >= players.length) return;
  
  editingPlayerIndex = index;
  var player = players[index];
  
  var popup = document.getElementById('addPlayerPopup');
  if (popup) {
    popup.style.display = 'flex';
    fillPlayerForm(player);
  }
}

function fillPlayerForm(player) {
  // Wypełnij pola podstawowe
  var setVal = function(id, val) {
    var el = document.getElementById(id);
    if (el) el.value = val !== undefined ? val : '';
  };
  
  setVal('pName', player.name);
  setVal('pRace', player.race);
  setVal('pClass', player.class);
  setVal('pLevel', player.level);
  setVal('pBackground', player.background);
  setVal('pAlignment', player.alignment);
  
  // Atrybuty
  setVal('pStr', player.str);
  setVal('pDex', player.dex);
  setVal('pCon', player.con);
  setVal('pInt', player.int);
  setVal('pWis', player.wis);
  setVal('pCha', player.cha);
  
  // Statystyki
  setVal('pHP', player.hp);
  setVal('pMaxHP', player.maxHp);
  setVal('pTempHP', player.tempHp || 0);
  setVal('pAC', player.ac);
  setVal('pSpeed', player.speed);
  setVal('pPassivePerception', player.passivePerception);
  setVal('pInspiration', player.inspiration || 0);
  
  // Avatar
  if (player.avatar) {
    if (player.avatar.startsWith('http')) {
      selectedAvatarUrl = player.avatar;
      selectedAvatar = '';
      document.getElementById('avatarUrl').value = player.avatar;
    } else {
      selectedAvatar = player.avatar;
      selectedAvatarUrl = '';
    }
  }
  updateAvatarPreview();
  
  // Biegłości
  if (player.savingThrows) {
    player.savingThrows.forEach(function(stat) {
      var cb = document.querySelector('.saving-throw-checkbox[data-stat="' + stat + '"]');
      if (cb) cb.checked = true;
    });
  }
  
  if (player.skills) {
    player.skills.forEach(function(skill) {
      var cb = document.querySelector('.skill-checkbox[data-skill="' + skill + '"]');
      if (cb) cb.checked = true;
    });
  }
  
  // Ekwipunek
  if (player.equipment) {
    setVal('pWeapons', player.equipment.weapons);
    setVal('pArmor', player.equipment.armor);
    setVal('pItems', player.equipment.items);
    setVal('pGold', player.equipment.gold);
  }
  
  // Osobowość
  if (player.personality) {
    setVal('pPersonalityTrait', player.personality.trait);
    setVal('pPersonalityIdeal', player.personality.ideal);
    setVal('pPersonalityBond', player.personality.bond);
    setVal('pPersonalityFlaw', player.personality.flaw);
  }
  
  // Historia
  setVal('pBackstory', player.backstory);
  
  // Role
  if (player.role && document.getElementById('pRole')) {
    document.getElementById('pRole').value = player.role;
  }
}

// ====== EKSPORT/IMPORT POSTACI ======
function exportPlayer(index) {
  if (index < 0 || index >= players.length) return;
  
  var player = players[index];
  var dataStr = JSON.stringify(player, null, 2);
  var dataBlob = new Blob([dataStr], { type: 'application/json' });
  var url = URL.createObjectURL(dataBlob);
  var link = document.createElement('a');
  link.href = url;
  link.download = 'postac_' + player.name.replace(/\s+/g, '_') + '.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

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
        
        // Walidacja podstawowych pól
        if (!playerData.name) {
          alert('❌ Niepoprawny plik - brak nazwy postaci');
          return;
        }
        
        if (confirm('✅ Zaimportować postać "' + playerData.name + '"?')) {
          players.push(playerData);
          renderPlayers();
          saveState();
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

// ====== RENDEROWANIE POSTACI ======
function renderPlayers() {
  var container = document.getElementById('playerTracker');
  if (!container) return;
  
  if (players.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:60px 20px;color:var(--parchment-dim);">
        <div style="font-size:3rem;margin-bottom:16px;">👥</div>
        <div style="font-family:'Cinzel',serif;font-size:var(--font-lg);margin-bottom:8px;">Brak postaci</div>
        <div style="font-size:var(--font-sm);margin-bottom:20px;">Kliknij "➕ Dodaj postać" aby dodać pierwszą postać</div>
        <button class="btn" onclick="openAddPlayerModal()" style="min-height:48px;">➕ Dodaj postać</button>
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
  div.dataset.role = player.role || 'Gracz';
  
  var hpPercent = player.maxHp > 0 ? Math.round((player.hp / player.maxHp) * 100) : 0;
  var hpColor = hpPercent < 25 ? '#ff6b6b' : hpPercent < 50 ? '#d4a843' : '#6bff9e';
  
  var condTags = (player.conditions || []).map(function(c) {
    return '<span class="tag">' + getStateEmoji(c) + ' ' + c + '</span>';
  }).join('');
  
  var exhaustionTag = '';
  if (player.exhaustionLevel > 0) {
    var exLevel = Math.min(player.exhaustionLevel, 6);
    exhaustionTag = '<span class="tag" style="background:rgba(255,107,107,0.15);border-color:rgba(255,107,107,0.2);color:#ff6b6b;">🥱 Wyczerpanie ' + exLevel + '/6</span>';
  }
  
  var ds = player.deathSaves || { passes: 0, fails: 0 };
  var avatarHtml = player.avatar && player.avatar.startsWith('http')
    ? '<img src="' + player.avatar + '" onerror="this.parentNode.innerHTML=\'' + (player.avatar.length <= 2 ? player.avatar : '🧙') + '\'">'
    : (player.avatar || '🧙');
  
  var firstState = (player.conditions || [])[0];
  var stateOverlay = firstState
    ? '<div class="avatar-state-overlay" style="color:' + getStateColor(firstState) + '">' + getStateEmoji(firstState) + '</div>'
    : '';
  
  var stateBtnClass = (player.conditions && player.conditions.length > 0) || player.exhaustionLevel > 0 ? 'p-state-btn has-conds' : 'p-state-btn';
  var stateBtnText = ((player.conditions && player.conditions.length > 0) || player.exhaustionLevel > 0)
    ? '⚙️ Stany (' + ((player.conditions ? player.conditions.length : 0) + (player.exhaustionLevel > 0 ? 1 : 0)) + ')'
    : '⚙️ Stany';
  
  var isDead = player.hp <= 0;
  var deathSaveText = isDead ? '💀 Death Saves: ✅' + ds.passes + ' ❌' + ds.fails : '';
  var roleBadge = getRoleBadge(player.role || 'Gracz');
  var deadIcon = isDead ? ' 💀' : '';
  var deathDiv = isDead ? '<div style="font-size:.55rem;color:var(--parchment-dim);margin:2px 0;">' + deathSaveText + '</div>' : '';
  var deathBtn = isDead ? '<button class="success" onclick="event.stopPropagation();deathSave(' + index + ')">💀 Death Save</button>' : '';
  
  div.innerHTML = `
    <div class="p-header">
      <div class="p-avatar">${avatarHtml}${stateOverlay}</div>
      <div class="p-main">
        <div class="p-name">${player.name} <span class="${roleBadge}">${player.role || 'Gracz'}</span>${deadIcon}</div>
        <div class="p-stats-row">
          <div class="p-ac-badge"><span class="ac-icon">🛡️</span><span class="ac-val">${player.ac}</span></div>
          <div class="p-maxhp-badge"><span class="hp-icon">❤️</span><span class="hp-val">${player.maxHp}</span></div>
        </div>
      </div>
    </div>
    
    <div class="p-hp-wrap">
      <div class="p-hp-bar">
        <div class="p-hp-fill" style="width:${hpPercent}%;background:${hpColor};"></div>
      </div>
      <div class="p-hp-text" style="color:${hpColor}">${player.hp}</div>
    </div>
    
    ${deathDiv}
    
    <div class="p-cond">${condTags}${exhaustionTag}</div>
    
    <button class="${stateBtnClass}" onclick="event.stopPropagation();showPlayerCondPopup(${index})">${stateBtnText}</button>
    
    <div class="p-controls">
      <button class="primary" onclick="event.stopPropagation();openPlayerDetail(${index})">📋 Szczegóły</button>
      <button onclick="event.stopPropagation();editPlayer(${index})">✏️ Edytuj</button>
      <button onclick="event.stopPropagation();exportPlayer(${index})">📤 Eksport</button>
      <button class="success" onclick="event.stopPropagation();addPlayerToInitiative(${index})">⚡ Do walki</button>
      ${deathBtn}
      <button class="danger" onclick="event.stopPropagation();removePlayer(${index})">✕ Usuń</button>
    </div>
  `;
  
  div.onclick = function(e) {
    if (!e.target.closest('button')) {
      openPlayerDetail(index);
    }
  };
  
  return div;
}

// ====== SZCZEGÓŁOWY WIDOK POSTACI (ROZBUDOWANY) ======
function openPlayerDetail(index) {
  if (index < 0 || index >= players.length) return;
  
  var player = players[index];
  var overlay = document.createElement('div');
  overlay.className = 'player-detail-overlay active';
  overlay.id = 'playerDetailOverlay';
  overlay.onclick = function(e) {
    if (e.target === overlay) closePlayerDetail();
  };
  
  var hpPercent = player.maxHp > 0 ? Math.round((player.hp / player.maxHp) * 100) : 0;
  var hpColor = hpPercent < 25 ? '#ff6b6b' : hpPercent < 50 ? '#d4a843' : '#6bff9e';
  
  overlay.innerHTML = `
    <div class="player-detail-container">
      <div class="player-detail-header">
        <button class="player-detail-close" onclick="closePlayerDetail()">✕</button>
        
        <div class="player-detail-title-section">
          <div class="player-detail-avatar">${player.avatar || '🧙'}</div>
          <div class="player-detail-title-group">
            <div class="player-detail-name">${player.name}</div>
            <div class="player-detail-subtitle">${player.race || 'Człowiek'} · ${player.class || player.role || 'Postać'} · Poziom ${player.level || 1}</div>
            <div class="player-detail-alignment">${player.alignment || 'Neutralny'}</div>
          </div>
        </div>
        
        <div class="player-detail-main-stats">
          <div class="player-detail-stat-box player-detail-hp-box">
            <div class="player-detail-stat-value player-detail-hp-value">${player.hp}/${player.maxHp}</div>
            <div class="player-detail-stat-label">Punkty Wytrzymałości</div>
            <div style="width:100%;height:4px;background:rgba(255,255,255,0.1);border-radius:2px;margin-top:6px;overflow:hidden;">
              <div style="width:${hpPercent}%;height:100%;background:${hpColor};border-radius:2px;"></div>
            </div>
          </div>
          <div class="player-detail-stat-box">
            <div class="player-detail-stat-value">${player.ac || '10'}</div>
            <div class="player-detail-stat-label">Klasa Pancerza</div>
          </div>
          <div class="player-detail-stat-box">
            <div class="player-detail-stat-value">${player.initiative !== undefined ? (player.initiative >= 0 ? '+' : '') + player.initiative : '+0'}</div>
            <div class="player-detail-stat-label">Inicjatywa</div>
          </div>
          <div class="player-detail-stat-box">
            <div class="player-detail-stat-value">${player.speed || '30'}'</div>
            <div class="player-detail-stat-label">Prędkość</div>
          </div>
          <div class="player-detail-stat-box">
            <div class="player-detail-stat-value">${player.proficiency ? '+' + player.proficiency : '+2'}</div>
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
          ${renderSkill('Siła', player.strMod, player.savingThrows && player.savingThrows.includes('str'))}
          ${renderSkill('Zręczność', player.dexMod, player.savingThrows && player.savingThrows.includes('dex'))}
          ${renderSkill('Kondycja', player.conMod, player.savingThrows && player.savingThrows.includes('con'))}
          ${renderSkill('Inteligencja', player.intMod, player.savingThrows && player.savingThrows.includes('int'))}
          ${renderSkill('Mądrość', player.wisMod, player.savingThrows && player.savingThrows.includes('wis'))}
          ${renderSkill('Charyzma', player.chaMod, player.savingThrows && player.savingThrows.includes('cha'))}
          ${renderSkill('Akrobatyka', player.dexMod, player.skills && player.skills.includes('akrobatyka'), true)}
          ${renderSkill('Atletyka', player.strMod, player.skills && player.skills.includes('atletyka'), true)}
          ${renderSkill('Historia', player.intMod, player.skills && player.skills.includes('historia'), true)}
          ${renderSkill('Medycyna', player.wisMod, player.skills && player.skills.includes('medycyna'), true)}
          ${renderSkill('Percepcja', player.wisMod, player.skills && player.skills.includes('percepcja'), true)}
          ${renderSkill('Perswazja', player.chaMod, player.skills && player.skills.includes('perswazja'), true)}
        </div>
      </div>
      
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
      
      ${player.personality && (player.personality.trait || player.personality.ideal || player.personality.bond || player.personality.flaw) ? `
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
          ${player.equipment.gold ? `
          <div class="equipment-category">
            <div class="equipment-category-title">Złoto</div>
            <div class="equipment-items">${player.equipment.gold} sz</div>
          </div>
          ` : ''}
        </div>
      </div>
      ` : ''}
      
      <div class="player-detail-actions">
        <button class="btn" onclick="addPlayerToInitiative(${index})">⚡ Dodaj do potyczki</button>
        <button class="btn outline" onclick="closePlayerDetail(); editPlayer(${index})">✏️ Edytuj</button>
        <button class="btn outline" onclick="exportPlayer(${index})">📤 Eksportuj postać</button>
        <button class="btn danger" onclick="closePlayerDetail(); removePlayer(${index})">🗑️ Usuń postać</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
}

function closePlayerDetail() {
  var overlay = document.getElementById('playerDetailOverlay');
  if (overlay) {
    overlay.remove();
    document.body.style.overflow = '';
  }
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
  var totalMod = proficient ? (mod + (window.calculateProficiencyBonus ? window.calculateProficiencyBonus(1) : 2)) : mod;
  var totalStr = totalMod >= 0 ? '+' + totalMod : '' + totalMod;
  
  return `
    <div class="skill-item ${isProf}">
      <span class="skill-name">${name} ${isSkill ? '(ZRC)' : ''}</span>
      <span class="skill-modifier">${totalStr}</span>
    </div>
  `;
}

// ====== INNE FUNKCJE (pozostają bez zmian) ======
function getRoleBadge(role) {
  var map = { 'Gracz': 'gracz', 'Companion': 'companion', 'Wróg': 'wrog', 'NPC': 'npc' };
  return 'p-role-badge ' + (map[role] || 'npc');
}

function removePlayer(index) {
  if (confirm('Usunąć ' + players[index].name + '?')) {
    players.splice(index, 1);
    renderPlayers();
    saveState();
  }
}

function deathSave(index) {
  var p = players[index];
  if (!p) return;
  var roll = Math.floor(Math.random() * 20) + 1;
  if (roll === 1) { p.deathSaves.fails += 2; playSound('death'); }
  else if (roll === 20) { p.hp = 1; p.deathSaves.passes = 0; p.deathSaves.fails = 0; playSound('crit'); renderPlayers(); syncToCombat(); return; }
  else if (roll >= 10) p.deathSaves.passes++;
  else p.deathSaves.fails++;
  if (p.deathSaves.fails >= 3) {
    playSound('death');
    if (confirm('💀 ' + p.name + ' umiera! Usunąć?')) {
      removePlayer(index);
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
  var initVal = prompt('Inicjatywa dla ' + p.name + ':', p.initiative !== undefined ? p.initiative : '0');
  if (initVal === null) return;
  if (typeof addCombatant === 'function') {
    addCombatant({
      name: p.name,
      init: parseInt(initVal) || 0,
      hp: p.hp,
      maxHp: p.maxHp,
      ac: p.ac,
      role: p.role || 'Gracz',
      conditions: p.conditions ? p.conditions.slice() : [],
      exhaustionLevel: p.exhaustionLevel || 0,
      roundDamage: 0,
      avatar: p.avatar
    });
  }
  playSound('add');
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

function updateAvatarPreview() {
  var preview = document.getElementById('avatarPreview');
  if (!preview) return;
  if (selectedAvatarUrl) {
    preview.innerHTML = '<img src="' + selectedAvatarUrl + '" onerror="this.parentNode.textContent=\'🧙\'">';
  } else {
    preview.textContent = selectedAvatar;
  }
}

function initAvatarPicker() {
  var grid = document.getElementById('avatarGrid');
  if (!grid) return;
  
  var avatars = ['🧙', '🧝', '🧛', '', '🧞', '🧜', '🦹', '', '🥷', '🧚', '👑', '', '🐺', '🦅', '🐻', ''];
  
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
      selectedAvatarUrl = '';
      var urlInput = document.getElementById('avatarUrl');
      if (urlInput) urlInput.value = '';
      updateAvatarPreview();
    };
    grid.appendChild(btn);
  });
  
  var urlInput = document.getElementById('avatarUrl');
  if (urlInput) {
    urlInput.addEventListener('input', function() {
      var url = this.value.trim();
      if (url) {
        selectedAvatarUrl = url;
        selectedAvatar = '';
        grid.querySelectorAll('.avatar-btn').forEach(function(b) { b.classList.remove('active'); });
      } else {
        selectedAvatarUrl = '';
        selectedAvatar = '🧙';
      }
      updateAvatarPreview();
    });
  }
}

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

// ====== EKSPORT ======
window.renderPlayers = renderPlayers;
window.openPlayerDetail = openPlayerDetail;
window.closePlayerDetail = closePlayerDetail;
window.openAddPlayerModal = openAddPlayerModal;
window.closeAddPlayerModal = closeAddPlayerModal;
window.confirmAddPlayer = confirmAddPlayer;
window.editPlayer = editPlayer;
window.removePlayer = removePlayer;
window.deathSave = deathSave;
window.addPlayerToInitiative = addPlayerToInitiative;
window.showPlayerCondPopup = showPlayerCondPopup;
window.exportPlayer = exportPlayer;
window.importPlayer = importPlayer;
window.initAvatarPicker = initAvatarPicker;
window.players = players;
window.calculateProficiencyBonus = calculateProficiencyBonus;