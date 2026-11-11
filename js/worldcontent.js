/*
  KI-assistiert erstellt unter Verwendung des "learning-artifacts-builder (lab-o5)"-Skills, angepasst als Vibe-Coding-Lab-Skill
  Lizenz: CC BY-SA 4.0 (Dominik Kluge), https://creativecommons.org/licenses/by-sa/4.0/
  Sie dürfen: Teilen, Bearbeiten
  Bedingungen: Namensnennung, Weitergabe unter gleichen Bedingungen
*/
/*
  worldcontent.js – the four cities of the 3D time journey: people, dialogues, signs.

  real: true  = a historical person. What they say here is RECONSTRUCTED from their known positions,
                except for blocks marked "quote", which are original wording with a reference.
  real: false = an invented character who stands for a typical experience of the time.
  Every line has German (de) and English (en). In the world, people speak the language of
  their city (speak); the other language is the translation.
*/
(function (root) {
  'use strict';
  var W = {};

  W.ui = {
    title: { de: 'Zeitreise in 3D', en: 'Time journey in 3D' },
    intro: {
      de: 'Du bist Reporterin oder Reporter einer Schülerzeitung und reist durch vier Städte – einmal im Sommer 1929 und einmal mitten in der Krise. Geh herum, sprich mit den Menschen und setz dich an den Tisch der Regierenden.',
      en: 'You are a reporter for a school newspaper travelling through four cities – once in the summer of 1929 and once in the middle of the crisis. Walk around, talk to people and take a seat at the table of those in power.'
    },
    city: { de: 'Stadt', en: 'City' },
    time: { de: 'Zeit', en: 'Time' },
    goto: { de: 'Gehe zu …', en: 'Go to …' },
    start: { de: 'Startpunkt', en: 'Starting point' },
    table: { de: 'Konferenztisch', en: 'Conference table' },
    listMode: { de: 'Ohne 3D: Personen als Liste', en: 'Without 3D: people as a list' },
    listTitle: { de: 'Personen an diesem Ort', en: 'People in this place' },
    speech: { de: 'Vorlesen', en: 'Read aloud' },
    full: { de: 'Vollbild', en: 'Full screen' },
    help: {
      de: 'Bewegen: Steuerkreis unten links oder Tasten W A S D / Pfeiltasten (vorher in die Szene klicken). Umsehen: ziehen. Sprechen: Person antippen oder Taste E.',
      en: 'Move: control pad bottom left or keys W A S D / arrow keys (click into the scene first). Look around: drag. Talk: tap a person or press E.'
    },
    stageAlt: { de: 'Begehbare 3D-Szene. Alle Gespräche sind auch über „Ohne 3D: Personen als Liste“ erreichbar.', en: 'Walkable 3D scene. All conversations can also be reached via “Without 3D: people as a list”.' },
    stick: { de: 'Steuerkreis: ziehen zum Gehen und Drehen', en: 'Control pad: drag to walk and turn' },
    talkTo: { de: 'Sprechen mit', en: 'Talk to' },
    sit: { de: 'An den Tisch setzen', en: 'Take a seat at the table' },
    stand: { de: 'Aufstehen', en: 'Stand up' },
    close: { de: 'Gespräch beenden', en: 'End conversation' },
    ask: { de: 'Deine Fragen', en: 'Your questions' },
    showTr: { de: 'Übersetzung zeigen', en: 'Show translation' },
    hideTr: { de: 'Übersetzung verbergen', en: 'Hide translation' },
    real: { de: 'Historische Person – Aussagen sinngemäß nachgestellt', en: 'Historical person – statements reconstructed in substance' },
    fict: { de: 'Erfundene Figur – typische Erfahrung der Zeit', en: 'Invented character – a typical experience of the time' },
    quote: { de: 'Originalzitat', en: 'Original quotation' },
    met: { de: 'Gespräche geführt', en: 'Conversations held' },
    allMet: { de: '✓ Du hast hier mit allen gesprochen.', en: '✓ You have talked to everyone here.' },
    tableLater: { de: 'Konferenzraum – die Regierung tagt hier erst in der Krise. Wechsle die Zeit.', en: 'Conference room – the government only meets here during the crisis. Change the time.' },
    note: { de: 'Reporter-Notiz', en: 'Reporter’s note' },
    secWorld: { de: 'Zeitreise in 3D', en: 'Time journey in 3D' },
    people: { de: 'Personen', en: 'people' },
    cityOpen: { de: 'Zeitreise – noch nicht mit allen gesprochen in', en: 'Time journey – not yet talked to everyone in' }
  };

  W.cities = [
    /* ------------------------------------------------ NEW YORK */
    {
      id: 'ny', name: { de: 'New York', en: 'New York' }, speak: 'en', voice: 'en-US',
      times: {
        a: { label: { de: 'Sommer 1929', en: 'Summer 1929' }, intro: { de: 'Wall Street, Sommer 1929. Die Aktienkurse steigen seit Jahren. Fast alle glauben: Das geht immer so weiter.', en: 'Wall Street, summer 1929. Share prices have been rising for years. Almost everyone believes it will go on forever.' } },
        b: { label: { de: 'Oktober 1929 – der Crash', en: 'October 1929 – the crash' }, intro: { de: 'Wall Street, 29. Oktober 1929, „Schwarzer Dienstag“. Vor der Börse drängen sich Tausende. Alle wollen verkaufen, niemand will kaufen.', en: 'Wall Street, 29 October 1929, “Black Tuesday”. Thousands crowd in front of the stock exchange. Everyone wants to sell, nobody wants to buy.' } }
      },
      signs: {
        landmark: 'NEW YORK STOCK EXCHANGE', bank: { a: 'BANK · LOANS FOR SHARES', b: 'BANK · CLOSED' },
        board: { a: ['DOW JONES', '3 Sept 1929: 381', 'Record high!'], b: ['DOW JONES', '29 Oct 1929: 230', '16 million shares sold'] },
        news: { a: 'PROSPERITY FOR ALL!', b: 'WALL ST. LAYS AN EGG' },
        table: 'WASHINGTON · THE WHITE HOUSE · NOV 1929'
      },
      prompt: { de: 'New York: Warum konnte ein Kurssturz Menschen ruinieren, die nie reich waren? Nutze das Gespräch mit Mary.', en: 'New York: why could a fall in share prices ruin people who were never rich? Use your conversation with Mary.' },
      npcs: [
        { id: 'ny-mary-a', time: 'a', name: 'Mary Collins', role: { de: 'Sekretärin', en: 'Secretary' }, coat: '#b45309', hat: 'cloche', pos: [-6, 8],
          hello: { de: 'Hallo! Ich komme gerade von meinem Börsenmakler. Ich besitze jetzt Aktien – stell dir das vor!', en: 'Hello! I’ve just come from my broker. I own shares now – imagine that!' },
          qa: [
            { q: { de: 'Wie kann sich eine Sekretärin Aktien leisten?', en: 'How can a secretary afford shares?' }, a: { de: 'Auf Kredit! Ich zahle zehn Dollar an, die anderen neunzig leiht mir der Makler. Wenn der Kurs steigt, verkaufe ich, zahle den Kredit zurück und behalte den Gewinn.', en: 'On credit! I put down ten dollars and the broker lends me the other ninety. When the price goes up, I sell, pay back the loan and keep the profit.' } },
            { q: { de: 'Und wenn die Kurse fallen?', en: 'And what if prices fall?' }, a: { de: 'Dann will der Makler sofort sein Geld zurück. Aber die Kurse fallen nicht. Das sagen alle.', en: 'Then the broker wants his money back at once. But prices don’t fall. Everybody says so.' } }
          ] },
        { id: 'ny-broker-a', time: 'a', name: 'Mr Whitfield', role: { de: 'Börsenmakler', en: 'Stockbroker' }, coat: '#1f2937', hat: 'top', pos: [7, 2],
          hello: { de: 'Guten Tag! Suchen Sie eine sichere Geldanlage? Da sind Sie bei mir richtig.', en: 'Good day! Looking for a safe investment? You’ve come to the right man.' },
          qa: [
            { q: { de: 'Warum kaufen so viele Menschen Aktien?', en: 'Why are so many people buying shares?' }, a: { de: 'Radios, Autos, Kühlschränke – die Fabriken verkaufen wie nie. Wer vor ein paar Jahren gekauft hat, hat sein Geld vervielfacht. Jetzt wollen alle dabei sein.', en: 'Radios, cars, refrigerators – the factories are selling like never before. People who bought a few years ago have multiplied their money. Now everyone wants to join in.' } },
            { q: { de: 'Geht es wirklich allen so gut?', en: 'Is everyone really doing so well?' }, a: { de: 'Nun ja … die Farmer klagen über niedrige Preise, und viele Arbeiter verdienen zu wenig, um all die Waren zu kaufen. Aber darüber spricht an der Wall Street niemand.', en: 'Well … the farmers complain about low prices, and many workers earn too little to buy all those goods. But nobody on Wall Street talks about that.' } }
          ] },
        { id: 'ny-mary-b', time: 'b', name: 'Mary Collins', role: { de: 'Sekretärin', en: 'Secretary' }, coat: '#b45309', hat: 'cloche', pos: [-8, -11],
          hello: { de: 'Es ist alles weg. Alles, was ich gespart hatte.', en: 'It’s all gone. Everything I had saved.' },
          qa: [
            { q: { de: 'Was ist passiert?', en: 'What happened?' }, a: { de: 'Die Kurse sind gefallen, und der Makler wollte sofort seinen Kredit zurück. Ich musste verkaufen – wie Tausende andere zur gleichen Zeit. Dadurch fielen die Kurse noch schneller.', en: 'Prices fell, and the broker wanted his loan back at once. I had to sell – like thousands of others at the same moment. That made prices fall even faster.' } },
            { q: { de: 'Was machst du jetzt?', en: 'What will you do now?' }, a: { de: 'Ich schulde dem Makler immer noch Geld. Und mein Chef sagt, die Firma bekommt keine Aufträge mehr. Ich habe Angst um meine Stelle.', en: 'I still owe the broker money. And my boss says the company isn’t getting any more orders. I’m afraid for my job.' } }
          ] },
        { id: 'ny-tommy-b', time: 'b', name: 'Tommy', role: { de: 'Zeitungsjunge', en: 'Newsboy' }, coat: '#475569', hat: 'cap', pos: [5, -13],
          hello: { de: 'Extrablatt! Extrablatt! Börse bricht zusammen! – Wollen Sie eine Zeitung?', en: 'Extra! Extra! Stock market collapses! – Want a paper?' },
          qa: [
            { q: { de: 'Wie hat das angefangen?', en: 'How did it start?' }, a: { de: 'Am Donnerstag wollten plötzlich alle verkaufen. Ein paar große Bankiers haben Aktien gekauft, um die Leute zu beruhigen. Das hat nur übers Wochenende gehalten.', en: 'On Thursday everybody suddenly wanted to sell. A few big bankers bought shares to calm people down. That only held over the weekend.' } },
            { q: { de: 'Und heute?', en: 'And today?' }, a: { de: 'Heute wurden über 16 Millionen Aktien verkauft – so viele wie noch nie. Die Leute hier stehen einfach da und starren auf die Tür.', en: 'Today more than 16 million shares were sold – more than ever before. The people here just stand and stare at the door.' } }
          ] },
        { id: 'ny-hoover', time: 'b', seat: 0, real: true, name: 'Herbert Hoover', role: { de: 'Präsident der USA', en: 'President of the USA' }, coat: '#111827', hat: 'none', pos: [0, 0],
          hello: { de: 'Nehmen Sie Platz. Die Lage ist ernst, aber Panik hilft niemandem.', en: 'Do sit down. The situation is serious, but panic helps nobody.' },
          qa: [
            { q: { de: 'Herr Präsident, ist die Wirtschaft in Gefahr?', en: 'Mr President, is the economy in danger?' }, a: { de: 'Das habe ich der Presse bereits gesagt:', en: 'I have already told the press:' },
              quote: { lang: 'en', text: '“The fundamental business of the country, that is the production and distribution of commodities, is on a sound and prosperous basis.”', tr: '„Das grundlegende Geschäft des Landes, nämlich die Herstellung und Verteilung von Waren, steht auf einer gesunden und blühenden Grundlage.“', cite: 'Hoover, Statement, 25 Oct 1929 (American Presidency Project)' } },
            { q: { de: 'Was wird die Regierung tun?', en: 'What will the government do?' }, a: { de: 'Ich bitte die Unternehmer, die Löhne nicht zu senken, und wir ziehen Bauprojekte vor. Aber der Staat darf keine großen Schulden machen. Ein ausgeglichener Haushalt schafft Vertrauen.', en: 'I am asking business leaders not to cut wages, and we are bringing building projects forward. But the state must not run up large debts. A balanced budget creates trust.' } }
          ] },
        { id: 'ny-mellon', time: 'b', seat: 1, real: true, name: 'Andrew Mellon', role: { de: 'Finanzminister der USA', en: 'US Treasury Secretary' }, coat: '#374151', hat: 'none', pos: [0, 0],
          hello: { de: 'Der Präsident und ich sind nicht immer einer Meinung.', en: 'The President and I do not always agree.' },
          qa: [
            { q: { de: 'Was raten Sie dem Präsidenten?', en: 'What do you advise the President?' }, a: { de: 'Nichts zu tun. So hat es Hoover später in seinen Erinnerungen aufgeschrieben:', en: 'To do nothing. This is how Hoover later wrote it down in his memoirs:' },
              quote: { lang: 'en', text: '“Liquidate labor, liquidate stocks, liquidate the farmers, liquidate real estate. […] It will purge the rottenness out of the system.”', tr: '„Liquidiert die Arbeit, liquidiert die Aktien, liquidiert die Farmer, liquidiert die Immobilien. […] Das wird die Fäulnis aus dem System spülen.“', cite: 'Mellon, as remembered by Hoover: Memoirs, vol. 3 (1952), p. 30' } },
            { q: { de: 'Und die Menschen, die dabei alles verlieren?', en: 'And the people who lose everything?' }, a: { de: 'Wer zu viel riskiert hat, muss die Folgen tragen. Danach arbeiten die Menschen härter, und tüchtige Leute bauen wieder auf. So sehe ich das.', en: 'Those who risked too much must bear the consequences. Afterwards people will work harder, and capable people will rebuild. That is how I see it.' } }
          ] }
      ]
    },
    /* ------------------------------------------------ LONDON */
    {
      id: 'lon', name: { de: 'London', en: 'London' }, speak: 'en', voice: 'en-GB',
      times: {
        a: { label: { de: 'Sommer 1929', en: 'Summer 1929' }, intro: { de: 'London, Sommer 1929. Die Stadt ist die Bank der Welt. Doch in den Industriegebieten gibt es seit Jahren über eine Million Arbeitslose.', en: 'London, summer 1929. The city is the world’s bank. But in the industrial regions more than a million people have been out of work for years.' } },
        b: { label: { de: 'September 1931 – Abschied vom Gold', en: 'September 1931 – leaving gold' }, intro: { de: 'London, 21. September 1931. Die Regierung gibt bekannt: Das Pfund kann nicht mehr in Gold getauscht werden.', en: 'London, 21 September 1931. The government announces that the pound can no longer be exchanged for gold.' } }
      },
      signs: {
        landmark: 'WESTMINSTER', bank: { a: 'BANK OF ENGLAND', b: 'BANK OF ENGLAND' },
        board: { a: ['POUND STERLING', '£1 = $4.86', 'fixed in gold since 1925'], b: ['POUND STERLING', '£1 = about $3.40', 'no longer fixed in gold'] },
        news: { a: 'OVER A MILLION WITHOUT WORK', b: 'GOLD STANDARD SUSPENDED' },
        table: '10 DOWNING STREET · SEPT 1931'
      },
      prompt: { de: 'London: War der Abschied vom Goldstandard gut oder schlecht? Vergleiche die Sicht von Albert, Miss Harper und Keynes.', en: 'London: was leaving the gold standard good or bad? Compare the views of Albert, Miss Harper and Keynes.' },
      npcs: [
        { id: 'lon-albert-a', time: 'a', name: 'Albert Shaw', role: { de: 'Hafenarbeiter', en: 'Dock worker' }, coat: '#57534e', hat: 'cap', pos: [-6, 8],
          hello: { de: 'Tag. Suchen Sie Arbeit? Dann stellen Sie sich hinten an.', en: 'Afternoon. Looking for work? Then join the back of the queue.' },
          qa: [
            { q: { de: 'Gibt es hier nicht genug Arbeit? Es ist doch Aufschwung.', en: 'Isn’t there enough work? This is a boom, isn’t it?' }, a: { de: 'In Amerika vielleicht. Hier gibt es seit Jahren über eine Million Arbeitslose. Kohle, Schiffe, Stoffe – unsere Waren sind dem Ausland zu teuer.', en: 'In America, maybe. Here we’ve had over a million out of work for years. Coal, ships, cloth – our goods are too dear for foreigners.' } },
            { q: { de: 'Warum sind britische Waren so teuer?', en: 'Why are British goods so expensive?' }, a: { de: 'Wegen des Pfunds. 1925 hat die Regierung es wieder fest ans Gold gebunden, zum alten, hohen Wert. Gut für die Bankiers, schlecht für uns.', en: 'Because of the pound. In 1925 the government tied it to gold again, at the old high value. Good for the bankers, bad for us.' } }
          ] },
        { id: 'lon-harper-a', time: 'a', name: 'Miss Harper', role: { de: 'Bankangestellte', en: 'Bank clerk' }, coat: '#1e3a8a', hat: 'cloche', pos: [7, 2],
          hello: { de: 'Guten Tag. Kann ich Ihnen den Weg zur Bank von England zeigen?', en: 'Good afternoon. May I show you the way to the Bank of England?' },
          qa: [
            { q: { de: 'Was bedeutet „Goldstandard“?', en: 'What does “gold standard” mean?' }, a: { de: 'Jede Pfundnote kann bei der Bank in eine feste Menge Gold getauscht werden. Deshalb vertraut die ganze Welt dem Pfund – und deshalb darf die Bank nur so viel Geld ausgeben, wie Gold da ist.', en: 'Every pound note can be exchanged at the Bank for a fixed amount of gold. That is why the whole world trusts the pound – and why the Bank may only issue as much money as there is gold.' } },
            { q: { de: 'Ist das nicht riskant?', en: 'Isn’t that risky?' }, a: { de: 'Nur wenn alle gleichzeitig ihr Gold haben wollen. Aber warum sollten sie das tun?', en: 'Only if everybody wanted their gold at the same time. But why would they?' } }
          ] },
        { id: 'lon-albert-b', time: 'b', name: 'Albert Shaw', role: { de: 'Arbeitsloser Hafenarbeiter', en: 'Unemployed dock worker' }, coat: '#57534e', hat: 'cap', pos: [-8, -11],
          hello: { de: 'Zwei Jahre ohne Arbeit. Und jetzt kürzen sie uns auch noch die Unterstützung.', en: 'Two years without work. And now they’re cutting our benefit as well.' },
          qa: [
            { q: { de: 'Warum wird die Unterstützung gekürzt?', en: 'Why is the benefit being cut?' }, a: { de: 'Die Regierung sagt, sie muss sparen, um das Pfund zu retten. Zehn Prozent weniger für Arbeitslose – und für Lehrer, Polizisten und Matrosen. Die Matrosen haben sogar gestreikt.', en: 'The government says it has to save money to rescue the pound. Ten per cent less for the unemployed – and for teachers, policemen and sailors. The sailors even went on strike.' } },
            { q: { de: 'Hilft Ihnen das Ende des Goldstandards?', en: 'Does the end of the gold standard help you?' }, a: { de: 'Wenn das Pfund billiger wird, kauft das Ausland vielleicht wieder unsere Waren. Dann gibt es Arbeit. Aber die Kürzung bleibt trotzdem.', en: 'If the pound gets cheaper, maybe foreigners will buy our goods again. Then there’ll be work. But the cut stays all the same.' } }
          ] },
        { id: 'lon-harper-b', time: 'b', name: 'Miss Harper', role: { de: 'Bankangestellte', en: 'Bank clerk' }, coat: '#1e3a8a', hat: 'cloche', pos: [-15, -3],
          hello: { de: 'Ich hätte nie gedacht, dass ich das erlebe. Die Bank von England gibt kein Gold mehr heraus!', en: 'I never thought I would live to see this. The Bank of England no longer pays out gold!' },
          qa: [
            { q: { de: 'Wie konnte das passieren?', en: 'How could this happen?' }, a: { de: 'Im Sommer brachen Banken in Österreich und Deutschland zusammen. Danach holten Anleger aus aller Welt ihr Geld auch aus London und tauschten es in Gold. Unser Gold reichte nicht.', en: 'In the summer banks collapsed in Austria and Germany. After that investors from all over the world took their money out of London too and exchanged it for gold. Our gold was not enough.' } },
            { q: { de: 'Was ändert sich jetzt?', en: 'What changes now?' }, a: { de: 'Das Pfund ist plötzlich viel weniger wert: statt 4,86 Dollar nur noch etwa 3,40. Wer ins Ausland reist, zahlt mehr. Aber unsere Fabriken können billiger verkaufen.', en: 'The pound is suddenly worth much less: about 3.40 dollars instead of 4.86. People travelling abroad pay more. But our factories can sell more cheaply.' } }
          ] },
        { id: 'lon-macdonald', time: 'b', seat: 0, real: true, name: 'Ramsay MacDonald', role: { de: 'Premierminister', en: 'Prime Minister' }, coat: '#1f2937', hat: 'none', pos: [0, 0],
          hello: { de: 'Setzen Sie sich. Es waren die schwersten Wochen meines Lebens.', en: 'Sit down. These have been the hardest weeks of my life.' },
          qa: [
            { q: { de: 'Warum führen Sie eine Regierung mit Ihren Gegnern?', en: 'Why are you leading a government with your opponents?' }, a: { de: 'Meine eigene Labour-Regierung zerbrach im August an der Frage, ob wir die Arbeitslosenhilfe kürzen. Ich bildete eine „Nationale Regierung“ mit Konservativen und Liberalen. Meine Partei hat mich dafür ausgeschlossen.', en: 'My own Labour government broke apart in August over whether to cut unemployment benefit. I formed a “National Government” with Conservatives and Liberals. My party expelled me for it.' } },
            { q: { de: 'Sie haben gespart, um das Pfund zu retten – und es doch nicht gerettet?', en: 'You made cuts to save the pound – and still did not save it?' }, a: { de: 'So ist es. Wir haben gekürzt, und trotzdem floss das Gold ab. Am 21. September mussten wir den Goldstandard aufgeben.', en: 'That is so. We made the cuts, and the gold still drained away. On 21 September we had to give up the gold standard.' } }
          ] },
        { id: 'lon-keynes', time: 'b', seat: 1, real: true, name: 'John Maynard Keynes', role: { de: 'Wirtschaftswissenschaftler', en: 'Economist' }, coat: '#44403c', hat: 'none', pos: [0, 0],
          hello: { de: 'Schauen Sie nicht so traurig! Heute ist ein guter Tag für dieses Land.', en: 'Don’t look so gloomy! This is a good day for this country.' },
          qa: [
            { q: { de: 'Ein guter Tag? Das Pfund verliert an Wert!', en: 'A good day? The pound is losing value!' }, a: { de: 'Genau deshalb. Ich habe es so geschrieben:', en: 'Precisely. As I have written:' },
              quote: { lang: 'en', text: '“There are few Englishmen who do not rejoice at the breaking of our gold fetters. We feel that we have at last a free hand to do what is sensible.”', tr: '„Es gibt wenige Engländer, die sich nicht über das Zerbrechen unserer goldenen Fesseln freuen. Wir spüren, dass wir endlich freie Hand haben, das Vernünftige zu tun.“', cite: 'Keynes, “The End of the Gold Standard”, 27 Sept 1931' } },
            { q: { de: 'Was sollte die Regierung jetzt tun?', en: 'What should the government do now?' }, a: { de: 'Nicht sparen, sondern Geld ausgeben und Arbeit schaffen. Wenn niemand kauft, muss der Staat kaufen. Sparen macht in der Krise alle ärmer.', en: 'Not save, but spend money and create work. When nobody is buying, the state must buy. In a crisis, saving makes everybody poorer.' } }
          ] }
      ]
    },
    /* ------------------------------------------------ BERLIN */
    {
      id: 'ber', name: { de: 'Berlin', en: 'Berlin' }, speak: 'de', voice: 'de-DE',
      times: {
        a: { label: { de: 'Sommer 1929', en: 'Summer 1929' }, intro: { de: 'Berlin, Sommer 1929. Kinos, Kaufhäuser, Tanzlokale – die „Goldenen Zwanziger“. Vieles davon ist mit Krediten aus den USA bezahlt.', en: 'Berlin, summer 1929. Cinemas, department stores, dance halls – the “Golden Twenties”. Much of it is paid for with loans from the USA.' } },
        b: { label: { de: 'Juli 1931 – Bankenkrise', en: 'July 1931 – banking crisis' }, intro: { de: 'Berlin, 14. Juli 1931. Gestern ist die Danat-Bank zusammengebrochen. Heute bleiben alle Banken in Deutschland geschlossen. Vier Millionen Menschen sind arbeitslos.', en: 'Berlin, 14 July 1931. Yesterday the Danat Bank collapsed. Today all banks in Germany stay closed. Four million people are out of work.' } }
      },
      signs: {
        landmark: 'BRANDENBURGER TOR', bank: { a: 'DANAT-BANK', b: 'DANAT-BANK · GESCHLOSSEN' },
        board: { a: ['ARBEITSLOSE', 'Sommer 1929: 1,3 Mio.', 'Industrie: Rekord'], b: ['ARBEITSLOSE', 'Juli 1931: 4,0 Mio.', 'Alle Banken geschlossen'] },
        news: { a: 'BERLIN TANZT!', b: 'BANKEN ZU! NOTVERORDNUNG!' },
        table: 'REICHSKANZLEI · 1931'
      },
      prompt: { de: 'Berlin: Wie verändert die Krise, was die Menschen über die Demokratie denken? Nutze das Gespräch mit Otto.', en: 'Berlin: how does the crisis change what people think about democracy? Use your conversation with Otto.' },
      npcs: [
        { id: 'ber-lehmann-a', time: 'a', name: 'Frau Lehmann', role: { de: 'Besitzerin eines Hutgeschäfts', en: 'Owner of a hat shop' }, coat: '#7c2d12', hat: 'cloche', pos: [-6, 8],
          hello: { de: 'Guten Tag! Das Geschäft läuft endlich wieder. Nach 1923 hätte ich das nie geglaubt.', en: 'Good day! Business is finally good again. After 1923 I would never have believed it.' },
          qa: [
            { q: { de: 'Was war 1923?', en: 'What happened in 1923?' }, a: { de: 'Die Inflation! Mein ganzes Erspartes reichte am Ende nicht mehr für ein Brot. So etwas darf nie wieder passieren – das sagt hier jeder.', en: 'The inflation! In the end all my savings were not enough for a loaf of bread. Nothing like that must ever happen again – everybody here says so.' } },
            { q: { de: 'Woher kommt der neue Wohlstand?', en: 'Where does the new prosperity come from?' }, a: { de: 'Aus Amerika. Seit 1924 leihen uns die amerikanischen Banken Geld: für Fabriken, Schwimmbäder, Wohnungen. Auch mein Laden läuft auf Kredit. Solange die Amerikaner ihr Geld nicht zurückwollen, ist alles gut.', en: 'From America. Since 1924 the American banks have been lending us money: for factories, swimming pools, flats. My shop runs on credit too. As long as the Americans don’t want their money back, all is well.' } }
          ] },
        { id: 'ber-otto-a', time: 'a', name: 'Otto Krüger', role: { de: 'Metallarbeiter', en: 'Metal worker' }, coat: '#334155', hat: 'cap', pos: [7, 2],
          hello: { de: 'Tach! Feierabend. Ich hab Arbeit, da darf man nicht klagen.', en: 'Hello! Work’s over for today. I’ve got a job, so I can’t complain.' },
          qa: [
            { q: { de: 'Haben alle Arbeit?', en: 'Does everyone have work?' }, a: { de: 'Nee. Auch jetzt sind über eine Million arbeitslos. Aber es gibt seit 1927 eine Arbeitslosenversicherung. Wer seine Stelle verliert, fällt nicht ins Nichts.', en: 'No. Even now more than a million are out of work. But since 1927 there has been unemployment insurance. If you lose your job, you don’t fall into nothing.' } },
            { q: { de: 'Was halten Sie von der Republik?', en: 'What do you think of the Republic?' }, a: { de: 'Ich wähle SPD. Die Republik hat uns den Achtstundentag und das Wahlrecht gebracht. Die Schreihälse von ganz rechts und ganz links nimmt hier kaum jemand ernst.', en: 'I vote Social Democrat. The Republic gave us the eight-hour day and the vote. Hardly anyone here takes the loudmouths on the far right and far left seriously.' } }
          ] },
        { id: 'ber-lehmann-b', time: 'b', name: 'Frau Lehmann', role: { de: 'Besitzerin eines Hutgeschäfts', en: 'Owner of a hat shop' }, coat: '#7c2d12', hat: 'cloche', pos: [-15, -3],
          hello: { de: 'Geschlossen! Ich stehe seit sechs Uhr hier und komme nicht an mein eigenes Geld.', en: 'Closed! I have been standing here since six o’clock and cannot get at my own money.' },
          qa: [
            { q: { de: 'Warum ist die Bank geschlossen?', en: 'Why is the bank closed?' }, a: { de: 'Die Amerikaner haben ihre Kredite zurückgeholt. Dann wollten alle Sparer gleichzeitig ihr Geld. Die Danat-Bank konnte nicht mehr zahlen. Jetzt hat die Regierung alle Banken geschlossen.', en: 'The Americans took their loans back. Then all the savers wanted their money at the same time. The Danat Bank could no longer pay. Now the government has closed all the banks.' } },
            { q: { de: 'Was bedeutet das für Ihr Geschäft?', en: 'What does that mean for your shop?' }, a: { de: 'Ich kann meine Verkäuferin nicht bezahlen. Und wer kauft jetzt noch Hüte? Wenn das so weitergeht, verliere ich zum zweiten Mal alles.', en: 'I cannot pay my shop assistant. And who buys hats now? If this goes on, I shall lose everything for the second time.' } }
          ] },
        { id: 'ber-otto-b', time: 'b', name: 'Otto Krüger', role: { de: 'Arbeitsloser Metallarbeiter', en: 'Unemployed metal worker' }, coat: '#334155', hat: 'cap', pos: [-8, -11],
          hello: { de: 'Seit November stempeln. Jeden Tag anstehen für ein paar Mark.', en: 'On the dole since November. Queuing every day for a few marks.' },
          qa: [
            { q: { de: 'Hilft Ihnen die Arbeitslosenversicherung?', en: 'Does the unemployment insurance help you?' }, a: { de: 'Immer weniger. Der Kanzler kürzt die Unterstützung per Notverordnung – ohne den Reichstag zu fragen. Wozu wählen wir dann noch?', en: 'Less and less. The Chancellor is cutting the benefit by emergency decree – without asking the Reichstag. So why do we still vote?' } },
            { q: { de: 'Was sagen die anderen in der Schlange?', en: 'What do the others in the queue say?' }, a: { de: 'Viele sagen: Die Republik hilft uns nicht. Die einen laufen zu den Kommunisten, die anderen zu Hitler. Bei der Wahl 1930 kamen die Nazis schon auf über 18 Prozent. Mir macht das Angst.', en: 'Many say: the Republic doesn’t help us. Some run to the Communists, others to Hitler. In the 1930 election the Nazis already got more than 18 per cent. That frightens me.' } }
          ] },
        { id: 'ber-bruening', time: 'b', seat: 0, real: true, name: 'Heinrich Brüning', role: { de: 'Reichskanzler', en: 'Chancellor' }, coat: '#1f2937', hat: 'none', pos: [0, 0],
          hello: { de: 'Bitte, nehmen Sie Platz. Viel Zeit habe ich nicht.', en: 'Please take a seat. I do not have much time.' },
          qa: [
            { q: { de: 'Herr Reichskanzler, warum sparen Sie mitten in der Krise?', en: 'Chancellor, why are you making cuts in the middle of the crisis?' }, a: { de: 'Weil dem Reich niemand mehr Geld leiht. Später im Jahr habe ich es so gesagt:', en: 'Because nobody will lend the Reich money any more. Later this year I put it like this:' },
              quote: { lang: 'de', text: '„Wir werden uns darauf einstellen müssen, daß wir auch neue Opfer vom Volke zur Sicherung der Etats der öffentlichen Hand verlangen müssen.“', tr: '“We will have to prepare ourselves for demanding new sacrifices from the people as well, in order to secure the public budgets.”', cite: 'Brüning, Rede, November 1931 (Reden und Aufsätze, 1968)' } },
            { q: { de: 'Warum drucken Sie nicht einfach Geld?', en: 'Why don’t you simply print money?' }, a: { de: 'Nach 1923? Das würde sofort Panik auslösen. Und ich will dem Ausland zeigen, dass Deutschland die Reparationen beim besten Willen nicht mehr zahlen kann.', en: 'After 1923? That would cause panic at once. And I want to show other countries that Germany, with the best will in the world, can no longer pay reparations.' } },
            { q: { de: 'Warum regieren Sie ohne das Parlament?', en: 'Why do you govern without parliament?' }, a: { de: 'Im Reichstag gibt es keine Mehrheit mehr. Der Reichspräsident erlässt meine Gesetze als Notverordnungen nach Artikel 48. Das ist erlaubt – aber ich weiß, dass es das Parlament schwächt.', en: 'There is no longer a majority in the Reichstag. The Reich President issues my laws as emergency decrees under Article 48. That is legal – but I know it weakens parliament.' } }
          ] },
        { id: 'ber-luther', time: 'b', seat: 1, real: true, name: 'Hans Luther', role: { de: 'Präsident der Reichsbank', en: 'President of the Reichsbank' }, coat: '#374151', hat: 'none', pos: [0, 0],
          hello: { de: 'Ich bin gerade aus London, Paris und Basel zurück. Mit leeren Händen.', en: 'I have just come back from London, Paris and Basel. Empty-handed.' },
          qa: [
            { q: { de: 'Was wollten Sie dort?', en: 'What did you want there?' }, a: { de: 'Einen großen Kredit für die Reichsbank, um die Banken zu retten. Niemand wollte ihn geben – Frankreich nur gegen politische Bedingungen.', en: 'A large loan for the Reichsbank to rescue the banks. Nobody would give it – France only on political conditions.' } },
            { q: { de: 'Kann die Reichsbank den Banken nicht selbst helfen?', en: 'Can’t the Reichsbank help the banks itself?' }, a: { de: 'Kaum. Unser Gold und unsere Devisen sind fast aufgebraucht. Ich musste die Zinsen stark erhöhen – das macht Kredite für Firmen noch teurer.', en: 'Hardly. Our gold and foreign currency are almost used up. I had to raise interest rates sharply – that makes loans for firms even more expensive.' } }
          ] }
      ]
    },
    /* ------------------------------------------------ PARIS */
    {
      id: 'par', name: { de: 'Paris', en: 'Paris' }, speak: 'en', voice: 'en-GB',
      times: {
        a: { label: { de: 'Sommer 1929', en: 'Summer 1929' }, intro: { de: 'Paris, Sommer 1929. Frankreich geht es gut: Der Franc ist stabil und billig, Touristen strömen in die Stadt, Gold fließt ins Land. (Die Pariser antworten dir auf Englisch.)', en: 'Paris, summer 1929. France is doing well: the franc is stable and cheap, tourists pour into the city, gold flows into the country. (The Parisians answer you in English.)' } },
        b: { label: { de: '1932 – die Krise kommt spät', en: '1932 – the crisis comes late' }, intro: { de: 'Paris, Sommer 1932. Lange schien Frankreich verschont. Jetzt ist die Industrieproduktion um mehr als ein Viertel gefallen.', en: 'Paris, summer 1932. For a long time France seemed to be spared. Now industrial production has fallen by more than a quarter.' } }
      },
      signs: {
        landmark: 'TOUR EIFFEL', bank: { a: 'BANQUE DE FRANCE', b: 'BANQUE DE FRANCE' },
        board: { a: ['INDUSTRIE', '1929 = 100', 'Le franc est solide'], b: ['INDUSTRIE', '1932 = 72', 'La crise est arrivée'] },
        news: { a: 'PARIS, CAPITALE DU MONDE', b: 'LAUSANNE: FIN DES RÉPARATIONS' },
        table: 'PARIS · GOUVERNEMENT · 1932'
      },
      prompt: { de: 'Paris: Warum kam die Krise in Frankreich später an – und warum dauerte sie dort länger? Nutze das Gespräch mit Moret.', en: 'Paris: why did the crisis reach France later – and why did it last longer there? Use your conversation with Moret.' },
      npcs: [
        { id: 'par-dupont-a', time: 'a', name: 'Monsieur Dupont', role: { de: 'Café-Besitzer', en: 'Café owner' }, coat: '#14532d', hat: 'none', pos: [-6, 8],
          hello: { de: 'Bonjour! Einen Tisch? Es ist voll heute – Amerikaner, Engländer, alle wollen nach Paris.', en: 'Bonjour! A table? We are full today – Americans, English, everybody wants to come to Paris.' },
          qa: [
            { q: { de: 'Warum kommen so viele Touristen?', en: 'Why are so many tourists coming?' }, a: { de: 'Für sie ist bei uns alles billig. Seit 1928 hat der Franc wieder einen festen Wert in Gold – aber einen niedrigen. Gut für mein Café, gut für unsere Fabriken.', en: 'For them everything here is cheap. Since 1928 the franc has had a fixed value in gold again – but a low one. Good for my café, good for our factories.' } },
            { q: { de: 'Haben Sie Angst vor einer Krise?', en: 'Are you afraid of a crisis?' }, a: { de: 'Wir? Frankreich hat viele Bauern und kleine Betriebe und wenige Schulden im Ausland. Was an der Börse in New York passiert, ist weit weg.', en: 'Us? France has many farmers and small businesses and few debts abroad. What happens at the stock exchange in New York is far away.' } }
          ] },
        { id: 'par-claire-a', time: 'a', name: 'Claire Martin', role: { de: 'Journalistin', en: 'Journalist' }, coat: '#6b21a8', hat: 'cloche', pos: [7, 2],
          hello: { de: 'Ah, ein Kollege von der Presse! Schreiben Sie auch über die Reparationen?', en: 'Ah, a colleague from the press! Are you writing about reparations too?' },
          qa: [
            { q: { de: 'Warum besteht Frankreich auf den Reparationen?', en: 'Why does France insist on reparations?' }, a: { de: 'Der Krieg wurde auf unserem Boden geführt. Der Norden lag in Trümmern. Deutschland soll für den Wiederaufbau zahlen – das finden hier fast alle gerecht.', en: 'The war was fought on our soil. The north lay in ruins. Germany should pay for the rebuilding – almost everyone here thinks that is fair.' } },
            { q: { de: 'Woher nimmt Deutschland das Geld?', en: 'Where does Germany get the money?' }, a: { de: 'Das ist der seltsame Kreislauf: Amerikanische Banken leihen Deutschland Geld. Deutschland zahlt Reparationen an uns und an Großbritannien. Und wir zahlen damit unsere Kriegsschulden an die USA zurück. Wenn Amerika aufhört zu leihen, steht alles still.', en: 'That is the strange circle: American banks lend Germany money. Germany pays reparations to us and to Britain. And with that we pay our war debts back to the USA. If America stops lending, everything stops.' } }
          ] },
        { id: 'par-dupont-b', time: 'b', name: 'Monsieur Dupont', role: { de: 'Café-Besitzer', en: 'Café owner' }, coat: '#14532d', hat: 'none', pos: [-9, 8],
          hello: { de: 'Sehen Sie sich um: leere Tische. Vor drei Jahren hätten Sie hier keinen Platz gefunden.', en: 'Look around: empty tables. Three years ago you would not have found a seat here.' },
          qa: [
            { q: { de: 'Wo sind die Touristen geblieben?', en: 'Where have the tourists gone?' }, a: { de: 'Die Amerikaner haben kein Geld mehr. Und seit die Engländer ihr Pfund billiger gemacht haben, ist Paris für sie teuer. Jetzt fahren sie woandershin.', en: 'The Americans have no money left. And since the English made their pound cheaper, Paris is expensive for them. Now they go elsewhere.' } },
            { q: { de: 'Warum senkt Frankreich nicht auch den Wert des Franc?', en: 'Why doesn’t France lower the value of the franc as well?' }, a: { de: 'Niemals! Wir haben in den zwanziger Jahren erlebt, wie der Franc verfiel. Die Leute wollen ein festes Geld. Aber ehrlich gesagt: Mein Café ruiniert das.', en: 'Never! In the twenties we saw the franc lose its value. People want solid money. But honestly: it is ruining my café.' } }
          ] },
        { id: 'par-claire-b', time: 'b', name: 'Claire Martin', role: { de: 'Journalistin', en: 'Journalist' }, coat: '#6b21a8', hat: 'cloche', pos: [5, -13],
          hello: { de: 'Ich komme gerade von der Konferenz in Lausanne zurück. Die Reparationen sind am Ende.', en: 'I have just come back from the conference in Lausanne. Reparations are finished.' },
          qa: [
            { q: { de: 'Was wurde in Lausanne beschlossen?', en: 'What was decided in Lausanne?' }, a: { de: 'Deutschland soll nur noch eine letzte Summe zahlen – und selbst die wird wohl nie fließen. Viele Franzosen sind wütend: Wir sollen verzichten, aber unsere eigenen Schulden bei den USA weiter bezahlen.', en: 'Germany is to pay only one final sum – and even that will probably never be paid. Many French people are angry: we are supposed to give up our claims but go on paying our own debts to the USA.' } },
            { q: { de: 'Wie blickt man hier auf Deutschland?', en: 'How do people here look at Germany?' }, a: { de: 'Mit Sorge. Ich war in Berlin: Schlangen vor den Arbeitsämtern, Schlägereien auf der Straße, und Hitlers Partei wird immer stärker. Eine Krise ist nicht nur eine Sache des Geldes.', en: 'With worry. I was in Berlin: queues outside the labour offices, fighting in the streets, and Hitler’s party getting stronger and stronger. A crisis is not only a matter of money.' } }
          ] },
        { id: 'par-herriot', time: 'b', seat: 0, real: true, name: 'Édouard Herriot', role: { de: 'Ministerpräsident', en: 'Prime Minister' }, coat: '#1f2937', hat: 'none', pos: [0, 0],
          hello: { de: 'Setzen Sie sich zu uns. In Lausanne habe ich für Frankreich eine schwere Entscheidung getroffen.', en: 'Join us. In Lausanne I took a hard decision for France.' },
          qa: [
            { q: { de: 'Warum haben Sie dem Ende der Reparationen zugestimmt?', en: 'Why did you agree to the end of reparations?' }, a: { de: 'Weil Deutschland nicht mehr zahlen konnte – und weil ein völliger Zusammenbruch dort ganz Europa gefährdet hätte. Ich hoffte, dass die USA uns dafür unsere Kriegsschulden erlassen.', en: 'Because Germany could no longer pay – and because a complete collapse there would have endangered the whole of Europe. I hoped that in return the USA would cancel our war debts.' } },
            { q: { de: 'Und haben die USA das getan?', en: 'And did the USA do that?' }, a: { de: 'Nein. Ich wollte trotzdem weiter zahlen, um unser Wort zu halten. Das Parlament war dagegen – darüber ist meine Regierung im Dezember 1932 gestürzt.', en: 'No. I still wanted to keep paying, to keep our word. Parliament was against it – my government fell over this in December 1932.' } }
          ] },
        { id: 'par-moret', time: 'b', seat: 1, real: true, name: 'Clément Moret', role: { de: 'Präsident der Banque de France', en: 'Governor of the Banque de France' }, coat: '#374151', hat: 'none', pos: [0, 0],
          hello: { de: 'In unseren Kellern liegt etwa ein Viertel des Goldes der ganzen Welt. Frankreich ist sicher.', en: 'In our vaults lies about a quarter of all the gold in the world. France is safe.' },
          qa: [
            { q: { de: 'Warum kam die Krise in Frankreich so spät?', en: 'Why did the crisis reach France so late?' }, a: { de: 'Wir hatten wenig Schulden im Ausland, viel Gold und einen billigen Franc. Als die Banken anderswo wankten, brachten die Anleger ihr Geld sogar zu uns.', en: 'We had few foreign debts, a lot of gold and a cheap franc. When banks elsewhere were shaking, investors even brought their money to us.' } },
            { q: { de: 'Wird Frankreich den Goldstandard verlassen wie Großbritannien?', en: 'Will France leave the gold standard like Britain?' }, a: { de: 'Nein. Der Franc bleibt an das Gold gebunden. Das schützt die Sparer. – Der Preis dafür: Unsere Waren sind jetzt teurer als die britischen. Frankreich hielt bis 1936 am Gold fest, und die Krise dauerte hier länger als anderswo.', en: 'No. The franc stays tied to gold. That protects savers. – The price: our goods are now more expensive than British ones. France held on to gold until 1936, and the crisis lasted longer here than elsewhere.' } }
          ] }
      ]
    }
  ];

  root.WorldContent = W;
})(typeof window !== 'undefined' ? window : globalThis);
