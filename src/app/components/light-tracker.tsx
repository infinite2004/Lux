import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Monitor, Zap, Sun, Info, TrendingUp } from 'lucide-react';

const TEAL = '#4A8FA5';
const SAGE = '#5E9B85';
const GOLD = '#A8854A';
const CORAL = '#B8724A';

// Daily lux-hours data (past 7 days) — mock data
const WEEKLY_DATA = [
  { day: 'Mon', luxHours: 312, limit: 480 },
  { day: 'Tue', luxHours: 415, limit: 480 },
  { day: 'Wed', luxHours: 380, limit: 480 },
  { day: 'Thu', luxHours: 520, limit: 480 },
  { day: 'Fri', luxHours: 495, limit: 480 },
  { day: 'Sat', luxHours: 280, limit: 480 },
  { day: 'Sun', luxHours: 340, limit: 480 },
];

// Today's breakdown
const TODAY_TOTAL = 340; // lux-hours
const DAILY_LIMIT = 480; // recommended max

const SOURCES = [
  {
    id: 'screen',
    label: 'Screen time',
    sublabel: 'Phone, laptop, TV',
    value: 142,
    unit: 'lux-hrs',
    pct: 42,
    color: TEAL,
    icon: Monitor,
    detail: '5h 20m of screen use today',
  },
  {
    id: 'glare',
    label: 'Glare events',
    sublabel: 'Reflected / direct bursts',
    value: 98,
    unit: 'lux-hrs',
    pct: 29,
    color: CORAL,
    icon: Zap,
    detail: '3 significant glare events',
  },
  {
    id: 'ambient',
    label: 'Ambient lighting',
    sublabel: 'Office, room, outdoor',
    value: 100,
    unit: 'lux-hrs',
    pct: 29,
    color: GOLD,
    icon: Sun,
    detail: '7h 10m of tracked ambient light',
  },
];

const TIPS = [
  'Taking 5-minute breaks every hour can reduce your accumulated load by up to 18%.',
  'Moving away from direct window glare can cut glare exposure by nearly half.',
  'Switching to warm lighting after 6 PM significantly reduces evening light burden.',
];

function CircularGauge({ value, limit }: { value: number; limit: number }) {
  const r = 88;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / limit, 1);
  const offset = circ * (1 - pct);
  const overLimit = value > limit;

  const gaugeColor = overLimit ? CORAL : pct > 0.75 ? GOLD : pct > 0.5 ? '#A8A84A' : SAGE;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
      {/* Ambient glow */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute rounded-full"
        style={{
          inset: -20,
          background: `radial-gradient(circle, ${gaugeColor}30 0%, transparent 70%)`,
        }}
      />

      <svg viewBox="0 0 220 220" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={SAGE} />
            <stop offset="60%" stopColor={overLimit ? CORAL : GOLD} />
            <stop offset="100%" stopColor={overLimit ? '#D05050' : CORAL} />
          </linearGradient>
          <filter id="gauge-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Background track */}
        <circle
          cx="110" cy="110" r={r}
          fill="none"
          stroke="rgba(28,46,62,0.08)"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* Limit marker tick at 100% */}
        <line
          x1="110" y1="18" x2="110" y2="30"
          stroke={CORAL}
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.5"
          transform="rotate(0, 110, 110)"
        />

        {/* Filled arc */}
        <motion.circle
          cx="110" cy="110" r={r}
          fill="none"
          stroke="url(#gauge-grad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: 'easeOut', delay: 0.3 }}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '110px 110px' }}
          filter="url(#gauge-glow)"
        />

        {/* Iris rings */}
        <circle cx="110" cy="110" r="72" fill="none" stroke={gaugeColor} strokeWidth="1" strokeOpacity="0.18" />
        <circle cx="110" cy="110" r="60" fill={`${gaugeColor}06`} />
        <circle cx="110" cy="110" r="42" fill={`${gaugeColor}10`} />
        <circle cx="110" cy="110" r="30" fill="#1C2E3E" fillOpacity="0.07" />
      </svg>

      {/* Center text */}
      <div className="relative flex flex-col items-center justify-center z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{ fontSize: '2.6rem', fontWeight: 700, color: '#1C2E3E', lineHeight: 1 }}
        >
          {value}
        </motion.div>
        <div style={{ fontSize: '0.72rem', color: '#8B9EB0', marginTop: 2 }}>lux-hrs today</div>
        <div
          className="mt-2 px-3 py-1 rounded-full"
          style={{
            background: overLimit ? `${CORAL}15` : `${SAGE}15`,
            border: `1px solid ${overLimit ? CORAL : SAGE}30`,
          }}
        >
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: overLimit ? CORAL : SAGE }}>
            {overLimit ? `${value - limit} over limit` : `${limit - value} remaining`}
          </span>
        </div>
      </div>
    </div>
  );
}

export function LightTracker() {
  const navigate = useNavigate();
  const [expandedSource, setExpandedSource] = useState<string | null>(null);
  const [showTip, setShowTip] = useState(0);

  const pct = Math.round((TODAY_TOTAL / DAILY_LIMIT) * 100);

  return (
    <div
      className="min-h-screen max-w-md mx-auto pb-28"
      style={{ background: 'linear-gradient(180deg, #F8F5EF 0%, #EDF4F7 100%)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 px-6 pt-12 pb-4">
        <button
          onClick={() => navigate('/home')}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(28,46,62,0.07)' }}
        >
          <ChevronLeft className="w-5 h-5" style={{ color: '#5A7080' }} />
        </button>
        <div>
          <p style={{ color: '#8B9EB0', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Daily exposure
          </p>
          <h1 style={{ color: '#1C2E3E', marginTop: 1, lineHeight: 1.2 }}>Light Absorbed</h1>
        </div>
        <div className="ml-auto">
          <div
            className="px-3 py-1.5 rounded-full"
            style={{ background: `${TEAL}12`, border: `1px solid ${TEAL}30` }}
          >
            <span style={{ color: TEAL, fontSize: '0.72rem', fontWeight: 600 }}>Live</span>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-5">
        {/* Central gauge */}
        <div
          className="flex flex-col items-center py-8 rounded-3xl"
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(28,46,62,0.08)',
            boxShadow: '0 4px 20px rgba(28,46,62,0.07)',
          }}
        >
          <CircularGauge value={TODAY_TOTAL} limit={DAILY_LIMIT} />

          <div className="mt-4 px-6 w-full">
            {/* Limit progress bar */}
            <div className="flex justify-between mb-1.5" style={{ fontSize: '0.72rem', color: '#8B9EB0' }}>
              <span>0 lux-hrs</span>
              <span style={{ color: pct >= 100 ? CORAL : '#8B9EB0' }}>
                Recommended limit: {DAILY_LIMIT}
              </span>
            </div>
            <div className="rounded-full overflow-hidden" style={{ height: 6, background: 'rgba(28,46,62,0.08)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(pct, 100)}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
                className="h-full rounded-full"
                style={{
                  background: pct >= 100
                    ? `linear-gradient(90deg, ${SAGE}, ${GOLD}, ${CORAL})`
                    : `linear-gradient(90deg, ${SAGE}, ${pct > 70 ? GOLD : SAGE})`,
                }}
              />
            </div>
            <p className="mt-2 text-center" style={{ color: '#8B9EB0', fontSize: '0.75rem' }}>
              {pct}% of recommended daily limit
            </p>
          </div>
        </div>

        {/* Source breakdown */}
        <div>
          <p style={{ color: '#5A7080', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.04em', marginBottom: 10 }}>
            Where it came from
          </p>
          <div className="space-y-2.5">
            {SOURCES.map((s) => {
              const Icon = s.icon;
              const isExpanded = expandedSource === s.id;
              return (
                <motion.button
                  key={s.id}
                  onClick={() => setExpandedSource(isExpanded ? null : s.id)}
                  layout
                  className="w-full text-left rounded-2xl overflow-hidden transition-all"
                  style={{
                    background: '#FFFFFF',
                    border: `1px solid ${isExpanded ? s.color + '40' : 'rgba(28,46,62,0.08)'}`,
                    boxShadow: isExpanded
                      ? `0 4px 16px ${s.color}15`
                      : '0 2px 10px rgba(28,46,62,0.05)',
                  }}
                >
                  <div className="flex items-center gap-4 px-4 py-3.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${s.color}14` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: s.color }} />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1.5">
                        <span style={{ color: '#1C2E3E', fontWeight: 500, fontSize: '0.875rem' }}>{s.label}</span>
                        <span style={{ color: s.color, fontWeight: 600, fontSize: '0.875rem' }}>
                          {s.value} <span style={{ fontSize: '0.72rem', fontWeight: 400, color: '#8B9EB0' }}>lux-hrs</span>
                        </span>
                      </div>
                      {/* Mini bar */}
                      <div className="rounded-full overflow-hidden" style={{ height: 4, background: 'rgba(28,46,62,0.07)' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${s.pct}%` }}
                          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                          className="h-full rounded-full"
                          style={{ background: s.color }}
                        />
                      </div>
                      <span style={{ color: '#8B9EB0', fontSize: '0.7rem', marginTop: 3, display: 'block' }}>
                        {s.sublabel}
                      </span>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div
                          className="mx-4 mb-3.5 px-4 py-3 rounded-xl flex items-center gap-3"
                          style={{ background: `${s.color}0A`, border: `1px solid ${s.color}20` }}
                        >
                          <Info className="w-4 h-4 flex-shrink-0" style={{ color: s.color }} />
                          <p style={{ color: '#5A7080', fontSize: '0.82rem', lineHeight: 1.55 }}>
                            {s.detail}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* 7-day chart */}
        <div
          className="rounded-3xl px-5 py-5"
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(28,46,62,0.08)',
            boxShadow: '0 2px 12px rgba(28,46,62,0.05)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <p style={{ color: '#1C2E3E', fontWeight: 600 }}>Past 7 days</p>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" style={{ color: GOLD }} />
              <span style={{ color: GOLD, fontSize: '0.75rem', fontWeight: 600 }}>+8% vs last week</span>
            </div>
          </div>

          {/* Bar chart */}
          <div className="flex items-end gap-2 h-20 mb-3">
            {WEEKLY_DATA.map((d, i) => {
              const h = (d.luxHours / 600) * 100;
              const isOver = d.luxHours > d.limit;
              const isToday = i === WEEKLY_DATA.length - 1;
              const color = isOver ? CORAL : d.luxHours > 400 ? GOLD : SAGE;
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col justify-end rounded-t" style={{ height: '100%' }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.7, delay: i * 0.07, ease: 'easeOut' }}
                      className="w-full rounded-t"
                      style={{
                        background: color,
                        opacity: isToday ? 1 : 0.6,
                        border: isToday ? `2px solid ${color}` : 'none',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Limit line label */}
          <div className="relative mb-3">
            <div
              className="absolute left-0 right-0"
              style={{ top: -72, borderTop: `1.5px dashed ${CORAL}40` }}
            />
          </div>

          {/* Day labels */}
          <div className="flex justify-between">
            {WEEKLY_DATA.map((d, i) => (
              <div key={d.day} className="flex-1 text-center">
                <span
                  style={{
                    fontSize: '0.65rem',
                    color: i === WEEKLY_DATA.length - 1 ? TEAL : '#8B9EB0',
                    fontWeight: i === WEEKLY_DATA.length - 1 ? 700 : 400,
                  }}
                >
                  {d.day}
                </span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex gap-4 mt-4 pt-4" style={{ borderTop: '1px solid rgba(28,46,62,0.07)' }}>
            {[
              { color: SAGE, label: 'Low' },
              { color: GOLD, label: 'Moderate' },
              { color: CORAL, label: 'Over limit' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                <span style={{ fontSize: '0.7rem', color: '#8B9EB0' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tips carousel */}
        <div
          className="rounded-3xl px-5 py-5"
          style={{
            background: `linear-gradient(135deg, #EFF6F9, #EAF2EE)`,
            border: `1px solid ${TEAL}25`,
            boxShadow: '0 2px 12px rgba(28,46,62,0.05)',
          }}
        >
          <p style={{ color: TEAL, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.04em', marginBottom: 10 }}>
            What helps
          </p>

          <AnimatePresence mode="wait">
            <motion.p
              key={showTip}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              style={{ color: '#1C2E3E', lineHeight: 1.6, fontSize: '0.875rem' }}
            >
              {TIPS[showTip]}
            </motion.p>
          </AnimatePresence>

          <div className="flex gap-2 mt-4">
            {TIPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setShowTip(i)}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: showTip === i ? 24 : 8,
                  background: showTip === i ? TEAL : 'rgba(74,143,165,0.3)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div
          className="px-5 py-4 rounded-2xl"
          style={{ background: 'rgba(28,46,62,0.04)', border: '1px solid rgba(28,46,62,0.07)' }}
        >
          <p style={{ color: '#8B9EB0', fontSize: '0.78rem', lineHeight: 1.65 }}>
            Light absorption estimates are based on screen usage patterns and environment scans. Values are approximate and for awareness — not medical measurements.
          </p>
        </div>
      </div>
    </div>
  );
}
