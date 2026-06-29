// ============================================================
//  COMBAT
// ============================================================

var combatants = [];
var currentTurn = 0;
var round = 1;
var focusFire = [];
var turnLog = [];
var lastInitCount = -1;

// ====== DODAWANIE ======
function addCombatant(data) {
  combatants.push({
    name: data.name,
    init: data.init || 0,
    hp: data.hp || 0,
    maxHp: data.maxHp || data.hp || 0,
    ac: data.ac || '—',
    role: data.role || 'Wróg',
    conditions: data.conditions || [],
    roundDamage: 0,
    avatar: data.avatar || '⚔️'
  });
  sortInit();
}

function openAddCombatantModal() {
  selectedCombatantAvatar = '⚔️';
  selectedCombatantAvatarUrl = '';
  var nameInput = document.getElementById('cName');
  var initInput = document.getElementById('cInit');
  var hpInput = document.getElementById('cHp');
  var acInput = document.getElementById('cAc');
  var roleSelect = document.getElementById('cRole');
  var urlInput = document.getElementById('combatantAvatarUrl');
  if (nameInput) nameInput.value = '';
  if (initInput) initInput.value = '';
  if (hpInput) hpInput.value = '';
  if (acInput) acInput.value = '';
  if (roleSelect) roleSelect.value = 'Wróg';
  if (urlInput) urlInput.value = '';
  updateCombatantAvatarPreview();

  document.querySelectorAll('#combatantAvatarGrid .avatar-btn').forEach(function(b) {
    if (b.dataset.avatar === '⚔️') b.classList.add('active');
    else b.classList.remove('active');
  });

  var popup = document.getElementById('addCombatantPopup');
  if (popup) {
    popup.style.display = 'flex';
    setTimeout(function() { if (nameInput) nameInput.focus(); }, 100);
  }
}

function closeAddCombatantModal() {
  var popup = document.getElementById('addCombatantPopup');
  if (popup) popup.style.display = 'none';
}

var selectedCombatantAvatar = '⚔️';
var selectedCombatantAvatarUrl = '';

function updateCombatantAvatarPreview() {
  var preview = document.getElementById('combatantAvatarPreview');
  if (!preview) return;
  if (selectedCombatantAvatarUrl) {
    preview.innerHTML = '<img src="' + selectedCombatantAvatarUrl + '" onerror="this.parentNode.textContent=\'⚔️\'">';
  } else {
    preview.textContent = selectedCombatantAvatar;
  }
}

function confirmAddCombatant() {
  var nameInput = document.getElementById('cName');
  var initInput = document.getElementById('cInit');
  var hpInput = document.getElementById('cHp');
  var acInput = document.getElementById('cAc');
  var roleSelect = document.getElementById('cRole');

  var name = nameInput ? nameInput.value.trim() : '';
  var init = parseInt(initInput ? initInput.value : 0) || 0;
  var hp = parseInt(hpInput ? hpInput.value : 0) || 0;
  var ac = parseInt(acInput ? acInput.value : 0) || 0;
  var role = roleSelect ? roleSelect.value : 'Wróg';

  if (!name) { alert('Podaj nazwę bojownika'); return; }

  addCombatant({
    name: name,
    init: init,
    hp: hp,
    maxHp: hp || null,
    ac: ac || '—',
    role: role,
    avatar: selectedCombatantAvatarUrl || selectedCombatantAvatar
  });

  closeAddCombatantModal();
  playSound('add');
}

function initCombatantAvatarPicker() {
  document.querySelectorAll('#combatantAvatarGrid .avatar-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('#combatantAvatarGrid .avatar-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      selectedCombatantAvatar = btn.dataset.avatar;
      selectedCombatantAvatarUrl = '';
      var urlInput = document.getElementById('combatantAvatarUrl');
      if (urlInput) urlInput.value = '';
      updateCombatantAvatarPreview();
    });
  });

  var urlInput = document.getElementById('combatantAvatarUrl');
  if (urlInput) {
    urlInput.addEventListener('input', function() {
      var url = this.value.trim();
      if (url) {
        selectedCombatantAvatarUrl = url;
        selectedCombatantAvatar = '';
        document.querySelectorAll('#combatantAvatarGrid .avatar-btn').forEach(function(b) { b.classList.remove('active'); });
      } else {
        selectedCombatantAvatarUrl = '';
        selectedCombatantAvatar = '⚔️';
      }
      updateCombatantAvatarPreview();
    });
  }
}

// ====== SORT ======
function sortInit() {
  combatants.sort(function(a, b) { return b.init - a.init; });
  currentTurn = 0;
  round = 1;
  renderInit();
}

// ====== ADD FROM PARTY ======
function addFromParty() {
  if (players.length === 0) {
    alert('Dodaj najpierw postacie do "Postaci"!');
    return;
  }
  var names = players.map(function(p, i) { return (i + 1) + '. ' + p.name + ' (' + p.role + ')'; }).join('\n');
  var choice = prompt('Którą postać dodać?\n' + names + '\n\nWpisz numer lub nazwę:');
  if (!choice) return;

  var player = null;
  var num = parseInt(choice);
  if (!isNaN(num) && num > 0 && num <= players.length) player = players[num - 1];
  else player = players.find(function(p) { return p.name.toLowerCase() === choice.toLowerCase(); });

  if (!player) { alert('Nie znaleziono'); return; }

  var initVal = prompt('Inicjatywa dla ' + player.name + ':') || '0';
  addCombatant({
    name: player.name,
    init: parseInt(initVal) || 0,
    hp: player.hp,
    maxHp: player.maxHp,
    ac: player.ac,
    role: player.role,
    conditions: player.conditions.slice(),
    roundDamage: 0,
    avatar: player.avatar
  });
  playSound('add');
}

// ====== TURN ======
function nextTurn() {
  if (combatants.length === 0) return;
  combatants.forEach(function(c) { c.roundDamage = 0; });
  currentTurn = (currentTurn + 1) % combatants.length;
  if (currentTurn === 0) {
    round++;
    advanceTimers();
    focusFire = [];
    turnLog = [];
  }
  playSound('turn');
  renderInit();
  updateFocusFire();
}

function resetInit() {
  combatants = [];
  currentTurn = 0;
  round = 1;
  focusFire = [];
  turnLog = [];
  renderInit();
  updateFocusFire();
}

function removeCombatant(index) {
  if (confirm('Usunąć ' + (combatants[index] ? combatants[index].name : '') + '?')) {
    combatants.splice(index, 1);
    if (currentTurn >= combatants.length) currentTurn = 0;
    lastInitCount = -1;
    renderInit();
  }
}

// ====== RENDER ======
function renderInit() {
  var list = document.getElementById('initList');
  if (!list) return;

  if (lastInitCount === combatants.length && list.children.length === combatants.length && combatants.length > 0) {
    var entries = list.querySelectorAll('.init-entry');
    combatants.forEach(function(c, i) {
      if (entries[i]) {
        entries[i].className = 'init-entry' + (i === currentTurn ? ' current' : '');
        updateInitEntry(entries[i], c, i);
      }
    });
    updateRoundBadge();
    scrollToCurrentTurn();
    return;
  }

  lastInitCount = combatants.length;
  list.innerHTML = '';

  if (combatants.length === 0) {
    var badge = document.getElementById('roundBadge');
    if (badge) badge.textContent = '';
    var turnBtns = document.getElementById('turnBtns');
    if (turnBtns) turnBtns.style.display = 'none';
    updateFocusFire();
    return;
  }

  updateRoundBadge();
  var turnBtns = document.getElementById('turnBtns');
  if (turnBtns) turnBtns.style.display = 'flex';

  combatants.forEach(function(c, i) {
    var div = document.createElement('div');
    div.className = 'init-entry' + (i === currentTurn ? ' current' : '');
    if (i === combatants.length - 1) div.classList.add('slide-in');
    renderInitEntry(div, c, i);
    list.appendChild(div);
  });

  updateFocusFire();
  scrollToCurrentTurn();
}

function renderInitEntry(div, c, i) {
  var hpText = typeof c.hp === 'number' ? c.hp + '/' + c.maxHp + ' HP' : '? HP';
  var hpClass = typeof c.hp === 'number' && c.maxHp && c.hp / c.maxHp < 0.33 ? ' low' : '';
  var condTags = '';
  if (c.conditions && c.conditions.length > 0) {
    condTags = c.conditions.map(function(cond) { return '<span class="cond-tag">' + getStateEmoji(cond) + ' ' + cond + '</span>'; }).join('');
  }
  var dmgCounter = c.roundDamage > 0 ? '<span class="init-dmg-counter">⚔️' + c.roundDamage + '</span>' : '';

  div.innerHTML = `
    <div class="init-badge">${c.init}</div>
    <div class="init-name">
      ${i === currentTurn ? '▶ ' : ''} ${c.name}
      ${condTags}${dmgCounter}
      <button class="init-cond-btn ${c.conditions && c.conditions.length > 0 ? 'has-cond' : ''}" onclick="event.stopPropagation();showInitCondPopup(${i})" title="Zarządzaj stanami">${c.conditions && c.conditions.length > 0 ? '🔄' : '⚙️'}</button>
      <button class="init-cond-btn" onclick="event.stopPropagation();showInitDmg(${i})" title="Zadaj obrażenia">⚔️</button>
    </div>
    ${c.ac && c.ac !== '—' ? '<div class="init-ac" title="Klasa Pancerza">🛡 ' + c.ac + '</div>' : ''}
    ${typeof c.hp === 'number' ? '<div class="init-hp ' + hpClass + '" onclick="event.stopPropagation();showInitDmg(' + i + ')">' + hpText + '</div>' : ''}
    <div class="init-remove" onclick="event.stopPropagation();removeCombatant(${i})">✕</div>
  `;
}

function updateInitEntry(div, c, i) {
  var nameDiv = div.querySelector('.init-name');
  if (nameDiv) {
    var textNode = nameDiv.childNodes[0];
    if (textNode) textNode.textContent = (i === currentTurn ? '▶ ' : '') + ' ' + c.name + ' ';

    nameDiv.querySelectorAll('.cond-tag').forEach(function(el) { el.remove(); });
    var dmgCounter = nameDiv.querySelector('.init-dmg-counter');
    if (dmgCounter) {
      if (c.roundDamage > 0) {
        dmgCounter.textContent = '⚔️' + c.roundDamage;
        dmgCounter.style.display = '';
      } else {
        dmgCounter.style.display = 'none';
      }
    }

    var condBtn = nameDiv.querySelector('.init-cond-btn:first-of-type');
    if (condBtn) {
      condBtn.className = 'init-cond-btn ' + (c.conditions && c.conditions.length > 0 ? 'has-cond' : '');
      condBtn.innerHTML = c.conditions && c.conditions.length > 0 ? '🔄' : '⚙️';
    }

    var frag = document.createDocumentFragment();
    if (c.conditions && c.conditions.length > 0) {
      c.conditions.forEach(function(cond) {
        var tag = document.createElement('span');
        tag.className = 'cond-tag';
        tag.textContent = getStateEmoji(cond) + ' ' + cond;
        frag.appendChild(tag);
      });
    }
    nameDiv.appendChild(frag);
  }

  var hpDiv = div.querySelector('.init-hp');
  if (hpDiv && typeof c.hp === 'number') {
    hpDiv.textContent = c.hp + '/' + c.maxHp + ' HP';
    hpDiv.className = 'init-hp ' + (c.hp / c.maxHp < 0.33 ? 'low' : '');
  }
}

function updateRoundBadge() {
  var badge = document.getElementById('roundBadge');
  if (badge) {
    badge.textContent = combatants.length > 0 ? '— Runda ' + round + ' —' : '';
  }
}

function scrollToCurrentTurn() {
  var isMobile = window.innerWidth <= 768 || ('ontouchstart' in window);
  if (isMobile) {
    var current = document.querySelector('.init-entry.current');
    if (current) {
      setTimeout(function() {
        current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      }, 150);
    }
  }
}

// ====== FOCUS FIRE ======
function updateFocusFire() {
  var container = document.getElementById('focusFireList');
  if (!container) return;
  var logHtml = getTurnLogDisplay();
  container.innerHTML = logHtml || '<div style="color:var(--muted);font-size:.6rem;text-align:center;padding:3px;">Brak akcji w tej rundzie</div>';
}

function resetFocusFire() {
  focusFire = [];
  turnLog = [];
  updateFocusFire();
}

function addTurnLog(name, action) {
  turnLog.push({ name: name, action: action, turn: round });
  if (turnLog.length > 20) turnLog.shift();
  updateFocusFire();
}

function getTurnLogDisplay() {
  return turnLog.slice(-5).map(function(e) {
    return '<div class="ff-target"><span class="ff-name">' + e.name + '</span><span class="ff-status">' + e.action + '</span></div>';
  }).join('');
}

// ====== DEATH ======
function triggerDeath(index) {
  var entries = document.querySelectorAll('.init-entry');
  if (entries[index]) {
    entries[index].classList.add('death');
    var flash = document.createElement('div');
    flash.style.cssText = 'position:fixed;inset:0;background:rgba(255,107,107,.2);z-index:999;pointer-events:none;animation:fadeOut .7s ease forwards;';
    document.body.appendChild(flash);
    setTimeout(function() { flash.remove(); }, 700);
    setTimeout(function() {
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

// ====== INIT COND / DMG ======
function showInitCondPopup(index) {
  var c = combatants[index];
  if (!c) return;
  showCondPopup(c.name, c.conditions || [], function(cond) {
    var idx = c.conditions.indexOf(cond);
    if (idx > -1) c.conditions.splice(idx, 1);
    else { c.conditions.push(cond); addTurnLog(c.name, '👤 ' + getStateEmoji(cond) + ' ' + cond); }
    renderInit();
    var popup = document.getElementById('condPopup');
    if (popup) updateCondPopup(popup, c.conditions);
  });
}

function showInitDmg(index) {
  dmgPopupTarget = { type: 'init', index: index };
  showDamagePopup(combatants[index] ? combatants[index].name : 'Bojownik');
}

// ====== APPLY DAMAGE ======
function applyDamage() {
  var amountInput = document.getElementById('dmgAmount');
  var critInput = document.getElementById('dmgCrit');
  var amount = parseInt(amountInput ? amountInput.value : 0) || 0;
  var crit = critInput ? critInput.checked : false;
  var finalDmg = crit ? amount * 2 : amount;

  if (dmgPopupTarget) {
    var type = dmgPopupTarget.type;
    var index = dmgPopupTarget.index;
    if (type === 'player' && players[index]) {
      players[index].hp = Math.max(0, players[index].hp - finalDmg);
      var name = players[index].name;
      var existing = focusFire.find(function(f) { return f.name === name; });
      if (existing) existing.dmg += finalDmg;
      else focusFire.push({ name: name, dmg: finalDmg, status: '⚔️ ' + finalDmg + ' dmg' });
      addTurnLog(name, '⚔️ ' + finalDmg + ' obrażeń');

      if (players[index].hp <= 0) {
        playSound('death');
        addTurnLog(name, '💀 ŚMIERĆ!');
        setTimeout(function() { renderPlayers(); updateFocusFire(); }, 200);
      } else {
        playSound(finalDmg > 10 ? 'crit' : 'hit');
        renderPlayers();
        triggerHpHitAnimation(index);
        updateFocusFire();
      }
    } else if (type === 'init' && combatants[index]) {
      combatants[index].hp = Math.max(0, combatants[index].hp - finalDmg);
      combatants[index].roundDamage = (combatants[index].roundDamage || 0) + finalDmg;
      var name = combatants[index].name;
      var existing = focusFire.find(function(f) { return f.name === name; });
      if (existing) existing.dmg += finalDmg;
      else focusFire.push({ name: name, dmg: finalDmg, status: '⚔️ ' + finalDmg + ' dmg' });
      addTurnLog(name, '⚔️ ' + finalDmg + ' obrażeń');

      if (combatants[index].hp <= 0) {
        playSound('death');
        addTurnLog(name, '💀 ŚMIERĆ!');
        setTimeout(function() {
          if (confirm('💀 ' + combatants[index].name + ' zabity! Usunąć?')) {
            triggerDeath(index);
          } else {
            renderInit();
            updateFocusFire();
          }
        }, 200);
      } else {
        playSound(finalDmg > 10 ? 'crit' : 'hit');
        renderInit();
        updateFocusFire();
      }
    }
  }
  closeDmgPopup();
}

// ====== STYL (death flash) ======
var style = document.createElement('style');
style.textContent = '@keyframes fadeOut{0%{opacity:1;}100%{opacity:0;}}';
document.head.appendChild(style);

// ====== Eksport globalny ======
window.openAddCombatantModal = openAddCombatantModal;
window.closeAddCombatantModal = closeAddCombatantModal;
window.confirmAddCombatant = confirmAddCombatant;
window.addFromParty = addFromParty;
window.nextTurn = nextTurn;
window.resetInit = resetInit;
window.removeCombatant = removeCombatant;
window.showInitCondPopup = showInitCondPopup;
window.showInitDmg = showInitDmg;
window.applyDamage = applyDamage;