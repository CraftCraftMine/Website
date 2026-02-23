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
   shared/db.js — localStorage + Migration
═══════════════════════════════════════ */

const DB = {
  KEY: 'ccmn_ebula_v5',

  migrate(r) {
    if (!r) return null;
    // Basisfelder
    if (!r.version)     r.version    = 1;
    if (!r.timetables)  r.timetables = [];
    if (!r.objects)     r.objects    = [];
    if (!r.createdAt)   r.createdAt  = new Date().toISOString();
    if (!r.desc)        r.desc       = '';

    // Objekte normalisieren
    r.objects.forEach(o => {
      if (o.gradient  === undefined) o.gradient  = null;
      if (o.speed     === undefined) o.speed     = null;
      if (o.speedEnd  === undefined) o.speedEnd  = null;
      if (o.notes     === undefined) o.notes     = '';
      if (!o.id) o.id = String(Date.now() + Math.random());
    });

    // Fahrpläne normalisieren
    r.timetables.forEach(tt => {
      if (!tt.stops)      tt.stops     = [];
      if (!tt.mode)       tt.mode      = 'TIME';
      if (!tt.departure)  tt.departure = '';
      if (!tt.avgSpeed)   tt.avgSpeed  = 100;
      if (!tt.createdAt)  tt.createdAt = new Date().toISOString();
      if (!tt.zugNummer)  tt.zugNummer = '';
      if (!tt.zugTyp)     tt.zugTyp    = '';
      if (!tt.id)         tt.id        = String(Date.now() + Math.random());
      tt.stops.forEach(s => {
        if (s.served  === undefined) s.served = true;
        if (!s.arr)   s.arr = '';
        if (!s.dep)   s.dep = '';
        // Zeiten normalisieren: "11" → "11:00:00", "11:30" → "11:30:00"
        s.arr = DB._normTime(s.arr);
        s.dep = DB._normTime(s.dep);
      });
      // Abfahrtszeit des Fahrplans auch normalisieren
      tt.departure = DB._normTime(tt.departure);
    });

    r.version = EBULA_VERSION;
    return r;
  },

  get() {
    try {
      const raw = localStorage.getItem(this.KEY) || '[]';
      return JSON.parse(raw).map(r => this.migrate(r)).filter(Boolean);
    } catch { return []; }
  },

  set(routes) {
    localStorage.setItem(this.KEY, JSON.stringify(routes));
  },

  save(route) {
    const all = this.get();
    const idx = all.findIndex(r => r.id === route.id);
    if (idx >= 0) all[idx] = route; else all.push(route);
    this.set(all);
  },

  getById(id) {
    return this.get().find(r => r.id === id) || null;
  },

  getByName(name) {
    const n = name.toLowerCase().trim();
    return this.get().find(r =>
      r.name.toLowerCase().replace(/\s+/g,'-') === n ||
      r.name.toLowerCase() === n
    ) || null;
  },

  delete(id) {
    this.set(this.get().filter(r => r.id !== id));
  },

  // Fahrplan zu einer Strecke speichern
  saveTimetable(routeId, tt) {
    const route = this.getById(routeId);
    if (!route) return;
    const tts = route.timetables || [];
    const idx = tts.findIndex(t => t.id === tt.id);
    if (idx >= 0) tts[idx] = tt; else tts.push(tt);
    this.save({ ...route, timetables: tts });
  },

  deleteTimetable(routeId, ttId) {
    const route = this.getById(routeId);
    if (!route) return;
    this.save({ ...route, timetables: (route.timetables||[]).filter(t => t.id !== ttId) });
  },

  // Aktiver Fahrplan (zuletzt gewählt) pro Strecke
  getActiveTTId(routeId) {
    try { return JSON.parse(localStorage.getItem('ccmn_active_tt')||'{}')[routeId] || null; }
    catch { return null; }
  },
  setActiveTTId(routeId, ttId) {
    try {
      const m = JSON.parse(localStorage.getItem('ccmn_active_tt')||'{}');
      m[routeId] = ttId;
      localStorage.setItem('ccmn_active_tt', JSON.stringify(m));
    } catch {}
  },

  // Zeit normalisieren: "11" → "11:00:00", "11:30" → "11:30:00"
  _normTime(t) {
    if (!t || typeof t !== 'string') return t || '';
    const clean = t.trim();
    if (!clean) return '';
    const parts = clean.split(':').map(s => parseInt(s, 10));
    if (parts.some(isNaN)) return clean;
    const h = String(parts[0]||0).padStart(2,'0');
    const m = String(parts[1]||0).padStart(2,'0');
    const s = String(parts[2]||0).padStart(2,'0');
    return `${h}:${m}:${s}`;
  },

  // Tutorial Status
  tutDone:  () => localStorage.getItem('ccmn_tut6') === '1',
  markTut:  () => localStorage.setItem('ccmn_tut6', '1'),
  resetTut: () => localStorage.removeItem('ccmn_tut6'),

  // Einstellungen (Helligkeit, Kontrast, Nachtmodus)
  getSettings() {
    try { return JSON.parse(localStorage.getItem('ccmn_settings') || '{}'); }
    catch { return {}; }
  },
  saveSettings(s) {
    localStorage.setItem('ccmn_settings', JSON.stringify(s));
  },
};
