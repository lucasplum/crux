// ============================================================
//  DICE
// ============================================================

function rollDice(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function openDice() {
  var existing = document.getElementById('dicePopup');
  if (existing) existing.remove();

  var popup = document.createElement('div');
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

function closeDicePopup() {
  var p = document.getElementById('dicePopup');
  if (p) p.remove();
}

function rollAndShow(sides) {
  var r = rollDice(sides);
  var resultEl = document.getElementById('diceResult');
  var descEl = document.getElementById('diceDesc');
  if (resultEl) resultEl.textContent = r;
  if (descEl) descEl.textContent = '🎲 k' + sides + ' → ' + r;
  playSound('dice');
}

function rollAdvantage() {
  var r1 = rollDice(20);
  var r2 = rollDice(20);
  var best = Math.max(r1, r2);
  var resultEl = document.getElementById('diceResult');
  var descEl = document.getElementById('diceDesc');
  if (resultEl) resultEl.textContent = best;
  if (descEl) descEl.textContent = '🎲 Przewaga: ' + r1 + ' + ' + r2 + ' → ' + best;
  playSound('dice');
}

function rollCustom() {
  var input = document.getElementById('customDice');
  var descEl = document.getElementById('diceDesc');
  if (!input || !descEl) return;
  var value = input.value.trim();
  var match = value.match(/^(\d+)d(\d+)$/i);
  if (match) {
    var count = parseInt(match[1]);
    var sides = parseInt(match[2]);
    var total = 0;
    var rolls = [];
    for (var i = 0; i < count; i++) {
      var x = rollDice(sides);
      rolls.push(x);
      total += x;
    }
    var resultEl = document.getElementById('diceResult');
    if (resultEl) resultEl.textContent = total;
    descEl.textContent = '🎲 ' + value + ' → ' + rolls.join(' + ') + ' = ' + total;
    playSound('dice');
  } else {
    descEl.textContent = '❌ Użyj formatu: 2d6, 1d20 itp.';
  }
}

// Eksport do window
window.openDice = openDice;
window.closeDicePopup = closeDicePopup;
window.rollAndShow = rollAndShow;
window.rollAdvantage = rollAdvantage;
window.rollCustom = rollCustom;
window.rollDice = rollDice;