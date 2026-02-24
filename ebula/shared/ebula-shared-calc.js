/**
 * Project:     CCMC™ Web EBuLa
 * Part of:     CraftCraftMine Netzwerk™ (CCMN™)
 * Copyright:   (c) 2026 CraftCraftMine Netzwerk™ – All rights reserved.
 *
 * Description: Privates Hobby-Projekt für Train Sim World Simulationen.
 *              Nicht für kommerzielle Zwecke bestimmt.
 *              Support: support@craftcraftmine.net
 *              Mehr Infos: https://craftcraftmine.net/ueberuns
 *
 * CCMC™ = CraftCraftMine Code™ · CCMN™ = CraftCraftMine Netzwerk™
 */

/* ═══════════════════════════════════════
   shared/calc.js — Berechnungs-Engine
   STA_H / ROW_H sind in types.js definiert
═══════════════════════════════════════ */

function timeToSec(t) {
  if (!t || typeof t !== 'string') return null;
  const parts = t.split(':').map(Number);
  if (parts.some(isNaN)) return null;
  if (parts.length === 3) return parts[0]*3600 + parts[1]*60 + parts[2];
  if (parts.length === 2) return parts[0]*3600 + parts[1]*60;
  return null;
}

function secToTime(s, withSeconds = true) {
  s = ((s % 86400) + 86400) % 86400;
  const h   = Math.floor(s / 3600);
  const m   = Math.floor(s % 3600 / 60);
  const sec = Math.floor(s % 60);
  const hh  = String(h).padStart(2,'0');
  const mm  = String(m).padStart(2,'0');
  const ss  = String(sec).padStart(2,'0');
  return withSeconds ? `${hh}:${mm}:${ss}` : `${hh}:${mm}`;
}

function timeDiffSec(from, to) {
  const a = timeToSec(from), b = timeToSec(to);
  if (a === null || b === null) return 0;
  let d = b - a;
  if (d < 0) d += 86400;
  return d;
}

/**
 * calcKm — Aktuelle km-Position berechnen.
 * Unterstützt richtung: 1 (km steigt) und -1 (km fällt).
 */
function calcKm(timeStr, trip, served) {
  const offset  = trip.offset || 0;
  const startKm = (trip.startKm || 0) + offset;
  if (!timeStr || !trip) return startKm;

  const cs = timeToSec(timeStr);
  if (cs === null) return startKm;

  if (trip.mode === 'SPEED') {
    const dep = timeToSec(trip.departure);
    if (dep === null) return startKm;
    const richtung = trip.richtung || 1;
    const hrs = timeDiffSec(trip.departure, timeStr) / 3600;
    const dist = hrs * (trip.avgSpeed || 100);
    return startKm + richtung * dist;
  }

  // TIME: Interpolation zwischen Halt-Ankerpunkten
  const anchors = served
    .filter(s => s.served !== false && (s.dep || s.arr))
    .map(s => ({ km: s.km, sec: timeToSec(s.dep || s.arr) }))
    .filter(a => a.sec !== null)
    .sort((a, b) => a.sec - b.sec); // nach Zeit sortieren, nicht nach km!

  if (!anchors.length) return startKm;
  if (cs <= anchors[0].sec) return anchors[0].km + offset;
  const last = anchors[anchors.length - 1];
  if (cs >= last.sec) return last.km + offset;

  for (let i = 0; i < anchors.length - 1; i++) {
    let [as, bs, cs_] = [anchors[i].sec, anchors[i+1].sec, cs];
    if (bs < as) bs += 86400;
    if (cs_ < as) cs_ += 86400;
    if (cs_ >= as && cs_ <= bs) {
      const p = (cs_ - as) / (bs - as);
      return anchors[i].km + (anchors[i+1].km - anchors[i].km) * p + offset;
    }
  }
  return last.km + offset;
}

/**
 * Berechnet die aktuelle zulässige Vmax an Position curKm.
 * Gibt { speed, type, color } zurück.
 */
function calcCurrentVmax(items, curKm) {
  let vmax = null, vtype = 'SPEED', vcolor = '#a89020';
  // Alle SPEED/LA-Einträge bis curKm (oder nach, falls noch nicht begonnen)
  const vsorted = items
    .filter(i => (i.type === 'SPEED' || i.type === 'LA') && i.speed != null)
    .sort((a,b) => a.km - b.km);

  for (const v of vsorted) {
    if (v.km <= curKm + 0.1) {
      // La hat ein Ende?
      if (v.type === 'LA' && v.speedEnd != null && curKm > v.speedEnd) continue;
      vmax   = v.speed;
      vtype  = v.type;
      vcolor = v.type === 'LA' ? '#c84040' : '#a89020';
    }
  }
  return vmax !== null ? { speed: vmax, type: vtype, color: vcolor } : null;
}

/**
 * V-Klammern für den BFP-Streifen.
 * STA_H und ROW_H kommen aus types.js
 */
function calcVSegs(items) {
  const segs = [];
  let curV = null, curType = null, curColor = null, curTop = 0, top = 0;
  items.forEach(item => {
    const h = item.type === 'STATION' ? STA_H : ROW_H;
    if (item.type === 'SPEED' || item.type === 'LA') {
      if (curV !== null) segs.push({ speed:curV, type:curType, color:curColor, top:curTop, height:top-curTop });
      curV     = item.speed;
      curType  = item.type;
      curColor = item.type === 'LA' ? '#b03030' : '#a89020';
      curTop   = top;
    }
    top += h;
  });
  if (curV !== null) segs.push({ speed:curV, type:curType, color:curColor, top:curTop, height:top-curTop });
  return segs;
}

function findCurrentItem(items, curKm) {
  let best = null, bestDist = Infinity;
  items.forEach(item => {
    const d = Math.abs(item.km - curKm);
    if (d < bestDist) { bestDist = d; best = item; }
  });
  return best;
}

function findNextStop(served, curKm, richtung = 1) {
  if (richtung >= 0)
    return served.filter(s => s.km > curKm).sort((a,b) => a.km-b.km)[0] || null;
  else
    return served.filter(s => s.km < curKm).sort((a,b) => b.km-a.km)[0] || null;
}

function findPrevStop(served, curKm, richtung = 1) {
  if (richtung >= 0)
    return served.filter(s => s.km <= curKm).sort((a,b) => b.km-a.km)[0] || null;
  else
    return served.filter(s => s.km >= curKm).sort((a,b) => a.km-b.km)[0] || null;
}
