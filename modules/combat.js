/* ========== POTYCZKA ========== */
var combatants = [], currentTurn = 0, round = 1;
var lastInitCount = 0;
var turnLog = [];

function addCombatant() {
  const name = document.getElementById('initName').value.trim();
  const init = Number(document.getElementById('initVal').value);
  const hp = Number(document.getElementById('initHp').value) || '—';
  const ac = Number(document.getElementById('initAc').value) || '—';
  if (!name) return;
  combatants.push({ name, init, hp, ac, maxHp: typeof hp === 'number' ? hp : null, conditions: [], roundDamage: 0 });
  sortInit();
  document.getElementById('initName').value = '';
  document.getElementById('initVal').value = '';
  document.getElementById('initHp').value = '';
  document.getElementById('initAc').value = '';
  if (typeof playSound === 'function') playSound('add');
}

function addFromParty() {
  if (typeof players === 'undefined' || players.length === 0) {
    alert('Dodaj najpierw postacie do "Postaci"!');
    return;
  }
  const names = players.map((p, i) => (i + 1) + '. ' + p.name + ' (' + p.role + ')').join('\n');
  const choice = prompt('Którą postać dodać do potyczki?\n' + names + '\n\nWpisz numer lub nazwę:');
  if (!choice) return;
  let player = null;
  const num = parseInt(choice);
  if (!isNaN(num) && num > 0 && num <= players.length) {
    player = players[num - 1];
  } else {
    player = players.find(p => p.name.toLowerCase() === choice.toLowerCase());
  }
  if (!player) {
    alert('Nie znaleziono postaci');
    return;
  }
  const initVal = prompt('Inicjatywa dla ' + player.name + ':') || '0';
  combatants.push({
    name: player.name,
    init: parseInt(initVal) || 0,
    hp: player.hp,
    maxHp: player.maxHp,
    ac: player.ac,
    conditions: [...player.conditions],
    roundDamage: 0
  });
  sortInit();
  if (typeof playSound === 'function') playSound('add');
}

function sortInit() {
  combatants.sort((a, b) => b.init - a.init);
  currentTurn = 0;
  round = 1;
  renderInit();
}

function nextTurn() {
  if (combatants.length === 0) return;
  combatants.forEach(c => c.roundDamage = 0);
  currentTurn = (currentTurn + 1) % combatants.length;
  if (currentTurn === 0) {
    round++;
    if (typeof advanceTimers === 'function') advanceTimers();
    if (typeof focusFire !== 'undefined') focusFire = [];
    turnLog = [];
  }
  if (typeof playSound === 'function') playSound('turn');
  renderInit();
  if (typeof updateFocusFire === 'function') updateFocusFire();
}

function resetInit() {
  combatants = [];
  currentTurn = 0;
  round = 1;
  if (typeof focusFire !== 'undefined') focusFire = [];
  turnLog = [];
  renderInit();
  if (typeof updateFocusFire === 'function') updateFocusFire();
}

function showInitCondPopup(index) {
  if (typeof conditionPopupTarget !== 'undefined') {
    conditionPopupTarget = { type: 'init', index: index };
  }
  if (typeof showCondPopup === 'function') {
    showCondPopup(combatants[index].name, combatants[index].conditions, (cond) => {
      const idx = combatants[index].conditions.indexOf(cond);
      if (idx > -1) {
        combatants[index].conditions.splice(idx, 1);
      } else {
        combatants[index].conditions.push(cond);
        if (typeof addTurnLog === 'function') {
          addTurnLog(combatants[index].name, '👤 ' + getStateEmoji(cond) + ' ' + cond);
        }
      }
      renderInit();
      const popup = document.getElementById('condPopup');
      if (popup && typeof updateCondPopup === 'function') updateCondPopup(popup, combatants[index].conditions);
    });
  }
}

function showInitDmg(index) {
  if (typeof dmgPopupTarget !== 'undefined') {
    dmgPopupTarget = { type: 'init', index: index };
  }
  if (typeof showDamagePopup === 'function') {
    showDamagePopup(combatants[index].name);
  }
}

function scrollToCurrentTurn() {
  if (isMobile()) {
    const current = document.querySelector('.init-entry.current');
    if (current) {
      setTimeout(() => {
        current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      }, 150);
    }
  }
}

function renderInit() {
  const list = document.getElementById('initList');
  if (lastInitCount === combatants.length && list.children.length === combatants.length && combatants.length > 0) {
    const entries = list.querySelectorAll('.init-entry');
    combatants.forEach((c, i) => {
      if (entries[i]) {
        entries[i].className = 'init-entry' + (i === currentTurn ? ' current' : '');
        const nameDiv = entries[i].querySelector('.init-name');
        if (nameDiv) {
          const textNode = nameDiv.childNodes[0];
          if (textNode) textNode.textContent = (i === currentTurn ? '▶ ' : '') + ' ' + c.name + ' ';
          nameDiv.querySelectorAll('.cond-tag').forEach(el => el.remove());
          const frag = document.createDocumentFragment();
          if (c.conditions && c.conditions.length > 0) {
            c.conditions.forEach(cond => {
              const tag = document.createElement('span');
              tag.className = 'cond-tag';
              tag.textContent = getStateEmoji(cond) + ' ' + cond;
              frag.appendChild(tag);
            });
          }
          const existingBtns = nameDiv.querySelectorAll('.init-cond-btn');
          if (existingBtns.length === 0) {
            const newBtn = document.createElement('button');
            newBtn.className = `init-cond-btn ${c.conditions && c.conditions.length > 0 ? 'has-cond' : ''}`;
            newBtn.innerHTML = c.conditions && c.conditions.length > 0 ? '🔄' : '⚙️';
            newBtn.onclick = (e) => { e.stopPropagation(); showInitCondPopup(i); };
            newBtn.title = 'Zarządzaj stanami';
            frag.appendChild(newBtn);
            const dmgBtn = document.createElement('button');
            dmgBtn.className = 'init-cond-btn';
            dmgBtn.innerHTML = '⚔️';
            dmgBtn.onclick = (e) => { e.stopPropagation(); showInitDmg(i); };
            dmgBtn.title = 'Zadaj obrażenia';
            dmgBtn.style.marginLeft = '2px';
            frag.appendChild(dmgBtn);
          }
          nameDiv.appendChild(frag);
        }
        const hpDiv = entries[i].querySelector('.init-hp');
        if (hpDiv && typeof c.hp === 'number') {
          hpDiv.textContent = `${c.hp}/${c.maxHp} HP`;
          hpDiv.className = `init-hp ${c.hp / c.maxHp < .33 ? 'low' : ''}`;
        }
        const dmgCounter = entries[i].querySelector('.init-dmg-counter');
        if (dmgCounter) {
          if (c.roundDamage > 0) {
            dmgCounter.textContent = `⚔️${c.roundDamage}`;
            dmgCounter.style.display = '';
          } else {
            dmgCounter.style.display = 'none';
          }
        }
      }
    });
    document.getElementById('roundBadge').textContent = combatants.length > 0 ? `— Runda ${round} —` : '';
    scrollToCurrentTurn();
    return;
  }
  lastInitCount = combatants.length;
  list.innerHTML = '';
  if (combatants.length === 0) {
    document.getElementById('roundBadge').textContent = '';
    document.getElementById('turnBtns').style.display = 'none';
    if (typeof updateFocusFire === 'function') updateFocusFire();
    return;
  }
  document.getElementById('roundBadge').textContent = `— Runda ${round} —`;
  document.getElementById('turnBtns').style.display = 'flex';
  combatants.forEach((c, i) => {
    const div = document.createElement('div');
    div.className = 'init-entry' + (i === currentTurn ? ' current' : '');
    div.onclick = () => selectTargetForState('init', i);
    if (i === combatants.length - 1) div.classList.add('slide-in');
    const hpText = typeof c.hp === 'number' ? `${c.hp}/${c.maxHp} HP` : '? HP';
    const hpClass = typeof c.hp === 'number' && c.maxHp && c.hp / c.maxHp < .33 ? ' low' : '';
    let condTags = '';
    if (c.conditions && c.conditions.length > 0) {
      condTags = c.conditions.map(cond => `<span class="cond-tag">${getStateEmoji(cond)} ${cond}</span>`).join('');
    }
    const dmgCounter = c.roundDamage > 0 ? `<span class="init-dmg-counter">⚔️${c.roundDamage}</span>` : '';
    div.innerHTML = `
      <div class="init-badge">${c.init}</div>
      <div class="init-name">
        ${i === currentTurn ? '▶ ' : ''} ${c.name}
        ${condTags}
        ${dmgCounter}
        <button class="init-cond-btn ${c.conditions && c.conditions.length > 0 ? 'has-cond' : ''}" onclick="event.stopPropagation(); showInitCondPopup(${i})" title="Zarządzaj stanami">
          ${c.conditions && c.conditions.length > 0 ? '🔄' : '⚙️'}
        </button>
        <button class="init-cond-btn" onclick="event.stopPropagation(); showInitDmg(${i})" title="Zadaj obrażenia">⚔️</button>
      </div>
      ${c.ac !== '—' ? `<div class="init-ac" title="Klasa Pancerza">🛡 ${c.ac}</div>` : ''}
      ${typeof c.hp === 'number' ? `<div class="init-hp ${hpClass}" onclick="event.stopPropagation(); showInitDmg(${i})">${hpText}</div>` : ''}
      <div class="init-remove" onclick="event.stopPropagation(); removeCombatant(${i})">✕</div>
    `;
    list.appendChild(div);
  });
  if (typeof updateFocusFire === 'function') updateFocusFire();
  scrollToCurrentTurn();
}

function removeCombatant(i) {
  if (confirm(`Usunąć ${combatants[i].name} z potyczki?`)) {
    combatants.splice(i, 1);
    if (currentTurn >= combatants.length) currentTurn = 0;
    lastInitCount = -1;
    renderInit();
  }
}

function triggerDeath(index) {
  const entries = document.querySelectorAll('.init-entry');
  if (entries[index]) {
    entries[index].classList.add('death');
    const flash = document.createElement('div');
    flash.style.cssText = 'position:fixed;inset:0;background:rgba(255,107,107,.2);z-index:999;pointer-events:none;animation:fadeOut .7s ease forwards;';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 700);
    setTimeout(() => {
      combatants.splice(index, 1);
      if (currentTurn >= combatants.length) currentTurn = 0;
      lastInitCount = -1;
      renderInit();
    }, 700);
  } else {
    combatants.splice(index, 1);
    if (currentTurn >= combatants.length) currentTurn = 0;
    lastInitCount = -1;
    renderInit();
  }
}