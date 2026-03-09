import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Wind, RefreshCw, ChevronRight, MapPin, Zap, X, AlertTriangle, Sun, TrendingUp } from 'lucide-react';

type ComfortState = 'Comfortable' | 'Building Strain' | 'Sensitive' | 'Recovering';

const STATE_CONFIG: Record<ComfortState, { color: string; ring: string; bg: string; label: string; message: string }> = {
  'Comfortable': {
    color: '#1edd00',
    ring: '#1edd0020',
    bg: '#1edd0010',
    label: 'Comfortable',
    message: 'Your eyes are handling today\'s light well. A calm, easy morning.',
  },
  'Building Strain': {
    color: '#A8854A',
    ring: '#A8854A20',
    bg: '#A8854A10',
    label: 'Building Strain',
    message: 'Glare and screen time are adding to your visual load.',
  },
  'Sensitive': {
    color: '#B8724A',
    ring: '#B8724A20',
    bg: '#B8724A10',
    label: 'Sensitive',
    message: 'Your eyes have had a bright morning. Some rest would feel good.',
  },
  'Recovering': {
    color: '#4A8FA5',
    ring: '#4A8FA520',
    bg: '#4A8FA510',
    label: 'Recovering',
    message: 'Good — your visual load is easing. Keep the screen dimmer for now.',
  },
};

// Fixed bar heights for the timeline preview (seeded, not random)
const BAR_HEIGHTS = [22, 28, 25, 32, 45, 60, 72, 68, 55, 65, 78, 70, 62, 55, 48, 40, 38, 42, 50, 58, 65, 52, 38, 25];

// Environment alert data
interface EnvironmentAlert {
  id: string;
  location: string;
  locationType: string;
  intensity: 'Moderate' | 'High' | 'Very High';
  luxLevel: number;
  duration: string;
  advice: string;
}

const ACTIVE_ALERT: EnvironmentAlert = {
  id: 'alert-1',
  location: 'Open Office Floor',
  locationType: 'Workplace',
  intensity: 'High',
  luxLevel: 820,
  duration: '1h 15m',
  advice: 'Overhead fluorescent lighting and screen glare are accumulating. Consider moving or turning on Ease Mode.',
};

const INTENSITY_STYLE = {
  Moderate: { color: '#A8854A', bg: '#A8854A12', border: '#A8854A35', icon: Sun },
  High: { color: '#B8724A', bg: '#B8724A12', border: '#B8724A35', icon: AlertTriangle },
  'Very High': { color: '#C05040', bg: '#C0504012', border: '#C0504035', icon: Zap },
};

function EnvironmentAlertBanner({
  alert,
  onDismiss,
}: {
  alert: EnvironmentAlert;
  onDismiss: () => void;
}) {
  const navigate = useNavigate();
  const style = INTENSITY_STYLE[alert.intensity];
  const AlertIcon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: '#FFFFFF',
        border: `1px solid ${style.border}`,
        boxShadow: `0 4px 18px ${style.color}18`,
      }}
    >
      {/* Alert accent bar */}
      <div className="h-1" style={{ background: style.color, opacity: 0.7 }} />

      <div className="px-4 py-4">
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: style.bg }}
          >
            <AlertIcon className="w-5 h-5" style={{ color: style.color }} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span style={{ color: '#1C2E3E', fontWeight: 600, fontSize: '0.875rem' }}>
                {alert.location}
              </span>
              <span
                className="px-2 py-0.5 rounded-full flex-shrink-0"
                style={{
                  background: style.bg,
                  border: `1px solid ${style.border}`,
                  color: style.color,
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                {alert.intensity}
              </span>
            </div>
            <p style={{ color: '#8B9EB0', fontSize: '0.72rem', marginBottom: 8 }}>
              {alert.luxLevel} lux · {alert.duration} exposure
            </p>
            <p style={{ color: '#5A7080', fontSize: '0.8rem', lineHeight: 1.55 }}>
              {alert.advice}
            </p>
          </div>

          <button
            onClick={onDismiss}
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
            style={{ background: 'rgba(28,46,62,0.06)' }}
          >
            <X className="w-3.5 h-3.5" style={{ color: '#8B9EB0' }} />
          </button>
        </div>

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => navigate('/ease')}
            className="flex-1 py-2.5 rounded-xl transition-all"
            style={{
              background: `linear-gradient(135deg, ${style.color}, ${style.color}CC)`,
              color: 'white',
              fontSize: '0.8rem',
              fontWeight: 600,
              boxShadow: `0 4px 12px ${style.color}30`,
            }}
          >
            Turn on Ease Mode
          </button>
          <button
            onClick={() => navigate('/scan')}
            className="px-4 py-2.5 rounded-xl transition-all"
            style={{
              background: 'rgba(28,46,62,0.06)',
              color: '#5A7080',
              fontSize: '0.8rem',
              fontWeight: 500,
              border: '1px solid rgba(28,46,62,0.1)',
            }}
          >
            Scan area
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function Home() {
  const navigate = useNavigate();
  const [comfortState] = useState<ComfortState>('Building Strain');
  const [visualLoad] = useState(58);
  const [environment] = useState('Office — indirect glare');
  const [timeSinceReset] = useState('1h 40m');
  const [alertDismissed, setAlertDismissed] = useState(false);

  const cfg = STATE_CONFIG[comfortState];

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  return (
    <div
      className="min-h-screen max-w-md mx-auto pb-28"
      style={{ background: 'linear-gradient(180deg, #F8F5EF 0%, #EDF4F7 100%)' }}
    >
      {/* Header */}
      <div className="px-6 pt-12 pb-2">
        <p style={{ color: '#8B9EB0', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Today
        </p>
        <h1 style={{ color: '#1C2E3E', marginTop: 2 }}>{today}</h1>
      </div>

      {/* Environment Alert Banner */}
      <div className="px-6 pt-4">
        <AnimatePresence>
          {!alertDismissed && (
            <EnvironmentAlertBanner
              alert={ACTIVE_ALERT}
              onDismiss={() => setAlertDismissed(true)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Central eye comfort visualization */}
      <div className="flex flex-col items-center py-8 px-6">
        <div className="relative" style={{ width: 200, height: 200 }}>
          {/* Animated outer halo */}
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute rounded-full"
            style={{
              inset: -16,
              background: `radial-gradient(circle, ${cfg.color}25 0%, transparent 70%)`,
            }}
          />

          <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
            <defs>
              <radialGradient id="iris-fill" cx="50%" cy="42%" r="50%">
                <stop offset="0%" stopColor={cfg.color} stopOpacity="0.55" />
                <stop offset="55%" stopColor={cfg.color} stopOpacity="0.25" />
                <stop offset="100%" stopColor={cfg.color} stopOpacity="0.05" />
              </radialGradient>
              <filter id="iris-glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Outer comfort rings */}
            <motion.circle
              cx="100" cy="100" r="92"
              fill="none"
              stroke={cfg.color}
              strokeWidth="1"
              strokeOpacity="0.12"
              animate={{ r: [92, 94, 92] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <circle cx="100" cy="100" r="82" fill="none" stroke={cfg.color} strokeWidth="1.5" strokeOpacity="0.2" />

            {/* Iris body */}
            <circle cx="100" cy="100" r="70" fill="url(#iris-fill)" />
            <circle cx="100" cy="100" r="70" fill="none" stroke={cfg.color} strokeWidth="3" strokeOpacity="0.6" filter="url(#iris-glow)" />

            {/* Iris texture rings */}
            <circle cx="100" cy="100" r="58" fill="none" stroke={cfg.color} strokeWidth="1.5" strokeOpacity="0.3" />
            <circle cx="100" cy="100" r="48" fill="none" stroke={cfg.color} strokeWidth="1" strokeOpacity="0.2" />

            {/* Pupil */}
            <circle cx="100" cy="100" r="34" fill="#1C2E3E" fillOpacity="0.85" />
            <circle cx="100" cy="100" r="26" fill="#1C2E3E" fillOpacity="0.95" />

            {/* Highlight */}
            <circle cx="112" cy="88" r="7" fill="white" fillOpacity="0.45" />
            <circle cx="91" cy="93" r="3.5" fill="white" fillOpacity="0.2" />
          </svg>
        </div>

        {/* State label */}
        <motion.div
          key={comfortState}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center"
        >
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-2"
            style={{ background: cfg.bg, border: `1px solid ${cfg.color}30` }}
          >
            <div className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
            <span style={{ color: cfg.color, fontWeight: 600, fontSize: '0.9rem' }}>{cfg.label}</span>
          </div>
          <p className="mt-1" style={{ color: '#5A7080', fontSize: '0.875rem', maxWidth: 260, lineHeight: 1.6 }}>
            {cfg.message}
          </p>
        </motion.div>
      </div>

      <div className="px-6 space-y-4">
        {/* Primary CTA */}
        <motion.button
          onClick={() => navigate('/ease')}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all"
          style={{
            background: 'linear-gradient(135deg, #4A8FA5, #3A7A8E)',
            color: 'white',
            boxShadow: '0 8px 28px rgba(74, 143, 165, 0.35)',
          }}
        >
          <Wind className="w-5 h-5" />
          <span>Turn On Ease Mode</span>
        </motion.button>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Eye, label: 'Visual Load', value: `${visualLoad}`, unit: '/100', color: '#4A8FA5' },
            { icon: MapPin, label: 'Environment', value: environment, unit: '', color: '#1edd00', small: true },
            { icon: RefreshCw, label: 'Since Rest', value: timeSinceReset, unit: '', color: '#A8854A' },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className="px-4 py-4 rounded-2xl"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(28,46,62,0.08)',
                  boxShadow: '0 2px 12px rgba(28,46,62,0.06)',
                }}
              >
                <Icon className="w-4 h-4 mb-2" style={{ color: card.color }} />
                <div style={{ fontSize: card.small ? '0.7rem' : '1.3rem', fontWeight: 600, color: '#1C2E3E', lineHeight: 1.2 }}>
                  {card.value}
                  {card.unit && <span style={{ fontSize: '0.75rem', color: '#8B9EB0', fontWeight: 400, marginLeft: 1 }}>{card.unit}</span>}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#8B9EB0', marginTop: 3 }}>{card.label}</div>
              </div>
            );
          })}
        </div>

        {/* Light Tracker card — Feature 1 */}
        <button
          onClick={() => navigate('/light-tracker')}
          className="w-full rounded-2xl px-5 py-4 text-left transition-all"
          style={{
            background: 'linear-gradient(135deg, #EFF6F9 0%, #EAF2EE 100%)',
            border: '1px solid rgba(74,143,165,0.2)',
            boxShadow: '0 2px 12px rgba(28,46,62,0.06)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#4A8FA520' }}>
                <Sun className="w-4 h-4" style={{ color: '#4A8FA5' }} />
              </div>
              <div>
                <span style={{ color: '#1C2E3E', fontWeight: 600, fontSize: '0.875rem' }}>Artificial Light Today</span>
                <div style={{ color: '#8B9EB0', fontSize: '0.7rem' }}>340 / 480 lux-hrs absorbed</div>
              </div>
            </div>
            <div className="flex items-center gap-1" style={{ color: '#4A8FA5', fontSize: '0.8rem' }}>
              <span>Track</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          {/* Mini light gauge bar */}
          <div className="rounded-full overflow-hidden" style={{ height: 5, background: 'rgba(28,46,62,0.08)' }}>
            <div
              className="h-full rounded-full"
              style={{
                width: '71%',
                background: 'linear-gradient(90deg, #1edd00, #A8854A)',
              }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span style={{ color: '#8B9EB0', fontSize: '0.65rem' }}>71% of daily limit</span>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" style={{ color: '#A8854A' }} />
              <span style={{ color: '#A8854A', fontSize: '0.65rem', fontWeight: 600 }}>+8% vs yesterday</span>
            </div>
          </div>
        </button>

        {/* Timeline preview */}
        <button
          onClick={() => navigate('/timeline')}
          className="w-full rounded-2xl px-5 py-4 text-left transition-all"
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(28,46,62,0.08)',
            boxShadow: '0 2px 12px rgba(28,46,62,0.06)',
          }}
        >
          <div className="flex justify-between items-center mb-3">
            <span style={{ color: '#1C2E3E', fontWeight: 500 }}>Today's Visual Load</span>
            <span style={{ color: '#4A8FA5', fontSize: '0.82rem' }}>View details →</span>
          </div>
          <div className="flex items-end gap-0.5 h-12">
            {BAR_HEIGHTS.map((h, i) => {
              const active = i <= 14;
              const color = h > 65 ? '#B8724A' : h > 45 ? '#A8854A' : '#1edd00';
              return (
                <div
                  key={i}
                  className="flex-1 rounded-t transition-all"
                  style={{
                    height: active ? `${h}%` : '15%',
                    background: active ? color : 'rgba(28,46,62,0.08)',
                    opacity: active ? (h > 60 ? 1 : 0.75) : 0.4,
                  }}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-2" style={{ fontSize: '0.7rem', color: '#8B9EB0' }}>
            <span>Morning</span>
            <span>Afternoon</span>
            <span>Evening</span>
            <span>Night</span>
          </div>
        </button>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/scan')}
            className="flex items-center gap-3 px-4 py-4 rounded-2xl text-left transition-all"
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(28,46,62,0.08)',
              boxShadow: '0 2px 12px rgba(28,46,62,0.06)',
            }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#1edd0015' }}>
              <MapPin className="w-4 h-4" style={{ color: '#1edd00' }} />
            </div>
            <div>
              <div style={{ color: '#1C2E3E', fontSize: '0.875rem', fontWeight: 500 }}>Your Space</div>
              <div style={{ color: '#8B9EB0', fontSize: '0.72rem' }}>Scan surroundings</div>
            </div>
          </button>

          <button
            onClick={() => navigate('/recovery')}
            className="flex items-center gap-3 px-4 py-4 rounded-2xl text-left transition-all"
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(28,46,62,0.08)',
              boxShadow: '0 2px 12px rgba(28,46,62,0.06)',
            }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#4A8FA515' }}>
              <RefreshCw className="w-4 h-4" style={{ color: '#4A8FA5' }} />
            </div>
            <div>
              <div style={{ color: '#1C2E3E', fontSize: '0.875rem', fontWeight: 500 }}>Eye Reset</div>
              <div style={{ color: '#8B9EB0', fontSize: '0.72rem' }}>20-sec recovery</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}