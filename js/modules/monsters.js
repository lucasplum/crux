// ============================================================
//  MONSTERS - BESTIARIUSZ Z JSON (CR 6-8)
//  Styl: DnD Bestiariusz (złote rogi, pergamin, ozdobne ramki)
// ============================================================
var MONSTERS = [];
var currentMonsterFilter = 'all';
var selectedMonster = null;
var pendingMonster = null;
var monsterCache = {};
var monsterLoading = false;

// ====== ŁADOWANIE Z JSON ======
function loadMonsterCR(cr, callback) {
  if (monsterCache[cr]) {
    if (callback) callback(monsterCache[cr]);
    return;
  }
  var url = 'data/monsters/cr-' + cr + '.json';
  fetch(url)
    .then(function(r) {
      if (!r.ok) throw new Error('Brak pliku: ' + url);
      return r.json();
    })
    .then(function(data) {
      monsterCache[cr] = data;
      if (callback) callback(data);
    })
    .catch(function(err) {
      console.warn('Błąd ładowania CR ' + cr + ':', err);
      if (callback) callback([]);
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
  var crs = [6, 7, 8];
  var loaded = 0;
  var results = [];
  crs.forEach(function(cr) {
    loadMonsterCR(cr, function(data) {
      results = results.concat(data || []);
      loaded++;
      if (loaded === crs.length) {
        // DEDUPLIKACJA po nazwie
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
        if (callback) callback(MONSTERS);
      }
    });
  });
}

// ====== POBIERANIE OBRAZKÓW ======
function loadMonsterImages(monsters, callback) {
  var total = monsters.length;
  var loaded = 0;
  var results = {};
  if (total === 0) { if (callback) callback(results); return; }
  monsters.forEach(function(monster) {
    var name = monster.name;
    var cacheKey = name.toLowerCase().replace(/['".,()]/g, '').replace(/\s+/g, '-');
    if (typeof MONSTER_API !== 'undefined' && MONSTER_API.monsterCache && MONSTER_API.monsterCache[cacheKey]) {
      var imageUrl = MONSTER_API.baseUrl + MONSTER_API.monsterCache[cacheKey].image;
      results[name] = imageUrl;
      loaded++;
      if (loaded === total && callback) callback(results);
      return;
    }
    if (typeof getMonsterImage === 'function') {
      getMonsterImage(name, function(imageUrl) {
        results[name] = imageUrl || null;
        loaded++;
        if (loaded === total && callback) callback(results);
      });
    } else {
      results[name] = null;
      loaded++;
      if (loaded === total && callback) callback(results);
    }
  });
}

// ====== RENDER KARTY BESTIARIUSZA (STYL D&D) ======
function renderMonsters(filter, query) {
  filter = filter || 'all';
  query = query || '';
  var container = document.getElementById('monsterGrid');
  if (!container) return;

  loadAllMonsters(function(monsters) {
    var filtered = monsters;
    if (filter !== 'all') {
      filtered = filtered.filter(function(m) { return m.cr === parseInt(filter); });
    }
    if (query) {
      var q = query.toLowerCase();
      filtered = filtered.filter(function(m) {
        return m.name.toLowerCase().includes(q) ||
               m.type.toLowerCase().includes(q) ||
               m.desc.toLowerCase().includes(q);
      });
    }

    if (filtered.length === 0) {
      container.innerHTML = '<div class="monster-empty">🐉 Brak potworów spełniających kryteria</div>';
      return;
    }

    container.innerHTML = '';
    filtered.forEach(function(m) {
      var div = document.createElement('div');
      div.className = 'monster-card bestiary-card';
      div.dataset.monsterName = m.name;

      var imageHtml = '<div class="bestiary-image-placeholder">🐉</div>';
      var cacheKey = m.name.toLowerCase().replace(/['".,()]/g, '').replace(/\s+/g, '-');
      if (typeof MONSTER_API !== 'undefined' && MONSTER_API.monsterCache && MONSTER_API.monsterCache[cacheKey]) {
        var imgUrl = MONSTER_API.baseUrl + MONSTER_API.monsterCache[cacheKey].image;
        imageHtml = '<div class="bestiary-image"><img src="' + imgUrl + '" onerror="this.parentElement.innerHTML=\'🐉\';this.parentElement.classList.add(\'bestiary-image-placeholder\')"></div>';
      }

      // Siatka atrybutów 3x2
      var attrOrder = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
      var attrLabels = { str: 'STR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'WIS', cha: 'CHA' };
      var statsHtml = '<div class="bestiary-stats-grid">';
      attrOrder.forEach(function(k) {
        statsHtml += '<div class="bestiary-stat-box"><span class="bestiary-stat-label">' + attrLabels[k] + '</span><span class="bestiary-stat-value">' + m.stats[k] + '</span></div>';
      });
      statsHtml += '</div>';

      div.innerHTML =
        '<div class="bestiary-header" onclick="openMonsterDetail(\'' + m.name.replace(/'/g, "\\'") + '\')">' +
          '<h3 class="bestiary-name">' + m.name.toUpperCase() + '</h3>' +
          '<span class="bestiary-cr">CR ' + m.cr + '</span>' +
        '</div>' +
        '<div class="bestiary-type">' + m.type + '</div>' +
        imageHtml +
        statsHtml +
        '<div class="bestiary-desc">' + m.desc + '</div>' +
        '<button class="bestiary-join-btn" onclick="event.stopPropagation();addMonsterToCombat(\'' + m.name.replace(/'/g, "\\'") + '\', ' + m.cr + ', ' + m.hp + ', ' + m.ac + ', \'' + m.type.replace(/'/g, "\\'") + '\')">⚔️ DOŁĄCZ DO WALKI</button>';

      container.appendChild(div);
    });

    // Ładowanie obrazków w tle
    loadMonsterImages(filtered, function(images) {
      var cards = container.querySelectorAll('.bestiary-card');
      cards.forEach(function(card) {
        var name = card.dataset.monsterName;
        if (images[name]) {
          var placeholder = card.querySelector('.bestiary-image-placeholder');
          if (placeholder) {
            var imgContainer = document.createElement('div');
            imgContainer.className = 'bestiary-image';
            imgContainer.innerHTML = '<img src="' + images[name] + '" onerror="this.parentElement.innerHTML=\'🐉\';this.parentElement.classList.add(\'bestiary-image-placeholder\')">';
            placeholder.replaceWith(imgContainer);
          }
        }
      });
    });
  });
}

// ====== OTWÓRZ SZCZEGÓŁY POTWORA ======
function openMonsterDetail(name) {
  loadAllMonsters(function() {
    var monster = MONSTERS.find(function(m) { return m.name === name; });
    if (!monster) return;
    selectedMonster = monster;
    var popup = document.getElementById('monsterDetailPopup');
    var title = document.getElementById('monsterDetailName');
    var body = document.getElementById('monsterDetailBody');
    if (!popup || !title || !body) return;

    var attrLabels = { str: 'Siła', dex: 'Zręczność', con: 'Kondycja', int: 'Inteligencja', wis: 'Mądrość', cha: 'Charyzma' };
    var attrIcons = { str: '', dex: '🏃', con: '❤️‍', int: '', wis: '️', cha: '💬' };
    var attrHtml = Object.keys(monster.stats).map(function(k) {
      var mod = Math.floor((monster.stats[k] - 10) / 2);
      var modStr = mod >= 0 ? '+' + mod : '' + mod;
      return '<div class="m-attr-item"><div class="label">' + attrIcons[k] + ' ' + attrLabels[k] + '</div><div class="value">' + monster.stats[k] + ' (' + modStr + ')</div></div>';
    }).join('');

    var savesHtml = '';
    if (monster.saves && Object.keys(monster.saves).length > 0) {
      var saveLabels = { str: 'Siła', dex: 'Zręczność', con: 'Kondycja', int: 'Inteligencja', wis: 'Mądrość', cha: 'Charyzma' };
      savesHtml = Object.keys(monster.saves).map(function(k) {
        var val = monster.saves[k]; var mod = val >= 0 ? '+' + val : '' + val;
        return '<span class="m-tag">' + saveLabels[k] + ': ' + mod + '</span>';
      }).join('');
    }
    var skillsHtml = '';
    if (monster.skills && Object.keys(monster.skills).length > 0) {
      var skillLabels = { percepcja: 'Percepcja', skradanie: 'Skradanie', atletyka: 'Atletyka', religia: 'Religia', historia: 'Historia' };
      skillsHtml = Object.keys(monster.skills).map(function(k) {
        var val = monster.skills[k]; var mod = val >= 0 ? '+' + val : '' + val;
        return '<span class="m-tag skill">' + (skillLabels[k] || k) + ': ' + mod + '</span>';
      }).join('');
    }
    var resistancesHtml = monster.resistances && monster.resistances.length > 0 ? monster.resistances.map(function(r) { return '<span class="m-tag resistance">🛡️ ' + r + '</span>'; }).join('') : '';
    var immunitiesHtml = monster.immunities && monster.immunities.length > 0 ? monster.immunities.map(function(i) { return '<span class="m-tag immunity">⛔ ' + i + '</span>'; }).join('') : '';
    var languagesHtml = monster.languages && monster.languages.length > 0 ? '<span class="m-tag language">🗣️ ' + monster.languages.join(', ') + '</span>' : '';
    var actionsHtml = monster.actions.map(function(a) { return '<div class="m-action-item"><div class="action-name">⚔️ ' + a.name + '</div><div class="action-desc">' + a.desc + '</div></div>'; }).join('');

    var imageHtml = '<div class="monster-detail-image" style="font-size:4rem;padding:20px;">🐉</div>';
    var cacheKey = monster.name.toLowerCase().replace(/['".,()]/g, '').replace(/\s+/g, '-');
    if (typeof MONSTER_API !== 'undefined' && MONSTER_API.monsterCache && MONSTER_API.monsterCache[cacheKey]) {
      var imgUrl = MONSTER_API.baseUrl + MONSTER_API.monsterCache[cacheKey].image;
      imageHtml = '<div class="monster-detail-image"><img src="' + imgUrl + '" onerror="this.parentElement.innerHTML=\'🐉\';this.parentElement.style.fontSize=\'4rem\'"></div>';
    } else if (typeof getMonsterImage === 'function') {
      getMonsterImage(monster.name, function(imageUrl) {
        if (imageUrl) {
          var imgContainer = document.querySelector('.monster-detail-image');
          if (imgContainer) imgContainer.innerHTML = '<img src="' + imageUrl + '" onerror="this.parentElement.innerHTML=\'🐉\'">';
        }
      });
    }

    body.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;margin-bottom:8px;">' +
        '<span style="font-size:var(--font-sm);color:var(--parchment-dim);">' + monster.type + '</span>' +
        '<span class="m-cr-badge" style="border-color:var(--gold);color:var(--gold);">CR ' + monster.cr + '</span>' +
      '</div>' +
      imageHtml +
      '<div class="m-stat-grid">' +
        '<div class="m-stat-item"><div class="label">❤️ PW</div><div class="value">' + monster.hp + '</div></div>' +
        '<div class="m-stat-item"><div class="label">️ KP</div><div class="value">' + monster.ac + '</div></div>' +
        '<div class="m-stat-item"><div class="label">💨 Prędkość</div><div class="value" style="font-size:var(--font-sm);">' + monster.speed + '</div></div>' +
      '</div>' +
      '<div style="font-size:0.75rem;color:var(--parchment-dim);margin:4px 0;">📊 Atrybuty</div>' +
      '<div class="m-attr-grid">' + attrHtml + '</div>' +
      (savesHtml ? '<div style="font-size:0.75rem;color:var(--parchment-dim);margin:4px 0;">🛡️ Rzuty obronne</div><div class="m-tags">' + savesHtml + '</div>' : '') +
      (skillsHtml ? '<div style="font-size:0.75rem;color:var(--parchment-dim);margin:4px 0;"> Umiejętności</div><div class="m-tags">' + skillsHtml + '</div>' : '') +
      (resistancesHtml ? '<div style="font-size:0.75rem;color:var(--parchment-dim);margin:4px 0;">🛡️ Odporności</div><div class="m-tags">' + resistancesHtml + '</div>' : '') +
      (immunitiesHtml ? '<div style="font-size:0.75rem;color:var(--parchment-dim);margin:4px 0;">⛔ Immunitety</div><div class="m-tags">' + immunitiesHtml + '</div>' : '') +
      (languagesHtml ? '<div style="font-size:0.75rem;color:var(--parchment-dim);margin:4px 0;">🗣️ Języki</div><div class="m-tags">' + languagesHtml + '</div>' : '') +
      '<div style="font-size:0.75rem;color:var(--parchment-dim);margin:8px 0 4px;">⚔️ Akcje</div>' +
      '<div class="m-action-list">' + actionsHtml + '</div>' +
      '<div class="m-desc-text">' + monster.desc + '</div>';

    title.textContent = ' ' + monster.name;
    popup.style.display = 'flex';
  });
}

function filterMonsters(cr) {
  currentMonsterFilter = cr;
  var searchInput = document.getElementById('monsterSearch');
  var query = searchInput ? searchInput.value : '';
  renderMonsters(cr, query);
  document.querySelectorAll('[id^="filter"]').forEach(function(btn) { btn.classList.remove('active'); });
  if (cr === 'all') { var allBtn = document.getElementById('filterAll'); if (allBtn) allBtn.classList.add('active'); }
  else { var btn = document.getElementById('filter' + cr); if (btn) btn.classList.add('active'); }
}

function closeMonsterDetail() {
  var popup = document.getElementById('monsterDetailPopup');
  if (popup) popup.style.display = 'none';
  selectedMonster = null;
}

function openMonsterTargetPopup(monster) {
  pendingMonster = monster;
  var popup = document.getElementById('monsterTargetPopup');
  var nameEl = document.getElementById('monsterTargetName');
  if (popup && nameEl) {
    nameEl.textContent = '🐉 ' + monster.name + ' (CR ' + monster.cr + ')\n' + monster.type;
    popup.style.display = 'flex';
  }
}

function closeMonsterTargetPopup() {
  var popup = document.getElementById('monsterTargetPopup');
  if (popup) popup.style.display = 'none';
  pendingMonster = null;
}

function confirmMonsterTarget(target) {
  if (!pendingMonster) return;
  var monster = pendingMonster;
  if (target === 'combat') {
    if (typeof addCombatant !== 'function') { alert('Moduł potyczki nie jest dostępny!'); closeMonsterTargetPopup(); return; }
    var initVal = Math.floor(Math.random() * 20) + 1 + Math.floor(monster.cr / 2);
    addCombatant({ name: monster.name, init: initVal, hp: monster.hp, maxHp: monster.hp, ac: monster.ac, role: 'Wróg', avatar: '🐉', conditions: [], exhaustionLevel: 0 });
    playSound('add');
    closeMonsterTargetPopup();
    var combatTab = document.querySelector('.nav-btn[data-tab="combat"]');
    if (combatTab) combatTab.click();
  } else if (target === 'players') {
    if (typeof players === 'undefined') { alert('Lista postaci nie jest dostępna!'); closeMonsterTargetPopup(); return; }
    players.push({ name: monster.name, hp: monster.hp, maxHp: monster.hp, ac: monster.ac, role: 'NPC', conditions: [], exhaustionLevel: 0, deathSaves: { passes: 0, fails: 0 }, avatar: '🐉' });
    if (typeof renderPlayers === 'function') renderPlayers();
    playSound('add');
    closeMonsterTargetPopup();
    var playersTab = document.querySelector('.nav-btn[data-tab="players"]');
    if (playersTab) playersTab.click();
  }
}

function addMonsterToCombat(name, cr, hp, ac, type) {
  loadAllMonsters(function() {
    var monster = MONSTERS.find(function(m) { return m.name === name; });
    if (!monster) monster = { name: name, cr: cr, hp: hp, ac: ac, type: type };
    openMonsterTargetPopup(monster);
  });
}

function addMonsterDetailToCombat() { if (selectedMonster) openMonsterTargetPopup(selectedMonster); }

function addMonsterDetailAsCompanion() {
  if (!selectedMonster) return;
  if (typeof players === 'undefined' || players.length === 0) { alert('Dodaj najpierw gracza!'); return; }
  var names = players.map(function(p, i) { return (i + 1) + '. ' + p.name + ' (' + p.role + ')'; }).join('\n');
  var choice = prompt('Wybierz gracza dla kompana:\n' + names + '\n\nWpisz numer lub nazwę:');
  if (!choice) return;
  var player = null;
  var num = parseInt(choice);
  if (!isNaN(num) && num > 0 && num <= players.length) player = players[num - 1];
  else player = players.find(function(p) { return p.name.toLowerCase() === choice.toLowerCase(); });
  if (!player) { alert('Nie znaleziono gracza'); return; }
  var companionName = selectedMonster.name + ' (kompan ' + player.name + ')';
  openMonsterTargetPopup({ name: companionName, cr: selectedMonster.cr, hp: selectedMonster.hp, ac: selectedMonster.ac, type: selectedMonster.type + ' (kompan)' });
}

document.addEventListener('DOMContentLoaded', function() {
  var searchInput = document.getElementById('monsterSearch');
  if (searchInput) searchInput.addEventListener('input', function() { renderMonsters(currentMonsterFilter, this.value); });
  var allBtn = document.getElementById('filterAll');
  if (allBtn) allBtn.classList.add('active');
  renderMonsters('all', '');
});

window.renderMonsters = renderMonsters;
window.filterMonsters = filterMonsters;
window.addMonsterToCombat = addMonsterToCombat;
window.openMonsterDetail = openMonsterDetail;
window.closeMonsterDetail = closeMonsterDetail;
window.addMonsterDetailToCombat = addMonsterDetailToCombat;
window.addMonsterDetailAsCompanion = addMonsterDetailAsCompanion;
window.openMonsterTargetPopup = openMonsterTargetPopup;
window.closeMonsterTargetPopup = closeMonsterTargetPopup;
window.confirmMonsterTarget = confirmMonsterTarget;
window.MONSTERS = MONSTERS;