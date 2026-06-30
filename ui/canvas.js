// ============================================================
//  CANVAS UTILITIES
// ============================================================

function hexCorners(cx, cy, r, flat) {
  flat = flat || false;
  var result = [];
  for (var i = 0; i < 6; i++) {
    var a = (Math.PI / 3) * i + (flat ? 0 : Math.PI / 6);
    result.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return result;
}

function drawHexOnCtx(ctx, cx, cy, r, fill, stroke, flat) {
  flat = flat || false;
  var pts = hexCorners(cx, cy, r, flat);
  ctx.beginPath();
  pts.forEach(function(pt, i) {
    if (i === 0) ctx.moveTo(pt[0], pt[1]);
    else ctx.lineTo(pt[0], pt[1]);
  });
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.2; ctx.stroke(); }
}