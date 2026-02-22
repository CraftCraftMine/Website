/* ═══════════════════════════════════════
   CCMN™ Web EBuLa — shared/calc.js
   Berechnungs-Engine: Position, V-Klammern
═══════════════════════════════════════ */

/* ── Zeit-Utilities (HH:MM:SS) ── */

// String → Sekunden seit Mitternacht
function timeToSec(t) {
  if (!t || typeof t !== 'string') return null;
  const parts = t.split(':').map(Number);
  if (parts.some(isNaN)) return null;
  if (parts.length === 3) return parts[0]*3600 + parts[1]*60 + parts[2];
  if (parts.length === 2) return parts[0]*3600 + parts[1]*60;
  return null;
}

// Sekunden → HH:MM:SS
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

// Differenz in Sekunden (positiv, wraparound Mitternacht)
function timeDiffSec(from, to) {
  const a = timeToSec(from), b = timeToSec(to);
  if (a === null || b === null) return 0;
  let d = b - a;
  if (d < 0) d += 86400;
  return d;
}

/* ── Positions-Berechnung ── */

/**
 * Berechnet aktuelle Strecken-km basierend auf Ingame-Zeit.
 * @param {string} timeStr  - Aktuelle Zeit "HH:MM:SS"
 * @param {object} trip     - { mode, departure, avgSpeed, offset, startKm }
 * @param {array}  served   - Bediente Halte mit { km, arr, dep }
 * @returns {number}        - Aktuelle Position in km
 */
function calcKm(timeStr, trip, served) {
  const offset = trip.offset || 0;
  const startKm = (trip.startKm || 0) + offset;

  if (!timeStr || !trip) return startKm;
  const cs = timeToSec(timeStr);
  if (cs === null) return startKm;

  if (trip.mode === 'SPEED') {
    const dep = timeToSec(trip.departure);
    if (dep === null) return startKm;
    const hrs = timeDiffSec(trip.departure, timeStr) / 3600;
    return Math.max(startKm, hrs * (trip.avgSpeed || 100) + startKm);
  }

  // TIME: Interpolation zwischen Halte-Ankerpunkten
  const anchors = served
    .filter(s => s.served !== false && (s.dep || s.arr))
    .map(s => ({ km: s.km, sec: timeToSec(s.dep || s.arr) }))
    .filter(a => a.sec !== null)
    .sort((a, b) => a.km - b.km);

  if (!anchors.length) return startKm;
  if (cs <= anchors[0].sec) return anchors[0].km + offset;
  const last = anchors[anchors.length - 1];
  if (cs >= last.sec) return last.km + offset;

  for (let i = 0; i < anchors.length - 1; i++) {
    let [as, bs, s_] = [anchors[i].sec, anchors[i+1].sec, cs];
    if (bs < as) bs += 86400;
    if (s_ < as) s_ += 86400;
    if (s_ >= as && s_ <= bs) {
      const p = (s_ - as) / (bs - as);
      return anchors[i].km + (anchors[i+1].km - anchors[i].km) * p + offset;
    }
  }
  return last.km + offset;
}

/* ── Geschwindigkeits-Klammern ── */
// STA_H und ROW_H müssen vor Verwendung definiert sein
const STA_H = 52;
const ROW_H = 28;

/**
 * Berechnet vertikale V-Klammern für den BFP-Streifen.
 * Gibt Segmente zurück: { speed, type, color, topPx, heightPx }
 */
function calcVSegs(items) {
  const segs = [];
  let curV = null, curType = null, curColor = null, curTop = 0, top = 0;

  items.forEach(item => {
    const h = item.type === 'STATION' ? STA_H : ROW_H;
    if (item.type === 'SPEED' || item.type === 'LA') {
      if (curV !== null) {
        segs.push({ speed:curV, type:curType, color:curColor, top:curTop, height:top-curTop });
      }
      curV     = item.speed;
      curType  = item.type;
      curColor = item.type === 'LA' ? '#b03030' : '#a89020';
      curTop   = top;
    }
    top += h;
  });
  if (curV !== null) {
    segs.push({ speed:curV, type:curType, color:curColor, top:curTop, height:top-curTop });
  }
  return segs;
}

/**
 * Findet das Item das aktuell unter der Positions-Raute liegt.
 */
function findCurrentItem(items, curKm) {
  let best = null, bestDist = Infinity;
  items.forEach(item => {
    const d = Math.abs(item.km - curKm);
    if (d < bestDist) { bestDist = d; best = item; }
  });
  return best;
}

/**
 * Gibt den nächsten bedienten Halt zurück.
 */
function findNextStop(served, curKm) {
  return served.filter(s => s.km > curKm).sort((a,b) => a.km-b.km)[0] || null;
}

/**
 * Gibt den letzten passierten Halt zurück.
 */
function findPrevStop(served, curKm) {
  return served.filter(s => s.km <= curKm).sort((a,b) => b.km-a.km)[0] || null;
}
