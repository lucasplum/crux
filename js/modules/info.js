// ============================================================
//  INFO - ZAKŁADKI I DANE
// ============================================================

function initInfoTabs() {
    var infoTabButtons = document.querySelectorAll('.info-tab-btn');
    var infoContents = document.querySelectorAll('.info-content');

    // Na początku ukryj wszystkie zawartości poza pierwszą
    infoContents.forEach(function(c, index) {
        if (index === 0) {
            c.classList.add('active');
            c.style.display = 'block';
        } else {
            c.classList.remove('active');
            c.style.display = 'none';
        }
    });

    // Ustaw pierwszy przycisk jako aktywny
    infoTabButtons.forEach(function(b, index) {
        if (index === 0) {
            b.classList.add('active');
        } else {
            b.classList.remove('active');
        }
    });

    infoTabButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var targetInfo = btn.dataset.info;

            // Przyciski
            infoTabButtons.forEach(function(b) {
                if (b.dataset.info === targetInfo) {
                    b.classList.add('active');
                } else {
                    b.classList.remove('active');
                }
            });

            // Zawartości
            infoContents.forEach(function(c) {
                if (c.dataset.info === targetInfo) {
                    c.classList.add('active');
                    c.style.display = 'block';
                } else {
                    c.classList.remove('active');
                    c.style.display = 'none';
                }
            });
        });
    });

    // Renderuj stany
    renderStatesInfoList();
}

function renderStatesInfoList() {
    var container = document.getElementById('statesInfoList');
    if (!container) return;
    container.innerHTML = '';
    
    var states = [
        { name: 'Nieprzytomny', icon: '💀', desc: 'Obezwładniony. Trafienie w zwarciu to krytyk. Upuszcza wszystko co trzyma. Automatycznie oblewa rzuty obronne na Siłę i Zręczność. Nie może się poruszać ani mówić.' },
        { name: 'Niewidzialny', icon: '👻', desc: 'Traktowany jako mocno zasłonięty. Ataki na niego mają utrudnienie, jego ataki mają przewagę. Nie można go celować czarami wymagającymi widzenia celu.' },
        { name: 'Obezwładniony', icon: '💫', desc: 'Nie może podejmować akcji ani reakcji. Nie może koncentrować się na czarach. Nie może się poruszać.' },
        { name: 'Ogłuchły', icon: '🔇', desc: 'Nie słyszy. Automatycznie oblewa testy wymagające słuchu. Nie może korzystać z mocy wymagających słyszenia.' },
        { name: 'Ogłuszony', icon: '💥', desc: 'Obezwładniony. Oblewa rzuty obronne na Siłę i Zręczność. Nie może mówić. Nie może podejmować akcji.' },
        { name: 'Oślepiony', icon: '👁️', desc: 'Nie widzi. Ataki przeciwko niemu mają przewagę, jego ataki mają utrudnienie. Automatycznie oblewa testy wymagające wzroku.' },
        { name: 'Pochwycony', icon: '🤝', desc: 'Prędkość spada do 0. Może użyć akcji, aby uwolnić się testem Siły (Atletyka) przeciwko testowi Siły (Atletyka) lub Zręczności (Akrobatyka) porywacza.' },
        { name: 'Powałony', icon: '⬇️', desc: 'Ataki w zwarciu mają przewagę, na dystans utrudnienie. Ruchy wymagają dodatkowej połowy prędkości. Może powstać używając połowy prędkości.' },
        { name: 'Przerażony', icon: '😨', desc: 'Utrudnienie na ataki i testy umiejętności, gdy widzi źródło strachu. Nie może się do niego zbliżyć.' },
        { name: 'Skamieniały', icon: '🪨', desc: 'Odporny na obrażenia. Niewrażliwy na trucizny. Zamieniony w kamień - waga x10. Nie może się poruszać ani mówić.' },
        { name: 'Sparaliżowany', icon: '🧊', desc: 'Obezwładniony. Trafienie z 5 ft to krytyk. Automatycznie oblewa rzuty obronne na Siłę i Zręczność. Nie może się poruszać.' },
        { name: 'Unieruchomiony', icon: '⛓️', desc: 'Prędkość 0. Ataki na cel mają przewagę. Utrudnienie na ataki wykonywane przez cel. Oblewa rzuty obronne na Zręczność.' },
        { name: 'Zatruty', icon: '☠️', desc: 'Utrudnienie na testy ataków i rzuty obronne. Nie ma wpływu na obrażenia od trucizny. Może być leczony przez Lesser Restoration.' },
        { name: 'Zauroczony', icon: '💗', desc: 'Nie może atakować źródła uroku. Źródło ma przewagę w testach towarzyskich. Nie może celować w źródło uroku szkodliwymi zdolnościami.' },
        { name: 'Wyczerpanie', icon: '🥱', desc: 'Skala 1-6: Poziom 1 - utrudnienie na testy umiejętności; 2 - prędkość połowa; 3 - utrudnienie na ataki i obrony; 4 - HP max połowa; 5 - prędkość 0; 6 - śmierć. Każdy poziom znika po długim odpoczynku.' }
    ];
    
    states.forEach(function(state) {
        var item = document.createElement('div');
        item.className = 'info-item';
        item.innerHTML = '<div class="info-item-header">' +
                           '<span class="info-icon">' + state.icon + '</span>' +
                           '<span class="info-title">' + state.name + '</span>' +
                         '</div>' +
                         '<div class="info-desc">' + state.desc + '</div>';
        container.appendChild(item);
    });
}

// Auto-inicjalizacja
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initInfoTabs();
    });
} else {
    initInfoTabs();
}

// Eksport
window.initInfoTabs = initInfoTabs;
window.renderStatesInfoList = renderStatesInfoList;