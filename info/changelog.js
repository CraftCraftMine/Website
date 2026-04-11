/**
 * Project:     CraftCraftMine Info Center – Changelog
 * Part of:     CraftCraftMine Netzwerk™ (CCMN™)
 * Copyright:   (c) 2026 CraftCraftMine Netzwerk™ – All rights reserved.
 * Description: Manuelle Changelog-Einträge für das CCMN™ Info Center.
 *              Nicht für kommerzielle Zwecke bestimmt.
 * Letzte Änderung: 07.04.2026
 * Support:     support@craftcraftmine.net
 * Info:        https://craftcraftmine.net/ueberuns
 *
 * CCMC™ = CraftCraftMine Code™ · CCMN™ = CraftCraftMine Netzwerk™
 *
 * ── Anleitung ──────────────────────────────────────────────────────
 * Neuen Eintrag oben einfügen (neueste zuerst).
 * Felder:
 *   title  – Überschrift (Pflicht)
 *   date   – Datum z. B. "07. Apr. 2026" (Pflicht)
 *   tag    – "neu" | "update" | "bugfix" | "wartung" (Pflicht)
 *   text   – Text. Ab ~120 Zeichen erscheint "Mehr anzeigen" (Pflicht)
 * ───────────────────────────────────────────────────────────────────
 */

const CHANGELOG_ENTRIES = [
  {
    title: "Info Center hinzugefügt",
    date:  "07. Apr. 2026",
    tag:   "neu",
    text:  "Das neue Info Center ist jetzt live unter craftcraftmine.net/info. News, kostenlose Spiele und in Zukunft mehr."
  },
  {
    title: "Server auf 1.21.4 aktualisiert",
    date:  "01. Apr. 2026",
    tag:   "update",
    text:  "Alle Plugins wurden geprüft und aktualisiert. Verbesserter Spawn-Bereich und optimierte Performance. Bitte Bugs im Discord melden!"
  },
  {
    title: "Lag-Problem behoben",
    date:  "28. März 2026",
    tag:   "bugfix",
    text:  "Ein Speicher-Leak der zu massiven Lags führte wurde identifiziert und behoben. TPS stabil bei 20."
  },
];
