/*
  KI-assistiert erstellt unter Verwendung des "learning-artifacts-builder (lab-o5)"-Skills, angepasst als Vibe-Coding-Lab-Skill
  Lizenz: CC BY-SA 4.0 (Dominik Kluge), https://creativecommons.org/licenses/by-sa/4.0/
  Sie dürfen: Teilen, Bearbeiten
  Bedingungen: Namensnennung, Weitergabe unter gleichen Bedingungen
*/
/*
  app.js – the user interface: pages, language switch, tasks with stepped hints,
  decisions, simulator controls, saving and export.
*/
(function () {
  'use strict';
  var C = window.Content, M = window.CrisisModel, Charts = window.Charts;
  var KEY = 'crisis1929-v1';
  // Display order of the decision options (so the historical choice is not always first).
  var ORDER = { d1: [1, 0, 2], d2: [0, 2, 1], d3: [2, 0, 1], d4: [1, 0, 2], d5: [1, 0], d6: [0, 1] };

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function fresh() {
    return { lang: 'de', page: 0, quiz: {}, rec: {}, notes: {}, dec: {}, policy: clone(M.HISTORICAL_POLICY),
      mis: {}, spiral: -1, spiralSeen: [], lab: { m: 100, g: 100 }, year: 0, q: 17, name: '', trans: {} };
  }
  var S = fresh();
  try {
    var raw = window.localStorage.getItem(KEY);
    if (raw) { var saved = JSON.parse(raw); Object.keys(S).forEach(function (k) { if (saved[k] !== undefined) { S[k] = saved[k]; } }); }
  } catch (e) { /* private mode: work without saving */ }
  function save() { try { window.localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } }

  function t(o) { return typeof o === 'string' ? o : (o[S.lang] !== undefined ? o[S.lang] : o.de); }
  function ui(k) { return t(C.ui[k]); }
  function num(v, digits) {
    return Number(v).toLocaleString(S.lang === 'de' ? 'de-DE' : 'en-GB', { minimumFractionDigits: digits || 0, maximumFractionDigits: digits || 0 });
  }

  // Build DOM nodes safely: text always goes in as text, never as HTML.
  function h(tag, attrs) {
    var el = document.createElement(tag), k, v, i, kid;
    for (k in (attrs || {})) {
      v = attrs[k];
      if (v === null || v === undefined || v === false) { continue; }
      if (k === 'on') { for (i in v) { el.addEventListener(i, v[i]); } }
      else if (k === 'value' || k === 'checked' || k === 'hidden' || k === 'disabled') { el[k] = v; }
      else { el.setAttribute(k, v === true ? '' : v); }
    }
    for (i = 2; i < arguments.length; i++) {
      kid = arguments[i];
      (Array.isArray(kid) ? kid : [kid]).forEach(function (c) {
        if (c === null || c === undefined || c === false) { return; }
        el.appendChild(c.nodeType ? c : document.createTextNode(String(c)));
      });
    }
    return el;
  }
  function $(id) { return document.getElementById(id); }

  var ALL_QUIZ = C.money.quiz.concat(C.sources.map(function (s) { return s.quiz; }));
  var PAGE_QUIZ = { money: C.money.quiz.map(function (q) { return q.id; }), sources: C.sources.map(function (s) { return s.quiz.id; }) };
  var globe = null;

  /* ---------- progress ---------- */
  function quizDone(id) { return !!S.rec[id]; }
  function countDone() {
    return ALL_QUIZ.filter(function (q) { return quizDone(q.id); }).length +
      C.decisions.filter(function (d) { return S.dec[d.id] !== undefined; }).length;
  }
  function total() { return ALL_QUIZ.length + C.decisions.length; }
  function updateProgress() {
    var n = countDone(), bar = $('bar');
    bar.setAttribute('aria-valuenow', n); bar.setAttribute('aria-valuemax', total());
    bar.setAttribute('aria-label', ui('progress'));
    $('barfill').style.width = (100 * n / total()) + '%';
    $('bartext').textContent = n + ' / ' + total() + ' ' + ui('tasksDone');
  }

  /* ---------- quiz with stepped hints ---------- */
  function quizBlock(q) {
    var box = h('div', { class: 'quiz' });
    function draw(focusFeedback) {
      var st = S.quiz[q.id] || (S.quiz[q.id] = { tries: 0, wrong: [], done: false, shown: false, pick: null });
      box.textContent = '';
      var okIndex = q.o.findIndex(function (o) { return o.ok; });
      var fb = h('div', { class: 'fb', role: 'status' });
      var opts = h('div', { class: 'opts' }, q.o.map(function (o, i) {
        var wasWrong = st.wrong.indexOf(i) >= 0, isOk = st.done && i === okIndex;
        return h('button', {
          type: 'button', class: 'opt' + (wasWrong ? ' is-wrong' : '') + (isOk ? ' is-ok' : ''),
          'aria-disabled': (st.done || wasWrong) ? 'true' : null,
          on: { click: function () { answer(i); } }
        }, (isOk ? '✓ ' : (wasWrong ? '✗ ' : '')) + t(o));
      }));
      box.appendChild(h('fieldset', {}, h('legend', {}, t(q.q)), opts));
      if (st.done && !st.shown) {
        fb.appendChild(h('p', { class: 'msg ok' }, h('strong', {}, ui('correct') + ' '), t(q.ex)));
      } else if (st.shown) {
        fb.appendChild(h('p', { class: 'msg tip' }, h('strong', {}, ui('solutionShown') + ' '), t(q.o[okIndex]) + ' – ' + t(q.ex)));
      } else if (st.tries > 0) {
        fb.appendChild(h('p', { class: 'msg bad' }, h('strong', {}, ui('wrong') + ' '), (3 - st.tries) + ' ' + ui('triesLeft') + '.'));
        fb.appendChild(h('p', { class: 'msg tip' }, h('strong', {}, ui('tip') + ': '), t(st.tries === 1 ? q.h1 : q.h2)));
      }
      box.appendChild(fb);
      if (focusFeedback) { fb.setAttribute('tabindex', '-1'); }
    }
    function answer(i) {
      var st = S.quiz[q.id];
      if (st.done || st.wrong.indexOf(i) >= 0) { return; }
      if (st.pick === null) { st.pick = i; }
      if (q.o[i].ok) { st.done = true; }
      else {
        st.tries++; st.wrong.push(i);
        if (st.tries >= 3) { st.done = true; st.shown = true; }
      }
      // Record the result once; a later reset of the page does not change it.
      if (st.done && !S.rec[q.id]) { S.rec[q.id] = { first: st.pick, tries: st.tries, shown: st.shown }; }
      save(); draw(true); updateProgress();
    }
    draw(false);
    return box;
  }

  function notes(id, label, rows) {
    var ta = h('textarea', { id: 'note-' + id, rows: rows || 3, value: S.notes[id] || '',
      on: { input: function () { S.notes[id] = ta.value; save(); } } });
    return h('div', { class: 'notes' }, h('label', { for: 'note-' + id }, label), ta);
  }

  function resetButton(fn) {
    return h('p', { class: 'reset' }, h('button', { type: 'button', class: 'btn ghost', on: { click: fn } }, '↺ ' + ui('resetPage')));
  }

  /* ---------- page 1: the world ---------- */
  function pageStart() {
    var D = C.start;
    var host = h('div', { class: 'globe' });
    var ev = h('p', { class: 'event', role: 'status' });
    var tbody = h('tbody');
    var out = h('output', { for: 'year' });
    function paint() {
      out.textContent = D.years[S.year];
      ev.textContent = t(D.events[S.year]);
      tbody.textContent = '';
      D.countries.forEach(function (k, i) {
        var v = k.v[S.year], diff = v - 100;
        tbody.appendChild(h('tr', {},
          h('th', { scope: 'row' }, h('button', { type: 'button', class: 'link', on: { click: function () { globe.focus(i); } } }, t(k))),
          h('td', {}, String(v)),
          h('td', { class: diff < 0 ? 'down' : (diff > 0 ? 'up' : '') }, diff === 0 ? '±0 %' : (diff > 0 ? '▲ +' : '▼ −') + (diff === 0 ? '' : Math.abs(diff) + ' %'))));
      });
      if (globe) { globe.setYear(S.year); }
    }
    var slider = h('input', { type: 'range', id: 'year', min: 0, max: 4, step: 1, value: S.year,
      on: { input: function () { S.year = +slider.value; save(); paint(); } } });
    var page = h('div', {},
      h('p', { class: 'lead' }, t(D.intro)),
      h('section', { class: 'card' }, h('h3', {}, t(D.goalsTitle)), h('ul', {}, D.goals.map(function (g) { return h('li', {}, t(g)); }))),
      h('section', { class: 'card' },
        h('h3', {}, t(D.globeTitle)), h('p', {}, t(D.globeHelp)),
        h('div', { class: 'slider' }, h('label', { for: 'year' }, t(D.year) + ': '), out, slider,
          h('div', { class: 'ticks', 'aria-hidden': 'true' }, D.years.map(function (y) { return h('span', {}, String(y)); }))),
        h('div', { class: 'two' }, host,
          h('div', {}, ev,
            h('table', { class: 'data' },
              h('thead', {}, h('tr', {}, h('th', { scope: 'col' }, t(D.country)), h('th', { scope: 'col' }, t(D.index)), h('th', { scope: 'col' }, '1929 →'))),
              tbody),
            h('p', { class: 'small' }, t(D.dataNote)))),
        notes('start', t(D.think), 3)));
    globe = window.Globe.create(host, D.countries, t(D.globeAlt));
    paint();
    return page;
  }

  /* ---------- page 2: money and prices ---------- */
  function pageMoney() {
    var D = C.money;
    var labHost = h('div', { class: 'chart' }), stateBox = h('p', { class: 'msg', role: 'status' });
    var mOut = h('output', { for: 'lab-m' }), gOut = h('output', { for: 'lab-g' });
    var mIn = h('input', { type: 'range', id: 'lab-m', min: 20, max: 400, step: 10, value: S.lab.m, on: { input: function () { S.lab.m = +mIn.value; save(); paintLab(); } } });
    var gIn = h('input', { type: 'range', id: 'lab-g', min: 50, max: 150, step: 10, value: S.lab.g, on: { input: function () { S.lab.g = +gIn.value; save(); paintLab(); } } });
    function paintLab() {
      var p = S.lab.m / S.lab.g;
      mIn.value = S.lab.m; gIn.value = S.lab.g; mOut.textContent = S.lab.m; gOut.textContent = S.lab.g;
      Charts.lab(labHost, { m: S.lab.m, g: S.lab.g, alt: t(D.labAlt), coin: t(D.coin), bread: t(D.bread),
        priceLabel: t(D.breadPrice), price: num(p, 2), unit: S.lang === 'de' ? 'Mark' : 'marks' });
      stateBox.className = 'msg ' + (p > 1.05 ? 'bad' : (p < 0.95 ? 'tip' : 'ok'));
      stateBox.textContent = t(p > 1.05 ? D.stateInfl : (p < 0.95 ? D.stateDefl : D.stateStable));
    }
    var breadHost = h('div', { class: 'chart' });
    function short(v) {
      if (v >= 1e9) { return num(v / 1e9, v < 1e10 ? 1 : 0) + (S.lang === 'de' ? ' Mrd.' : ' bn'); }
      if (v >= 1e6) { return num(v / 1e6, 1) + (S.lang === 'de' ? ' Mio.' : ' m'); }
      return num(v);
    }
    var spHost = h('div', { class: 'chart spiral' }), spText = h('p', { class: 'msg tip', role: 'status' });
    function paintSpiral() {
      Charts.spiral(spHost, { alt: t(D.spiralAlt), items: D.spiral.map(function (x) { return t(x.s); }), active: S.spiral, seen: S.spiralSeen,
        onSelect: function (i) {
          S.spiral = i; if (S.spiralSeen.indexOf(i) < 0) { S.spiralSeen.push(i); } save(); paintSpiral();
          var g = spHost.querySelectorAll('g.hot')[i]; if (g) { g.focus(); }
        } });
      spText.textContent = S.spiral < 0 ? t(D.spiralHelp) : (S.spiral + 1) + '. ' + t(D.spiral[S.spiral].s) + ': ' + t(D.spiral[S.spiral].t);
    }
    var page = h('div', {},
      h('p', { class: 'lead' }, t(D.intro)),
      h('section', { class: 'card' },
        h('h3', {}, t(D.labTitle)), h('p', {}, t(D.labRule)),
        h('div', { class: 'btnrow' }, D.presets.map(function (p) {
          return h('button', { type: 'button', class: 'btn', on: { click: function () { S.lab = { m: p.m, g: p.g }; save(); paintLab(); } } }, t(p));
        })),
        h('div', { class: 'two' }, labHost,
          h('div', {},
            h('div', { class: 'slider' }, h('label', { for: 'lab-m' }, t(D.moneySl) + ': '), mOut, mIn),
            h('div', { class: 'slider' }, h('label', { for: 'lab-g' }, t(D.goodsSl) + ': '), gOut, gIn),
            stateBox))),
      h('section', { class: 'card' },
        h('h3', {}, t(D.breadTitle)), h('p', {}, t(D.breadNote)),
        h('div', { class: 'two' }, breadHost,
          h('table', { class: 'data' },
            h('thead', {}, h('tr', {}, h('th', { scope: 'col' }, t(D.month)), h('th', { scope: 'col' }, t(D.priceMark)))),
            h('tbody', {}, D.breadData.map(function (d) { return h('tr', {}, h('th', { scope: 'row' }, t(d)), h('td', {}, num(d.v))); }))))),
      h('section', { class: 'card' },
        h('h3', {}, t(D.spiralTitle)),
        h('div', { class: 'two' }, spHost, h('div', {}, spText))),
      h('section', { class: 'card' },
        h('h3', {}, t(D.quizTitle)), D.quiz.map(quizBlock)),
      resetButton(function () {
        PAGE_QUIZ.money.forEach(function (id) { delete S.quiz[id]; });
        S.lab = { m: 100, g: 100 }; S.spiral = -1; S.spiralSeen = []; save(); render(true);
      }));
    paintLab(); paintSpiral();
    Charts.bread(breadHost, { alt: t(D.breadAlt), data: D.breadData.map(function (d) { return { v: d.v, label: t(d).replace(' 1923', ''), short: short(d.v) }; }) });
    return page;
  }

  /* ---------- page 3: sources ---------- */
  function sourceCard(s, n) {
    var other = s.lang === 'en' ? 'de' : 'en';
    var open = !!S.trans[s.id];
    var trans = h('blockquote', { class: 'trans', lang: other, id: 'tr-' + s.id, hidden: !open },
      h('span', { class: 'tag' }, ui('translation')), h('p', {}, s.trans));
    var btn = h('button', { type: 'button', class: 'btn ghost', 'aria-expanded': open ? 'true' : 'false', 'aria-controls': 'tr-' + s.id,
      on: { click: function () {
        S.trans[s.id] = !S.trans[s.id]; save();
        trans.hidden = !S.trans[s.id];
        btn.setAttribute('aria-expanded', S.trans[s.id] ? 'true' : 'false');
        btn.textContent = ui(S.trans[s.id] ? 'hideTranslation' : 'showTranslation');
      } } }, ui(open ? 'hideTranslation' : 'showTranslation'));
    var table = s.table ? h('table', { class: 'data' },
      h('thead', {}, h('tr', {}, t(s.head).map(function (x) { return h('th', { scope: 'col' }, x); }))),
      h('tbody', {}, s.rows.map(function (r) {
        return h('tr', {}, h('th', { scope: 'row' }, r[0]), h('td', {}, S.lang === 'en' ? r[1].replace(',', '.') : r[1]),
          h('td', {}, S.lang === 'en' ? r[2].replace(/(\d),(\d)/g, '$1.$2').replace(/ %/g, '%').replace('Mai', 'May').replace('Juli', 'July').replace('März, nicht mehr frei', 'March, no longer free') : r[2]));
      }))) : null;
    return h('article', { class: 'card source' },
      h('header', {},
        h('h3', {}, (S.lang === 'de' ? 'Quelle ' : 'Source ') + n + ': ' + t(s.title)),
        h('span', { class: 'badge' }, ui('perspective') + ': ' + t(s.persp))),
      h('p', { class: 'meta' }, h('strong', {}, t(s.who)), h('br'), t(s.when)),
      h('blockquote', { class: 'orig', lang: s.lang }, h('span', { class: 'tag' }, ui('original') + ' (' + s.lang.toUpperCase() + ')'), h('p', {}, s.original)),
      table, btn, trans,
      h('details', {}, h('summary', {}, ui('wordHelp')),
        h('ul', { class: 'words' }, s.words.map(function (w) { return h('li', {}, h('strong', { lang: s.lang }, w[0]), ' = ', h('span', { lang: other }, w[1])); }))),
      h('p', {}, h('strong', {}, ui('context') + ': '), t(s.ctx)),
      h('p', { class: 'small' }, h('strong', {}, ui('citation') + ': '), s.cite),
      quizBlock(s.quiz),
      notes(s.id, ui('yourNotes') + ' – ' + t(C.sourcesMethod[2]), 3));
  }
  function pageSources() {
    return h('div', {},
      h('p', { class: 'lead' }, t(C.sourcesIntro)),
      h('section', { class: 'card method' }, h('ul', {}, C.sourcesMethod.map(function (m) { return h('li', {}, t(m)); })),
        h('p', { class: 'small' }, t(C.noteStarter))),
      C.sources.map(function (s, i) { return sourceCard(s, i + 1); }),
      resetButton(function () { PAGE_QUIZ.sources.forEach(function (id) { delete S.quiz[id]; }); save(); render(true); }));
  }

  /* ---------- page 4: decisions ---------- */
  function minePolicy() {
    var p = clone(M.HISTORICAL_POLICY);
    C.decisions.forEach(function (d) {
      var set = S.dec[d.id] !== undefined && d.o[S.dec[d.id]].set;
      if (set) { Object.keys(set).forEach(function (k) { p[k] = set[k]; }); }
    });
    return p;
  }
  function allDecided() { return C.decisions.every(function (d) { return S.dec[d.id] !== undefined; }); }
  function decisionCard(d, n) {
    var box = h('article', { class: 'card decision' });
    function draw(focus) {
      var pick = S.dec[d.id];
      box.textContent = '';
      box.appendChild(h('h3', {}, n + '. ' + t(d.when) + ' – ' + ui('youAre') + ': ' + t(d.role)));
      box.appendChild(h('p', {}, h('strong', {}, ui('situation') + ': '), t(d.sit)));
      box.appendChild(h('div', { class: 'opts', role: 'group', 'aria-label': ui('yourChoice') }, ORDER[d.id].map(function (i) {
        var chosen = pick === i, isHist = pick !== undefined && i === d.hist;
        return h('button', { type: 'button', class: 'opt' + (chosen ? ' is-pick' : ''), 'aria-pressed': chosen ? 'true' : 'false',
          'aria-disabled': pick !== undefined ? 'true' : null,
          on: { click: function () { if (S.dec[d.id] === undefined) { S.dec[d.id] = i; save(); draw(true); updateProgress(); paintGo(); } } } },
          (chosen ? '➤ ' : '') + t(d.o[i].t), isHist ? h('span', { class: 'badge hist' }, ui('historical')) : null);
      })));
      if (pick !== undefined) {
        var res = h('div', { class: 'msg info', role: 'status', tabindex: '-1' },
          h('p', {}, h('strong', {}, ui('history') + ': '), t(d.real)),
          d.note ? h('p', { class: 'small' }, t(d.note)) : null,
          h('button', { type: 'button', class: 'btn ghost', on: { click: function () { delete S.dec[d.id]; save(); draw(false); updateProgress(); paintGo(); } } }, '↺ ' + ui('decideAgain')));
        box.appendChild(res);
        if (focus) { res.focus(); }
      }
    }
    draw(false);
    return box;
  }
  var paintGo = function () {};
  function pageDecide() {
    var go = h('button', { type: 'button', class: 'btn primary', on: { click: function () {
      if (!allDecided()) { return; }
      S.policy = minePolicy(); S.q = 17; save(); goPage(4);
    } } }, ui('toSim') + ' →');
    var hint = h('p', { class: 'small', role: 'status' });
    paintGo = function () {
      go.setAttribute('aria-disabled', allDecided() ? 'false' : 'true');
      hint.textContent = allDecided() ? '' : ui('presetMineMissing');
    };
    paintGo();
    return h('div', {},
      h('p', { class: 'lead' }, t(C.decideIntro)),
      C.decisions.map(function (d, i) { return decisionCard(d, i + 1); }),
      h('div', { class: 'card' }, go, hint));
  }

  /* ---------- page 5: simulator ---------- */
  function pageSim() {
    var D = C.sim, keys = Object.keys(D.charts);
    var hosts = {}, lastVals = {};
    var grid = h('div', { class: 'grid' }, keys.map(function (k) {
      hosts[k] = h('div', { class: 'chart' });
      lastVals[k] = h('p', { class: 'small' });
      return h('figure', { class: 'mini' }, h('figcaption', {}, t(D.charts[k])), hosts[k], lastVals[k]);
    }));
    var qOut = h('output', { for: 'sim-q' }), misList = h('ul', { class: 'missions' }), sum = h('p', { class: 'msg info', role: 'status' });
    var timer = 0;
    var inputs = {};
    function paint() {
      var r = M.simulate(S.policy), H = M.HISTORY;
      keys.forEach(function (k) {
        Charts.simChart(hosts[k], { key: k, sim: r[k], hist: H[k], q: S.q, alt: t(D.charts[k]) + ' – ' + t(D.chartAlt) });
        lastVals[k].textContent = M.QUARTERS[S.q] + ': ' + ui('model') + ' ' + Math.round(r[k][S.q]) + D.charts[k].u + ' · ' + ui('historical') + ' ' + H[k][S.q] + D.charts[k].u;
      });
      qOut.textContent = M.QUARTERS[S.q];
      qIn.value = S.q;
      sum.textContent = t(D.summary) + ': ' + keys.map(function (k) { return t(D.charts[k]) + ' ' + Math.round(r[k][17]) + D.charts[k].u + ' (' + ui('historical') + ' ' + H[k][17] + D.charts[k].u + ')'; }).join(' · ');
      // Missions are checked automatically.
      var maxU = Math.max.apply(null, r.unemployment);
      var changed = Object.keys(M.HISTORICAL_POLICY).filter(function (k) { return S.policy[k] !== M.HISTORICAL_POLICY[k]; }).length;
      if (maxU < 15) { S.mis.mis1 = true; }
      if (changed === 1 && r.banks[17] < 10) { S.mis.mis2 = true; }
      misList.textContent = '';
      D.missions.forEach(function (m) {
        misList.appendChild(h('li', { class: S.mis[m.id] ? 'done' : '' }, h('strong', {}, S.mis[m.id] ? '✓ ' + ui('done') + ': ' : '○ ' + ui('open') + ': '), t(m)));
      });
      Object.keys(inputs).forEach(function (k) {
        if (inputs[k].type === 'checkbox') { inputs[k].checked = !!S.policy[k]; } else { inputs[k].value = S.policy[k]; inputs[k].out.textContent = S.policy[k]; }
      });
      save();
    }
    function stop() { window.clearInterval(timer); timer = 0; }
    var qIn = h('input', { type: 'range', id: 'sim-q', min: 0, max: 17, step: 1, value: S.q, on: { input: function () { stop(); S.q = +qIn.value; paint(); } } });
    var playBtn = h('button', { type: 'button', class: 'btn', on: { click: function () {
      stop();
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { S.q = 17; paint(); return; }
      S.q = 0; paint();
      timer = window.setInterval(function () {
        if (!document.body.contains(qIn) || S.q >= 17) { stop(); return; }
        S.q++; paint();
      }, 350);
    } } }, ui('play'));
    function lever(k, min, max, step) {
      var L = D.levers[k], out = h('output', { for: 'lv-' + k });
      var inp = h('input', { type: 'range', id: 'lv-' + k, min: min, max: max, step: step, value: S.policy[k],
        on: { input: function () { S.policy[k] = +inp.value; paint(); } } });
      inp.out = out; inputs[k] = inp;
      return h('div', { class: 'slider' }, h('label', { for: 'lv-' + k }, t(L) + ': '), out, inp,
        h('div', { class: 'ticks', 'aria-hidden': 'true' }, h('span', {}, t(L.lo)), h('span', {}, t(L.hi))));
    }
    function sw(k) {
      var inp = h('input', { type: 'checkbox', id: 'sw-' + k, checked: !!S.policy[k], on: { change: function () { S.policy[k] = inp.checked; paint(); } } });
      inputs[k] = inp;
      return h('label', { class: 'switch', for: 'sw-' + k }, inp, h('span', {}, t(D.switches[k])));
    }
    var mineMsg = h('p', { class: 'small', role: 'status' });
    var page = h('div', {},
      h('p', { class: 'lead' }, t(D.intro)),
      h('p', { class: 'msg tip' }, h('strong', {}, '⚠ '), t(D.warn)),
      h('div', { class: 'simlayout' },
        h('section', { class: 'card controls' },
          h('h3', {}, t(D.controls)),
          h('div', { class: 'btnrow' },
            h('button', { type: 'button', class: 'btn', on: { click: function () { S.policy = clone(M.HISTORICAL_POLICY); mineMsg.textContent = ''; paint(); } } }, ui('presetHistory')),
            h('button', { type: 'button', class: 'btn', on: { click: function () {
              if (!allDecided()) { mineMsg.textContent = ui('presetMineMissing'); return; }
              mineMsg.textContent = ''; S.policy = minePolicy(); paint();
            } } }, ui('presetMine'))),
          mineMsg,
          lever('bankHelp', 0, 100, 5), lever('spending', -50, 50, 5), lever('tariffs', 0, 100, 5),
          sw('insurance'), sw('leaveGold'), sw('newDeal')),
        h('section', { class: 'card' },
          h('div', { class: 'legend' },
            h('span', {}, h('i', { class: 'sw-sim' }), t(D.legendSim)), h('span', {}, h('i', { class: 'sw-hist' }), t(D.legendHist))),
          h('div', { class: 'slider time' }, playBtn, h('label', { for: 'sim-q' }, ui('quarter') + ': '), qOut, qIn),
          grid, h('p', { class: 'small' }, t(D.indexNote)), sum)),
      h('section', { class: 'card' }, h('h3', {}, t(D.missionsTitle)), misList, h('p', { class: 'small' }, t(D.missionHint))),
      h('section', { class: 'card' }, h('details', {}, h('summary', {}, t(D.rulesTitle)),
        h('ol', {}, D.rules.map(function (r) { return h('li', {}, t(r)); })), h('p', { class: 'small' }, t(D.rulesCode)))));
    paint();
    return page;
  }

  /* ---------- page 6: wrap-up and export ---------- */
  function policyText(p) {
    var D = C.sim;
    return ['bankHelp', 'spending', 'tariffs'].map(function (k) { return t(D.levers[k]) + ' ' + p[k]; })
      .concat(['insurance', 'leaveGold', 'newDeal'].map(function (k) { return t(D.switches[k]) + ': ' + ui(p[k] ? 'on' : 'off'); })).join('; ');
  }
  function outcomeText(r) {
    return Object.keys(C.sim.charts).map(function (k) { return t(C.sim.charts[k]) + ' ' + Math.round(r[k][17]) + C.sim.charts[k].u; }).join('; ');
  }
  // One function feeds the on-screen table, the printout and the Markdown file.
  function getExportSections() {
    var W = C.wrap, dash = '–';
    var quizRows = ALL_QUIZ.map(function (q) {
      var rec = S.rec[q.id], ok = q.o.filter(function (o) { return o.ok; })[0];
      return { task: t(q.q), answer: rec ? t(q.o[rec.first]) : dash, solution: t(ok), tries: rec ? String(rec.tries) : dash,
        status: rec ? ui(rec.shown ? 'stRevealed' : 'stSolved') : ui('stOpen') };
    });
    var decRows = C.decisions.map(function (d) {
      var pick = S.dec[d.id];
      return { task: t(d.when) + ', ' + t(d.role) + ': ' + t(d.sit), answer: pick !== undefined ? t(d.o[pick].t) : dash,
        solution: ui('historical') + ': ' + t(d.o[d.hist].t), tries: dash, status: ui(pick !== undefined ? 'stChosen' : 'stOpen') };
    });
    function noteRow(id, task) { var v = (S.notes[id] || '').trim(); return { task: task, answer: v || dash, solution: dash, tries: dash, status: ui(v ? 'stWritten' : 'stOpen') }; }
    var noteRows = [noteRow('start', t(C.start.think))]
      .concat(C.sources.map(function (s, i) { return noteRow(s.id, (S.lang === 'de' ? 'Quelle ' : 'Source ') + (i + 1) + ': ' + t(s.title)); }))
      .concat(W.reflect.map(function (r) { return noteRow(r.id, t(r)); }));
    var simRows = [{ task: t(W.simRow), answer: policyText(S.policy) + ' → ' + outcomeText(M.simulate(S.policy)),
      solution: ui('historical') + ': ' + policyText(M.HISTORICAL_POLICY), tries: dash,
      status: C.sim.missions.map(function (m) { return (S.mis[m.id] ? '✓ ' : '○ ') + t(m); }).join(' | ') }];
    return [{ title: t(W.secQuiz), rows: quizRows }, { title: t(W.secDecide), rows: decRows },
      { title: t(W.secNotes), rows: noteRows }, { title: t(W.secSim), rows: simRows }];
  }
  var COLS = ['task', 'answer', 'solution', 'tries', 'status'];
  function colHead() { return [ui('colTask'), ui('colAnswer'), ui('colSolution'), ui('colTries'), ui('colStatus')]; }
  function resultTables() {
    return getExportSections().map(function (sec) {
      return h('section', {}, h('h4', {}, sec.title),
        h('div', { class: 'scroll' }, h('table', { class: 'data results' },
          h('thead', {}, h('tr', {}, colHead().map(function (c) { return h('th', { scope: 'col' }, c); }))),
          h('tbody', {}, sec.rows.map(function (r) {
            return h('tr', {}, COLS.map(function (c, i) { return h(i === 0 ? 'th' : 'td', i === 0 ? { scope: 'row' } : {}, r[c]); }));
          })))));
    });
  }
  function missing() {
    var out = [];
    ALL_QUIZ.forEach(function (q) { if (!S.rec[q.id]) { out.push(t(q.q)); } });
    C.decisions.forEach(function (d, i) { if (S.dec[d.id] === undefined) { out.push(t(C.pages[3]) + ' ' + (i + 1) + ': ' + t(d.when)); } });
    return out;
  }
  function doPrint() {
    var area = $('print-area'); area.textContent = '';
    area.appendChild(h('h1', {}, ui('appTitle') + ' – ' + t(C.wrap.results)));
    if (S.name.trim()) { area.appendChild(h('p', {}, S.name.trim())); }
    resultTables().forEach(function (n) { area.appendChild(n); });
    window.print();
  }
  function doDownload() {
    function cell(s) { return String(s).replace(/\|/g, '/').replace(/\s*\n\s*/g, ' '); }
    var md = '# ' + ui('appTitle') + ' – ' + t(C.wrap.results) + '\n\n' + (S.name.trim() ? cell(S.name.trim()) + '\n\n' : '');
    getExportSections().forEach(function (sec) {
      md += '## ' + sec.title + '\n\n| ' + colHead().join(' | ') + ' |\n|' + COLS.map(function () { return ' --- |'; }).join('') + '\n';
      sec.rows.forEach(function (r) { md += '| ' + COLS.map(function (c) { return cell(r[c]); }).join(' | ') + ' |\n'; });
      md += '\n';
    });
    try {
      var url = URL.createObjectURL(new Blob([md], { type: 'text/markdown;charset=utf-8' }));
      var a = h('a', { href: url, download: 'weltwirtschaftskrise-1929-ergebnisse.md' });
      document.body.appendChild(a); a.click(); a.remove();
      window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    } catch (e) { window.alert('Download: ' + e.message); }
  }
  function pageWrap() {
    var W = C.wrap, miss = missing(), locked = miss.length > 0;
    var nameIn = h('input', { type: 'text', id: 'name', value: S.name, autocomplete: 'off', on: { input: function () { S.name = nameIn.value; save(); } } });
    function guarded(fn) { return function () { if (missing().length === 0) { fn(); } }; }
    return h('div', {},
      h('p', { class: 'lead' }, t(W.intro)),
      h('section', { class: 'card' }, W.reflect.map(function (r) { return notes(r.id, t(r), 4); })),
      h('section', { class: 'card' },
        h('h3', {}, t(W.results)), resultTables(),
        h('div', { class: 'notes' }, h('label', { for: 'name' }, ui('name')), nameIn),
        locked
          ? h('div', { class: 'msg tip', role: 'status' }, h('p', {}, ui('exportLocked')), h('ul', {}, miss.map(function (m) { return h('li', {}, m); })))
          : h('p', { class: 'msg ok', role: 'status' }, '✓ ' + ui('exportReady')),
        h('div', { class: 'btnrow' },
          h('button', { type: 'button', class: 'btn primary', 'aria-disabled': locked ? 'true' : 'false', on: { click: guarded(doPrint) } }, ui('print')),
          h('button', { type: 'button', class: 'btn primary', 'aria-disabled': locked ? 'true' : 'false', on: { click: guarded(doDownload) } }, ui('download')))),
      h('p', { class: 'reset' }, h('button', { type: 'button', class: 'btn ghost', on: { click: function () {
        if (window.confirm(ui('resetAllConfirm'))) { var lang = S.lang; S = fresh(); S.lang = lang; save(); goPage(0); }
      } } }, '↺ ' + ui('resetAll'))));
  }

  /* ---------- frame: header, navigation, footer, glossary ---------- */
  var PAGES = [pageStart, pageMoney, pageSources, pageDecide, pageSim, pageWrap];
  function render(keepScroll) {
    if (globe) { globe.dispose(); globe = null; }
    document.documentElement.lang = S.lang;
    document.title = ui('appTitle');
    $('skip').textContent = ui('skip');
    $('title').textContent = ui('appTitle');
    $('sub').textContent = ui('appSub');
    $('lang').setAttribute('aria-label', ui('langLabel'));
    ['de', 'en'].forEach(function (l) { $('lang-' + l).setAttribute('aria-pressed', S.lang === l ? 'true' : 'false'); });
    $('gloss-open').textContent = '📖 ' + ui('glossary');
    var nav = $('steps'); nav.textContent = '';
    C.pages.forEach(function (p, i) {
      nav.appendChild(h('li', {}, h('button', { type: 'button', 'aria-current': i === S.page ? 'step' : null,
        on: { click: function () { goPage(i); } } }, (i + 1) + ' ' + t(p))));
    });
    var main = $('main'); main.textContent = '';
    var head = h('h2', { tabindex: '-1', id: 'page-title' }, (S.page + 1) + '. ' + t(C.pages[S.page]));
    main.appendChild(head);
    main.appendChild(PAGES[S.page]());
    main.appendChild(h('div', { class: 'pager' },
      S.page > 0 ? h('button', { type: 'button', class: 'btn', on: { click: function () { goPage(S.page - 1); } } }, '← ' + ui('back')) : h('span'),
      S.page < PAGES.length - 1 ? h('button', { type: 'button', class: 'btn primary', on: { click: function () { goPage(S.page + 1); } } }, ui('next') + ' →') : h('span')));
    // Footer (accordion) and glossary
    $('foot-btn').textContent = ui('footer');
    var f = $('foot-body'); f.textContent = '';
    f.appendChild(h('p', {}, t(C.wrap.licence)));
    f.appendChild(h('p', {}, t(C.wrap.libs)));
    f.appendChild(h('p', {}, t(C.wrap.dataNote)));
    f.appendChild(h('ul', {}, C.sources.map(function (s) { return h('li', {}, s.cite); })));
    $('gloss-title').textContent = ui('glossary');
    $('gloss-close').textContent = ui('close');
    var gl = $('gloss-list'); gl.textContent = '';
    C.glossary.forEach(function (g) {
      gl.appendChild(h('dt', {}, h('span', { lang: 'de' }, g.de), ' = ', h('span', { lang: 'en' }, g.en)));
      gl.appendChild(h('dd', {}, S.lang === 'de' ? g.dDe : g.dEn));
    });
    updateProgress();
    if (!keepScroll) { window.scrollTo(0, 0); head.focus({ preventScroll: true }); }
  }
  function goPage(i) { S.page = i; save(); render(false); }

  ['de', 'en'].forEach(function (l) {
    $('lang-' + l).addEventListener('click', function () { S.lang = l; save(); render(true); });
  });
  $('gloss-open').addEventListener('click', function () { $('gloss').showModal(); });
  $('gloss-close').addEventListener('click', function () { $('gloss').close(); });
  $('foot-btn').addEventListener('click', function () {
    var open = $('foot-btn').getAttribute('aria-expanded') !== 'true';
    $('foot-btn').setAttribute('aria-expanded', open ? 'true' : 'false');
    $('foot-body').hidden = !open;
  });
  render(true);
})();
