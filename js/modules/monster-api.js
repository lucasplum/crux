// ============================================================
//  MONSTER API - Pobieranie danych i obrazków z D&D 5e API
//  Obrazki: https://www.dnd5eapi.co + pole "image" z danych potwora
// ============================================================

var MONSTER_API = {
  baseUrl: 'https://www.dnd5eapi.co',
  apiUrl: 'https://www.dnd5eapi.co/api/2014/monsters',
  cacheKey: 'crux_monster_data',
  monsterCache: {},
  monsterList: [],
  isLoading: false
};

// ====== INICJALIZACJA CACHE ======
function initMonsterCache() {
  try {
    var cached = localStorage.getItem(MONSTER_API.cacheKey);
    if (cached) {
      MONSTER_API.monsterCache = JSON.parse(cached);
    }
  } catch (e) {
    console.warn('Błąd odczytu cache potworów:', e);
    MONSTER_API.monsterCache = {};
  }
}

// ====== ZAPIS CACHE ======
function saveMonsterCache() {
  try {
    localStorage.setItem(MONSTER_API.cacheKey, JSON.stringify(MONSTER_API.monsterCache));
  } catch (e) {
    console.warn('Błąd zapisu cache potworów:', e);
  }
}

// ====== POBIERZ LISTĘ POTWORÓW ======
function fetchMonsterList(callback) {
  if (MONSTER_API.monsterList.length > 0) {
    if (callback) callback(MONSTER_API.monsterList);
    return;
  }
  
  if (MONSTER_API.isLoading) {
    setTimeout(function() { fetchMonsterList(callback); }, 200);
    return;
  }
  
  MONSTER_API.isLoading = true;
  
  fetch(MONSTER_API.apiUrl)
    .then(function(response) {
      if (!response.ok) throw new Error('Błąd pobierania listy potworów');
      return response.json();
    })
    .then(function(data) {
      MONSTER_API.monsterList = data.results || [];
      MONSTER_API.isLoading = false;
      if (callback) callback(MONSTER_API.monsterList);
    })
    .catch(function(error) {
      console.error('Błąd pobierania listy potworów:', error);
      MONSTER_API.isLoading = false;
      if (callback) callback([]);
    });
}

// ====== POBIERZ SZCZEGÓŁY POTWORA ======
function fetchMonsterDetails(index, callback) {
  var monster = MONSTER_API.monsterList[index];
  if (!monster) {
    if (callback) callback(null);
    return;
  }
  
  // Sprawdź cache
  if (MONSTER_API.monsterCache[monster.index]) {
    if (callback) callback(MONSTER_API.monsterCache[monster.index]);
    return;
  }
  
  fetch(MONSTER_API.baseUrl + monster.url)
    .then(function(response) {
      if (!response.ok) throw new Error('Błąd pobierania danych potwora');
      return response.json();
    })
    .then(function(data) {
      MONSTER_API.monsterCache[data.index] = data;
      saveMonsterCache();
      if (callback) callback(data);
    })
    .catch(function(error) {
      console.warn('Błąd pobierania danych dla ' + monster.name + ':', error);
      if (callback) callback(null);
    });
}

// ====== POBIERZ URL OBRAZKA POTWORA ======
function getMonsterImageUrl(monsterData) {
  // Jeśli mamy dane z API i zawierają pole image, użyj go
  if (monsterData && monsterData.image) {
    return MONSTER_API.baseUrl + monsterData.image;
  }
  
  // Jeśli nie ma obrazka w danych, spróbuj wygenerować na podstawie nazwy
  var name = monsterData ? monsterData.name : '';
  if (name) {
    var formattedName = name.toLowerCase().replace(/['".,()]/g, '').replace(/\s+/g, '-');
    // Spróbuj użyć standardowej ścieżki
    return MONSTER_API.baseUrl + '/api/images/monsters/' + formattedName + '.png';
  }
  
  // Ostateczny fallback - generuj awatar
  return 'https://api.dicebear.com/7.x/thumbs/svg?seed=' + encodeURIComponent(name || 'monster') + '&size=300&backgroundColor=1c1812';
}

// ====== POBIERZ ZDJĘCIE POTWORA (z cache lub API) ======
function getMonsterImage(monsterName, callback) {
  initMonsterCache();
  
  // Sprawdź czy już mamy w cache
  var cacheKey = monsterName.toLowerCase().replace(/['".,()]/g, '').replace(/\s+/g, '-');
  if (MONSTER_API.monsterCache[cacheKey]) {
    var data = MONSTER_API.monsterCache[cacheKey];
    var imageUrl = getMonsterImageUrl(data);
    if (callback) callback(imageUrl);
    return;
  }
  
  // Szukamy w liście potworów
  fetchMonsterList(function(list) {
    var found = list.find(function(m) {
      return m.name.toLowerCase() === monsterName.toLowerCase();
    });
    
    if (found) {
      fetchMonsterDetails(list.indexOf(found), function(details) {
        if (details) {
          var imageUrl = getMonsterImageUrl(details);
          if (callback) callback(imageUrl);
        } else {
          // Fallback - wygeneruj na podstawie nazwy
          var fallbackUrl = MONSTER_API.baseUrl + '/api/images/monsters/' + cacheKey + '.png';
          if (callback) callback(fallbackUrl);
        }
      });
    } else {
      // Jeśli nie znaleziono, wygeneruj na podstawie nazwy
      var fallbackUrl = MONSTER_API.baseUrl + '/api/images/monsters/' + cacheKey + '.png';
      if (callback) callback(fallbackUrl);
    }
  });
}

// ====== POBIERZ WSZYSTKIE DANE POTWORA ======
function getMonsterData(monsterName, callback) {
  initMonsterCache();
  
  var cacheKey = monsterName.toLowerCase().replace(/['".,()]/g, '').replace(/\s+/g, '-');
  if (MONSTER_API.monsterCache[cacheKey]) {
    if (callback) callback(MONSTER_API.monsterCache[cacheKey]);
    return;
  }
  
  fetchMonsterList(function(list) {
    var found = list.find(function(m) {
      return m.name.toLowerCase() === monsterName.toLowerCase();
    });
    
    if (found) {
      fetchMonsterDetails(list.indexOf(found), function(details) {
        if (callback) callback(details);
      });
    } else {
      if (callback) callback(null);
    }
  });
}

// ====== SZUKAJ POTWORA PO NAZWIE ======
function searchMonsters(query, callback) {
  fetchMonsterList(function(list) {
    var results = list.filter(function(m) {
      return m.name.toLowerCase().includes(query.toLowerCase());
    });
    if (callback) callback(results);
  });
}

// ====== EKSPORT ======
window.MONSTER_API = MONSTER_API;
window.initMonsterCache = initMonsterCache;
window.saveMonsterCache = saveMonsterCache;
window.fetchMonsterList = fetchMonsterList;
window.fetchMonsterDetails = fetchMonsterDetails;
window.getMonsterImage = getMonsterImage;
window.getMonsterData = getMonsterData;
window.searchMonsters = searchMonsters;
window.getMonsterImageUrl = getMonsterImageUrl;