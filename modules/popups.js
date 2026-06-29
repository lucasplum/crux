/* ========== DICE ROLLER ========== */
var dmgPopupTarget = null;
var conditionPopupTarget = null;
var focusFire = [];
var timers = [];
var timerInterval = null;

function rollDice(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function openDice() {
  const existing = document.getElementById('dicePopup');
  if (existing) existing.remove();
  const popup = document.createElement('div');
  popup.className = 'popup-overlay';
  popup.id = 'dicePopup';
  popup.innerHTML = `
    <div class="popup-content dice-popup-content">
      <div class="popup-title">🎲 Rzut kośćmi</div>
      <div class="dice-result" id="diceResult">🎲</div>
      <div class="dice-desc" id="diceDesc">Wybierz kość lub wpisz własną</div>
      <div class="dice-btns">
        <button onclick="rollAndShow(4)">k4</button>
        <button onclick="rollAndShow(6)">k6</button>
        <button onclick="rollAndShow(8)">k8</button>
        <button onclick="rollAndShow(10)">k10</button>
        <button onclick="rollAndShow(12)">k12</button>
        <button class="d20" onclick="rollAndShow(20)">k20</button>
        <button onclick="rollAndShow(100)">k100</button>
        <button onclick="rollAdvantage()">⚡ Przew</button>
      </div>
      <div class="dice-custom">
        <input type="text" id="customDice" placeholder="np. 2d6"/>
        <button onclick="rollCustom()">Rzuć</button>
      </div>
      <button class="popup-close" onclick="closeDicePopup()">✕ Zamknij</button>
    </div>
  `;
  document.body.appendChild(popup);
}

function rollAndShow(sides) {
  const result = rollDice(sides);
  document.getElementById('diceResult').textContent = result;
  document.getElementById('diceDesc').textContent = `🎲 k${sides} → ${result}`;
  if (typeof playSound === 'function') playSound('dice');
}

function rollAdvantage() {
  const r1 = rollDice(20);
  const r2 = rollDice(20);
  const best = Math.max(r1, r2);
  document.getElementById('diceResult').textContent = best;
  document.getElementById('diceDesc').textContent = `🎲 Przewaga: ${r1} + ${r2} → ${best} (najlepszy)`;
  if (typeof playSound === 'function') playSound('dice');
}

function rollCustom() {
  const input = document.getElementById('customDice').value.trim();
  const match = input.match(/^(\d+)d(\d+)$/i);
  if (match) {
    const count = parseInt(match[1]);
    const sides = parseInt(match[2]);
    let total = 0;
    let results = [];
    for (let i = 0; i < count; i++) {
      const r = rollDice(sides);
      results.push(r);
      total += r;
    }
    document.getElementById('diceResult').textContent = total;
    document.getElementById('diceDesc').textContent = `🎲 ${input} → ${results.join(' + ')} = ${total}`;
    if (typeof playSound === 'function') playSound('dice');
  } else {
    document.getElementById('diceDesc').textContent = '❌ Użyj formatu: 2d6, 1d20 itp.';
  }
}

function closeDicePopup() {
  const popup = document.getElementById('dicePopup');
  if (popup) popup.remove();
}

/* ========== DAMAGE POPUP ========== */
function showDamagePopup(targetName) {
  const existing = document.getElementById('dmgPopup');
  if (existing) existing.remove();
  const popup = document.createElement('div');
  popup.className = 'popup-overlay';
  popup.id = 'dmgPopup';
  popup.innerHTML = `
    <div class="popup-content dmg-popup-content">
      <div class="popup-title">⚔️ ${targetName}</div>
      <div class="dmg-sub">Wprowadź obrażenia lub rzuć kością</div>
      <div class="dmg-input-row">
        <input type="number" id="dmgAmount" placeholder="0" value="" step="1"/>
      </div>
      <div class="dmg-btns">
        <button onclick="rollDmg(4)">🎲 k4</button>
        <button onclick="rollDmg(6)">🎲 k6</button>
        <button onclick="rollDmg(8)">🎲 k8</button>
        <button onclick="rollDmg(10)">🎲 k10</button>
        <button onclick="rollDmg(12)">🎲 k12</button>
        <button class="crit" onclick="rollDmg(20)">💀 k20</button>
      </div>
      <div class="dmg-check">
        <input type="checkbox" id="dmgCrit"/>
        <label for="dmgCrit">💀 Krytyk (x2)</label>
      </div>
      <div class="dmg-actions">
        <button class="btn-dmg" onclick="applyDamage()">⚔️ Zadaj</button>
        <button class="btn-cancel" onclick="closeDmgPopup()">Anuluj</button>
      </div>
    </div>
  `;
  document.body.appendChild(popup);
  if (isMobile()) {
    const inputs = popup.querySelectorAll('input');
    inputs.forEach(input => {
      input.setAttribute('inputmode', 'numeric');
      input.setAttribute('pattern', '[0-9]*');
    });
  }
  const input = document.getElementById('dmgAmount');
  input.focus();
  setTimeout(() => input.select(), 100);
}

function rollDmg(sides) {
  const val = rollDice(sides);
  document.getElementById('dmgAmount').value = val;
  if (typeof playSound === 'function') playSound('dice');
}

function applyDamage() {
  const amount = parseInt(document.getElementById('dmgAmount').value) || 0;
  const crit = document.getElementById('dmgCrit').checked;
  const finalDmg = crit ? amount * 2 : amount;
  if (dmgPopupTarget) {
    const { type, index } = dmgPopupTarget;
    if (type === 'player' && typeof players !== 'undefined' && players[index]) {
      players[index].hp = Math.max(0, players[index].hp - finalDmg);
      const name = players[index].name;
      const existing = focusFire.find(f => f.name === name);
      if (existing) {
        existing.dmg += finalDmg;
      } else {
        focusFire.push({ name, dmg: finalDmg, status: '⚔️ ' + finalDmg + ' dmg' });
      }
      if (typeof addTurnLog === 'function') addTurnLog(name, '⚔️ ' + finalDmg + ' obrażeń');
      if (players[index].hp <= 0) {
        if (typeof playSound === 'function') playSound('death');
        if (typeof addTurnLog === 'function') addTurnLog(name, '💀 ŚMIERĆ!');
        setTimeout(() => {
          if (typeof renderPlayers === 'function') renderPlayers();
          if (typeof updateFocusFire === 'function') updateFocusFire();
        }, 200);
      } else {
        if (typeof playSound === 'function') playSound(finalDmg > 10 ? 'crit' : 'hit');
        if (typeof renderPlayers === 'function') renderPlayers();
        if (typeof updateFocusFire === 'function') updateFocusFire();
      }
    } else if (type === 'init' && typeof combatants !== 'undefined' && combatants[index]) {
      combatants[index].hp = Math.max(0, combatants[index].hp - finalDmg);
      combatants[index].roundDamage = (combatants[index].roundDamage || 0) + finalDmg;
      const name = combatants[index].name;
      const existing = focusFire.find(f => f.name === name);
      if (existing) {
        existing.dmg += finalDmg;
      } else {
        focusFire.push({ name, dmg: finalDmg, status: '⚔️ ' + finalDmg + ' dmg' });
      }
      if (typeof addTurnLog === 'function') addTurnLog(name, '⚔️ ' + finalDmg + ' obrażeń');
      if (combatants[index].hp <= 0) {
        if (typeof playSound === 'function') playSound('death');
        if (typeof addTurnLog === 'function') addTurnLog(name, '💀 ŚMIERĆ!');
        setTimeout(() => {
          if (confirm(`💀 ${combatants[index].name} został zabity! Usunąć?`)) {
            if (typeof triggerDeath === 'function') triggerDeath(index);
          } else {
            if (typeof renderInit === 'function') renderInit();
            if (typeof updateFocusFire === 'function') updateFocusFire();
          }
        }, 200);
      } else {
        if (typeof playSound === 'function') playSound(finalDmg > 10 ? 'crit' : 'hit');
        if (typeof renderInit === 'function') renderInit();
        if (typeof updateFocusFire === 'function') updateFocusFire();
      }
    }
  }
  closeDmgPopup();
}

function closeDmgPopup() {
  const popup = document.getElementById('dmgPopup');
  if (popup) popup.remove();
  dmgPopupTarget = null;
}

/* ========== TIMERS ========== */
function openTimers() {
  const existing = document.getElementById('timerPopup');
  if (existing) existing.remove();
  const popup = document.createElement('div');
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

function addTimer() {
  const name = document.getElementById('timerName').value.trim();
  const duration = parseInt(document.getElementById('timerDuration').value);
  if (!name) return;
  timers.push({ name, duration, remaining: duration, active: true });
  document.getElementById('timerName').value = '';
  updateTimerList();
  if (!timerInterval) {
    timerInterval = setInterval(tickTimers, 1000);
  }
  if (typeof playSound === 'function') playSound('add');
}

function tickTimers() {
  let changed = false;
  timers = timers.filter(t => {
    if (t.active && t.remaining > 0 && t.remaining < 999) {
      t.remaining--;
      if (t.remaining <= 0) {
        changed = true;
        return false;
      }
      changed = true;
    }
    return t.active;
  });
  if (changed) {
    updateTimerList();
    if (typeof renderInit === 'function') renderInit();
  }
}

function updateTimerList() {
  const container = document.getElementById('timerList');
  if (!container) return;
  container.innerHTML = '';
  if (timers.length === 0) {
    container.innerHTML = '<div style="color:var(--muted);font-size:.7rem;text-align:center;padding:6px;">Brak aktywnych efektów</div>';
    return;
  }
  timers.forEach((t, i) => {
    const div = document.createElement('div');
    div.className = 'timer-item';
    const timeStr = t.remaining >= 999 ? '∞' : t.remaining + ' tur';
    div.innerHTML = `<span class="timer-name">${t.name}</span><span class="timer-time">${timeStr}</span><span class="timer-remove" onclick="removeTimer(${i})">✕</span>`;
    container.appendChild(div);
  });
}

function removeTimer(index) {
  timers.splice(index, 1);
  updateTimerList();
  if (typeof renderInit === 'function') renderInit();
}

function closeTimerPopup() {
  const popup = document.getElementById('timerPopup');
  if (popup) popup.remove();
}

function advanceTimers() {
  timers = timers.filter(t => {
    if (t.active && t.remaining > 0 && t.remaining < 999) {
      t.remaining--;
      return t.remaining > 0;
    }
    return t.active;
  });
  updateTimerList();
}

/* ========== CONDITION POPUP ========== */
function showCondPopup(name, currentConds, onToggle) {
  const existing = document.getElementById('condPopup');
  if (existing) existing.remove();
  const allConds = ['Blinded', 'Charmed', 'Deafened', 'Frightened', 'Grappled', 'Incapacitated', 'Invisible', 'Paralyzed', 'Petrified', 'Poisoned', 'Prone', 'Restrained', 'Stunned', 'Unconscious', 'Exhaustion'];
  const popup = document.createElement('div');
  popup.className = 'popup-overlay';
  popup.id = 'condPopup';
  let btns = '';
  allConds.forEach(c => {
    const active = currentConds.includes(c) ? 'active' : '';
    btns += `<button class="cond-popup-btn ${active}" data-cond="${c}">${getStateEmoji(c)} ${c}</button>`;
  });
  popup.innerHTML = `
    <div class="popup-content cond-popup-content">
      <div class="popup-title">🐦‍⬛ ${name} — Stany</div>
      <div class="cond-popup-grid">${btns}</div>
      <button class="popup-close" onclick="closeCondPopup()">✕ Zamknij</button>
    </div>
  `;
  popup.querySelectorAll('.cond-popup-btn').forEach(b => {
    b.onclick = () => {
      const cond = b.dataset.cond;
      onToggle(cond);
      b.classList.toggle('active');
    };
  });
  document.body.appendChild(popup);
}

function updateCondPopup(popup, currentConds) {
  popup.querySelectorAll('.cond-popup-btn').forEach(b => {
    if (currentConds.includes(b.dataset.cond)) {
      b.classList.add('active');
    } else {
      b.classList.remove('active');
    }
  });
}

function closeCondPopup() {
  const popup = document.getElementById('condPopup');
  if (popup) popup.remove();
  conditionPopupTarget = null;
}