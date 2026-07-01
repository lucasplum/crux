// ============================================================
//  PLAYERS - Z DANYMI POCZĄTKOWYMI
// ============================================================

// ====== DANE POCZĄTKOWE ======
var DEFAULT_PLAYERS = [
{
    id: "kaelen",
    name: "Kaelen Ashvane",
    race: "Człowiek",
    class: "Wojownik",
    level: 6,
    background: "Żołnierz",
    alignment: "Praworządny Dobry",
    role: "Gracz",
    str: 17, dex: 14, con: 15, int: 10, wis: 12, cha: 13,
    hp: 58, maxHp: 58, tempHp: 0,
    ac: 18, speed: 30, passivePerception: 10, pb: 3,
    savingThrows: ["str", "con"],
    proficiencies: ["Atletyka", "Zastraszanie", "Percepcja"],
    expertise: [],
    avatar: "⚔️",
    weapons: "Długi miecz +1, Kusza ręczna",
    armor: "Kolczuga, Tarcza",
    items: "Zestaw podróżnika, Sakiewka (45 zł)",
    gold: 45,
    features: [
        "Drugi oddech: Raz na krótki odpoczynek odzyskuje 1k10 + poziom PW",
        "Przypływ akcji: Dodatkowa akcja raz na krótki odpoczynek",
        "Dodatkowy atak: Dwa ataki na akcję Atak"
    ],
    spells: [],
    personality: {
        traits: "Zawsze pierwszy wchodzi do bitwy — i ostatni z niej wychodzi.",
        ideals: "Honor. Dane słowo jest ważniejsze niż własne życie.",
        bonds: "Chroni ostatnich żyjących towarzyszy ze swojego oddziału.",
        flaws: "Nie potrafi się wycofać, nawet gdy rozsądek nakazuje odwrót."
    },
    backstory: "Kaelen służył dziesięć lat w straży granicznej Waldemaru, zanim jego oddział został zdradzony i wybity podczas nocnego najazdu. Ocalał tylko on. Od tamtej pory wędruje traktami, szukając tych, którzy sprzedali jego braci wrogowi."
},
{
    id: "ilyra",
    name: "Ilyra Duskwhisper",
    race: "Wysoki Elf",
    class: "Czarodziej",
    level: 5,
    background: "Uczony",
    alignment: "Neutralny Dobry",
    role: "Gracz",
    str: 8, dex: 15, con: 13, int: 18, wis: 12, cha: 11,
    hp: 21, maxHp: 27, tempHp: 0,
    ac: 12, speed: 30, passivePerception: 10, pb: 3,
    savingThrows: ["int", "wis"],
    proficiencies: ["Wiedza tajemna", "Historia", "Dochodzenie", "Wyczucie"],
    expertise: [],
    avatar: "🔮",
    weapons: "Laska wróżbity",
    armor: "Brak",
    items: "Księga zaklęć, Zestaw komponentów, Kryształowa kula",
    gold: 12,
    features: [
        "Wgląd wróżbity: Dwa razy na krótki odpoczynek może spojrzeć na rzut",
        "Odzyskiwanie zaklęć: Raz dziennie odzyskuje sloty o łącznym poziomie do 3"
    ],
    spells: ["Pocisk mocy", "Tarcza", "Wykrycie magii", "Niewidzialność", "Kula ognista"],
    personality: {
        traits: "Notuje każdą anomalię magiczną w skórzanym dzienniku.",
        ideals: "Wiedza. Nic nie powinno pozostać niezbadane.",
        bonds: "Poszukuje zaginionej biblioteki swojego mistrza.",
        flaws: "Ciekawość bywa silniejsza niż instynkt samozachowawczy."
    },
    backstory: "Wychowana w Wieży Siedmiu Zwierciadeł, Ilyra od dziecka wykazywała talent do przewidywania nadchodzących wydarzeń."
},
{
    id: "pip",
    name: "Pip Nimblefoot",
    race: "Niziołek Lekkostopy",
    class: "Łotrzyk",
    level: 4,
    background: "Przestępca",
    alignment: "Chaotyczny Dobry",
    role: "Gracz",
    str: 9, dex: 18, con: 13, int: 12, wis: 14, cha: 15,
    hp: 27, maxHp: 27, tempHp: 0,
    ac: 15, speed: 25, passivePerception: 10, pb: 2,
    savingThrows: ["dex", "int"],
    proficiencies: ["Skradanie", "Zręczne palce", "Perswazja", "Oszustwo", "Percepcja", "Akrobatyka"],
    expertise: ["Skradanie", "Zręczne palce"],
    avatar: "🗡️",
    weapons: "Dwa sztylety, Kusza ręczna",
    armor: "Lekka zbroja",
    items: "Wytrychy mistrzowskie, Peleryna tłumiąca dźwięk",
    gold: 60,
    features: [
        "Atak z zaskoczenia: +2k6 obrażeń przy przewadze",
        "Cwana akcja: Akcja dodatkowa na Pościg, Wycofanie lub Ukrycie"
    ],
    spells: [],
    personality: {
        traits: "Rozmawia z zamkami, zanim je otworzy.",
        ideals: "Wolność. Łańcuchy, prawa i mury są dla innych.",
        bonds: "Winna jest przysługę gildii, która uratowała jej rodzinę.",
        flaws: "Nie potrafi oprzeć się dobrze zabezpieczonemu zamkowi."
    },
    backstory: "Pip dorastała w Dolnym Mieście, ucząc się fachu od najlepszych — i najgorszych. Dziś pracuje jako niezależna informatorka."
},
{
    id: "borin",
    name: "Borin Stonehelm",
    race: "Krasnolud Górski",
    class: "Kapłan",
    level: 6,
    background: "Akolita",
    alignment: "Praworządny Dobry",
    role: "Gracz",
    str: 14, dex: 10, con: 16, int: 11, wis: 18, cha: 12,
    hp: 52, maxHp: 52, tempHp: 0,
    ac: 18, speed: 25, passivePerception: 10, pb: 3,
    savingThrows: ["wis", "cha"],
    proficiencies: ["Medycyna", "Religia", "Wyczucie", "Perswazja"],
    expertise: [],
    avatar: "🛡️",
    weapons: "Młot bojowy",
    armor: "Kolczuga, Tarcza",
    items: "Święty symbol, Zestaw uzdrowiciela",
    gold: 0,
    features: [
        "Odparcie nieumarłych: Kanałowanie boskości",
        "Uderzenie życiodajne: +2 + poziom zaklęcia do leczenia"
    ],
    spells: ["Lecz rany", "Błogosławieństwo", "Ochrona przed dobrem i złem", "Rozwiej magię"],
    personality: {
        traits: "Śpiewa stare hymny kuźni, gdy opatruje rannych.",
        ideals: "Wspólnota. Klan i sojusznicy są ważniejsi niż jednostka.",
        bonds: "Odbudowuje zniszczoną świątynię Moradina.",
        flaws: "Zbyt ufny wobec tych, którzy noszą symbole jego wiary."
    },
    backstory: "Borin porzucił kuźnię ojca, by służyć jako kapłan wędrowny po tym, jak Moradin ocalił go z zawalonej kopalni."
}
];

var players = [];
var editingPlayerIndex = null;
var selectedAvatar = '🧙';
var selectedAvatarUrl = '';

// ====== GENEROWANIE ID ======
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
}

// ====== INICJALIZACJA DANYCH ======
function initPlayers() {
    var saved = localStorage.getItem('crux_players_data');
    if (saved) {
        try {
            var parsed = JSON.parse(saved);
            if (parsed && parsed.length > 0) {
                players = parsed;
                return;
            }
        } catch (e) {}
    }
    // Jeśli brak danych lub błąd, używamy domyślnych
    players = JSON.parse(JSON.stringify(DEFAULT_PLAYERS));
    savePlayers();
}

function savePlayers() {
    try {
        localStorage.setItem('crux_players_data', JSON.stringify(players));
    } catch (e) {}
}

// ====== STAŁE ======
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
    'Gracz': '#c9a24b',
    'Companion': '#4a7a5f',
    'Wróg': '#8a2a22',
    'NPC': '#6a5a3a'
};

var AB_LABEL = { str: 'Siła', dex: 'Zręczność', con: 'Kondycja', int: 'Inteligencja', wis: 'Mądrość', cha: 'Charyzma' };
var AB_SHORT = { str: 'SIŁ', dex: 'ZRC', con: 'KON', int: 'INT', wis: 'MDR', cha: 'CHA' };

function mod(score) { return Math.floor((score - 10) / 2); }
function fmt(n) { return n >= 0 ? '+' + n : '' + n; }

// ====== RENDER BIBLIOTEKI ======
function renderPlayers() {
    var container = document.getElementById('playerTracker');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (players.length === 0) {
        container.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:40px;color:#786c53;font-family:'Cinzel',serif;letter-spacing:0.04em;">
                <div style="font-size:3rem;margin-bottom:12px;">📜</div>
                <p style="font-size:var(--font-lg);color:#a89a7c;">Brak postaci w bibliotece</p>
                <p style="font-size:var(--font-sm);margin-top:4px;">Kliknij „Dodaj postać", aby stworzyć pierwszego bohatera</p>
            </div>
        `;
        return;
    }
    
    players.forEach(function(p, index) {
        var tile = document.createElement('button');
        tile.className = 'player-tile';
        tile.dataset.index = index;
        var roleColor = ROLE_COLORS[p.role] || '#c9a24b';
        var roleDim = roleColor + '44';
        tile.style.setProperty('--accent', roleColor);
        tile.style.setProperty('--accent-dim', roleDim);
        tile.style.animationDelay = (index * 70) + 'ms';
        
        var classIcon = CLASS_ICONS[p.class] || '⚔️';
        var initial = p.name ? p.name.charAt(0).toUpperCase() : '?';
        var avatarHtml = p.avatar && p.avatar.startsWith('http') 
            ? '<img src="' + p.avatar + '" onerror="this.parentElement.innerHTML=\'<span class=\'initial\'>' + initial + '</span>\'">' 
            : (p.avatar && p.avatar.length <= 2 ? p.avatar : '<span class="initial">' + initial + '</span>');
        
        tile.innerHTML = `
            <div class="player-tile-band">
                <div class="player-tile-avatar">${avatarHtml}</div>
                <div class="player-tile-icon">${classIcon}</div>
            </div>
            <div class="player-tile-body">
                <h3 class="player-tile-name">${p.name}</h3>
                <div class="player-tile-sub">${p.race || ''} · ${p.class || ''}</div>
                <div class="player-tile-stats">
                    <span>Poz. <b>${p.level || 1}</b></span>
                    <span>KP <b>${p.ac || 10}</b></span>
                    <span>HP <b>${p.hp || 0}/${p.maxHp || 0}</b></span>
                    <span>SZ <b>${p.speed || 30}'</b></span>
                </div>
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
    
    var overlay = document.getElementById('characterDetailOverlay');
    var content = document.getElementById('characterDetailContent');
    if (!overlay || !content) return;
    
    var roleColor = ROLE_COLORS[p.role] || '#c9a24b';
    var roleDim = roleColor + '44';
    var classIcon = CLASS_ICONS[p.class] || '⚔️';
    var initMod = mod(p.dex || 10);
    var passivePerc = p.passivePerception || 10 + (p.proficiencies && p.proficiencies.includes('Percepcja') ? mod(p.wis || 10) + (p.pb || 2) : mod(p.wis || 10));
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
    var skillsList = [
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
    
    var skillsHtml = skillsList.map(function(s) {
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
    var equipItems = [];
    if (p.weapons) equipItems.push('⚔️ ' + p.weapons);
    if (p.armor) equipItems.push('🛡️ ' + p.armor);
    if (p.items) equipItems.push('📦 ' + p.items);
    if (p.gold > 0) equipItems.push('🪙 ' + p.gold + ' sztuk złota');
    
    var equipHtml = equipItems.length > 0 
        ? '<ul>' + equipItems.map(function(e) { return '<li>' + e + '</li>'; }).join('') + '</ul>'
        : '<p style="color:#786c53;font-style:italic;">Brak ekwipunku</p>';
    
    // Cechy
    var featuresHtml = p.features && p.features.length > 0
        ? '<ul>' + p.features.map(function(f) {
            var parts = f.split(':');
            if (parts.length > 1) {
                return '<li><strong style="color:#ece3cd;">' + parts[0] + ':</strong> ' + parts.slice(1).join(':').trim() + '</li>';
            }
            return '<li>' + f + '</li>';
        }).join('') + '</ul>'
        : '<p style="color:#786c53;font-style:italic;">Brak cech</p>';
    
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
    var pers = p.personality || {};
    var personalityHtml = `
        <div class="char-quotes">
            ${pers.traits ? `<div class="char-quote"><div class="char-quote-label">Cecha charakteru</div><p>${pers.traits}</p></div>` : ''}
            ${pers.ideals ? `<div class="char-quote"><div class="char-quote-label">Ideał</div><p>${pers.ideals}</p></div>` : ''}
            ${pers.bonds ? `<div class="char-quote"><div class="char-quote-label">Więź</div><p>${pers.bonds}</p></div>` : ''}
            ${pers.flaws ? `<div class="char-quote"><div class="char-quote-label">Wada</div><p>${pers.flaws}</p></div>` : ''}
        </div>
    `;
    
    var backstoryHtml = p.backstory 
        ? '<div class="char-backstory">' + p.backstory + '</div>'
        : '<p style="color:#786c53;font-style:italic;">Brak historii</p>';
    
    // Awatar
    var initial = p.name ? p.name.charAt(0).toUpperCase() : '?';
    var avatarHtml2 = p.avatar && p.avatar.startsWith('http') 
        ? '<img src="' + p.avatar + '" onerror="this.parentElement.textContent=\'' + (p.avatar && p.avatar.length <= 2 ? p.avatar : '🧙') + '\'">' 
        : (p.avatar && p.avatar.length <= 2 ? p.avatar : '🧙');
    
    // Biegłości
    var allProfs = (p.proficiencies || []).concat(p.otherProficiencies || []);
    var profsHtml = allProfs.length > 0
        ? '<ul>' + allProfs.map(function(prof) { return '<li>' + prof + '</li>'; }).join('') + '</ul>'
        : '<p style="color:#786c53;font-style:italic;">Brak</p>';
    
    content.innerHTML = `
        <div class="char-sheet-head" style="--accent:${roleColor};--accent-dim:${roleDim};">
            <div class="char-medal" style="--accent:${roleColor};--accent-dim:${roleDim};">${avatarHtml2}</div>
            <div>
                <h2 class="char-sheet-name">${p.name}</h2>
                <div class="char-sheet-meta">${p.race || ''} · ${p.class || ''} · Poziom ${p.level || 1}</div>
                <div class="char-sheet-align">${p.alignment || 'Neutralny'}</div>
            </div>
            <div style="margin-left:auto;display:flex;gap:8px;flex-wrap:wrap;">
                <button class="char-action-btn" onclick="openEditPlayer(${index})">✎ Edytuj</button>
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
                <div class="char-content">${profsHtml}</div>
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
}

// ====== PROSTE DODAWANIE ======
function openAddPlayerModal() {
    selectedAvatar = '🧙';
    selectedAvatarUrl = '';
    
    document.getElementById('pNameSimple').value = '';
    document.getElementById('pHpSimple').value = 10;
    document.getElementById('pAcSimple').value = 10;
    document.getElementById('pRoleSimple').value = 'Gracz';
    document.getElementById('pClassSimple').value = '';
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
}

function confirmSimpleAdd() {
    var name = document.getElementById('pNameSimple').value.trim();
    var hp = parseInt(document.getElementById('pHpSimple').value) || 10;
    var ac = parseInt(document.getElementById('pAcSimple').value) || 10;
    var role = document.getElementById('pRoleSimple').value;
    var cls = document.getElementById('pClassSimple').value.trim();
    var avatar = selectedAvatarUrl || selectedAvatar || '🧙';
    
    if (!name) {
        alert('Podaj imię postaci!');
        return;
    }
    if (hp < 1) {
        alert('HP musi być większe niż 0!');
        return;
    }
    
    var newPlayer = {
        id: generateId(),
        name: name,
        role: role,
        class: cls,
        level: 1,
        hp: hp,
        maxHp: hp,
        tempHp: 0,
        ac: ac,
        speed: 30,
        passivePerception: 10,
        pb: 2,
        avatar: avatar,
        conditions: [],
        exhaustionLevel: 0,
        deathSaves: { passes: 0, fails: 0 },
        race: '',
        background: '',
        alignment: 'Neutralny',
        str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10,
        savingThrows: [],
        proficiencies: [],
        expertise: [],
        otherProficiencies: [],
        weapons: '',
        armor: '',
        items: '',
        gold: 0,
        features: [],
        spells: [],
        personality: { traits: '', ideals: '', bonds: '', flaws: '' },
        backstory: ''
    };
    
    players.push(newPlayer);
    closeAddPlayerModal();
    renderPlayers();
    savePlayers();
    if (typeof playSound === 'function') playSound('add');
}

// ====== ZAAWANSOWANA EDYCJA ======
function openEditPlayer(index) {
    var p = players[index];
    if (!p) return;
    
    editingPlayerIndex = index;
    document.getElementById('editPlayerName').textContent = p.name;
    document.getElementById('editPlayerTitle').textContent = '✎ Edytuj postać';
    
    // Podstawowe
    document.getElementById('eName').value = p.name || '';
    document.getElementById('eRole').value = p.role || 'Gracz';
    document.getElementById('eRace').value = p.race || '';
    document.getElementById('eClass').value = p.class || '';
    document.getElementById('eLevel').value = p.level || 1;
    document.getElementById('eBackground').value = p.background || '';
    document.getElementById('eAlignment').value = p.alignment || 'Neutralny';
    
    // Atrybuty
    document.getElementById('eStr').value = p.str || 10;
    document.getElementById('eDex').value = p.dex || 10;
    document.getElementById('eCon').value = p.con || 10;
    document.getElementById('eInt').value = p.int || 10;
    document.getElementById('eWis').value = p.wis || 10;
    document.getElementById('eCha').value = p.cha || 10;
    
    // Walka
    document.getElementById('eHP').value = p.hp || 0;
    document.getElementById('eMaxHP').value = p.maxHp || 10;
    document.getElementById('eTempHP').value = p.tempHp || 0;
    document.getElementById('eAC').value = p.ac || 10;
    document.getElementById('eSpeed').value = p.speed || 30;
    document.getElementById('ePassivePerception').value = p.passivePerception || 10;
    
    // Rzuty obronne
    document.querySelectorAll('.e-saving-throw').forEach(function(cb) {
        cb.checked = p.savingThrows && p.savingThrows.includes(cb.dataset.stat);
    });
    
    // Umiejętności
    document.querySelectorAll('.e-skill').forEach(function(cb) {
        cb.checked = p.proficiencies && p.proficiencies.includes(cb.dataset.skill);
    });
    
    // Inne biegłości
    document.getElementById('eOtherProfs').value = (p.otherProficiencies || []).join(', ');
    
    // Ekwipunek
    document.getElementById('eWeapons').value = p.weapons || '';
    document.getElementById('eArmor').value = p.armor || '';
    document.getElementById('eItems').value = p.items || '';
    document.getElementById('eGold').value = p.gold || 0;
    document.getElementById('eFeatures').value = (p.features || []).join('\n');
    document.getElementById('eSpells').value = (p.spells || []).join('\n');
    
    // Osobowość
    var pers = p.personality || {};
    document.getElementById('ePersonalityTrait').value = pers.traits || '';
    document.getElementById('ePersonalityIdeal').value = pers.ideals || '';
    document.getElementById('ePersonalityBond').value = pers.bonds || '';
    document.getElementById('ePersonalityFlaw').value = pers.flaws || '';
    document.getElementById('eBackstory').value = p.backstory || '';
    
    // Awatar
    if (p.avatar) {
        if (p.avatar.startsWith('http')) {
            document.getElementById('eAvatarUrl').value = p.avatar;
            document.getElementById('eAvatarPreview').innerHTML = '<img src="' + p.avatar + '" onerror="this.parentNode.textContent=\'🧙\'">';
        } else {
            document.getElementById('eAvatarPreview').textContent = p.avatar;
            document.querySelectorAll('#eAvatarGrid .avatar-btn').forEach(function(b) {
                b.classList.toggle('active', b.dataset.avatar === p.avatar);
            });
        }
    }
    
    // Reset tabów
    document.querySelectorAll('.edit-tab').forEach(function(tab, i) {
        if (i === 0) tab.classList.add('active');
        else tab.classList.remove('active');
    });
    document.querySelectorAll('.edit-tab-content').forEach(function(content, i) {
        if (i === 0) content.classList.add('active');
        else content.classList.remove('active');
    });
    
    var popup = document.getElementById('editPlayerPopup');
    if (popup) popup.style.display = 'flex';
}

function closeEditPlayerModal() {
    var popup = document.getElementById('editPlayerPopup');
    if (popup) popup.style.display = 'none';
    editingPlayerIndex = null;
}

function confirmEditPlayer() {
    if (editingPlayerIndex === null) return;
    
    var p = players[editingPlayerIndex];
    if (!p) return;
    
    var name = document.getElementById('eName').value.trim();
    if (!name) { alert('Podaj imię postaci!'); return; }
    
    // Atrybuty
    var str = parseInt(document.getElementById('eStr').value) || 10;
    var dex = parseInt(document.getElementById('eDex').value) || 10;
    var con = parseInt(document.getElementById('eCon').value) || 10;
    var int = parseInt(document.getElementById('eInt').value) || 10;
    var wis = parseInt(document.getElementById('eWis').value) || 10;
    var cha = parseInt(document.getElementById('eCha').value) || 10;
    
    // Walka
    var hp = parseInt(document.getElementById('eHP').value) || 0;
    var maxHp = parseInt(document.getElementById('eMaxHP').value) || 10;
    var tempHp = parseInt(document.getElementById('eTempHP').value) || 0;
    var ac = parseInt(document.getElementById('eAC').value) || 10;
    var speed = parseInt(document.getElementById('eSpeed').value) || 30;
    var passivePerception = parseInt(document.getElementById('ePassivePerception').value) || 10;
    var level = parseInt(document.getElementById('eLevel').value) || 1;
    
    // Rzuty obronne
    var savingThrows = [];
    document.querySelectorAll('.e-saving-throw:checked').forEach(function(cb) {
        savingThrows.push(cb.dataset.stat);
    });
    
    // Umiejętności
    var proficiencies = [];
    document.querySelectorAll('.e-skill:checked').forEach(function(cb) {
        proficiencies.push(cb.dataset.skill);
    });
    
    // Inne biegłości
    var otherProfs = document.getElementById('eOtherProfs').value.split(',').map(function(s) { return s.trim(); }).filter(Boolean);
    
    // Ekwipunek
    var weapons = document.getElementById('eWeapons').value.trim();
    var armor = document.getElementById('eArmor').value.trim();
    var items = document.getElementById('eItems').value.trim();
    var gold = parseInt(document.getElementById('eGold').value) || 0;
    
    var features = document.getElementById('eFeatures').value.split('\n').map(function(s) { return s.trim(); }).filter(Boolean);
    var spells = document.getElementById('eSpells').value.split('\n').map(function(s) { return s.trim(); }).filter(Boolean);
    
    // Osobowość
    var personality = {
        traits: document.getElementById('ePersonalityTrait').value.trim(),
        ideals: document.getElementById('ePersonalityIdeal').value.trim(),
        bonds: document.getElementById('ePersonalityBond').value.trim(),
        flaws: document.getElementById('ePersonalityFlaw').value.trim()
    };
    
    var backstory = document.getElementById('eBackstory').value.trim();
    
    // Awatar
    var avatarUrl = document.getElementById('eAvatarUrl').value.trim();
    var avatar = avatarUrl || document.getElementById('eAvatarPreview').textContent || '🧙';
    
    // Aktualizuj
    p.name = name;
    p.role = document.getElementById('eRole').value;
    p.race = document.getElementById('eRace').value.trim();
    p.class = document.getElementById('eClass').value.trim();
    p.level = level;
    p.background = document.getElementById('eBackground').value.trim();
    p.alignment = document.getElementById('eAlignment').value;
    
    p.str = str; p.dex = dex; p.con = con; p.int = int; p.wis = wis; p.cha = cha;
    p.hp = hp;
    p.maxHp = maxHp;
    p.tempHp = tempHp;
    p.ac = ac;
    p.speed = speed;
    p.passivePerception = passivePerception;
    p.pb = Math.floor((level + 7) / 4);
    
    p.savingThrows = savingThrows;
    p.proficiencies = proficiencies;
    p.otherProficiencies = otherProfs;
    
    p.weapons = weapons;
    p.armor = armor;
    p.items = items;
    p.gold = gold;
    p.features = features;
    p.spells = spells;
    
    p.personality = personality;
    p.backstory = backstory;
    p.avatar = avatar;
    
    closeEditPlayerModal();
    renderPlayers();
    savePlayers();
    if (typeof playSound === 'function') playSound('add');
}

// ====== USUWANIE ======
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
        savePlayers();
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
    savePlayers();
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
    savePlayers();
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
        savePlayers();
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
    savePlayers();
}

// ====== AVATAR PICKER ======
function initAvatarPickers() {
    var avatars = ['🧙', '🧝', '🧛', '🧟', '🧞', '🧜', '🦹', '🦸', '🥷', '🧚', '👑', '🐉', '🐺', '🦅', '🐻', '🦁', '🗡️', '🛡️', '⚔️', '🏹', '🪄', '💀', '👹', '👻'];
    
    var grid1 = document.getElementById('avatarGrid');
    if (grid1) {
        grid1.innerHTML = '';
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
                document.getElementById('avatarUrl').value = '';
                updateAvatarPreview();
            });
            grid1.appendChild(btn);
        });
    }
    
    var grid2 = document.getElementById('eAvatarGrid');
    if (grid2) {
        grid2.innerHTML = '';
        avatars.forEach(function(a) {
            var btn = document.createElement('button');
            btn.className = 'avatar-btn' + (a === '🧙' ? ' active' : '');
            btn.dataset.avatar = a;
            btn.textContent = a;
            btn.addEventListener('click', function() {
                document.querySelectorAll('#eAvatarGrid .avatar-btn').forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');
                document.getElementById('eAvatarPreview').textContent = a;
                document.getElementById('eAvatarUrl').value = '';
            });
            grid2.appendChild(btn);
        });
    }
    
    var urlInput1 = document.getElementById('avatarUrl');
    if (urlInput1) {
        urlInput1.addEventListener('input', function() {
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
    
    var urlInput2 = document.getElementById('eAvatarUrl');
    if (urlInput2) {
        urlInput2.addEventListener('input', function() {
            var url = this.value.trim();
            var preview = document.getElementById('eAvatarPreview');
            if (url) {
                preview.innerHTML = '<img src="' + url + '" onerror="this.parentNode.textContent=\'🧙\'">';
                document.querySelectorAll('#eAvatarGrid .avatar-btn').forEach(function(b) { b.classList.remove('active'); });
            } else {
                preview.textContent = '🧙';
            }
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

// ====== ZAKŁADKI EDYCJI ======
function initEditTabs() {
    document.querySelectorAll('.edit-tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
            var target = this.dataset.tab;
            document.querySelectorAll('.edit-tab').forEach(function(t) { t.classList.remove('active'); });
            this.classList.add('active');
            document.querySelectorAll('.edit-tab-content').forEach(function(c) {
                c.classList.toggle('active', c.dataset.tab === target);
            });
        });
    });
}

// ====== EKSPORT ======
window.players = players;
window.renderPlayers = renderPlayers;
window.openCharacterDetail = openCharacterDetail;
window.closeCharacterDetail = closeCharacterDetail;
window.openEditPlayer = openEditPlayer;
window.closeEditPlayerModal = closeEditPlayerModal;
window.confirmEditPlayer = confirmEditPlayer;
window.openAddPlayerModal = openAddPlayerModal;
window.closeAddPlayerModal = closeAddPlayerModal;
window.confirmSimpleAdd = confirmSimpleAdd;
window.removePlayer = removePlayer;
window.addPlayerToInitiative = addPlayerToInitiative;
window.shortRestPlayer = shortRestPlayer;
window.longRestPlayer = longRestPlayer;
window.showPlayerCondPopup = showPlayerCondPopup;
window.syncToCombat = syncToCombat;
window.initAvatarPickers = initAvatarPickers;
window.initEditTabs = initEditTabs;
window.initPlayers = initPlayers;

// ====== INICJALIZACJA ======
initPlayers();