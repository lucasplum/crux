// ============================================================
//  CONVERTER
// ============================================================

var feetInput = document.getElementById('feet');
var metersInput = document.getElementById('meters');
var hexesInput = document.getElementById('hexes');
var lock = false;

if (feetInput && metersInput && hexesInput) {
  [feetInput, metersInput, hexesInput].forEach(function(i) {
    i.addEventListener('focus', function() { i.select(); });
  });

  feetInput.oninput = function() {
    if (lock) return;
    lock = true;
    var ft = Number(feetInput.value || 0);
    metersInput.value = (ft * 0.3).toFixed(1);
    hexesInput.value = Math.round(ft / 5);
    lock = false;
  };

  metersInput.oninput = function() {
    if (lock) return;
    lock = true;
    var m = Number(metersInput.value || 0);
    feetInput.value = Math.round(m / 0.3);
    hexesInput.value = Math.round(m / 1.5);
    lock = false;
  };

  hexesInput.oninput = function() {
    if (lock) return;
    lock = true;
    var h = Number(hexesInput.value || 0);
    feetInput.value = h * 5;
    metersInput.value = (h * 1.5).toFixed(1);
    lock = false;
  };
}