/*
  KI-assistiert erstellt unter Verwendung des "learning-artifacts-builder (lab-o5)"-Skills, angepasst als Vibe-Coding-Lab-Skill
  Lizenz: CC BY-SA 4.0 (Dominik Kluge), https://creativecommons.org/licenses/by-sa/4.0/
  Sie dürfen: Teilen, Bearbeiten
  Bedingungen: Namensnennung, Weitergabe unter gleichen Bedingungen
*/
/*
  model.js – the teaching model behind the simulator.

  IMPORTANT: This is a deliberately simple classroom model, not economic science.
  It runs in 18 quarter-year steps from 1929 Q3 to 1933 Q4.
  Every rule below is one sentence of "economics" turned into one line of code,
  so students (and teachers) can read, question and change it.
*/
(function (root) {
  'use strict';

  var QUARTERS = [];
  (function () {
    var y = 1929, q = 3;
    for (var i = 0; i < 18; i++) {
      QUARTERS.push(y + ' Q' + q);
      q++;
      if (q > 4) { q = 1; y++; }
    }
  })();

  // Rounded historical values (USA; world trade = world). 1929 Q3 = 100 where it is an index.
  var HISTORY = {
    stocks: [100, 65, 75, 59, 54, 43, 45, 39, 25, 20, 19, 11, 19, 16, 14, 26, 25, 26],
    output: [100, 93, 90, 86, 80, 74, 75, 74, 68, 62, 58, 53, 55, 55, 52, 65, 75, 68],
    unemployment: [3, 4, 6, 8, 9, 11, 13, 15, 17, 19, 21, 23, 25, 25, 26, 25, 24, 23],
    prices: [100, 100, 99, 98, 97, 95, 93, 90, 88, 86, 84, 81, 79, 77, 75, 75, 77, 77],
    banks: [0, 1, 2, 3, 4, 7, 9, 11, 13, 16, 18, 19, 20, 22, 36, 37, 38, 38],
    trade: [100, 98, 92, 86, 80, 74, 68, 62, 56, 50, 46, 42, 39, 37, 35, 35, 35, 36]
  };

  // The lever settings that come closest to what US policy really did.
  var HISTORICAL_POLICY = { bankHelp: 10, spending: -10, tariffs: 85, insurance: false, leaveGold: false, newDeal: true };
  var NEUTRAL_POLICY = { bankHelp: 50, spending: 0, tariffs: 40, insurance: false, leaveGold: false, newDeal: false };

  // How strong the bank panic is in each quarter if nobody helps (waves of panic).
  var PANIC = [0, 0.9, 0.8, 0.9, 1.1, 2.6, 1.7, 1.8, 2.0, 2.3, 1.5, 0.9, 0.8, 1.3, 7.5, 2.0, 0.8, 0.5];

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function simulate(policy) {
    var help = clamp(policy.bankHelp, 0, 100) / 100;      // 0 = central bank does nothing, 1 = lends freely
    var spend = clamp(policy.spending, -50, 50) / 50;     // -1 = hard cuts, +1 = big job programmes
    var tariff = clamp(policy.tariffs, 0, 100) / 100;     // 0 = free trade, 1 = very high tariffs
    var insured = !!policy.insurance;                     // state guarantees savings
    var gold = !!policy.leaveGold;                        // leave the gold standard at the end of 1931
    var newDeal = !!policy.newDeal;                       // Roosevelt's programme from spring 1933

    var out = { stocks: [100], output: [100], unemployment: [3], prices: [100], banks: [0], trade: [100], money: [100] };
    var stocks = 100, output = 100, prices = 100, banks = 0, trade = 100, money = 100;
    var confidence = 0.8;                                 // 0 = panic, 1 = full trust

    for (var t = 1; t < 18; t++) {
      var goldFree = gold && t >= 9;
      var turn = 0;                                       // one-off boost of trust when the New Deal starts
      if (newDeal && t >= 15) {
        // New Deal = bank holiday + guaranteed savings + leaving gold + job programmes.
        goldFree = true; insured = true;
        help = Math.max(help, 0.7); spend = Math.max(spend, 0.4);
        if (t === 15) { turn = 0.3; }
      }
      var helpEffect = help * (goldFree ? 1 : 0.7);       // on gold, the central bank's hands are partly tied

      // 1. Bank failures: panic is worse when trust is low; help and guarantees calm it.
      var failures = PANIC[t] * (1 - 0.85 * helpEffect) * (insured ? 0.3 : 1) * (0.5 + 1.1 * (1 - confidence));
      banks = clamp(banks + failures, 0, 100);

      // 2. Money: every failed bank destroys money. The central bank can replace it,
      //    but while it defends the gold standard it can only do a little.
      var easing = help * (goldFree ? 1.5 : 0.6);
      var dMoney = -1.0 * failures + 1.3 * easing - 0.35;
      money = clamp(money + dMoney, 40, 140);

      // 3. Production: less money and less trust mean fewer orders. State spending adds orders,
      //    tariffs (after mid-1930) cost export orders. The 1929 crash is a one-off shock.
      var crash = (t === 1) ? -6 : 0;
      var tariffHit = (t >= 3) ? -1.1 * tariff : 0;
      var dOutput = crash + 0.7 * dMoney + 1.5 * spend + tariffHit + 5 * (confidence - 0.72) +
        (output > 100 ? 0.45 : 0.05) * (100 - output) + (goldFree ? 0.8 : 0) + 22 * turn;
      var prevOutput = output;
      output = clamp(output + dOutput, 30, 125);

      // 4. Prices follow money and demand (falling prices = deflation).
      var dPrices = 0.55 * dMoney + 0.12 * (output - prevOutput) + (goldFree ? 0.5 : 0);
      prices = clamp(prices + dPrices, 50, 140);

      // 5. Trust: bank failures and deflation destroy it; guarantees and help rebuild it.
      var prevConfidence = confidence;
      confidence = clamp(confidence - 0.035 * failures + 0.012 * dPrices +
        (insured ? 0.02 : 0) + 0.025 * help + 0.01 * spend - (t === 1 ? 0.12 : 0) + 0.012 + turn, 0.05, 0.95);

      // 6. Shares react to expected profits (production) and to trust.
      var crashStocks = (t === 1) ? -0.1 : 0;
      stocks = clamp(stocks * (1 + crashStocks + 0.03 * (output - prevOutput) + 0.7 * (confidence - prevConfidence)), 5, 160);

      // 7. World trade follows production; tariffs provoke counter-tariffs.
      var dTrade = 0.75 * (output - prevOutput) + ((t >= 2) ? -3.0 * tariff : 0) + 0.3 + (goldFree ? 0.6 : 0);
      trade = clamp(trade + dTrade, 20, 125);

      // 8. Unemployment rises when production falls.
      var unemployment = clamp(3 + 0.47 * (100 - output), 2, 40);

      out.stocks.push(stocks); out.output.push(output); out.unemployment.push(unemployment);
      out.prices.push(prices); out.banks.push(banks); out.trade.push(trade); out.money.push(money);
    }
    return out;
  }

  var api = { QUARTERS: QUARTERS, HISTORY: HISTORY, HISTORICAL_POLICY: HISTORICAL_POLICY,
    NEUTRAL_POLICY: NEUTRAL_POLICY, simulate: simulate };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  root.CrisisModel = api;
})(typeof window !== 'undefined' ? window : globalThis);
