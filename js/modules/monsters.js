// ============================================================
//  MONSTERS - PEŁNE STATYSTYKI, KARTA NA CAŁY EKRAN
// ============================================================

var monstersData = [];
var currentMonsterFilter = 'all';
var monsterSearchQuery = '';
var selectedMonster = null;

// ====== BESTIE CR 6-8 Z PEŁNYMI STATYSTYKAMI ======
var MONSTERS = [
  // ===== CR 6 =====
  {
    name: 'Chimera',
    cr: 6,
    type: 'Potwór (Chimera)',
    hp: 114,
    ac: 18,
    speed: '30 ft, latanie 60 ft',
    stats: { str: 19, dex: 12, con: 18, int: 3, wis: 14, cha: 10 },
    saves: { dex: 4, con: 7, wis: 5 },
    skills: { percep: 6 },
    resistances: ['ogień', 'kwas', 'zimno', 'elektryczność'],
    immunities: ['strach'],
    languages: ['rozumie Draconic, nie mówi'],
    actions: [
      { name: 'Wieloatak', desc: 'Wykonuje trzy ataki: jeden kłami, jeden rogami i jeden pazurami.' },
      { name: 'Kły', desc: 'Atak bronią: +7 do trafienia, zasięg 5 ft, 2k6+4 obrażeń kłutych.' },
      { name: 'Rogi', desc: 'Atak bronią: +7 do trafienia, zasięg 5 ft, 1k12+4 obrażeń obuchowych.' },
      { name: 'Pazury', desc: 'Atak bronią: +7 do trafienia, zasięg 5 ft, 2k6+4 obrażeń ciętych.' },
      { name: 'Oddech Ognia (Zasięg 30 ft, stożek)', desc: 'Rzut obronny na Zręczność DC 15. 7k8 obrażeń ogniowych (połowa przy sukcesie). Odnowienie na 5-6.' }
    ],
    desc: 'Potwór z głową lwa, kozła i smoka. Znany z agresji i zdolności ognistego oddechu.'
  },
  {
    name: 'Golem Żelazny',
    cr: 6,
    type: 'Konstrukt (Iron Golem)',
    hp: 120,
    ac: 20,
    speed: '25 ft',
    stats: { str: 22, dex: 10, con: 20, int: 3, wis: 11, cha: 1 },
    saves: { con: 8, wis: 3 },
    skills: {},
    resistances: ['kwas', 'zimno', 'elektryczność'],
    immunities: ['ogień', 'trucizna', 'psychiczne', 'czary'],
    languages: ['nie mówi'],
    actions: [
      { name: 'Wieloatak', desc: 'Wykonuje dwa ataki mieczem.' },
      { name: 'Miecz', desc: 'Atak bronią: +8 do trafienia, zasięg 5 ft, 2k8+6 obrażeń ciętych.' },
      { name: 'Zatruty Oddech (Zasięg 15 ft, stożek)', desc: 'Rzut obronny na Kondycję DC 16. 7k6 obrażeń trucizną (połowa przy sukcesie). Odnowienie na 6.' }
    ],
    desc: 'Golem wykonany z żelaza. Jest niezwykle wytrzymały i odporny na magię.'
  },
  {
    name: 'Mumia Pani',
    cr: 6,
    type: 'Nieumarły (Mummy Lord)',
    hp: 97,
    ac: 17,
    speed: '20 ft',
    stats: { str: 16, dex: 10, con: 16, int: 12, wis: 18, cha: 14 },
    saves: { wis: 7, cha: 5 },
    skills: { rel: 6, hist: 4 },
    resistances: ['ogień', 'zimno'],
    immunities: ['trucizna', 'strach', 'czary'],
    languages: ['rozumie Common, mówi Common'],
    actions: [
      { name: 'Wieloatak', desc: 'Wykonuje dwa ataki pięścią lub używa Gniewu Mumii.' },
      { name: 'Pięść', desc: 'Atak bronią: +5 do trafienia, zasięg 5 ft, 2k6+3 obrażeń obuchowych + 3k6 nekrotycznych.' },
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
    speed: '30 ft',
    stats: { str: 10, dex: 15, con: 14, int: 12, wis: 13, cha: 15 },
    saves: { dex: 5, cha: 5 },
    skills: { percepcja: 4, skradanie: 5 },
    resistances: [],
    immunities: [],
    languages: ['rozumie Common, mówi Common'],
    actions: [
      { name: 'Wieloatak', desc: 'Wykonuje dwa ataki: jeden sztyletem i jeden wężami.' },
      { name: 'Sztylet', desc: 'Atak bronią: +5 do trafienia, zasięg 5 ft, 1k4+2 obrażeń kłutych.' },
      { name: 'Węże', desc: 'Atak bronią: +5 do trafienia, zasięg 5 ft, 1k8+2 obrażeń kłutych + rzut obronny na Kondycję DC 13, 3k6 obrażeń trucizną.' },
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
    speed: '40 ft, latanie 60 ft',
    stats: { str: 18, dex: 12, con: 16, int: 18, wis: 18, cha: 18 },
    saves: { wis: 7, cha: 7 },
    skills: { percepcja: 7, religia: 7, historia: 7 },
    resistances: ['psychiczne'],
    immunities: ['strach'],
    languages: ['rozumie Common, Sphinx, mówi Common, Sphinx'],
    actions: [
      { name: 'Wieloatak', desc: 'Wykonuje dwa ataki pazurami.' },
      { name: 'Pazury', desc: 'Atak bronią: +7 do trafienia, zasięg 5 ft, 2k6+4 obrażeń ciętych.' },
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
    speed: '30 ft, latanie 40 ft',
    stats: { str: 14, dex: 18, con: 16, int: 6, wis: 12, cha: 8 },
    saves: { dex: 7, con: 6 },
    skills: {},
    resistances: ['ogień', 'kwas', 'zimno', 'elektryczność'],
    immunities: ['trucizna', 'strach'],
    languages: ['rozumie Ignan, nie mówi'],
    actions: [
      { name: 'Wieloatak', desc: 'Wykonuje dwa ataki ognistym dotykiem.' },
      { name: 'Ognisty Dotyk', desc: 'Atak bronią: +7 do trafienia, zasięg 5 ft, 2k8+4 obrażeń ogniowych.' },
      { name: 'Płonąca Chmura (Zasięg 10 ft)', desc: 'Rzut obronny na Kondycję DC 14. 5k6 obrażeń ogniowych.' }
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
    speed: '40 ft, wspinaczka 30 ft',
    stats: { str: 21, dex: 12, con: 18, int: 6, wis: 12, cha: 8 },
    saves: { str: 8, con: 7 },
    skills: { percepcja: 4 },
    resistances: ['elektryczność'],
    immunities: [],
    languages: ['rozumie Draconic, nie mówi'],
    actions: [
      { name: 'Wieloatak', desc: 'Wykonuje trzy ataki: jeden ugryzieniem i dwa pazurami.' },
      { name: 'Ugryzienie', desc: 'Atak bronią: +8 do trafienia, zasięg 10 ft, 2k10+5 obrażeń kłutych.' },
      { name: 'Pazury', desc: 'Atak bronią: +8 do trafienia, zasięg 5 ft, 2k6+5 obrażeń ciętych.' },
      { name: 'Oddech Błyskawicy (Zasięg 30 ft, linia)', desc: 'Rzut obronny na Zręczność DC 16. 8k6 obrażeń elektrycznych (połowa przy sukcesie). Odnowienie na 5-6.' }
    ],
    desc: 'Wielki wężopodobny potwór z nogami i pazurami. Atakuje błyskawicami.'
  },
  {
    name: 'Golem Kamienny',
    cr: 7,
    type: 'Konstrukt (Stone Golem)',
    hp: 150,
    ac: 19,
    speed: '25 ft',
    stats: { str: 20, dex: 10, con: 20, int: 3, wis: 11, cha: 1 },
    saves: { con: 8, wis: 3 },
    skills: {},
    resistances: ['kwas', 'zimno', 'elektryczność'],
    immunities: ['trucizna', 'psychiczne', 'czary'],
    languages: ['nie mówi'],
    actions: [
      { name: 'Wieloatak', desc: 'Wykonuje dwa ataki pięścią.' },
      { name: 'Pięść', desc: 'Atak bronią: +8 do trafienia, zasięg 5 ft, 2k10+5 obrażeń obuchowych.' },
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
    speed: '40 ft, latanie 80 ft, wspinaczka 30 ft',
    stats: { str: 18, dex: 12, con: 18, int: 14, wis: 12, cha: 16 },
    saves: { dex: 4, con: 7, wis: 4, cha: 6 },
    skills: { percepcja: 7, skradanie: 4, religia: 5 },
    resistances: ['kwas'],
    immunities: [],
    languages: ['rozumie Common, Draconic, mówi Common, Draconic'],
    actions: [
      { name: 'Wieloatak', desc: 'Wykonuje trzy ataki: jeden ugryzieniem i dwa pazurami.' },
      { name: 'Ugryzienie', desc: 'Atak bronią: +7 do trafienia, zasięg 10 ft, 2k10+4 obrażeń kłutych.' },
      { name: 'Pazury', desc: 'Atak bronią: +7 do trafienia, zasięg 5 ft, 2k6+4 obrażeń ciętych.' },
      { name: 'Oddech Kwasu (Zasięg 30 ft, stożek)', desc: 'Rzut obronny na Zręczność DC 16. 8k6 obrażeń kwasem (połowa przy sukcesie). Odnowienie na 5-6.' }
    ],
    desc: 'Młody smok miedziany, zwinny i żartobliwy. Atakuje kwasem i pazurami.'
  },
  {
    name: 'Nocny Koszmar',
    cr: 7,
    type: 'Potwór (Nightmare)',
    hp: 105,
    ac: 16,
    speed: '60 ft, latanie 90 ft',
    stats: { str: 19, dex: 14, con: 16, int: 10, wis: 13, cha: 12 },
    saves: { dex: 5, con: 6, wis: 4 },
    skills: { percepcja: 4 },
    resistances: ['ogień'],
    immunities: ['strach'],
    languages: ['rozumie Common, Infernal, nie mówi'],
    actions: [
      { name: 'Wieloatak', desc: 'Wykonuje dwa ataki kopytami.' },
      { name: 'Kopyta', desc: 'Atak bronią: +7 do trafienia, zasięg 5 ft, 2k8+4 obrażeń obuchowych.' },
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
    speed: '40 ft, wspinaczka 30 ft',
    stats: { str: 18, dex: 14, con: 16, int: 4, wis: 10, cha: 6 },
    saves: { dex: 5, con: 6 },
    skills: { skradanie: 5 },
    resistances: [],
    immunities: [],
    languages: ['nie mówi'],
    actions: [
      { name: 'Wieloatak', desc: 'Wykonuje dwa ataki ugryzieniem.' },
      { name: 'Ugryzienie', desc: 'Atak bronią: +7 do trafienia, zasięg 5 ft, 2k6+4 obrażeń kłutych.' }
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
    speed: '25 ft',
    stats: { str: 24, dex: 10, con: 22, int: 3, wis: 12, cha: 4 },
    saves: { str: 10, con: 9, wis: 4 },
    skills: {},
    resistances: ['kwas', 'zimno', 'elektryczność'],
    immunities: ['ogień', 'trucizna', 'psychiczne', 'czary'],
    languages: ['nie mówi'],
    actions: [
      { name: 'Wieloatak', desc: 'Wykonuje dwa ataki mieczem.' },
      { name: 'Miecz', desc: 'Atak bronią: +10 do trafienia, zasięg 5 ft, 2k8+7 obrażeń ciętych.' },
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
    speed: '40 ft, latanie 80 ft',
    stats: { str: 20, dex: 12, con: 19, int: 16, wis: 14, cha: 18 },
    saves: { dex: 4, con: 7, wis: 5, cha: 7 },
    skills: { percepcja: 8, religia: 6, historia: 6 },
    resistances: ['kwas'],
    immunities: [],
    languages: ['rozumie Common, Draconic, mówi Common, Draconic'],
    actions: [
      { name: 'Wieloatak', desc: 'Wykonuje trzy ataki: jeden ugryzieniem i dwa pazurami.' },
      { name: 'Ugryzienie', desc: 'Atak bronią: +8 do trafienia, zasięg 10 ft, 2k10+5 obrażeń kłutych.' },
      { name: 'Pazury', desc: 'Atak bronią: +8 do trafienia, zasięg 5 ft, 2k6+5 obrażeń ciętych.' },
      { name: 'Oddech Kwasu (Zasięg 30 ft, stożek)', desc: 'Rzut obronny na Zręczność DC 17. 9k6 obrażeń kwasem (połowa przy sukcesie). Odnowienie na 5-6.' }
    ],
    desc: 'Młody smok szmaragdowy, zwinny i inteligentny. Atakuje kwasem i pazurami.'
  },
  {
    name: 'Ogniowy Olbrzym',
    cr: 8,
    type: 'Olbrzym (Fire Giant)',
    hp: 160,
    ac: 18,
    speed: '30 ft',
    stats: { str: 23, dex: 10, con: 20, int: 10, wis: 12, cha: 8 },
    saves: { str: 9, con: 8, wis: 4 },
    skills: { atletyka: 9, percepcja: 4 },
    resistances: ['ogień'],
    immunities: [],
    languages: ['rozumie Giant, mówi Giant'],
    actions: [
      { name: 'Wieloatak', desc: 'Wykonuje dwa ataki mieczem.' },
      { name: 'Miecz', desc: 'Atak bronią: +9 do trafienia, zasięg 10 ft, 2k8+6 obrażeń ciętych.' },
      { name: 'Rzucanie Kamieniem (Zasięg 60 ft)', desc: 'Atak bronią: +9 do trafienia, 2k10+6 obrażeń obuchowych.' }
    ],
    desc: 'Potężny olbrzym zbrojony w ogień i stal. Jest głównym wojownikiem w armii olbrzymów.'
  },
  {
    name: 'Widmo (Duchy)',
    cr: 8,
    type: 'Nieumarły (Ghost)',
    hp: 110,
    ac: 16,
    speed: '30 ft, latanie 30 ft (unoszenie)',
    stats: { str: 7, dex: 15, con: 14, int: 16, wis: 18, cha: 18 },
    saves: { wis: 7, cha: 7 },
    skills: { percepcja: 7, skradanie: 5, religia: 6 },
    resistances: ['kwas', 'zimno', 'ogień', 'elektryczność'],
    immunities: ['trucizna', 'psychiczne', 'strach'],
    languages: ['rozumie wszystkie, mówi wszystkie (telepatia)'],
    actions: [
      { name: 'Wieloatak', desc: 'Wykonuje dwa ataki dotykiem.' },
      { name: 'Dotyk', desc: 'Atak bronią: +7 do trafienia, zasięg 5 ft, 4k6 obrażeń nekrotycznych.' },
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
    speed: '35 ft, latanie 40 ft',
    stats: { str: 18, dex: 16, con: 18, int: 14, wis: 14, cha: 16 },
    saves: { str: 7, dex: 6, con: 7, wis: 5 },
    skills: { percepcja: 5, religia: 5 },
    resistances: ['ogień', 'zimno', 'kwas'],
    immunities: ['trucizna'],
    languages: ['rozumie Abyssal, Infernal, mówi Abyssal, Infernal'],
    actions: [
      { name: 'Wieloatak', desc: 'Wykonuje trzy ataki: dwa pazurami i jeden ugryzieniem.' },
      { name: 'Pazury', desc: 'Atak bronią: +8 do trafienia, zasięg 5 ft, 2k6+4 obrażeń ciętych.' },
      { name: 'Ugryzienie', desc: 'Atak bronią: +8 do trafienia, zasięg 5 ft, 2k10+4 obrażeń kłutych.' },
      { name: 'Ognista Kula (Zasięg 60 ft)', desc: 'Rzut obronny na Zręczność DC 16. 8k6 obrażeń ogniowych (połowa przy sukcesie). Odnowienie na 5-6.' }
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
    var crColor = getCRColor(m.cr);
    div.style.borderColor = crColor;

    div.innerHTML = `
      <div class="m-header" onclick="openMonsterDetail('${m.name.replace(/'/g, "\\'")}')" style="cursor:pointer;">
        <span class="m-name" style="color:${crColor};">${m.name}</span>
        <span class="m-cr" style="border-color:${crColor};color:${crColor};">CR ${m.cr}</span>
      </div>
      <div class="m-type">${m.type}</div>
      <div class="m-stats">
        <span>❤️ ${m.hp} HP</span>
        <span>🛡️ ${m.ac} AC</span>
        <span>💨 ${m.speed}</span>
      </div>
      <div style="display:flex;gap:3px;flex-wrap:wrap;margin:4px 0;">
        ${Object.keys(m.stats).map(function(k) {
          var labels = { str: '💪', dex: '🏃', con: '❤️‍🔥', int: '🧠', wis: '👁️', cha: '💬' };
          return '<span style="font-size:0.6rem;background:var(--card3);padding:1px 6px;border-radius:4px;border:1px solid var(--border);">' + labels[k] + ' ' + m.stats[k] + '</span>';
        }).join('')}
      </div>
      <div class="m-desc">${m.desc}</div>
      <button class="m-add-btn" onclick="event.stopPropagation();addMonsterToCombat('${m.name.replace(/'/g, "\\'")}', ${m.cr}, ${m.hp}, ${m.ac}, '${m.type}')">
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
  
  document.querySelectorAll('[id^="filter"]').forEach(function(btn) {
    btn.classList.remove('active');
  });
  if (cr === 'all') {
    var allBtn = document.getElementById('filterAll');
    if (allBtn) allBtn.classList.add('active');
  } else {
    var btn = document.getElementById('filter' + cr);
    if (btn) btn.classList.add('active');
  }
}

// ====== OTWÓRZ SZCZEGÓŁY POTWORA ======
function openMonsterDetail(name) {
  var monster = MONSTERS.find(function(m) { return m.name === name; });
  if (!monster) return;
  
  selectedMonster = monster;
  
  var popup = document.getElementById('monsterDetailPopup');
  var title = document.getElementById('monsterDetailName');
  var body = document.getElementById('monsterDetailBody');
  
  if (!popup || !title || !body) return;
  
  var crColor = getCRColor(monster.cr);
  var attrLabels = { str: 'Siła', dex: 'Zręczność', con: 'Kondycja', int: 'Inteligencja', wis: 'Mądrość', cha: 'Charyzma' };
  var attrIcons = { str: '💪', dex: '🏃', con: '❤️‍🔥', int: '🧠', wis: '👁️', cha: '💬' };
  
  // Atrybuty
  var attrHtml = Object.keys(monster.stats).map(function(k) {
    var mod = Math.floor((monster.stats[k] - 10) / 2);
    var modStr = mod >= 0 ? '+' + mod : '' + mod;
    return '<div class="m-attr-item"><div class="label">' + attrIcons[k] + ' ' + attrLabels[k] + '</div><div class="value">' + monster.stats[k] + ' (' + modStr + ')</div></div>';
  }).join('');
  
  // Rzuty obronne
  var savesHtml = '';
  if (monster.saves && Object.keys(monster.saves).length > 0) {
    var saveLabels = { str: 'Siła', dex: 'Zręczność', con: 'Kondycja', int: 'Inteligencja', wis: 'Mądrość', cha: 'Charyzma' };
    savesHtml = Object.keys(monster.saves).map(function(k) {
      var val = monster.saves[k];
      var mod = val >= 0 ? '+' + val : '' + val;
      return '<span class="m-tag">' + saveLabels[k] + ': ' + mod + '</span>';
    }).join('');
  }
  
  // Skille
  var skillsHtml = '';
  if (monster.skills && Object.keys(monster.skills).length > 0) {
    var skillLabels = { 
      percepcja: 'Percepcja', skradanie: 'Skradanie', atletyka: 'Atletyka', 
      religia: 'Religia', historia: 'Historia', rel: 'Religia'
    };
    skillsHtml = Object.keys(monster.skills).map(function(k) {
      var val = monster.skills[k];
      var mod = val >= 0 ? '+' + val : '' + val;
      var label = skillLabels[k] || k;
      return '<span class="m-tag skill">' + label + ': ' + mod + '</span>';
    }).join('');
  }
  
  // Odporności
  var resistancesHtml = '';
  if (monster.resistances && monster.resistances.length > 0) {
    resistancesHtml = monster.resistances.map(function(r) {
      return '<span class="m-tag resistance">🛡️ ' + r + '</span>';
    }).join('');
  }
  
  // Immunitety
  var immunitiesHtml = '';
  if (monster.immunities && monster.immunities.length > 0) {
    immunitiesHtml = monster.immunities.map(function(i) {
      return '<span class="m-tag immunity">⛔ ' + i + '</span>';
    }).join('');
  }
  
  // Języki
  var languagesHtml = '';
  if (monster.languages) {
    languagesHtml = '<span class="m-tag language">🗣️ ' + monster.languages + '</span>';
  }
  
  // Akcje
  var actionsHtml = monster.actions.map(function(a) {
    return '<div class="m-action-item"><div class="action-name">⚔️ ' + a.name + '</div><div class="action-desc">' + a.desc + '</div></div>';
  }).join('');
  
  body.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;margin-bottom:8px;">
      <span style="font-size:var(--font-sm);color:var(--muted);">${monster.type}</span>
      <span class="m-cr-badge" style="border-color:${crColor};color:${crColor};">CR ${monster.cr}</span>
    </div>
    
    <div class="m-stat-grid">
      <div class="m-stat-item"><div class="label">❤️ PW</div><div class="value">${monster.hp}</div></div>
      <div class="m-stat-item"><div class="label">🛡️ KP</div><div class="value">${monster.ac}</div></div>
      <div class="m-stat-item"><div class="label">💨 Prędkość</div><div class="value" style="font-size:var(--font-sm);">${monster.speed}</div></div>
    </div>
    
    <div style="font-size:0.7rem;color:var(--muted);margin:4px 0;">📊 Atrybuty</div>
    <div class="m-attr-grid">${attrHtml}</div>
    
    ${savesHtml ? '<div style="font-size:0.7rem;color:var(--muted);margin:4px 0;">🛡️ Rzuty obronne</div><div class="m-tags">' + savesHtml + '</div>' : ''}
    ${skillsHtml ? '<div style="font-size:0.7rem;color:var(--muted);margin:4px 0;">🎯 Umiejętności</div><div class="m-tags">' + skillsHtml + '</div>' : ''}
    ${resistancesHtml ? '<div style="font-size:0.7rem;color:var(--muted);margin:4px 0;">🛡️ Odporności</div><div class="m-tags">' + resistancesHtml + '</div>' : ''}
    ${immunitiesHtml ? '<div style="font-size:0.7rem;color:var(--muted);margin:4px 0;">⛔ Immunitety</div><div class="m-tags">' + immunitiesHtml + '</div>' : ''}
    ${languagesHtml ? '<div style="font-size:0.7rem;color:var(--muted);margin:4px 0;">🗣️ Języki</div><div class="m-tags">' + languagesHtml + '</div>' : ''}
    
    <div style="font-size:0.7rem;color:var(--muted);margin:8px 0 4px;">⚔️ Akcje</div>
    <div class="m-action-list">${actionsHtml}</div>
    
    <div class="m-desc-text">${monster.desc}</div>
  `;
  
  title.textContent = '🐉 ' + monster.name;
  popup.style.display = 'flex';
}

function closeMonsterDetail() {
  var popup = document.getElementById('monsterDetailPopup');
  if (popup) popup.style.display = 'none';
  selectedMonster = null;
}

// ====== DODAWANIE DO POTYCZKI Z KARTY ======
function addMonsterDetailToCombat() {
  if (!selectedMonster) return;
  addMonsterToCombat(selectedMonster.name, selectedMonster.cr, selectedMonster.hp, selectedMonster.ac, selectedMonster.type);
  closeMonsterDetail();
}

// ====== DODAWANIE JAKO KOMPAN ======
function addMonsterDetailAsCompanion() {
  if (!selectedMonster) return;
  if (typeof players === 'undefined' || players.length === 0) {
    alert('Dodaj najpierw gracza, do którego chcesz przypisać kompana!');
    return;
  }
  
  var names = players.map(function(p, i) {
    return (i + 1) + '. ' + p.name + ' (' + p.role + ')';
  }).join('\n');
  
  var choice = prompt('Wybierz gracza dla kompana:\n' + names + '\n\nWpisz numer lub nazwę:');
  if (!choice) return;
  
  var player = null;
  var num = parseInt(choice);
  if (!isNaN(num) && num > 0 && num <= players.length) {
    player = players[num - 1];
  } else {
    player = players.find(function(p) { return p.name.toLowerCase() === choice.toLowerCase(); });
  }
  
  if (!player) { alert('Nie znaleziono gracza'); return; }
  
  if (typeof addCombatant !== 'function') {
    alert('Moduł potyczki nie jest dostępny!');
    return;
  }
  
  var initVal = Math.floor(Math.random() * 20) + 1 + Math.floor(selectedMonster.cr / 2);
  
  addCombatant({
    name: selectedMonster.name + ' (kompan ' + player.name + ')',
    init: initVal,
    hp: selectedMonster.hp,
    maxHp: selectedMonster.hp,
    ac: selectedMonster.ac,
    role: 'Companion',
    avatar: '🐾',
    conditions: [],
    exhaustionLevel: 0
  });
  
  playSound('add');
  closeMonsterDetail();
  
  var combatTab = document.querySelector('.nav-btn[data-tab="combat"]');
  if (combatTab) combatTab.click();
}

// ====== DODAWANIE DO POTYCZKI (Z KARTY GŁÓWNEJ) ======
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

  var allBtn = document.getElementById('filterAll');
  if (allBtn) allBtn.classList.add('active');

  renderMonsters('all', '');
  
  // Zamknij szczegóły kliknięciem poza popupem
  var popup = document.getElementById('monsterDetailPopup');
  if (popup) {
    popup.addEventListener('click', function(e) {
      if (e.target === popup) closeMonsterDetail();
    });
  }
});

// ====== DODAWANIE DO POTYCZKI (Z KARTY GŁÓWNEJ) ======
function addMonsterToCombat(name, cr, hp, ac, type) {
  if (typeof addCombatant !== 'function') {
    alert('Moduł potyczki nie jest dostępny!');
    return;
  }

  // Zapytaj gdzie dodać
  var choice = confirm('🐉 ' + name + '\n\nDodać do POTYCZKI jako wróg?\n• OK → Potyczka (wróg)\n• Anuluj → Postacie (NPC)');
  
  if (choice) {
    // Dodaj do potyczki jako wróg
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
    var combatTab = document.querySelector('.nav-btn[data-tab="combat"]');
    if (combatTab) combatTab.click();
  } else {
    // Dodaj do postaci jako NPC
    if (typeof players === 'undefined') {
      alert('Lista postaci nie jest dostępna!');
      return;
    }
    
    if (typeof addPlayer === 'function') {
      // Jeśli mamy funkcję dodawania postaci
      addPlayer({
        name: name,
        hp: hp,
        maxHp: hp,
        ac: ac,
        role: 'NPC',
        avatar: '🐉',
        conditions: [],
        exhaustionLevel: 0
      });
    } else {
      // Bezpośrednie dodanie do listy
      players.push({
        name: name,
        hp: hp,
        maxHp: hp,
        ac: ac,
        role: 'NPC',
        conditions: [],
        exhaustionLevel: 0,
        deathSaves: { passes: 0, fails: 0 },
        avatar: '🐉'
      });
      if (typeof renderPlayers === 'function') renderPlayers();
    }
    playSound('add');
    var playersTab = document.querySelector('.nav-btn[data-tab="players"]');
    if (playersTab) playersTab.click();
  }
}

// ====== DODAWANIE Z KARTY SZCZEGÓŁÓW ======
function addMonsterDetailToCombat() {
  if (!selectedMonster) return;
  addMonsterToCombat(selectedMonster.name, selectedMonster.cr, selectedMonster.hp, selectedMonster.ac, selectedMonster.type);
  closeMonsterDetail();
}

// ====== DODAWANIE JAKO KOMPAN ======
function addMonsterDetailAsCompanion() {
  if (!selectedMonster) return;
  if (typeof players === 'undefined' || players.length === 0) {
    alert('Dodaj najpierw gracza, do którego chcesz przypisać kompana!');
    return;
  }
  
  var names = players.map(function(p, i) {
    return (i + 1) + '. ' + p.name + ' (' + p.role + ')';
  }).join('\n');
  
  var choice = prompt('Wybierz gracza dla kompana:\n' + names + '\n\nWpisz numer lub nazwę:');
  if (!choice) return;
  
  var player = null;
  var num = parseInt(choice);
  if (!isNaN(num) && num > 0 && num <= players.length) {
    player = players[num - 1];
  } else {
    player = players.find(function(p) { return p.name.toLowerCase() === choice.toLowerCase(); });
  }
  
  if (!player) { alert('Nie znaleziono gracza'); return; }
  
  // Zapytaj gdzie dodać kompana
  var choice2 = confirm('🐾 ' + selectedMonster.name + ' jako kompan ' + player.name + '\n\nDodać do POTYCZKI?\n• OK → Potyczka\n• Anuluj → Postacie (jako NPC)');
  
  var companionName = selectedMonster.name + ' (kompan ' + player.name + ')';
  
  if (choice2) {
    // Dodaj do potyczki jako Companion
    if (typeof addCombatant !== 'function') {
      alert('Moduł potyczki nie jest dostępny!');
      return;
    }
    var initVal = Math.floor(Math.random() * 20) + 1 + Math.floor(selectedMonster.cr / 2);
    addCombatant({
      name: companionName,
      init: initVal,
      hp: selectedMonster.hp,
      maxHp: selectedMonster.hp,
      ac: selectedMonster.ac,
      role: 'Companion',
      avatar: '🐾',
      conditions: [],
      exhaustionLevel: 0
    });
    playSound('add');
    var combatTab = document.querySelector('.nav-btn[data-tab="combat"]');
    if (combatTab) combatTab.click();
  } else {
    // Dodaj do postaci jako NPC
    if (typeof players === 'undefined') {
      alert('Lista postaci nie jest dostępna!');
      return;
    }
    players.push({
      name: companionName,
      hp: selectedMonster.hp,
      maxHp: selectedMonster.hp,
      ac: selectedMonster.ac,
      role: 'NPC',
      conditions: [],
      exhaustionLevel: 0,
      deathSaves: { passes: 0, fails: 0 },
      avatar: '🐾'
    });
    if (typeof renderPlayers === 'function') renderPlayers();
    playSound('add');
    var playersTab = document.querySelector('.nav-btn[data-tab="players"]');
    if (playersTab) playersTab.click();
  }
  
  closeMonsterDetail();
}

// ====== FUNKCJA POMOCNICZA DO DODAWANIA POSTACI ======
function addPlayer(data) {
  if (typeof players === 'undefined') {
    players = [];
  }
  players.push({
    name: data.name,
    hp: data.hp,
    maxHp: data.maxHp || data.hp,
    ac: data.ac || 10,
    role: data.role || 'NPC',
    conditions: data.conditions || [],
    exhaustionLevel: data.exhaustionLevel || 0,
    deathSaves: { passes: 0, fails: 0 },
    avatar: data.avatar || '🐉'
  });
  if (typeof renderPlayers === 'function') renderPlayers();
}

// ====== EKSPORT ======
window.addPlayer = addPlayer;
window.renderMonsters = renderMonsters;
window.filterMonsters = filterMonsters;
window.addMonsterToCombat = addMonsterToCombat;
window.openMonsterDetail = openMonsterDetail;
window.closeMonsterDetail = closeMonsterDetail;
window.addMonsterDetailToCombat = addMonsterDetailToCombat;
window.addMonsterDetailAsCompanion = addMonsterDetailAsCompanion;
window.MONSTERS = MONSTERS;