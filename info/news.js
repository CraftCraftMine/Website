/**
 * Project:     CraftCraftMine Info Center – News
 * Part of:     CraftCraftMine Netzwerk™ (CCMN™)
 * Copyright:   (c) 2026 CraftCraftMine Netzwerk™ – All rights reserved.
 * Description: Manuelle News-Einträge für das CCMN™ Info Center.
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
 *   tag    – "neu" | "info" | "event" | "update" | "wartung" (Pflicht)
 *   text   – Text. Ab ~120 Zeichen erscheint "Mehr anzeigen" (Pflicht)
 * ───────────────────────────────────────────────────────────────────
 */

const NEWS_ENTRIES = [
  {
    title: "Willkommen im neuen Info Center!",
    date:  "07. Apr. 2026",
    tag:   "neu",
    text:  "Das CCMN™ Info Center ist ab sofort live! Hier findet ihr alle wichtigen Neuigkeiten rund um den CraftCraftMine Server und das Netzwerk. Schaut regelmäßig vorbei – wir halten euch auf dem Laufenden."
  },
  {
    title: "Server läuft stabil auf 1.21.4",
    date:  "01. Apr. 2026",
    tag:   "info",
    text:  "Nach dem Update auf Minecraft 1.21.4 läuft der Server stabil. TPS liegt konstant bei 20. Danke an alle die Bugs gemeldet haben!"
  },
];
