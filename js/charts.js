/*
  KI-assistiert erstellt unter Verwendung des "learning-artifacts-builder (lab-o5)"-Skills, angepasst als Vibe-Coding-Lab-Skill
  Lizenz: CC BY-SA 4.0 (Dominik Kluge), https://creativecommons.org/licenses/by-sa/4.0/
  Sie dürfen: Teilen, Bearbeiten
  Bedingungen: Namensnennung, Weitergabe unter gleichen Bedingungen
*/
/*
  charts.js – all D3 drawings: price lab, bread prices 1923, deflation spiral, simulator charts.
  Every function clears its container and draws again; nothing here keeps state.
*/
(function (root) {
  'use strict';
  var d3 = root.d3;
  var BLUE = '#1d4ed8', GREY = '#4b5563', INK = '#1b2333', LINE = '#cbd5e1', DOWN = '#c2410c';

  function svg(host, w, hgt, label) {
    d3.select(host).selectAll('*').remove();
    return d3.select(host).append('svg')
      .attr('viewBox', '0 0 ' + w + ' ' + hgt)
      .attr('role', 'img').attr('aria-label', label)
      .attr('preserveAspectRatio', 'xMidYMid meet');
  }

  /* Price lab: coins on the left, loaves on the right, price tag in the middle. */
  function lab(host, o) {
    var s = svg(host, 360, 190, o.alt);
    var coins = Math.max(1, Math.round(o.m / 10)), loaves = Math.max(1, Math.round(o.g / 10));
    s.append('text').attr('x', 62).attr('y', 16).attr('text-anchor', 'middle').attr('font-size', 12).attr('font-weight', 700).attr('fill', INK).text(o.coin);
    s.append('text').attr('x', 298).attr('y', 16).attr('text-anchor', 'middle').attr('font-size', 12).attr('font-weight', 700).attr('fill', INK).text(o.bread);
    s.selectAll('circle.c').data(d3.range(coins)).enter().append('circle')
      .attr('cx', function (i) { return 12 + (i % 5) * 25; })
      .attr('cy', function (i) { return 180 - Math.floor(i / 5) * 19; })
      .attr('r', 8).attr('fill', '#facc15').attr('stroke', '#854d0e').attr('stroke-width', 1.5);
    s.selectAll('rect.b').data(d3.range(loaves)).enter().append('rect')
      .attr('x', function (i) { return 250 + (i % 3) * 34; })
      .attr('y', function (i) { return 166 - Math.floor(i / 3) * 24; })
      .attr('width', 28).attr('height', 17).attr('rx', 8)
      .attr('fill', '#d6a15c').attr('stroke', '#7c4a12').attr('stroke-width', 1.5);
    var g = s.append('g').attr('transform', 'translate(180,100)');
    g.append('rect').attr('x', -52).attr('y', -40).attr('width', 104).attr('height', 80).attr('rx', 10)
      .attr('fill', '#fff').attr('stroke', BLUE).attr('stroke-width', 2);
    g.append('text').attr('y', -18).attr('text-anchor', 'middle').attr('font-size', 11).attr('fill', GREY).text(o.priceLabel);
    g.append('text').attr('y', 10).attr('text-anchor', 'middle').attr('font-size', 22).attr('font-weight', 700).attr('fill', INK).text(o.price);
    g.append('text').attr('y', 29).attr('text-anchor', 'middle').attr('font-size', 11).attr('fill', GREY).text(o.unit);
  }

  /* Bread prices 1923 on a logarithmic scale. */
  function bread(host, o) {
    var W = 360, H = 250, m = { t: 22, r: 6, b: 28, l: 6 };
    var s = svg(host, W, H, o.alt);
    var x = d3.scaleBand().domain(d3.range(o.data.length)).range([m.l, W - m.r]).padding(0.22);
    var y = d3.scaleLog().domain([100, 1e12]).range([H - m.b, m.t]);
    var g = s.selectAll('g.bar').data(o.data).enter().append('g');
    g.append('rect').attr('x', function (d, i) { return x(i); }).attr('width', x.bandwidth())
      .attr('y', function (d) { return y(d.v); }).attr('height', function (d) { return H - m.b - y(d.v); })
      .attr('rx', 3).attr('fill', BLUE);
    g.append('text').attr('x', function (d, i) { return x(i) + x.bandwidth() / 2; }).attr('y', function (d) { return y(d.v) - 5; })
      .attr('text-anchor', 'middle').attr('font-size', 10).attr('font-weight', 700).attr('fill', INK).text(function (d) { return d.short; });
    g.append('text').attr('x', function (d, i) { return x(i) + x.bandwidth() / 2; }).attr('y', H - 10)
      .attr('text-anchor', 'middle').attr('font-size', 10).attr('fill', GREY).text(function (d) { return d.label; });
    s.append('line').attr('x1', m.l).attr('x2', W - m.r).attr('y1', H - m.b).attr('y2', H - m.b).attr('stroke', GREY);
  }

  function wrap(text, max) {
    var out = [], line = '';
    text.split(' ').forEach(function (w) {
      if (line && (line + ' ' + w).length > max) { out.push(line); line = w; } else { line = line ? line + ' ' + w : w; }
    });
    if (line) { out.push(line); }
    return out;
  }

  /* Deflation spiral: five clickable stations in a circle. */
  function spiral(host, o) {
    d3.select(host).selectAll('*').remove();
    var s = d3.select(host).append('svg').attr('viewBox', '0 0 360 350').attr('role', 'group').attr('aria-label', o.alt);
    var P = [[180, 44], [300, 132], [256, 290], [104, 290], [60, 132]];
    s.append('defs').append('marker').attr('id', 'arr').attr('viewBox', '0 0 10 10').attr('refX', 9).attr('refY', 5)
      .attr('markerWidth', 7).attr('markerHeight', 7).attr('orient', 'auto')
      .append('path').attr('d', 'M0,0L10,5L0,10z').attr('fill', GREY);
    P.forEach(function (p, i) {
      var q = P[(i + 1) % 5], dx = q[0] - p[0], dy = q[1] - p[1], len = Math.sqrt(dx * dx + dy * dy);
      var trim = i === 2 ? 62 : 46;   // the two bottom boxes sit side by side
      var a = trim / len, b = 1 - trim / len;
      s.append('line').attr('x1', p[0] + dx * a).attr('y1', p[1] + dy * a).attr('x2', p[0] + dx * b).attr('y2', p[1] + dy * b)
        .attr('stroke', GREY).attr('stroke-width', 2).attr('marker-end', 'url(#arr)');
    });
    s.append('text').attr('x', 180).attr('y', 195).attr('text-anchor', 'middle').attr('font-size', 40).attr('fill', LINE).text('↻');
    o.items.forEach(function (label, i) {
      var on = i === o.active, seen = o.seen.indexOf(i) >= 0;
      var g = s.append('g').attr('transform', 'translate(' + P[i][0] + ',' + P[i][1] + ')')
        .attr('role', 'button').attr('tabindex', 0).attr('class', 'hot')
        .attr('aria-pressed', on ? 'true' : 'false').attr('aria-label', (i + 1) + '. ' + label);
      g.append('rect').attr('x', -56).attr('y', -32).attr('width', 112).attr('height', 64).attr('rx', 10)
        .attr('fill', on ? BLUE : (seen ? '#e0e7ff' : '#fff')).attr('stroke', BLUE).attr('stroke-width', on ? 3 : 2);
      var lines = wrap((i + 1) + '. ' + label, 17);
      lines.forEach(function (ln, k) {
        g.append('text').attr('y', (k - (lines.length - 1) / 2) * 13 + 4).attr('text-anchor', 'middle')
          .attr('font-size', 11).attr('font-weight', 700).attr('fill', on ? '#fff' : INK).text(ln);
      });
      g.on('click', function () { o.onSelect(i); });
      g.on('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); o.onSelect(i); }
      });
    });
  }

  /* One simulator chart: history (grey dashed) against the model (blue) up to quarter q. */
  var DOMAIN = { stocks: [0, 160], output: [0, 125], unemployment: [0, 40], prices: [50, 140], banks: [0, 45], trade: [0, 125] };
  function simChart(host, o) {
    var W = 300, H = 180, m = { t: 14, r: 40, b: 22, l: 30 };
    var s = svg(host, W, H, o.alt);
    var x = d3.scaleLinear().domain([0, 17]).range([m.l, W - m.r]);
    var y = d3.scaleLinear().domain(DOMAIN[o.key]).range([H - m.b, m.t]);
    y.ticks(4).forEach(function (v) {
      s.append('line').attr('x1', m.l).attr('x2', W - m.r).attr('y1', y(v)).attr('y2', y(v)).attr('stroke', '#e5e7eb');
      s.append('text').attr('x', m.l - 5).attr('y', y(v) + 4).attr('text-anchor', 'end').attr('font-size', 10).attr('fill', GREY).text(v);
    });
    [[2, '1930'], [6, '1931'], [10, '1932'], [14, '1933']].forEach(function (tk) {
      s.append('line').attr('x1', x(tk[0])).attr('x2', x(tk[0])).attr('y1', H - m.b).attr('y2', H - m.b + 4).attr('stroke', GREY);
      s.append('text').attr('x', x(tk[0])).attr('y', H - 5).attr('text-anchor', 'middle').attr('font-size', 10).attr('fill', GREY).text(tk[1]);
    });
    var line = d3.line().x(function (d, i) { return x(i); }).y(function (d) { return y(d); });
    s.append('path').attr('d', line(o.hist)).attr('fill', 'none').attr('stroke', GREY).attr('stroke-width', 2).attr('stroke-dasharray', '5 4');
    s.append('path').attr('d', line(o.sim.slice(0, o.q + 1))).attr('fill', 'none').attr('stroke', BLUE).attr('stroke-width', 3)
      .attr('stroke-linejoin', 'round').attr('stroke-linecap', 'round');
    var ys = y(o.sim[o.q]), yh = y(o.hist[o.q]);
    s.append('circle').attr('cx', x(o.q)).attr('cy', yh).attr('r', 3.5).attr('fill', '#fff').attr('stroke', GREY).attr('stroke-width', 2);
    s.append('circle').attr('cx', x(o.q)).attr('cy', ys).attr('r', 4.5).attr('fill', BLUE).attr('stroke', '#fff').attr('stroke-width', 1.5);
    // Value labels: keep at least 13 px apart so they never overlap.
    var ls = ys + 4, lh = yh + 4;
    if (Math.abs(ls - lh) < 13) { if (ls <= lh) { ls = (ls + lh) / 2 - 6.5; lh = ls + 13; } else { lh = (ls + lh) / 2 - 6.5; ls = lh + 13; } }
    var lx = Math.min(x(o.q) + 8, W - m.r + 6);
    s.append('text').attr('x', lx).attr('y', ls).attr('font-size', 11).attr('font-weight', 700).attr('fill', BLUE).text(Math.round(o.sim[o.q]));
    s.append('text').attr('x', lx).attr('y', lh).attr('font-size', 11).attr('fill', GREY).text(Math.round(o.hist[o.q]));
  }

  root.Charts = { lab: lab, bread: bread, spiral: spiral, simChart: simChart, DOWN: DOWN, BLUE: BLUE };
})(window);
