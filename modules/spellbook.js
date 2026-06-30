// ============================================================
//  SPELLBOOK - LISTA ZAKLĘĆ (nie AOE)
// ============================================================

// ---- LISTA ZAKLĘĆ Z POLSKIMI I ANGIELSKIMI NAZWAMI ----
var SPELLBOOK = [
  // ===== POZIOM 0 (Cantripy) =====
  { 
    name: 'Płomień (Fire Bolt)', 
    level: 0, 
    school: 'Ewokacja', 
    casting: '1 akcja', 
    range: '120 ft', 
    components: 'V, S', 
    duration: 'Błyskawiczny',
    desc_pl: 'Tworzysz strzałkę ognia i rzucasz nią w cel. Wykonaj rzut na trafienie czarem dystansowym. Trafiony cel otrzymuje 1k10 obrażeń ogniowych. Obrażenia zwiększają się na wyższych poziomach.',
    desc_en: 'You hurl a mote of fire at a creature or object. Make a ranged spell attack. On a hit, the target takes 1d10 fire damage. The spell\'s damage increases by 1d10 when you reach higher levels.'
  },
  { 
    name: 'Magiczna Ręka (Mage Hand)', 
    level: 0, 
    school: 'Czarowanie', 
    casting: '1 akcja', 
    range: '30 ft', 
    components: 'V, S', 
    duration: '1 minuta',
    desc_pl: 'Tworzysz widmową, unoszącą się rękę w wybranym miejscu w zasięgu. Ręka trwa przez czas trwania lub do jej odprawienia. Może przenosić przedmioty o wadze do 10 funtów.',
    desc_en: 'A spectral, floating hand appears at a point you choose within range. The hand lasts for the duration or until you dismiss it. It can manipulate objects, open doors, or carry up to 10 pounds.'
  },
  { 
    name: 'Wróżenie (Guidance)', 
    level: 0, 
    school: 'Oczarowanie', 
    casting: '1 akcja', 
    range: 'dotyk', 
    components: 'V, S', 
    duration: '1 minuta (konc.)',
    desc_pl: 'Dotykasz jednego chętnego stworzenia. Raz w czasie trwania, cel może dodać 1k4 do wybranego testu umiejętności. Może to zrobić przed lub po wykonaniu testu.',
    desc_en: 'You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one ability check of its choice. It can roll the die before or after making the check.'
  },
  { 
    name: 'Uleczenie Ran (Spare the Dying)', 
    level: 0, 
    school: 'Nekromancja', 
    casting: '1 akcja', 
    range: 'dotyk', 
    components: 'V, S', 
    duration: 'Błyskawiczny',
    desc_pl: 'Dotykasz żywego stworzenia, które ma 0 punktów wytrzymałości. Staje się ono stabilne. Nie działa na nieumarłych i konstrukty.',
    desc_en: 'You touch a living creature that has 0 hit points. The creature becomes stable. This spell has no effect on undead or constructs.'
  },
  { 
    name: 'Światło (Light)', 
    level: 0, 
    school: 'Ewokacja', 
    casting: '1 akcja', 
    range: 'dotyk', 
    components: 'V, M', 
    duration: '1 godzina',
    desc_pl: 'Dotykasz jednego przedmiotu. Emituje on jasne światło w promieniu 20 ft i słabe światło w kolejnych 20 ft. Światło ma kolor według twojego wyboru.',
    desc_en: 'You touch one object. The object sheds bright light in a 20-foot radius and dim light for an additional 20 feet. The light can be colored as you like.'
  },
  { 
    name: 'Przyjaźń (Friends)', 
    level: 0, 
    school: 'Oczarowanie', 
    casting: '1 akcja', 
    range: 'osobisty', 
    components: 'S, M', 
    duration: '1 minuta (konc.)',
    desc_pl: 'Na czas trwania, masz przewagę we wszystkich testach charyzmy wobec jednego wybranego stworzenia. Po zakończeniu, cel staje się wobec ciebie wrogi.',
    desc_en: 'For the duration, you have advantage on all Charisma checks directed at one creature of your choice. When the spell ends, the creature becomes hostile toward you.'
  },

  // ===== POZIOM 1 =====
  { 
    name: 'Tarcza (Shield)', 
    level: 1, 
    school: 'Ochrona', 
    casting: 'Reakcja', 
    range: 'osobisty', 
    components: 'V, S', 
    duration: '1 runda',
    desc_pl: 'Reakcja, gdy zostajesz trafiony atakiem lub trafiony czarem Magic Missile. Do końca twojej następnej tury, twój AC zwiększa się o 5. Otrzymujesz również odporność na obrażenia od Magic Missile.',
    desc_en: 'A reaction when you are hit by an attack or targeted by the Magic Missile spell. Until the start of your next turn, you have a +5 bonus to AC. You also take no damage from Magic Missile.'
  },
  { 
    name: 'Magic Missile (Pociski Magiczne)', 
    level: 1, 
    school: 'Ewokacja', 
    casting: '1 akcja', 
    range: '120 ft', 
    components: 'V, S', 
    duration: 'Błyskawiczny',
    desc_pl: 'Tworzysz trzy świetliste pociski siły. Każdy trafia wybrane przez ciebie stworzenie w zasięgu. Każdy pocisk zadaje 1k4+1 obrażeń siły. Możesz skierować wszystkie w jedno stworzenie lub rozdzielić.',
    desc_en: 'You create three glowing darts of force. Each dart hits a creature of your choice that you can see within range. A dart deals 1d4+1 force damage. You can direct them at one target or several.'
  },
  { 
    name: 'Uleczenie (Cure Wounds)', 
    level: 1, 
    school: 'Oczarowanie', 
    casting: '1 akcja', 
    range: 'dotyk', 
    components: 'V, S', 
    duration: 'Błyskawiczny',
    desc_pl: 'Dotykasz stworzenia i przywracasz mu 1k8 + modyfikator rzucającego punktów wytrzymałości. Na wyższych poziomach dodajesz dodatkowe 1k8 za każdy poziom powyżej 1.',
    desc_en: 'You touch a creature and restore 1d8 + your spellcasting ability modifier hit points. At higher levels, you add an additional 1d8 for each slot level above 1st.'
  },
  { 
    name: 'Ognista Dłoń (Burning Hands)', 
    level: 1, 
    school: 'Ewokacja', 
    casting: '1 akcja', 
    range: '15 ft (stożek)', 
    components: 'V, S', 
    duration: 'Błyskawiczny',
    desc_pl: 'Z twoich dłoni bucha ogień w stożku 15 ft. Każde stworzenie w nim musi wykonać rzut obronny na Zręczność. W przypadku niepowodzenia otrzymuje 3k6 obrażeń ogniowych, w przypadku sukcesu połowę.',
    desc_en: 'A cone of flame bursts from your hands. Each creature in the cone must make a Dexterity saving throw. A creature takes 3d6 fire damage on a failed save, or half as much on a successful one.'
  },
  { 
    name: 'Zbroja Maga (Mage Armor)', 
    level: 1, 
    school: 'Ochrona', 
    casting: '1 akcja', 
    range: 'dotyk', 
    components: 'V, S, M', 
    duration: '8 godzin',
    desc_pl: 'Dotykasz stworzenia, które nie nosi zbroi. Jego bazowy AC wynosi 13 + modyfikator Zręczności. Trwa 8 godzin. Skórzana zbroja nie liczy się jako zbroja dla tego czaru.',
    desc_en: 'You touch a creature that isn\'t wearing armor. Its base AC becomes 13 + its Dexterity modifier. The spell ends after 8 hours. Leather armor doesn\'t count as armor for this spell.'
  },

  // ===== POZIOM 2 =====
  { 
    name: 'Niewidzialność (Invisibility)', 
    level: 2, 
    school: 'Iluzja', 
    casting: '1 akcja', 
    range: 'dotyk', 
    components: 'V, S, M', 
    duration: '1 godzina (konc.)',
    desc_pl: 'Dotykasz stworzenia. Staje się ono niewidzialne do końca trwania lub do ataku/rzucenia czaru. Przedmioty noszone lub przenoszone są również niewidzialne.',
    desc_en: 'You touch a creature. It becomes invisible until the spell ends or until it attacks or casts a spell. Anything it is wearing or carrying is invisible as long as it is on its person.'
  },
  { 
    name: 'Mistyczny Krok (Misty Step)', 
    level: 2, 
    school: 'Czarowanie', 
    casting: '1 akcja bonusowa', 
    range: 'osobisty', 
    components: 'V', 
    duration: 'Błyskawiczny',
    desc_pl: 'Krótko otulony srebrzystą mgłą, teleportujesz się do 30 ft w widoczne miejsce. Możesz zabrać ze sobą tylko to, co nosisz.',
    desc_en: 'Briefly surrounded by silvery mist, you teleport up to 30 feet to an unoccupied space that you can see. You can bring only what you are wearing or carrying.'
  },
  { 
    name: 'Szept (Suggestion)', 
    level: 2, 
    school: 'Oczarowanie', 
    casting: '1 akcja', 
    range: '30 ft', 
    components: 'V, M', 
    duration: '8 godz. (konc.)',
    desc_pl: 'Sugerujesz celowi wykonanie czynności. Cel musi wykonać rzut obronny na Mądrość. W przypadku niepowodzenia, wykonuje czynność. Sugestia musi być rozsądna.',
    desc_en: 'You suggest a course of activity to a creature. The target must make a Wisdom saving throw. On a failure, it pursues the course of action. The suggestion must be worded in a reasonable manner.'
  },
  { 
    name: 'Ognista Kula (Scorching Ray)', 
    level: 2, 
    school: 'Ewokacja', 
    casting: '1 akcja', 
    range: '120 ft', 
    components: 'V, S', 
    duration: 'Błyskawiczny',
    desc_pl: 'Tworzysz trzy promienie ognia. Każdy to osobny rzut na trafienie czarem dystansowym. Trafiony cel otrzymuje 2k6 obrażeń ogniowych. Możesz skierować promienie w jedno lub różne cele.',
    desc_en: 'You create three rays of fire. Each ray requires a ranged spell attack roll. On a hit, the target takes 2d6 fire damage. You can direct the rays at one target or several.'
  },

  // ===== POZIOM 3 =====
  { 
    name: 'Kula Ognia (Fireball)', 
    level: 3, 
    school: 'Ewokacja', 
    casting: '1 akcja', 
    range: '150 ft', 
    components: 'V, S, M', 
    duration: 'Błyskawiczny',
    desc_pl: 'Świecący punkt wybucha w promieniu 20 ft. Każde stworzenie w promieniu musi wykonać rzut obronny na Zręczność. W przypadku niepowodzenia otrzymuje 8k6 obrażeń ogniowych, w przypadku sukcesu połowę.',
    desc_en: 'A bright streak flashes from your pointing finger to a point you choose. A sphere of fire explodes in a 20-foot radius. Each creature in the area must make a Dexterity saving throw, taking 8d6 fire damage on a failed save, or half as much on a successful one.'
  },
  { 
    name: 'Kula Lodu (Ice Storm)', 
    level: 3, 
    school: 'Ewokacja', 
    casting: '1 akcja', 
    range: '150 ft', 
    components: 'V, S, M', 
    duration: 'Błyskawiczny',
    desc_pl: 'Grad lodowych brył spada w promieniu 20 ft. Każde stworzenie w promieniu musi wykonać rzut obronny na Zręczność. Otrzymuje 8k6 obrażeń zimnych w przypadku niepowodzenia, połowę w przypadku sukcesu.',
    desc_en: 'A storm of ice and hail falls in a 20-foot radius. Each creature in the area must make a Dexterity saving throw, taking 8d6 cold damage on a failed save, or half as much on a successful one.'
  },
  { 
    name: 'Przyspieszenie (Haste)', 
    level: 3, 
    school: 'Czarowanie', 
    casting: '1 akcja', 
    range: '30 ft', 
    components: 'V, S, M', 
    duration: '1 minuta (konc.)',
    desc_pl: 'Wybierz chętne stworzenie. Na czas trwania jego prędkość podwaja się, zyskuje +2 do AC, przewagę na rzuty obronne Zręczności i dodatkową akcję każdej tury.',
    desc_en: 'Choose a willing creature. For the duration, the target\'s speed doubles, it gains a +2 bonus to AC, advantage on Dexterity saving throws, and an additional action on each of its turns.'
  },
  { 
    name: 'Wskrzeszenie zmarłych (Revivify)', 
    level: 3, 
    school: 'Nekromancja', 
    casting: '1 akcja', 
    range: 'dotyk', 
    components: 'V, S, M', 
    duration: 'Błyskawiczny',
    desc_pl: 'Dotykasz stworzenia, które zmarło w ciągu ostatniej minuty. Przywracasz je do życia z 1 punktem wytrzymałości. Nie działa na stworzenia, które zmarły ze starości.',
    desc_en: 'You touch a creature that has died within the last minute. The creature returns to life with 1 hit point. This spell can\'t return to life a creature that has died of old age.'
  },

  // ===== POZIOM 4 =====
  { 
    name: 'Aura Życia (Aura of Life)', 
    level: 4, 
    school: 'Oczarowanie', 
    casting: '1 akcja', 
    range: 'osobisty (30 ft aura)', 
    components: 'V, S', 
    duration: 'koncentracja (10 min)',
    desc_pl: 'Aura o promieniu 30 ft otacza cię. Każdy sojusznik w aurze na początku swojej tury odzyskuje punkty wytrzymałości równe twojemu modyfikatorowi rzucania. Nieumarli i konstrukty nie są dotknięte.',
    desc_en: 'A 30-foot aura surrounds you. Each ally in the aura at the start of their turn regains hit points equal to your spellcasting ability modifier. Undead and constructs are not affected.'
  },
  { 
    name: 'Ściana Ognia (Wall of Fire)', 
    level: 4, 
    school: 'Ewokacja', 
    casting: '1 akcja', 
    range: '120 ft', 
    components: 'V, S, M', 
    duration: 'koncentracja (1 min)',
    desc_pl: 'Tworzysz ścianę ognia o długości do 60 ft i wysokości 20 ft. Stworzenia w niej lub przechodzące przez nią otrzymują 5k8 obrażeń ogniowych. Po jednej stronie ściany jest jasne światło.',
    desc_en: 'You create a wall of fire up to 60 feet long and 20 feet high. Creatures in the wall or passing through it take 5d8 fire damage. One side of the wall sheds bright light.'
  },
  { 
    name: 'Polimorfia (Polymorph)', 
    level: 4, 
    school: 'Czarowanie', 
    casting: '1 akcja', 
    range: '60 ft', 
    components: 'V, S, M', 
    duration: 'koncentracja (1 godz.)',
    desc_pl: 'Zmieniasz stworzenie w nową formę. Wybierz bestię o CR równym lub niższym od poziomu celu. Cel przyjmuje statystyki bestii, ale zachowuje osobowość i pamięć.',
    desc_en: 'You transform a creature into a new form. Choose a beast with a CR equal to or lower than the target\'s level. The target assumes the beast\'s statistics, but retains its personality and memory.'
  },

  // ===== POZIOM 5 =====
  { 
    name: 'Stożek Zimna (Cone of Cold)', 
    level: 5, 
    school: 'Ewokacja', 
    casting: '1 akcja', 
    range: '60 ft (stożek)', 
    components: 'V, S, M', 
    duration: 'Błyskawiczny',
    desc_pl: 'Z twoich dłoni wydobywa się stożek lodowego zimna. Każde stworzenie w stożku musi wykonać rzut obronny na Kondycję. W przypadku niepowodzenia otrzymuje 8k6 obrażeń zimnych, w przypadku sukcesu połowę.',
    desc_en: 'A cone of frigid cold erupts from your hands. Each creature in the cone must make a Constitution saving throw, taking 8d6 cold damage on a failed save, or half as much on a successful one.'
  },
  { 
    name: 'Wskrzeszenie (Raise Dead)', 
    level: 5, 
    school: 'Nekromancja', 
    casting: '1 godzina', 
    range: 'dotyk', 
    components: 'V, S, M', 
    duration: 'Błyskawiczny',
    desc_pl: 'Przywracasz do życia stworzenie, które zmarło w ciągu ostatnich 10 dni. Cel wraca z 1 punktem wytrzymałości, ale ma -4 kary do testów ataków, obron i umiejętności. Kary znikają po 4 długich odpoczynkach.',
    desc_en: 'You return a creature that has died within the last 10 days to life. The target returns with 1 hit point, but has a -4 penalty to attack rolls, saving throws, and ability checks. The penalty fades after 4 long rests.'
  },

  // ===== POZIOM 6 =====
  { 
    name: 'Promień Światła (Sunbeam)', 
    level: 6, 
    school: 'Ewokacja', 
    casting: '1 akcja', 
    range: 'osobisty (linia 120 ft)', 
    components: 'V, S, M', 
    duration: 'koncentracja (1 min)',
    desc_pl: 'Z twojej dłoni wydobywa się promień światła. Każde stworzenie w linii 120 ft musi wykonać rzut obronny na Kondycję. W przypadku niepowodzenia otrzymuje 6k8 obrażeń promieniowania i jest oślepione do końca twojej następnej tury.',
    desc_en: 'A beam of light shines from your hand. Each creature in a 120-foot line must make a Constitution saving throw, taking 6d8 radiant damage and being blinded until the end of your next turn on a failed save.'
  },
  { 
    name: 'Krąg Ochrony (Circle of Power)', 
    level: 6, 
    school: 'Ochrona', 
    casting: '1 akcja', 
    range: 'osobisty (30 ft aura)', 
    components: 'V, S', 
    duration: 'koncentracja (10 min)',
    desc_pl: 'Aura o promieniu 30 ft otacza cię. Sojusznicy w aurze mają przewagę na wszystkie rzuty obronne. Dodatkowo, gdy wykonują rzut obronny, mogą użyć reakcji aby zyskać dodatkową przewagę.',
    desc_en: 'A 30-foot aura surrounds you. Allies in the aura have advantage on all saving throws. Additionally, when they make a saving throw, they can use their reaction to gain advantage on that save.'
  },

  // ===== POZIOM 7 =====
  { 
    name: 'Kula Śmierci (Circle of Death)', 
    level: 7, 
    school: 'Nekromancja', 
    casting: '1 akcja', 
    range: '150 ft', 
    components: 'V, S, M', 
    duration: 'Błyskawiczny',
    desc_pl: 'Sfera czarnej energii rozszerza się w promieniu 30 ft. Każde stworzenie w promieniu musi wykonać rzut obronny na Kondycję. W przypadku niepowodzenia otrzymuje 8k6 obrażeń nekrotycznych, w przypadku sukcesu połowę.',
    desc_en: 'A sphere of black energy expands in a 30-foot radius. Each creature in the area must make a Constitution saving throw, taking 8d6 necrotic damage on a failed save, or half as much on a successful one.'
  },

  // ===== POZIOM 8 =====
  { 
    name: 'Tarcza Światła (Sunburst)', 
    level: 8, 
    school: 'Ewokacja', 
    casting: '1 akcja', 
    range: '150 ft', 
    components: 'V, S, M', 
    duration: 'Błyskawiczny',
    desc_pl: 'Oślepiający wybuch światła w promieniu 20 ft. Każde stworzenie w promieniu musi wykonać rzut obronny na Kondycję. W przypadku niepowodzenia otrzymuje 12k6 obrażeń promieniowania i jest oślepione do 1 minuty.',
    desc_en: 'A blinding flash of light explodes in a 20-foot radius. Each creature in the area must make a Constitution saving throw, taking 12d6 radiant damage and being blinded for 1 minute on a failed save.'
  },

  // ===== POZIOM 9 =====
  { 
    name: 'Meteor (Meteor Swarm)', 
    level: 9, 
    school: 'Ewokacja', 
    casting: '1 akcja', 
    range: '1 mila', 
    components: 'V, S', 
    duration: 'Błyskawiczny',
    desc_pl: 'Cztery meteory uderzają w ziemię w wybranych przez ciebie punktach. Każdy meteor eksploduje w promieniu 40 ft. Stworzenia w promieniu muszą wykonać rzut obronny na Zręczność, otrzymują 20k6 obrażeń ognistych/obuchowych lub połowę w przypadku sukcesu.',
    desc_en: 'Four meteors strike the ground at points you choose. Each meteor explodes in a 40-foot radius. Creatures in the radius must make a Dexterity saving throw, taking 20d6 fire and bludgeoning damage on a failed save, or half as much on a successful one.'
  },
  { 
    name: 'Życzenie (Wish)', 
    level: 9, 
    school: 'Czarowanie', 
    casting: '1 akcja', 
    range: 'osobisty', 
    components: 'V', 
    duration: 'Błyskawiczny',
    desc_pl: 'Życzenie jest najpotężniejszym czarem, jaki może rzucić śmiertelnik. Pozwala ci zmienić rzeczywistość. Możesz odtworzyć dowolny czar 8 poziomu lub niższy, lub stworzyć własny efekt. GM decyduje o granicach życzenia.',
    desc_en: 'Wish is the most powerful spell a mortal can cast. It allows you to alter reality. You can duplicate any spell of 8th level or lower, or create your own effect. The DM determines the limits of the wish.'
  }
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
           s.desc_pl.toLowerCase().includes(filter.toLowerCase()) ||
           s.desc_en.toLowerCase().includes(filter.toLowerCase());
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
window.SPELLBOOK = SPELLBOOK;