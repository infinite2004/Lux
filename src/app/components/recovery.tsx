import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

const TEAL = '#4A8FA5';
const SAGE = '#1edd00';
const DURATION = 20;

const LOOK_AWAY_TIPS = [
  'Look at something at least 20 feet away.',
  'Let your eyes soften — no focus needed.',
  'Blink naturally and let your gaze rest.',
];

export function Recovery() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsComplete(true);
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  // Rotate tips
  useEffect(() => {
    if (!isActive) return;
    const t = setInterval(() => {
      setTipIndex(i => (i + 1) % LOOK_AWAY_TIPS.length);
    }, 6000);
    return () => clearInterval(t);
  }, [isActive]);

  const progress = (DURATION - timeLeft) / DURATION;
  const r = 96;
  const circumference = 2 * Math.PI * r;

  return (
    <div
      className="min-h-screen max-w-md mx-auto flex flex-col"
      style={{
        background: isActive
          ? 'linear-gradient(180deg, #1A2E3E 0%, #1C3545 100%)'
          : 'linear-gradient(180deg, #F8F5EF 0%, #EDF4F7 100%)',
        transition: 'background 1.5s ease',
      }}
    >
      {/* Close button */}
      <div className="flex justify-end px-6 pt-12 pb-4">
        <button
          onClick={() => navigate('/home')}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
          style={{ background: isActive ? 'rgba(255,255,255,0.1)' : 'rgba(28,46,62,0.08)' }}
        >
          <X className="w-5 h-5" style={{ color: isActive ? 'rgba(255,255,255,0.6)' : '#5A7080' }} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          {!isComplete ? (
            <motion.div
              key="timer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center w-full"
            >
              {/* Progress ring */}
              <div className="relative mb-10" style={{ width: 220, height: 220 }}>
                {/* Ambient glow */}
                <motion.div
                  animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.55, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute rounded-full"
                  style={{
                    inset: -24,
                    background: `radial-gradient(circle, ${isActive ? TEAL + '40' : TEAL + '20'} 0%, transparent 70%)`,
                  }}
                />

                <svg viewBox="0 0 220 220" className="absolute inset-0 w-full h-full">
                  <defs>
                    <linearGradient id="rec-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={TEAL} />
                      <stop offset="100%" stopColor={SAGE} />
                    </linearGradient>
                    <filter id="rec-glow">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>

                  {/* Background track */}
                  <circle
                    cx="110" cy="110" r={r}
                    fill="none"
                    stroke={isActive ? 'rgba(255,255,255,0.1)' : 'rgba(28,46,62,0.08)'}
                    strokeWidth="8"
                  />

                  {/* Progress arc */}
                  <motion.circle
                    cx="110" cy="110" r={r}
                    fill="none"
                    stroke="url(#rec-grad)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference * (1 - progress) }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '110px 110px' }}
                    filter="url(#rec-glow)"
                  />

                  {/* Iris rings inside */}
                  <circle cx="110" cy="110" r="78" fill="none" stroke={TEAL} strokeWidth="1.5" strokeOpacity={isActive ? 0.25 : 0.15} />
                  <circle cx="110" cy="110" r="65" fill={isActive ? 'rgba(74,143,165,0.08)' : 'rgba(74,143,165,0.04)'} />
                  <circle cx="110" cy="110" r="65" fill="none" stroke={TEAL} strokeWidth="1" strokeOpacity="0.15" />

                  {/* Pupil / center */}
                  <circle cx="110" cy="110" r="46" fill={isActive ? 'rgba(26,46,62,0.9)' : 'rgba(28,46,62,0.07)'} />
                  <circle cx="110" cy="110" r="36" fill={isActive ? 'rgba(26,46,62,0.97)' : 'rgba(28,46,62,0.1)'} />
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div
                    key={timeLeft}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                      fontSize: '3rem',
                      fontWeight: 600,
                      color: isActive ? 'rgba(255,255,255,0.9)' : '#1C2E3E',
                      lineHeight: 1,
                    }}
                  >
                    {timeLeft}
                  </motion.div>
                  <div style={{ fontSize: '0.78rem', color: isActive ? 'rgba(255,255,255,0.45)' : '#8B9EB0', marginTop: 4 }}>
                    seconds
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="text-center mb-8 px-4">
                <h2 style={{ color: isActive ? 'rgba(255,255,255,0.88)' : '#1C2E3E', marginBottom: 8 }}>
                  {isActive ? 'Look away for a moment' : 'A short visual reset'}
                </h2>
                <p style={{ color: isActive ? 'rgba(255,255,255,0.5)' : '#5A7080', fontSize: '0.875rem', lineHeight: 1.65, maxWidth: 260 }}>
                  {isActive
                    ? 'A short visual reset can help your eyes recover from cumulative strain.'
                    : 'A short visual reset can help your eyes recover. This takes just 20 seconds.'}
                </p>
              </div>

              {/* Rotating tip */}
              <AnimatePresence mode="wait">
                {isActive && (
                  <motion.div
                    key={tipIndex}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mb-8 px-6 py-3.5 rounded-2xl"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      maxWidth: 280,
                    }}
                  >
                    <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem', textAlign: 'center', lineHeight: 1.6 }}>
                      {LOOK_AWAY_TIPS[tipIndex]}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action button */}
              {!isActive && (
                <motion.button
                  onClick={() => setIsActive(true)}
                  whileTap={{ scale: 0.97 }}
                  className="px-10 py-4 rounded-2xl transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${TEAL}, #3A7A8E)`,
                    color: 'white',
                    boxShadow: `0 8px 28px ${TEAL}35`,
                  }}
                >
                  Begin Eye Reset
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center px-4"
            >
              {/* Success eye */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                className="relative mb-8"
                style={{ width: 120, height: 120 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-full"
                  style={{ background: `radial-gradient(circle, ${SAGE}35 0%, transparent 70%)` }}
                />
                <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full">
                  <circle cx="60" cy="60" r="55" fill={SAGE} fillOpacity="0.15" />
                  <circle cx="60" cy="60" r="45" fill={SAGE} fillOpacity="0.2" />
                  <circle cx="60" cy="60" r="35" fill={SAGE} />
                  <path d="M44 60 L55 71 L78 48" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </motion.div>

              <h2 style={{ color: '#1C2E3E', marginBottom: 8 }}>Reset complete</h2>
              <p style={{ color: '#5A7080', fontSize: '0.875rem', lineHeight: 1.65, maxWidth: 260, marginBottom: 32 }}>
                Your visual load has eased a little. Keep your screen softer for the next while if you can.
              </p>

              <div className="flex gap-3 w-full max-w-xs">
                <button
                  onClick={() => { setTimeLeft(DURATION); setIsComplete(false); setIsActive(false); }}
                  className="flex-1 py-3.5 rounded-2xl transition-all"
                  style={{
                    background: 'rgba(28,46,62,0.07)',
                    border: '1px solid rgba(28,46,62,0.1)',
                    color: '#5A7080',
                    fontSize: '0.875rem',
                  }}
                >
                  Again
                </button>
                <button
                  onClick={() => navigate('/home')}
                  className="flex-1 py-3.5 rounded-2xl transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${TEAL}, #3A7A8E)`,
                    color: 'white',
                    boxShadow: `0 6px 20px ${TEAL}30`,
                    fontSize: '0.875rem',
                  }}
                >
                  Back to Today
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Skip */}
      {!isComplete && (
        <div className="px-6 pb-10">
          <button
            onClick={() => navigate('/home')}
            className="w-full py-3 text-center transition-all"
            style={{ color: isActive ? 'rgba(255,255,255,0.35)' : '#8B9EB0', fontSize: '0.875rem' }}
          >
            {isActive ? 'End early' : 'Skip for now'}
          </button>
        </div>
      )}
    </div>
  );
}