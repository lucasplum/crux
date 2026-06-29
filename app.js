/* ========== AUDIO ========== */
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    try { audioCtx = new AudioContext(); } catch (e) { }
  }
}

function playSound(type) {
  try {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    const now = audioCtx.currentTime;
    switch (type) {
      case 'hit':
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now); osc.stop(now + 0.1);
        break;
      case 'crit':
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.12);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now); osc.stop(now + 0.15);
        break;
      case 'death':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.5);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now); osc.stop(now + 0.5);
        break;
      case 'turn':
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.setValueAtTime(700, now + 0.04);
        osc.frequency.setValueAtTime(900, now + 0.08);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.start(now); osc.stop(now + 0.12);
        break;
      case 'add':
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.06);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now); osc.stop(now + 0.08);
        break;
      case 'dice':
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.setValueAtTime(400, now + 0.03);
        osc.frequency.setValueAtTime(500, now + 0.06);
        osc.frequency.setValueAtTime(600, now + 0.09);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now); osc.stop(now + 0.1);
        break;
      case 'state':
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.setValueAtTime(700, now + 0.05);
        osc.frequency.setValueAtTime(600, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.start(now); osc.stop(now + 0.12);
        break;
    }
  } catch (e) { }
}

/* ========== NAWIGACJA ========== */
function initNavigation() {
  const navButtons = document.querySelectorAll('.nav-btn, .bottom-nav-btn');
  const tabSections = document.querySelectorAll('.tab-section');
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;
      document.querySelectorAll('.nav-btn, .bottom-nav-btn').forEach(b => {
        if (b.dataset.tab === targetTab) b.classList.add('active');
        else b.classList.remove('active');
      });
      tabSections.forEach(section => {
        if (section.dataset.tab === targetTab) section.classList.add('active');
        else section.classList.remove('active');
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (targetTab === 'spells') {
        setTimeout(() => {
          if (typeof renderSizeCanvas === 'function') renderSizeCanvas();
          if (typeof renderSpellCanvas === 'function') renderSpellCanvas();
        }, 100);
      }
    });
  });
}

function initInfoTabs() {
  const infoTabButtons = document.querySelectorAll('.info-tab-btn');
  const infoContents = document.querySelectorAll('.info-content');
  infoTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetInfo = btn.dataset.info;
      infoTabButtons.forEach(b => {
        if (b.dataset.info === targetInfo) b.classList.add('active');
        else b.classList.remove('active');
      });
      infoContents.forEach(content => {
        if (content.dataset.info === targetInfo) content.classList.add('active');
        else content.classList.remove('active');
      });
    });
  });
}

/* ========== CONVERTER ========== */
const feet = document.getElementById('feet'), meters = document.getElementById('meters'), hexes = document.getElementById('hexes');
let lock = false;
[feet, meters, hexes].forEach(i => i.addEventListener('focus', () => { i.select(); }));
feet.oninput = () => {
  if (lock) return; lock = true;
  const ft = Number(feet.value || 0);
  meters.value = (ft * 0.3).toFixed(1);
  hexes.value = Math.round(ft / 5);
  lock = false;
};
meters.oninput = () => {
  if (lock) return; lock = true;
  const m = Number(meters.value || 0);
  feet.value = Math.round(m / 0.3);
  hexes.value = Math.round(m / 1.5);
  lock = false;
};
hexes.oninput = () => {
  if (lock) return; lock = true;
  const h = Number(hexes.value || 0);
  feet.value = h * 5;
  meters.value = (h * 1.5).toFixed(1);
  lock = false;
};

/* ========== DISTANCE TABLE ========== */
const base = [5, 10, 15, 20, 25, 30, 40, 60, 90, 120, 150, 300];
let currentUnit = 'ft';

function renderDistances() {
  const grid = document.getElementById('distanceGrid');
  grid.innerHTML = '';
  base.forEach(ft => {
    let text = ft + ' ft';
    if (currentUnit === 'm') text = (ft * 0.3).toFixed(1) + ' m';
    if (currentUnit === 'hex') text = Math.round(ft / 5) + ' ⬡';
    const b = document.createElement('button');
    b.className = 'dist-btn';
    b.textContent = text;
    b.onclick = () => {
      document.querySelectorAll('.dist-btn').forEach(x => x.classList.remove('selected'));
      b.classList.add('selected');
      document.getElementById('distanceResult').innerHTML = `
        <div class="unit"><div class="val">${ft}</div><div class="lbl">stóp</div></div>
        <div class="sep"></div>
        <div class="unit"><div class="val">${(ft * 0.3).toFixed(1)}</div><div class="lbl">metrów</div></div>
        <div class="sep"></div>
        <div class="unit"><div class="val">${Math.round(ft / 5)}</div><div class="lbl">hexów</div></div>
      `;
    };
    grid.appendChild(b);
  });
}

document.querySelectorAll('.tabs button').forEach(b => {
  b.onclick = () => {
    document.querySelector('.tabs .active').classList.remove('active');
    b.classList.add('active');
    currentUnit = b.dataset.unit;
    renderDistances();
  };
});
renderDistances();

/* ========== TURN LOG ========== */
function addTurnLog(name, action) {
  turnLog.push({ name, action, turn: round });
  if (turnLog.length > 20) turnLog.shift();
  updateFocusFire();
}

function getTurnLogDisplay() {
  return turnLog.slice(-5).map(entry =>
    `<div class="ff-target">
      <span class="ff-name">${entry.name}</span>
      <span class="ff-status">${entry.action}</span>
    </div>`
  ).join('');
}

function updateFocusFire() {
  const container = document.getElementById('focusFireList');
  container.innerHTML = '';
  const logHtml = getTurnLogDisplay();
  if (logHtml) {
    container.innerHTML = logHtml;
  } else {
    container.innerHTML = '<div style="color:var(--muted);font-size:.6rem;text-align:center;padding:3px;">Brak akcji w tej rundzie</div>';
  }
}

function resetFocusFire() {
  focusFire = [];
  turnLog = [];
  updateFocusFire();
}

/* ========== SCROLL REVEAL ========== */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: .08 });
document.querySelectorAll('.card').forEach(c => observer.observe(c));

/* ========== POPUP CLOSE HANDLERS ========== */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    if (typeof closeCondPopup === 'function') closeCondPopup();
    if (typeof closeDmgPopup === 'function') closeDmgPopup();
    if (typeof closeDicePopup === 'function') closeDicePopup();
    if (typeof closeTimerPopup === 'function') closeTimerPopup();
  }
});

document.addEventListener('mousedown', function (e) {
  const condPopup = document.getElementById('condPopup');
  if (condPopup && !condPopup.contains(e.target) && e.target.closest('.popup-content') === null) {
    if (typeof closeCondPopup === 'function') closeCondPopup();
  }
  const dmgPopup = document.getElementById('dmgPopup');
  if (dmgPopup && !dmgPopup.contains(e.target) && e.target.closest('.popup-content') === null) {
    if (typeof closeDmgPopup === 'function') closeDmgPopup();
  }
  const dicePopup = document.getElementById('dicePopup');
  if (dicePopup && !dicePopup.contains(e.target) && e.target.closest('.popup-content') === null) {
    if (typeof closeDicePopup === 'function') closeDicePopup();
  }
  const timerPopup = document.getElementById('timerPopup');
  if (timerPopup && !timerPopup.contains(e.target) && e.target.closest('.popup-content') === null) {
    if (typeof closeTimerPopup === 'function') closeTimerPopup();
  }
});

if (isTouchDevice()) {
  let touchStartY = 0;
  document.addEventListener('touchstart', function (e) {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', function (e) {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    if (diff < -100) {
      const popups = ['condPopup', 'dmgPopup', 'dicePopup', 'timerPopup'];
      popups.forEach(id => {
        const popup = document.getElementById(id);
        if (popup) {
          const closeBtn = popup.querySelector('.popup-close');
          if (closeBtn) closeBtn.click();
        }
      });
    }
  }, { passive: true });
}

let resizeTimeout;
window.addEventListener('resize', function () {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function () {
    if (typeof renderSizeCanvas === 'function') renderSizeCanvas();
    if (typeof renderSpellCanvas === 'function') renderSpellCanvas();
  }, 250);
});

const style = document.createElement('style');
style.textContent = `@keyframes fadeOut { 0%{opacity:1;} 100%{opacity:0;} }`;
document.head.appendChild(style);

/* ========== INICJALIZACJA ========== */
initNavigation();
initInfoTabs();
if (typeof initCanvasPanZoom === 'function') initCanvasPanZoom();
if (typeof renderPlayers === 'function') renderPlayers();
if (typeof updateFocusFire === 'function') updateFocusFire();

setTimeout(() => {
  if (typeof renderSizeCanvas === 'function') renderSizeCanvas();
  if (typeof renderSpellCanvas === 'function') renderSpellCanvas();
}, 200);