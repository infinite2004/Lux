import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight } from 'lucide-react';

interface TimelineEvent {
  time: string;
  hour: number;
  label: string;
  cause: string;
  feeling: string;
  help: string;
  type: 'high' | 'medium' | 'recovery';
}

const EVENTS: TimelineEvent[] = [
  {
    time: '8:40 AM',
    hour: 8.67,
    label: 'Bright commute',
    cause: 'Direct morning sun through transit windows created sharp glare and contrast.',
    feeling: 'Eyes may have felt tight, reactive to sudden brightness changes.',
    help: 'Sit away from direct window light, or use sunglasses on bright commutes.',
    type: 'high',
  },
  {
    time: '12:50 PM',
    hour: 12.83,
    label: 'Prolonged screen use',
    cause: 'Two and a half hours of laptop work under overhead fluorescent lighting.',
    feeling: 'Visual load building steadily — mild tiredness, reduced focus comfort.',
    help: 'A 20-second break every 20 minutes can ease the accumulation significantly.',
    type: 'high',
  },
  {
    time: '3:15 PM',
    hour: 15.25,
    label: 'Quiet recovery period',
    cause: 'Short walk outdoors in soft afternoon light — no screens.',
    feeling: 'Eyes likely felt a gentle relief, reduced tension behind them.',
    help: 'Even 5 minutes outdoors in soft light supports meaningful recovery.',
    type: 'recovery',
  },
  {
    time: '9:30 PM',
    hour: 21.5,
    label: 'Evening sensitivity buildup',
    cause: 'Phone use in a dimly lit room increased contrast strain.',
    feeling: 'Heightened sensitivity to any brightness — eyes ready for rest.',
    help: 'Lower screen brightness after sunset and use warmer tone settings.',
    type: 'medium',
  },
];

// Deterministic burden curve
function buildCurve(): { hour: number; burden: number }[] {
  const pts: { hour: number; burden: number }[] = [];
  // Small variations seeded per index
  const noise = [0,3,-2,4,-1,2,0,-3,5,1,-2,3,0,2,-1,4,-3,1,2,-2,4,0,3,-1,2,1,-2,3,0,4,-1,2,3,-2,4,0,2,-1,3,0,4,-2,1,3,0,2,-1,4,2,-1];
  let ni = 0;
  for (let h = 0; h <= 24; h += 0.5) {
    let b = 18;
    if (h >= 6 && h < 8.5) b += (h - 6) * 6;
    if (h >= 8.5 && h < 9) b += 30 + (h - 8.5) * 20;
    if (h >= 9 && h < 13) b += 28 + (h - 9) * 9;
    if (h >= 13 && h < 15.25) b += 66;
    if (h >= 15.25 && h < 16.5) b = 38 - (h - 15.25) * 12;
    if (h >= 16.5 && h < 18) b = 30;
    if (h >= 18 && h < 21.5) b += (h - 18) * 7;
    if (h >= 21.5 && h <= 24) b += 28 + (h - 21.5) * 8;
    b += noise[ni++ % noise.length];
    b = Math.max(14, Math.min(94, b));
    pts.push({ hour: h, burden: b });
  }
  return pts;
}

function burdenColor(b: number) {
  if (b < 35) return '#5E9B85';
  if (b < 58) return '#A8854A';
  if (b < 75) return '#B8724A';
  return '#C06050';
}

export function Timeline() {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const curve = useMemo(buildCurve, []);

  // Build SVG path
  const W = 340, H = 180;
  const toX = (hour: number) => (hour / 24) * W;
  const toY = (burden: number) => H - (burden / 100) * (H - 16) - 4;

  const linePath = curve
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.hour).toFixed(1)},${toY(p.burden).toFixed(1)}`)
    .join(' ');
  const areaPath = linePath + ` L ${W},${H} L 0,${H} Z`;

  const timeLabels = [
    { label: 'Morning', x: 12 },
    { label: 'Afternoon', x: 37 },
    { label: 'Evening', x: 65 },
    { label: 'Night', x: 88 },
  ];

  return (
    <div
      className="min-h-screen max-w-md mx-auto pb-28"
      style={{ background: 'linear-gradient(180deg, #F8F5EF 0%, #EDF4F7 100%)' }}
    >
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <p style={{ color: '#8B9EB0', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Your day
        </p>
        <h1 style={{ color: '#1C2E3E', marginTop: 2 }}>Visual Load</h1>
      </div>

      <div className="px-6 space-y-5">
        {/* Ribbon chart */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(28,46,62,0.08)',
            boxShadow: '0 4px 20px rgba(28,46,62,0.07)',
          }}
        >
          {/* Time period labels */}
          <div className="flex px-5 pt-4 pb-1">
            {timeLabels.map(t => (
              <div key={t.label} className="flex-1 text-center" style={{ color: '#8B9EB0', fontSize: '0.7rem' }}>
                {t.label}
              </div>
            ))}
          </div>

          {/* SVG Ribbon */}
          <div className="px-2 pb-4">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full"
              style={{ display: 'block', height: '160px' }}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4A8FA5" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#4A8FA5" stopOpacity="0.04" />
                </linearGradient>
                <filter id="ribbon-glow">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                {/* Color gradient along path — approximate with time-based stops */}
                <linearGradient id="line-color" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#5E9B85" />
                  <stop offset="35%" stopColor="#A8854A" />
                  <stop offset="55%" stopColor="#B8724A" />
                  <stop offset="65%" stopColor="#5E9B85" />
                  <stop offset="80%" stopColor="#5E9B85" />
                  <stop offset="90%" stopColor="#B8724A" />
                  <stop offset="100%" stopColor="#B8724A" />
                </linearGradient>
              </defs>

              {/* Subtle horizontal guides */}
              {[25, 50, 75].map(pct => (
                <line
                  key={pct}
                  x1="0" y1={toY(pct)} x2={W} y2={toY(pct)}
                  stroke="rgba(28,46,62,0.06)" strokeWidth="1"
                />
              ))}

              {/* Area fill */}
              <path d={areaPath} fill="url(#area-fill)" />

              {/* Ribbon line */}
              <path
                d={linePath}
                fill="none"
                stroke="url(#line-color)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#ribbon-glow)"
              />

              {/* Current time indicator */}
              <line
                x1={toX(14.5)} y1="0" x2={toX(14.5)} y2={H}
                stroke="#4A8FA5" strokeWidth="1.5" strokeDasharray="4,3" strokeOpacity="0.5"
              />

              {/* Event markers */}
              {EVENTS.map((ev, i) => {
                const nearPt = curve.reduce((acc, p) =>
                  Math.abs(p.hour - ev.hour) < Math.abs(acc.hour - ev.hour) ? p : acc
                );
                const ex = toX(ev.hour);
                const ey = toY(nearPt.burden);
                const color = ev.type === 'recovery' ? '#5E9B85' : ev.type === 'high' ? '#B8724A' : '#A8854A';
                return (
                  <g key={i} onClick={() => setSelectedEvent(ev)} style={{ cursor: 'pointer' }}>
                    <circle cx={ex} cy={ey} r="10" fill={color} fillOpacity="0.15" />
                    <circle cx={ex} cy={ey} r="5" fill={color} />
                    <circle cx={ex} cy={ey} r="5" fill="none" stroke="white" strokeWidth="1.5" />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Hour markers */}
          <div className="flex justify-between px-4 pb-3" style={{ color: '#8B9EB0', fontSize: '0.68rem' }}>
            {['6am', '9am', '12pm', '3pm', '6pm', '9pm', '12am'].map(t => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 px-1">
          {[
            { color: '#5E9B85', label: 'Comfortable' },
            { color: '#A8854A', label: 'Building' },
            { color: '#B8724A', label: 'Sensitive' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
              <span style={{ color: '#8B9EB0', fontSize: '0.72rem' }}>{l.label}</span>
            </div>
          ))}
        </div>

        {/* Events list */}
        <div>
          <p className="mb-3" style={{ color: '#5A7080', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.04em' }}>
            Notable moments
          </p>
          <div className="space-y-3">
            {EVENTS.map((ev, i) => {
              const color = ev.type === 'recovery' ? '#5E9B85' : ev.type === 'high' ? '#B8724A' : '#A8854A';
              const typeBg = ev.type === 'recovery' ? '#5E9B8512' : ev.type === 'high' ? '#B8724A12' : '#A8854A12';
              return (
                <motion.button
                  key={i}
                  onClick={() => setSelectedEvent(ev)}
                  whileTap={{ scale: 0.99 }}
                  className="w-full flex items-start gap-4 px-5 py-4 rounded-2xl text-left transition-all"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid rgba(28,46,62,0.08)',
                    boxShadow: '0 2px 10px rgba(28,46,62,0.05)',
                  }}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ background: color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <span style={{ color: '#1C2E3E', fontWeight: 500 }}>{ev.label}</span>
                      <span
                        className="text-xs px-2.5 py-1 rounded-full ml-2 flex-shrink-0"
                        style={{ background: typeBg, color }}
                      >
                        {ev.time}
                      </span>
                    </div>
                    <p className="mt-1 truncate" style={{ color: '#8B9EB0', fontSize: '0.82rem' }}>
                      {ev.cause.slice(0, 60)}…
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: '#8B9EB0' }} />
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event detail sheet */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end max-w-md mx-auto"
            style={{ background: 'rgba(28,46,62,0.35)', backdropFilter: 'blur(4px)' }}
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 300 }}
              className="w-full rounded-t-3xl px-6 pt-6 pb-10"
              style={{
                background: 'linear-gradient(180deg, #FDFBF8 0%, #F5F2EC 100%)',
                border: '1px solid rgba(28,46,62,0.08)',
                boxShadow: '0 -8px 40px rgba(28,46,62,0.12)',
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Handle */}
              <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: 'rgba(28,46,62,0.15)' }} />

              <div className="flex justify-between items-start mb-5">
                <div>
                  <span style={{ color: '#8B9EB0', fontSize: '0.8rem' }}>{selectedEvent.time}</span>
                  <h3 style={{ color: '#1C2E3E', marginTop: 2 }}>{selectedEvent.label}</h3>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-2 rounded-xl"
                  style={{ background: 'rgba(28,46,62,0.07)' }}
                >
                  <X className="w-5 h-5" style={{ color: '#5A7080' }} />
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'What likely contributed', value: selectedEvent.cause },
                  { label: 'How your eyes may have felt', value: selectedEvent.feeling },
                  { label: 'What may help next time', value: selectedEvent.help },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="px-5 py-4 rounded-2xl"
                    style={{ background: '#FFFFFF', border: '1px solid rgba(28,46,62,0.07)' }}
                  >
                    <p style={{ color: '#8B9EB0', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                      {item.label}
                    </p>
                    <p style={{ color: '#5A7080', fontSize: '0.875rem', lineHeight: 1.65 }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}