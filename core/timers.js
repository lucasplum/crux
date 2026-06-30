// ============================================================
//  TIMERS
// ============================================================

var timers = [];
var timerInterval = null;

function openTimers() {
  var existing = document.getElementById('timerPopup');
  if (existing) existing.remove();

  var popup = document.createElement('div');
  popup.className = 'popup-overlay';
  popup.id = 'timerPopup';
  popup.innerHTML = `
    <div class="popup-content timer-popup-content">
      <div class="popup-title">⏱️ Efekty czasowe</div>
      <div class="timer-list" id="timerList"></div>
      <div class="timer-add">
        <input id="timerName" placeholder="Nazwa efektu..."/>
        <select id="timerDuration">
          <option value="1">1 tura</option>
          <option value="2">2 tury</option>
          <option value="3">3 tury</option>
          <option value="5">5 tur</option>
          <option value="10">10 tur</option>
          <option value="999">∞</option>
        </select>
        <button onclick="addTimer()">+</button>
      </div>
      <button class="popup-close" onclick="closeTimerPopup()">✕ Zamknij</button>
    </div>
  `;
  document.body.appendChild(popup);
  updateTimerList();
}

function closeTimerPopup() {
  var p = document.getElementById('timerPopup');
  if (p) p.remove();
}

function updateTimerList() {
  var container = document.getElementById('timerList');
  if (!container) return;
  container.innerHTML = '';
  if (timers.length === 0) {
    container.innerHTML = '<div style="color:var(--muted);font-size:.7rem;text-align:center;padding:6px;">Brak aktywnych efektów</div>';
    return;
  }
  timers.forEach(function(t, i) {
    var div = document.createElement('div');
    div.className = 'timer-item';
    var timeStr = t.remaining >= 999 ? '∞' : t.remaining + ' tur';
    div.innerHTML = `
      <span class="timer-name">${t.name}</span>
      <span class="timer-time">${timeStr}</span>
      <span class="timer-remove" onclick="removeTimer(${i})">✕</span>
    `;
    container.appendChild(div);
  });
}

function addTimer() {
  var nameInput = document.getElementById('timerName');
  var durationSelect = document.getElementById('timerDuration');
  if (!nameInput || !durationSelect) return;
  var name = nameInput.value.trim();
  var duration = parseInt(durationSelect.value);
  if (!name) return;
  timers.push({ name: name, duration: duration, remaining: duration, active: true });
  nameInput.value = '';
  updateTimerList();
  if (!timerInterval) {
    timerInterval = setInterval(tickTimers, 1000);
  }
  playSound('add');
}

function removeTimer(index) {
  timers.splice(index, 1);
  updateTimerList();
  if (typeof renderInit === 'function') renderInit();
}

function tickTimers() {
  var changed = false;
  timers = timers.filter(function(t) {
    if (t.active && t.remaining > 0 && t.remaining < 999) {
      t.remaining--;
      if (t.remaining <= 0) { changed = true; return false; }
      changed = true;
      return true;
    }
    return t.active;
  });
  if (changed) {
    updateTimerList();
    if (typeof renderInit === 'function') renderInit();
  }
}

function advanceTimers() {
  timers = timers.filter(function(t) {
    if (t.active && t.remaining > 0 && t.remaining < 999) {
      t.remaining--;
      return t.remaining > 0;
    }
    return t.active;
  });
  updateTimerList();
}

// Eksport do window
window.openTimers = openTimers;
window.closeTimerPopup = closeTimerPopup;
window.addTimer = addTimer;
window.removeTimer = removeTimer;