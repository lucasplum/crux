// ============================================================
//  SPELLBOOK LOADER (ZOPTYMALIZOWANY PROMISE.ALL)
// ============================================================

var spellCache = {};
var allSpells = [];
var isLoading = false;
var spellbookDebounce = null; // Debouncer wyszukiwania

// (zostaw SCHOOL_MAP i SCHOOL_COLORS bez zmian)
var SCHOOL_MAP = { 'wywoływanie': 'Wywoływanie', 'przywoływanie': 'Przywoływanie', 'wieszczenie': 'Wieszczenie', 'nekromancja': 'Nekromancja', 'uroki': 'Uroki', 'iluzje': 'Iluzja', 'odpychanie': 'Ochrona', 'przemiany': 'Przemiany' };
var SCHOOL_COLORS = { 'Wywoływanie': { bg: 'rgba(255,107,53,0.12)', border: '#ff6b35', text: '#ff6b35', glow: 'rgba(255,107,53,0.08)' }, 'Przywoływanie': { bg: 'rgba(107,255,158,0.12)', border: '#6bff9e', text: '#6bff9e', glow: 'rgba(107,255,158,0.08)' }, 'Wieszczenie': { bg: 'rgba(107,184,255,0.12)', border: '#6bb8ff', text: '#6bb8ff', glow: 'rgba(107,184,255,0.08)' }, 'Nekromancja': { bg: 'rgba(184,74,143,0.12)', border: '#b84a8f', text: '#b84a8f', glow: 'rgba(184,74,143,0.08)' }, 'Uroki': { bg: 'rgba(255,107,196,0.12)', border: '#ff6bc4', text: '#ff6bc4', glow: 'rgba(255,107,196,0.08)' }, 'Iluzja': { bg: 'rgba(168,124,255,0.12)', border: '#a87cff', text: '#a87cff', glow: 'rgba(168,124,255,0.08)' }, 'Ochrona': { bg: 'rgba(212,168,67,0.12)', border: '#d4a843', text: '#d4a843', glow: 'rgba(212,168,67,0.08)' }, 'Przemiany': { bg: 'rgba(74,192,176,0.12)', border: '#4ac0b0', text: '#4ac0b0', glow: 'rgba(74,192,176,0.08)' } };
var SCHOOL_REVERSE = {}; for (var key in SCHOOL_MAP) { SCHOOL_REVERSE[SCHOOL_MAP[key]] = key; }

function loadAllSpells(callback) {
  if (allSpells.length > 0) { if (callback) callback(allSpells); return; }
  if (isLoading) { setTimeout(function() { loadAllSpells(callback); }, 100); return; }
  
  isLoading = true;
  var levels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  
  // OPTYMALIZACJA: Równoległe pobieranie wszystkich plików
  Promise.all(levels.map(function(l) {
    return fetch('data/spells/level-' + l + '.json')
      .then(function(res) { return res.ok ? res.json() : []; })
      .catch(function() { return []; });
  })).then(function(results) {
    allSpells = results.flat();
    isLoading = false;
    if (callback) callback(allSpells);
  });
}

function filterSpells(level, school, classFilter, callback) {
  loadAllSpells(function(spells) {
    var results = spells;
    if (level !== 'all' && level !== undefined && level !== '') results = results.filter(function(s) { return s.level === parseInt(level); });
    if (school !== 'all' && school !== undefined && school !== '') {
      var schoolKey = SCHOOL_REVERSE[school] || school;
      results = results.filter(function(s) { return s.school === schoolKey; });
    }
    if (classFilter && classFilter !== 'all' && classFilter !== '') {
      results = results.filter(function(s) { return s.classes && s.classes.indexOf(classFilter) !== -1; });
    }
    if (callback) callback(results);
  });
}

function renderSpellbook(filter, levelFilter, schoolFilter, classFilter, sortBy) {
  filter = filter || ''; levelFilter = levelFilter || 'all'; schoolFilter = schoolFilter || 'all'; classFilter = classFilter || 'all'; sortBy = sortBy || 'level';

  var container = document.getElementById('spellbookList');
  if (!container) return;
  container.innerHTML = '<div style="color:var(--muted);text-align:center;padding:20px;">⏳ Ładowanie księgi zaklęć...</div>';

  filterSpells(levelFilter, schoolFilter, classFilter, function(spells) {
    var filtered = spells;
    if (filter) {
      var flt = filter.toLowerCase();
      filtered = filtered.filter(function(s) {
        return s.name_pl.toLowerCase().includes(flt) || s.name_en.toLowerCase().includes(flt) || s.desc_pl.toLowerCase().includes(flt);
      });
    }

    if (sortBy === 'level') {
      filtered.sort(function(a, b) { return a.level !== b.level ? a.level - b.level : a.name_pl.localeCompare(b.name_pl); });
    } else {
      filtered.sort(function(a, b) { return a.name_pl.localeCompare(b.name_pl); });
    }

    container.innerHTML = '';
    if (filtered.length === 0) {
      container.innerHTML = '<div style="color:var(--muted);font-size:.8rem;text-align:center;padding:20px;">📖 Brak zaklęć spełniających kryteria</div>'; return;
    }

    var fragment = document.createDocumentFragment(); // OPTYMALIZACJA WSTAWIANIA DO DOM

    filtered.forEach(function(spell) {
      var div = document.createElement('div');
      var schoolDisplay = SCHOOL_MAP[spell.school] || spell.school;
      var color = SCHOOL_COLORS[schoolDisplay] || { bg: 'rgba(255,255,255,0.05)', border: 'var(--border)', text: 'var(--muted)', glow: 'transparent' };
      div.className = 'spellbook-item';
      div.style.borderColor = color.border;
      div.style.boxShadow = '0 0 30px ' + color.glow + ', 0 2px 10px rgba(0,0,0,0.2)';
      var levelText = spell.level === 0 ? 'Cantrip' : 'Lvl ' + spell.level;
      var classTags = spell.classes ? spell.classes.map(function(c) { return '<span class="spellbook-class">' + c + '</span>'; }).join('') : '';
      
      div.innerHTML = `
        <div class="spellbook-header">
          <span class="spellbook-name" style="color:${color.text};">${spell.name_pl}</span>
          <span style="color:var(--muted);font-weight:400;font-size:var(--font-sm);">(${spell.name_en})</span>
          <span class="spellbook-level">${levelText}</span>
          <span class="spellbook-school-tag" style="background:${color.bg};color:${color.text};border-color:${color.border};">${schoolDisplay}</span>
        </div>
        <div class="spellbook-meta"><span>⏱️ ${spell.casting}</span><span>📏 ${spell.range}</span><span>⌛ ${spell.duration}</span></div>
        ${classTags ? '<div class="spellbook-classes">' + classTags + '</div>' : ''}
        <div class="spellbook-desc-pl"><span class="spellbook-lang">🇵🇱</span>${spell.desc_pl}</div>
      `;
      fragment.appendChild(div);
    });
    container.appendChild(fragment);
  });
}

// ====== EVENTY Z DEBOUNCE ======
document.addEventListener('DOMContentLoaded', function() {
  var searchInput = document.getElementById('spellbookSearch');
  var levelSelect = document.getElementById('spellbookLevel');
  var schoolSelect = document.getElementById('spellbookSchool');
  var classSelect = document.getElementById('spellbookClass');
  var sortSelect = document.getElementById('spellbookSort');
  function getVal(el) { return el ? el.value : 'all'; }

  if (searchInput) {
    searchInput.addEventListener('input', function() {
      clearTimeout(spellbookDebounce);
      spellbookDebounce = setTimeout(function() {
        renderSpellbook(searchInput.value, getVal(levelSelect), getVal(schoolSelect), getVal(classSelect), getVal(sortSelect) === 'all' ? 'level' : getVal(sortSelect));
      }, 300);
    });
  }
  [levelSelect, schoolSelect, classSelect, sortSelect].forEach(function(el) {
    if (el) el.addEventListener('change', function() {
      renderSpellbook(searchInput ? searchInput.value : '', getVal(levelSelect), getVal(schoolSelect), getVal(classSelect), getVal(sortSelect) === 'all' ? 'level' : getVal(sortSelect));
    });
  });

  renderSpellbook('', 'all', 'all', 'all', 'level');
});

window.renderSpellbook = renderSpellbook; window.loadAllSpells = loadAllSpells; window.filterSpells = filterSpells;