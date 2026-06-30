// ============================================================
//  MONSTERS - BESTIARIUSZ CR 6, 7, 8
// ============================================================

var monstersData = [];
var currentMonsterFilter = 'all';
var monsterSearchQuery = '';

// ====== BESTIE CR 6-8 ======
var MONSTERS = [
  // ===== CR 6 =====
  {
    name: 'Chimera',
    cr: 6,
    type: 'Potwór (Chimera)',
    hp: 114,
    ac: 18,
    stats: { str: 19, dex: 12, con: 18, int: 3, wis: 14, cha: 10 },
    actions: [
      { name: 'Wieloatak', desc: 'Wykonuje trzy ataki: jeden kłami, jeden rogami i jeden pazurami.' },
      { name: 'Kły', desc: '+7 do trafienia, zasięg 5 ft, 2k6+4 obrażeń kłutych.' },
      { name: 'Rogi', desc: '+7 do trafienia, zasięg 5 ft, 1k12+4 obrażeń obuchowych.' },
      { name: 'Pazury', desc: '+7 do trafienia, zasięg 5 ft, 2k6+4 obrażeń ciętych.' },
      { name: 'Oddech Ognia (Zasięg 30 ft, stożek)', desc: 'Rzut obronny na Zręczność DC 15, 7k8 obrażeń ogniowych (połowa przy sukcesie).' }
    ],
    desc: 'Potwór z głową lwa, kozła i smoka. Znany z agresji i zdolności ognistego oddechu.'
  },
  {
    name: 'Golem Żelazny',
    cr: 6,
    type: 'Konstrukt (Iron Golem)',
    hp: 120,
    ac: 20,
    stats: { str: 22, dex: 10, con: 20, int: 3, wis: 11, cha: 1 },
    actions: [
      { name: 'Wieloatak', desc: 'Wykonuje dwa ataki mieczem.' },
      { name: 'Miecz', desc: '+8 do trafienia, zasięg 5 ft, 2k8+6 obrażeń ciętych.' },
      { name: 'Zatruty Oddech (Zasięg 15 ft, stożek)', desc: 'Rzut obronny na Kondycję DC 16, 7k6 obrażeń trucizną (połowa przy sukcesie).' }
    ],
    desc: 'Golem wykonany z żelaza. Jest niezwykle wytrzymały i odporny na magię.'
  },
  {
    name: 'Mumia Pani',
    cr: 6,
    type: 'Nieumarły (Mummy Lord)',
    hp: 97,
    ac: 17,
    stats: { str: 16, dex: 10, con: 16, int: 12, wis: 18, cha: 14 },
    actions: [
      { name: 'Wieloatak', desc: 'Wykonuje dwa ataki pięścią lub używa Gniewu Mumii.' },
      { name: 'Pięść', desc: '+5 do trafienia, zasięg 5 ft, 2k6+3 obrażeń obuchowych + 3k6 nekrotycznych.' },
      { name: 'Gniew Mumii (Zasięg 30 ft)', desc: 'Rzut obronny na Mądrość DC 15. Cel jest przerażony na 1 minutę.' }
    ],
    desc: 'Potężna mumia władająca nekromantyczną mocą. Jej dotyk przynosi zgubę.'
  },
  {
    name: 'Meduza',
    cr: 6,
    type: 'Potwór (Medusa)',
    hp: 85,
    ac: 15,
    stats: { str: 10, dex: 15, con: 14, int: 12, wis: 13, cha: 15 },
    actions: [
      { name: 'Wieloatak', desc: 'Wykonuje dwa ataki: jeden sztyletem i jeden wężami.' },
      { name: 'Sztylet', desc: '+5 do trafienia, zasięg 5 ft, 1k4+2 obrażeń kłutych.' },
      { name: 'Węże', desc: '+5 do trafienia, zasięg 5 ft, 1k8+2 obrażeń kłutych + rzut obronny na Kondycję DC 13, 3k6 obrażeń trucizną.' },
      { name: 'Spojrzenie Kamienia (Zasięg 30 ft)', desc: 'Rzut obronny na Kondycję DC 14. Cel jest spetryfikowany.' }
    ],
    desc: 'Potwór z wężami zamiast włosów. Jej spojrzenie zamienia w kamień.'
  },
  {
    name: 'Sfinks Giznacki',
    cr: 6,
    type: 'Potwór (Gynosphinx)',
    hp: 95,
    ac: 17,
    stats: { str: 18, dex: 12, con: 16, int: 18, wis: 18, cha: 18 },
    actions: [
      { name: 'Wieloatak', desc: 'Wykonuje dwa ataki pazurami.' },
      { name: 'Pazury', desc: '+7 do trafienia, zasięg 5 ft, 2k6+4 obrażeń ciętych.' },
      { name: 'Ryk (Zasięg 30 ft)', desc: 'Rzut obronny na Mądrość DC 17. Cel jest przerażony na 1 minutę.' }
    ],
    desc: 'Starożytna istota strzegąca tajemnic. Ma zdolności wieszcze i potężną wiedzę.'
  },
  {
    name: 'Wyższy Elemental Ognia',
    cr: 6,
    type: 'Elemental (Fire Elemental)',
    hp: 102,
    ac: 16,
    stats: { str: 14, dex: 18, con: 16, int: 6, wis: 12, cha: 8 },
    actions: [
      { name: 'Wieloatak', desc: 'Wykonuje dwa ataki ognistym dotykiem.' },
      { name: 'Ognisty Dotyk', desc: '+7 do trafienia, zasięg 5 ft, 2k8+4 obrażeń ogniowych.' },
      { name: 'Płonąca Chmura (Zasięg 10 ft)', desc: 'Rzut obronny na Kondycję DC 14, 5k6 obrażeń ogniowych.' }
    ],
    desc: 'Ogromna istota czystego ognia. Parzy wszystko wokół i jest odporna na ogień.'
  },

  // ===== CR 7 =====
  {
    name: 'Behir',
    cr: 7,
    type: 'Potwór (Behir)',
    hp: 120,
    ac: 17,
    stats: { str: 21, dex: 12, con: 18, int: 6, wis: 12, cha: 8 },
    actions: [
      { name: 'Wieloatak', desc: 'Wykonuje trzy ataki: jeden ugryzieniem i dwa pazurami.' },
      { name: 'Ugryzienie', desc: '+8 do trafienia, zasięg 10 ft, 2k10+5 obrażeń kłutych.' },
      { name: 'Pazury', desc: '+8 do trafienia, zasięg 5 ft, 2k6+5 obrażeń ciętych.' },
      { name: 'Oddech Błyskawicy (Zasięg 30 ft, linia)', desc: 'Rzut obronny na Zręczność DC 16, 8k6 obrażeń elektrycznych (połowa przy sukcesie).' }
    ],
    desc: 'Wielki wężopodobny potwór z nogami i pazurami. Atakuje błyskawicami.'
  },
  {
    name: 'Golem Kamienny',
    cr: 7,
    type: 'Konstrukt (Stone Golem)',
    hp: 150,
    ac: 19,
    stats: { str: 20, dex: 10, con: 20, int: 3, wis: 11, cha: 1 },
    actions: [
      { name: 'Wieloatak', desc: 'Wykonuje dwa ataki pięścią.' },
      { name: 'Pięść', desc: '+8 do trafienia, zasięg 5 ft, 2k10+5 obrażeń obuchowych.' },
      { name: 'Zwolnienie (Zasięg 5 ft)', desc: 'Rzut obronny na Mądrość DC 15. Cel jest spowolniony na 1 minutę.' }
    ],
    desc: 'Potężny golem z kamienia. Jest prawie niezniszczalny i może spowalniać wrogów.'
  },
  {
    name: 'Młody Smok Miedziany',
    cr: 7,
    type: 'Smok (Young Copper Dragon)',
    hp: 119,
    ac: 18,
    stats: { str: 18, dex: 12, con: 18, int: 14, wis: 12, cha: 16 },
    actions: [
      { name: 'Wieloatak', desc: 'Wykonuje trzy ataki: jeden ugryzieniem i dwa pazurami.' },
      { name: 'Ugryzienie', desc: '+7 do trafienia, zasięg 10 ft, 2k10+4 obrażeń kłutych.' },
      { name: 'Pazury', desc: '+7 do trafienia, zasięg 5 ft, 2k6+4 obrażeń ciętych.' },
      { name: 'Oddech Kwasu (Zasięg 30 ft, stożek)', desc: 'Rzut obronny na Zręczność DC 16, 8k6 obrażeń kwasem (połowa przy sukcesie).' }
    ],
    desc: 'Młody smok miedziany, zwinny i żartobliwy. Atakuje kwasem i pazurami.'
  },
  {
    name: 'Nocny Koszmar',
    cr: 7,
    type: 'Potwór (Nightmare)',
    hp: 105,
    ac: 16,
    stats: { str: 19, dex: 14, con: 16, int: 10, wis: 13, cha: 12 },
    actions: [
      { name: 'Wieloatak', desc: 'Wykonuje dwa ataki kopytami.' },
      { name: 'Kopyta', desc: '+7 do trafienia, zasięg 5 ft, 2k8+4 obrażeń obuchowych.' },
      { name: 'Ogniste Kopyta (Zasięg 5 ft)', desc: 'Rzut obronny na Zręczność DC 15. 2k6 obrażeń ogniowych.' }
    ],
    desc: 'Złe widmo konia, które siało strach i koszmary w snach swoich ofiar.'
  },
  {
    name: 'Szczur Olbrzymi (Długi Ząb)',
    cr: 7,
    type: 'Bestia (Giant Rat)',
    hp: 80,
    ac: 14,
    stats: { str: 18, dex: 14, con: 16, int: 4, wis: 10, cha: 6 },
    actions: [
      { name: 'Wieloatak', desc: 'Wykonuje dwa ataki ugryzieniem.' },
      { name: 'Ugryzienie', desc: '+7 do trafienia, zasięg 5 ft, 2k6+4 obrażeń kłutych.' }
    ],
    desc: 'Ogromny szczur, który żyje w podziemiach i atakuje w stadach.'
  },

  // ===== CR 8 =====
  {
    name: 'Golem Złoty',
    cr: 8,
    type: 'Konstrukt (Golden Golem)',
    hp: 170,
    ac: 20,
    stats: { str: 24, dex: 10, con: 22, int: 3, wis: 12, cha: 4 },
    actions: [
      { name: 'Wieloatak', desc: 'Wykonuje dwa ataki mieczem.' },
      { name: 'Miecz', desc: '+10 do trafienia, zasięg 5 ft, 2k8+7 obrażeń ciętych.' },
      { name: 'Oślepiający Blask (Zasięg 30 ft)', desc: 'Rzut obronny na Kondycję DC 17. Cel jest oślepiony na 1 minutę.' }
    ],
    desc: 'Golem wykonany z czystego złota. Jest niezwykle wytrzymały i może oślepiać wrogów.'
  },
  {
    name: 'Młody Smok Szmaragdowy',
    cr: 8,
    type: 'Smok (Young Emerald Dragon)',
    hp: 142,
    ac: 19,
    stats: { str: 20, dex: 12, con: 19, int: 16, wis: 14, cha: 18 },
    actions: [
      { name: 'Wieloatak', desc: 'Wykonuje trzy ataki: jeden ugryzieniem i dwa pazurami.' },
      { name: 'Ugryzienie', desc: '+8 do trafienia, zasięg 10 ft, 2k10+5 obrażeń kłutych.' },
      { name: 'Pazury', desc: '+8 do trafienia, zasięg 5 ft, 2k6+5 obrażeń ciętych.' },
      { name: 'Oddech Kwasu (Zasięg 30 ft, stożek)', desc: 'Rzut obronny na Zręczność DC 17, 9k6 obrażeń kwasem (połowa przy sukcesie).' }
    ],
    desc: 'Młody smok szmaragdowy, zwinny i inteligentny. Atakuje kwasem i pazurami.'
  },
  {
    name: 'Ogniowy Olbrzym',
    cr: 8,
    type: 'Olbrzym (Fire Giant)',
    hp: 160,
    ac: 18,
    stats: { str: 23, dex: 10, con: 20, int: 10, wis: 12, cha: 8 },
    actions: [
      { name: 'Wieloatak', desc: 'Wykonuje dwa ataki mieczem.' },
      { name: 'Miecz', desc: '+9 do trafienia, zasięg 10 ft, 2k8+6 obrażeń ciętych.' },
      { name: 'Rzucanie Kamieniem (Zasięg 60 ft)', desc: '+9 do trafienia, 2k10+6 obrażeń obuchowych.' }
    ],
    desc: 'Potężny olbrzym zbrojony w ogień i stal. Jest głównym wojownikiem w armii olbrzymów.'
  },
  {
    name: 'Widmo (Duchy)',
    cr: 8,
    type: 'Nieumarły (Ghost)',
    hp: 110,
    ac: 16,
    stats: { str: 7, dex: 15, con: 14, int: 16, wis: 18, cha: 18 },
    actions: [
      { name: 'Wieloatak', desc: 'Wykonuje dwa ataki dotykiem.' },
      { name: 'Dotyk', desc: '+7 do trafienia, zasięg 5 ft, 4k6 obrażeń nekrotycznych.' },
      { name: 'Strach (Zasięg 30 ft)', desc: 'Rzut obronny na Mądrość DC 17. Cel jest przerażony na 1 minutę.' }
    ],
    desc: 'Złe widmo, które straszy i atakuje żywych. Może przerażać swoją obecnością.'
  },
  {
    name: 'Wyższy Demon Ognia',
    cr: 8,
    type: 'Demon (Fire Demon)',
    hp: 135,
    ac: 17,
    stats: { str: 18, dex: 16, con: 18, int: 14, wis: 14, cha: 16 },
    actions: [
      { name: 'Wieloatak', desc: 'Wykonuje trzy ataki: dwa pazurami i jeden ugryzieniem.' },
      { name: 'Pazury', desc: '+8 do trafienia, zasięg 5 ft, 2k6+4 obrażeń ciętych.' },
      { name: 'Ugryzienie', desc: '+8 do trafienia, zasięg 5 ft, 2k10+4 obrażeń kłutych.' },
      { name: 'Ognista Kula (Zasięg 60 ft)', desc: 'Rzut obronny na Zręczność DC 16, 8k6 obrażeń ogniowych.' }
    ],
    desc: 'Potężny demon ognia, który siał zniszczenie w płomieniach. Jest odporny na ogień.'
  }
];

// ====== RENDER ======
function renderMonsters(filter, query) {
  filter = filter || 'all';
  query = query || '';

  var container = document.getElementById('monsterGrid');
  if (!container) return;

  var filtered = MONSTERS;

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
    container.innerHTML = '<div style="color:var(--muted);text-align:center;padding:30px;font-size:var(--font-sm);">🐉 Brak potworów spełniających kryteria</div>';
    return;
  }

  container.innerHTML = '';
  filtered.forEach(function(m) {
    var div = document.createElement('div');
    div.className = 'monster-card';
    div.style.borderColor = getCRColor(m.cr);

    var actionsHtml = m.actions.map(function(a) {
      return '<div class="m-action"><strong>' + a.name + '</strong> — ' + a.desc + '</div>';
    }).join('');

    div.innerHTML = `
      <div class="m-header">
        <span class="m-name">${m.name}</span>
        <span class="m-cr" style="border-color:${getCRColor(m.cr)};color:${getCRColor(m.cr)};">CR ${m.cr}</span>
      </div>
      <div class="m-type">${m.type}</div>
      <div class="m-stats">
        <span>❤️ ${m.hp} HP</span>
        <span>🛡️ ${m.ac} AC</span>
        <span>💪 ${m.stats.str}</span>
        <span>🏃 ${m.stats.dex}</span>
        <span>❤️‍🔥 ${m.stats.con}</span>
      </div>
      <div class="m-desc">${m.desc}</div>
      <div class="m-actions">${actionsHtml}</div>
      <button class="m-add-btn" onclick="addMonsterToCombat('${m.name.replace(/'/g, "\\'")}', ${m.cr}, ${m.hp}, ${m.ac}, '${m.type}')">
        ⚔️ Dodaj do potyczki
      </button>
    `;
    container.appendChild(div);
  });
}

function getCRColor(cr) {
  var colors = {
    6: '#6bb8ff',
    7: '#d4a843',
    8: '#ff6b6b'
  };
  return colors[cr] || 'var(--border)';
}

// ====== FILTRY ======
function filterMonsters(cr) {
  currentMonsterFilter = cr;
  var searchInput = document.getElementById('monsterSearch');
  var query = searchInput ? searchInput.value : '';
  renderMonsters(cr, query);
}

// ====== DODAWANIE DO POTYCZKI ======
function addMonsterToCombat(name, cr, hp, ac, type) {
  if (typeof addCombatant !== 'function') {
    alert('Moduł potyczki nie jest dostępny!');
    return;
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

  playSound('add');

  // Przełącz na zakładkę Potyczka
  var combatTab = document.querySelector('.nav-btn[data-tab="combat"]');
  if (combatTab) combatTab.click();
}

// ====== EVENTY ======
document.addEventListener('DOMContentLoaded', function() {
  var searchInput = document.getElementById('monsterSearch');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      var query = this.value;
      renderMonsters(currentMonsterFilter, query);
    });
  }

  renderMonsters('all', '');
});

// ====== EKSPORT ======
window.renderMonsters = renderMonsters;
window.filterMonsters = filterMonsters;
window.addMonsterToCombat = addMonsterToCombat;
window.MONSTERS = MONSTERS;