// ============================================================
//  SPELLBOOK - SCALONY (Arkana Wędrowca + loader + cleanSpell)
// ============================================================
var spellCache = {};
var allSpells = [];
var isLoading = false;

// ====== IKONY SZKÓŁ ======
var SCHOOL_ICONS = {
  'wywoływanie': '✦', 'przywoływanie': '⬡', 'wieszczenie': '◈',
  'nekromancja': '✧', 'uroki': '♥', 'iluzje': '◐',
  'odpychanie': '⊜', 'przemiany': '◈'
};

// ====== NAZWY SZKÓŁ (PL) ======
var SCHOOL_NAMES = {
  'wywoływanie': 'Ewokacja', 'przywoływanie': 'Przywoływanie',
  'wieszczenie': 'Wieszczenie', 'nekromancja': 'Nekromancja',
  'uroki': 'Uroki', 'iluzje': 'Iluzja',
  'odpychanie': 'Ochrona', 'przemiany': 'Przemiany'
};

// ====== KOLORY SZKÓŁ ======
var SCHOOL_COLORS = {
  'wywoływanie': '#d88737', 'przywoływanie': '#6bff9e',
  'wieszczenie': '#6bb8ff', 'nekromancja': '#b84a8f',
  'uroki': '#ff6bc4', 'iluzje': '#a87cff',
  'odpychanie': '#d4a843', 'przemiany': '#4ac0b0'
};

// ====== REVERSE MAP (duże→małe) ======
var SCHOOL_REVERSE = {};
for (var k in SCHOOL_NAMES) SCHOOL_REVERSE[SCHOOL_NAMES[k]] = k;

// ====== CZYSZCZENIE JSON (usuwa spacje z kluczy i wartości) ======
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

// ====== ŁADOWANIE POZIOMU ======
function loadSpellLevel(level, callback) {
  if (spellCache[level]) {
    if (callback) callback(spellCache[level]);
    return;
  }
  // Fallback ścieżek
  var urls = [
    'data/spells/level-' + level + '.json',
    'level-' + level + '.json',
    '../data/spells/level-' + level + '.json'
  ];
  tryLoadUrls(urls, 0, function(data) {
    if (Array.isArray(data)) data = data.map(cleanSpell);
    else data = [];
    spellCache[level] = data;
    if (callback) callback(data);
  });
}

function tryLoadUrls(urls, idx, callback) {
  if (idx >= urls.length) { callback(null); return; }
  fetch(urls[idx])
    .then(function(r) {
      if (!r.ok) throw new Error('Not found: ' + urls[idx]);
      return r.json();
    })
    .then(function(data) { callback(data); })
    .catch(function() { tryLoadUrls(urls, idx + 1, callback); });
}

// ====== ŁADOWANIE WSZYSTKICH ======
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
  var levels = [0,1,2,3,4,5,6,7,8,9];
  var loaded = 0, total = levels.length, results = [];
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

// ====== KRĄG (rzymski) ======
function getLevelText(level) {
  if (level === 0) return 'Cantrip';
  var roman = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
  return 'KRĄG ' + roman[level];
}

// ====== FILTROWANIE ======
function filterSpells(level, school, classFilter, callback) {
  loadAllSpells(function(spells) {
    var results = spells;
    if (level !== 'all' && level !== undefined && level !== '') {
      results = results.filter(function(s) { return s.level === parseInt(level); });
    }
    if (school !== 'all' && school !== undefined && school !== '') {
      var schoolKey = SCHOOL_REVERSE[school] || school;
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

// ====== DETEKCJA TYPU OBRAŻEŃ ======
function detectDamageType(desc) {
  if (!desc) return { type: '', icon: '' };
  var d = desc.toLowerCase();
  if (d.includes('ogni') || d.includes('fire')) return { type: 'fire', icon: '🔥' };
  if (d.includes('zimn') || d.includes('cold')) return { type: 'cold', icon: '❄️' };
  if (d.includes('nekro')) return { type: 'necro', icon: '💀' };
  if (d.includes('kwas') || d.includes('acid')) return { type: 'acid', icon: '🧪' };
  if (d.includes('elektry') || d.includes('lightning')) return { type: 'lightning', icon: '⚡' };
  if (d.includes('promieni') || d.includes('radiant')) return { type: 'radiant', icon: '☀️' };
  if (d.includes('trucizn') || d.includes('poison')) return { type: 'poison', icon: '☠️' };
  if (d.includes('psych')) return { type: 'psychic', icon: '🧠' };
  return { type: '', icon: '' };
}

// ====== RENDER KSIĘGI ======
function renderSpellbook(filter, levelFilter, schoolFilter, classFilter, sortBy) {
  filter = filter || '';
  levelFilter = levelFilter || 'all';
  schoolFilter = schoolFilter || 'all';
  classFilter = classFilter || 'all';
  sortBy = sortBy || 'level';

  var container = document.getElementById('spellbookList');
  if (!container) return;

  container.innerHTML = '<div style="color:var(--parchment-dim);text-align:center;padding:40px;font-family:\'Cinzel\',serif;">⏳ Ładowanie księgi zaklęć...</div>';

  filterSpells(levelFilter, schoolFilter, classFilter, function(spells) {
    var filtered = spells;

    if (filter) {
      var f = filter.toLowerCase();
      filtered = filtered.filter(function(s) {
        return (s.name_pl || '').toLowerCase().includes(f) ||
               (s.name_en || '').toLowerCase().includes(f) ||
               (s.desc_pl || '').toLowerCase().includes(f) ||
               (s.desc_en || '').toLowerCase().includes(f);
      });
    }

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
      container.innerHTML = '<div style="color:var(--parchment-dim);text-align:center;padding:40px;font-family:\'Cinzel\',serif;">📖 Brak zaklęć spełniających kryteria</div>';
      return;
    }

    filtered.forEach(function(spell) {
      var div = document.createElement('div');
      div.className = 'spellbook-card';

      var schoolName = SCHOOL_NAMES[spell.school] || spell.school || 'Nieznana';
      var schoolIcon = SCHOOL_ICONS[spell.school] || '✦';
      var color = SCHOOL_COLORS[spell.school] || '#c9a24b';
      var levelText = getLevelText(spell.level);
      var dmg = detectDamageType(spell.desc_pl);

      var damageHtml = dmg.type ?
        '<div class="spellbook-damage damage-' + dmg.type + '">' + dmg.icon + ' ' + (spell.desc_pl || '').split('.')[0] + '</div>' : '';

      var classesHtml = spell.classes ?
        spell.classes.slice(0, 3).map(function(c) {
          return '<span class="spellbook-class">' + c + '</span>';
        }).join('') : '';

      div.style.setProperty('--accent', color);
      div.dataset.school = spell.school || '';

      div.innerHTML =
        '<div class="spellbook-school">' + schoolIcon + ' ' + schoolName + '</div>' +
        '<div class="spellbook-name">' + (spell.name_pl || spell.name_en || '?') + '</div>' +
        '<div class="spellbook-en">' + (spell.name_en || '') + '</div>' +
        '<div class="spellbook-circle">' + levelText + '</div>' +
        damageHtml +
        '<div class="spellbook-info">' +
          '<div>⏱ ' + (spell.casting || '—') + '</div>' +
          '<div>📏 ' + (spell.range || '—') + '</div>' +
          '<div>⌛ ' + (spell.duration || '—') + '</div>' +
          (classesHtml ? '<div>👥 ' + classesHtml + '</div>' : '') +
        '</div>';

      div.addEventListener('click', function() { openSpellDetail(spell); });
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
  var dmg = detectDamageType(spell.desc_pl);
  var damageDisplay = dmg.type ? (dmg.icon + ' ' + dmg.type.charAt(0).toUpperCase() + dmg.type.slice(1)) : '—';

  var classesHtml = spell.classes ?
    spell.classes.map(function(c) { return '<span class="tag">' + c + '</span>'; }).join('') :
    '<span class="tag">—</span>';

  var tags = [];
  if (dmg.type) tags.push(dmg.type.charAt(0).toUpperCase() + dmg.type.slice(1));
  if (spell.duration && spell.duration.includes('koncentracja')) tags.push('Koncentracja');
  if (spell.range && spell.range.includes('ft')) tags.push('Dystansowy');
  if (spell.desc_pl && spell.desc_pl.toLowerCase().includes('leczy')) tags.push('Leczenie');
  if (tags.length === 0) tags.push('Utility');

  var tagsHtml = tags.map(function(t) { return '<span class="tag">' + t + '</span>'; }).join('');

  var content = document.getElementById('spellDetailContent');
  if (!content) return;

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
      '<div class="spell-detail-stat"><div class="spell-detail-stat-label">⏱ Casting Time</div><div class="spell-detail-stat-value">' + (spell.casting || '—') + '</div></div>' +
      '<div class="spell-detail-stat"><div class="spell-detail-stat-label">📏 Range / Area</div><div class="spell-detail-stat-value">' + (spell.range || '—') + '</div></div>' +
      '<div class="spell-detail-stat"><div class="spell-detail-stat-label">🔮 Components</div><div class="spell-detail-stat-value">' + (spell.components || '—') + '</div></div>' +
      '<div class="spell-detail-stat"><div class="spell-detail-stat-label">⌛ Duration</div><div class="spell-detail-stat-value">' + (spell.duration || '—') + '</div></div>' +
      '<div class="spell-detail-stat"><div class="spell-detail-stat-label">💥 Damage / Effect</div><div class="spell-detail-stat-value">' + damageDisplay + '</div></div>' +
      '<div class="spell-detail-stat"><div class="spell-detail-stat-label">👥 Classes</div><div class="spell-detail-stat-value">' + classesHtml + '</div></div>' +
      '<div class="spell-detail-stat"><div class="spell-detail-stat-label">📚 Source</div><div class="spell-detail-stat-value">' + (spell.source || "Player's Handbook") + '</div></div>' +
      '<div class="spell-detail-stat"><div class="spell-detail-stat-label">🏷️ Tags</div><div class="spell-detail-stat-value">' + tagsHtml + '</div></div>' +
    '</div>' +

    '<div class="spell-detail-section"><h3>Opis</h3><p>' + (spell.desc_pl || 'Brak opisu') + '</p></div>' +
    '<div class="spell-detail-section"><h3>Description</h3><p>' + (spell.desc_en || 'No description') + '</p></div>' +
    '<div class="spell-detail-section"><h3>Przy wyższych kręgach</h3><p>' +
      (spell.desc_pl && spell.desc_pl.includes('Wyższe poziomy') ? spell.desc_pl.split('Wyższe poziomy')[1] || '—' : '—') +
    '</p></div>' +

    '<div class="spell-detail-close" onclick="closeSpellDetail()">✕ Zamknij</div>';

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

// ====== INICJALIZACJA ======
document.addEventListener('DOMContentLoaded', function() {
  var searchInput = document.getElementById('spellbookSearch');
  var levelSelect = document.getElementById('spellbookLevel');
  var schoolSelect = document.getElementById('spellbookSchool');
  var classSelect = document.getElementById('spellbookClass');
  var sortSelect = document.getElementById('spellbookSort');

  function getSortValue() { return sortSelect ? sortSelect.value : 'level'; }

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

  renderSpellbook('', 'all', 'all', 'all', 'level');
});

// ====== EKSPORT ======
window.renderSpellbook = renderSpellbook;
window.openSpellDetail = openSpellDetail;
window.closeSpellDetail = closeSpellDetail;
window.loadAllSpells = loadAllSpells;
window.loadSpellLevel = loadSpellLevel;
window.filterSpells = filterSpells;
window.cleanSpell = cleanSpell;
window.SCHOOL_NAMES = SCHOOL_NAMES;
window.SCHOOL_ICONS = SCHOOL_ICONS;
window.SCHOOL_COLORS = SCHOOL_COLORS;
window.SCHOOL_REVERSE = SCHOOL_REVERSE;
window.getLevelText = getLevelText;
window.detectDamageType = detectDamageType;