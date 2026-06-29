/* ========== STATE EMOJI MAP ========== */
function getStateEmoji(state) {
  const map = {
    'Blinded':'👁️','Charmed':'💗','Deafened':'🔇','Frightened':'😨',
    'Grappled':'🤝','Incapacitated':'💫','Invisible':'👻','Paralyzed':'🧊',
    'Petrified':'🪨','Poisoned':'☠️','Prone':'⬇️','Restrained':'⛓️',
    'Stunned':'💥','Unconscious':'💀','Exhaustion':'🥱'
  };
  return map[state] || '⚡';
}

/* ========== STATE DESCRIPTIONS ========== */
const STATE_DESCRIPTIONS = {
  'Blinded': '<strong>👁️ Oślepiony</strong><br/>Nie widzi. Ataki przeciwko niemu mają przewagę, jego ataki mają utrudnienie. Automatycznie oblewa testy wymagające wzroku.',
  'Charmed': '<strong>💗 Zauroczony</strong><br/>Nie może atakować źródła uroku. Źródło ma przewagę w testach towarzyskich. Nie może celować w źródło uroku szkodliwymi zdolnościami.',
  'Deafened': '<strong>🔇 Ogłuszony</strong><br/>Nie słyszy. Automatycznie oblewa testy wymagające słuchu. Nie może korzystać z mocy wymagających słyszenia.',
  'Frightened': '<strong>😨 Przerażony</strong><br/>Utrudnienie na ataki i testy umiejętności, gdy widzi źródło strachu. Nie może się do niego zbliżyć.',
  'Grappled': '<strong>🤝 Pochwycony</strong><br/>Prędkość spada do 0. Może użyć akcji, aby uwolnić się testem Siły (Atletyka) przeciwko testowi Siły (Atletyka) lub Zręczności (Akrobatyka) porywacza.',
  'Incapacitated': '<strong>💫 Obezwładniony</strong><br/>Nie może podejmować akcji ani reakcji. Nie może koncentrować się na czarach.',
  'Invisible': '<strong>👻 Niewidzialny</strong><br/>Traktowany jako mocno zasłonięty. Ataki na niego z utrudnieniem, jego z przewagą. Nie można go celować czarami wymagającymi widzenia celu.',
  'Paralyzed': '<strong>🧊 Sparaliżowany</strong><br/>Obezwładniony. Trafienie z 5 ft to krytyk. Automatycznie oblewa rzuty obronne na Siłę i Zręczność.',
  'Petrified': '<strong>🪨 Spetryfikowany</strong><br/>Odporny na obrażenia. Niewrażliwy na trucizny. Zamieniony w kamień - waga x10.',
  'Poisoned': '<strong>☠️ Zatruty</strong><br/>Utrudnienie na testy ataków i rzuty obronne. Nie ma wpływu na obrażenia od trucizny.',
  'Prone': '<strong>⬇️ Leżący</strong><br/>Ataki w zwarciu z przewagą, na dystans z utrudnieniem. Ruchy wymagają dodatkowej połowy prędkości.',
  'Restrained': '<strong>⛓️ Skrępowany</strong><br/>Prędkość 0. Ataki na cel z przewagą. Utrudnienie na ataki wykonywane przez cel. Oblewa rzuty obronne na Zręczność.',
  'Stunned': '<strong>💥 Oszołomiony</strong><br/>Obezwładniony. Oblewa rzuty na Siłę i Zręczność. Nie może mówić.',
  'Unconscious': '<strong>💀 Nieprzytomny</strong><br/>Obezwładniony. Trafienie w zwarciu to krytyk. Upuszcza wszystko co trzyma. Automatycznie oblewa rzuty obronne.',
  'Exhaustion': '<strong>🥱 Wyczerpanie</strong><br/>Skala 1-6: Poziom 1 - utrudnienie na testy umiejętności; 2 - prędkość połowa; 3 - utrudnienie na ataki i obrony; 4 - HP max połowa; 5 - prędkość 0; 6 - śmierć.'
};