// ============================================================
//  STORAGE - Zapis i odczyt stanu
// ============================================================

var STORAGE_KEY = 'crux_toolkit_data';

// ====== ZAPIS ======
function saveState() {
  try {
    var data = {
      players: typeof players !== 'undefined' ? players : [],
      combatants: typeof combatants !== 'undefined' ? combatants : [],
      round: typeof round !== 'undefined' ? round : 1,
      currentTurn: typeof currentTurn !== 'undefined' ? currentTurn : 0,
      focusFire: typeof focusFire !== 'undefined' ? focusFire : [],
      turnLog: typeof turnLog !== 'undefined' ? turnLog : [],
      timers: typeof timers !== 'undefined' ? timers : [],
      version: '1.0',
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log('💾 Stan zapisany:', data.timestamp);
    return true;
  } catch (e) {
    console.error('❌ Błąd zapisu:', e);
    return false;
  }
}

// ====== ODCZYT ======
function loadState() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    
    var data = JSON.parse(raw);
    
    // Przywracanie danych - używaj globalnych zmiennych
    if (data.players && typeof players !== 'undefined') {
      players.length = 0;
      data.players.forEach(function(p) { players.push(p); });
    }
    
    if (data.combatants && typeof combatants !== 'undefined') {
      combatants.length = 0;
      data.combatants.forEach(function(c) { combatants.push(c); });
    }
    
    if (data.round && typeof round !== 'undefined') round = data.round;
    if (data.currentTurn !== undefined && typeof currentTurn !== 'undefined') currentTurn = data.currentTurn;
    
    if (data.focusFire && typeof focusFire !== 'undefined') {
      focusFire.length = 0;
      data.focusFire.forEach(function(f) { focusFire.push(f); });
    }
    if (data.turnLog && typeof turnLog !== 'undefined') {
      turnLog.length = 0;
      data.turnLog.forEach(function(t) { turnLog.push(t); });
    }
    if (data.timers && typeof timers !== 'undefined') {
      timers.length = 0;
      data.timers.forEach(function(t) { timers.push(t); });
    }
    
    console.log('📂 Stan wczytany:', data.timestamp);
    return true;
  } catch (e) {
    console.error('❌ Błąd odczytu:', e);
    return false;
  }
}

// ====== EKSPORT DO PLIKU ======
function exportState() {
  try {
    var data = {
      players: typeof players !== 'undefined' ? players : [],
      combatants: typeof combatants !== 'undefined' ? combatants : [],
      round: typeof round !== 'undefined' ? round : 1,
      currentTurn: typeof currentTurn !== 'undefined' ? currentTurn : 0,
      focusFire: typeof focusFire !== 'undefined' ? focusFire : [],
      turnLog: typeof turnLog !== 'undefined' ? turnLog : [],
      timers: typeof timers !== 'undefined' ? timers : [],
      version: '1.0',
      timestamp: new Date().toISOString(),
      exportDate: new Date().toISOString()
    };
    
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'crux_save_' + new Date().toISOString().slice(0,10) + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('📤 Eksport zakończony');
    return true;
  } catch (e) {
    console.error('❌ Błąd eksportu:', e);
    alert('Błąd eksportu: ' + e.message);
    return false;
  }
}

// ====== IMPORT Z PLIKU ======
function importState() {
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = function(e) {
    var file = e.target.files[0];
    if (!file) return;
    
    var reader = new FileReader();
    reader.onload = function(ev) {
      try {
        var data = JSON.parse(ev.target.result);
        
        if (!data.players && !data.combatants) {
          alert('❌ Niepoprawny plik - brak danych postaci lub bojowników');
          return;
        }
        
        if (confirm('⚠️ Import nadpisze obecny stan! Kontynuować?')) {
          // Przywracanie danych
          if (data.players && typeof players !== 'undefined') {
            players.length = 0;
            data.players.forEach(function(p) { players.push(p); });
          }
          
          if (data.combatants && typeof combatants !== 'undefined') {
            combatants.length = 0;
            data.combatants.forEach(function(c) { combatants.push(c); });
          }
          
          if (data.round && typeof round !== 'undefined') round = data.round;
          if (data.currentTurn !== undefined && typeof currentTurn !== 'undefined') currentTurn = data.currentTurn;
          
          if (data.focusFire && typeof focusFire !== 'undefined') {
            focusFire.length = 0;
            data.focusFire.forEach(function(f) { focusFire.push(f); });
          }
          if (data.turnLog && typeof turnLog !== 'undefined') {
            turnLog.length = 0;
            data.turnLog.forEach(function(t) { turnLog.push(t); });
          }
          if (data.timers && typeof timers !== 'undefined') {
            timers.length = 0;
            data.timers.forEach(function(t) { timers.push(t); });
          }
          
          // Odśwież UI - sprawdź czy funkcje istnieją
          if (typeof renderPlayers === 'function') renderPlayers();
          if (typeof renderInit === 'function') renderInit();
          if (typeof updateFocusFire === 'function') updateFocusFire();
          if (typeof updateCombatStats === 'function') updateCombatStats();
          
          // Zapisz do localStorage
          saveState();
          
          alert('✅ Import zakończony!');
          console.log('📥 Import zakończony:', data);
        }
      } catch (err) {
        alert('❌ Błąd importu: ' + err.message);
        console.error('❌ Błąd importu:', err);
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

// ====== AUTOMATYCZNY ZAPIS CO 30 SEKUND ======
var autoSaveInterval = null;

function startAutoSave(intervalMs) {
  intervalMs = intervalMs || 30000;
  
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
  }
  
  autoSaveInterval = setInterval(function() {
    saveState();
  }, intervalMs);
  
  console.log('⏰ Auto-save co ' + (intervalMs/1000) + 's');
}

function stopAutoSave() {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
    autoSaveInterval = null;
    console.log('⏰ Auto-save zatrzymany');
  }
}

// ====== INICJALIZACJA ======
function initStorage() {
  // Wczytaj stan
  var loaded = loadState();
  
  if (loaded) {
    // Odśwież UI - sprawdź czy funkcje istnieją
    if (typeof renderPlayers === 'function') renderPlayers();
    if (typeof renderInit === 'function') renderInit();
    if (typeof updateFocusFire === 'function') updateFocusFire();
    if (typeof updateCombatStats === 'function') updateCombatStats();
    console.log('📂 Stan wczytany z localStorage');
  } else {
    console.log('📂 Brak zapisanego stanu');
  }
  
  // Auto-save
  startAutoSave(30000);
  
  // Zapisz przy zamknięciu
  window.addEventListener('beforeunload', function() {
    saveState();
  });
}

// ====== EKSPORT ======
window.saveState = saveState;
window.loadState = loadState;
window.exportState = exportState;
window.importState = importState;
window.startAutoSave = startAutoSave;
window.stopAutoSave = stopAutoSave;
window.initStorage = initStorage;