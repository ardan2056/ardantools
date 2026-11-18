/* ===== Ardan Tools — Interactive 3D Warped Mesh Background ===== */
(function () {
  'use strict';

  var canvas = document.getElementById('interactive-mesh');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'interactive-mesh';
    canvas.className = 'interactive-mesh';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(canvas, document.body.firstChild);
  }

  var ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  var width = 0;
  var height = 0;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);

  // Mesh Configuration
  var COLS = 16;
  var ROWS = 12;
  var points = [];
  var mouse = {
    x: -9999,
    y: -9999,
    targetX: -9999,
    targetY: -9999,
    active: false,
    radius: 280,
    strength: 45
  };

  function Point(col, row, x, y) {
    this.col = col;
    this.row = row;
    this.baseX = x;
    this.baseY = y;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    // Highlight certain intersection points like in the reference image
    this.hasDot = (col + row) % 3 === 0 && col > 0 && col < COLS && row > 0 && row < ROWS;
  }

  function initMesh() {
    points = [];
    var cellW = width / COLS;
    var cellH = height / ROWS;

    // Slight perspective curve / sag so it looks like a 3D undulating grid
    for (var r = 0; r <= ROWS; r++) {
      var rowPoints = [];
      var normY = r / ROWS; // 0 to 1
      for (var c = 0; c <= COLS; c++) {
        var normX = c / COLS; // 0 to 1

        // Base coordinate with subtle perspective curvature
        var curveOffset = Math.sin(normX * Math.PI) * (normY * 35 - 15);
        var baseX = c * cellW;
        var baseY = r * cellH + curveOffset;

        var p = new Point(c, r, baseX, baseY);
        rowPoints.push(p);
      }
      points.push(rowPoints);
    }
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    initMesh();
  }

  // Mouse & Touch tracking
  function onPointerMove(e) {
    var clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    mouse.targetX = clientX;
    mouse.targetY = clientY;
    mouse.active = true;
  }

  function onPointerLeave() {
    mouse.active = false;
  }

  window.addEventListener('mousemove', onPointerMove, { passive: true });
  window.addEventListener('touchstart', onPointerMove, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('mouseleave', onPointerLeave, { passive: true });
  window.addEventListener('touchend', onPointerLeave, { passive: true });
  window.addEventListener('resize', resize, { passive: true });

  resize();

  var time = 0;
  var isVisible = true;

  document.addEventListener('visibilitychange', function () {
    isVisible = !document.hidden;
  });

  function render() {
    if (!isVisible) {
      requestAnimationFrame(render);
      return;
    }

    time += 0.016;

    // Smooth lerp mouse coordinates
    if (mouse.active) {
      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;
    } else {
      // Gentle ambient drift when mouse is idle
      mouse.x += (-9999 - mouse.x) * 0.05;
      mouse.y += (-9999 - mouse.y) * 0.05;
    }

    ctx.clearRect(0, 0, width, height);

    // 1. Subtle ambient cursor radial spotlight
    if (mouse.active && mouse.x > -500 && mouse.x < width + 500) {
      var glow = ctx.createRadialGradient(mouse.x, mouse.y, 10, mouse.x, mouse.y, mouse.radius * 1.2);
      glow.addColorStop(0, 'rgba(124, 58, 237, 0.08)');
      glow.addColorStop(0.5, 'rgba(99, 140, 255, 0.04)');
      glow.addColorStop(1, 'rgba(235, 240, 247, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Physics & wave calculation for mesh points
    var spring = 0.08;
    var friction = 0.82;

    for (var r = 0; r <= ROWS; r++) {
      var row = points[r];
      for (var c = 0; c <= COLS; c++) {
        var p = row[c];

        // Ambient sine wave floating (breathing grid)
        var waveX = Math.sin(time * 0.8 + r * 0.4 + c * 0.3) * 5;
        var waveY = Math.cos(time * 0.7 + r * 0.3 + c * 0.4) * 6;

        var targetX = p.baseX + waveX;
        var targetY = p.baseY + waveY;

        // Interactive mouse distortion
        if (mouse.active) {
          var dx = p.x - mouse.x;
          var dy = p.y - mouse.y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius && dist > 0.001) {
            var factor = (1 - dist / mouse.radius);
            // Non-linear bulge effect
            factor = factor * factor;
            var push = factor * mouse.strength;
            targetX += (dx / dist) * push;
            targetY += (dy / dist) * push;
          }
        }

        // Spring acceleration
        p.vx += (targetX - p.x) * spring;
        p.vy += (targetY - p.y) * spring;
        p.vx *= friction;
        p.vy *= friction;
        p.x += p.vx;
        p.y += p.vy;
      }
    }

    // 3. Draw horizontal lines (rows)
    ctx.lineWidth = 1;
    for (var r = 0; r <= ROWS; r++) {
      ctx.beginPath();
      var rRow = points[r];
      ctx.moveTo(rRow[0].x, rRow[0].y);

      for (var c = 1; c <= COLS; c++) {
        // Curve smoothing using midpoints
        var prev = rRow[c - 1];
        var curr = rRow[c];
        var midX = (prev.x + curr.x) / 2;
        var midY = (prev.y + curr.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
      }
      ctx.lineTo(rRow[COLS].x, rRow[COLS].y);

      // Gradient stroke for depth
      var alpha = 0.16 + (r / ROWS) * 0.08;
      ctx.strokeStyle = 'rgba(99, 132, 215, ' + alpha + ')';
      ctx.stroke();
    }

    // 4. Draw vertical lines (columns)
    for (var c = 0; c <= COLS; c++) {
      ctx.beginPath();
      ctx.moveTo(points[0][c].x, points[0][c].y);

      for (var r = 1; r <= ROWS; r++) {
        var prev = points[r - 1][c];
        var curr = points[r][c];
        var midX = (prev.x + curr.x) / 2;
        var midY = (prev.y + curr.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
      }
      ctx.lineTo(points[ROWS][c].x, points[ROWS][c].y);

      var cAlpha = 0.14 + Math.sin((c / COLS) * Math.PI) * 0.08;
      ctx.strokeStyle = 'rgba(99, 132, 215, ' + cAlpha + ')';
      ctx.stroke();
    }

    // 5. Draw highlighted glowing nodes on intersections (matching reference image)
    for (var r = 1; r < ROWS; r++) {
      for (var c = 1; c < COLS; c++) {
        var pt = points[r][c];
        if (pt.hasDot) {
          // Check proximity to cursor to brighten dot
          var dMouse = Math.hypot(pt.x - mouse.x, pt.y - mouse.y);
          var isNear = mouse.active && dMouse < mouse.radius;
          var dotRadius = isNear ? 3.5 : 2.5;

          ctx.beginPath();
          ctx.arc(pt.x, pt.y, dotRadius, 0, Math.PI * 2);

          if (isNear) {
            ctx.fillStyle = 'rgba(124, 58, 237, 0.75)';
            ctx.shadowColor = 'rgba(124, 58, 237, 0.8)';
            ctx.shadowBlur = 8;
          } else {
            ctx.fillStyle = 'rgba(99, 140, 255, 0.45)';
            ctx.shadowColor = 'rgba(99, 140, 255, 0.4)';
            ctx.shadowBlur = 4;
          }
          ctx.fill();
          ctx.shadowBlur = 0; // Reset
        }
      }
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();
