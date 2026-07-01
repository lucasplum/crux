// ============================================================
//  PLAYERS - NOWY SYSTEM Z PEŁNYMI KARTAMI
// ============================================================

var players = [];
var currentPlayerId = null;
var editingPlayerId = null;
var selectedAvatar = '🧙';
var selectedAvatarUrl = '';

// ====== GENEROWANIE ID ======
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
}

// ====== IKONY KLAS ======
var CLASS_ICONS = {
    'Wojownik': '⚔️',
    'Czarodziej': '🔮',
    'Łotrzyk': '🗡️',
    'Kapłan': '🛡️',
    'Paladyn': '⚔️',
    'Łowca': '🏹',
    'Bard': '🎵',
    'Czarownik': '🔥',
    'Mag': '📖',
    'Druid': '🌿',
    'Mnich': '👊',
    'Zaklinacz': '🌀'
};

var ROLE_COLORS = {
    'Gracz': '#4a6fa5',
    'Companion': '#4a7a5f',
    'Wróg': '#8a2a22',
    'NPC': '#6a5a3a'
};

// ====== ATrybuty ======
var AB_LABEL = { str: 'Siła', dex: 'Zręczność', con: 'Kondycja', int: 'Inteligencja', wis: 'Mądrość', cha: 'Charyzma' };
var AB_SHORT = { str: 'SIŁ', dex: 'ZRC', con: 'KON', int: 'INT', wis: 'MDR', cha: 'CHA' };

function mod(score) { return Math.floor((score - 10) / 2); }
function fmt(n) { return n >= 0 ? '+' + n : '' + n; }

// ====== UMIEJĘTNOŚCI ======
var SKILLS = [
    { name: 'Akrobatyka', ab: 'dex' },
    { name: 'Atletyka', ab: 'str' },
    { name: 'Historia', ab: 'int' },
    { name: 'Medycyna', ab: 'wis' },
    { name: 'Percepcja', ab: 'wis' },
    { name: 'Perswazja', ab: 'cha' },
    { name: 'Oszustwo', ab: 'cha' },
    { name: 'Wyczucie', ab: 'wis' },
    { name: 'Zastraszanie', ab: 'cha' },
    { name: 'Dochodzenie', ab: 'int' },
    { name: 'Przyroda', ab: 'int' },
    { name: 'Religia', ab: 'int' },
    { name: 'Skradanie', ab: 'dex' },
    { name: 'Zręczne palce', ab: 'dex' },
    { name: 'Przetrwanie', ab: 'wis' },
    { name: 'Wiedza tajemna', ab: 'int' },
    { name: 'Występy', ab: 'cha' },
    { name: 'Obchodzenie ze zwierzętami', ab: 'wis' }
];

// ====== RENDER BIBLIOTEKI ======
function renderPlayers() {
    var container = document.getElementById('playerTracker');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (players.length === 0) {
        container.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--parchment-dim);font-family:var(--font-cinzel);letter-spacing:0.04em;">
                <div style="font-size:3rem;margin-bottom:12px;">📜</div>
                <p style="font-size:var(--font-lg);">Brak postaci w bibliotece</p>
                <p style="font-size:var(--font-sm);margin-top:4px;">Kliknij „Dodaj postać", aby stworzyć pierwszego bohatera</p>
            </div>
        `;
        return;
    }
    
    players.forEach(function(p, index) {
        var tile = document.createElement('button');
        tile.className = 'player-tile';
        tile.dataset.index = index;
        tile.style.setProperty('--accent', ROLE_COLORS[p.role] || '#5a1a14');
        tile.style.setProperty('--accent-dim', ROLE_COLORS[p.role] ? ROLE_COLORS[p.role] + '88' : '#5a1a1488');
        tile.style.animationDelay = (index * 70) + 'ms';
        
        var classIcon = CLASS_ICONS[p.class] || '⚔️';
        var hpPct = p.maxHp > 0 ? Math.round((p.hp / p.maxHp) * 100) : 0;
        
        tile.innerHTML = `
            <div class="player-tile-band">
                <span class="player-tile-icon">${classIcon}</span>
                <div class="player-tile-lvl">${p.level || 1}</div>
            </div>
            <div class="player-tile-body">
                <h3 class="player-tile-name">${p.name}</h3>
                <div class="player-tile-sub">${p.race || ''} · ${p.class || ''}</div>
                <div class="player-tile-stats">
                    <span>KP <b>${p.ac || 10}</b></span>
                    <span>HP <b>${p.hp || 0}/${p.maxHp || 0}</b></span>
                    <span>⚡ <b>${p.speed || 30}'</b></span>
                </div>
                ${p.role ? `<div class="player-tile-role" style="background:${ROLE_COLORS[p.role]}44;color:${ROLE_COLORS[p.role]};">${p.role}</div>` : ''}
            </div>
        `;
        
        tile.addEventListener('click', function() {
            openCharacterDetail(index);
        });
        
        container.appendChild(tile);
    });
}

// ====== OTWIERANIE SZCZEGÓŁÓW ======
function openCharacterDetail(index) {
    var p = players[index];
    if (!p) return;
    
    currentPlayerId = p.id;
    
    var overlay = document.getElementById('characterDetailOverlay');
    var content = document.getElementById('characterDetailContent');
    if (!overlay || !content) return;
    
    var headerColor = ROLE_COLORS[p.role] || '#5a1a14';
    var classIcon = CLASS_ICONS[p.class] || '⚔️';
    var initMod = mod(p.dex || 10);
    var passivePerc = 10 + (p.proficiencies && p.proficiencies.includes('Percepcja') ? mod(p.wis || 10) + (p.pb || 2) : mod(p.wis || 10));
    var hpPct = p.maxHp > 0 ? Math.round((p.hp / p.maxHp) * 100) : 0;
    
    // Atrybuty
    var abilitiesHtml = Object.keys(AB_LABEL).map(function(ab) {
        var val = p[ab] || 10;
        return `
            <div class="char-ability">
                <div class="char-ability-name">${AB_LABEL[ab]}</div>
                <div class="char-ability-mod">${fmt(mod(val))}</div>
                <div class="char-ability-score">${val} — ${AB_SHORT[ab]}</div>
            </div>
        `;
    }).join('');
    
    // Ratunki
    var savesHtml = Object.keys(AB_LABEL).map(function(ab) {
        var prof = p.savingThrows && p.savingThrows.includes(ab);
        var bonus = mod(p[ab] || 10) + (prof ? (p.pb || 2) : 0);
        return `
            <li>
                <span class="char-dot ${prof ? 'on' : ''}"></span>
                <span class="char-prof-name">${AB_LABEL[ab]}</span>
                <span class="char-bonus">${fmt(bonus)}</span>
            </li>
        `;
    }).join('');
    
    // Umiejętności
    var skillsHtml = SKILLS.map(function(s) {
        var prof = p.proficiencies && p.proficiencies.includes(s.name);
        var exp = p.expertise && p.expertise.includes(s.name);
        var bonus = mod(p[s.ab] || 10) + (exp ? (p.pb || 2) * 2 : prof ? (p.pb || 2) : 0);
        return `
            <li>
                <span class="char-dot ${exp ? 'exp' : (prof ? 'on' : '')}"></span>
                <span class="char-prof-name">${s.name}</span>
                <span class="char-bonus">${fmt(bonus)}</span>
            </li>
        `;
    }).join('');
    
    // Ekwipunek
    var equipHtml = '';
    if (p.equipment && p.equipment.length > 0) {
        equipHtml = '<ul>' + p.equipment.map(function(e) { return '<li>' + e + '</li>'; }).join('') + '</ul>';
    } else {
        equipHtml = '<p style="color:var(--parchment-dim);font-style:italic;">Brak ekwipunku</p>';
    }
    
    // Cechy
    var featuresHtml = '';
    if (p.features && p.features.length > 0) {
        featuresHtml = '<ul>' + p.features.map(function(f) {
            return '<li><strong style="color:var(--gold);">' + f.name + '.</strong> ' + f.desc + '</li>';
        }).join('') + '</ul>';
    } else {
        featuresHtml = '<p style="color:var(--parchment-dim);font-style:italic;">Brak cech</p>';
    }
    
    // Zaklęcia
    var spellHtml = '';
    if (p.spells && p.spells.length > 0) {
        spellHtml = `
            <div class="char-section">
                <h4 class="char-section-title">🔮 Zaklęcia</h4>
                <div class="char-listpanel">
                    <ul>${p.spells.map(function(s) { return '<li>' + s + '</li>'; }).join('')}</ul>
                </div>
            </div>
        `;
    }
    
    // Osobowość
    var personality = p.personality || {};
    var personalityHtml = `
        <div class="char-quotes">
            ${personality.traits ? `<div class="char-quote"><div class="char-quote-label">Cecha charakteru</div><p>${personality.traits}</p></div>` : ''}
            ${personality.ideals ? `<div class="char-quote"><div class="char-quote-label">Ideał</div><p>${personality.ideals}</p></div>` : ''}
            ${personality.bonds ? `<div class="char-quote"><div class="char-quote-label">Więź</div><p>${personality.bonds}</p></div>` : ''}
            ${personality.flaws ? `<div class="char-quote"><div class="char-quote-label">Wada</div><p>${personality.flaws}</p></div>` : ''}
        </div>
    `;
    
    // Backstory
    var backstoryHtml = p.backstory ? 
        `<div class="char-backstory">${p.backstory}</div>` : 
        '<p style="color:var(--parchment-dim);font-style:italic;">Brak historii</p>';
    
    // Awatar
    var avatarHtml = p.avatar && p.avatar.startsWith('http') 
        ? '<img src="' + p.avatar + '" onerror="this.parentNode.textContent=\'🧙\'">' 
        : (p.avatar || '🧙');
    
    content.innerHTML = `
        <div class="char-sheet-head" style="background:linear-gradient(120deg, ${headerColor} 0%, transparent 65%), var(--panel);">
            <div class="char-medal" style="--accent:${headerColor};--accent-dim:${headerColor}88;">
                <span style="font-size:1.8rem;">${avatarHtml}</span>
            </div>
            <div>
                <h2 class="char-sheet-name">${p.name}</h2>
                <div class="char-sheet-meta">${p.race || ''} · ${p.class || ''} · Poziom ${p.level || 1}</div>
                <div class="char-sheet-align">${p.alignment || 'Neutralny'}</div>
            </div>
            <div style="margin-left:auto;display:flex;gap:8px;flex-wrap:wrap;">
                <button class="char-action-btn" onclick="editPlayer(${index})">✎ Edytuj</button>
                <button class="char-action-btn" onclick="if(confirm('Usunąć ${p.name}?')){removePlayer(${index});}">🗑️</button>
            </div>
        </div>

        <div class="char-seals">
            <div class="char-seal"><div class="char-seal-val">${p.ac || 10}</div><div class="char-seal-lbl">Klasa Pancerza</div></div>
            <div class="char-seal hp">
                <div class="char-seal-val">${p.hp || 0}/${p.maxHp || 0}</div>
                <div class="char-seal-lbl">Punkty Wytrzymałości</div>
                <div class="char-hp-bar"><span style="width:${hpPct}%;"></span></div>
            </div>
            <div class="char-seal"><div class="char-seal-val">${fmt(initMod)}</div><div class="char-seal-lbl">Inicjatywa</div></div>
            <div class="char-seal"><div class="char-seal-val">${p.speed || 30}'</div><div class="char-seal-lbl">Prędkość</div></div>
            <div class="char-seal"><div class="char-seal-val">${fmt(p.pb || 2)}</div><div class="char-seal-lbl">Bonus Biegłości</div></div>
            <div class="char-seal"><div class="char-seal-val">${passivePerc}</div><div class="char-seal-lbl">Pasywna Percepcja</div></div>
        </div>

        <div class="char-section">
            <h4 class="char-section-title">💪 Atrybuty</h4>
            <div class="char-abilities">${abilitiesHtml}</div>
        </div>

        <div class="char-section">
            <h4 class="char-section-title">🛡️ Ratunki i umiejętności</h4>
            <div class="char-twocol">
                <div class="char-listpanel"><ul>${savesHtml}</ul></div>
                <div class="char-listpanel"><ul>${skillsHtml}</ul></div>
            </div>
        </div>

        ${spellHtml}

        <div class="char-section">
            <h4 class="char-section-title">🎒 Ekwipunek i biegłości</h4>
            <details open>
                <summary>Wyposażenie</summary>
                <div class="char-content">${equipHtml}</div>
            </details>
            <details>
                <summary>Biegłości</summary>
                <div class="char-content">
                    ${p.proficiencies && p.proficiencies.length > 0 ? '<ul>' + p.proficiencies.map(function(prof) { return '<li>' + prof + '</li>'; }).join('') + '</ul>' : '<p style="color:var(--parchment-dim);font-style:italic;">Brak</p>'}
                </div>
            </details>
            <details>
                <summary>Cechy i zdolności</summary>
                <div class="char-content">${featuresHtml}</div>
            </details>
        </div>

        <div class="char-section">
            <h4 class="char-section-title">🎭 Osobowość</h4>
            ${personalityHtml}
        </div>

        <div class="char-section">
            <h4 class="char-section-title">📖 Historia</h4>
            ${backstoryHtml}
        </div>

        <div class="char-actions-bar">
            <button class="char-action-btn primary" onclick="closeCharacterDetail();addPlayerToInitiative(${index});">⚔️ Do potyczki</button>
            <button class="char-action-btn" onclick="closeCharacterDetail();shortRestPlayer(${index});">☕ Krótki odpoczynek</button>
            <button class="char-action-btn" onclick="closeCharacterDetail();longRestPlayer(${index});">🛏️ Długi odpoczynek</button>
            <button class="char-action-btn" onclick="closeCharacterDetail();showPlayerCondPopup(${index});">⚙️ Stany</button>
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
    currentPlayerId = null;
}

// ====== EDYCJA POSTACI ======
function editPlayer(index) {
    var p = players[index];
    if (!p) return;
    
    editingPlayerId = index;
    
    // Wypełnij formularz danymi
    document.getElementById('pName').value = p.name || '';
    document.getElementById('pRole').value = p.role || 'Gracz';
    document.getElementById('pRace').value = p.race || '';
    document.getElementById('pClass').value = p.class || '';
    document.getElementById('pLevel').value = p.level || 1;
    document.getElementById('pBackground').value = p.background || '';
    document.getElementById('pAlignment').value = p.alignment || 'Neutralny';
    
    document.getElementById('pStr').value = p.str || 10;
    document.getElementById('pDex').value = p.dex || 10;
    document.getElementById('pCon').value = p.con || 10;
    document.getElementById('pInt').value = p.int || 10;
    document.getElementById('pWis').value = p.wis || 10;
    document.getElementById('pCha').value = p.cha || 10;
    
    document.getElementById('pHP').value = p.hp || 0;
    document.getElementById('pMaxHP').value = p.maxHp || 0;
    document.getElementById('pTempHP').value = p.tempHp || 0;
    document.getElementById('pAC').value = p.ac || 10;
    document.getElementById('pSpeed').value = p.speed || 30;
    document.getElementById('pPassivePerception').value = p.passivePerception || 10;
    
    // Biegłości
    document.querySelectorAll('.saving-throw-checkbox').forEach(function(cb) {
        cb.checked = p.savingThrows && p.savingThrows.includes(cb.dataset.stat);
    });
    document.querySelectorAll('.skill-checkbox').forEach(function(cb) {
        cb.checked = p.proficiencies && p.proficiencies.includes(cb.dataset.skill);
    });
    
    // Awatar
    if (p.avatar) {
        if (p.avatar.startsWith('http')) {
            document.getElementById('avatarUrl').value = p.avatar;
            document.getElementById('avatarPreview').innerHTML = '<img src="' + p.avatar + '" onerror="this.parentNode.textContent=\'🧙\'">';
        } else {
            selectedAvatar = p.avatar || '🧙';
            document.getElementById('avatarPreview').textContent = selectedAvatar;
            document.querySelectorAll('#avatarGrid .avatar-btn').forEach(function(b) {
                b.classList.toggle('active', b.dataset.avatar === selectedAvatar);
            });
        }
    }
    
    // Ekwipunek
    document.getElementById('pWeapons').value = p.weapons || '';
    document.getElementById('pArmor').value = p.armor || '';
    document.getElementById('pItems').value = p.items || '';
    document.getElementById('pGold').value = p.gold || 0;
    
    // Osobowość
    var pers = p.personality || {};
    document.getElementById('pPersonalityTrait').value = pers.traits || '';
    document.getElementById('pPersonalityIdeal').value = pers.ideals || '';
    document.getElementById('pPersonalityBond').value = pers.bonds || '';
    document.getElementById('pPersonalityFlaw').value = pers.flaws || '';
    
    // Historia
    document.getElementById('pBackstory').value = p.backstory || '';
    
    // Zmień tytuł
    document.querySelector('#playerModalTitle').textContent = '✎ Edytuj postać';
    
    var popup = document.getElementById('addPlayerPopup');
    if (popup) {
        popup.style.display = 'flex';
    }
}

// ====== ZAPISZ POSTAĆ (dodawanie/edycja) ======
function confirmAddPlayer() {
    var isEdit = editingPlayerId !== null;
    var index = editingPlayerId;
    
    // Pobierz dane z formularza
    var name = document.getElementById('pName').value.trim();
    if (!name) { alert('Podaj imię postaci'); return; }
    
    var role = document.getElementById('pRole').value;
    var race = document.getElementById('pRace').value.trim();
    var cls = document.getElementById('pClass').value.trim();
    var level = parseInt(document.getElementById('pLevel').value) || 1;
    var background = document.getElementById('pBackground').value.trim();
    var alignment = document.getElementById('pAlignment').value;
    
    var str = parseInt(document.getElementById('pStr').value) || 10;
    var dex = parseInt(document.getElementById('pDex').value) || 10;
    var con = parseInt(document.getElementById('pCon').value) || 10;
    var int = parseInt(document.getElementById('pInt').value) || 10;
    var wis = parseInt(document.getElementById('pWis').value) || 10;
    var cha = parseInt(document.getElementById('pCha').value) || 10;
    
    var hp = parseInt(document.getElementById('pHP').value) || 0;
    var maxHp = parseInt(document.getElementById('pMaxHP').value) || 10;
    var tempHp = parseInt(document.getElementById('pTempHP').value) || 0;
    var ac = parseInt(document.getElementById('pAC').value) || 10;
    var speed = parseInt(document.getElementById('pSpeed').value) || 30;
    var passivePerception = parseInt(document.getElementById('pPassivePerception').value) || 10;
    
    var savingThrows = [];
    document.querySelectorAll('.saving-throw-checkbox:checked').forEach(function(cb) {
        savingThrows.push(cb.dataset.stat);
    });
    
    var proficiencies = [];
    document.querySelectorAll('.skill-checkbox:checked').forEach(function(cb) {
        proficiencies.push(cb.dataset.skill);
    });
    
    var avatar = selectedAvatarUrl || selectedAvatar || '🧙';
    
    var weapons = document.getElementById('pWeapons').value.trim();
    var armor = document.getElementById('pArmor').value.trim();
    var items = document.getElementById('pItems').value.trim();
    var gold = parseInt(document.getElementById('pGold').value) || 0;
    
    var personality = {
        traits: document.getElementById('pPersonalityTrait').value.trim(),
        ideals: document.getElementById('pPersonalityIdeal').value.trim(),
        bonds: document.getElementById('pPersonalityBond').value.trim(),
        flaws: document.getElementById('pPersonalityFlaw').value.trim()
    };
    
    var backstory = document.getElementById('pBackstory').value.trim();
    
    var playerData = {
        id: isEdit ? players[index].id : generateId(),
        name: name,
        role: role,
        race: race,
        class: cls,
        level: level,
        background: background,
        alignment: alignment,
        str: str, dex: dex, con: con, int: int, wis: wis, cha: cha,
        hp: hp,
        maxHp: maxHp,
        tempHp: tempHp,
        ac: ac,
        speed: speed,
        passivePerception: passivePerception,
        pb: Math.floor((level + 7) / 4),
        savingThrows: savingThrows,
        proficiencies: proficiencies,
        expertise: [],
        avatar: avatar,
        weapons: weapons,
        armor: armor,
        items: items,
        gold: gold,
        equipment: [],
        features: [],
        spells: [],
        personality: personality,
        backstory: backstory,
        conditions: [],
        exhaustionLevel: 0,
        deathSaves: { passes: 0, fails: 0 }
    };
    
    // Usuń puste właściwości
    Object.keys(playerData).forEach(function(key) {
        if (playerData[key] === '' || playerData[key] === null || playerData[key] === undefined) {
            delete playerData[key];
        }
    });
    
    if (isEdit) {
        players[index] = playerData;
    } else {
        players.push(playerData);
    }
    
    editingPlayerId = null;
    document.querySelector('#playerModalTitle').textContent = '➕ Nowa postać';
    closeAddPlayerModal();
    renderPlayers();
    if (typeof saveState === 'function') saveState();
    if (typeof playSound === 'function') playSound('add');
}

// ====== USUWANIE POSTACI ======
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
        if (typeof saveState === 'function') saveState();
    }
}

// ====== DODAWANIE DO POTYCZKI ======
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
    var initVal = prompt('Inicjatywa dla ' + p.name + ':', Math.floor(Math.random() * 20) + 1);
    if (initVal === null) return;
    if (typeof addCombatant === 'function') {
        addCombatant({
            name: p.name,
            init: parseInt(initVal) || 0,
            hp: p.hp || p.maxHp || 0,
            maxHp: p.maxHp || 0,
            ac: p.ac || 10,
            role: p.role || 'Gracz',
            conditions: p.conditions || [],
            exhaustionLevel: p.exhaustionLevel || 0,
            avatar: p.avatar || '🧙'
        });
    }
    if (typeof playSound === 'function') playSound('add');
}

// ====== ODPOCZYNEK ======
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

// ====== STANY ======
function showPlayerCondPopup(index) {
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

// ====== INICJALIZACJA ======
function initAvatarPicker() {
    var grid = document.getElementById('avatarGrid');
    if (!grid) return;
    grid.innerHTML = '';
    var avatars = ['🧙', '🧝', '🧛', '🧟', '🧞', '🧜', '🦹', '🦸', '🥷', '🧚', '👑', '🐉', '🐺', '🦅', '🐻', '🦁', '🗡️', '🛡️', '⚔️', '🏹', '🪄', '💀', '👹', '👻'];
    avatars.forEach(function(a) {
        var btn = document.createElement('button');
        btn.className = 'avatar-btn' + (a === '🧙' ? ' active' : '');
        btn.dataset.avatar = a;
        btn.textContent = a;
        btn.addEventListener('click', function() {
            document.querySelectorAll('#avatarGrid .avatar-btn').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            selectedAvatar = a;
            selectedAvatarUrl = '';
            var urlInput = document.getElementById('avatarUrl');
            if (urlInput) urlInput.value = '';
            updateAvatarPreview();
        });
        grid.appendChild(btn);
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
        preview.textContent = selectedAvatar || '🧙';
    }
}

// ====== MODAL ======
function openAddPlayerModal() {
    selectedAvatar = '🧙';
    selectedAvatarUrl = '';
    editingPlayerId = null;
    document.querySelector('#playerModalTitle').textContent = '➕ Nowa postać';
    
    // Wyczyść formularz
    document.getElementById('pName').value = '';
    document.getElementById('pRole').value = 'Gracz';
    document.getElementById('pRace').value = '';
    document.getElementById('pClass').value = '';
    document.getElementById('pLevel').value = 1;
    document.getElementById('pBackground').value = '';
    document.getElementById('pAlignment').value = 'Neutralny';
    
    document.getElementById('pStr').value = 10;
    document.getElementById('pDex').value = 10;
    document.getElementById('pCon').value = 10;
    document.getElementById('pInt').value = 10;
    document.getElementById('pWis').value = 10;
    document.getElementById('pCha').value = 10;
    
    document.getElementById('pHP').value = 10;
    document.getElementById('pMaxHP').value = 10;
    document.getElementById('pTempHP').value = 0;
    document.getElementById('pAC').value = 10;
    document.getElementById('pSpeed').value = 30;
    document.getElementById('pPassivePerception').value = 10;
    
    document.querySelectorAll('.saving-throw-checkbox').forEach(function(cb) { cb.checked = false; });
    document.querySelectorAll('.skill-checkbox').forEach(function(cb) { cb.checked = false; });
    
    document.getElementById('pWeapons').value = '';
    document.getElementById('pArmor').value = '';
    document.getElementById('pItems').value = '';
    document.getElementById('pGold').value = 0;
    
    document.getElementById('pPersonalityTrait').value = '';
    document.getElementById('pPersonalityIdeal').value = '';
    document.getElementById('pPersonalityBond').value = '';
    document.getElementById('pPersonalityFlaw').value = '';
    document.getElementById('pBackstory').value = '';
    
    document.getElementById('avatarUrl').value = '';
    updateAvatarPreview();
    
    document.querySelectorAll('#avatarGrid .avatar-btn').forEach(function(b) {
        b.classList.toggle('active', b.dataset.avatar === '🧙');
    });
    
    var popup = document.getElementById('addPlayerPopup');
    if (popup) popup.style.display = 'flex';
}

function closeAddPlayerModal() {
    var popup = document.getElementById('addPlayerPopup');
    if (popup) popup.style.display = 'none';
    editingPlayerId = null;
    document.querySelector('#playerModalTitle').textContent = '➕ Nowa postać';
}

// ====== EKSPORT ======
window.players = players;
window.renderPlayers = renderPlayers;
window.openCharacterDetail = openCharacterDetail;
window.closeCharacterDetail = closeCharacterDetail;
window.editPlayer = editPlayer;
window.openAddPlayerModal = openAddPlayerModal;
window.closeAddPlayerModal = closeAddPlayerModal;
window.confirmAddPlayer = confirmAddPlayer;
window.removePlayer = removePlayer;
window.addPlayerToInitiative = addPlayerToInitiative;
window.shortRestPlayer = shortRestPlayer;
window.longRestPlayer = longRestPlayer;
window.showPlayerCondPopup = showPlayerCondPopup;
window.syncToCombat = syncToCombat;
window.initAvatarPicker = initAvatarPicker;