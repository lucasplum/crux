// ============================================================
//  DATA / CONFIG
// ============================================================

// ---- STAŁE ----
const BASE_DISTANCES = [5, 10, 15, 20, 25, 30, 40, 60, 90, 120, 150, 300];

// ---- POMOCNICZE DLA RINGU ----
function ring(q0, r0, rad) {
  var seen = new Set(), cells = [];
  for (var q = -rad; q <= rad; q++) {
    for (var r = -rad; r <= rad; r++) {
      if ((Math.abs(q) + Math.abs(r) + Math.abs(q + r)) / 2 <= rad) {
        var key = q + ',' + r;
        if (!seen.has(key)) { seen.add(key); cells.push([q, r]); }
      }
    }
  }
  return cells;
}

var SIZE_DATA = {
  sm: { name: 'Mały (Small)', hexes: [[0,0]], color: '#6bb8ff', hexCount: '1×1' },
  med: { name: 'Średni (Medium)', hexes: [[0,0]], color: '#6bb8ff', hexCount: '1×1' },
  lg:  { name: 'Duży (Large)', hexes: ring(0,0,1), color: '#6bff9e', hexCount: '~7 hexów' },
  huge:{ name: 'Ogromny (Huge)', hexes: ring(0,0,2), color: '#d4a843', hexCount: '~19 hexów' },
  garg:{ name: 'Gargantuiczny (Gargantuan)', hexes: ring(0,0,3), color: '#ff6b6b', hexCount: '~37 hexów' },
  col: { name: 'Kolosalny (Colossal)', hexes: ring(0,0,4), color: '#a87cff', hexCount: '~61 hexów' },
};

var SPELLS = [
  { name:'Kula Ognia', shape:'sphere', size:20, desc:'🔥 8k6, promień 20 ft', school:'Ewokacja', level:3 },
  { name:'Kula Lodu', shape:'sphere', size:20, desc:'❄️ 8k6, promień 20 ft', school:'Ewokacja', level:3 },
  { name:'Meteor', shape:'sphere', size:40, desc:'☄️ 20k6, promień 40 ft', school:'Ewokacja', level:9 },
  { name:'Stożek Zimna', shape:'cone', size:60, desc:'❄️ 8k6, stożek 60 ft', school:'Ewokacja', level:5 },
  { name:'Ognisty Oddech', shape:'cone', size:30, desc:'🔥 5k6, stożek 30 ft', school:'Ewokacja', level:2 },
  { name:'Promień Światła', shape:'line', size:120, desc:'💫 10k6, linia 120 ft', school:'Ewokacja', level:6 },
  { name:'Piorun', shape:'line', size:100, desc:'⚡ 8k6, linia 100 ft', school:'Ewokacja', level:3 },
  { name:'Kula Śmierci', shape:'sphere', size:30, desc:'💀 12k6 nekrotycznych, promień 30 ft', school:'Nekromancja', level:6 },
  { name:'Sześcian Ognia', shape:'cube', size:30, desc:'🔥 10k6, sześcian 30 ft', school:'Ewokacja', level:4 },
  { name:'Błogosławieństwo', shape:'sphere', size:30, desc:'✨ Buff, promień 30 ft', school:'Oczarowanie', level:1 },
  { name:'Mroczna Moc', shape:'sphere', size:20, desc:'🌑 Przywraca życie, promień 20 ft', school:'Nekromancja', level:3 },
  { name:'Aura Życia', shape:'sphere', size:30, desc:'💚 Leczenie, promień 30 ft', school:'Oczarowanie', level:4 },
  { name:'Bariera', shape:'sphere', size:10, desc:'🛡️ +2 KP, promień 10 ft', school:'Ochrona', level:1 },
  { name:'Mroczna Chmura', shape:'sphere', size:30, desc:'☁️ Zasłona, promień 30 ft', school:'Czarowanie', level:2 },
  { name:'Ściana Ognia', shape:'line', size:60, desc:'🔥 Ściana 60 ft', school:'Ewokacja', level:4 },
  { name:'Krąg Ochrony', shape:'sphere', size:30, desc:'🔮 Antymagia, promień 30 ft', school:'Ochrona', level:6 },
  { name:'Uścisk Ziemi', shape:'cube', size:20, desc:'🪨 Trzyma wrogów, sześcian 20 ft', school:'Przyzywanie', level:2 },
  { name:'Mroczne Oczy', shape:'cone', size:30, desc:'👁️ Paraliż, stożek 30 ft', school:'Nekromancja', level:4 },
  { name:'Tarcza Światła', shape:'sphere', size:15, desc:'✨ Oślepia, promień 15 ft', school:'Ewokacja', level:2 },
];

var STATE_DESCRIPTIONS = {
  'Blinded': 'Nie widzi. Ataki przeciwko niemu mają przewagę, jego ataki mają utrudnienie. Automatycznie oblewa testy wymagające wzroku.',
  'Charmed': 'Nie może atakować źródła uroku. Źródło ma przewagę w testach towarzyskich. Nie może celować w źródło uroku szkodliwymi zdolnościami.',
  'Deafened': 'Nie słyszy. Automatycznie oblewa testy wymagające słuchu. Nie może korzystać z mocy wymagających słyszenia.',
  'Frightened': 'Utrudnienie na ataki i testy umiejętności, gdy widzi źródło strachu. Nie może się do niego zbliżyć.',
  'Grappled': 'Prędkość spada do 0. Może użyć akcji, aby uwolnić się testem Siły (Atletyka) przeciwko testowi Siły (Atletyka) lub Zręczności (Akrobatyka) porywacza.',
  'Incapacitated': 'Nie może podejmować akcji ani reakcji. Nie może koncentrować się na czarach.',
  'Invisible': 'Traktowany jako mocno zasłonięty. Ataki na niego z utrudnieniem, jego z przewagą. Nie można go celować czarami wymagającymi widzenia celu.',
  'Paralyzed': 'Obezwładniony. Trafienie z 5 ft to krytyk. Automatycznie oblewa rzuty obronne na Siłę i Zręczność.',
  'Petrified': 'Odporny na obrażenia. Niewrażliwy na trucizny. Zamieniony w kamień - waga x10.',
  'Poisoned': 'Utrudnienie na testy ataków i rzuty obronne. Nie ma wpływu na obrażenia od trucizny.',
  'Prone': 'Ataki w zwarciu z przewagą, na dystans z utrudnieniem. Ruchy wymagają dodatkowej połowy prędkości.',
  'Restrained': 'Prędkość 0. Ataki na cel z przewagą. Utrudnienie na ataki wykonywane przez cel. Oblewa rzuty obronne na Zręczność.',
  'Stunned': 'Obezwładniony. Oblewa rzuty na Siłę i Zręczność. Nie może mówić.',
  'Unconscious': 'Obezwładniony. Trafienie w zwarciu to krytyk. Upuszcza wszystko co trzyma. Automatycznie oblewa rzuty obronne.',
  'Exhaustion': 'Skala 1-6: Poziom 1 - utrudnienie na testy umiejętności; 2 - prędkość połowa; 3 - utrudnienie na ataki i obrony; 4 - HP max połowa; 5 - prędkość 0; 6 - śmierć.'
};