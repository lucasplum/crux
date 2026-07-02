// ============================================================
//  GRIMUAR ZAKLĘĆ - OSOBNA PODSTRONA
// ============================================================
var spellCache = {};
var allSpells = [];
var isLoading = false;

// ====== IKONY I NAZWY SZKÓŁ ======
var SCHOOL_ICONS = {
    'wywoływanie': '✦',
    'przywoływanie': '⬡',
    'wieszczenie': '◈',
    'nekromancja': '✧',
    'uroki': '♥',
    'iluzje': '◐',
    'odpychanie': '',
    'przemiany': '◈'
};

var SCHOOL_NAMES = {
    'wywoływanie': 'Ewokacja',
    'przywoływanie': 'Przywoływanie',
    'wieszczenie': 'Wieszczenie',
    'nekromancja': 'Nekromancja',
    'uroki': 'Uroki',
    'iluzje': 'Iluzja',
    'odpychanie': 'Ochrona',
    'przemiany': 'Przemiany'
};

var SCHOOL_COLORS = {
    'wywoływanie': '#d88737',
    'przywoływanie': '#6bff9e',
    'wieszczenie': '#6bb8ff',
    'nekromancja': '#b84a8f',
    'uroki': '#ff6bc4',
    'iluzje': '#a87cff',
    'odpychanie': '#d4a843',
    'przemiany': '#4ac0b0'
};

// ====== CZYSZCZENIE DANYCH Z JSON (usuwa spacje) ======
function cleanSpell(spell) {
    if (!spell || typeof spell !== 'object') return spell;
    var clean = {};
    for (var key in spell) {
        var k = (typeof key === 'string') ? key.trim() : key;
        var v = spell[key];
        if (typeof v === 'string') v = v.trim();
        else if (Array.isArray(v)) {
            v = v.map(function(item) { return typeof item === 'string' ? item.trim() : item; });
        }
        clean[k] = v;
    }
    return clean;
}

// ====== ŁADOWANIE POZIOMU ZAKLĘĆ ======
function loadSpellLevel(level, callback) {
    if (spellCache[level]) {
        if (callback) callback(spellCache[level]);
        return;
    }

    var urls = [
        'data/spells/level-' + level + '.json',
        'level-' + level + '.json',
        '../data/spells/level-' + level + '.json'
    ];

    tryLoadUrls(urls, 0, function(data) {
        if (Array.isArray(data)) {
            data = data.map(cleanSpell);
        } else {
            data = [];
        }
        spellCache[level] = data;
        if (callback) callback(data);
    });
}

function tryLoadUrls(urls, idx, callback) {
    if (idx >= urls.length) {
        callback(null);
        return;
    }

    fetch(urls[idx])
        .then(function(response) {
            if (!response.ok) throw new Error('Not found: ' + urls[idx]);
            return response.json();
        })
        .then(function(data) {
            callback(data);
        })
        .catch(function() {
            tryLoadUrls(urls, idx + 1, callback);
        });
}

// ====== ŁADOWANIE WSZYSTKICH ZAKLĘĆ ======
function loadAllSpells(callback) {
    if (allSpells.length > 0) {
        if (callback) callback(allSpells);
        return;
    }

    if (isLoading) {
        setTimeout(function() { loadAllSpells(callback); }, 100);
        return;
    }

    isLoading = true;
    var levels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    var loaded = 0;
    var total = levels.length;
    var results = [];

    levels.forEach(function(level) {
        loadSpellLevel(level, function(data) {
            results = results.concat(data || []);
            loaded++;
            if (loaded === total) {
                allSpells = results;
                isLoading = false;
                console.log('📖 Załadowano zaklęć:', allSpells.length);
                if (callback) callback(allSpells);
            }
        });
    });
}

// ====== TEKST KRĘGU (rzymski) ======
function getLevelText(level) {
    if (level === 0) return 'Cantrip';
    var roman = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
    return 'KRĄG ' + roman[level];
}

// ====== DETEKCJA TYPU OBRAŻEŃ ======
function detectDamageType(desc) {
    if (!desc) return { type: '', icon: '' };
    var d = desc.toLowerCase();
    
    if (d.includes('ogni') || d.includes('fire')) return { type: 'fire', icon: '🔥' };
    if (d.includes('zimn') || d.includes('cold')) return { type: 'cold', icon: '❄️' };
    if (d.includes('nekro')) return { type: 'necro', icon: '💀' };
    if (d.includes('kwas') || d.includes('acid')) return { type: 'acid', icon: '🧪' };
    if (d.includes('elektry') || d.includes('lightning')) return { type: 'lightning', icon: '' };
    if (d.includes('promieni') || d.includes('radiant')) return { type: 'radiant', icon: '☀️' };
    if (d.includes('trucizn') || d.includes('poison')) return { type: 'poison', icon: '☠️' };
    if (d.includes('psych')) return { type: 'psychic', icon: '🧠' };
    
    return { type: '', icon: '' };
}

// ====== FILTROWANIE ZAKLĘĆ ======
function filterSpells(level, school, classFilter, callback) {
    loadAllSpells(function(spells) {
        var results = spells;

        if (level !== 'all' && level !== undefined && level !== '') {
            results = results.filter(function(s) { return s.level === parseInt(level); });
        }

        if (school !== 'all' && school !== undefined && school !== '') {
            var schoolKey = school;
            results = results.filter(function(s) {
                return (s.school || '').toLowerCase() === schoolKey.toLowerCase();
            });
        }

        if (classFilter && classFilter !== 'all' && classFilter !== '') {
            results = results.filter(function(s) {
                return s.classes && s.classes.indexOf(classFilter) !== -1;
            });
        }

        if (callback) callback(results);
    });
}

// ====== RENDER GRIMUARU ======
function renderGrimuar(filter, levelFilter, schoolFilter, classFilter, sortBy) {
    filter = filter || '';
    levelFilter = levelFilter || 'all';
    schoolFilter = schoolFilter || 'all';
    classFilter = classFilter || 'all';
    sortBy = sortBy || 'level';

    var container = document.getElementById('grimuarList');
    if (!container) return;

    container.innerHTML = '<div class="grimuar-loading"><div class="loading-raven">🐦⬛</div><p>Ładowanie grimuaru...</p></div>';

    filterSpells(levelFilter, schoolFilter, classFilter, function(spells) {
        var filtered = spells;

        // Filtrowanie tekstowe
        if (filter) {
            var f = filter.toLowerCase();
            filtered = filtered.filter(function(s) {
                return (s.name_pl || '').toLowerCase().includes(f) ||
                       (s.name_en || '').toLowerCase().includes(f) ||
                       (s.desc_pl || '').toLowerCase().includes(f);
            });
        }

        // Sortowanie
        if (sortBy === 'level') {
            filtered.sort(function(a, b) {
                if (a.level !== b.level) return a.level - b.level;
                return (a.name_pl || '').localeCompare(b.name_pl || '');
            });
        } else {
            filtered.sort(function(a, b) {
                return (a.name_pl || '').localeCompare(b.name_pl || '');
            });
        }

        container.innerHTML = '';

        if (filtered.length === 0) {
            container.innerHTML = '<div class="grimuar-empty">📖 Brak zaklęć spełniających kryteria</div>';
            return;
        }

        console.log('Wyświetlam zaklęć:', filtered.length);

        filtered.forEach(function(spell, index) {
            var card = document.createElement('div');
            card.className = 'grimuar-card';
            
            var schoolName = SCHOOL_NAMES[spell.school] || spell.school || 'Nieznana';
            var schoolIcon = SCHOOL_ICONS[spell.school] || '✦';
            var color = SCHOOL_COLORS[spell.school] || '#c9a24b';
            var levelText = getLevelText(spell.level);
            var dmg = detectDamageType(spell.desc_pl);

            card.style.setProperty('--accent', color);
            card.dataset.school = spell.school || '';
            card.style.animationDelay = (index * 50) + 'ms';

            var classesHtml = spell.classes ? 
                spell.classes.slice(0, 3).map(function(c) {
                    return '<span class="grimuar-class">' + c + '</span>';
                }).join('') : '';

            var damageHtml = dmg.type ?
                '<div class="grimuar-damage damage-' + dmg.type + '">' + 
                dmg.icon + ' ' + (spell.desc_pl || '').split('.')[0].substring(0, 80) + 
                (spell.desc_pl.length > 80 ? '...' : '') + 
                '</div>' : '';

            card.innerHTML = 
                '<div class="grimuar-school">' + schoolIcon + ' ' + schoolName + '</div>' +
                '<div class="grimuar-name">' + (spell.name_pl || spell.name_en || '?') + '</div>' +
                '<div class="grimuar-en">' + (spell.name_en || '') + '</div>' +
                '<div class="grimuar-circle">' + levelText + '</div>' +
                damageHtml +
                '<div class="grimuar-info">' +
                    '<div>⏱ ' + (spell.casting || '—') + '</div>' +
                    '<div>📏 ' + (spell.range || '—') + '</div>' +
                    '<div> ' + (spell.duration || '—') + '</div>' +
                    (classesHtml ? '<div>👥 ' + classesHtml + '</div>' : '') +
                '</div>';

            card.addEventListener('click', function() {
                openSpellDetail(spell);
            });

            container.appendChild(card);
        });
    });
}

// ====== SZCZEGÓŁY ZAKLĘCIA ======
function openSpellDetail(spell) {
    var overlay = document.getElementById('spellDetailOverlay');
    var content = document.getElementById('spellDetailContent');
    if (!overlay || !content) return;

    var schoolName = SCHOOL_NAMES[spell.school] || spell.school;
    var schoolIcon = SCHOOL_ICONS[spell.school] || '✦';
    var color = SCHOOL_COLORS[spell.school] || '#c9a24b';
    var levelText = getLevelText(spell.level);
    var dmg = detectDamageType(spell.desc_pl);
    var damageDisplay = dmg.type ? (dmg.icon + ' ' + dmg.type.charAt(0).toUpperCase() + dmg.type.slice(1)) : '—';

    var classesHtml = spell.classes ?
        spell.classes.map(function(c) { return '<span class="tag">' + c + '</span>'; }).join('') :
        '<span class="tag">—</span>';

    var tags = [];
    if (dmg.type) tags.push(dmg.type.charAt(0).toUpperCase() + dmg.type.slice(1));
    if (spell.duration && spell.duration.toLowerCase().includes('koncentracja')) tags.push('Koncentracja');
    if (spell.range && spell.range.includes('ft')) tags.push('Dystansowy');
    if (spell.desc_pl && spell.desc_pl.toLowerCase().includes('leczy')) tags.push('Leczenie');
    if (tags.length === 0) tags.push('Utility');

    var tagsHtml = tags.map(function(t) { return '<span class="tag">' + t + '</span>'; }).join('');

    content.innerHTML =
        '<div class="spell-detail-head" style="--accent:' + color + ';">' +
            '<div>' +
                '<div class="spell-detail-school">' + schoolIcon + ' ' + schoolName + '</div>' +
                '<div class="spell-detail-name">' + (spell.name_pl || '?') + '</div>' +
                '<div class="spell-detail-en">' + (spell.name_en || '') + '</div>' +
            '</div>' +
            '<div class="spell-detail-circle">' + levelText + '</div>' +
        '</div>' +

        '<div class="spell-detail-badges">' +
            '<div class="spell-detail-badge">' + schoolIcon + ' ' + schoolName + '</div>' +
            '<div class="spell-detail-badge">' + levelText + '</div>' +
            (dmg.type ? '<div class="spell-detail-badge damage-' + dmg.type + '">' + dmg.icon + ' ' + dmg.type + '</div>' : '') +
            '<div class="spell-detail-badge">' + (spell.source || 'PHB') + '</div>' +
        '</div>' +

        '<div class="spell-detail-stats">' +
            '<div class="spell-detail-stat"><div class="spell-detail-stat-label"> Casting Time</div><div class="spell-detail-stat-value">' + (spell.casting || '—') + '</div></div>' +
            '<div class="spell-detail-stat"><div class="spell-detail-stat-label">📏 Range / Area</div><div class="spell-detail-stat-value">' + (spell.range || '—') + '</div></div>' +
            '<div class="spell-detail-stat"><div class="spell-detail-stat-label">🔮 Components</div><div class="spell-detail-stat-value">' + (spell.components || '—') + '</div></div>' +
            '<div class="spell-detail-stat"><div class="spell-detail-stat-label">⌛ Duration</div><div class="spell-detail-stat-value">' + (spell.duration || '—') + '</div></div>' +
            '<div class="spell-detail-stat"><div class="spell-detail-stat-label">💥 Damage / Effect</div><div class="spell-detail-stat-value">' + damageDisplay + '</div></div>' +
            '<div class="spell-detail-stat"><div class="spell-detail-stat-label"> Classes</div><div class="spell-detail-stat-value">' + classesHtml + '</div></div>' +
            '<div class="spell-detail-stat"><div class="spell-detail-stat-label">📚 Source</div><div class="spell-detail-stat-value">' + (spell.source || "Player's Handbook") + '</div></div>' +
            '<div class="spell-detail-stat"><div class="spell-detail-stat-label">🏷️ Tags</div><div class="spell-detail-stat-value">' + tagsHtml + '</div></div>' +
        '</div>' +

        '<div class="spell-detail-section"><h3>Opis</h3><p>' + (spell.desc_pl || 'Brak opisu') + '</p></div>' +
        '<div class="spell-detail-section"><h3>Description</h3><p>' + (spell.desc_en || 'No description') + '</p></div>' +

        '<div class="spell-detail-close" onclick="closeSpellDetail()">✕ Zamknij</div>';

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    if (typeof playSound === 'function') playSound('add');
}

function closeSpellDetail() {
    var overlay = document.getElementById('spellDetailOverlay');
    if (overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// ====== INICJALIZACJA ======
document.addEventListener('DOMContentLoaded', function() {
    var searchInput = document.getElementById('grimuarSearch');
    var levelSelect = document.getElementById('grimuarLevel');
    var schoolSelect = document.getElementById('grimuarSchool');
    var classSelect = document.getElementById('grimuarClass');
    var sortSelect = document.getElementById('grimuarSort');

    function getSortValue() { return sortSelect ? sortSelect.value : 'level'; }

    function updateGrimuar() {
        renderGrimuar(
            searchInput ? searchInput.value : '',
            levelSelect ? levelSelect.value : 'all',
            schoolSelect ? schoolSelect.value : 'all',
            classSelect ? classSelect.value : 'all',
            getSortValue()
        );
    }

    if (searchInput) searchInput.addEventListener('input', updateGrimuar);
    if (levelSelect) levelSelect.addEventListener('change', updateGrimuar);
    if (schoolSelect) schoolSelect.addEventListener('change', updateGrimuar);
    if (classSelect) classSelect.addEventListener('change', updateGrimuar);
    if (sortSelect) sortSelect.addEventListener('change', updateGrimuar);

    // Zamknij szczegóły na klik overlay / ESC
    var overlay = document.getElementById('spellDetailOverlay');
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) closeSpellDetail();
        });
    }
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeSpellDetail();
    });

    // Pierwsze ładowanie
    renderGrimuar('', 'all', 'all', 'all', 'level');
});

// ====== EKSPORT ======
window.renderGrimuar = renderGrimuar;
window.openSpellDetail = openSpellDetail;
window.closeSpellDetail = closeSpellDetail;
window.loadAllSpells = loadAllSpells;
window.SCHOOL_NAMES = SCHOOL_NAMES;
window.SCHOOL_ICONS = SCHOOL_ICONS;
window.SCHOOL_COLORS = SCHOOL_COLORS;
window.getLevelText = getLevelText;
window.detectDamageType = detectDamageType;