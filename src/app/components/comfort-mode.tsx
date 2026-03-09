import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Sun, Moon, BookOpen, Minus, Type, Wind, Zap, CheckCircle2, RefreshCw } from 'lucide-react';

const TEAL = '#4A8FA5';
const GOLD = '#A8854A';
const CORAL = '#B8724A';

// Simulated environment light levels
const ENV_LEVELS = [
  { label: 'Bright Office', lux: 820, suggestion: 'High ambient light detected — auto-dimming and warming tone.' },
  { label: 'Dim Cafe', lux: 180, suggestion: 'Low ambient light — brightness slightly boosted for comfort.' },
  { label: 'Home Evening', lux: 95, suggestion: 'Warm indoor light — night tone applied automatically.' },
  { label: 'Outdoor Shade', lux: 2400, suggestion: 'Bright outdoor conditions — max dimming and blue filter active.' },
];

export function ComfortMode() {
  const navigate = useNavigate();
  const [easeActive, setEaseActive] = useState(false);
  const [autoAdapt, setAutoAdapt] = useState(false);
  const [envIndex, setEnvIndex] = useState(0);

  const [brightness, setBrightness] = useState(72);
  const [warmth, setWarmth] = useState(55);
  const [contrast, setContrast] = useState(50);

  const [readingMode, setReadingMode] = useState(false);
  const [largerText, setLargerText] = useState(false);
  const [quietDisplay, setQuietDisplay] = useState(false);

  const currentEnv = ENV_LEVELS[envIndex];

  // Auto-adapt computed values
  const adaptedBrightness = autoAdapt
    ? Math.max(20, Math.min(90, Math.round(100 - (currentEnv.lux / 2400) * 65)))
    : brightness;
  const adaptedWarmth = autoAdapt
    ? Math.round(35 + (currentEnv.lux < 300 ? 50 : currentEnv.lux < 800 ? 25 : 10))
    : warmth;

  const previewBrightness = easeActive ? (autoAdapt ? adaptedBrightness : brightness) / 100 : 1;
  const activeWarmth = autoAdapt ? adaptedWarmth : warmth;

  const sliders = [
    {
      id: 'brightness', label: 'Lower brightness', sublabel: 'Reduce overall screen intensity',
      icon: Sun, iconColor: GOLD, trackColor: GOLD,
      min: 20, max: 100, defaultValue: brightness,
    },
    {
      id: 'warmth', label: 'Warmer tone', sublabel: 'Shift to softer amber light',
      icon: Wind, iconColor: CORAL, trackColor: CORAL,
      min: 0, max: 100, defaultValue: warmth,
    },
    {
      id: 'contrast', label: 'Reduced contrast', sublabel: 'Ease sharp transitions',
      icon: Minus, iconColor: TEAL, trackColor: TEAL,
      min: 20, max: 100, defaultValue: contrast,
    },
  ];

  const setters: Record<string, (v: number) => void> = {
    brightness: setBrightness,
    warmth: setWarmth,
    contrast: setContrast,
  };

  const values: Record<string, number> = {
    brightness: autoAdapt ? adaptedBrightness : brightness,
    warmth: autoAdapt ? adaptedWarmth : warmth,
    contrast,
  };

  const toggles = [
    {
      id: 'reading', label: 'Reading comfort', sub: 'Optimized for longer text',
      icon: BookOpen, active: readingMode, onToggle: () => setReadingMode(!readingMode), color: TEAL,
    },
    {
      id: 'larger', label: 'Larger text', sub: 'Easier on the eyes',
      icon: Type, active: largerText, onToggle: () => setLargerText(!largerText), color: '#1edd00',
    },
    {
      id: 'quiet', label: 'Quieter display', sub: 'Minimal visual activity',
      icon: Moon, active: quietDisplay, onToggle: () => setQuietDisplay(!quietDisplay), color: '#7B9BB5',
    },
  ];

  return (
    <div
      className="min-h-screen max-w-md mx-auto pb-28"
      style={{ background: 'linear-gradient(180deg, #F8F5EF 0%, #EDF4F7 100%)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 px-6 pt-12 pb-6">
        <button
          onClick={() => navigate('/home')}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(28,46,62,0.07)' }}
        >
          <ChevronLeft className="w-5 h-5" style={{ color: '#5A7080' }} />
        </button>
        <div>
          <p style={{ color: '#8B9EB0', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Adjustments
          </p>
          <h1 style={{ color: '#1C2E3E', marginTop: 1, lineHeight: 1.2 }}>Ease Mode</h1>
        </div>
        <div className="ml-auto">
          {easeActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: `${TEAL}15`, border: `1px solid ${TEAL}35` }}
            >
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: TEAL }} />
              <span style={{ color: TEAL, fontSize: '0.75rem', fontWeight: 600 }}>Active</span>
            </motion.div>
          )}
        </div>
      </div>

      <div className="px-6 space-y-5">
        {/* ── Feature 3: Smart Adaptation ── */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: autoAdapt
              ? `linear-gradient(135deg, ${TEAL}12, #1edd0010)`
              : '#FFFFFF',
            border: `1px solid ${autoAdapt ? TEAL + '40' : 'rgba(28,46,62,0.08)'}`,
            boxShadow: autoAdapt
              ? `0 4px 20px ${TEAL}18`
              : '0 2px 12px rgba(28,46,62,0.05)',
            transition: 'all 0.4s ease',
          }}
        >
          <div className="px-5 pt-5 pb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: autoAdapt ? `${TEAL}20` : 'rgba(28,46,62,0.07)' }}
                >
                  <Zap className="w-5 h-5" style={{ color: autoAdapt ? TEAL : '#8B9EB0' }} />
                </div>
                <div>
                  <p style={{ color: '#1C2E3E', fontWeight: 600, fontSize: '0.9rem' }}>Smart Adaptation</p>
                  <p style={{ color: '#8B9EB0', fontSize: '0.72rem' }}>Auto-adjust to your environment</p>
                </div>
              </div>
              {/* Toggle */}
              <button
                onClick={() => setAutoAdapt(!autoAdapt)}
                className="relative flex-shrink-0 transition-all"
                style={{
                  width: 48, height: 26, borderRadius: 99,
                  background: autoAdapt ? TEAL : 'rgba(28,46,62,0.14)',
                }}
              >
                <motion.div
                  animate={{ x: autoAdapt ? 23 : 2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="absolute top-1"
                  style={{ width: 22, height: 22, borderRadius: 99, background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
                />
              </button>
            </div>

            <AnimatePresence>
              {autoAdapt && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  {/* Environment selector */}
                  <div className="mb-3 mt-1">
                    <p style={{ color: '#8B9EB0', fontSize: '0.72rem', fontWeight: 600, marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      Simulated environment
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {ENV_LEVELS.map((env, i) => (
                        <button
                          key={env.label}
                          onClick={() => setEnvIndex(i)}
                          className="px-3 py-1.5 rounded-xl transition-all"
                          style={{
                            background: envIndex === i ? `${TEAL}18` : 'rgba(28,46,62,0.05)',
                            border: `1px solid ${envIndex === i ? TEAL + '45' : 'rgba(28,46,62,0.1)'}`,
                            color: envIndex === i ? TEAL : '#5A7080',
                            fontSize: '0.75rem',
                            fontWeight: envIndex === i ? 600 : 400,
                          }}
                        >
                          {env.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Status card */}
                  <div
                    className="rounded-2xl px-4 py-3.5"
                    style={{ background: `${TEAL}0A`, border: `1px solid ${TEAL}28` }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4" style={{ color: TEAL }} />
                      <span style={{ color: TEAL, fontWeight: 600, fontSize: '0.8rem' }}>Adapted to {currentEnv.label}</span>
                      <span style={{ color: '#8B9EB0', fontSize: '0.72rem', marginLeft: 'auto' }}>{currentEnv.lux} lux</span>
                    </div>
                    <p style={{ color: '#5A7080', fontSize: '0.8rem', lineHeight: 1.55 }}>
                      {currentEnv.suggestion}
                    </p>

                    {/* What changed */}
                    <div className="flex gap-3 mt-3">
                      {[
                        { label: 'Brightness', val: `${adaptedBrightness}%`, icon: Sun },
                        { label: 'Warmth', val: `${adaptedWarmth}%`, icon: RefreshCw },
                      ].map(stat => {
                        const StatIcon = stat.icon;
                        return (
                          <div
                            key={stat.label}
                            className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl"
                            style={{ background: `${TEAL}12` }}
                          >
                            <StatIcon className="w-3.5 h-3.5" style={{ color: TEAL }} />
                            <div>
                              <div style={{ color: '#1C2E3E', fontSize: '0.78rem', fontWeight: 600 }}>{stat.val}</div>
                              <div style={{ color: '#8B9EB0', fontSize: '0.65rem' }}>{stat.label}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Preview card */}
        <div
          className="relative overflow-hidden rounded-3xl"
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(28,46,62,0.08)',
            boxShadow: '0 4px 20px rgba(28,46,62,0.07)',
          }}
        >
          <div className="flex" style={{ height: 140 }}>
            {/* Before */}
            <div
              className="flex-1 flex flex-col justify-end p-5"
              style={{ background: 'linear-gradient(135deg, #E8F0F5, #D8E8F0)' }}
            >
              <p style={{ color: '#7A9AB5', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                Before
              </p>
              <div className="space-y-2">
                <div className="h-2 rounded-full" style={{ background: '#2C4A6E', width: '85%' }} />
                <div className="h-2 rounded-full" style={{ background: '#2C4A6E', width: '65%', opacity: 0.7 }} />
                <div className="h-2 rounded-full" style={{ background: '#2C4A6E', width: '45%', opacity: 0.5 }} />
              </div>
            </div>

            {/* Divider */}
            <div className="w-px" style={{ background: 'rgba(28,46,62,0.1)' }} />

            {/* After */}
            <motion.div
              className="flex-1 flex flex-col justify-end p-5 transition-all duration-700"
              style={{
                background: easeActive
                  ? `linear-gradient(135deg, rgba(255,240,210,${0.5 + activeWarmth * 0.003}), rgba(240,220,190,${0.6 + activeWarmth * 0.002}))`
                  : 'linear-gradient(135deg, #F0EDE8, #EAE7E0)',
                filter: `brightness(${0.88 + previewBrightness * 0.14}) contrast(${easeActive ? 0.82 + contrast * 0.003 : 1})`,
              }}
            >
              <p style={{ color: '#7A9AB5', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                With Ease
              </p>
              <div className="space-y-2">
                <div className="h-2 rounded-full" style={{ background: '#4A6A80', width: '85%', opacity: 0.7 }} />
                <div className="h-2 rounded-full" style={{ background: '#4A6A80', width: '65%', opacity: 0.5 }} />
                <div className="h-2 rounded-full" style={{ background: '#4A6A80', width: '45%', opacity: 0.35 }} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Primary CTA */}
        <motion.button
          onClick={() => setEaseActive(!easeActive)}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl transition-all"
          style={{
            background: easeActive
              ? 'rgba(28,46,62,0.07)'
              : `linear-gradient(135deg, ${TEAL}, #3A7A8E)`,
            color: easeActive ? '#5A7080' : 'white',
            border: easeActive ? '1.5px solid rgba(28,46,62,0.12)' : 'none',
            boxShadow: easeActive ? 'none' : `0 8px 28px ${TEAL}35`,
          }}
        >
          <Wind className="w-5 h-5" />
          <span>{easeActive ? 'Turn Off Ease Mode' : 'Turn On Ease Mode'}</span>
        </motion.button>

        {/* Sliders */}
        <div
          className="rounded-3xl px-5 py-5 space-y-5"
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(28,46,62,0.08)',
            boxShadow: '0 2px 12px rgba(28,46,62,0.05)',
          }}
        >
          <div className="flex items-center justify-between">
            <p style={{ color: '#1C2E3E', fontWeight: 600 }}>Display adjustments</p>
            {autoAdapt && (
              <span
                className="px-2.5 py-1 rounded-full"
                style={{ background: `${TEAL}12`, color: TEAL, fontSize: '0.68rem', fontWeight: 600 }}
              >
                Auto-controlled
              </span>
            )}
          </div>
          {sliders.map(s => (
            <div key={s.id} style={{ opacity: autoAdapt && s.id !== 'contrast' ? 0.6 : 1 }}>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-3">
                  <s.icon className="w-4 h-4" style={{ color: s.iconColor }} />
                  <div>
                    <div style={{ color: '#1C2E3E', fontSize: '0.875rem', fontWeight: 500 }}>{s.label}</div>
                    <div style={{ color: '#8B9EB0', fontSize: '0.72rem' }}>{s.sublabel}</div>
                  </div>
                </div>
                <span style={{ color: '#8B9EB0', fontSize: '0.82rem' }}>{values[s.id]}%</span>
              </div>
              <input
                type="range"
                min={s.min}
                max={s.max}
                value={values[s.id]}
                onChange={e => !autoAdapt || s.id === 'contrast' ? setters[s.id](Number(e.target.value)) : undefined}
                disabled={autoAdapt && s.id !== 'contrast'}
                className="w-full rounded-full"
                style={{
                  height: '5px',
                  background: `linear-gradient(to right, ${s.trackColor} 0%, ${s.trackColor} ${((values[s.id] - s.min) / (s.max - s.min)) * 100}%, rgba(28,46,62,0.12) ${((values[s.id] - s.min) / (s.max - s.min)) * 100}%, rgba(28,46,62,0.12) 100%)`,
                  borderRadius: '99px',
                  cursor: autoAdapt && s.id !== 'contrast' ? 'not-allowed' : 'pointer',
                }}
              />
            </div>
          ))}
        </div>

        {/* Toggle modes */}
        <div
          className="rounded-3xl px-5 py-5 space-y-3"
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(28,46,62,0.08)',
            boxShadow: '0 2px 12px rgba(28,46,62,0.05)',
          }}
        >
          <p style={{ color: '#1C2E3E', fontWeight: 600, marginBottom: 4 }}>Comfort modes</p>
          {toggles.map(t => (
            <button
              key={t.id}
              onClick={t.onToggle}
              className="w-full flex items-center justify-between py-3.5 rounded-2xl px-4 transition-all"
              style={{
                background: t.active ? `${t.color}10` : 'rgba(28,46,62,0.03)',
                border: `1px solid ${t.active ? t.color + '30' : 'rgba(28,46,62,0.07)'}`,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: t.active ? `${t.color}18` : 'rgba(28,46,62,0.06)' }}
                >
                  <t.icon className="w-4 h-4" style={{ color: t.active ? t.color : '#8B9EB0' }} />
                </div>
                <div className="text-left">
                  <div style={{ color: '#1C2E3E', fontSize: '0.875rem', fontWeight: 500 }}>{t.label}</div>
                  <div style={{ color: '#8B9EB0', fontSize: '0.72rem' }}>{t.sub}</div>
                </div>
              </div>
              {/* Toggle pill */}
              <div
                className="relative flex-shrink-0 transition-all"
                style={{
                  width: 44, height: 24, borderRadius: 99,
                  background: t.active ? t.color : 'rgba(28,46,62,0.14)',
                }}
              >
                <motion.div
                  animate={{ x: t.active ? 20 : 2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="absolute top-1"
                  style={{ width: 20, height: 20, borderRadius: 99, background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
                />
              </div>
            </button>
          ))}
        </div>

        {/* Disclaimer */}
        <div
          className="px-5 py-4 rounded-2xl"
          style={{ background: `${TEAL}08`, border: `1px solid ${TEAL}20` }}
        >
          <p style={{ color: '#5A7080', fontSize: '0.78rem', lineHeight: 1.65 }}>
            Smart Adaptation reads your current environment to automatically soften brightness and warm the display tone. Manual controls become available whenever you turn off auto-adapt.
          </p>
        </div>
      </div>
    </div>
  );
}