/*
  KI-assistiert erstellt unter Verwendung des "learning-artifacts-builder (lab-o5)"-Skills, angepasst als Vibe-Coding-Lab-Skill
  Lizenz: CC BY-SA 4.0 (Dominik Kluge), https://creativecommons.org/licenses/by-sa/4.0/
  Sie dürfen: Teilen, Bearbeiten
  Bedingungen: Namensnennung, Weitergabe unter gleichen Bedingungen
*/
/*
  globe.js – the 3D globe (three.js). D3 paints the land outlines onto a flat canvas,
  three.js wraps that canvas around a sphere and adds one bar per country.
  If the device has no WebGL, the flat map is shown instead.
*/
(function (root) {
  'use strict';
  var THREE = root.THREE, d3 = root.d3;
  var RAD = Math.PI / 180;

  function paintMap(canvas) {
    var ctx = canvas.getContext('2d');
    var proj = d3.geoEquirectangular().fitSize([canvas.width, canvas.height], { type: 'Sphere' });
    var path = d3.geoPath(proj, ctx);
    ctx.fillStyle = '#dbe7f7'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath(); path(d3.geoGraticule10()); ctx.strokeStyle = '#c3d3ea'; ctx.lineWidth = 1; ctx.stroke();
    ctx.beginPath(); path(root.LAND); ctx.fillStyle = '#8fa1b8'; ctx.fill();
    ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1; ctx.stroke();
    return proj;
  }

  function colour(v) { return v < 100 ? '#c2410c' : (v > 100 ? '#1d4ed8' : '#4b5563'); }

  function create(host, countries, alt) {
    var year = 0, raf = 0, api = {};
    var map = document.createElement('canvas'); map.width = 1024; map.height = 512;
    var proj = paintMap(map);
    var renderer = null;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch (e) { renderer = null; }

    if (!renderer) {
      // Flat fallback: same map, circles instead of bars.
      var flat = document.createElement('canvas'); flat.width = 1024; flat.height = 512;
      flat.className = 'flatmap'; flat.setAttribute('role', 'img'); flat.setAttribute('aria-label', alt);
      host.appendChild(flat);
      var drawFlat = function () {
        var c = flat.getContext('2d'); c.drawImage(map, 0, 0);
        countries.forEach(function (k) {
          var p = proj([k.lon, k.lat]), v = k.v[year];
          c.beginPath(); c.arc(p[0], p[1], 6 + Math.abs(v - 100) * 0.35, 0, 2 * Math.PI);
          c.fillStyle = colour(v); c.globalAlpha = 0.8; c.fill(); c.globalAlpha = 1;
          c.strokeStyle = '#fff'; c.lineWidth = 2; c.stroke();
        });
      };
      drawFlat();
      api.setYear = function (i) { year = i; drawFlat(); };
      api.focus = function () {};
      api.dispose = function () {};
      api.is3d = false;
      return api;
    }

    renderer.setPixelRatio(Math.min(root.devicePixelRatio || 1, 2));
    var el = renderer.domElement;
    el.setAttribute('role', 'img'); el.setAttribute('aria-label', alt); el.setAttribute('tabindex', '0');
    el.style.touchAction = 'none';
    host.appendChild(el);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(40, 1, 0.1, 20); camera.position.z = 4.3;
    var group = new THREE.Group(); scene.add(group);
    var tex = new THREE.CanvasTexture(map);
    if (THREE.SRGBColorSpace) { tex.colorSpace = THREE.SRGBColorSpace; }
    group.add(new THREE.Mesh(new THREE.SphereGeometry(1, 64, 40), new THREE.MeshBasicMaterial({ map: tex })));

    function pos(lat, lon, r) {
      var phi = (90 - lat) * RAD, th = (lon + 180) * RAD;
      return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
    }
    var boxGeo = new THREE.BoxGeometry(0.045, 0.045, 1); boxGeo.translate(0, 0, 0.5);
    var bars = countries.map(function (k) {
      var mesh = new THREE.Mesh(boxGeo, new THREE.MeshBasicMaterial({ color: '#4b5563' }));
      mesh.position.copy(pos(k.lat, k.lon, 1));
      mesh.lookAt(pos(k.lat, k.lon, 2));
      group.add(mesh);
      return mesh;
    });

    var rotY = -(-25 + 90) * RAD, rotX = 35 * RAD;
    function draw() { group.rotation.set(rotX, rotY, 0); renderer.render(scene, camera); }
    function setBars() {
      countries.forEach(function (k, i) {
        var v = k.v[year];
        bars[i].scale.z = Math.max(0.02, Math.abs(v - 100) / 100 * 0.55);
        bars[i].material.color.set(colour(v));
      });
    }
    function resize() {
      var w = host.clientWidth || 300, hgt = host.clientHeight || w;
      renderer.setSize(w, hgt, false);
      el.style.width = '100%'; el.style.height = '100%';
      camera.aspect = w / hgt; camera.updateProjectionMatrix(); draw();
    }
    var ro = new ResizeObserver(resize); ro.observe(host);

    var drag = null;
    el.addEventListener('pointerdown', function (ev) { drag = { x: ev.clientX, y: ev.clientY }; el.setPointerCapture(ev.pointerId); });
    el.addEventListener('pointermove', function (ev) {
      if (!drag) { return; }
      rotY += (ev.clientX - drag.x) * 0.008;
      rotX = Math.max(-1.2, Math.min(1.2, rotX + (ev.clientY - drag.y) * 0.008));
      drag = { x: ev.clientX, y: ev.clientY }; draw();
    });
    ['pointerup', 'pointercancel'].forEach(function (n) { el.addEventListener(n, function () { drag = null; }); });
    el.addEventListener('keydown', function (ev) {
      var d = { ArrowLeft: [0.15, 0], ArrowRight: [-0.15, 0], ArrowUp: [0, 0.1], ArrowDown: [0, -0.1] }[ev.key];
      if (!d) { return; }
      ev.preventDefault(); rotY += d[0]; rotX = Math.max(-1.2, Math.min(1.2, rotX + d[1])); draw();
    });

    api.setYear = function (i) { year = i; setBars(); draw(); };
    api.focus = function (i) {
      var k = countries[i], toY = -(k.lon + 90) * RAD, toX = k.lat * RAD * 0.7;
      cancelAnimationFrame(raf);
      var still = root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (still) { rotY = toY; rotX = toX; draw(); return; }
      // Take the short way round.
      var fromY = rotY, fromX = rotX, dY = ((toY - fromY + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
      var t0 = performance.now();
      (function step(now) {
        var p = Math.min(1, (now - t0) / 500), e = p * (2 - p);
        rotY = fromY + dY * e; rotX = fromX + (toX - fromX) * e; draw();
        if (p < 1) { raf = requestAnimationFrame(step); }
      })(t0);
    };
    api.dispose = function () {
      cancelAnimationFrame(raf); ro.disconnect();
      tex.dispose(); boxGeo.dispose(); renderer.dispose();
      if (renderer.forceContextLoss) { renderer.forceContextLoss(); }
    };
    api.is3d = true;
    setBars(); resize();
    return api;
  }

  root.Globe = { create: create };
})(window);
