/* ========== PLAYER TRACKER ========== */
var players = [];
var selectedTargetForState = null;

function getRoleBadge(role) {
  const map = { 'Gracz': 'gracz', 'Companion': 'companion', 'Wróg': 'wrog', 'NPC': 'npc' };
  return 'p-role-badge ' + (map[role] || 'npc');
}

function selectTargetForState(type, index) {
  selectedTargetForState = { type, index };
  let name = '';
  if (type === 'player' && players[index]) {
    name = players[index].name;
  } else if (type === 'init' && typeof combatants !== 'undefined' && combatants[index]) {
    name = combatants[index].name;
  }
  const display = document.getElementById('selectedTargetDisplay');
  if (name) {
    display.textContent = '🎯 Wybrany cel: ' + name;
    display.style.display = 'block';
  } else {
    display.textContent = '';
    display.style.display = 'none';
  }
}

function renderPlayers() {
  const container = document.getElementById('playerTracker');
  container.innerHTML = '';
  if (players.length === 0) {
    container.innerHTML = '<div style="color:var(--muted);font-size:.7rem;text-align:center;padding:12px;">👥 Dodaj postać</div>';
    return;
  }
  players.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'player-card';
    div.dataset.role = p.role;
    div.onclick = () => selectTargetForState('player', i);
    const hpPct = p.maxHp > 0 ? Math.round((p.hp / p.maxHp) * 100) : 0;
    const hpColor = hpPct < 25 ? 'var(--red)' : hpPct < 50 ? 'var(--gold)' : 'var(--green)';
    const condTags = p.conditions.map(c => `<span class="tag">${getStateEmoji(c)} ${c}</span>`).join('');
    const ds = p.deathSaves || { passes: 0, fails: 0 };
    div.innerHTML = `
      <div class="p-header">
        <div class="p-name">
          ${p.name}
          <span class="${getRoleBadge(p.role)}">${p.role}</span>
          ${p.hp <= 0 ? '💀' : ''}
        </div>
        ${p.ac > 0 ? `<span style="font-size:.6rem;color:var(--blue);padding:2px 8px;border:1px solid rgba(107,184,255,0.2);border-radius:6px;">🛡${p.ac}</span>` : ''}
      </div>
      <div class="p-hp-wrap">
        <div class="p-hp-bar">
          <div class="p-hp-fill" style="width:${hpPct}%;background:${hpColor};"></div>
        </div>
        <div class="p-hp-text" style="color:${hpColor}">${p.hp}/${p.maxHp}</div>
      </div>
      ${p.hp <= 0 ? `<div style="font-size:.5rem;color:var(--muted);margin:2px 0;">🪦 Death Saves: ✅${ds.passes} ❌${ds.fails}</div>` : ''}
      <div class="p-stats">
        <span>❤️${p.hp}</span>
        ${p.ac > 0 ? `<span>🛡${p.ac}</span>` : ''}
        ${p.conditions.length > 0 ? `<span>⚡${p.conditions.length}</span>` : ''}
      </div>
      <div class="p-cond">${condTags}</div>
      <div class="p-controls">
        <button onclick="event.stopPropagation(); showPlayerDmg(${i})">⚔️</button>
        <button onclick="event.stopPropagation(); addPlayerToInitiative(${i})">⚡</button>
        ${p.hp <= 0 ? `<button class="success" onclick="event.stopPropagation(); deathSave(${i})">💀</button>` : ''}
        <button class="danger" onclick="event.stopPropagation(); removePlayer(${i})">✕</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function removePlayer(index) {
  if (confirm(`Usunąć ${players[index].name}?`)) {
    players.splice(index, 1);
    renderPlayers();
  }
}

function showPlayerDmg(index) {
  if (typeof dmgPopupTarget !== 'undefined') {
    dmgPopupTarget = { type: 'player', index: index };
  }
  if (typeof showDamagePopup === 'function') {
    showDamagePopup(players[index].name);
  }
}

function addPlayerToInitiative(index) {
  const p = players[index];
  if (!p) return;
  const initVal = prompt('Inicjatywa dla ' + p.name + ':') || '0';
  if (typeof combatants !== 'undefined') {
    combatants.push({
      name: p.name,
      init: parseInt(initVal) || 0,
      hp: p.hp,
      maxHp: p.maxHp,
      ac: p.ac,
      conditions: [...p.conditions],
      roundDamage: 0
    });
    if (typeof sortInit === 'function') sortInit();
    if (typeof playSound === 'function') playSound('add');
  }
}

function deathSave(index) {
  const p = players[index];
  if (!p) return;
  const roll = typeof rollDice === 'function' ? rollDice(20) : Math.floor(Math.random() * 20) + 1;
  if (roll === 1) {
    p.deathSaves.fails += 2;
    if (typeof playSound === 'function') playSound('death');
  } else if (roll === 20) {
    p.hp = 1;
    p.deathSaves.passes = 0;
    p.deathSaves.fails = 0;
    if (typeof playSound === 'function') playSound('crit');
    renderPlayers();
    return;
  } else if (roll >= 10) {
    p.deathSaves.passes++;
  } else {
    p.deathSaves.fails++;
  }
  if (p.deathSaves.fails >= 3) {
    if (typeof playSound === 'function') playSound('death');
    if (confirm(`💀 ${p.name} umiera na dobre! Usunąć?`)) {
      players.splice(index, 1);
      renderPlayers();
      return;
    }
  }
  if (p.deathSaves.passes >= 3) {
    p.hp = 1;
    p.deathSaves.passes = 0;
    p.deathSaves.fails = 0;
    if (typeof playSound === 'function') playSound('add');
  }
  renderPlayers();
}