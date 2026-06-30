// ============================================================
//  SPELLBOOK - STATYCZNA LISTA (zastąpiona przez loader)
// ============================================================
// Ten plik jest teraz zastąpiony przez spellbook-loader.js
// Zachowujemy go dla kompatybilności, ale funkcje są nadpisywane

// Eksport pustej tablicy
window.SPELLBOOK = [];
window.renderSpellbook = function() {
  // Funkcja nadpisywana przez loader
  console.warn('Spellbook loader nie został załadowany - używam statycznej listy');
};