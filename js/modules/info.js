// ============================================================
//  INFO - PODRĘCZNIK MISTRZA GRY
// ============================================================

// ---------- DANE ----------
var INFO_DATA = {
  states: [
    { 
      name: 'Nieprzytomny', en: 'Unconscious',
      icon: '💀', 
      desc: 'Istota jest <strong>obezwładniona</strong>, nie może się poruszać ani mówić.<br>Upuszcza wszystko i jest <strong>powalona</strong>.<br>Automatycznie oblewa rzuty na <span class="tag">SIŁĘ</span> i <span class="tag">ZRĘCZNOŚĆ</span>.<br><strong>Ataki mają przewagę</strong>, trafienie z 5 ft to krytyk.'
    },
    { 
      name: 'Niewidzialny', en: 'Invisible',
      icon: '👻', 
      desc: 'Niemożliwy do zobaczenia bez magii.<br><strong>Ataki przeciwko niemu mają utrudnienie</strong>, jego ataki mają przewagę.'
    },
    { 
      name: 'Zatruty', en: 'Poisoned',
      icon: '☠️', 
      desc: 'Ma <strong>utrudnienie</strong> na ataki i testy umiejętności.'
    },
    { 
      name: 'Pochwycony', en: 'Grappled',
      icon: '🤝', 
      desc: 'Prędkość spada do <strong>0</strong>.<br>Stan kończy się, gdy porywacz jest <strong>obezwładniony</strong>.'
    },
    { 
      name: 'Oślepiony', en: 'Blinded',
      icon: '👁️', 
      desc: 'Nie widzi, automatycznie oblewa testy wymagające wzroku.<br><strong>Ataki przeciwko niemu mają przewagę</strong>, jego ataki mają utrudnienie.'
    },
    { 
      name: 'Zauroczony', en: 'Charmed',
      icon: '💗', 
      desc: 'Nie może atakować źródła uroku.<br>Źródło ma <strong>przewagę</strong> w testach towarzyskich.'
    },
    { 
      name: 'Ogłuchły', en: 'Deafened',
      icon: '🔇', 
      desc: 'Nie słyszy, automatycznie oblewa testy wymagające słuchu.'
    },
    { 
      name: 'Przerażony', en: 'Frightened',
      icon: '😨', 
      desc: 'Ma <strong>utrudnienie</strong> na testy i ataki, gdy źródło strachu jest w zasięgu wzroku.<br>Nie może zbliżyć się do źródła strachu.'
    },
    { 
      name: 'Obezwładniony', en: 'Incapacitated',
      icon: '💫', 
      desc: '<strong>Nie może wykonywać akcji ani reakcji</strong>.'
    },
    { 
      name: 'Sparaliżowany', en: 'Paralyzed',
      icon: '🧊', 
      desc: 'Jest <strong>obezwładniony</strong>, nie może się ruszać ani mówić.<br>Automatycznie oblewa rzuty na <span class="tag">SIŁĘ</span> i <span class="tag">ZRĘCZNOŚĆ</span>.<br><strong>Ataki mają przewagę</strong>, trafienie z 5 ft to krytyk.'
    },
    { 
      name: 'Skamieniały', en: 'Petrified',
      icon: '🪨', 
      desc: 'Przemieniony w kamień, <strong>obezwładniony</strong>.<br>Ma <strong>odporność na wszystkie obrażenia</strong>.<br>Ataki mają przewagę, automatycznie oblewa rzuty na <span class="tag">SIŁĘ</span> i <span class="tag">ZRĘCZNOŚĆ</span>.'
    },
    { 
      name: 'Powałony', en: 'Prone',
      icon: '⬇️', 
      desc: 'Może tylko <strong>pełzać</strong>.<br><strong>Ataki w zwarciu mają przewagę</strong>, na dystans utrudnienie.<br>Ma utrudnienie na własne ataki.'
    },
    { 
      name: 'Unieruchomiony', en: 'Restrained',
      icon: '⛓️', 
      desc: 'Prędkość <strong>0</strong>.<br><strong>Ataki przeciwko niemu mają przewagę</strong>, jego ataki mają utrudnienie.<br>Utrudnienie na rzuty <span class="tag">ZRĘCZNOŚĆ</span>.'
    },
    { 
      name: 'Ogłuszony', en: 'Stunned',
      icon: '💥', 
      desc: 'Jest <strong>obezwładniony</strong>, nie może się ruszać.<br>Automatycznie oblewa rzuty na <span class="tag">SIŁĘ</span> i <span class="tag">ZRĘCZNOŚĆ</span>.<br><strong>Ataki mają przewagę</strong>.'
    },
    { 
      name: 'Wyczerpanie', en: 'Exhaustion',
      icon: '🥱', 
      desc: 'Mierzone w <strong>6 poziomach</strong>:<br><br>' +
      '<table class="info-table">' +
        '<tr><th>Poziom</th><th>Efekt</th></tr>' +
        '<tr><td class="level">1</td><td>Utrudnienie na testy umiejętności</td></tr>' +
        '<tr><td class="level">2</td><td>Prędkość zmniejszona o połowę</td></tr>' +
        '<tr><td class="level">3</td><td>Utrudnienie na ataki i rzuty obronne</td></tr>' +
        '<tr><td class="level">4</td><td>Maksymalne HP zmniejszone o połowę</td></tr>' +
        '<tr><td class="level">5</td><td>Prędkość 0</td></tr>' +
        '<tr><td class="level level-6">6</td><td class="level-6">Śmierć</td></tr>' +
      '</table><br>' +
      '<strong>Długi odpoczynek</strong> redukuje poziom o 1 (przy jedzeniu i piciu).'
    }
  ],
  actions: [
    { name: 'Atak', en: 'Attack', icon: '⚔️', desc: 'Wykonaj <strong>jeden atak</strong> wręcz lub dystansowy.' },
    { name: 'Rzucenie Czaru', en: 'Cast a Spell', icon: '🔮', desc: 'Rzuć czar. Komponenty: <span class="tag">V</span> werbalne, <span class="tag">S</span> somatyczne, <span class="tag">M</span> materialne.' },
    { name: 'Zryw', en: 'Dash', icon: '🏃', desc: 'Zyskujesz <strong>dodatkowy ruch</strong> równy prędkości.' },
    { name: 'Wycofanie', en: 'Disengage', icon: '💨', desc: 'Ruch <strong>nie prowokuje okazyjnych ataków</strong>.' },
    { name: 'Unik', en: 'Dodge', icon: '🛡️', desc: 'Ataki przeciwko tobie mają <strong>utrudnienie</strong>, rzuty <span class="tag">ZRĘCZNOŚĆ</span> mają <strong>przewagę</strong>.' },
    { name: 'Pomoc', en: 'Help', icon: '🤝', desc: 'Sojusznik ma <strong>przewagę</strong> na następny atak przeciwko celowi.' },
    { name: 'Ukrycie', en: 'Hide', icon: '👻', desc: 'Test <span class="tag">ZRĘCZNOŚĆ</span> (Skradanie) przeciwko <strong>Pasywnej Percepcji</strong>.' },
    { name: 'Przygotowanie', en: 'Ready', icon: '⏳', desc: 'Wybierz <strong>akcję i wyzwalacz</strong>. Użyj jako reakcji.' },
    { name: 'Szukanie', en: 'Search', icon: '🔍', desc: 'Test <span class="tag">MĄDROŚĆ</span> (Percepcja) lub <span class="tag">INTELIGENCJA</span> (Śledztwo).' },
    { name: 'Użycie Przedmiotu', en: 'Use an Object', icon: '🔧', desc: 'Użyj przedmiotu (np. mikstury, narzędzia).' }
  ],
  move: [
    { name: 'Prędkość', en: 'Speed', icon: '🚶', desc: 'Większość postaci: <strong>30 ft (6 ⬡)</strong>. Małe rasy: <strong>25 ft (5 ⬡)</strong>.' },
    { name: 'Trudny Teren', en: 'Difficult Terrain', icon: '🌿', desc: 'Każdy ft ruchu kosztuje <strong>2x</strong>.' },
    { name: 'Chwytanie', en: 'Grapple', icon: '🤼', desc: 'Test <span class="tag">SIŁA</span> (Atletyka). Cel ma <strong>prędkość 0</strong>.' },
    { name: 'Popchnięcie', en: 'Shove', icon: '👊', desc: '<strong>Pował</strong> lub <strong>popchnij</strong> 5 ft.' },
    { name: 'Okazyjny Atak', en: 'Opportunity Attack', icon: '⚡', desc: 'Reakcja: <strong>jeden atak wręcz</strong> gdy wróg wychodzi z zasięgu.' },
    { name: 'Wspinaczka/Pływanie', en: 'Climbing/Swimming', icon: '🏊', desc: 'Koszt <strong>2x</strong> (jak trudny teren).' },
    { name: 'Skok', en: 'Jump', icon: '🦘', desc: 'Daleki: <strong>Siła × 5 ft</strong> (z rozbiegiem). Wysoki: <strong>3 + mod. Siły</strong> ft.' },
    { name: 'Darmowa Interakcja', en: 'Free Interaction', icon: '🎁', desc: 'Raz na turę: wyciągnąć broń, otworzyć drzwi, podnieść przedmiot.' }
  ],
  rest: [
    { name: 'Krótki Odpoczynek', en: 'Short Rest', icon: '☕', desc: '<strong>Czas:</strong> min. 1 godzina.<br><strong>Korzyści:</strong> wydaj <span class="tag">Hit Dice</span> aby odzyskać HP; niektóre zdolności się odnawiają.' },
    { name: 'Długi Odpoczynek', en: 'Long Rest', icon: '🛏️', desc: '<strong>Czas:</strong> min. 8h (6h snu + 2h lekkiej aktywności).<br><strong>Korzyści:</strong> pełne HP, połowa slotów czarów, wszystkie zdolności.<br>Redukuje <strong>wyczerpanie</strong> o 1 poziom.' },
    { name: 'Gritty Realism (wariant)', en: 'Gritty Realism', icon: '⚠️', desc: 'Krótki: <strong>7 dni</strong>. Długi: <strong>7 dni</strong>. Idealne do survivalu.' },
    { name: 'Heroic (wariant)', en: 'Heroic', icon: '💤', desc: 'Krótki: <strong>5 minut</strong>. Długi: <strong>1 godzina</strong>. Do szybkich kampanii.' }
  ],
  vision: [
    { name: 'Jasne Światło', en: 'Bright Light', icon: '☀️', desc: 'Normalna percepcja. Pochodnia: <strong>20 ft</strong>.' },
    { name: 'Słabe Światło', en: 'Dim Light', icon: '🌤️', desc: '<strong>Lekko zasłonięty</strong> – utrudnienie w testach Percepcji (wzrok).' },
    { name: 'Ciemność', en: 'Darkness', icon: '🌑', desc: '<strong>Silnie zasłonięty</strong> – efektywnie oślepiony bez Darkvision.' },
    { name: 'Darkvision', en: 'Darkvision', icon: '👁️', desc: 'Widzisz w ciemności (zwykle 60 ft) jak w słabym świetle. <strong>Nie działa</strong> w magicznej ciemności.' },
    { name: 'Blindsight', en: 'Blindsight', icon: '🦇', desc: 'Postrzegasz otoczenie bez wzroku (np. echolokacja, wyostrzone zmysły).' },
    { name: 'Truesight', en: 'Truesight', icon: '👁️‍🗨️', desc: 'Widzisz w normalnej i magicznej ciemności, widzisz niewidzialne, wykrywasz iluzje i przemiany.' }
  ],
  adventuring: [
    { 
      name: 'Czas', en: 'Time', 
      icon: '⏳', 
      desc: 'Skala czasu w grze:<br>' +
      '• <span class="tag">Runda</span> – 6 sekund (walka)<br>' +
      '• <span class="tag">Minuty</span> – eksploracja lochów<br>' +
      '• <span class="tag">Godziny</span> – podróż w mieście / dziczy<br>' +
      '• <span class="tag">Dni</span> – długie wyprawy'
    },
    { 
      name: 'Tempo Podróży', en: 'Travel Pace', 
      icon: '🚶', 
      desc: '<table class="info-table">' +
        '<tr><th>Tempo</th><th>Dzień</th><th>Godz.</th><th>Efekt</th></tr>' +
        '<tr><td><strong>Szybkie</strong></td><td>30 mil</td><td>4 mile</td><td>-5 do Pasywnej Percepcji</td></tr>' +
        '<tr><td><strong>Normalne</strong></td><td>24 mile</td><td>3 mile</td><td>—</td></tr>' +
        '<tr><td><strong>Wolne</strong></td><td>18 mil</td><td>2 mile</td><td>Możliwe Skradanie</td></tr>' +
      '</table>'
    },
    { 
      name: 'Forced March', en: 'Forced March', 
      icon: '🥱', 
      desc: 'Podróż powyżej 8h dziennie – test <span class="tag">KONDYCJA</span> (DC 10 + 1 za każdą dodatkową godzinę). Porażka = <strong>1 poziom wyczerpania</strong>.'
    },
    { 
      name: 'Trudny Teren', en: 'Difficult Terrain', 
      icon: '🌿', 
      desc: 'Ruch kosztuje <strong>2x</strong> (1 ft = 2 ft prędkości). Dotyczy: gęste lasy, bagna, gruzy, strome góry, lód.'
    },
    { 
      name: 'Wspinaczka, Pływanie, Czołganie', en: 'Climbing, Swimming, Crawling', 
      icon: '🏊', 
      desc: 'Każdy ft ruchu kosztuje <strong>1 dodatkowy ft</strong> (2 ft w trudnym terenie). Pomijasz to, jeśli masz odpowiednią prędkość.'
    },
    { 
      name: 'Skakanie', en: 'Jumping', 
      icon: '🦘', 
      desc: '<strong>Daleki:</strong> Siła × 5 ft (z rozbiegiem 10 ft) lub połowa bez rozbiegu.<br>' +
      '<strong>Wysoki:</strong> 3 + mod. Siły ft (z rozbiegiem) lub połowa bez rozbiegu.'
    },
    { 
      name: 'Jedzenie i Woda', en: 'Food & Water', 
      icon: '🍞', 
      desc: '<strong>Jedzenie:</strong> 1 funt/dzień. Bez jedzenia: 3 + mod. <span class="tag">KONDYCJA</span> dni, potem <strong>1 poziom wyczerpania</strong>/dzień.<br><br>' +
      '<strong>Woda:</strong> 1 galon/dzień (2x w upale). Mniej niż połowa: test <span class="tag">KONDYCJA</span> DC 15 lub <strong>wyczerpanie</strong>.'
    },
    { 
      name: 'Spadanie', en: 'Falling', 
      icon: '💥', 
      desc: '<strong>1k6</strong> obrażeń obuchowych za każde 10 ft (max 20k6). Lądujesz <strong>powalony</strong>.<br><br>' +
      '<span class="tag">Feather Fall</span> – czar 1 poziomu, reakcja, spadek 60 ft/rundę, brak obrażeń.'
    },
    { 
      name: 'Zadławienie', en: 'Suffocating', 
      icon: '😤', 
      desc: 'Wstrzymanie oddechu: <strong>1 + mod. KONDYCJA</strong> minut (min. 30 sek).<br>Potem: <strong>mod. KONDYCJA</strong> rund (min. 1) na dotarcie do powietrza, inaczej <strong>0 HP</strong>.'
    },
    { 
      name: 'Widoczność', en: 'Vision & Light', 
      icon: '🌓', 
      desc: '<strong>Jasne światło</strong> – normalne widzenie.<br>' +
      '<strong>Słabe światło</strong> – lekko zasłonięty teren, utrudnienie w testach Percepcji (wzrok).<br>' +
      '<strong>Ciemność</strong> – silnie zasłonięty teren, efektywnie oślepiony.<br><br>' +
      '<span class="tag">Darkvision</span> – widzi w ciemności jak w słabym świetle (zwykle 60 ft).<br>' +
      '<span class="tag">Blindsight</span> – postrzega bez wzroku (echolokacja, wyostrzone zmysły).<br>' +
      '<span class="tag">Truesight</span> – widzi w ciemności, widzi niewidzialne, wykrywa iluzje i przemiany.'
    },
    { 
      name: 'Interakcja z Przedmiotami', en: 'Object Interaction', 
      icon: '🔧', 
      desc: 'Raz na turę za darmo: wyciągnąć broń, otworzyć drzwi, podnieść przedmiot.<br><br>Przedmioty mają <span class="tag">KP</span> i <span class="tag">PW</span> (określa MG). Odporne na truciznę i obrażenia psychiczne.'
    },
    { 
      name: 'Interakcje Społeczne', en: 'Social Interaction', 
      icon: '💬', 
      desc: 'Postawy <span class="tag">NPC</span>: <strong>przyjazna</strong> – pomocna, <strong>obojętna</strong>, <strong>wroga</strong> – przeszkadza.<br><br>' +
      '• <strong>Opisowa</strong> – mówisz co postać robi i mówi.<br>' +
      '• <strong>Aktywna</strong> – mówisz głosem postaci.<br><br>' +
      'Testy <span class="tag">CHARYZMA</span> (Perswazja, Oszustwo, Zastraszanie) decydują o wyniku.'
    }
  ],
  conc: [
    { name: 'Zasady Koncentracji', en: 'Concentration Rules', icon: '🎯', desc: 'Tylko <strong>jeden czar</strong> naraz.' },
    { name: 'Utrata od Obrażeń', en: 'Damage & Concentration', icon: '💥', desc: 'Rzut <span class="tag">KONDYCJA</span>: <strong>DC = 10 lub połowa obrażeń</strong> (co wyższe).' },
    { name: 'Inne Źródła Utraty', en: 'Other Breaks', icon: '⚡', desc: '<span class="tag">Obezwładniony</span>, <span class="tag">Ogłuszony</span>, śmierć (0 HP).' },
    { name: 'War Caster (feat)', en: 'War Caster', icon: '🛡️', desc: '<strong>Przewaga</strong> na rzuty <span class="tag">KONDYCJA</span> dla koncentracji.' },
    { name: 'Resilient (KON)', en: 'Resilient (CON)', icon: '🔮', desc: 'Biegłość w rzutach <span class="tag">KONDYCJA</span> +1 do KON.' }
  ]
};

// ---------- RENDER ----------
function renderInfoSection(section, containerId) {
  var container = document.getElementById(containerId);
  if (!container) return;
  
  var items = INFO_DATA[section];
  if (!items) return;
  
  container.innerHTML = '';
  items.forEach(function(item) {
    var div = document.createElement('div');
    div.className = 'info-item';
    div.innerHTML = `
      <div class="info-item-header">
        <span class="info-item-icon">${item.icon}</span>
        <span class="info-item-title">${item.name} <span class="en">${item.en}</span></span>
      </div>
      <div class="info-item-desc">${item.desc}</div>
    `;
    container.appendChild(div);
  });
}

// ---------- INICJALIZACJA ZAKŁADEK ----------
function initInfoTabs() {
  var tabButtons = document.querySelectorAll('.info-tab-btn');
  var contents = document.querySelectorAll('.info-content');

  // Renderuj wszystkie sekcje
  renderInfoSection('states', 'statesInfoList');
  renderInfoSection('actions', 'actionsInfoList');
  renderInfoSection('move', 'moveInfoList');
  renderInfoSection('rest', 'restInfoList');
  renderInfoSection('vision', 'visionInfoList');
  renderInfoSection('adventuring', 'adventuringInfoList');
  renderInfoSection('conc', 'concInfoList');

  // Obsługa kliknięć
  tabButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var target = this.dataset.info;

      tabButtons.forEach(function(b) { b.classList.remove('active'); });
      this.classList.add('active');

      contents.forEach(function(c) {
        if (c.dataset.info === target) {
          c.classList.add('active');
          c.style.display = 'block';
        } else {
          c.classList.remove('active');
          c.style.display = 'none';
        }
      });

      // Zamknij menu na mobile
      var tabsWrapper = document.getElementById('infoTabs');
      if (tabsWrapper && window.innerWidth <= 768) {
        tabsWrapper.classList.remove('open');
        var hamburger = document.querySelector('.info-hamburger');
        if (hamburger) hamburger.textContent = '☰ Spis treści';
      }
    });
  });

  // Ustaw pierwszą zakładkę jako aktywną
  var firstBtn = document.querySelector('.info-tab-btn.active');
  if (!firstBtn) {
    var first = document.querySelector('.info-tab-btn');
    if (first) first.click();
  }
}

// ---------- TOGGLE MENU (mobile) ----------
function toggleInfoMenu() {
  var tabs = document.getElementById('infoTabs');
  if (tabs) {
    tabs.classList.toggle('open');
    var btn = document.querySelector('.info-hamburger');
    if (btn) {
      btn.textContent = tabs.classList.contains('open') ? '✕ Zamknij' : '☰ Spis treści';
    }
  }
}

// ---------- AUTO-START ----------
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    initInfoTabs();
  });
} else {
  initInfoTabs();
}

// ---------- EKSPORT ----------
window.INFO_DATA = INFO_DATA;
window.renderInfoSection = renderInfoSection;
window.initInfoTabs = initInfoTabs;
window.toggleInfoMenu = toggleInfoMenu;