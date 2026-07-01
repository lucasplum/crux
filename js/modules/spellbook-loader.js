// ============================================================
//  SPELLBOOK LOADER - Z SORTOWANIEM I POPRAWIONYMI SZKOŁAMI
// ============================================================
var spellCache = {};
var allSpells = [];
var isLoading = false;

var SCHOOL_MAP = {
  'wywoływanie': 'Wywoływanie',
  'przywoływanie': 'Przywoływanie',
  'wieszczenie': 'Wieszczenie',
  'nekromancja': 'Nekromancja',
  'uroki': 'Uroki',
  'iluzje': 'Iluzja',
  'odpychanie': 'Ochrona',
  'przemiany': 'Przemiany'
};

var SCHOOL_COLORS = {
  'Wywoływanie': { bg: 'rgba(255,107,53,0.12)', border: '#ff6b35', text: '#ff6b35', glow: 'rgba(255,107,53,0.08)' },
  'Przywoływanie': { bg: 'rgba(107,255,158,0.12)', border: '#6bff9e', text: '#6bff9e', glow: 'rgba(107,255,158,0.08)' },
  'Wieszczenie': { bg: 'rgba(107,184,255,0.12)', border: '#6bb8ff', text: '#6bb8ff', glow: 'rgba(107,184,255,0.08)' },
  'Nekromancja': { bg: 'rgba(184,74,143,0.12)', border: '#b84a8f', text: '#b84a8f', glow: 'rgba(184,74,143,0.08)' },
  'Uroki': { bg: 'rgba(255,107,196,0.12)', border: '#ff6bc4', text: '#ff6bc4', glow: 'rgba(255,107,196,0.08)' },
  'Iluzja': { bg: 'rgba(168,124,255,0.12)', border: '#a87cff', text: '#a87cff', glow: 'rgba(168,124,255,0.08)' },
  'Ochrona': { bg: 'rgba(212,168,67,0.12)', border: '#d4a843', text: '#d4a843', glow: 'rgba(212,168,67,0.08)' },
  'Przemiany': { bg: 'rgba(74,192,176,0.12)', border: '#4ac0b0', text: '#4ac0b0', glow: 'rgba(74,192,176,0.08)' }
};

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

function filterSpells(level, school, classFilter, callback) {
  loadAllSpells(function(spells) {
    var results = spells;
    
    if (level !== 'all' && level !== undefined && level !== '') {
      results = results.filter(function(s) { return s.level === parseInt(level); });
    }
    
    if (school !== 'all' && school !== undefined && school !== '') {
      var schoolKey = SCHOOL_REVERSE[school] || school;
      results = results.filter(function(s) { return s.school === schoolKey; });
    }
    
    if (classFilter && classFilter !== 'all' && classFilter !== '') {
      results = results.filter(function(s) {
        return s.classes && s.classes.indexOf(classFilter) !== -1;
      });
    }
    
    if (callback) callback(results);
  });
}

function renderSpellbook(filter, levelFilter, schoolFilter, classFilter, sortBy) {
  filter = filter || '';
  levelFilter = levelFilter || 'all';
  schoolFilter = schoolFilter || 'all';
  classFilter = classFilter || 'all';
  sortBy = sortBy || 'level';
  
  var container = document.getElementById('spellbookList');
  if (!container) return;
  
  container.innerHTML = '<div style="color:var(--muted);text-align:center;padding:20px;">⏳ Ładowanie księgi zaklęć...</div>';
  
  filterSpells(levelFilter, schoolFilter, classFilter, function(spells) {
    var filtered = spells;
    
    if (filter) {
      filtered = filtered.filter(function(s) {
        return s.name_pl.toLowerCase().includes(filter.toLowerCase()) ||
               s.name_en.toLowerCase().includes(filter.toLowerCase()) ||
               s.desc_pl.toLowerCase().includes(filter.toLowerCase()) ||
               s.desc_en.toLowerCase().includes(filter.toLowerCase());
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
      container.innerHTML = '<div style="color:var(--muted);font-size:.8rem;text-align:center;padding:20px;">📖 Brak zaklęć spełniających kryteria</div>';
      return;
    }
    
    filtered.forEach(function(spell) {
      var div = document.createElement('div');
      var schoolDisplay = SCHOOL_MAP[spell.school] || spell.school;
      var color = SCHOOL_COLORS[schoolDisplay] || { bg: 'rgba(255,255,255,0.05)', border: 'var(--border)', text: 'var(--muted)', glow: 'transparent' };
      
      div.className = 'spellbook-item';
      div.dataset.school = spell.school;
      div.style.borderColor = color.border;
      div.style.boxShadow = '0 0 30px ' + color.glow + ', 0 2px 10px rgba(0,0,0,0.2)';
      
      var levelText = spell.level === 0 ? 'Cantrip' : 'Lvl ' + spell.level;
      
      var classTags = '';
      if (spell.classes) {
        classTags = spell.classes.map(function(c) {
          return '<span class="spellbook-class">' + c + '</span>';
        }).join('');
      }
      
      div.innerHTML = `
        <div class="spellbook-header">
          <span class="spellbook-name" style="color:${color.text};">${spell.name_pl}</span>
          <span style="color:var(--muted);font-weight:400;font-size:var(--font-sm);">(${spell.name_en})</span>
          <span class="spellbook-level">${levelText}</span>
          <span class="spellbook-school-tag" data-school="${spell.school}" style="background:${color.bg};color:${color.text};border-color:${color.border};">${schoolDisplay}</span>
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

document.addEventListener('DOMContentLoaded', function() {
  var searchInput = document.getElementById('spellbookSearch');
  var levelSelect = document.getElementById('spellbookLevel');
  var schoolSelect = document.getElementById('spellbookSchool');
  var classSelect = document.getElementById('spellbookClass');
  var sortSelect = document.getElementById('spellbookSort');
  
  function getSortValue() {
    return sortSelect ? sortSelect.value : 'level';
  }
  
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      renderSpellbook(this.value, levelSelect ? levelSelect.value : 'all', schoolSelect ? schoolSelect.value : 'all', classSelect ? classSelect.value : 'all', getSortValue());
    });
  }
  
  if (levelSelect) {
    levelSelect.addEventListener('change', function() {
      renderSpellbook(searchInput ? searchInput.value : '', this.value, schoolSelect ? schoolSelect.value : 'all', classSelect ? classSelect.value : 'all', getSortValue());
    });
  }
  
  if (schoolSelect) {
    schoolSelect.addEventListener('change', function() {
      renderSpellbook(searchInput ? searchInput.value : '', levelSelect ? levelSelect.value : 'all', this.value, classSelect ? classSelect.value : 'all', getSortValue());
    });
  }
  
  if (classSelect) {
    classSelect.addEventListener('change', function() {
      renderSpellbook(searchInput ? searchInput.value : '', levelSelect ? levelSelect.value : 'all', schoolSelect ? schoolSelect.value : 'all', this.value, getSortValue());
    });
  }
  
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      renderSpellbook(searchInput ? searchInput.value : '', levelSelect ? levelSelect.value : 'all', schoolSelect ? schoolSelect.value : 'all', classSelect ? classSelect.value : 'all', this.value);
    });
  }
  
  renderSpellbook('', 'all', 'all', 'all', 'level');
});

window.renderSpellbook = renderSpellbook;
window.loadSpellLevel = loadSpellLevel;
window.loadAllSpells = loadAllSpells;
window.filterSpells = filterSpells;
window.SCHOOL_MAP = SCHOOL_MAP;
window.SCHOOL_REVERSE = SCHOOL_REVERSE;
window.SCHOOL_COLORS = SCHOOL_COLORS;