# Weltwirtschaftskrise 1929 – The Great Depression

Zweisprachige (DE/EN) Lern-App für den bilingualen Geschichtsunterricht, Klasse 9/10.
Öffnen: `index.html` doppelklicken – läuft offline, ohne Installation (Ordner zusammen lassen).

| Seite | Inhalt |
| --- | --- |
| 1 Die Welt 1929 | 3D-Globus (three.js): Wie die Krise 1929–1933 um die Welt wandert |
| 2 Geld & Preise | Preis-Labor (Inflation 1923 / Deflation 1929–33), Brotpreise, Deflationsspirale (D3.js) |
| 3 Quellen | 7 Originalquellen aus verschiedenen Perspektiven, Original + Übersetzung, Worthilfen, Aufgaben |
| 4 Entscheiden | 6 Entscheidungen historischer Akteure (Hoover, Federal Reserve, Brüning, Roosevelt) |
| 5 Simulator | D3-Simulation der USA 1929–33: Modell gegen Geschichte, 6 Stellschrauben, Forschungsaufträge |
| 6 Sicherung | Urteilsaufgaben, Ergebnistabelle, Druck und Markdown-Export |

## Anpassen (ohne Programmierkenntnisse)

- `js/content.js` – alle Texte, Quellen und Aufgaben (jeweils `de:` und `en:`).
- `js/model.js` – die 8 Regeln des Simulators, als kommentierter, lesbarer Code.
- `css/style.css` – Farbschema: nur `--primary` oben in der Datei ändern.

## Hinweise

- Das Modell ist ein stark vereinfachtes Unterrichtsmodell, keine Wirtschaftswissenschaft.
- Zahlen sind gerundete Schulbuchwerte; Übersetzungen der Zitate sind Arbeitsübersetzungen. Bitte vor dem Einsatz gegenlesen.
- Quelle 7 ist eine Statistik. Eine persönliche Stimme (Brief, Tagebuch, Foto) bitte aus dem Schulbuch ergänzen.

## Der verbesserte Prompt

> **Rolle:** Du bist Experte für interaktive HTML5-Lernumgebungen und Geschichtsdidaktik.
> **Auftrag:** Baue eine offline lauffähige Web-App „Weltwirtschaftskrise 1929“ für bilingualen Geschichtsunterricht (DE/EN), Klasse 9/10, Englisch B1, iPad und Laptop.
> **Lernziele:** Die Lernenden (1) erklären, wie aus dem Börsenkrach eine Weltkrise wurde, (2) unterscheiden Inflation 1923 und Deflation 1929–33, (3) analysieren Quellen aus mindestens fünf Perspektiven (Regierung USA, Regierung Deutschland, Wissenschaft, Kritiker, Bevölkerung), (4) beurteilen Entscheidungen historischer Akteure und prüfen ein Modell kritisch.
> **Aufbau (6 Phasen):** Einstieg mit 3D-Globus (three.js) → Preis-Labor Inflation/Deflation (D3.js) → Quellenarbeit → Entscheidungen von Hoover, Federal Reserve, Brüning, Roosevelt mit „Was wirklich geschah“ → D3-Simulator „Modell gegen Geschichte“ mit Stellschrauben → Sicherung mit Urteilsaufgaben und Export.
> **Quellen:** Nur wörtlich belegte Originalzitate mit Nachweis; Original zuerst, Übersetzung einblendbar; Worthilfen; je eine Aufgabe zu Absicht, Perspektive oder Zuverlässigkeit. Nichts erfinden – Unbelegtes weglassen und melden.
> **Simulation:** Regeln als kommentierter, von Schülern lesbarer Code; historische Vergleichskurve immer sichtbar; deutlicher Hinweis, dass das Modell vereinfacht.
> **Didaktik:** Gestufte Hilfen (Strategie-Tipp → Inhalts-Tipp → Lösung mit Erklärung), ermutigendes Feedback, Zurücksetzen-Knopf, zweisprachiger Wortspeicher.
> **Technik:** Kein Server, keine CDN-Abhängigkeit (Bibliotheken lokal), Touch-Ziele ≥ 44 px, WCAG 2.1 AA, Tastaturbedienung, Fortschritt in localStorage, Schülereingaben nie als HTML.
> **Vorgehen:** Erst Idee kritisch rückmelden und offene Punkte in einer Nachricht klären (Farbschema, Export, Lizenz), dann bauen, dann im Browser testen und berichten, was geprüft wurde und was nicht.

## Lizenz

© S. Ghofranifar, CC BY-SA 4.0. KI-assistiert erstellt mit dem „learning-artifacts-builder (lab-o5)“-Skill von Dominik Kluge (CC BY-SA 4.0), angepasst als Vibe-Coding-Lab-Skill.
Fremdmaterial: D3.js (ISC), three.js (MIT), Natural Earth / world-atlas (gemeinfrei / ISC) – Lizenztexte in `vendor/`.
