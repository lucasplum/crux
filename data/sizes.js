/* ========== CREATURE SIZE DATA ========== */
function ring(q0, r0, rad) {
  const seen = new Set();
  const cells = [];
  for (let q = -rad; q <= rad; q++) {
    for (let r = -rad; r <= rad; r++) {
      if ((Math.abs(q) + Math.abs(r) + Math.abs(q + r)) / 2 <= rad) {
        const key = q + ',' + r;
        if (!seen.has(key)) {
          seen.add(key);
          cells.push([q, r]);
        }
      }
    }
  }
  return cells;
}

const SIZE_DATA = {
  sm:   { name: 'Mały (Small)', hexes: [[0, 0]], color: '#6bb8ff', hexCount: '1×1' },
  med:  { name: 'Średni (Medium)', hexes: [[0, 0]], color: '#6bb8ff', hexCount: '1×1' },
  lg:   { name: 'Duży (Large)', hexes: ring(0, 0, 1), color: '#6bff9e', hexCount: '~7 hexów' },
  huge: { name: 'Ogromny (Huge)', hexes: ring(0, 0, 2), color: '#d4a843', hexCount: '~19 hexów' },
  garg: { name: 'Gargantuiczny (Gargantuan)', hexes: ring(0, 0, 3), color: '#ff6b6b', hexCount: '~37 hexów' },
  col:  { name: 'Kolosalny (Colossal)', hexes: ring(0, 0, 4), color: '#a87cff', hexCount: '~61 hexów' },
};