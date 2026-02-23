/**
 * Project:     CCMC™ Web EBuLa
 * Part of:     CraftCraftMine Network™ (CCMN™)
 * Copyright:   (c) 2026 CraftCraftMine Network™ – All rights reserved.
 *
 * Description: Privates Hobby-Projekt für Train Sim World Simulationen.
 *              Nicht für kommerzielle Zwecke bestimmt.
 *              Mehr Infos: https://craftcraftmine.net/ueberuns
 *
 * CCMC™ = CraftCraftMine Code™ · CCMN™ = CraftCraftMine Netzwerk™
 */

/* ═══════════════════════════════════════
   shared/types.js — Typen, Konstanten
═══════════════════════════════════════ */

const EBULA_VERSION = 5;
const GH_REPO       = 'CraftCraftMine/ebula-routes';
const GH_RAW        = `https://raw.githubusercontent.com/${GH_REPO}/main/`;
const BASE_PATH     = '/ebula';   // Basis für Navigation

const TYPES = {
  STATION:{ l:'Bahnhof / Haltepunkt',  s:'Bf',  side:'track', clr:'#a0a8c0', bg:'#191b2c' },
  SPEED:  { l:'Geschwindigkeit',        s:'V',   side:'left',  clr:'#a89020', bg:'#201e08' },
  LA:     { l:'Langsamfahrstelle',      s:'La',  side:'left',  clr:'#b03030', bg:'#1e0c0c' },
  BUE:    { l:'Bahnübergang',           s:'BÜ',  side:'left',  clr:'#b03030', bg:'#1e0c0c' },
  SIGNAL: { l:'Signal',                 s:'Sig', side:'right', clr:'#4a5060', bg:'#0c0e12' },
  TU_S:   { l:'Tunnelanfang',           s:'Tu▸', side:'right', clr:'#3c4450', bg:'#0c0e12' },
  TU_E:   { l:'Tunnelende',             s:'▸Tu', side:'right', clr:'#3c4450', bg:'#0c0e12' },
  GRADE:  { l:'Steigung / Gefälle',    s:'‰',   side:'right', clr:'#247040', bg:'#08120a' },
};

const DEMO_ROUTE = {
  id: '__demo_nordstadt__',
  version: EBULA_VERSION,
  name: 'Nordstadt – Südhafen',
  desc: 'Tutorial-Demostrecke · Alle Objekttypen',
  startKm: 0,
  endKm: 20,
  createdAt: '2026-02-22T10:00:00Z',
  objects: [
    { id:'d01', km:0.0,  type:'STATION', name:'Nordstadt Hbf',      speed:null, speedEnd:null, gradient:null, notes:'Startbahnhof – Gl. 3' },
    { id:'d02', km:0.8,  type:'SIGNAL',  name:'A Nord 1',           speed:null, speedEnd:null, gradient:null, notes:'Ausfahrsignal' },
    { id:'d03', km:1.5,  type:'SPEED',   name:'',                   speed:120,  speedEnd:null, gradient:null, notes:'' },
    { id:'d04', km:3.2,  type:'BUE',     name:'Bundesstraße B7',    speed:null, speedEnd:null, gradient:null, notes:'Sicherung LSÜ' },
    { id:'d05', km:4.0,  type:'GRADE',   name:'',                   speed:null, speedEnd:null, gradient:15,   notes:'Steigung 15‰' },
    { id:'d06', km:5.5,  type:'LA',      name:'Baustelle km 5,5',   speed:60,   speedEnd:6.5,  gradient:null, notes:'Gleiserneuerung' },
    { id:'d07', km:6.5,  type:'SPEED',   name:'',                   speed:120,  speedEnd:null, gradient:null, notes:'La-Ende' },
    { id:'d08', km:7.0,  type:'GRADE',   name:'',                   speed:null, speedEnd:null, gradient:0,    notes:'eben' },
    { id:'d09', km:7.8,  type:'SIGNAL',  name:'E West',             speed:null, speedEnd:null, gradient:null, notes:'Einfahrsignal' },
    { id:'d10', km:8.5,  type:'STATION', name:'Nordstadt-West Hp',  speed:null, speedEnd:null, gradient:null, notes:'Haltepunkt · nur RE' },
    { id:'d11', km:9.0,  type:'SIGNAL',  name:'A West',             speed:null, speedEnd:null, gradient:null, notes:'Ausfahrsignal' },
    { id:'d12', km:9.8,  type:'TU_S',    name:'Westtunnel',         speed:null, speedEnd:null, gradient:null, notes:'1.500 m Länge' },
    { id:'d13', km:11.3, type:'TU_E',    name:'Westtunnel',         speed:null, speedEnd:null, gradient:null, notes:'' },
    { id:'d14', km:12.0, type:'SPEED',   name:'',                   speed:160,  speedEnd:null, gradient:null, notes:'' },
    { id:'d15', km:14.3, type:'SIGNAL',  name:'E Hafen',            speed:null, speedEnd:null, gradient:null, notes:'Einfahrsignal' },
    { id:'d16', km:14.8, type:'STATION', name:'Hafenbrücke Hp',     speed:null, speedEnd:null, gradient:null, notes:'Haltepunkt' },
    { id:'d17', km:15.3, type:'SIGNAL',  name:'A Hafen',            speed:null, speedEnd:null, gradient:null, notes:'Ausfahrsignal' },
    { id:'d18', km:16.0, type:'GRADE',   name:'',                   speed:null, speedEnd:null, gradient:-10,  notes:'Gefälle 10‰' },
    { id:'d19', km:17.5, type:'SPEED',   name:'',                   speed:80,   speedEnd:null, gradient:null, notes:'Einfahrt Südhafen' },
    { id:'d20', km:18.0, type:'BUE',     name:'Hafenstraße',        speed:null, speedEnd:null, gradient:null, notes:'unbeschrankter BÜ' },
    { id:'d21', km:19.0, type:'GRADE',   name:'',                   speed:null, speedEnd:null, gradient:0,    notes:'eben' },
    { id:'d22', km:19.5, type:'SIGNAL',  name:'E Süd',              speed:null, speedEnd:null, gradient:null, notes:'Einfahrsignal' },
    { id:'d23', km:20.0, type:'STATION', name:'Südhafen Hbf',       speed:null, speedEnd:null, gradient:null, notes:'Zielbahnhof – Gl. 1' },
  ],
  timetables: [
    {
      id: 'tt_demo1',
      name: 'RE 4711 · Demo',
      mode: 'TIME',
      departure: '10:00:00',
      avgSpeed: 100,
      createdAt: '2026-02-22T10:00:00Z',
      zugNummer: 'RE 4711',
      zugTyp: 'RE',
      stops: [
        { sid:'d01', km:0.0,  name:'Nordstadt Hbf',     served:true, arr:'',           dep:'10:00:00' },
        { sid:'d10', km:8.5,  name:'Nordstadt-West Hp', served:true, arr:'10:08:30',   dep:'10:09:00' },
        { sid:'d16', km:14.8, name:'Hafenbrücke Hp',    served:true, arr:'10:16:00',   dep:'10:16:30' },
        { sid:'d23', km:20.0, name:'Südhafen Hbf',      served:true, arr:'10:26:00',   dep:'' },
      ]
    }
  ]
};

// Navigations-Hilfsfunktion (von untergeordneten Seiten)
function navTo(path) {
  window.location.href = path;
}

// Hash-Routing: Routenname aus URL lesen
function getRouteHashName() {
  return decodeURIComponent(window.location.hash.replace('#',''));
}

/* ── Geschützte Autoren-Namen (CCM-intern) ──
   Diese Namen dürfen von Nutzern NICHT als Autor eingetragen werden.
   Sie sind Marken des CraftCraftMine Netzwerks™.
*/
const RESERVED_AUTHORS = [
  'craftcraftmine','ccmn','ccmc','ccmmc','ccm','craftcraft',
  'ccraft','craftcraftmine netzwerk','craftcraftmine code',
  'craftcraftmine mc','ccm community','ccmn official','ccmc official',
  'official','admin','system','nachhaltigkeitsmesse','ccm network',
];

/**
 * Prüft ob ein Autorenname einen geschützten CCM-Begriff enthält.
 * @returns {string|null} Fehlermeldung oder null wenn ok
 */
function checkReservedAuthor(name) {
  if (!name || !name.trim()) return null;
  const lower = name.toLowerCase().trim();
  for (const r of RESERVED_AUTHORS) {
    if (lower.includes(r)) {
      return `„${name}" enthält einen geschützten Namen des CraftCraftMine Netzwerks™. Bitte deinen eigenen Namen verwenden.`;
    }
  }
  return null;
}

/* ── JSON-Export Metadaten ── */
const JSON_META = {
  _ccmn: {
    project:   'CCMC™ Web EBuLa',
    partOf:    'CraftCraftMine Network™',
    copyright: '(c) 2026 CraftCraftMine Network™ – All rights reserved.',
    disclaimer:'Privates Hobby-Projekt. Nicht für kommerzielle Zwecke bestimmt.',
    info:      'https://craftcraftmine.net/ueberuns',
  }
};
