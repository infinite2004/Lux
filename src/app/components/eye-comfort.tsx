import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Wind, RefreshCw, ChevronRight } from 'lucide-react';

const TEAL = '#4A8FA5';
const GOLD = '#A8854A';
const CORAL = '#B8724A';

interface Contributor {
  label: string;
  level: 'low' | 'medium' | 'high';
  detail: string;
}

const CONTRIBUTORS: Contributor[] = [
  { label: 'Screen exposure', level: 'high', detail: '3h 20m cumulative today' },
  { label: 'Glare', level: 'high', detail: 'Indirect window reflection detected' },
  { label: 'Ambient brightness', level: 'medium', detail: 'Moderate overhead light' },
  { label: 'Contrast', level: 'low', detail: 'Screen contrast within comfort range' },
];

const LEVEL_CONFIG = {
  low: { color: '#1edd00', bg: '#1edd0012', label: 'Low' },
  medium: { color: GOLD, bg: `${GOLD}12`, label: 'Medium' },
  high: { color: CORAL, bg: `${CORAL}12`, label: 'Higher' },
};

const SUGGESTIONS = [
  'A softer screen tone may feel more comfortable right now.',
  'Glare appears to be affecting your eyes more than overall brightness.',
  'A short look-away reset may help reduce sensitivity.',
];

export function EyeComfort() {
  const navigate = useNavigate();
  const comfortScore = 42; // out of 100 — lower = more strain
  const comfortLabel = 'Building Strain';
  const comfortColor = GOLD;

  return (
    <div
      className="min-h-screen max-w-md mx-auto pb-28"
      style={{ background: 'linear-gradient(180deg, #F8F5EF 0%, #EDF4F7 100%)' }}
    >
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <p style={{ color: '#8B9EB0', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Eye health
        </p>
        <h1 style={{ color: '#1C2E3E', marginTop: 2 }}>Eye Comfort</h1>
      </div>

      <div className="px-6 space-y-5">
        {/* Large eye comfort ring */}
        <div
          className="flex flex-col items-center py-8 rounded-3xl"
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(28,46,62,0.08)',
            boxShadow: '0 4px 24px rgba(28,46,62,0.07)',
          }}
        >
          <div className="relative" style={{ width: 200, height: 200 }}>
            {/* Glow */}
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.65, 0.4] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute rounded-full"
              style={{
                inset: -20,
                background: `radial-gradient(circle, ${comfortColor}20 0%, transparent 70%)`,
              }}
            />

            {/* Comfort progress arc */}
            <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
              <defs>
                <radialGradient id="ec-iris" cx="50%" cy="42%" r="52%">
                  <stop offset="0%" stopColor={comfortColor} stopOpacity="0.5" />
                  <stop offset="60%" stopColor={comfortColor} stopOpacity="0.2" />
                  <stop offset="100%" stopColor={comfortColor} stopOpacity="0.04" />
                </radialGradient>
                <filter id="ec-glow">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Arc background */}
              <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(28,46,62,0.06)" strokeWidth="8" />
              {/* Arc progress */}
              <motion.circle
                cx="100" cy="100" r="90"
                fill="none"
                stroke={comfortColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 90}
                initial={{ strokeDashoffset: 2 * Math.PI * 90 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 90 * (1 - comfortScore / 100) }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
                style={{ transform: 'rotate(-90deg)', transformOrigin: '100px 100px' }}
                strokeOpacity="0.7"
                filter="url(#ec-glow)"
              />

              {/* Iris rings */}
              <circle cx="100" cy="100" r="72" fill="url(#ec-iris)" />
              <circle cx="100" cy="100" r="72" fill="none" stroke={comfortColor} strokeWidth="2.5" strokeOpacity="0.5" />
              <circle cx="100" cy="100" r="60" fill="none" stroke={comfortColor} strokeWidth="1.5" strokeOpacity="0.28" />
              <circle cx="100" cy="100" r="48" fill="none" stroke={comfortColor} strokeWidth="1" strokeOpacity="0.18" />

              {/* Pupil */}
              <circle cx="100" cy="100" r="34" fill="#1C2E3E" fillOpacity="0.88" />
              <circle cx="100" cy="100" r="26" fill="#1C2E3E" fillOpacity="0.96" />

              {/* Score in pupil */}
              <text x="100" y="96" textAnchor="middle" fill="white" fontSize="20" fontWeight="600" opacity="0.9">
                {comfortScore}
              </text>
              <text x="100" y="110" textAnchor="middle" fill="white" fontSize="9" opacity="0.5">
                /100
              </text>

              {/* Highlight */}
              <circle cx="112" cy="88" r="6" fill="white" fillOpacity="0.4" />
            </svg>
          </div>

          <div className="mt-4 text-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
              style={{ background: `${comfortColor}15`, border: `1px solid ${comfortColor}30` }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: comfortColor }} />
              <span style={{ color: comfortColor, fontWeight: 600, fontSize: '0.875rem' }}>
                {comfortLabel}
              </span>
            </div>
            <p className="mt-2" style={{ color: '#5A7080', fontSize: '0.82rem' }}>
              Comfort score for 2:30 PM
            </p>
          </div>
        </div>

        {/* Contributors */}
        <div
          className="rounded-3xl px-5 py-5"
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(28,46,62,0.08)',
            boxShadow: '0 2px 12px rgba(28,46,62,0.05)',
          }}
        >
          <p className="mb-4" style={{ color: '#1C2E3E', fontWeight: 600 }}>
            Contributing factors
          </p>
          <div className="space-y-3">
            {CONTRIBUTORS.map((c, i) => {
              const lcfg = LEVEL_CONFIG[c.level];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: lcfg.color }}
                    />
                    <div>
                      <div style={{ color: '#1C2E3E', fontSize: '0.875rem', fontWeight: 500 }}>{c.label}</div>
                      <div style={{ color: '#8B9EB0', fontSize: '0.72rem' }}>{c.detail}</div>
                    </div>
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-full text-xs flex-shrink-0"
                    style={{ background: lcfg.bg, color: lcfg.color, fontWeight: 600 }}
                  >
                    {lcfg.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* What your eyes may need */}
        <div>
          <p className="mb-3" style={{ color: '#5A7080', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.04em' }}>
            What your eyes may need right now
          </p>
          <div className="space-y-2.5">
            {SUGGESTIONS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-start gap-3 px-4 py-3.5 rounded-2xl"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(28,46,62,0.07)',
                }}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `${TEAL}18` }}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: TEAL }} />
                </div>
                <p style={{ color: '#5A7080', fontSize: '0.875rem', lineHeight: 1.6 }}>{s}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action CTAs */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/recovery')}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl transition-all"
            style={{
              background: `linear-gradient(135deg, ${TEAL}, #3A7A8E)`,
              color: 'white',
              boxShadow: `0 6px 20px ${TEAL}35`,
            }}
          >
            <RefreshCw className="w-4 h-4" />
            <span style={{ fontSize: '0.875rem' }}>Eye Reset</span>
          </button>

          <button
            onClick={() => navigate('/ease')}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl transition-all"
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(28,46,62,0.1)',
              color: '#1C2E3E',
              boxShadow: '0 2px 10px rgba(28,46,62,0.07)',
            }}
          >
            <Wind className="w-4 h-4" style={{ color: TEAL }} />
            <span style={{ fontSize: '0.875rem' }}>Ease Mode</span>
          </button>
        </div>
      </div>
    </div>
  );
}
