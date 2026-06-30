// ============================================================
//  DISTANCE
// ============================================================

var currentUnit = 'ft';

function renderDistances() {
  var grid = document.getElementById('distanceGrid');
  if (!grid) return;
  grid.innerHTML = '';

  BASE_DISTANCES.forEach(function(ft) {
    var text = ft + ' ft';
    if (currentUnit === 'm') text = (ft * 0.3).toFixed(1) + ' m';
    if (currentUnit === 'hex') text = Math.round(ft / 5) + ' ⬡';

    var btn = document.createElement('button');
    btn.className = 'dist-btn';
    btn.textContent = text;
    btn.onclick = function() {
      document.querySelectorAll('.dist-btn').forEach(function(x) { x.classList.remove('selected'); });
      btn.classList.add('selected');
      var result = document.getElementById('distanceResult');
      if (result) {
        result.innerHTML = `
          <div class="unit"><div class="val">${ft}</div><div class="lbl">stóp</div></div>
          <div class="sep"></div>
          <div class="unit"><div class="val">${(ft * 0.3).toFixed(1)}</div><div class="lbl">metrów</div></div>
          <div class="sep"></div>
          <div class="unit"><div class="val">${Math.round(ft / 5)}</div><div class="lbl">hexów</div></div>
        `;
      }
    };
    grid.appendChild(btn);
  });
}

// Inicjalizacja
document.querySelectorAll('.tabs button').forEach(function(btn) {
  btn.onclick = function() {
    var active = document.querySelector('.tabs .active');
    if (active) active.classList.remove('active');
    btn.classList.add('active');
    currentUnit = btn.dataset.unit;
    renderDistances();
  };
});

renderDistances();