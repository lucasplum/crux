// ============================================================
//  SPELLBOOK - LISTA ZAKLĘĆ (nie AOE)
// ============================================================

// ---- LISTA ZAKLĘĆ Z POLSKIMI I ANGIELSKIMI NAZWAMI ----
var SPELLBOOK = [
  // Poziom 0 (Cantripy)
  { name: 'Płomień (Fire Bolt)', level: 0, school: 'Ewokacja', casting: '1 akcja', range: '120 ft', components: 'V, S', duration: 'Błyskawiczny', desc: 'Rzut na trafienie dystansowy, 1k10 obrażeń ogniowych.' },
  { name: 'Magiczna Ręka (Mage Hand)', level: 0, school: 'Czarowanie', casting: '1 akcja', range: '30 ft', components: 'V, S', duration: '1 minuta', desc: 'Tworzy widmową rękę, która może manipulować przedmiotami.' },
  { name: 'Wróżenie (Guidance)', level: 0, school: 'Oczarowanie', casting: '1 akcja', range: 'dotyk', components: 'V, S', duration: '1 minuta', desc: 'Cel dodaje 1k4 do jednego testu umiejętności.' },
  { name: 'Uleczenie Ran (Spare the Dying)', level: 0, school: 'Nekromancja', casting: '1 akcja', range: 'dotyk', components: 'V, S', duration: 'Błyskawiczny', desc: 'Stabilizuje umierającą postać.' },
  
  // Poziom 1
  { name: 'Tarcza (Shield)', level: 1, school: 'Ochrona', casting: 'Reakcja', range: 'osobisty', components: 'V, S', duration: '1 runda', desc: '+5 do AC przeciwko atakowi.' },
  { name: 'Magic Missile', level: 1, school: 'Ewokacja', casting: '1 akcja', range: '120 ft', components: 'V, S', duration: 'Błyskawiczny', desc: '3 pociski po 1k4+1 obrażeń siły.' },
  { name: 'Uleczenie (Cure Wounds)', level: 1, school: 'Oczarowanie', casting: '1 akcja', range: 'dotyk', components: 'V, S', duration: 'Błyskawiczny', desc: 'Leczy 1k8 + mod. rzucającego.' },
  { name: 'Ognista Kula (Burning Hands)', level: 1, school: 'Ewokacja', casting: '1 akcja', range: '15 ft (stożek)', components: 'V, S', duration: 'Błyskawiczny', desc: '3k6 obrażeń ogniowych w stożku 15 ft.' },
  
  // Poziom 2
  { name: 'Niewidzialność (Invisibility)', level: 2, school: 'Iluzja', casting: '1 akcja', range: 'dotyk', components: 'V, S, M', duration: '1 godzina (konc.)', desc: 'Cel staje się niewidzialny.' },
  { name: 'Mistyczny Krok (Misty Step)', level: 2, school: 'Czarowanie', casting: '1 akcja bonusowa', range: 'osobisty', components: 'V', duration: 'Błyskawiczny', desc: 'Teleportujesz się 30 ft.' },
  { name: 'Szept (Suggestion)', level: 2, school: 'Oczarowanie', casting: '1 akcja', range: '30 ft', components: 'V, M', duration: '8 godz. (konc.)', desc: 'Sugerujesz celowi wykonanie czynności.' },
  
  // Poziom 3
  { name: 'Kula Ognia (Fireball)', level: 3, school: 'Ewokacja', casting: '1 akcja', range: '150 ft', components: 'V, S, M', duration: 'Błyskawiczny', desc: '8k6 obrażeń ogniowych w promieniu 20 ft.' },
  { name: 'Kula Lodu (Ice Storm)', level: 3, school: 'Ewokacja', casting: '1 akcja', range: '150 ft', components: 'V, S, M', duration: 'Błyskawiczny', desc: '8k6 obrażeń zimnych w promieniu 20 ft.' },
  { name: 'Haste (Przyspieszenie)', level: 3, school: 'Czarowanie', casting: '1 akcja', range: '30 ft', components: 'V, S, M', duration: '1 minuta (konc.)', desc: 'Cel ma podwójną prędkość, +2 AC, przewagę na rzuty obronne Zręczności.' },
  
  // Poziom 4
  { name: 'Aura Życia (Aura of Life)', level: 4, school: 'Oczarowanie', casting: '1 akcja', range: 'osobisty (30 ft aura)', components: 'V, S', duration: 'koncentracja', desc: 'Aura 30 ft, sojusznicy odzyskują HP co turę.' },
  { name: 'Ściana Ognia (Wall of Fire)', level: 4, school: 'Ewokacja', casting: '1 akcja', range: '120 ft', components: 'V, S, M', duration: 'koncentracja', desc: 'Tworzy ścianę ognia 60 ft.' },
  
  // Poziom 5
  { name: 'Stożek Zimna (Cone of Cold)', level: 5, school: 'Ewokacja', casting: '1 akcja', range: '60 ft (stożek)', components: 'V, S, M', duration: 'Błyskawiczny', desc: '8k6 obrażeń zimnych w stożku 60 ft.' },
  { name: 'Wskrzeszenie (Raise Dead)', level: 5, school: 'Nekromancja', casting: '1 godzina', range: 'dotyk', components: 'V, S, M', duration: 'Błyskawiczny', desc: 'Przywraca zmarłego do życia.' },
  
  // Poziom 6
  { name: 'Promień Światła (Sunbeam)', level: 6, school: 'Ewokacja', casting: '1 akcja', range: 'osobisty (linia 120 ft)', components: 'V, S, M', duration: 'koncentracja', desc: '10k6 obrażeń promieniowania w linii 120 ft.' },
  { name: 'Krąg Ochrony (Circle of Power)', level: 6, school: 'Ochrona', casting: '1 akcja', range: 'osobisty (30 ft aura)', components: 'V, S', duration: 'koncentracja', desc: 'Aura 30 ft, sojusznicy mają przewagę na rzuty obronne.' },
  
  // Poziom 7
  { name: 'Kula Śmierci (Circle of Death)', level: 7, school: 'Nekromancja', casting: '1 akcja', range: '150 ft', components: 'V, S, M', duration: 'Błyskawiczny', desc: '12k6 obrażeń nekrotycznych w promieniu 30 ft.' },
  
  // Poziom 8
  { name: 'Tarcza Światła (Sunburst)', level: 8, school: 'Ewokacja', casting: '1 akcja', range: '150 ft', components: 'V, S, M', duration: 'Błyskawiczny', desc: '12k6 obrażeń promieniowania w promieniu 20 ft.' },
  
  // Poziom 9
  { name: 'Meteor (Meteor Swarm)', level: 9, school: 'Ewokacja', casting: '1 akcja', range: '1 mila', components: 'V, S', duration: 'Błyskawiczny', desc: '20k6 obrażeń ognistych/obuchowych w 4 promieniach 40 ft.' },
  { name: 'Życzenie (Wish)', level: 9, school: 'Czarowanie', casting: '1 akcja', range: 'osobisty', components: 'V', duration: 'Błyskawiczny', desc: 'Zmienia rzeczywistość.' },
];

// ====== RENDER LISTY ZAKLĘĆ ======
function renderSpellbook(filter, levelFilter, schoolFilter) {
  filter = filter || '';
  levelFilter = levelFilter || 'all';
  schoolFilter = schoolFilter || 'all';

  var container = document.getElementById('spellbookList');
  if (!container) return;
  container.innerHTML = '';

  var filtered = SPELLBOOK.filter(function(s) {
    return s.name.toLowerCase().includes(filter.toLowerCase()) ||
           s.desc.toLowerCase().includes(filter.toLowerCase());
  });

  if (levelFilter !== 'all') {
    filtered = filtered.filter(function(s) { return s.level === parseInt(levelFilter); });
  }
  if (schoolFilter !== 'all') {
    filtered = filtered.filter(function(s) { return s.school === schoolFilter; });
  }

  if (filtered.length === 0) {
    container.innerHTML = '<div style="color:var(--muted);font-size:.7rem;text-align:center;padding:20px;">📖 Brak zaklęć spełniających kryteria</div>';
    return;
  }

  filtered.forEach(function(spell) {
    var div = document.createElement('div');
    div.className = 'spellbook-item';
    var levelText = spell.level === 0 ? 'Cantrip' : 'Lvl ' + spell.level;
    div.innerHTML = `
      <div class="spellbook-header">
        <span class="spellbook-name">${spell.name}</span>
        <span class="spellbook-level">${levelText}</span>
        <span class="spellbook-school">${spell.school}</span>
      </div>
      <div class="spellbook-meta">
        <span>⏱️ ${spell.casting}</span>
        <span>📏 ${spell.range}</span>
        <span>🧙 ${spell.components}</span>
        <span>⌛ ${spell.duration}</span>
      </div>
      <div class="spellbook-desc">${spell.desc}</div>
    `;
    container.appendChild(div);
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

  // Render initial
  renderSpellbook();
});

// ====== EKSPORT ======
window.renderSpellbook = renderSpellbook;