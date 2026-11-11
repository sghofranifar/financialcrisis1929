/*
  KI-assistiert erstellt unter Verwendung des "learning-artifacts-builder (lab-o5)"-Skills, angepasst als Vibe-Coding-Lab-Skill
  Lizenz: CC BY-SA 4.0 (Dominik Kluge), https://creativecommons.org/licenses/by-sa/4.0/
  Sie dürfen: Teilen, Bearbeiten
  Bedingungen: Namensnennung, Weitergabe unter gleichen Bedingungen
*/
/*
  content.js – every text, source and task of the app, in German (de) and English (en).
  Teachers can change wording, add sources or swap tasks here without touching the program code.
*/
(function (root) {
  'use strict';

  var C = {};

  C.pages = [
    { id: 'start', de: 'Die Welt 1929', en: 'The World in 1929' },
    { id: 'world', de: 'Zeitreise 3D', en: '3D Time Journey' },
    { id: 'money', de: 'Geld & Preise', en: 'Money & Prices' },
    { id: 'sources', de: 'Quellen', en: 'Sources' },
    { id: 'decide', de: 'Entscheiden', en: 'Decide' },
    { id: 'sim', de: 'Simulator', en: 'Simulator' },
    { id: 'wrap', de: 'Sicherung', en: 'Wrap-up' }
  ];

  C.ui = {
    appTitle: { de: 'Weltwirtschaftskrise 1929', en: 'The Great Depression 1929' },
    appSub: { de: 'Simulation für den bilingualen Geschichtsunterricht', en: 'A simulation for bilingual history lessons' },
    skip: { de: 'Zum Inhalt springen', en: 'Skip to content' },
    langLabel: { de: 'Sprache', en: 'Language' },
    glossary: { de: 'Wortspeicher', en: 'Word bank' },
    close: { de: 'Schließen', en: 'Close' },
    next: { de: 'Weiter', en: 'Next' },
    back: { de: 'Zurück', en: 'Back' },
    progress: { de: 'Fortschritt', en: 'Progress' },
    tasksDone: { de: 'Aufgaben erledigt', en: 'tasks done' },
    resetPage: { de: 'Aufgaben dieser Seite zurücksetzen', en: 'Reset the tasks on this page' },
    resetAll: { de: 'Alles zurücksetzen', en: 'Reset everything' },
    resetAllConfirm: { de: 'Wirklich alle Antworten und Notizen löschen?', en: 'Really delete all answers and notes?' },
    triesLeft: { de: 'Versuche übrig', en: 'tries left' },
    correct: { de: '✓ Richtig!', en: '✓ Correct!' },
    wrong: { de: '✗ Noch nicht.', en: '✗ Not yet.' },
    tip: { de: 'Tipp', en: 'Hint' },
    solution: { de: 'Lösung', en: 'Solution' },
    solutionShown: { de: 'Das war knifflig – hier ist die Lösung:', en: 'That was tricky – here is the solution:' },
    yourNotes: { de: 'Deine Notizen', en: 'Your notes' },
    showTranslation: { de: 'Übersetzung zeigen', en: 'Show translation' },
    hideTranslation: { de: 'Übersetzung verbergen', en: 'Hide translation' },
    original: { de: 'Original', en: 'Original' },
    translation: { de: 'Übersetzung (für diese App erstellt)', en: 'Translation (made for this app)' },
    wordHelp: { de: 'Worthilfen', en: 'Word help' },
    context: { de: 'Hintergrund', en: 'Background' },
    perspective: { de: 'Perspektive', en: 'Perspective' },
    citation: { de: 'Nachweis', en: 'Reference' },
    youAre: { de: 'Du bist', en: 'You are' },
    situation: { de: 'Lage', en: 'Situation' },
    yourChoice: { de: 'Deine Entscheidung', en: 'Your decision' },
    history: { de: 'Was wirklich geschah', en: 'What really happened' },
    historical: { de: 'historisch', en: 'historical' },
    decideAgain: { de: 'Neu entscheiden', en: 'Decide again' },
    toSim: { de: 'Meine Entscheidungen im Simulator ansehen', en: 'See my decisions in the simulator' },
    model: { de: 'Modell', en: 'model' },
    play: { de: '▶ Abspielen', en: '▶ Play' },
    quarter: { de: 'Quartal', en: 'Quarter' },
    presetHistory: { de: 'Wie in der Geschichte', en: 'As in history' },
    presetMine: { de: 'Meine Entscheidungen', en: 'My decisions' },
    presetMineMissing: { de: 'Triff zuerst alle Entscheidungen auf der Seite „Entscheiden“.', en: 'First make all decisions on the “Decide” page.' },
    on: { de: 'an', en: 'on' },
    off: { de: 'aus', en: 'off' },
    done: { de: 'geschafft', en: 'done' },
    open: { de: 'offen', en: 'open' },
    print: { de: 'Drucken / als PDF sichern', en: 'Print / save as PDF' },
    download: { de: 'Als Textdatei (Markdown) laden', en: 'Download as text file (Markdown)' },
    name: { de: 'Name (erscheint nur im Ausdruck)', en: 'Name (only appears on the printout)' },
    exportLocked: { de: 'Der Export wird frei, wenn alle Aufgaben und Entscheidungen bearbeitet sind. Es fehlen noch:', en: 'Export unlocks when all tasks and decisions are done. Still missing:' },
    exportReady: { de: 'Alles bearbeitet – du kannst deine Ergebnisse jetzt sichern.', en: 'All done – you can now save your results.' },
    colTask: { de: 'Aufgabe', en: 'Task' },
    colAnswer: { de: 'Eigene Antwort', en: 'Your answer' },
    colSolution: { de: 'Lösung', en: 'Solution' },
    colTries: { de: 'Fehlversuche', en: 'Wrong tries' },
    colStatus: { de: 'Status', en: 'Status' },
    stSolved: { de: 'gelöst', en: 'solved' },
    stRevealed: { de: 'Lösung angezeigt', en: 'solution shown' },
    stOpen: { de: 'offen', en: 'open' },
    stChosen: { de: 'entschieden', en: 'decided' },
    stWritten: { de: 'bearbeitet', en: 'written' },
    footer: { de: 'Quellen, Daten und Lizenz', en: 'Sources, data and licence' }
  };

  C.glossary = [
    { de: 'die Aktie', en: 'share / stock', dDe: 'Anteil an einer Firma, den man an der Börse kaufen und verkaufen kann.', dEn: 'A small part of a company that you can buy and sell at the stock exchange.' },
    { de: 'die Börse', en: 'stock exchange', dDe: 'Markt, auf dem Aktien gehandelt werden (z. B. Wall Street in New York).', dEn: 'A market where shares are traded (e.g. Wall Street in New York).' },
    { de: 'der Börsenkrach', en: 'stock market crash', dDe: 'Die Aktienkurse fallen in kurzer Zeit sehr stark.', dEn: 'Share prices fall very sharply in a short time.' },
    { de: 'die Inflation', en: 'inflation', dDe: 'Die Preise steigen, das Geld verliert an Wert.', dEn: 'Prices rise, money loses value.' },
    { de: 'die Deflation', en: 'deflation', dDe: 'Die Preise fallen dauerhaft; Firmen verdienen weniger und entlassen Menschen.', dEn: 'Prices keep falling; firms earn less and lay people off.' },
    { de: 'die Geldmenge', en: 'money supply', dDe: 'Alles Geld, das in einem Land im Umlauf ist.', dEn: 'All the money that is in use in a country.' },
    { de: 'die Zentralbank / Notenbank', en: 'central bank', dDe: 'Bank des Staates, die das Geld ausgibt (USA: Federal Reserve, Deutschland: Reichsbank).', dEn: 'The state’s bank that issues money (USA: Federal Reserve, Germany: Reichsbank).' },
    { de: 'der Bankensturm', en: 'bank run', dDe: 'Viele Menschen wollen gleichzeitig ihr Erspartes abheben; die Bank geht pleite.', dEn: 'Many people want their savings back at the same time; the bank fails.' },
    { de: 'der Kredit', en: 'loan / credit', dDe: 'Geliehenes Geld, das man mit Zinsen zurückzahlen muss.', dEn: 'Borrowed money that must be paid back with interest.' },
    { de: 'der Zoll (die Zölle)', en: 'tariff', dDe: 'Steuer auf Waren aus dem Ausland.', dEn: 'A tax on goods from other countries.' },
    { de: 'der Goldstandard', en: 'gold standard', dDe: 'Regel: Geld kann jederzeit in eine feste Menge Gold getauscht werden. Der Staat darf deshalb nur wenig neues Geld schaffen.', dEn: 'Rule: money can always be exchanged for a fixed amount of gold. So the state can create only a little new money.' },
    { de: 'die Arbeitslosigkeit', en: 'unemployment', dDe: 'Menschen wollen arbeiten, finden aber keine Stelle.', dEn: 'People want to work but cannot find a job.' },
    { de: 'die Sparpolitik', en: 'austerity', dDe: 'Der Staat gibt weniger aus und erhöht Steuern, um keine Schulden zu machen.', dEn: 'The state spends less and raises taxes to avoid debt.' },
    { de: 'die Notverordnung', en: 'emergency decree', dDe: 'Gesetz ohne Parlament, erlassen vom Reichspräsidenten (Artikel 48 der Weimarer Verfassung).', dEn: 'A law without parliament, issued by the Reich President (Article 48 of the Weimar Constitution).' },
    { de: 'die Reparationen', en: 'reparations', dDe: 'Zahlungen, die Deutschland nach dem Ersten Weltkrieg an die Sieger leisten musste.', dEn: 'Payments Germany had to make to the victors after the First World War.' },
    { de: 'die Weltwirtschaftskrise', en: 'the Great Depression', dDe: 'Die weltweite Wirtschaftskrise von 1929 bis in die 1930er-Jahre.', dEn: 'The worldwide economic crisis from 1929 into the 1930s.' }
  ];

  /* ---------- Page 1: the world ---------- */
  C.start = {
    intro: {
      de: 'New York, Donnerstag, 24. Oktober 1929: An der Börse in der Wall Street wollen plötzlich alle ihre Aktien verkaufen. Die Kurse stürzen ab. Aus dem Börsenkrach wird eine Krise der Banken, dann der Fabriken – und sie wandert um die ganze Welt.',
      en: 'New York, Thursday, 24 October 1929: at the Wall Street stock exchange everyone suddenly wants to sell their shares. Prices collapse. The crash turns into a crisis of the banks, then of the factories – and it travels around the whole world.'
    },
    goalsTitle: { de: 'Das kannst du am Ende', en: 'What you will be able to do' },
    goals: [
      { de: 'erklären, wie aus einem Börsenkrach eine weltweite Krise wurde', en: 'explain how a stock market crash became a worldwide crisis' },
      { de: 'Inflation (1923) und Deflation (1929–33) unterscheiden', en: 'tell inflation (1923) from deflation (1929–33)' },
      { de: 'Quellen aus verschiedenen Perspektiven untersuchen', en: 'examine sources from different perspectives' },
      { de: 'Entscheidungen von Politikern beurteilen – und ein Modell kritisch prüfen', en: 'judge politicians’ decisions – and check a model critically' }
    ],
    globeTitle: { de: 'Wie die Krise um die Welt wandert', en: 'How the crisis travels around the world' },
    globeHelp: {
      de: 'Wähle ein Jahr. Die Säulen zeigen, wie stark die Industrieproduktion gegenüber 1929 gefallen (orange) oder gestiegen (blau) ist. Ziehe die Kugel mit Finger oder Maus, oder tippe auf ein Land in der Tabelle.',
      en: 'Choose a year. The bars show how far industrial production has fallen (orange) or risen (blue) compared with 1929. Drag the globe with finger or mouse, or tap a country in the table.'
    },
    globeAlt: { de: 'Drehbare Weltkugel mit Säulen für sechs Länder. Alle Werte stehen in der Tabelle daneben.', en: 'Rotatable globe with bars for six countries. All values are in the table next to it.' },
    year: { de: 'Jahr', en: 'Year' },
    country: { de: 'Land', en: 'Country' },
    index: { de: 'Industrieproduktion (1929 = 100)', en: 'Industrial production (1929 = 100)' },
    dataNote: {
      de: 'Gerundete Werte nach Statistiken des Völkerbunds, wie sie in Schulbüchern üblich sind. Sowjetunion: offizielle Angaben einer Planwirtschaft, die kaum mit dem Weltmarkt verbunden war.',
      en: 'Rounded values based on League of Nations statistics as commonly used in textbooks. Soviet Union: official figures of a planned economy that was hardly linked to the world market.'
    },
    think: {
      de: 'Denkfrage: Warum trifft die Krise Deutschland fast so hart wie die USA, Großbritannien aber weniger? Notiere eine Vermutung – du prüfst sie später.',
      en: 'Think: why does the crisis hit Germany almost as hard as the USA, but Britain less? Note down a guess – you will check it later.'
    },
    years: [1929, 1930, 1931, 1932, 1933],
    countries: [
      { id: 'usa', de: 'USA', en: 'USA', lat: 40.7, lon: -74, v: [100, 81, 68, 54, 64] },
      { id: 'ger', de: 'Deutschland', en: 'Germany', lat: 52.5, lon: 13.4, v: [100, 88, 72, 59, 66] },
      { id: 'uk', de: 'Großbritannien', en: 'Great Britain', lat: 51.5, lon: -0.1, v: [100, 92, 84, 83, 88] },
      { id: 'fra', de: 'Frankreich', en: 'France', lat: 46.5, lon: 2.4, v: [100, 99, 86, 72, 81] },
      { id: 'jpn', de: 'Japan', en: 'Japan', lat: 35.7, lon: 139.7, v: [100, 95, 92, 98, 113] },
      { id: 'ussr', de: 'Sowjetunion', en: 'Soviet Union', lat: 55.8, lon: 37.6, v: [100, 131, 161, 183, 198] }
    ],
    events: [
      { de: '1929 – Oktober: Börsenkrach in New York. US-Banken brauchen Geld und fordern ihre Kredite aus Europa zurück – vor allem aus Deutschland.', en: '1929 – October: stock market crash in New York. US banks need money and call back their loans from Europe – above all from Germany.' },
      { de: '1930 – Juni: Die USA erhöhen ihre Zölle stark (Smoot-Hawley-Gesetz), andere Länder antworten mit eigenen Zöllen. September: Die NSDAP steigt bei der Reichstagswahl von 2,6 % auf 18,3 %.', en: '1930 – June: the USA sharply raises its tariffs (Smoot-Hawley Act); other countries answer with tariffs of their own. September: in the Reichstag election the Nazi party rises from 2.6% to 18.3%.' },
      { de: '1931 – Mai: Die größte Bank Österreichs (Creditanstalt) bricht zusammen. Juli: Bankenkrise in Deutschland, alle Banken bleiben tagelang geschlossen. September: Großbritannien verlässt den Goldstandard.', en: '1931 – May: Austria’s biggest bank (Creditanstalt) collapses. July: banking crisis in Germany, all banks stay closed for days. September: Britain leaves the gold standard.' },
      { de: '1932 – Tiefpunkt: In Deutschland sind im Februar über 6 Millionen Menschen arbeitslos, in den USA fast jeder Vierte. Juli: Die Konferenz von Lausanne beendet praktisch die Reparationen.', en: '1932 – the lowest point: in February more than 6 million people are unemployed in Germany, in the USA almost one in four. July: the Lausanne Conference practically ends reparations.' },
      { de: '1933 – 30. Januar: Hitler wird Reichskanzler. 4. März: Franklin D. Roosevelt wird US-Präsident und beginnt den „New Deal“. April: Die USA verlassen den Goldstandard.', en: '1933 – 30 January: Hitler becomes Chancellor. 4 March: Franklin D. Roosevelt becomes US President and starts the “New Deal”. April: the USA leaves the gold standard.' }
    ]
  };

  /* ---------- Page 2: money and prices ---------- */
  C.money = {
    intro: {
      de: 'Zwei Krisen, zwei Gegenteile: 1923 gab es in Deutschland viel zu viel Geld – die Preise explodierten (Inflation). 1929–33 verschwand Geld, weil Banken zusammenbrachen – die Preise fielen (Deflation). Probiere aus, wie das zusammenhängt.',
      en: 'Two crises, two opposites: in 1923 Germany had far too much money – prices exploded (inflation). In 1929–33 money disappeared because banks collapsed – prices fell (deflation). Try out how this is connected.'
    },
    labTitle: { de: 'Preis-Labor: Geld und Waren', en: 'Price lab: money and goods' },
    labRule: {
      de: 'Faustregel des Modells: Preis = Geldmenge ÷ Warenmenge. (Vereinfacht: In Wirklichkeit zählt auch, wie schnell Geld ausgegeben wird.)',
      en: 'Rule of thumb in this model: price = money supply ÷ amount of goods. (Simplified: in reality it also matters how fast money is spent.)'
    },
    moneySl: { de: 'Geldmenge', en: 'Money supply' },
    goodsSl: { de: 'Warenmenge', en: 'Amount of goods' },
    breadPrice: { de: 'Ein Brot kostet', en: 'A loaf of bread costs' },
    coin: { de: 'Geld', en: 'Money' },
    bread: { de: 'Waren', en: 'Goods' },
    labAlt: { de: 'Schaubild: Münzen links, Brote rechts, in der Mitte der Brotpreis.', en: 'Diagram: coins on the left, loaves on the right, the bread price in the middle.' },
    presets: [
      { id: 'stable', de: 'Stabil', en: 'Stable', m: 100, g: 100 },
      { id: 'p1923', de: '1923: Der Staat druckt Geld', en: '1923: the state prints money', m: 400, g: 80 },
      { id: 'p1931', de: '1929–33: Banken brechen zusammen', en: '1929–33: banks collapse', m: 70, g: 100 }
    ],
    stateStable: { de: 'Stabile Preise: Geld und Waren passen zusammen.', en: 'Stable prices: money and goods are in balance.' },
    stateInfl: {
      de: 'Inflation: Zu viel Geld trifft auf zu wenig Waren. Ersparnisse verlieren an Wert – wer Schulden hat, gewinnt.',
      en: 'Inflation: too much money meets too few goods. Savings lose value – people with debts win.'
    },
    stateDefl: {
      de: 'Deflation: Geld ist knapp, die Preise fallen. Klingt gut – aber Firmen verdienen weniger, senken Löhne und entlassen. Schulden werden schwerer.',
      en: 'Deflation: money is scarce, prices fall. Sounds good – but firms earn less, cut wages and lay people off. Debts become heavier.'
    },
    breadTitle: { de: 'Inflation 1923: Preis für 1 kg Brot in Berlin', en: 'Inflation 1923: price of 1 kg of bread in Berlin' },
    breadNote: {
      de: 'Jeder Schritt nach oben bedeutet: zehnmal teurer. Gerundete Schulbuchwerte in Mark.',
      en: 'Each step up means: ten times more expensive. Rounded textbook values in marks.'
    },
    breadAlt: { de: 'Säulendiagramm der Brotpreise 1923; die Werte stehen in der Tabelle darunter.', en: 'Bar chart of bread prices in 1923; the values are in the table below.' },
    month: { de: 'Monat', en: 'Month' },
    priceMark: { de: 'Preis in Mark', en: 'Price in marks' },
    breadData: [
      { de: 'Jan. 1923', en: 'Jan 1923', v: 250 },
      { de: 'Juni', en: 'June', v: 1428 },
      { de: 'Juli', en: 'July', v: 3465 },
      { de: 'Aug.', en: 'Aug', v: 69000 },
      { de: 'Sept.', en: 'Sept', v: 1512000 },
      { de: 'Okt.', en: 'Oct', v: 1743000000 },
      { de: 'Nov.', en: 'Nov', v: 201000000000 }
    ],
    spiralTitle: { de: 'Die Deflationsspirale 1929–33', en: 'The deflation spiral 1929–33' },
    spiralHelp: { de: 'Tippe die Stationen der Reihe nach an.', en: 'Tap the stations one after the other.' },
    spiralAlt: { de: 'Kreislauf mit fünf Stationen, jede Station ist anklickbar.', en: 'Cycle with five stations; every station can be clicked.' },
    spiral: [
      { s: { de: 'Banken brechen zusammen', en: 'Banks collapse' }, t: { de: 'Sparer verlieren ihr Geld. Die Geldmenge schrumpft, Kredite gibt es kaum noch.', en: 'Savers lose their money. The money supply shrinks; there are hardly any loans.' } },
      { s: { de: 'Menschen kaufen weniger', en: 'People buy less' }, t: { de: 'Wer Angst um Arbeit und Erspartes hat, gibt nichts aus – und wartet, bis alles noch billiger wird.', en: 'People who fear for jobs and savings spend nothing – and wait until everything gets even cheaper.' } },
      { s: { de: 'Preise fallen', en: 'Prices fall' }, t: { de: 'Firmen senken die Preise, um überhaupt etwas zu verkaufen.', en: 'Firms cut prices to sell anything at all.' } },
      { s: { de: 'Firmen verdienen weniger', en: 'Firms earn less' }, t: { de: 'Die Einnahmen sinken, aber die Schulden bleiben gleich hoch. Viele Firmen gehen pleite.', en: 'Income falls, but debts stay the same. Many firms go bankrupt.' } },
      { s: { de: 'Löhne sinken, Entlassungen', en: 'Wage cuts, layoffs' }, t: { de: 'Arbeitslose können Kredite nicht zurückzahlen – noch mehr Banken geraten in Not. Die Spirale dreht sich weiter.', en: 'Unemployed people cannot repay loans – even more banks get into trouble. The spiral keeps turning.' } }
    ],
    quizTitle: { de: 'Prüfe dein Verständnis', en: 'Check your understanding' },
    quiz: [
      {
        id: 'm1',
        q: { de: 'Stelle im Preis-Labor „1929–33“ ein. Was passiert mit dem Brotpreis – und warum?', en: 'Set the price lab to “1929–33”. What happens to the bread price – and why?' },
        o: [
          { de: 'Er steigt, weil es weniger Brot gibt.', en: 'It rises because there is less bread.' },
          { de: 'Er fällt, weil weniger Geld im Umlauf ist.', en: 'It falls because less money is in use.', ok: true },
          { de: 'Er bleibt gleich, weil Brot immer gebraucht wird.', en: 'It stays the same because bread is always needed.' },
          { de: 'Er fällt, weil der Staat die Preise festlegt.', en: 'It falls because the state fixes prices.' }
        ],
        h1: { de: 'Probiere es wirklich aus: Welcher Regler bewegt sich beim Knopf „1929–33“?', en: 'Really try it: which slider moves when you press “1929–33”?' },
        h2: { de: 'Die Warenmenge bleibt gleich – nur die Geldmenge sinkt von 100 auf 70.', en: 'The amount of goods stays the same – only the money supply drops from 100 to 70.' },
        ex: { de: 'Wenn Banken zusammenbrechen, verschwindet Geld. Weniger Geld für gleich viele Waren bedeutet fallende Preise: Deflation.', en: 'When banks collapse, money disappears. Less money for the same amount of goods means falling prices: deflation.' }
      },
      {
        id: 'm2',
        q: { de: 'Frau Schmidt hat 1922 ihr ganzes Erspartes auf der Bank. Herr Braun hat hohe Schulden für sein Haus. Wer gewinnt in der Inflation 1923?', en: 'In 1922 Mrs Schmidt has all her savings in the bank. Mr Braun has large debts for his house. Who wins in the inflation of 1923?' },
        o: [
          { de: 'Herr Braun: Er kann seine Schulden mit fast wertlosem Geld zurückzahlen.', en: 'Mr Braun: he can pay back his debts with almost worthless money.', ok: true },
          { de: 'Frau Schmidt: Ihr Erspartes wird immer mehr.', en: 'Mrs Schmidt: her savings keep growing.' },
          { de: 'Beide gewinnen, weil alle mehr Geld haben.', en: 'Both win because everyone has more money.' },
          { de: 'Beide verlieren gleich viel.', en: 'Both lose the same amount.' }
        ],
        h1: { de: 'Überlege: Was kann man sich im November 1923 für 1 000 Mark noch kaufen?', en: 'Think: what can you still buy for 1,000 marks in November 1923?' },
        h2: { de: 'Schulden und Ersparnisse bleiben als Zahl gleich – aber die Zahl ist plötzlich fast nichts mehr wert.', en: 'Debts and savings stay the same as numbers – but suddenly the number is worth almost nothing.' },
        ex: { de: 'Inflation entwertet feste Geldbeträge. Sparer verlieren, Schuldner gewinnen. Die Angst davor prägte die deutsche Politik noch 1931.', en: 'Inflation destroys the value of fixed sums of money. Savers lose, debtors win. The fear of this still shaped German politics in 1931.' }
      },
      {
        id: 'm3',
        q: { de: 'Warum ist Deflation für die Wirtschaft gefährlich, obwohl alles billiger wird?', en: 'Why is deflation dangerous for the economy although everything gets cheaper?' },
        o: [
          { de: 'Weil die Menschen dann zu viel einkaufen.', en: 'Because people then buy too much.' },
          { de: 'Weil der Staat dann mehr Geld drucken muss.', en: 'Because the state then has to print more money.' },
          { de: 'Weil billige Waren schlechter sind.', en: 'Because cheap goods are worse.' },
          { de: 'Weil Firmen weniger verdienen, Löhne kürzen und Menschen entlassen.', en: 'Because firms earn less, cut wages and lay people off.', ok: true }
        ],
        h1: { de: 'Schau dir die Deflationsspirale noch einmal an: Was folgt auf „Preise fallen“?', en: 'Look at the deflation spiral again: what follows “Prices fall”?' },
        h2: { de: 'Denke an die Firmen: Ihre Einnahmen sinken, ihre Schulden nicht.', en: 'Think of the firms: their income falls, their debts do not.' },
        ex: { de: 'Fallende Preise bedeuten fallende Einnahmen. Firmen entlassen, Arbeitslose kaufen noch weniger – ein Teufelskreis.', en: 'Falling prices mean falling income. Firms lay people off, the unemployed buy even less – a vicious circle.' }
      }
    ]
  };

  /* ---------- Page 3: sources ---------- */
  C.sourcesIntro = {
    de: 'Sieben Quellen, sieben Blickwinkel. Lies zuerst das Original. Frage dich bei jeder Quelle: Wer spricht? Wann? Zu wem? Mit welcher Absicht?',
    en: 'Seven sources, seven points of view. Read the original first. Ask yourself for every source: who is speaking? When? To whom? With what intention?'
  };
  C.sourcesMethod = [
    { de: '1. Beschreiben: Wer? Wann? Welche Art von Quelle?', en: '1. Describe: who? when? what kind of source?' },
    { de: '2. Untersuchen: Was wird behauptet? Welche Wörter fallen auf?', en: '2. Examine: what is claimed? Which words stand out?' },
    { de: '3. Beurteilen: Welche Absicht steckt dahinter? Wie zuverlässig ist die Quelle?', en: '3. Judge: what is the intention behind it? How reliable is the source?' }
  ];
  C.noteStarter = {
    de: 'Satzanfänge: „Der Verfasser will erreichen, dass …“ · „Die Quelle zeigt die Sicht von …“ · “The author wants to …” · “This source shows the view of …”',
    en: 'Sentence starters: “The author wants to …” · “This source shows the view of …” · „Der Verfasser will erreichen, dass …“ · „Die Quelle zeigt die Sicht von …“'
  };

  C.sources = [
    {
      id: 's1', lang: 'en',
      title: { de: 'Der Präsident beruhigt', en: 'The President reassures' },
      who: { de: 'Herbert Hoover, Präsident der USA', en: 'Herbert Hoover, President of the USA' },
      when: { de: '25. Oktober 1929 – einen Tag nach dem „Schwarzen Donnerstag“', en: '25 October 1929 – one day after “Black Thursday”' },
      persp: { de: 'Regierung', en: 'Government' },
      original: '“The fundamental business of the country, that is the production and distribution of commodities, is on a sound and prosperous basis.”',
      trans: '„Das grundlegende Geschäft des Landes, nämlich die Herstellung und Verteilung von Waren, steht auf einer gesunden und blühenden Grundlage.“',
      words: [['fundamental', 'grundlegend'], ['commodities', 'Waren'], ['sound', 'gesund, solide'], ['prosperous', 'blühend, wohlhabend']],
      ctx: { de: 'Am Tag zuvor waren die Aktienkurse eingebrochen. Reporter fragten den Präsidenten nach der Lage.', en: 'The day before, share prices had collapsed. Reporters asked the President about the situation.' },
      cite: 'Herbert Hoover, Statement on the National Business and Economic Situation, 25 Oct 1929. The American Presidency Project, UC Santa Barbara.',
      quiz: {
        id: 'q1',
        q: { de: 'Welche Absicht verfolgt Hoover mit diesem Satz?', en: 'What is Hoover’s intention with this sentence?' },
        o: [
          { de: 'Er will die Menschen beruhigen, damit keine Panik entsteht.', en: 'He wants to calm people down so that there is no panic.', ok: true },
          { de: 'Er will vor einer schweren Krise warnen.', en: 'He wants to warn of a severe crisis.' },
          { de: 'Er will neue Zölle ankündigen.', en: 'He wants to announce new tariffs.' },
          { de: 'Er will die Banken beschuldigen.', en: 'He wants to blame the banks.' }
        ],
        h1: { de: 'Achte auf das Datum: Was ist am Tag vorher passiert?', en: 'Look at the date: what happened the day before?' },
        h2: { de: 'Die Wörter “sound” und “prosperous” sind sehr positiv – mitten in einem Börsenkrach.', en: 'The words “sound” and “prosperous” are very positive – in the middle of a stock market crash.' },
        ex: { de: 'Hoover spricht als Präsident zur Öffentlichkeit. Er will Vertrauen schaffen. Ob die Lage wirklich „gesund“ war, sagt der Satz nicht – das musst du mit anderen Quellen prüfen.', en: 'Hoover speaks to the public as President. He wants to create trust. The sentence does not tell us whether things really were “sound” – you must check that with other sources.' }
      }
    },
    {
      id: 's2', lang: 'en',
      title: { de: 'Der Finanzminister: „Lasst es brennen“', en: 'The Treasury Secretary: “Let it burn”' },
      who: { de: 'Andrew Mellon, US-Finanzminister und einer der reichsten Männer der USA – so, wie Hoover sich später an seinen Rat erinnerte', en: 'Andrew Mellon, US Treasury Secretary and one of the richest men in the USA – as Hoover later remembered his advice' },
      when: { de: 'Rat von 1929/30; aufgeschrieben in Hoovers Erinnerungen, erschienen 1952', en: 'Advice from 1929/30; written down in Hoover’s memoirs, published in 1952' },
      persp: { de: 'Regierung / Großunternehmer', en: 'Government / big business' },
      original: '“Liquidate labor, liquidate stocks, liquidate the farmers, liquidate real estate. […] It will purge the rottenness out of the system.”',
      trans: '„Liquidiert die Arbeit, liquidiert die Aktien, liquidiert die Farmer, liquidiert die Immobilien. […] Das wird die Fäulnis aus dem System spülen.“',
      words: [['to liquidate', 'auflösen, zu Geld machen – hier: pleitegehen lassen'], ['real estate', 'Immobilien (Häuser, Grundstücke)'], ['to purge', 'reinigen, ausspülen'], ['rottenness', 'Fäulnis']],
      ctx: { de: 'Mellon meinte: Der Staat soll nicht helfen. Schwache Firmen und Banken sollen untergehen, dann erholt sich die Wirtschaft von selbst.', en: 'Mellon’s view: the state should not help. Weak firms and banks should go under; then the economy will recover by itself.' },
      cite: 'Herbert Hoover, The Memoirs of Herbert Hoover, vol. 3: The Great Depression, 1929–1941. New York: Macmillan 1952, p. 30.',
      quiz: {
        id: 'q2',
        q: { de: 'Warum müssen Historiker bei dieser Quelle besonders vorsichtig sein?', en: 'Why must historians be especially careful with this source?' },
        o: [
          { de: 'Weil Mellon kein Englisch sprach.', en: 'Because Mellon did not speak English.' },
          { de: 'Weil die Quelle aus einer Zeitung stammt.', en: 'Because the source comes from a newspaper.' },
          { de: 'Weil Hoover die Worte erst über 20 Jahre später aus der Erinnerung aufschrieb – und selbst gut dastehen wollte.', en: 'Because Hoover wrote the words down from memory more than 20 years later – and wanted to look good himself.', ok: true },
          { de: 'Weil Mellon 1929 noch gar nicht Minister war.', en: 'Because Mellon was not yet a minister in 1929.' }
        ],
        h1: { de: 'Vergleiche zwei Jahreszahlen: Wann wurde der Rat gegeben, wann aufgeschrieben?', en: 'Compare two dates: when was the advice given, when was it written down?' },
        h2: { de: 'Der Verfasser ist nicht Mellon, sondern Hoover – der Präsident, dem viele die Schuld an der Krise gaben.', en: 'The author is not Mellon but Hoover – the President whom many blamed for the crisis.' },
        ex: { de: 'Erinnerungen (Memoiren) entstehen im Rückblick. Hoover stellt Mellon als hart dar und sich selbst als denjenigen, der anders handeln wollte. Das kann stimmen – ist aber seine Sicht.', en: 'Memoirs are written looking back. Hoover presents Mellon as harsh and himself as the one who wanted to act differently. That may be true – but it is his view.' }
      }
    },
    {
      id: 's3', lang: 'en',
      title: { de: '1 028 Ökonomen warnen', en: '1,028 economists warn' },
      who: { de: '1 028 Wirtschaftswissenschaftler der USA', en: '1,028 American economists' },
      when: { de: 'Mai 1930 – offener Brief an den Kongress und Präsident Hoover', en: 'May 1930 – open letter to Congress and President Hoover' },
      persp: { de: 'Wissenschaft', en: 'Experts / science' },
      original: '“We are convinced that increased protective duties would be a mistake. They would operate, in general, to increase the prices which domestic consumers would have to pay.”',
      trans: '„Wir sind überzeugt, dass höhere Schutzzölle ein Fehler wären. Sie würden im Allgemeinen die Preise erhöhen, die die Verbraucher im Inland zahlen müssten.“',
      words: [['convinced', 'überzeugt'], ['protective duties', 'Schutzzölle'], ['domestic consumers', 'Verbraucher im eigenen Land']],
      ctx: { de: 'Der Kongress plante sehr hohe Zölle, um Farmer und Fabriken der USA vor ausländischer Konkurrenz zu schützen (Smoot-Hawley-Gesetz).', en: 'Congress was planning very high tariffs to protect US farmers and factories from foreign competition (Smoot-Hawley Act).' },
      cite: 'Petition of 1,028 economists against the Smoot-Hawley Tariff, May 1930; printed in The New York Times, 5 May 1930, and in the Congressional Record.',
      quiz: {
        id: 'q3',
        q: { de: 'Hoover unterschrieb das Zollgesetz trotzdem. Was sagt die Quelle über seine Entscheidung aus?', en: 'Hoover signed the tariff act anyway. What does the source tell us about his decision?' },
        o: [
          { de: 'Niemand konnte wissen, dass Zölle schaden würden.', en: 'Nobody could know that tariffs would do harm.' },
          { de: 'Es gab schon damals deutliche Warnungen von Fachleuten.', en: 'There were clear warnings from experts even at the time.', ok: true },
          { de: 'Die Ökonomen wollten noch höhere Zölle.', en: 'The economists wanted even higher tariffs.' },
          { de: 'Die Verbraucher forderten das Gesetz.', en: 'Consumers demanded the act.' }
        ],
        h1: { de: 'Achte auf das Datum des Briefs und das Datum des Gesetzes (Juni 1930).', en: 'Look at the date of the letter and the date of the act (June 1930).' },
        h2: { de: 'Das Wort “mistake” ist eindeutig – und es steht dort vor der Entscheidung.', en: 'The word “mistake” is clear – and it was written before the decision.' },
        ex: { de: 'Die Quelle zeigt: Die Folgen waren nicht unvorhersehbar. Das ist wichtig, wenn du Hoovers Entscheidung beurteilst – er hatte die Wahl.', en: 'The source shows that the consequences were not unforeseeable. This matters when you judge Hoover’s decision – he had a choice.' }
      }
    },
    {
      id: 's4', lang: 'de',
      title: { de: 'Der Kanzler verlangt Opfer', en: 'The Chancellor demands sacrifices' },
      who: { de: 'Heinrich Brüning, deutscher Reichskanzler (Zentrumspartei)', en: 'Heinrich Brüning, German Chancellor (Centre Party)' },
      when: { de: 'Rede im November 1931', en: 'Speech in November 1931' },
      persp: { de: 'Regierung (Deutschland)', en: 'Government (Germany)' },
      original: '„Wir werden uns darauf einstellen müssen, daß wir auch neue Opfer vom Volke zur Sicherung der Etats der öffentlichen Hand verlangen müssen.“',
      trans: '“We will have to prepare ourselves for demanding new sacrifices from the people as well, in order to secure the public budgets.”',
      words: [['das Opfer', 'sacrifice'], ['der Etat', 'budget'], ['die öffentliche Hand', 'the state / public authorities'], ['sich einstellen auf', 'to prepare for']],
      ctx: { de: 'Brüning regierte mit Notverordnungen: Löhne, Gehälter und Arbeitslosenhilfe wurden gekürzt, Steuern erhöht. Viele nannten ihn den „Hungerkanzler“. Er wollte auch zeigen, dass Deutschland die Reparationen nicht mehr zahlen kann.', en: 'Brüning governed by emergency decrees: wages, salaries and unemployment benefits were cut, taxes raised. Many called him the “Hunger Chancellor”. He also wanted to show that Germany could no longer pay reparations.' },
      cite: 'Heinrich Brüning, Rede vom November 1931, in: ders., Reden und Aufsätze eines deutschen Staatsmanns, hg. v. W. Vernekohl u. R. Morsey, Münster 1968, S. 66–85; online: Deutsche Geschichte in Dokumenten und Bildern (GHDI).',
      quiz: {
        id: 'q4',
        q: { de: 'Was bedeutet Brünings Politik der „Opfer“ für die Deflationsspirale?', en: 'What does Brüning’s policy of “sacrifices” mean for the deflation spiral?' },
        o: [
          { de: 'Sie stoppt die Spirale, weil der Staat spart.', en: 'It stops the spiral because the state saves money.' },
          { de: 'Sie hat keine Wirkung auf die Wirtschaft.', en: 'It has no effect on the economy.' },
          { de: 'Sie führt zu Inflation wie 1923.', en: 'It leads to inflation as in 1923.' },
          { de: 'Sie verstärkt die Spirale: Wer weniger Lohn bekommt, kauft noch weniger.', en: 'It makes the spiral worse: people who get lower wages buy even less.', ok: true }
        ],
        h1: { de: 'Gehe zur Seite „Geld & Preise“ zurück und suche die Station „Menschen kaufen weniger“.', en: 'Go back to the “Money & Prices” page and find the station “People buy less”.' },
        h2: { de: '„Opfer“ heißt hier: weniger Lohn, weniger Unterstützung, höhere Steuern.', en: '“Sacrifices” here means: lower wages, less support, higher taxes.' },
        ex: { de: 'Sparen in der Krise senkt die Nachfrage weiter. Brüning hatte aber Gründe: die Angst vor einer neuen Inflation wie 1923, kaum Kredit aus dem Ausland und das Ziel, die Reparationen loszuwerden.', en: 'Austerity in a crisis lowers demand even further. But Brüning had reasons: fear of a new inflation like 1923, hardly any credit from abroad, and the aim of getting rid of reparations.' }
      }
    },
    {
      id: 's5', lang: 'en',
      title: { de: 'Ein Ökonom jubelt', en: 'An economist rejoices' },
      who: { de: 'John Maynard Keynes, britischer Wirtschaftswissenschaftler', en: 'John Maynard Keynes, British economist' },
      when: { de: '27. September 1931 – sechs Tage, nachdem Großbritannien den Goldstandard verlassen hatte', en: '27 September 1931 – six days after Britain left the gold standard' },
      persp: { de: 'Wissenschaft / Kritiker', en: 'Expert / critic' },
      original: '“There are few Englishmen who do not rejoice at the breaking of our gold fetters. We feel that we have at last a free hand to do what is sensible.”',
      trans: '„Es gibt wenige Engländer, die sich nicht über das Zerbrechen unserer goldenen Fesseln freuen. Wir spüren, dass wir endlich freie Hand haben, das Vernünftige zu tun.“',
      words: [['to rejoice', 'jubeln, sich freuen'], ['fetters', 'Fesseln'], ['sensible', 'vernünftig (nicht: sensibel!)']],
      ctx: { de: 'Im Goldstandard durfte ein Land nur so viel Geld schaffen, wie es Gold besaß. Keynes hielt das in der Krise für falsch.', en: 'Under the gold standard a country could only create as much money as it had gold. Keynes thought this was wrong in a crisis.' },
      cite: 'John Maynard Keynes, “The End of the Gold Standard” (27 Sept 1931), in: Essays in Persuasion, London: Macmillan 1931.',
      quiz: {
        id: 'q5',
        q: { de: 'Keynes nennt den Goldstandard “fetters” (Fesseln). Was will er mit diesem Sprachbild sagen?', en: 'Keynes calls the gold standard “fetters”. What does he want to say with this image?' },
        o: [
          { de: 'Gold ist zu schwer zum Transportieren.', en: 'Gold is too heavy to transport.' },
          { de: 'Der Goldstandard hat die Regierung daran gehindert, die Krise zu bekämpfen.', en: 'The gold standard stopped the government from fighting the crisis.', ok: true },
          { de: 'Großbritannien war ein Gefangener der USA.', en: 'Britain was a prisoner of the USA.' },
          { de: 'Die Engländer sollen mehr Gold kaufen.', en: 'The English should buy more gold.' }
        ],
        h1: { de: 'Was tut eine Fessel mit einem Menschen? Übertrage das auf eine Regierung.', en: 'What do fetters do to a person? Transfer that to a government.' },
        h2: { de: 'Lies den zweiten Satz: “a free hand to do what is sensible”.', en: 'Read the second sentence: “a free hand to do what is sensible”.' },
        ex: { de: 'Ohne Goldbindung konnte die Zentralbank mehr Geld bereitstellen und so die Deflation bremsen. Länder, die früh ausstiegen, erholten sich meist früher. Keynes ist aber parteiisch: Er hatte den Goldstandard schon lange kritisiert.', en: 'Without the link to gold, the central bank could provide more money and so slow down deflation. Countries that left early mostly recovered earlier. But Keynes is not neutral: he had criticised the gold standard for a long time.' }
      }
    },
    {
      id: 's6', lang: 'en',
      title: { de: 'Der neue Präsident macht Mut', en: 'The new President gives courage' },
      who: { de: 'Franklin D. Roosevelt, neuer Präsident der USA', en: 'Franklin D. Roosevelt, new President of the USA' },
      when: { de: '4. März 1933 – Rede zur Amtseinführung, im Radio übertragen', en: '4 March 1933 – inaugural address, broadcast on the radio' },
      persp: { de: 'Regierung (neu gewählt)', en: 'Government (newly elected)' },
      original: '“[…] the only thing we have to fear is fear itself […]. Our greatest primary task is to put people to work.”',
      trans: '„[…] das Einzige, was wir zu fürchten haben, ist die Furcht selbst […]. Unsere größte und wichtigste Aufgabe ist es, die Menschen in Arbeit zu bringen.“',
      words: [['to fear', 'fürchten'], ['primary task', 'wichtigste Aufgabe'], ['to put people to work', 'Menschen in Arbeit bringen']],
      ctx: { de: 'Fast jeder vierte Amerikaner war arbeitslos, tausende Banken waren geschlossen. Roosevelt hatte im Wahlkampf einen „New Deal“ versprochen.', en: 'Almost one in four Americans was unemployed; thousands of banks were closed. In the election campaign Roosevelt had promised a “New Deal”.' },
      cite: 'Franklin D. Roosevelt, First Inaugural Address, Washington, D.C., 4 March 1933. The American Presidency Project, UC Santa Barbara.',
      quiz: {
        id: 'q6',
        q: { de: 'Vergleiche Roosevelt (1933) mit Hoover (1929, Quelle 1). Was ist der wichtigste Unterschied?', en: 'Compare Roosevelt (1933) with Hoover (1929, source 1). What is the most important difference?' },
        o: [
          { de: 'Roosevelt sagt, die Wirtschaft sei gesund.', en: 'Roosevelt says the economy is sound.' },
          { de: 'Hoover verspricht Arbeitsplätze, Roosevelt nicht.', en: 'Hoover promises jobs, Roosevelt does not.' },
          { de: 'Beide sagen genau dasselbe.', en: 'Both say exactly the same.' },
          { de: 'Roosevelt gibt die Krise zu und kündigt an, dass der Staat handeln wird.', en: 'Roosevelt admits the crisis and announces that the state will act.', ok: true }
        ],
        h1: { de: 'Lies beide Zitate noch einmal nebeneinander: Wer spricht von einer Aufgabe?', en: 'Read both quotations again side by side: who speaks of a task?' },
        h2: { de: '“to put people to work” – wer soll das tun?', en: '“to put people to work” – who is supposed to do that?' },
        ex: { de: 'Beide wollen Vertrauen schaffen. Hoover tut es, indem er die Lage schönredet; Roosevelt, indem er das Problem benennt und Handeln verspricht. Auch das ist eine Rede mit Absicht: Sie soll Mut machen.', en: 'Both want to create trust. Hoover does it by making things sound better than they are; Roosevelt by naming the problem and promising action. This, too, is a speech with a purpose: it is meant to give courage.' }
      }
    },
    {
      id: 's7', lang: 'de', table: true,
      title: { de: 'Die Betroffenen – in Zahlen', en: 'The people affected – in numbers' },
      who: { de: 'Statistik (keine einzelne Person)', en: 'Statistics (no single person)' },
      when: { de: 'Deutschland 1928–1933', en: 'Germany 1928–1933' },
      persp: { de: 'Bevölkerung', en: 'The population' },
      original: 'Arbeitslose im Jahresdurchschnitt (Mio.) · Stimmenanteil der NSDAP bei Reichstagswahlen',
      trans: 'Unemployed, yearly average (millions) · Nazi party share of the vote in Reichstag elections',
      rows: [['1928', '1,4', '2,6 % (Mai)'], ['1929', '1,9', '–'], ['1930', '3,1', '18,3 % (Sept.)'], ['1931', '4,5', '–'], ['1932', '5,6', '37,3 % (Juli) · 33,1 % (Nov.)'], ['1933', '4,8', '43,9 % (März, nicht mehr frei)']],
      head: { de: ['Jahr', 'Arbeitslose (Mio.)', 'NSDAP-Stimmen'], en: ['Year', 'Unemployed (millions)', 'Nazi party vote'] },
      words: [['der Arbeitslose', 'unemployed person'], ['der Jahresdurchschnitt', 'yearly average'], ['der Stimmenanteil', 'share of the vote']],
      ctx: { de: 'Arbeitslose und ihre Familien haben selten Reden gehalten oder Bücher geschrieben. Ihre Lage erkennen wir oft nur in Statistiken – und in Wahlergebnissen. Eine persönliche Stimme (Brief, Tagebuch, Foto) fehlt hier bewusst: Suche eine im Schulbuch und vergleiche.', en: 'Unemployed people and their families rarely gave speeches or wrote books. Often we see their situation only in statistics – and in election results. A personal voice (letter, diary, photo) is deliberately missing here: find one in your textbook and compare.' },
      cite: 'Gerundete Werte nach: Statistisches Jahrbuch für das Deutsche Reich; amtliche Wahlergebnisse der Reichstagswahlen 1928–1933.',
      quiz: {
        id: 'q7',
        q: { de: 'Welche Aussage lässt sich mit dieser Statistik am besten begründen?', en: 'Which statement can best be supported with these statistics?' },
        o: [
          { de: 'Die Arbeitslosigkeit war die einzige Ursache für Hitlers Aufstieg.', en: 'Unemployment was the only cause of Hitler’s rise.' },
          { de: 'Alle Arbeitslosen wählten die NSDAP.', en: 'All unemployed people voted for the Nazi party.' },
          { de: 'Mit der Arbeitslosigkeit wuchs auch die Zustimmung zur NSDAP – die Krise half den Gegnern der Demokratie.', en: 'As unemployment grew, so did support for the Nazi party – the crisis helped the enemies of democracy.', ok: true },
          { de: 'Die Krise hatte keine politischen Folgen.', en: 'The crisis had no political consequences.' }
        ],
        h1: { de: 'Vorsicht bei den Wörtern „einzige“ und „alle“: Kann eine Statistik das beweisen?', en: 'Be careful with the words “only” and “all”: can statistics prove that?' },
        h2: { de: 'Die Tabelle zeigt, dass zwei Zahlen gleichzeitig steigen – nicht, wer wen gewählt hat.', en: 'The table shows that two numbers rise at the same time – not who voted for whom.' },
        ex: { de: 'Die Statistik zeigt einen Zusammenhang, keinen Beweis für eine einzige Ursache. Viele Arbeitslose wählten z. B. auch die KPD. Sicher ist: Not und Angst schwächten das Vertrauen in die Weimarer Demokratie.', en: 'The statistics show a connection, not proof of a single cause. Many unemployed people also voted Communist, for example. What is certain: hardship and fear weakened trust in Weimar democracy.' }
      }
    }
  ];

  /* ---------- Page 4: decisions ---------- */
  C.decideIntro = {
    de: 'Jetzt entscheidest du – sechs Mal, an der Stelle der Verantwortlichen. Es gibt kein „richtig“ per Mausklick: Nach jeder Wahl erfährst du, was wirklich geschah. Deine Entscheidungen 1, 2, 3, 5 und 6 steuern danach den Simulator.',
    en: 'Now you decide – six times, in the place of the people in charge. There is no “right” answer by mouse click: after every choice you learn what really happened. Your decisions 1, 2, 3, 5 and 6 then control the simulator.'
  };
  C.decisions = [
    {
      id: 'd1', hist: 0,
      when: { de: 'November 1929', en: 'November 1929' },
      role: { de: 'Präsident Herbert Hoover', en: 'President Herbert Hoover' },
      sit: { de: 'Die Aktienkurse sind um ein Drittel gefallen. Firmen stoppen Aufträge. Dein Finanzminister Mellon rät: nichts tun.', en: 'Share prices have fallen by a third. Firms are stopping orders. Your Treasury Secretary Mellon advises: do nothing.' },
      o: [
        { t: { de: 'Beruhigen und die Firmen bitten, Löhne nicht zu senken – aber den Staatshaushalt ausgeglichen halten.', en: 'Reassure, and ask firms not to cut wages – but keep the state budget balanced.' }, set: { spending: -10 } },
        { t: { de: 'Mellons Rat folgen: Der Staat spart und lässt schwache Firmen untergehen.', en: 'Follow Mellon’s advice: the state saves money and lets weak firms go under.' }, set: { spending: -40 } },
        { t: { de: 'Schulden machen und sofort große Bauprogramme starten, um Arbeit zu schaffen.', en: 'Take on debt and immediately start large building programmes to create jobs.' }, set: { spending: 35 } }
      ],
      real: { de: 'Hoover beruhigte, bat die Firmen um Mithilfe und begann einige Bauprojekte. Als die Steuereinnahmen sanken, erhöhte er 1932 aber die Steuern, um den Haushalt auszugleichen. Große Staatsschulden galten damals fast allen als gefährlich.', en: 'Hoover reassured, asked firms to cooperate and began some building projects. But when tax income fell, he raised taxes in 1932 to balance the budget. At the time almost everyone thought large state debts were dangerous.' }
    },
    {
      id: 'd2', hist: 0,
      when: { de: 'Juni 1930', en: 'June 1930' },
      role: { de: 'Präsident Herbert Hoover', en: 'President Herbert Hoover' },
      sit: { de: 'Der Kongress hat das Smoot-Hawley-Gesetz beschlossen: sehr hohe Zölle auf über 20 000 Waren. Farmer und Fabrikbesitzer jubeln. 1 028 Ökonomen warnen (Quelle 3). Du musst unterschreiben – oder ablehnen.', en: 'Congress has passed the Smoot-Hawley Act: very high tariffs on more than 20,000 goods. Farmers and factory owners cheer. 1,028 economists warn (source 3). You must sign – or refuse.' },
      o: [
        { t: { de: 'Unterschreiben: US-Arbeitsplätze vor ausländischen Waren schützen.', en: 'Sign: protect American jobs from foreign goods.' }, set: { tariffs: 85 } },
        { t: { de: 'Veto einlegen: Die Zölle bleiben, wie sie sind.', en: 'Veto: tariffs stay as they are.' }, set: { tariffs: 40 } },
        { t: { de: 'Veto einlegen und mit anderen Ländern über niedrigere Zölle verhandeln.', en: 'Veto, and negotiate lower tariffs with other countries.' }, set: { tariffs: 15 } }
      ],
      real: { de: 'Hoover unterschrieb. Kanada, Frankreich, Spanien und andere antworteten mit eigenen Zöllen. Der Welthandel schrumpfte bis 1933 auf etwa ein Drittel. Wie viel davon an den Zöllen lag und wie viel an der Krise selbst, ist unter Historikern umstritten.', en: 'Hoover signed. Canada, France, Spain and others answered with tariffs of their own. By 1933 world trade had shrunk to about one third. How much of this was due to tariffs and how much to the crisis itself is debated among historians.' }
    },
    {
      id: 'd3', hist: 0,
      when: { de: 'Dezember 1930', en: 'December 1930' },
      role: { de: 'Die Leitung der US-Zentralbank (Federal Reserve)', en: 'The board of the US central bank (Federal Reserve)' },
      sit: { de: 'In New York stehen Tausende vor der „Bank of United States“ und wollen ihr Erspartes. Hunderte kleiner Banken wanken. Du könntest ihnen Geld leihen – aber dein Gold ist begrenzt.', en: 'In New York thousands are queuing outside the “Bank of United States” to get their savings. Hundreds of small banks are shaking. You could lend them money – but your gold is limited.' },
      o: [
        { t: { de: 'Nicht eingreifen: Schlecht geführte Banken sollen schließen.', en: 'Do not step in: badly run banks should close.' }, set: { bankHelp: 10 } },
        { t: { de: 'Nur den größten Banken etwas Geld leihen.', en: 'Lend a little money to the biggest banks only.' }, set: { bankHelp: 45 } },
        { t: { de: 'Allen Banken so viel Geld leihen, wie sie brauchen, bis die Panik endet.', en: 'Lend all banks as much money as they need until the panic ends.' }, set: { bankHelp: 90 } }
      ],
      real: { de: 'Die Zentralbank griff kaum ein. Bis 1933 schlossen rund 9 000 Banken – mehr als jede dritte. Millionen Sparer verloren ihr Geld, die Geldmenge schrumpfte um etwa ein Drittel. Viele Ökonomen halten das heute für den schwersten Fehler der Krise.', en: 'The central bank hardly stepped in. By 1933 about 9,000 banks had closed – more than one in three. Millions of savers lost their money; the money supply shrank by about a third. Many economists today consider this the worst mistake of the crisis.' }
    },
    {
      id: 'd4', hist: 0, noSim: true,
      when: { de: 'Sommer 1931', en: 'Summer 1931' },
      role: { de: 'Reichskanzler Heinrich Brüning', en: 'Chancellor Heinrich Brüning' },
      sit: { de: 'Deutschland: rund 4 Millionen Arbeitslose. Ausländische Banken holen ihre Kredite zurück, die Danat-Bank ist pleite. Im Reichstag hast du keine Mehrheit. Alle erinnern sich an die Inflation von 1923. Und die Reparationen müssen bezahlt werden.', en: 'Germany: about 4 million unemployed. Foreign banks are taking their loans back; the Danat Bank has failed. You have no majority in the Reichstag. Everyone remembers the inflation of 1923. And reparations have to be paid.' },
      o: [
        { t: { de: 'Sparen per Notverordnung: Löhne, Gehälter und Unterstützung kürzen, Steuern erhöhen.', en: 'Austerity by emergency decree: cut wages, salaries and benefits, raise taxes.' } },
        { t: { de: 'Neue Schulden machen und Arbeitsprogramme starten (z. B. Straßenbau).', en: 'Take on new debt and start work programmes (e.g. road building).' } },
        { t: { de: 'Die Reichsbank Geld drucken lassen, um Löhne und Hilfe zu bezahlen.', en: 'Let the Reichsbank print money to pay wages and support.' } }
      ],
      real: { de: 'Brüning sparte. Die Arbeitslosigkeit stieg bis Februar 1932 auf über 6 Millionen. Seine Gründe: Kaum jemand lieh Deutschland noch Geld, Gelddrucken weckte die Angst vor 1923, und er wollte den Siegermächten zeigen, dass Deutschland die Reparationen nicht zahlen kann (1932 wurden sie tatsächlich beendet). Historiker streiten bis heute, ob er überhaupt eine andere Wahl hatte.', en: 'Brüning chose austerity. Unemployment rose to more than 6 million by February 1932. His reasons: hardly anyone would still lend Germany money, printing money raised fears of 1923, and he wanted to show the victors that Germany could not pay reparations (in 1932 they were indeed ended). Historians still argue about whether he had any other choice at all.' },
      note: { de: 'Diese Entscheidung betrifft Deutschland. Der Simulator rechnet nur mit den USA – sie verändert ihn deshalb nicht.', en: 'This decision concerns Germany. The simulator only calculates the USA – so it does not change it.' }
    },
    {
      id: 'd5', hist: 0,
      when: { de: 'Oktober 1931', en: 'October 1931' },
      role: { de: 'Die Leitung der US-Zentralbank (Federal Reserve)', en: 'The board of the US central bank (Federal Reserve)' },
      sit: { de: 'Großbritannien hat den Goldstandard verlassen (Quelle 5). Jetzt tauschen Anleger auch Dollars in Gold um – dein Goldvorrat schmilzt.', en: 'Britain has left the gold standard (source 5). Now investors are exchanging dollars for gold as well – your gold reserves are melting away.' },
      o: [
        { t: { de: 'Den Goldstandard verteidigen: Zinsen erhöhen, damit Anleger ihre Dollars behalten.', en: 'Defend the gold standard: raise interest rates so that investors keep their dollars.' }, set: { leaveGold: false } },
        { t: { de: 'Großbritannien folgen: den Goldstandard verlassen und mehr Geld bereitstellen.', en: 'Follow Britain: leave the gold standard and provide more money.' }, set: { leaveGold: true } }
      ],
      real: { de: 'Die Zentralbank erhöhte die Zinsen. Kredite wurden teurer, noch mehr Banken und Firmen gingen pleite. Die USA verließen den Goldstandard erst im April 1933 unter Roosevelt.', en: 'The central bank raised interest rates. Loans became more expensive; even more banks and firms failed. The USA only left the gold standard in April 1933 under Roosevelt.' }
    },
    {
      id: 'd6', hist: 0,
      when: { de: 'März 1933', en: 'March 1933' },
      role: { de: 'Präsident Franklin D. Roosevelt', en: 'President Franklin D. Roosevelt' },
      sit: { de: 'Dein erster Tag im Amt. In fast allen Bundesstaaten sind die Banken geschlossen. Ein Viertel der Arbeiter hat keine Stelle.', en: 'Your first day in office. In almost all states the banks are closed. A quarter of all workers have no job.' },
      o: [
        { t: { de: '„New Deal“: Banken prüfen und Ersparnisse garantieren, Goldstandard verlassen, Arbeitsprogramme starten.', en: '“New Deal”: check the banks and guarantee savings, leave the gold standard, start work programmes.' }, set: { newDeal: true } },
        { t: { de: 'Wie bisher weitermachen: sparen und warten, bis sich die Wirtschaft selbst erholt.', en: 'Carry on as before: save money and wait until the economy recovers by itself.' }, set: { newDeal: false } }
      ],
      real: { de: 'Roosevelt schloss alle Banken für eine Woche („Bank Holiday“), öffnete nur die gesunden wieder, garantierte Ersparnisse und startete Arbeitsprogramme. Das Vertrauen kehrte zurück. Vollbeschäftigung erreichten die USA aber erst im Zweiten Weltkrieg.', en: 'Roosevelt closed all banks for a week (“Bank Holiday”), reopened only the healthy ones, guaranteed savings and started work programmes. Trust returned. But the USA only reached full employment during the Second World War.' }
    }
  ];

  /* ---------- Page 5: simulator ---------- */
  C.sim = {
    intro: {
      de: 'Der Simulator rechnet die USA von 1929 bis 1933 in 18 Quartalen durch. Blau ist das Modell mit deinen Einstellungen, grau gestrichelt die echte Geschichte. Verändere immer nur eine Stellschraube und beobachte, was passiert.',
      en: 'The simulator calculates the USA from 1929 to 1933 in 18 quarters. Blue is the model with your settings; the grey dashed line is real history. Change only one control at a time and watch what happens.'
    },
    warn: {
      de: 'Achtung, Modell! Es ist stark vereinfacht und kennt nur wenige Regeln. Es zeigt Zusammenhänge – es beweist nicht, was „wirklich“ passiert wäre.',
      en: 'Careful, this is a model! It is highly simplified and knows only a few rules. It shows connections – it does not prove what “really” would have happened.'
    },
    controls: { de: 'Stellschrauben', en: 'Controls' },
    levers: {
      bankHelp: { de: 'Hilfe der Zentralbank für Banken', en: 'Central bank help for banks', lo: { de: 'keine', en: 'none' }, hi: { de: 'unbegrenzt', en: 'unlimited' } },
      spending: { de: 'Staatsausgaben', en: 'Government spending', lo: { de: 'hart sparen', en: 'hard cuts' }, hi: { de: 'Arbeitsprogramme', en: 'job programmes' } },
      tariffs: { de: 'Zölle', en: 'Tariffs', lo: { de: 'Freihandel', en: 'free trade' }, hi: { de: 'sehr hoch', en: 'very high' } }
    },
    switches: {
      insurance: { de: 'Staat garantiert Ersparnisse (ab 1929)', en: 'State guarantees savings (from 1929)' },
      leaveGold: { de: 'Goldstandard Ende 1931 verlassen', en: 'Leave the gold standard at the end of 1931' },
      newDeal: { de: '„New Deal“ ab Frühjahr 1933', en: '“New Deal” from spring 1933' }
    },
    charts: {
      stocks: { de: 'Aktienkurse', en: 'Share prices', u: '' },
      output: { de: 'Industrieproduktion', en: 'Industrial production', u: '' },
      unemployment: { de: 'Arbeitslosigkeit', en: 'Unemployment', u: ' %' },
      prices: { de: 'Preise', en: 'Prices', u: '' },
      banks: { de: 'Geschlossene Banken', en: 'Closed banks', u: ' %' },
      trade: { de: 'Welthandel', en: 'World trade', u: '' }
    },
    indexNote: { de: 'Aktien, Produktion, Preise, Handel: 1929 = 100. Historische Werte gerundet.', en: 'Shares, production, prices, trade: 1929 = 100. Historical values rounded.' },
    legendSim: { de: 'Modell mit deinen Einstellungen', en: 'Model with your settings' },
    legendHist: { de: 'Geschichte', en: 'History' },
    summary: { de: 'Ende 1933 im Modell', en: 'End of 1933 in the model' },
    chartAlt: { de: 'Liniendiagramm, Modell und Geschichte im Vergleich. Endwerte stehen in der Zusammenfassung.', en: 'Line chart comparing model and history. Final values are in the summary.' },
    missionsTitle: { de: 'Forschungsaufträge', en: 'Research missions' },
    missions: [
      { id: 'mis1', de: 'Halte die Arbeitslosigkeit in allen Quartalen unter 15 %.', en: 'Keep unemployment below 15% in every quarter.' },
      { id: 'mis2', de: 'Starte bei „Wie in der Geschichte“ und verändere nur EINE Stellschraube so, dass am Ende weniger als 10 % der Banken geschlossen sind.', en: 'Start from “As in history” and change only ONE control so that fewer than 10% of banks are closed at the end.' }
    ],
    missionHint: { de: 'Tipp: Welche Regel im Modell hängt direkt mit den Banken zusammen? Öffne „So rechnet das Modell“.', en: 'Hint: which rule in the model is directly linked to the banks? Open “How the model calculates”.' },
    rulesTitle: { de: 'So rechnet das Modell (8 Regeln)', en: 'How the model calculates (8 rules)' },
    rules: [
      { de: 'Banken: Panik lässt Banken schließen. Hilfe der Zentralbank und garantierte Ersparnisse bremsen das.', en: 'Banks: panic makes banks close. Central bank help and guaranteed savings slow this down.' },
      { de: 'Geld: Jede geschlossene Bank vernichtet Geld. Im Goldstandard kann die Zentralbank nur wenig ersetzen.', en: 'Money: every closed bank destroys money. Under the gold standard the central bank can replace only a little.' },
      { de: 'Produktion: Weniger Geld und weniger Vertrauen bedeuten weniger Aufträge. Staatsausgaben bringen Aufträge, Zölle kosten Exporte.', en: 'Production: less money and less trust mean fewer orders. Government spending adds orders; tariffs cost exports.' },
      { de: 'Preise folgen der Geldmenge und der Nachfrage.', en: 'Prices follow the money supply and demand.' },
      { de: 'Vertrauen: Bankpleiten und fallende Preise zerstören es, Garantien und Hilfe bauen es auf.', en: 'Trust: bank failures and falling prices destroy it; guarantees and help rebuild it.' },
      { de: 'Aktien reagieren auf Produktion und Vertrauen.', en: 'Shares react to production and trust.' },
      { de: 'Welthandel folgt der Produktion; Zölle führen zu Gegenzöllen.', en: 'World trade follows production; tariffs lead to counter-tariffs.' },
      { de: 'Arbeitslosigkeit steigt, wenn die Produktion fällt.', en: 'Unemployment rises when production falls.' }
    ],
    rulesCode: { de: 'Die Regeln stehen als lesbarer Programmcode in der Datei js/model.js – du kannst sie dort nachlesen und sogar ändern.', en: 'The rules are written as readable code in the file js/model.js – you can read and even change them there.' }
  };

  /* ---------- Page 6: wrap-up ---------- */
  C.wrap = {
    intro: { de: 'Zum Schluss: Urteile selbst. Schreibe auf Deutsch oder Englisch – oder mische beides.', en: 'Finally: judge for yourself. Write in German or English – or mix both.' },
    reflect: [
      { id: 'r1', de: 'Welche der sechs Entscheidungen war aus deiner Sicht der größte Fehler? Begründe mit einer Quelle und einer Beobachtung aus dem Simulator.', en: 'Which of the six decisions was the biggest mistake in your view? Give reasons using one source and one observation from the simulator.' },
      { id: 'r2', de: 'Im Modell reicht oft eine einzige Stellschraube, um die Krise fast zu verhindern. Warum war es in Wirklichkeit nicht so einfach? Was lässt das Modell weg?', en: 'In the model a single control is often enough to almost prevent the crisis. Why was it not that easy in reality? What does the model leave out?' },
      { id: 'r3', de: 'Erkläre einem Mitschüler in drei Sätzen, warum die Wirtschaftskrise die Demokratie in Deutschland gefährdete.', en: 'Explain to a classmate in three sentences why the economic crisis endangered democracy in Germany.' }
    ],
    results: { de: 'Deine Ergebnisse', en: 'Your results' },
    secQuiz: { de: 'Aufgaben', en: 'Tasks' },
    secDecide: { de: 'Entscheidungen', en: 'Decisions' },
    secNotes: { de: 'Notizen und Urteile', en: 'Notes and judgements' },
    secSim: { de: 'Simulator', en: 'Simulator' },
    simRow: { de: 'Meine letzte Einstellung im Simulator', en: 'My last simulator settings' },
    licence: {
      de: 'Diese App: © S. Ghofranifar, CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/). KI-assistiert erstellt mit dem „learning-artifacts-builder (lab-o5)“-Skill von Dominik Kluge (CC BY-SA 4.0), angepasst als Vibe-Coding-Lab-Skill.',
      en: 'This app: © S. Ghofranifar, CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/). Made with AI assistance using the “learning-artifacts-builder (lab-o5)” skill by Dominik Kluge (CC BY-SA 4.0), adapted as Vibe-Coding-Lab-Skill.'
    },
    libs: {
      de: 'Fremdmaterial mit eigener Lizenz: D3.js (ISC, © Mike Bostock), three.js (MIT, © three.js authors), Babylon.js (Apache-2.0, © Babylon.js contributors), Länderumrisse aus Natural Earth / world-atlas (gemeinfrei / ISC). Die Lizenztexte liegen im Ordner „vendor“.',
      en: 'Third-party material with its own licence: D3.js (ISC, © Mike Bostock), three.js (MIT, © three.js authors), Babylon.js (Apache-2.0, © Babylon.js contributors), land outlines from Natural Earth / world-atlas (public domain / ISC). Licence texts are in the “vendor” folder.'
    },
    dataNote: {
      de: 'Alle Zahlen sind gerundete Schulbuchwerte. Die Zitate wurden für diese App geprüft; die Übersetzungen sind eigene Arbeitsübersetzungen. KI-Ausgaben können Fehler enthalten – bitte vor dem Einsatz gegenlesen.',
      en: 'All numbers are rounded textbook values. The quotations were checked for this app; the translations are working translations made for it. AI output can contain mistakes – please proofread before use.'
    }
  };

  root.Content = C;
})(typeof window !== 'undefined' ? window : globalThis);
