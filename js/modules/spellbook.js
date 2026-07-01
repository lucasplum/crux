// ============================================================
//  SPELLBOOK - STYL ARKANA WĘDROWCA
// ============================================================

var spellCache = {};
var allSpells = [];
var isLoading = false;

var SCHOOL_ICONS = {
    'wywoływanie': '✦',
    'przywoływanie': '⬡',
    'wieszczenie': '◈',
    'nekromancja': '✧',
    'uroki': '♥',
    'iluzje': '◐',
    'odpychanie': '⊜',
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

function loadSpellLevel(level, callback) {
    if (spellCache[level]) {
        if (callback) callback(spellCache[level]);
        return;
    }
    var url = 'data/spells/level-' + level + '.json';
    fetch(url)
        .then(function(response) {
            if (!response.ok) throw new Error('Nie znaleziono pliku: ' + url);
            return response.json();
        })
        .then(function(data) {
            spellCache[level] = data;
            if (callback) callback(data);
        })
        .catch(function(error) {
            console.error('Błąd ładowania zaklęć poziomu ' + level + ':', error);
            if (callback) callback([]);
        });
}

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
                if (callback) callback(allSpells);
            }
        });
    });
}

function getLevelText(level) {
    if (level === 0) return 'Cantrip';
    var roman = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
    return 'KRĄG ' + roman[level];
}

function renderSpellbook(filter, levelFilter, schoolFilter, classFilter, sortBy) {
    filter = filter || '';
    levelFilter = levelFilter || 'all';
    schoolFilter = schoolFilter || 'all';
    classFilter = classFilter || 'all';
    sortBy = sortBy || 'level';
    
    var container = document.getElementById('spellbookList');
    if (!container) return;
    
    container.innerHTML = '<div style="color:var(--dim);text-align:center;padding:40px;font-family:\'Cinzel\',serif;">⏳ Ładowanie księgi zaklęć...</div>';
    
    loadAllSpells(function(spells) {
        var filtered = spells;
        
        if (levelFilter !== 'all') {
            filtered = filtered.filter(function(s) { return s.level === parseInt(levelFilter); });
        }
        
        if (schoolFilter !== 'all') {
            filtered = filtered.filter(function(s) { return s.school === schoolFilter; });
        }
        
        if (classFilter !== 'all' && classFilter !== '') {
            filtered = filtered.filter(function(s) {
                return s.classes && s.classes.indexOf(classFilter) !== -1;
            });
        }
        
        if (filter) {
            var f = filter.toLowerCase();
            filtered = filtered.filter(function(s) {
                return s.name_pl.toLowerCase().includes(f) ||
                       s.name_en.toLowerCase().includes(f) ||
                       s.desc_pl.toLowerCase().includes(f) ||
                       s.desc_en.toLowerCase().includes(f);
            });
        }
        
        if (sortBy === 'level') {
            filtered.sort(function(a, b) {
                if (a.level !== b.level) return a.level - b.level;
                return a.name_pl.localeCompare(b.name_pl);
            });
        } else if (sortBy === 'name') {
            filtered.sort(function(a, b) {
                return a.name_pl.localeCompare(b.name_pl);
            });
        }
        
        container.innerHTML = '';
        
        if (filtered.length === 0) {
            container.innerHTML = '<div style="color:var(--dim);text-align:center;padding:40px;font-family:\'Cinzel\',serif;">📖 Brak zaklęć spełniających kryteria</div>';
            return;
        }
        
        filtered.forEach(function(spell) {
            var div = document.createElement('div');
            div.className = 'spellbook-card';
            
            var schoolName = SCHOOL_NAMES[spell.school] || spell.school;
            var schoolIcon = SCHOOL_ICONS[spell.school] || '✦';
            var color = SCHOOL_COLORS[spell.school] || '#c9a24b';
            var levelText = getLevelText(spell.level);
            
            // Damage type detection
            var damageType = '';
            var damageIcon = '';
            var desc = (spell.desc_pl || '').toLowerCase();
            if (desc.includes('ogni')) { damageType = 'fire'; damageIcon = '🔥'; }
            else if (desc.includes('zimn')) { damageType = 'cold'; damageIcon = '❄️'; }
            else if (desc.includes('nekro')) { damageType = 'necro'; damageIcon = '💀'; }
            else if (desc.includes('kwas')) { damageType = 'acid'; damageIcon = '🧪'; }
            else if (desc.includes('elektry')) { damageType = 'lightning'; damageIcon = '⚡'; }
            else if (desc.includes('promieni')) { damageType = 'radiant'; damageIcon = '☀️'; }
            else if (desc.includes('trucizn')) { damageType = 'poison'; damageIcon = '☠️'; }
            else if (desc.includes('psych')) { damageType = 'psychic'; damageIcon = '🧠'; }
            
            var damageHtml = damageType ? 
                `<div class="spellbook-damage damage-${damageType}">${damageIcon} ${spell.desc_pl ? spell.desc_pl.split('.')[0] : ''}</div>` : '';
            
            var classesHtml = spell.classes ? 
                spell.classes.slice(0, 3).map(function(c) { 
                    return `<span class="spellbook-class">${c}</span>`; 
                }).join('') : '';
            
            div.style.setProperty('--accent', color);
            div.dataset.school = spell.school;
            
            div.innerHTML = `
                <div class="spellbook-school">${schoolIcon} ${schoolName}</div>
                <div class="spellbook-name">${spell.name_pl}</div>
                <div class="spellbook-en">${spell.name_en}</div>
                <div class="spellbook-circle">${levelText}</div>
                ${damageHtml}
                <div class="spellbook-info">
                    <div>⏱ ${spell.casting}</div>
                    <div>📏 ${spell.range}</div>
                    <div>⌛ ${spell.duration}</div>
                    ${classesHtml ? `<div>👥 ${classesHtml}</div>` : ''}
                </div>
            `;
            
            div.addEventListener('click', function() {
                openSpellDetail(spell);
            });
            
            container.appendChild(div);
        });
    });
}

// ====== SZCZEGÓŁY ZAKLĘCIA ======
function openSpellDetail(spell) {
    var overlay = document.getElementById('spellDetailOverlay');
    if (!overlay) return;
    
    var schoolName = SCHOOL_NAMES[spell.school] || spell.school;
    var schoolIcon = SCHOOL_ICONS[spell.school] || '✦';
    var color = SCHOOL_COLORS[spell.school] || '#c9a24b';
    var levelText = getLevelText(spell.level);
    
    // Damage detection
    var desc = (spell.desc_pl || '').toLowerCase();
    var damageType = '';
    var damageIcon = '';
    if (desc.includes('ogni')) { damageType = 'Fire'; damageIcon = '🔥'; }
    else if (desc.includes('zimn')) { damageType = 'Cold'; damageIcon = '❄️'; }
    else if (desc.includes('nekro')) { damageType = 'Necrotic'; damageIcon = '💀'; }
    else if (desc.includes('kwas')) { damageType = 'Acid'; damageIcon = '🧪'; }
    else if (desc.includes('elektry')) { damageType = 'Lightning'; damageIcon = '⚡'; }
    else if (desc.includes('promieni')) { damageType = 'Radiant'; damageIcon = '☀️'; }
    else if (desc.includes('trucizn')) { damageType = 'Poison'; damageIcon = '☠️'; }
    else if (desc.includes('psych')) { damageType = 'Psychic'; damageIcon = '🧠'; }
    
    var damageDisplay = damageType ? `${damageIcon} ${damageType}` : '—';
    
    // Components
    var components = spell.components || '';
    var compDisplay = components.replace(/V/g, 'V').replace(/S/g, 'S').replace(/M/g, 'M');
    
    var classesHtml = spell.classes ? 
        spell.classes.map(function(c) { 
            return `<span class="tag">${c}</span>`; 
        }).join('') : '<span class="tag">—</span>';
    
    var tags = [];
    if (damageType) tags.push('Damage');
    if (damageType) tags.push(damageType);
    if (spell.duration && spell.duration.includes('koncentracja')) tags.push('Concentration');
    if (spell.range && spell.range.includes('ft')) tags.push('Ranged');
    if (spell.desc_pl && spell.desc_pl.toLowerCase().includes('leczy')) tags.push('Healing');
    if (spell.desc_pl && spell.desc_pl.toLowerCase().includes('buff')) tags.push('Buff');
    if (spell.desc_pl && spell.desc_pl.toLowerCase().includes('debuff')) tags.push('Debuff');
    if (spell.desc_pl && spell.desc_pl.toLowerCase().includes('kontrol')) tags.push('Control');
    if (spell.desc_pl && spell.desc_pl.toLowerCase().includes('przyzywa')) tags.push('Summon');
    if (tags.length === 0) tags.push('Utility');
    
    var tagsHtml = tags.map(function(t) { 
        return `<span class="tag">${t}</span>`; 
    }).join('');
    
    var content = document.getElementById('spellDetailContent');
    if (!content) return;
    
    content.innerHTML = `
        <div class="spell-detail-head" style="--accent:${color};">
            <div>
                <div class="spell-detail-school">${schoolIcon} ${schoolName}</div>
                <div class="spell-detail-name">${spell.name_pl}</div>
                <div class="spell-detail-en">${spell.name_en}</div>
            </div>
            <div class="spell-detail-circle">${levelText}</div>
        </div>
        
        <div class="spell-detail-badges">
            <div class="spell-detail-badge">${schoolIcon} ${schoolName}</div>
            <div class="spell-detail-badge">${levelText}</div>
            ${damageType ? `<div class="spell-detail-badge damage-${damageType.toLowerCase()}">${damageIcon} ${damageType}</div>` : ''}
            <div class="spell-detail-badge">${spell.source || 'PHB'}</div>
        </div>
        
        <div class="spell-detail-stats">
            <div class="spell-detail-stat">
                <div class="spell-detail-stat-label">⏱ Casting Time</div>
                <div class="spell-detail-stat-value">${spell.casting}</div>
            </div>
            <div class="spell-detail-stat">
                <div class="spell-detail-stat-label">📏 Range / Area</div>
                <div class="spell-detail-stat-value">${spell.range}</div>
            </div>
            <div class="spell-detail-stat">
                <div class="spell-detail-stat-label">🔮 Components</div>
                <div class="spell-detail-stat-value">${compDisplay}</div>
            </div>
            <div class="spell-detail-stat">
                <div class="spell-detail-stat-label">⌛ Duration</div>
                <div class="spell-detail-stat-value">${spell.duration}</div>
            </div>
            <div class="spell-detail-stat">
                <div class="spell-detail-stat-label">💥 Damage / Effect</div>
                <div class="spell-detail-stat-value">${damageDisplay}</div>
            </div>
            <div class="spell-detail-stat">
                <div class="spell-detail-stat-label">👥 Classes</div>
                <div class="spell-detail-stat-value">${classesHtml}</div>
            </div>
            <div class="spell-detail-stat">
                <div class="spell-detail-stat-label">📚 Source</div>
                <div class="spell-detail-stat-value">${spell.source || 'Player\'s Handbook'}</div>
            </div>
            <div class="spell-detail-stat">
                <div class="spell-detail-stat-label">🏷️ Tags</div>
                <div class="spell-detail-stat-value">${tagsHtml}</div>
            </div>
        </div>
        
        <div class="spell-detail-section">
            <h3>Opis</h3>
            <p>${spell.desc_pl || 'Brak opisu'}</p>
        </div>
        
        <div class="spell-detail-section">
            <h3>Description</h3>
            <p>${spell.desc_en || 'No description'}</p>
        </div>
        
        <div class="spell-detail-section">
            <h3>Przy wyższych kręgach</h3>
            <p>${spell.desc_pl && spell.desc_pl.includes('Wyższe poziomy') ? spell.desc_pl.split('Wyższe poziomy')[1] || '—' : '—'}</p>
        </div>
        
        <div class="spell-detail-close" onclick="closeSpellDetail()">✕ Zamknij</div>
    `;
    
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeSpellDetail() {
    var overlay = document.getElementById('spellDetailOverlay');
    if (overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// ====== FILTRY ======
document.addEventListener('DOMContentLoaded', function() {
    var searchInput = document.getElementById('spellbookSearch');
    var levelSelect = document.getElementById('spellbookLevel');
    var schoolSelect = document.getElementById('spellbookSchool');
    var classSelect = document.getElementById('spellbookClass');
    var sortSelect = document.getElementById('spellbookSort');
    
    function getSortValue() {
        return sortSelect ? sortSelect.value : 'level';
    }
    
    function updateSpellbook() {
        renderSpellbook(
            searchInput ? searchInput.value : '',
            levelSelect ? levelSelect.value : 'all',
            schoolSelect ? schoolSelect.value : 'all',
            classSelect ? classSelect.value : 'all',
            getSortValue()
        );
    }
    
    if (searchInput) searchInput.addEventListener('input', updateSpellbook);
    if (levelSelect) levelSelect.addEventListener('change', updateSpellbook);
    if (schoolSelect) schoolSelect.addEventListener('change', updateSpellbook);
    if (classSelect) classSelect.addEventListener('change', updateSpellbook);
    if (sortSelect) sortSelect.addEventListener('change', updateSpellbook);
    
    // Close on overlay click
    var overlay = document.getElementById('spellDetailOverlay');
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) closeSpellDetail();
        });
    }
    
    // Close on ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeSpellDetail();
    });
    
    renderSpellbook('', 'all', 'all', 'all', 'level');
});

// ====== EKSPORT ======
window.renderSpellbook = renderSpellbook;
window.openSpellDetail = openSpellDetail;
window.closeSpellDetail = closeSpellDetail;
window.loadAllSpells = loadAllSpells;
window.SCHOOL_NAMES = SCHOOL_NAMES;
window.SCHOOL_ICONS = SCHOOL_ICONS;
window.SCHOOL_COLORS = SCHOOL_COLORS;
window.getLevelText = getLevelText;