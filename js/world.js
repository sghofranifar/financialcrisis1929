/*
  KI-assistiert erstellt unter Verwendung des "learning-artifacts-builder (lab-o5)"-Skills, angepasst als Vibe-Coding-Lab-Skill
  Lizenz: CC BY-SA 4.0 (Dominik Kluge), https://creativecommons.org/licenses/by-sa/4.0/
  Sie dürfen: Teilen, Bearbeiten
  Bedingungen: Namensnennung, Weitergabe unter gleichen Bedingungen
*/
/*
  world.js – the walkable 3D world (Babylon.js).
  Each city is a square plaza: landmark in the north, bank in the west, conference room in the east.
  Everything is built from simple shapes in code – there are no model or image files.
  North is +z, east is +x. The player starts in the south and looks north.
*/
(function (root) {
  'use strict';
  var B = root.BABYLON;

  function el(tag, attrs) {
    var e = document.createElement(tag), k, i, kid;
    for (k in (attrs || {})) {
      if (attrs[k] === null || attrs[k] === undefined || attrs[k] === false) { continue; }
      if (k === 'on') { for (i in attrs.on) { e.addEventListener(i, attrs.on[i]); } }
      else if (k === 'checked' || k === 'hidden' || k === 'value') { e[k] = attrs[k]; }
      else { e.setAttribute(k, attrs[k] === true ? '' : attrs[k]); }
    }
    for (i = 2; i < arguments.length; i++) {
      kid = arguments[i];
      (Array.isArray(kid) ? kid : [kid]).forEach(function (c) {
        if (c === null || c === undefined || c === false) { return; }
        e.appendChild(c.nodeType ? c : document.createTextNode(String(c)));
      });
    }
    return e;
  }
  function rng(seed) { return function () { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }; }

  var STYLE = {
    ny: { walls: ['#8a7f72', '#9c8f80', '#6f6a64', '#a39a8c'], h: [22, 55], ground: '#6f7278', seed: 11 },
    lon: { walls: ['#8c7b6b', '#a08f7d', '#7a6a5c'], h: [10, 16], ground: '#74736e', seed: 23 },
    ber: { walls: ['#b3a58a', '#c2b497', '#9d9078'], h: [12, 18], ground: '#8a8473', seed: 37 },
    par: { walls: ['#d8cdb4', '#cfc3a8', '#e0d6bf'], h: [12, 17], ground: '#9d9786', seed: 41 }
  };
  var CROWD = {
    ny: { a: { walk: 16 }, b: { walk: 2, mob: { at: [0, 20], n: 70, spread: 7, panic: true }, paper: true } },
    lon: { a: { walk: 12, queue: { n: 8, sign: 'DOCK WORK · QUEUE HERE' } }, b: { walk: 4, mob: { at: [-22, 3], n: 30, spread: 4 }, queue: { n: 14, sign: 'LABOUR EXCHANGE' } } },
    ber: { a: { walk: 16 }, b: { walk: 2, mob: { at: [-22, 3], n: 45, spread: 4.5 }, queue: { n: 18, sign: 'ARBEITSAMT · STEMPELSTELLE' } } },
    par: { a: { walk: 14, cafe: 8 }, b: { walk: 4, cafe: 0, queue: { n: 10, sign: 'SOUPE POPULAIRE' } } }
  };
  var COATS = ['#3f3f46', '#57534e', '#44403c', '#1e293b', '#6b4f3a'];
  var START = { x: 0, z: -20, yaw: 0 };
  var SEAT = { x: 22.9, z: 0, yaw: Math.PI / 2 };

  function cityDone(W, state, id) {
    var c = W.cities.filter(function (x) { return x.id === id; })[0];
    return c.npcs.every(function (n) { return state.met[n.id]; });
  }

  function create(host, o) {
    var W = o.W, st = o.state, lang = o.lang;
    function t(x) { return typeof x === 'string' ? x : x[lang]; }
    function u(k) { return t(W.ui[k]); }
    function city() { return W.cities.filter(function (c) { return c.id === st.city; })[0]; }
    function here() { return city().npcs.filter(function (n) { return n.time === st.time; }); }
    var reduce = root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var engine = null, scene = null, camera = null, has3d = true;
    var pos = { x: START.x, z: START.z }, yaw = 0, pitch = 0, seated = false;
    var colliders = [], talkers = [], movers = [], papers = [];
    var keys = {}, joy = { x: 0, y: 0 }, dlg = null, promptKey = null;

    /* ---------- DOM ---------- */
    var canvas = el('canvas', { 'aria-label': u('stageAlt'), role: 'img' });
    var knob = el('div', { class: 'w-knob' });
    var stick = el('div', { class: 'w-stick', 'aria-hidden': 'true', title: u('stick') }, knob);
    var prompts = el('div', { class: 'w-prompts' });
    var dialog = el('div', { class: 'w-dialog', role: 'dialog', 'aria-labelledby': 'w-dlg-title', hidden: true });
    var stage = el('div', { class: 'w-stage', tabindex: '0', role: 'group', 'aria-label': u('stageAlt') }, canvas, stick, prompts);
    var list = el('div', { class: 'w-list' });
    var introP = el('p', { class: 'w-intro', role: 'status' });
    var countP = el('p', { class: 'small', role: 'status' });
    var cityBtns = el('div', { class: 'w-group', role: 'group', 'aria-label': u('city') });
    var timeBtns = el('div', { class: 'w-group', role: 'group', 'aria-label': u('time') });
    var gotoSel = el('select', { id: 'w-goto', 'aria-label': u('goto'), on: { change: function () { teleport(gotoSel.value); gotoSel.value = ''; stage.focus(); } } });
    var listChk = el('input', { type: 'checkbox', id: 'w-list', role: 'switch', checked: !!st.list, on: { change: function () { st.list = listChk.checked; o.onChange(); layout(); } } });
    var speechChk = el('input', { type: 'checkbox', id: 'w-speech', role: 'switch', checked: !!st.speech, on: { change: function () {
      st.speech = speechChk.checked; o.onChange();
      if (!st.speech && root.speechSynthesis) { root.speechSynthesis.cancel(); }
    } } });
    var main = el('div', { class: 'w-main' }, stage, list, dialog);
    var fullBtn = el('button', { type: 'button', class: 'btn ghost', on: { click: function () {
      if (document.fullscreenElement) { document.exitFullscreen(); } else if (main.requestFullscreen) { main.requestFullscreen().catch(function () {}); }
    } } }, '⛶ ' + u('full'));
    host.appendChild(el('div', { class: 'world' },
      el('div', { class: 'w-bar' }, cityBtns, timeBtns),
      introP,
      el('div', { class: 'w-bar' }, gotoSel,
        el('label', { class: 'switch', for: 'w-list' }, listChk, el('span', {}, u('listMode'))),
        el('label', { class: 'switch', for: 'w-speech' }, speechChk, el('span', {}, u('speech'))),
        fullBtn),
      main,
      el('p', { class: 'small w-help' }, u('help')), countP));

    function paintBar() {
      cityBtns.textContent = ''; timeBtns.textContent = '';
      W.cities.forEach(function (c) {
        cityBtns.appendChild(el('button', { type: 'button', class: 'btn', 'aria-pressed': c.id === st.city ? 'true' : 'false',
          on: { click: function () { st.city = c.id; o.onChange(); travel(); } } }, (cityDone(W, st, c.id) ? '✓ ' : '') + t(c.name)));
      });
      ['a', 'b'].forEach(function (k) {
        timeBtns.appendChild(el('button', { type: 'button', class: 'btn', 'aria-pressed': k === st.time ? 'true' : 'false',
          on: { click: function () { st.time = k; o.onChange(); travel(); } } }, t(city().times[k].label)));
      });
      introP.textContent = t(city().times[st.time].intro);
      gotoSel.textContent = '';
      [['', u('goto')], ['start', u('start')], ['landmark', city().signs.landmark], ['bank', city().signs.bank[st.time]], ['table', u('table')]]
        .concat(here().map(function (n) { return ['npc:' + n.id, n.name]; }))
        .forEach(function (p) { gotoSel.appendChild(el('option', { value: p[0] }, p[1])); });
      var all = city().npcs.length, met = city().npcs.filter(function (n) { return st.met[n.id]; }).length;
      countP.textContent = u('met') + ' (' + t(city().name) + '): ' + met + ' / ' + all + (met === all ? ' – ' + u('allMet') : '');
      list.textContent = '';
      list.appendChild(el('h4', {}, u('listTitle')));
      list.appendChild(el('div', { class: 'opts' }, here().map(function (n) {
        return el('button', { type: 'button', class: 'opt', on: { click: function () { openDialog(n); } } },
          (st.met[n.id] ? '✓ ' : '💬 ') + n.name + ' – ' + t(n.role));
      })));
    }
    function layout() {
      var flat = st.list || !has3d;
      stage.hidden = flat; list.hidden = !flat;
      main.classList.toggle('flat', flat);
      if (has3d) { if (flat) { engine.stopRenderLoop(); } else { engine.stopRenderLoop(); engine.runRenderLoop(frame); engine.resize(); } }
    }

    /* ---------- dialogue ---------- */
    function say(text, voice) {
      if (!st.speech || !root.speechSynthesis || !root.SpeechSynthesisUtterance) { return; }
      root.speechSynthesis.cancel();
      var s = new root.SpeechSynthesisUtterance(text); s.lang = voice; root.speechSynthesis.speak(s);
    }
    function openDialog(n) {
      dlg = { npc: n, i: -1 };
      if (!st.met[n.id]) { st.met[n.id] = true; o.onChange(); markTalkers(); paintBar(); }
      keys = {}; joy.x = joy.y = 0;
      paintDialog(true);
    }
    function closeDialog() {
      dlg = null; dialog.hidden = true; dialog.textContent = '';
      if (root.speechSynthesis) { root.speechSynthesis.cancel(); }
      promptKey = null;
      if (!stage.hidden) { stage.focus(); }
    }
    function paintDialog(speak, focusTr) {
      var n = dlg.npc, c = city(), main1 = c.speak, other = main1 === 'de' ? 'en' : 'de';
      var line = dlg.i < 0 ? n.hello : n.qa[dlg.i].a, quote = dlg.i >= 0 ? n.qa[dlg.i].quote : null;
      dialog.textContent = ''; dialog.hidden = false;
      var closeBtn = el('button', { type: 'button', class: 'btn', on: { click: closeDialog } }, '✕ ' + u('close'));
      dialog.appendChild(el('div', { class: 'w-dhead' },
        el('div', {}, el('h4', { id: 'w-dlg-title' }, n.name + ' – ' + t(n.role)), el('span', { class: 'badge' }, u(n.real ? 'real' : 'fict'))), closeBtn));
      var body = el('div', { class: 'w-say', role: 'status' });
      if (dlg.i >= 0) { body.appendChild(el('p', { class: 'w-q', lang: main1 }, '– ' + n.qa[dlg.i].q[main1])); }
      body.appendChild(el('p', { class: 'w-a', lang: main1 }, line[main1]));
      if (quote) {
        body.appendChild(el('blockquote', { class: 'orig', lang: quote.lang }, el('span', { class: 'tag' }, u('quote')), el('p', {}, quote.text), el('span', { class: 'small' }, quote.cite)));
      }
      if (st.tr) {
        body.appendChild(el('div', { class: 'w-tr', lang: other },
          dlg.i >= 0 ? el('p', {}, '– ' + n.qa[dlg.i].q[other]) : null, el('p', {}, line[other]),
          quote ? el('p', {}, quote.lang === other ? quote.text : quote.tr) : null));
      }
      dialog.appendChild(body);
      var trBtn = el('button', { type: 'button', class: 'btn ghost', 'aria-pressed': st.tr ? 'true' : 'false',
        on: { click: function () { st.tr = !st.tr; o.onChange(); paintDialog(false, true); } } }, u(st.tr ? 'hideTr' : 'showTr'));
      dialog.appendChild(trBtn);
      dialog.appendChild(el('p', { class: 'w-ask' }, u('ask') + ':'));
      dialog.appendChild(el('div', { class: 'opts' }, n.qa.map(function (qa, i) {
        return el('button', { type: 'button', class: 'opt' + (dlg.i === i ? ' is-pick' : ''), lang: main1,
          on: { click: function () { st.asked[n.id + ':' + i] = true; o.onChange(); dlg.i = i; paintDialog(true); } } },
          (st.asked[n.id + ':' + i] ? '✓ ' : '') + qa.q[main1]);
      })));
      if (speak) {
        say(line[main1] + (quote ? ' ' + (quote.lang === main1 ? quote.text : quote.tr) : ''), c.voice);
        closeBtn.focus({ preventScroll: true });
      }
      if (focusTr) { trBtn.focus({ preventScroll: true }); }
    }

    /* ---------- 3D scene ---------- */
    function build() {
      if (scene) { scene.dispose(); }
      colliders = []; talkers = []; movers = []; papers = [];
      var c = city(), sty = STYLE[c.id], crisis = st.time === 'b', rnd = rng(sty.seed), mats = {};
      scene = new B.Scene(engine);
      scene.skipPointerMovePicking = true;
      var sky = B.Color3.FromHexString(crisis ? '#a3a9b0' : '#bcd9f5');
      scene.clearColor = new B.Color4(sky.r, sky.g, sky.b, 1);
      scene.fogMode = B.Scene.FOGMODE_LINEAR; scene.fogColor = sky; scene.fogStart = crisis ? 18 : 40; scene.fogEnd = crisis ? 75 : 130;
      camera = new B.FreeCamera('cam', new B.Vector3(0, 1.65, -20), scene);
      camera.minZ = 0.1; camera.maxZ = 220; camera.fov = 1.05;
      var hemi = new B.HemisphericLight('h', new B.Vector3(0.2, 1, -0.3), scene);
      hemi.intensity = crisis ? 0.8 : 1.0; hemi.groundColor = new B.Color3(0.45, 0.45, 0.5);
      var sun = new B.DirectionalLight('s', new B.Vector3(-0.5, -1, 0.6), scene); sun.intensity = crisis ? 0.2 : 0.55;

      function mat(hex) {
        if (!mats[hex]) { var m = new B.StandardMaterial('m' + hex, scene); m.diffuseColor = B.Color3.FromHexString(hex); m.specularColor = B.Color3.Black(); mats[hex] = m; }
        return mats[hex];
      }
      function put(mesh, hex, x, y, z) { mesh.position.set(x, y, z); if (hex) { mesh.material = mat(hex); } mesh.isPickable = false; return mesh; }
      function box(w, h, d, hex, x, y, z) { return put(B.MeshBuilder.CreateBox('b', { width: w, height: h, depth: d }, scene), hex, x, y, z); }
      function cyl(dTop, dBot, h, hex, x, y, z, tess) { return put(B.MeshBuilder.CreateCylinder('c', { diameterTop: dTop, diameterBottom: dBot, height: h, tessellation: tess || 12 }, scene), hex, x, y, z); }
      function ball(d, hex, x, y, z) { return put(B.MeshBuilder.CreateSphere('s', { diameter: d, segments: 8 }, scene), hex, x, y, z); }
      function solid(minX, maxX, minZ, maxZ) { colliders.push([minX, maxX, minZ, maxZ]); }
      function textTex(lines, w, h, bg, fg) {
        var tex = new B.DynamicTexture('t', { width: w, height: h }, scene, true), g = tex.getContext();
        g.fillStyle = bg; g.fillRect(0, 0, w, h);
        g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle';
        var lh = h / lines.length;
        lines.forEach(function (ln, i) {
          var size = Math.floor(lh * 0.62);
          g.font = 'bold ' + size + 'px Arial, sans-serif';
          while (g.measureText(ln).width > w * 0.92 && size > 8) { size -= 2; g.font = 'bold ' + size + 'px Arial, sans-serif'; }
          g.fillText(ln, w / 2, lh * (i + 0.5));
        });
        tex.update(); return tex;
      }
      // A flat sign. faceYaw: 0 = readable from the south, -PI/2 = from the east, PI/2 = from the west, PI = from the north.
      function sign(lines, w, h, x, y, z, faceYaw, bg, fg) {
        var p = B.MeshBuilder.CreatePlane('sign', { width: w, height: h }, scene), m = new B.StandardMaterial('sm', scene);
        m.emissiveTexture = textTex(lines, 512, Math.max(64, Math.round(512 * h / w)), bg || '#f8f5e9', fg || '#1b2333');
        m.disableLighting = true; p.material = m; p.position.set(x, y, z); p.rotation.y = faceYaw || 0; p.isPickable = false;
        return p;
      }
      function building(x, z, w, d, h, hex) {
        var m = new B.StandardMaterial('wm', scene), tex = new B.DynamicTexture('wt', { width: 64, height: 64 }, scene, true), g = tex.getContext();
        g.fillStyle = hex; g.fillRect(0, 0, 64, 64);
        [[8, 10], [38, 10], [8, 40], [38, 40]].forEach(function (p) { g.fillStyle = (rnd() < 0.3 && !crisis) ? '#f3d98b' : '#2b3447'; g.fillRect(p[0], p[1], 18, 20); });
        tex.update(); tex.uScale = Math.max(1, Math.round(Math.max(w, d) / 3.2)); tex.vScale = Math.max(1, Math.round(h / 3.4));
        m.diffuseTexture = tex; m.specularColor = B.Color3.Black();
        var b = box(w, h, d, null, x, h / 2, z); b.material = m; return b;
      }
      // A triangular roof front (pediment), pointing up, facing south.
      function prism(w, h, d, hex, x, y, z) {
        var v = new B.VertexData(), a = w / 2, e = d / 2;
        v.positions = [-a, 0, -e, a, 0, -e, 0, h, -e, -a, 0, e, a, 0, e, 0, h, e];
        v.indices = [0, 2, 1, 3, 4, 5, 0, 3, 5, 0, 5, 2, 1, 2, 5, 1, 5, 4, 0, 1, 4, 0, 4, 3];
        v.normals = []; B.VertexData.ComputeNormals(v.positions, v.indices, v.normals);
        var m = new B.Mesh('prism', scene); v.applyToMesh(m);
        put(m, hex, x, y, z); m.material = mat(hex).clone('pm'); m.material.backFaceCulling = false; return m;
      }

      /* ground */
      var gm = new B.StandardMaterial('gm', scene), gt = new B.DynamicTexture('gt', { width: 128, height: 128 }, scene, true), gg = gt.getContext();
      gg.fillStyle = sty.ground; gg.fillRect(0, 0, 128, 128); gg.strokeStyle = 'rgba(0,0,0,0.18)'; gg.lineWidth = 2;
      [0, 64].forEach(function (p) { gg.strokeRect(p, 0, 64, 64); gg.strokeRect(p - 32, 64, 64, 64); gg.strokeRect(p + 32, 64, 64, 64); });
      gt.update(); gt.uScale = gt.vScale = 40; gm.diffuseTexture = gt; gm.specularColor = B.Color3.Black();
      var ground = B.MeshBuilder.CreateGround('g', { width: 160, height: 160 }, scene); ground.material = gm; ground.isPickable = false;

      /* ring of houses around the plaza */
      function row(fixed, from, to, alongX, skip) {
        var p = from;
        while (p < to - 3) {
          var w = Math.min(6 + rnd() * 5, to - p), h = sty.h[0] + rnd() * (sty.h[1] - sty.h[0]), mid = p + w / 2;
          var hex = sty.walls[Math.floor(rnd() * sty.walls.length)];
          if (!(skip && mid > skip[0] && mid < skip[1])) {
            if (alongX) { building(mid, fixed, w - 0.3, 9, h, hex); } else { building(fixed, mid, 9, w - 0.3, h, hex); }
            if (c.id === 'par') { if (alongX) { box(w - 0.1, 1.6, 9.2, '#4b5563', mid, h + 0.8, fixed); } else { box(9.2, 1.6, w - 0.1, '#4b5563', fixed, h + 0.8, mid); } }
          }
          p += w;
        }
      }
      row(35, -39, 39, true, [-14, 14]); row(-35, -39, 39, true); row(-35, -30, 30, false, [-4, 10]); row(35, -30, 30, false);

      /* landmark in the north */
      if (c.id === 'ny') {
        box(24, 15, 7, '#d9d4c7', 0, 7.5, 31.5);
        for (var i = 0; i < 6; i++) { cyl(1.3, 1.5, 10, '#ece8dc', -9 + i * 3.6, 6, 27.3, 14); }
        box(24, 1.2, 2.4, '#ece8dc', 0, 11.6, 27.4); prism(24, 4, 2.2, '#d9d4c7', 0, 12.2, 27.4);
        box(24, 1, 2.6, '#c9c4b7', 0, 0.5, 27.4);
        building(-18, 44, 12, 10, 70, '#7d766c'); building(17, 46, 13, 10, 85, '#8a8378'); building(0, 50, 10, 10, 100, '#6f6a64');
        sign([c.signs.landmark], 16, 1.3, 0, 11.6, 26.15, 0, '#ece8dc', '#3f3a30');
      } else if (c.id === 'lon') {
        box(26, 11, 7, '#b9a37a', -3, 5.5, 31.5);
        for (var j = 0; j < 8; j++) { cyl(0, 0.9, 3, '#a8926a', -14.5 + j * 3.3, 12.5, 28.5, 4); }
        box(5, 30, 5, '#b9a37a', 12, 15, 30.5); cyl(0, 6.4, 8, '#5b6168', 12, 34, 30.5, 4).rotation.y = Math.PI / 4;
        var clock = B.MeshBuilder.CreateDisc('clock', { radius: 1.9, tessellation: 24 }, scene), cm = new B.StandardMaterial('cm', scene);
        var ct = new B.DynamicTexture('ct', { width: 128, height: 128 }, scene, true), cg = ct.getContext();
        cg.fillStyle = '#f5f0dc'; cg.fillRect(0, 0, 128, 128); cg.strokeStyle = '#222'; cg.lineWidth = 6;
        cg.beginPath(); cg.arc(64, 64, 58, 0, 6.3); cg.stroke(); cg.beginPath(); cg.moveTo(64, 64); cg.lineTo(64, 20); cg.moveTo(64, 64); cg.lineTo(92, 78); cg.stroke(); ct.update();
        cm.emissiveTexture = ct; cm.disableLighting = true; clock.material = cm; clock.position.set(12, 26, 27.95); clock.isPickable = false;
        sign([c.signs.landmark], 12, 1.2, -3, 9, 27.95, 0, '#b9a37a', '#2d2618');
        box(2.5, 4.3, 8, '#b91c1c', 14, 2.3, -24); box(2.55, 1, 7.6, '#1f2937', 14, 3.4, -24); box(2.55, 0.9, 7.6, '#1f2937', 14, 1.7, -24); solid(12.5, 15.5, -28.3, -19.7);
        box(1, 2.5, 1, '#b91c1c', -14, 1.25, -22); solid(-14.7, -13.3, -22.7, -21.3);
      } else if (c.id === 'ber') {
        for (var k = 0; k < 6; k++) { box(1.5, 10, 3.4, '#cdbf9a', -11 + k * 4.4, 5, 28); solid(-11.9 + k * 4.4, -10.1 + k * 4.4, 26.1, 29.9); }
        box(25.5, 2.6, 3.8, '#cdbf9a', 0, 11.3, 28); box(9, 2, 3.4, '#c4b68f', 0, 13.6, 28);
        box(2.6, 1.6, 1.2, '#5f7f6b', 0, 15.4, 28); for (var q = 0; q < 4; q++) { box(0.4, 1.2, 1.6, '#5f7f6b', -1.4 + q * 0.93, 15.2, 27); }
        sign([c.signs.landmark], 12, 1, 0, 11.3, 26.05, 0, '#cdbf9a', '#3a321d');
        var lit = cyl(1.5, 1.5, 3.4, null, 12, 1.7, -12, 20), lm = new B.StandardMaterial('lm', scene);
        lm.emissiveTexture = textTex(crisis ? ['NOTVERORDNUNG', 'Löhne gekürzt', 'Steuern erhöht'] : ['KINO · REVUE', 'TANZ', 'Heute Abend!'], 512, 256, crisis ? '#e7e2d0' : '#f5d76e', '#1b2333');
        lm.emissiveTexture.uScale = 2; lm.disableLighting = true; lit.material = lm; cyl(1.9, 1.7, 0.4, '#3f3f46', 12, 3.6, -12, 20); solid(11.1, 12.9, -12.9, -11.1);
      } else {
        var iron = '#5d4b3b';
        [[-4.6, -4.6], [4.6, -4.6], [-4.6, 4.6], [4.6, 4.6]].forEach(function (p) {
          var leg = box(1.6, 12, 1.6, iron, p[0] * 0.75, 5.6, 33 + p[1] * 0.75); leg.rotation.z = -Math.sign(p[0]) * 0.28; leg.rotation.x = Math.sign(p[1]) * 0.28;
        });
        box(9, 0.8, 9, iron, 0, 11.3, 33); cyl(3.2, 7.4, 12, iron, 0, 17.6, 33, 4).rotation.y = Math.PI / 4;
        box(4.2, 0.7, 4.2, iron, 0, 23.8, 33); cyl(0.5, 3.4, 26, iron, 0, 37, 33, 4).rotation.y = Math.PI / 4; cyl(0.1, 0.1, 6, iron, 0, 53, 33, 6);
        sign([c.signs.landmark], 8, 0.9, 0, 2.2, 26.8, 0, '#2f3a4a', '#f5f0dc'); box(0.2, 1.8, 0.2, '#2f3a4a', -3.6, 0.9, 26.8); box(0.2, 1.8, 0.2, '#2f3a4a', 3.6, 0.9, 26.8);
        // café in the south-west
        box(9, 4, 5, '#b7ab8d', -15, 2, -14.5); box(9.4, 0.25, 2.6, crisis ? '#7a7466' : '#b91c1c', -15, 3.1, -11.2).rotation.x = -0.25; solid(-19.6, -10.4, -17.2, -11.9);
        sign(['CAFÉ DE LA PAIX'], 7, 0.9, -15, 3.75, -11.95, Math.PI, '#14532d', '#f5f0dc');
        [[-18, -9], [-15.5, -8], [-13, -9], [-11, -7]].forEach(function (p) { cyl(0.9, 0.9, 0.06, '#f5f0dc', p[0], 0.75, p[1], 14); cyl(0.08, 0.3, 0.75, '#3f3f46', p[0], 0.37, p[1], 8); solid(p[0] - 0.5, p[0] + 0.5, p[1] - 0.5, p[1] + 0.5); });
      }
      solid(-13, 13, 25.8, 40);

      /* bank in the west */
      box(8, 11, 11, '#cfc8b8', -30.5, 5.5, 3);
      [-1.2, 1.6, 4.4, 7.2].forEach(function (z) { cyl(0.9, 1, 8, '#e3ddcf', -26, 4, z, 12); });
      box(1.6, 1.2, 11.4, '#e3ddcf', -26, 8.6, 3);
      sign([c.signs.bank[st.time]], 9, 1.1, -25.15, 8.6, 3, -Math.PI / 2, crisis && c.signs.bank.a !== c.signs.bank.b ? '#7f1d1d' : '#e3ddcf', crisis && c.signs.bank.a !== c.signs.bank.b ? '#fff' : '#2d2618');
      box(0.2, 3.2, 2.2, crisis ? '#3f2d1c' : '#6b4f3a', -26.4, 1.6, 3); solid(-36, -25.3, -2.6, 8.6);

      /* conference room in the east */
      box(9.4, 0.12, 10.4, '#7c5e43', 24.5, 0.06, 0); box(9.4, 4.2, 0.3, '#e7e0cf', 24.5, 2.1, 5.05); box(9.4, 4.2, 0.3, '#e7e0cf', 24.5, 2.1, -5.05);
      box(0.3, 4.2, 10.4, '#e7e0cf', 29.05, 2.1, 0); box(9.9, 0.3, 10.9, '#5b6168', 24.5, 4.35, 0);
      box(1.5, 0.12, 3.4, '#5a3d28', 25, 0.8, 0); box(1.1, 0.74, 3, '#4a3221', 25, 0.4, 0);
      sign([crisis ? c.signs.table : u('table').toUpperCase()], 9.4, 0.9, 19.75, 4.75, 0, Math.PI / 2, '#1e3a8a', '#fff');
      solid(19.8, 29.3, 4.8, 5.4); solid(19.8, 29.3, -5.4, -4.8); solid(28.8, 29.4, -5.2, 5.2); solid(24.1, 28.8, -2.1, 2.1);
      if (!crisis) { sign(u('tableLater').split(' – '), 5.4, 1.5, 24.2, 2, 0, Math.PI / 2, '#fef9c3', '#713f12'); }

      /* notice boards, lamps, cars */
      function board(lines, x, z, bg, fg) { sign(lines, 4.6, 2.6, x, 2.4, z, 0, bg, fg); box(4.9, 2.9, 0.15, '#2f3a4a', x, 2.4, z + 0.09); box(0.2, 1.1, 0.2, '#2f3a4a', x - 1.8, 0.55, z + 0.09); box(0.2, 1.1, 0.2, '#2f3a4a', x + 1.8, 0.55, z + 0.09); solid(x - 2.5, x + 2.5, z - 0.3, z + 0.4); }
      board(c.signs.board[st.time], 12, 17, crisis ? '#3b0d0d' : '#0f2f1c', crisis ? '#fecaca' : '#bbf7d0');
      board([c.signs.news[st.time]], -13, 15, '#f5f0dc', '#111827');
      [[-20, -20], [20, -20], [-20, 20], [20, 20], [0, -27], [-10, 0], [10, 0]].forEach(function (p) {
        cyl(0.14, 0.2, 4.2, '#2f3a4a', p[0], 2.1, p[1], 8);
        var bulb = ball(0.5, null, p[0], 4.4, p[1]), bm = new B.StandardMaterial('bm', scene); bm.emissiveColor = B.Color3.FromHexString(crisis ? '#b9b39a' : '#fff3c4'); bm.disableLighting = true; bulb.material = bm;
        solid(p[0] - 0.2, p[0] + 0.2, p[1] - 0.2, p[1] + 0.2);
      });
      [[-9, -26.5, '#1f2937'], [7, -26.5, '#4b1d1d']].forEach(function (p) {
        box(3.8, 0.8, 1.7, p[2], p[0], 0.85, p[1]); box(1.9, 0.75, 1.5, p[2], p[0] - 0.3, 1.6, p[1]);
        [[-1.2, 0.85], [1.2, 0.85], [-1.2, -0.85], [1.2, -0.85]].forEach(function (w) { cyl(0.75, 0.75, 0.2, '#111', p[0] + w[0], 0.38, p[1] + w[1], 12).rotation.x = Math.PI / 2; });
        solid(p[0] - 2, p[0] + 2, p[1] - 1, p[1] + 1);
      });

      /* crowd: simple instanced figures */
      var bases = COATS.map(function (hex) { var b = cyl(0.42, 0.6, 1.3, hex, 0, -50, 0, 8); b.isVisible = false; return b; });
      var headBase = ball(0.32, '#e2b89a', 0, -50, 0); headBase.isVisible = false;
      var hatBase = cyl(0.36, 0.38, 0.13, '#27272a', 0, -50, 0, 10); hatBase.isVisible = false;
      function person(x, z, sit) {
        var b = bases[Math.floor(rnd() * bases.length)].createInstance('p'); b.position.set(x, sit ? 0.35 : 0.65, z); b.isPickable = false;
        var hd = headBase.createInstance('ph'); hd.parent = b; hd.position.y = 0.82; hd.isPickable = false;
        if (rnd() < 0.8) { var ht = hatBase.createInstance('pt'); ht.parent = b; ht.position.y = 1.0; ht.isPickable = false; }
        return b;
      }
      var cr = CROWD[c.id][st.time];
      for (var n1 = 0; n1 < (cr.walk || 0); n1++) {
        var wx = -22 + rnd() * 40, wz = -24 + rnd() * 40, wn = person(wx, wz);
        movers.push({ n: wn, x: wx, z: wz, mode: 'walk', ph: rnd() * 6.3, ax: rnd() < 0.5, sp: 0.25 + rnd() * 0.3 });
      }
      if (cr.mob) {
        for (var n2 = 0; n2 < cr.mob.n; n2++) {
          var ang = rnd() * 6.3, rad = Math.sqrt(rnd()) * cr.mob.spread, side = cr.mob.at[0] < -15,   // a crowd at the bank stands along its front
            mx = cr.mob.at[0] + Math.cos(ang) * rad * (side ? 0.7 : 1.5), mz = cr.mob.at[1] + Math.sin(ang) * rad * (side ? 1.5 : 0.7);
          movers.push({ n: person(mx, mz), x: mx, z: mz, mode: cr.mob.panic ? 'panic' : 'still', ph: rnd() * 6.3 });
        }
      }
      if (cr.queue) {
        for (var n3 = 0; n3 < cr.queue.n; n3++) { person(15 - n3 * 1.05, -9 + (rnd() - 0.5) * 0.3); }
        sign([cr.queue.sign], 4.2, 0.9, 17.4, 2.6, -9, 0, '#f5f0dc', '#111827'); box(0.18, 2.2, 0.18, '#2f3a4a', 17.4, 1.1, -8.9); solid(17.2, 17.6, -9.2, -8.7);
      }
      for (var n4 = 0; n4 < (cr.cafe || 0); n4++) { var tb = [[-18, -9], [-15.5, -8], [-13, -9], [-11, -7]][n4 % 4]; person(tb[0] + (n4 < 4 ? 0.8 : -0.8), tb[1] + (n4 < 4 ? 0.2 : -0.3), true); }
      if (cr.paper && !reduce) {
        var pb = B.MeshBuilder.CreatePlane('paper', { width: 0.22, height: 0.3 }, scene), pm = new B.StandardMaterial('ppm', scene);
        pm.emissiveColor = new B.Color3(0.95, 0.95, 0.9); pm.disableLighting = true; pm.backFaceCulling = false; pb.material = pm; pb.isVisible = false; pb.isPickable = false;
        for (var n5 = 0; n5 < 90; n5++) { var pi = pb.createInstance('pp'); pi.position.set(-14 + rnd() * 28, rnd() * 14, 10 + rnd() * 16); pi.isPickable = false; papers.push({ n: pi, sp: 0.8 + rnd() * 1.2, ph: rnd() * 6.3 }); }
      }

      /* the people you can talk to */
      function figure(npc, x, z, sit) {
        var rootN = new B.TransformNode('npc', scene); rootN.position.set(x, sit ? -0.42 : 0, z);
        function part(m) { m.parent = rootN; m.isPickable = true; m.metadata = { npc: npc }; return m; }
        part(box(0.17, 0.82, 0.2, '#1f2937', -0.11, 0.41, 0)); part(box(0.17, 0.82, 0.2, '#1f2937', 0.11, 0.41, 0));
        part(cyl(0.46, 0.64, 0.9, npc.coat, 0, 1.22, 0, 12));
        var a1 = part(cyl(0.13, 0.13, 0.75, npc.coat, -0.33, 1.25, 0, 8)); a1.rotation.z = -0.18; var a2 = part(cyl(0.13, 0.13, 0.75, npc.coat, 0.33, 1.25, 0, 8)); a2.rotation.z = 0.18;
        part(ball(0.36, '#e2b89a', 0, 1.86, 0)); part(ball(0.05, '#111', -0.07, 1.9, -0.17)); part(ball(0.05, '#111', 0.07, 1.9, -0.17));
        if (npc.hat === 'top') { part(cyl(0.3, 0.3, 0.3, '#111827', 0, 2.17, 0)); part(cyl(0.48, 0.48, 0.03, '#111827', 0, 2.03, 0)); }
        else if (npc.hat === 'cap') { part(cyl(0.36, 0.38, 0.1, '#3f3f46', 0, 2.05, 0)); part(box(0.24, 0.03, 0.16, '#3f3f46', 0, 2.01, -0.22)); }
        else if (npc.hat === 'cloche') { part(cyl(0.3, 0.4, 0.2, '#7f1d1d', 0, 2.05, 0)); }
        else { part(cyl(0.3, 0.37, 0.09, '#3b2f2f', 0, 2.03, 0)); }
        var ring = B.MeshBuilder.CreateDisc('ring', { radius: 0.95, tessellation: 28 }, scene), rm = new B.StandardMaterial('rm', scene);
        rm.disableLighting = true; rm.alpha = 0.55; ring.material = rm; ring.rotation.x = Math.PI / 2; ring.position.set(x, sit ? 0.14 : 0.04, z); ring.isPickable = false;
        var tag = B.MeshBuilder.CreatePlane('tag', { width: sit ? 2.3 : 2.8, height: sit ? 0.5 : 0.62 }, scene), tm = new B.StandardMaterial('tm', scene);
        tm.disableLighting = true; tag.material = tm; tag.billboardMode = B.Mesh.BILLBOARDMODE_ALL; tag.position.set(x, sit ? 2.25 : 2.7, z); tag.isPickable = true; tag.metadata = { npc: npc };
        var T = { npc: npc, node: rootN, x: x, z: z, ring: rm, tag: tm, sit: sit, textTex: textTex };
        talkers.push(T);
        if (!sit) { solid(x - 0.35, x + 0.35, z - 0.35, z + 0.35); }
        return T;
      }
      here().forEach(function (npc) {
        if (npc.seat !== undefined) { var f = figure(npc, 26.7, npc.seat === 0 ? 1.45 : -1.45, true); f.node.rotation.y = Math.PI / 2; }
        else { figure(npc, npc.pos[0], -npc.pos[1], false); }
      });
      markTalkers();
      pos.x = START.x; pos.z = START.z; yaw = START.yaw; pitch = 0; seated = false; promptKey = null;
    }
    function markTalkers() {
      talkers.forEach(function (T) {
        var met = !!st.met[T.npc.id];
        T.ring.emissiveColor = B.Color3.FromHexString(met ? '#166534' : '#1d4ed8');
        if (T.tag.emissiveTexture) { T.tag.emissiveTexture.dispose(); }
        T.tag.emissiveTexture = T.textTex([(met ? '✓ ' : '💬 ') + T.npc.name], 512, 112, met ? '#166534' : '#1d4ed8', '#ffffff');
      });
    }

    /* ---------- moving around ---------- */
    function teleport(what) {
      if (!what) { return; }
      seated = false; pitch = 0;
      if (what === 'start') { pos.x = START.x; pos.z = START.z; yaw = 0; }
      else if (what === 'landmark') { pos.x = 0; pos.z = 12; yaw = 0; }
      else if (what === 'bank') { pos.x = -11; pos.z = 3; yaw = -Math.PI / 2; }
      else if (what === 'table') { pos.x = 18; pos.z = 0; yaw = Math.PI / 2; }
      else {
        var T = talkers.filter(function (x) { return 'npc:' + x.npc.id === what; })[0];
        if (T && T.sit) { pos.x = 18; pos.z = 0; yaw = Math.PI / 2; } else if (T) { pos.x = T.x; pos.z = T.z - 2.4; yaw = 0; }
      }
      promptKey = null;
    }
    function nearest() {
      var best = null, bd = 3.3;
      talkers.forEach(function (T) { if (T.sit) { return; } var d = Math.hypot(T.x - pos.x, T.z - pos.z); if (d < bd) { bd = d; best = T; } });
      return best;
    }
    function nearSeat() { return st.time === 'b' && !seated && Math.hypot(21.5 - pos.x, 0 - pos.z) < 3.2; }
    function sit() { seated = true; pos.x = SEAT.x; pos.z = SEAT.z; yaw = SEAT.yaw; pitch = 0.05; promptKey = null; }
    function stand() { seated = false; pos.x = 20.5; pos.z = 0; yaw = -Math.PI / 2; promptKey = null; }
    function paintPrompts() {
      var near = nearest(), key = dlg ? 'dlg' : (seated ? 'seat' : (near ? near.npc.id : (nearSeat() ? 'sit' : '')));
      if (key === promptKey) { return; }
      promptKey = key; prompts.textContent = '';
      if (dlg) { return; }
      if (seated) {
        talkers.filter(function (T) { return T.sit; }).forEach(function (T) {
          prompts.appendChild(el('button', { type: 'button', class: 'btn primary', on: { click: function () { openDialog(T.npc); } } }, '💬 ' + T.npc.name));
        });
        prompts.appendChild(el('button', { type: 'button', class: 'btn', on: { click: stand } }, u('stand')));
      } else if (near) {
        prompts.appendChild(el('button', { type: 'button', class: 'btn primary', on: { click: function () { openDialog(near.npc); } } }, '💬 ' + u('talkTo') + ' ' + near.npc.name + ' (E)'));
      } else if (key === 'sit') {
        prompts.appendChild(el('button', { type: 'button', class: 'btn primary', on: { click: sit } }, '🪑 ' + u('sit') + ' (E)'));
      }
    }
    function frame() {
      var dt = Math.min(0.05, engine.getDeltaTime() / 1000), time = performance.now() / 1000;
      if (!dlg) {
        var turn = (keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0) + joy.x;
        yaw += turn * 1.9 * dt;
        if (!seated) {
          var f = ((keys.w || keys.ArrowUp) ? 1 : 0) - ((keys.s || keys.ArrowDown) ? 1 : 0) - joy.y, s = (keys.d ? 1 : 0) - (keys.a ? 1 : 0);
          pos.x += (Math.sin(yaw) * f + Math.cos(yaw) * s) * 4.6 * dt;
          pos.z += (Math.cos(yaw) * f - Math.sin(yaw) * s) * 4.6 * dt;
          pos.x = Math.max(-28.5, Math.min(28.5, pos.x)); pos.z = Math.max(-28.5, Math.min(28.5, pos.z));
          colliders.forEach(function (c) {   // push the player out of every solid box
            var r = 0.45;
            if (pos.x > c[0] - r && pos.x < c[1] + r && pos.z > c[2] - r && pos.z < c[3] + r) {
              var dl = pos.x - (c[0] - r), dr = (c[1] + r) - pos.x, db = pos.z - (c[2] - r), df = (c[3] + r) - pos.z, m = Math.min(dl, dr, db, df);
              if (m === dl) { pos.x = c[0] - r; } else if (m === dr) { pos.x = c[1] + r; } else if (m === db) { pos.z = c[2] - r; } else { pos.z = c[3] + r; }
            }
          });
        }
      }
      // On an upright phone keep the horizontal view wide, so people left and right stay visible.
      camera.fovMode = engine.getRenderWidth() < engine.getRenderHeight() ? B.Camera.FOVMODE_HORIZONTAL_FIXED : B.Camera.FOVMODE_VERTICAL_FIXED;
      camera.position.set(pos.x, seated ? 1.3 : 1.65, pos.z); camera.rotation.set(pitch, yaw, 0);
      talkers.forEach(function (T) {
        if (!T.sit && Math.hypot(T.x - pos.x, T.z - pos.z) < 9) { T.node.rotation.y = Math.atan2(-(pos.x - T.x), -(pos.z - T.z)); }
      });
      if (!reduce) {
        movers.forEach(function (m) {
          if (m.mode === 'walk') { var off = Math.sin(time * m.sp + m.ph) * 5; m.n.position.x = m.x + (m.ax ? off : 0); m.n.position.z = m.z + (m.ax ? 0 : off); }
          else if (m.mode === 'panic') { m.n.position.x = m.x + Math.sin(time * 3 + m.ph) * 0.18; m.n.position.z = m.z + Math.cos(time * 2.3 + m.ph) * 0.18; m.n.rotation.y = Math.sin(time * 2 + m.ph) * 0.6; }
        });
        papers.forEach(function (p) { p.n.position.y -= p.sp * dt; p.n.rotation.x += dt * 2; p.n.rotation.y += dt * 1.3; p.n.position.x += Math.sin(time + p.ph) * dt * 0.6; if (p.n.position.y < 0) { p.n.position.y = 14; } });
      }
      paintPrompts();
      scene.render();
    }

    /* ---------- input ---------- */
    function act() { var n = nearest(); if (dlg) { return; } if (seated) { return; } if (n) { openDialog(n.npc); } else if (nearSeat()) { sit(); } }
    function onKeyDown(ev) {
      var k = ev.key.length === 1 ? ev.key.toLowerCase() : ev.key;
      if (ev.target !== stage) { return; }
      if (['w', 'a', 's', 'd', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(k) >= 0) { keys[k] = true; ev.preventDefault(); }
      else if (k === 'e' || k === 'Enter') { ev.preventDefault(); act(); }
    }
    function onKeyUp(ev) { var k = ev.key.length === 1 ? ev.key.toLowerCase() : ev.key; keys[k] = false; }
    stage.addEventListener('keydown', onKeyDown); stage.addEventListener('keyup', onKeyUp);
    stage.addEventListener('blur', function () { keys = {}; });
    main.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && dlg) { closeDialog(); } });
    var drag = null;
    canvas.addEventListener('pointerdown', function (ev) { drag = { x: ev.clientX, y: ev.clientY, sx: ev.clientX, sy: ev.clientY }; canvas.setPointerCapture(ev.pointerId); stage.focus({ preventScroll: true }); });
    canvas.addEventListener('pointermove', function (ev) {
      if (!drag) { return; }
      yaw += (ev.clientX - drag.x) * 0.005; pitch = Math.max(-0.6, Math.min(0.6, pitch + (ev.clientY - drag.y) * 0.004));
      drag.x = ev.clientX; drag.y = ev.clientY;
    });
    canvas.addEventListener('pointerup', function (ev) {
      if (drag && Math.hypot(ev.clientX - drag.sx, ev.clientY - drag.sy) < 8 && scene && !dlg) {
        var r = canvas.getBoundingClientRect();
        var hit = scene.pick(ev.clientX - r.left, ev.clientY - r.top, function (m) { return m.isPickable && m.metadata && m.metadata.npc; });
        if (hit && hit.hit && hit.distance < 14) { openDialog(hit.pickedMesh.metadata.npc); }
      }
      drag = null;
    });
    canvas.addEventListener('pointercancel', function () { drag = null; });
    var sdrag = false;
    function stickMove(ev) {
      var r = stick.getBoundingClientRect(), x = (ev.clientX - r.left - r.width / 2) / (r.width / 2), y = (ev.clientY - r.top - r.height / 2) / (r.height / 2), len = Math.hypot(x, y);
      if (len > 1) { x /= len; y /= len; }
      joy.x = Math.abs(x) < 0.15 ? 0 : x; joy.y = Math.abs(y) < 0.15 ? 0 : y;
      knob.style.transform = 'translate(' + (x * 30) + 'px,' + (y * 30) + 'px)';
    }
    function stickEnd() { sdrag = false; joy.x = joy.y = 0; knob.style.transform = ''; }
    stick.addEventListener('pointerdown', function (ev) { sdrag = true; stick.setPointerCapture(ev.pointerId); stickMove(ev); ev.preventDefault(); });
    stick.addEventListener('pointermove', function (ev) { if (sdrag) { stickMove(ev); } });
    stick.addEventListener('pointerup', stickEnd); stick.addEventListener('pointercancel', stickEnd);

    function travel() { closeDialog(); paintBar(); if (has3d) { build(); } }

    /* ---------- start ---------- */
    try { engine = new B.Engine(canvas, true, { stencil: false, preserveDrawingBuffer: false }); engine.setHardwareScalingLevel(1 / Math.min(root.devicePixelRatio || 1, 2)); }
    catch (e) { has3d = false; listChk.checked = true; listChk.disabled = true; }
    var ro = null;
    paintBar();
    if (has3d) { build(); ro = new ResizeObserver(function () { engine.resize(); }); ro.observe(stage); }
    layout();

    return {
      has3d: has3d,
      debug: function () { return { x: pos.x, z: pos.z, yaw: yaw, seated: seated, talkers: talkers.length, meshes: scene ? scene.meshes.length : 0, fps: engine ? engine.getFps() : 0 }; },
      dispose: function () {
        if (root.speechSynthesis) { root.speechSynthesis.cancel(); }
        if (ro) { ro.disconnect(); }
        if (engine) { engine.stopRenderLoop(); if (scene) { scene.dispose(); } engine.dispose(); }
      }
    };
  }

  root.World = { create: create, cityDone: cityDone };
})(window);
