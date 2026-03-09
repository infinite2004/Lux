import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, TrendingDown, Award, AlertCircle, Lightbulb, ArrowRight } from 'lucide-react';

const TEAL = '#4A8FA5';
const SAGE = '#1edd00';
const GOLD = '#A8854A';
const CORAL = '#B8724A';

interface PatternCard {
  insight: string;
  detail: string;
  color: string;
  trend: number[];
  suggestion: string;
}

const PATTERNS: PatternCard[] = [
  {
    insight: 'Your eyes tend to feel better after short midday resets.',
    detail: 'On days you took a 5-min break between 1–2 PM, your afternoon comfort score was 28% higher.',
    color: SAGE,
    trend: [42, 48, 40, 55, 44, 58, 50],
    suggestion: 'Try a brief look-away at 1 PM — even 20 seconds helps.',
  },
  {
    insight: 'Evening brightness may be increasing sensitivity.',
    detail: 'Screens after 8 PM appear to raise your visual load into the next morning.',
    color: CORAL,
    trend: [38, 52, 48, 62, 55, 68, 60],
    suggestion: 'Ease Mode after 8 PM may help reduce overnight sensitivity.',
  },
  {
    insight: 'Glare affects your comfort more than brightness.',
    detail: 'Reflected light sources contribute nearly 2× more to strain than overall screen brightness.',
    color: GOLD,
    trend: [60, 55, 62, 52, 58, 50, 54],
    suggestion: 'Position yourself perpendicular to windows when possible.',
  },
  {
    insight: 'Long reading sessions may benefit from more frequent easing.',
    detail: 'Sessions over 40 minutes without a break show a noticeable comfort dip in your data.',
    color: TEAL,
    trend: [30, 36, 32, 40, 38, 45, 42],
    suggestion: 'Reading comfort mode can ease strain during extended text sessions.',
  },
];

const WEEKLY = [
  { label: 'Average visual load', value: '52 / 100' },
  { label: 'Recovery sessions', value: '9 this week' },
  { label: 'Ease Mode hours', value: '6.5 hrs' },
  { label: 'Calmer days', value: '3 of 7' },
];

// ── Feature 4: Weekly Recap data ──
const WEEK_DAYS = [
  { day: 'Mon', load: 45, light: 310, events: 2, state: 'Comfortable' as const },
  { day: 'Tue', load: 68, light: 415, events: 5, state: 'Building Strain' as const },
  { day: 'Wed', load: 72, light: 380, events: 4, state: 'Sensitive' as const },
  { day: 'Thu', load: 82, light: 520, events: 7, state: 'Sensitive' as const },
  { day: 'Fri', load: 58, light: 495, events: 4, state: 'Building Strain' as const },
  { day: 'Sat', load: 30, light: 280, events: 1, state: 'Comfortable' as const },
  { day: 'Sun', load: 38, light: 340, events: 2, state: 'Recovering' as const },
];

const STATE_COLOR = {
  Comfortable: SAGE,
  'Building Strain': GOLD,
  Sensitive: CORAL,
  Recovering: TEAL,
};

const KEY_EVENTS = [
  {
    icon: AlertCircle,
    color: CORAL,
    title: 'Peak exposure',
    detail: 'Thursday 2–4 PM in your office had the highest light burden of the week (520 lux-hrs).',
    tag: 'Thu',
  },
  {
    icon: Award,
    color: SAGE,
    title: 'Best day',
    detail: 'Saturday was your calmest day — low light, 1 reset session, and 3h less screen time.',
    tag: 'Sat',
  },
  {
    icon: TrendingDown,
    color: TEAL,
    title: 'Improvement',
    detail: 'You used Ease Mode 2 days earlier in the evening compared to last week.',
    tag: '+',
  },
];

const NEXT_WEEK_TIPS = [
  {
    icon: Lightbulb,
    color: GOLD,
    tip: 'Avoid prolonged exposure Thursday afternoons — your data shows this is a consistent peak.',
  },
  {
    icon: TrendingDown,
    color: TEAL,
    tip: 'Turning on Ease Mode before 8 PM could reduce your cumulative load by ~15%.',
  },
  {
    icon: Award,
    color: SAGE,
    tip: 'You had a great Saturday — try replicating that rhythm at least twice next week.',
  },
];

function WeeklyRecap() {
  const avgLoad = Math.round(WEEK_DAYS.reduce((s, d) => s + d.load, 0) / WEEK_DAYS.length);
  const totalLux = WEEK_DAYS.reduce((s, d) => s + d.light, 0);
  const bestDay = WEEK_DAYS.reduce((a, b) => a.load < b.load ? a : b);
  const worstDay = WEEK_DAYS.reduce((a, b) => a.load > b.load ? a : b);

  const weekNarrative = avgLoad < 50
    ? 'A calm, low-strain week'
    : avgLoad < 65
    ? 'A moderately bright week'
    : 'A high-exposure week';

  return (
    <div className="space-y-5">
      {/* Narrative headline */}
      <div
        className="rounded-3xl px-5 py-5"
        style={{
          background: 'linear-gradient(135deg, #EFF6F9 0%, #EAF2EE 100%)',
          border: '1px solid rgba(74,143,165,0.2)',
          boxShadow: '0 4px 20px rgba(28,46,62,0.07)',
        }}
      >
        <p style={{ color: '#8B9EB0', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.04em', marginBottom: 4 }}>
          Mar 1 – Mar 7
        </p>
        <h2 style={{ color: '#1C2E3E', marginBottom: 8 }}>{weekNarrative}</h2>
        <p style={{ color: '#5A7080', fontSize: '0.875rem', lineHeight: 1.65 }}>
          Your average visual load was{' '}
          <strong style={{ color: avgLoad > 65 ? CORAL : GOLD }}>{avgLoad}/100</strong>
          . You absorbed{' '}
          <strong style={{ color: GOLD }}>{(totalLux / 1000).toFixed(1)}k lux-hrs</strong>
          {' '}of artificial light this week.
        </p>

        <div className="grid grid-cols-2 gap-3 mt-4">
          {[
            { label: 'Avg visual load', value: `${avgLoad}/100`, color: avgLoad > 65 ? CORAL : GOLD },
            { label: 'Lux absorbed', value: `${(totalLux / 1000).toFixed(1)}k`, color: TEAL },
            { label: 'Best day', value: bestDay.day, color: SAGE },
            { label: 'Hardest day', value: worstDay.day, color: CORAL },
          ].map((s, i) => (
            <div key={i} className="flex flex-col gap-0.5">
              <span style={{ color: s.color, fontWeight: 700 }}>{s.value}</span>
              <span style={{ color: '#8B9EB0', fontSize: '0.72rem' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Day-by-day heatmap */}
      <div
        className="rounded-3xl px-5 py-5"
        style={{
          background: '#FFFFFF',
          border: '1px solid rgba(28,46,62,0.08)',
          boxShadow: '0 2px 12px rgba(28,46,62,0.05)',
        }}
      >
        <p style={{ color: '#1C2E3E', fontWeight: 600, marginBottom: 14 }}>Day by day</p>

        <div className="space-y-2.5">
          {WEEK_DAYS.map((d, i) => {
            const color = STATE_COLOR[d.state];
            const barW = `${d.load}%`;
            return (
              <motion.div
                key={d.day}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-3"
              >
                <span style={{ color: '#8B9EB0', fontSize: '0.72rem', fontWeight: 600, width: 28, flexShrink: 0 }}>
                  {d.day}
                </span>

                <div className="flex-1 relative rounded-full overflow-hidden" style={{ height: 22, background: 'rgba(28,46,62,0.06)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: barW }}
                    transition={{ duration: 0.7, delay: i * 0.07, ease: 'easeOut' }}
                    className="absolute left-0 top-0 h-full rounded-full flex items-center"
                    style={{ background: `${color}`, opacity: 0.75 }}
                  />
                  <div className="absolute inset-0 flex items-center px-3">
                    <span style={{ color: '#1C2E3E', fontSize: '0.72rem', fontWeight: 600, position: 'relative', zIndex: 1 }}>
                      {d.state}
                    </span>
                  </div>
                </div>

                <span style={{ color, fontSize: '0.72rem', fontWeight: 700, width: 30, textAlign: 'right', flexShrink: 0 }}>
                  {d.load}
                </span>
              </motion.div>
            );
          })}
        </div>

        <div className="flex gap-4 mt-4 pt-4" style={{ borderTop: '1px solid rgba(28,46,62,0.07)' }}>
          {([
            { color: SAGE, label: 'Comfortable' },
            { color: GOLD, label: 'Building Strain' },
            { color: CORAL, label: 'Sensitive' },
            { color: TEAL, label: 'Recovering' },
          ] as const).map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
              <span style={{ fontSize: '0.62rem', color: '#8B9EB0' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key moments */}
      <div>
        <p style={{ color: '#5A7080', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.04em', marginBottom: 10 }}>
          Key moments
        </p>
        <div className="space-y-3">
          {KEY_EVENTS.map((e, i) => {
            const Icon = e.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 px-5 py-4 rounded-2xl"
                style={{
                  background: '#FFFFFF',
                  border: `1px solid ${e.color}25`,
                  boxShadow: '0 2px 10px rgba(28,46,62,0.05)',
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${e.color}14` }}
                >
                  <Icon className="w-4.5 h-4.5" style={{ color: e.color, width: 18, height: 18 }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p style={{ color: '#1C2E3E', fontWeight: 600, fontSize: '0.875rem' }}>{e.title}</p>
                    <span
                      className="px-2 py-0.5 rounded-full"
                      style={{ background: `${e.color}14`, color: e.color, fontSize: '0.65rem', fontWeight: 700 }}
                    >
                      {e.tag}
                    </span>
                  </div>
                  <p style={{ color: '#5A7080', fontSize: '0.82rem', lineHeight: 1.6 }}>{e.detail}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Next week tips */}
      <div
        className="rounded-3xl px-5 py-5"
        style={{
          background: '#FFFFFF',
          border: '1px solid rgba(28,46,62,0.08)',
          boxShadow: '0 2px 12px rgba(28,46,62,0.05)',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <ArrowRight className="w-4 h-4" style={{ color: TEAL }} />
          <p style={{ color: '#1C2E3E', fontWeight: 600 }}>For next week</p>
        </div>
        <div className="space-y-3">
          {NEXT_WEEK_TIPS.map((t, i) => {
            const Icon = t.icon;
            return (
              <div
                key={i}
                className="flex items-start gap-3 px-4 py-3.5 rounded-2xl"
                style={{ background: `${t.color}0A`, border: `1px solid ${t.color}22` }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `${t.color}1A` }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: t.color }} />
                </div>
                <p style={{ color: '#5A7080', fontSize: '0.82rem', lineHeight: 1.6 }}>{t.tip}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress vs last week */}
      <div
        className="rounded-3xl px-5 py-5"
        style={{
          background: 'linear-gradient(135deg, #EAF2EE, #EFF6F9)',
          border: '1px solid rgba(30,221,0,0.22)',
          boxShadow: '0 2px 12px rgba(28,46,62,0.05)',
        }}
      >
        <p style={{ color: SAGE, fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.04em', marginBottom: 12 }}>
          vs. last week
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Avg load', curr: avgLoad, prev: 61, unit: '/100', better: avgLoad < 61 },
            { label: 'Lux total', curr: Math.round(totalLux / 100), prev: 27, unit: '×100', better: totalLux / 100 < 27 },
            { label: 'Ease sessions', curr: 9, prev: 6, unit: '', better: 9 > 6 },
          ].map((s, i) => {
            const Icon = s.better ? TrendingDown : TrendingUp;
            const color = s.better ? SAGE : CORAL;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <Icon className="w-4 h-4" style={{ color }} />
                <span style={{ color: '#1C2E3E', fontWeight: 700, fontSize: '1rem' }}>
                  {s.curr}{s.unit}
                </span>
                <span style={{ color: '#8B9EB0', fontSize: '0.65rem', textAlign: 'center' }}>{s.label}</span>
                <span style={{ color, fontSize: '0.65rem', fontWeight: 600 }}>
                  {s.better ? '↓' : '↑'} vs {s.prev}{s.unit}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disclaimer */}
      <div
        className="px-5 py-4 rounded-2xl"
        style={{ background: 'rgba(28,46,62,0.04)', border: '1px solid rgba(28,46,62,0.07)' }}
      >
        <p style={{ color: '#8B9EB0', fontSize: '0.78rem', lineHeight: 1.65 }}>
          Weekly data is based on your usage patterns and environment readings. Luma's insights are for awareness only — not medical advice.
        </p>
      </div>
    </div>
  );
}

export function Insights() {
  const [activeTab, setActiveTab] = useState<'patterns' | 'recap'>('patterns');

  return (
    <div
      className="min-h-screen max-w-md mx-auto pb-28"
      style={{ background: 'linear-gradient(180deg, #F8F5EF 0%, #EDF4F7 100%)' }}
    >
      {/* Header */}
      <div className="px-6 pt-12 pb-4">
        <p style={{ color: '#8B9EB0', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Your wellness
        </p>
        <h1 style={{ color: '#1C2E3E', marginTop: 2 }}>Patterns</h1>
      </div>

      {/* Tab switcher */}
      <div className="px-6 mb-5">
        <div
          className="flex p-1 rounded-2xl gap-1"
          style={{ background: 'rgba(28,46,62,0.07)' }}
        >
          {([
            { id: 'patterns', label: 'Insights' },
            { id: 'recap', label: 'Weekly Recap' },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex-1 py-2.5 rounded-xl transition-all"
              style={{ color: activeTab === tab.id ? '#1C2E3E' : '#8B9EB0' }}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tabBg"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: 'white', boxShadow: '0 2px 8px rgba(28,46,62,0.1)' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span
                className="relative z-10"
                style={{ fontSize: '0.875rem', fontWeight: activeTab === tab.id ? 600 : 400 }}
              >
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-6">
        <AnimatePresence mode="wait">
          {activeTab === 'patterns' ? (
            <motion.div
              key="patterns"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.22 }}
              className="space-y-5"
            >
              {/* Weekly summary */}
              <div
                className="rounded-3xl px-5 py-5"
                style={{
                  background: 'linear-gradient(135deg, #EFF6F9 0%, #EAF2EE 100%)',
                  border: '1px solid rgba(74,143,165,0.2)',
                  boxShadow: '0 4px 20px rgba(28,46,62,0.07)',
                }}
              >
                <p style={{ color: TEAL, fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.04em', marginBottom: 12 }}>
                  This week
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {WEEKLY.map((w, i) => (
                    <div key={i} className="flex flex-col gap-0.5">
                      <span style={{ color: '#1C2E3E', fontWeight: 600 }}>{w.value}</span>
                      <span style={{ color: '#8B9EB0', fontSize: '0.75rem' }}>{w.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pattern cards */}
              <p style={{ color: '#5A7080', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.04em' }}>
                What Luma has noticed
              </p>

              {PATTERNS.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.09 }}
                  className="rounded-3xl overflow-hidden"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid rgba(28,46,62,0.08)',
                    boxShadow: '0 2px 12px rgba(28,46,62,0.06)',
                  }}
                >
                  {/* Top accent bar */}
                  <div className="h-1" style={{ background: p.color, opacity: 0.5 }} />

                  <div className="px-5 pt-5 pb-4">
                    {/* Insight text */}
                    <p style={{ color: '#1C2E3E', lineHeight: 1.55, marginBottom: 6, fontWeight: 500 }}>
                      "{p.insight}"
                    </p>
                    <p style={{ color: '#8B9EB0', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: 14 }}>
                      {p.detail}
                    </p>

                    {/* Mini sparkline */}
                    <div
                      className="flex items-end gap-1 mb-4 px-2 py-3 rounded-2xl"
                      style={{ background: `${p.color}08`, height: 56 }}
                    >
                      {p.trend.map((val, idx) => {
                        const h = (val / 100) * 80;
                        return (
                          <div
                            key={idx}
                            className="flex-1 rounded-t transition-all"
                            style={{
                              height: `${h}%`,
                              background: p.color,
                              opacity: 0.55 + (idx / p.trend.length) * 0.35,
                            }}
                          />
                        );
                      })}
                    </div>

                    {/* Suggestion */}
                    <div
                      className="flex items-start gap-3 px-4 py-3.5 rounded-2xl"
                      style={{ background: `${p.color}10`, border: `1px solid ${p.color}25` }}
                    >
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: `${p.color}20` }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
                      </div>
                      <p style={{ color: '#5A7080', fontSize: '0.82rem', lineHeight: 1.6 }}>
                        {p.suggestion}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Disclaimer */}
              <div
                className="px-5 py-4 rounded-2xl"
                style={{ background: 'rgba(28,46,62,0.04)', border: '1px solid rgba(28,46,62,0.07)' }}
              >
                <p style={{ color: '#8B9EB0', fontSize: '0.78rem', lineHeight: 1.65 }}>
                  Patterns are based on your usage and environment observations. They are not medical insights — just gentle awareness to help you care for your eyes.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="recap"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.22 }}
            >
              <WeeklyRecap />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}