// ============================================================
//  MONSTERS - BESTIARIUSZ Z CICHYM POMIJANIEM BRAKUJĄCYCH PLIKÓW
// ============================================================

var MONSTERS = [];
var currentMonsterFilter = 'all';
var selectedMonster = null;
var monsterCache = {};
var monsterLoading = false;

// ====== OBSŁUGA BŁĘDU OBRAZKA ======
function handleImageError(img) {
    if (!img || !img.parentElement) return;
    var parent = img.parentElement;
    img.style.display = 'none';
    parent.innerHTML = '🐉';
    parent.classList.add('monster-card-image-placeholder');
}

// ====== ŁADOWANIE Z JSON ======
function loadMonsterCR(cr, callback) {
    if (monsterCache[cr]) {
        if (callback) callback(monsterCache[cr]);
        return;
    }
    var urls = [
        'data/monsters/cr-' + cr + '.json',
        'cr-' + cr + '.json',
        '../data/monsters/cr-' + cr + '.json'
    ];
    tryLoadMonsterUrls(urls, 0, cr, callback);
}

function tryLoadMonsterUrls(urls, idx, cr, callback) {
    if (idx >= urls.length) {
        monsterCache[cr] = [];
        if (callback) callback([]);
        return;
    }
    fetch(urls[idx])
        .then(function(r) {
            if (!r.ok) throw new Error('Brak pliku: ' + urls[idx]);
            return r.json();
        })
        .then(function(data) {
            monsterCache[cr] = data;
            if (callback) callback(data);
        })
        .catch(function(err) {
            if (idx === 0) console.warn('⚠️ Brak pliku potworów CR ' + cr + ' – pomijam');
            tryLoadMonsterUrls(urls, idx + 1, cr, callback);
        });
}

function loadAllMonsters(callback) {
    if (MONSTERS.length > 0) {
        if (callback) callback(MONSTERS);
        return;
    }
    if (monsterLoading) {
        setTimeout(function() { loadAllMonsters(callback); }, 100);
        return;
    }
    monsterLoading = true;
    var crs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
    var loaded = 0;
    var results = [];
    
    crs.forEach(function(cr) {
        loadMonsterCR(cr, function(data) {
            if (data && data.length > 0) {
                results = results.concat(data);
            }
            loaded++;
            if (loaded === crs.length) {
                var unique = [];
                var seen = {};
                results.forEach(function(m) {
                    var key = m.name.toLowerCase().trim();
                    if (!seen[key]) {
                        seen[key] = true;
                        unique.push(m);
                    }
                });
                MONSTERS = unique;
                monsterLoading = false;
                console.log('🐉 Załadowano potworów:', MONSTERS.length);
                if (callback) callback(MONSTERS);
            }
        });
    });
}

// ====== POBIERANIE OBRAZKÓW ======
function getMonsterImageUrl(monsterName) {
    var formattedName = monsterName.toLowerCase().replace(/['".,()]/g, '').replace(/\s+/g, '-');
    return 'https://www.dnd5eapi.co/api/images/monsters/' + formattedName + '.png';
}

// ====== RENDER ======
function renderMonsters(filter, query) {
    filter = filter || 'all';
    query = query || '';
    var container = document.getElementById('monsterGrid');
    if (!container) return;

    loadAllMonsters(function(monsters) {
        var filtered = filterMonstersByCR(monsters, filter);
        
        if (query) {
            var q = query.toLowerCase();
            filtered = filtered.filter(function(m) {
                return m.name.toLowerCase().includes(q) ||
                       m.type.toLowerCase().includes(q) ||
                       (m.desc && m.desc.toLowerCase().includes(q));
            });
        }

        renderFilteredMonsters(filtered);
    });
}

function filterMonstersByCR(monsters, filter) {
    if (filter === 'all') return monsters;
    if (!filter) return monsters;
    
    var parts = filter.split('-');
    var min = parseInt(parts[0]);
    var max = parseInt(parts[1]);
    
    return monsters.filter(function(m) {
        return m.cr >= min && m.cr <= max;
    });
}

function renderFilteredMonsters(filtered) {
    var container = document.getElementById('monsterGrid');
    if (!container) return;
    
    if (filtered.length === 0) {
        container.innerHTML = '<div class="monster-empty">🐉 Brak potworów spełniających kryteria</div>';
        return;
    }

    container.innerHTML = '';
    filtered.forEach(function(m) {
        var div = document.createElement('div');
        div.className = 'monster-card';
        div.dataset.monsterName = m.name;

        var imgUrl = getMonsterImageUrl(m.name);
        
        div.innerHTML = `
            <div class="monster-card-band">
                <span class="monster-card-icon">🐉</span>
                <div class="monster-card-cr">CR ${m.cr}</div>
            </div>
            <div class="monster-card-body">
                <div class="monster-card-name" onclick="openMonsterDetail('${m.name.replace(/'/g, "\\'")}')">${m.name}</div>
                <div class="monster-card-type">${m.type}</div>
                <div class="monster-card-image" onclick="openMonsterDetail('${m.name.replace(/'/g, "\\'")}')">
                    <img src="${imgUrl}" onerror="handleImageError(this)" alt="${m.name}">
                </div>
                <div class="monster-card-stats">
                    <span>❤️ HP <b>${m.hp}</b></span>
                    <span>🛡️ KP <b>${m.ac}</b></span>
                    <span>💨 <b>${m.speed}</b></span>
                </div>
                <div class="monster-card-desc">${m.desc || ''}</div>
                <div class="monster-card-actions">
                    <button class="monster-card-btn" onclick="openMonsterDetail('${m.name.replace(/'/g, "\\'")}')">📖 Szczegóły</button>
                    <button class="monster-card-btn primary" onclick="addMonsterToCombat('${m.name.replace(/'/g, "\\'")}', ${m.cr}, ${m.hp}, ${m.ac}, '${m.type.replace(/'/g, "\\'")}')">⚔️ Do walki</button>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

// ====== FILTRY ======
function filterMonsters(cr) {
    currentMonsterFilter = cr;
    var searchInput = document.getElementById('monsterSearch');
    var query = searchInput ? searchInput.value : '';
    renderMonsters(cr, query);
    
    document.querySelectorAll('.monster-filter-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.cr == cr);
    });
}

// ====== SZCZEGÓŁY POTWORA ======
function openMonsterDetail(name) {
    loadAllMonsters(function() {
        var monster = MONSTERS.find(function(m) { return m.name === name; });
        if (!monster) { 
            alert('Nie znaleziono potwora: ' + name); 
            return; 
        }
        selectedMonster = monster;
        
        var popup = document.getElementById('monsterDetailPopup');
        if (!popup) return;
        
        var imgUrl = getMonsterImageUrl(monster.name);
        var attrLabels = { str: 'Siła', dex: 'Zr.', con: 'Kon.', int: 'Int.', wis: 'Mądr.', cha: 'Cha.' };
        
        var attrHtml = Object.keys(monster.stats).map(function(k) {
            var mod = Math.floor((monster.stats[k] - 10) / 2);
            var modStr = mod >= 0 ? '+' + mod : '' + mod;
            return `<div class="monster-detail-attr">
                <div class="monster-detail-attr-label">${attrLabels[k]}</div>
                <div class="monster-detail-attr-value">${monster.stats[k]} (${modStr})</div>
            </div>`;
        }).join('');
        
        var savesHtml = '';
        if (monster.saves && Object.keys(monster.saves).length > 0) {
            var saveLabels = { str: 'Siła', dex: 'Zr.', con: 'Kon.', int: 'Int.', wis: 'Mądr.', cha: 'Cha.' };
            savesHtml = Object.keys(monster.saves).map(function(k) {
                var val = monster.saves[k];
                var mod = val >= 0 ? '+' + val : '' + val;
                return `<span class="monster-detail-tag">🛡️ ${saveLabels[k]}: ${mod}</span>`;
            }).join('');
        }
        
        var skillsHtml = '';
        if (monster.skills && Object.keys(monster.skills).length > 0) {
            skillsHtml = Object.keys(monster.skills).map(function(k) {
                var val = monster.skills[k];
                var mod = val >= 0 ? '+' + val : '' + val;
                return `<span class="monster-detail-tag skill">🎯 ${k}: ${mod}</span>`;
            }).join('');
        }
        
        var resistancesHtml = monster.resistances && monster.resistances.length > 0
            ? monster.resistances.map(function(r) { return `<span class="monster-detail-tag resistance">🛡️ ${r}</span>`; }).join('')
            : '';
            
        var immunitiesHtml = monster.immunities && monster.immunities.length > 0
            ? monster.immunities.map(function(i) { return `<span class="monster-detail-tag immunity">⛔ ${i}</span>`; }).join('')
            : '';
            
        var languagesHtml = monster.languages && monster.languages.length > 0
            ? monster.languages.map(function(l) { return `<span class="monster-detail-tag language">🗣️ ${l}</span>`; }).join('')
            : '';
            
        var actionsHtml = monster.actions && monster.actions.length > 0
            ? monster.actions.map(function(a) {
                return `<div class="monster-detail-action">
                    <div class="monster-detail-action-name">⚔️ ${a.name}</div>
                    <div class="monster-detail-action-desc">${a.desc}</div>
                </div>`;
            }).join('')
            : '<p style="color:#786c53;font-style:italic;">Brak akcji</p>';
        
        popup.innerHTML = `
            <div class="popup-content monster-detail-content">
                <div class="popup-title">
                    <span class="monster-detail-name">🐉 ${monster.name}</span>
                    <span style="margin-left:auto;">
                        <span class="monster-detail-cr">CR ${monster.cr}</span>
                    </span>
                </div>
                <div class="monster-detail-type">${monster.type}</div>
                
                <div class="monster-detail-image">
                    <img src="${imgUrl}" onerror="handleImageError(this)" alt="${monster.name}">
                </div>
                
                <div class="monster-detail-stats-grid">
                    <div class="monster-detail-stat">
                        <div class="monster-detail-stat-label">❤️ PW</div>
                        <div class="monster-detail-stat-value">${monster.hp}</div>
                    </div>
                    <div class="monster-detail-stat">
                        <div class="monster-detail-stat-label">🛡️ KP</div>
                        <div class="monster-detail-stat-value">${monster.ac}</div>
                    </div>
                    <div class="monster-detail-stat">
                        <div class="monster-detail-stat-label">💨 Prędkość</div>
                        <div class="monster-detail-stat-value" style="font-size:16px;">${monster.speed}</div>
                    </div>
                </div>
                
                <div style="font-size:12px;color:#786c53;margin:6px 0 4px;font-family:'JetBrains Mono',monospace;letter-spacing:0.06em;">ATRYBUTY</div>
                <div class="monster-detail-attributes">${attrHtml}</div>
                
                ${savesHtml ? `<div style="font-size:12px;color:#786c53;margin:6px 0 4px;font-family:'JetBrains Mono',monospace;letter-spacing:0.06em;">RZUTY OBRONNE</div><div class="monster-detail-tags">${savesHtml}</div>` : ''}
                ${skillsHtml ? `<div style="font-size:12px;color:#786c53;margin:6px 0 4px;font-family:'JetBrains Mono',monospace;letter-spacing:0.06em;">UMIEJĘTNOŚCI</div><div class="monster-detail-tags">${skillsHtml}</div>` : ''}
                ${resistancesHtml ? `<div style="font-size:12px;color:#786c53;margin:6px 0 4px;font-family:'JetBrains Mono',monospace;letter-spacing:0.06em;">ODPORNOŚCI</div><div class="monster-detail-tags">${resistancesHtml}</div>` : ''}
                ${immunitiesHtml ? `<div style="font-size:12px;color:#786c53;margin:6px 0 4px;font-family:'JetBrains Mono',monospace;letter-spacing:0.06em;">IMMUNITETY</div><div class="monster-detail-tags">${immunitiesHtml}</div>` : ''}
                ${languagesHtml ? `<div style="font-size:12px;color:#786c53;margin:6px 0 4px;font-family:'JetBrains Mono',monospace;letter-spacing:0.06em;">JĘZYKI</div><div class="monster-detail-tags">${languagesHtml}</div>` : ''}
                
                <div style="font-size:12px;color:#786c53;margin:8px 0 4px;font-family:'JetBrains Mono',monospace;letter-spacing:0.06em;">AKCJE</div>
                <div class="monster-detail-actions">${actionsHtml}</div>
                
                <div class="monster-detail-desc">${monster.desc || ''}</div>
                
                <div class="monster-detail-actions-bar">
                    <button class="btn" onclick="addMonsterDetailToCombat()">⚔️ Dodaj do walki</button>
                    <button class="btn outline" onclick="closeMonsterDetail()">✕ Zamknij</button>
                </div>
            </div>
        `;
        popup.style.display = 'flex';
    });
}

function closeMonsterDetail() {
    var popup = document.getElementById('monsterDetailPopup');
    if (popup) popup.style.display = 'none';
    selectedMonster = null;
}

function addMonsterDetailToCombat() {
    if (!selectedMonster) return;
    addMonsterToCombat(
        selectedMonster.name, 
        selectedMonster.cr, 
        selectedMonster.hp, 
        selectedMonster.ac, 
        selectedMonster.type
    );
    closeMonsterDetail();
}

function addMonsterToCombat(name, cr, hp, ac, type) {
    if (typeof addCombatant !== 'function') {
        alert('Moduł potyczki nie jest dostępny!');
        return;
    }
    
    if (typeof combatants !== 'undefined') {
        var exists = combatants.some(function(c) {
            return c.name === name && c.role === 'Wróg';
        });
        if (exists) {
            if (!confirm('Potwór "' + name + '" jest już w potyczce. Dodać kolejnego?')) {
                return;
            }
        }
    }
    
    var initVal = Math.floor(Math.random() * 20) + 1 + Math.floor(cr / 2);
    addCombatant({
        name: name,
        init: initVal,
        hp: hp,
        maxHp: hp,
        ac: ac,
        role: 'Wróg',
        avatar: '🐉',
        conditions: [],
        exhaustionLevel: 0
    });
    
    if (typeof playSound === 'function') playSound('add');
    
    var combatTab = document.querySelector('.nav-btn[data-tab="combat"]');
    if (combatTab) combatTab.click();
}

// ====== INICJALIZACJA ======
document.addEventListener('DOMContentLoaded', function() {
    var searchInput = document.getElementById('monsterSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            renderMonsters(currentMonsterFilter, this.value);
        });
    }
    
    var allBtn = document.querySelector('.monster-filter-btn[data-cr="all"]');
    if (allBtn) allBtn.classList.add('active');
    
    renderMonsters('all', '');
});

// ====== EKSPORT ======
window.renderMonsters = renderMonsters;
window.filterMonsters = filterMonsters;
window.openMonsterDetail = openMonsterDetail;
window.closeMonsterDetail = closeMonsterDetail;
window.addMonsterToCombat = addMonsterToCombat;
window.addMonsterDetailToCombat = addMonsterDetailToCombat;
window.MONSTERS = MONSTERS;
window.getMonsterImageUrl = getMonsterImageUrl;
window.handleImageError = handleImageError;