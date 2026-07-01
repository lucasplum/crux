// ============================================================
//  INFO - ZAKTUALIZOWANE STANY
// ============================================================
function renderStatesInfoList() {
  var container = document.getElementById('statesInfoList');
  if (!container) return;
  container.innerHTML = '';
  var states = [
    { name: 'nieprzytomny', icon: '💀', desc: 'Obezwładniony. Trafienie w zwarciu to krytyk. Upuszcza wszystko co trzyma. Automatycznie oblewa rzuty obronne. Nie może się poruszać ani mówić.' },
    { name: 'niewidzialny', icon: '👻', desc: 'Traktowany jako mocno zasłonięty. Ataki na niego z utrudnieniem, jego z przewagą. Nie można go celować czarami wymagającymi widzenia celu.' },
    { name: 'obezwładniony', icon: '💫', desc: 'Nie może podejmować akcji ani reakcji. Nie może koncentrować się na czarach. Nie może się poruszać.' },
    { name: 'ogłuchły', icon: '🔇', desc: 'Nie słyszy. Automatycznie oblewa testy wymagające słuchu. Nie może korzystać z mocy wymagających słyszenia.' },
    { name: 'ogłuszony', icon: '💥', desc: 'Obezwładniony. Oblewa rzuty na Siłę i Zręczność. Nie może mówić. Nie może podejmować akcji.' },
    { name: 'oślepiony', icon: '👁️', desc: 'Nie widzi. Ataki przeciwko niemu mają przewagę, jego ataki mają utrudnienie. Automatycznie oblewa testy wymagające wzroku.' },
    { name: 'pochwycony', icon: '🤝', desc: 'Prędkość spada do 0. Może użyć akcji, aby uwolnić się testem Siły (Atletyka) przeciwko testowi Siły (Atletyka) lub Zręczności (Akrobatyka) porywacza.' },
    { name: 'powalony', icon: '⬇️', desc: 'Ataki w zwarciu z przewagą, na dystans z utrudnieniem. Ruchy wymagają dodatkowej połowy prędkości. Może powstać używając połowy prędkości.' },
    { name: 'przerażony', icon: '😨', desc: 'Utrudnienie na ataki i testy umiejętności, gdy widzi źródło strachu. Nie może się do niego zbliżyć. Ma przewagę na rzuty obronne.' },
    { name: 'skamieniały', icon: '🪨', desc: 'Odporny na obrażenia. Niewrażliwy na trucizny. Zamieniony w kamień - waga x10. Nie może się poruszać ani mówić.' },
    { name: 'sparaliżowany', icon: '🧊', desc: 'Obezwładniony. Trafienie z 5 ft to krytyk. Automatycznie oblewa rzuty obronne na Siłę i Zręczność. Nie może się poruszać.' },
    { name: 'unieruchomiony', icon: '⛓️', desc: 'Prędkość 0. Ataki na cel z przewagą. Utrudnienie na ataki wykonywane przez cel. Oblewa rzuty obronne na Zręczność.' },
    { name: 'zatruty', icon: '☠️', desc: 'Utrudnienie na testy ataków i rzuty obronne. Nie ma wpływu na obrażenia od trucizny. Może być leczony przez Lesser Restoration.' },
    { name: 'zauroczony', icon: '💗', desc: 'Nie może atakować źródła uroku. Źródło ma przewagę w testach towarzyskich. Nie może celować w źródło uroku szkodliwymi zdolnościami.' },
    { name: 'wyczerpanie', icon: '🥱', desc: 'Skala 1-6: Poziom 1 - utrudnienie na testy umiejętności; 2 - prędkość połowa; 3 - utrudnienie na ataki i obrony; 4 - HP max połowa; 5 - prędkość 0; 6 - śmierć. Każdy poziom znika po długim odpoczynku.' }
  ];
  states.forEach(function(state) {
    var item = document.createElement('div');
    item.className = 'info-item';
    item.innerHTML = '<div class="info-item-header">' +
                       '<span class="info-icon">' + state.icon + '</span>' +
                       '<span class="info-title">' + state.name.charAt(0).toUpperCase() + state.name.slice(1) + '</span>' +
                     '</div>' +
                     '<div class="info-desc">' + state.desc + '</div>';
    container.appendChild(item);
  });
}

renderStatesInfoList();