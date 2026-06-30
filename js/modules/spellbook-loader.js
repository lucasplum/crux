// ============================================================
//  SPELLBOOK LOADER - Ładuje zaklęcia z plików JSON
// ============================================================

var spellCache = {};
var allSpells = [];
var isLoading = false;

// Rozszerzone mapowanie szkół magicznych
var SCHOOL_MAP = {
  'wywoływanie': 'Ewokacja',
  'przywoływanie': 'Przyzywanie',
  'wieszczenie': 'Wieszczenie',
  'nekromancja': 'Nekromancja',
  'uroki': 'Oczarowanie',
  'iluzje': 'Iluzja',
  'odpychanie': 'Ochrona',
  'przemiany': 'Przemiany'
};

// Odwrotne mapowanie dla filtrów
var SCHOOL_REVERSE = {};
for (var key in SCHOOL_MAP) {
  SCHOOL_REVERSE[SCHOOL_MAP[key]] = key;
}

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

function filterSpells(level, school, callback) {
  loadAllSpells(function(spells) {
    var results = spells;
    if (level !== 'all' && level !== undefined && level !== '') {
      results = results.filter(function(s) { return s.level === parseInt(level); });
    }
    if (school !== 'all' && school !== undefined && school !== '') {
      // Mapowanie nazwy szkoły z filtra na wartość w danych
      var schoolKey = SCHOOL_REVERSE[school] || school;
      results = results.filter(function(s) { return s.school === schoolKey; });
    }
    if (callback) callback(results);
  });
}

// ====== RENDER LISTY ZAKLĘĆ ======
function renderSpellbook(filter, levelFilter, schoolFilter) {
  filter = filter || '';
  levelFilter = levelFilter || 'all';
  schoolFilter = schoolFilter || 'all';

  var container = document.getElementById('spellbookList');
  if (!container) return;
  container.innerHTML = '<div style="color:var(--muted);text-align:center;padding:20px;">⏳ Ładowanie księgi zaklęć...</div>';

  filterSpells(levelFilter, schoolFilter, function(spells) {
    var filtered = spells;
    
    if (filter) {
      filtered = filtered.filter(function(s) {
        return s.name_pl.toLowerCase().includes(filter.toLowerCase()) ||
               s.name_en.toLowerCase().includes(filter.toLowerCase()) ||
               s.desc_pl.toLowerCase().includes(filter.toLowerCase()) ||
               s.desc_en.toLowerCase().includes(filter.toLowerCase());
      });
    }

    container.innerHTML = '';

    if (filtered.length === 0) {
      container.innerHTML = '<div style="color:var(--muted);font-size:.7rem;text-align:center;padding:20px;">📖 Brak zaklęć spełniających kryteria</div>';
      return;
    }

    filtered.forEach(function(spell) {
      var div = document.createElement('div');
      div.className = 'spellbook-item';
      var levelText = spell.level === 0 ? 'Cantrip' : 'Lvl ' + spell.level;
      
      var classTags = '';
      if (spell.classes) {
        classTags = spell.classes.map(function(c) {
          return '<span class="spellbook-class">' + c + '</span>';
        }).join('');
      }
      
      // Mapowanie szkoły na wyświetlaną nazwę
      var schoolDisplay = SCHOOL_MAP[spell.school] || spell.school;
      
      div.innerHTML = `
        <div class="spellbook-header">
          <span class="spellbook-name">${spell.name_pl} <span style="color:var(--muted);font-weight:400;">(${spell.name_en})</span></span>
          <span class="spellbook-level">${levelText}</span>
          <span class="spellbook-school">${schoolDisplay}</span>
          <span class="spellbook-source">${spell.source || 'PHB'}</span>
        </div>
        <div class="spellbook-meta">
          <span>⏱️ ${spell.casting}</span>
          <span>📏 ${spell.range}</span>
          <span>🧙 ${spell.components}</span>
          <span>⌛ ${spell.duration}</span>
        </div>
        ${classTags ? '<div class="spellbook-classes">' + classTags + '</div>' : ''}
        <div class="spellbook-desc-pl">
          <span class="spellbook-lang">🇵🇱</span>
          ${spell.desc_pl}
        </div>
        <div class="spellbook-desc-en">
          <span class="spellbook-lang">🇬🇧</span>
          ${spell.desc_en}
        </div>
      `;
      container.appendChild(div);
    });
  });
}

// ====== EVENTY ======
document.addEventListener('DOMContentLoaded', function() {
  var searchInput = document.getElementById('spellbookSearch');
  var levelSelect = document.getElementById('spellbookLevel');
  var schoolSelect = document.getElementById('spellbookSchool');

  if (searchInput) {
    searchInput.addEventListener('input', function() {
      renderSpellbook(this.value, levelSelect ? levelSelect.value : 'all', schoolSelect ? schoolSelect.value : 'all');
    });
  }
  if (levelSelect) {
    levelSelect.addEventListener('change', function() {
      renderSpellbook(searchInput ? searchInput.value : '', this.value, schoolSelect ? schoolSelect.value : 'all');
    });
  }
  if (schoolSelect) {
    schoolSelect.addEventListener('change', function() {
      renderSpellbook(searchInput ? searchInput.value : '', levelSelect ? levelSelect.value : 'all', this.value);
    });
  }

  renderSpellbook();
});

window.renderSpellbook = renderSpellbook;
window.loadSpellLevel = loadSpellLevel;
window.loadAllSpells = loadAllSpells;
window.filterSpells = filterSpells;
window.SCHOOL_MAP = SCHOOL_MAP;
window.SCHOOL_REVERSE = SCHOOL_REVERSE;