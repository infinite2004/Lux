import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Check } from 'lucide-react';

const TEAL = '#4A8FA5';
const SAGE = '#1edd00';

export function Onboarding() {
  const [step, setStep] = useState(0);
  const [goals, setGoals] = useState<string[]>([]);
  const navigate = useNavigate();

  const totalSteps = 5;

  const introSlides = [
    {
      heading: 'Your eyes move through hundreds of light changes every day.',
      body: 'Bright commutes, glowing screens, harsh overhead lights — it adds up gradually.',
    },
    {
      heading: 'Luma helps you notice visual strain before discomfort builds.',
      body: 'Gentle, ongoing awareness — so you can act before your eyes feel the weight.',
    },
    {
      heading: 'Support your eyes with small, gentle adjustments.',
      body: 'Rest moments, softer screens, and calmer surroundings — all within reach.',
    },
  ];

  const goalOptions = [
    { id: 'comfort', label: 'Better comfort', desc: 'Reduce daily eye fatigue' },
    { id: 'evenings', label: 'Easier evenings', desc: 'Wind down without strain' },
    { id: 'glare', label: 'Less glare', desc: 'Calm harsh environments' },
    { id: 'screen', label: 'Softer screen experience', desc: 'Gentler display adjustments' },
  ];

  const privacyPoints = [
    'Your data stays private by default — nothing is shared.',
    'Luma supports awareness and comfort, not diagnosis.',
    'Sensing can be paused at any time.',
    'Manual control is always available to you.',
  ];

  const toggleGoal = (id: string) => {
    setGoals(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      navigate('/home');
    }
  };

  const isLastStep = step === totalSteps - 1;
  const isGoalStep = step === 3;
  const canContinue = !isGoalStep || goals.length > 0;

  return (
    <div
      className="min-h-screen flex flex-col max-w-md mx-auto"
      style={{ background: 'linear-gradient(160deg, #F8F5EF 0%, #EDF4F7 100%)' }}
    >
      {/* Header */}
      <div className="flex justify-between items-center px-6 pt-12 pb-4">
        <div
          style={{ color: TEAL, fontSize: '1.3rem', fontWeight: 600, letterSpacing: '0.04em' }}
        >
          luma
        </div>
        {/* Progress dots */}
        <div className="flex gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-500"
              style={{
                width: i === step ? '20px' : '6px',
                height: '6px',
                background: i <= step ? TEAL : 'rgba(28,46,62,0.15)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {/* Intro slides 0-2 */}
          {step < 3 && (
            <motion.div
              key={`intro-${step}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
            >
              {/* Eye iris graphic */}
              <div className="relative mb-10" style={{ width: 160, height: 160 }}>
                {/* Outer halo */}
                <motion.div
                  animate={{ scale: [1, 1.06, 1], opacity: [0.15, 0.25, 0.15] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-full"
                  style={{ background: `radial-gradient(circle, ${TEAL}40 0%, transparent 70%)` }}
                />
                <svg viewBox="0 0 160 160" className="absolute inset-0 w-full h-full">
                  <defs>
                    <radialGradient id={`ob-iris-${step}`} cx="50%" cy="40%" r="50%">
                      <stop offset="0%" stopColor={step === 0 ? SAGE : step === 1 ? TEAL : '#7B9BB5'} stopOpacity="0.7" />
                      <stop offset="60%" stopColor={step === 0 ? SAGE : step === 1 ? TEAL : '#7B9BB5'} stopOpacity="0.3" />
                      <stop offset="100%" stopColor={step === 0 ? SAGE : step === 1 ? TEAL : '#7B9BB5'} stopOpacity="0.08" />
                    </radialGradient>
                  </defs>
                  {/* Outermost ring */}
                  <circle cx="80" cy="80" r="74" fill="none" stroke={TEAL} strokeWidth="1" strokeOpacity="0.15" />
                  <circle cx="80" cy="80" r="66" fill="none" stroke={TEAL} strokeWidth="1.5" strokeOpacity="0.2" />
                  {/* Iris */}
                  <circle cx="80" cy="80" r="58" fill={`url(#ob-iris-${step})`} />
                  <circle cx="80" cy="80" r="58" fill="none" stroke={step === 0 ? SAGE : TEAL} strokeWidth="2.5" strokeOpacity="0.5" />
                  {/* Inner iris detail */}
                  <circle cx="80" cy="80" r="46" fill="none" stroke={step === 0 ? SAGE : TEAL} strokeWidth="1.5" strokeOpacity="0.25" />
                  <circle cx="80" cy="80" r="34" fill="none" stroke={TEAL} strokeWidth="1" strokeOpacity="0.2" />
                  {/* Pupil */}
                  <circle cx="80" cy="80" r="22" fill="#1C2E3E" fillOpacity="0.75" />
                  <circle cx="80" cy="80" r="14" fill="#1C2E3E" fillOpacity="0.9" />
                  {/* Highlight */}
                  <circle cx="88" cy="72" r="5" fill="white" fillOpacity="0.5" />
                  <circle cx="73" cy="76" r="2.5" fill="white" fillOpacity="0.25" />
                </svg>
              </div>

              <h2 className="mb-4" style={{ color: '#1C2E3E', lineHeight: 1.35 }}>
                {introSlides[step].heading}
              </h2>
              <p style={{ color: '#5A7080', lineHeight: 1.65 }}>
                {introSlides[step].body}
              </p>
            </motion.div>
          )}

          {/* Goal selection — step 3 */}
          {step === 3 && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="absolute inset-0 flex flex-col px-6 pt-8 overflow-y-auto"
            >
              <p className="mb-1" style={{ color: TEAL, fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Your goals
              </p>
              <h2 className="mb-2" style={{ color: '#1C2E3E' }}>
                What would you like support with?
              </h2>
              <p className="mb-8" style={{ color: '#5A7080', fontSize: '0.9rem' }}>
                Choose one or more — Luma adapts to what matters to you.
              </p>

              <div className="space-y-3">
                {goalOptions.map(opt => {
                  const selected = goals.includes(opt.id);
                  return (
                    <motion.button
                      key={opt.id}
                      onClick={() => toggleGoal(opt.id)}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-between px-5 py-4 rounded-2xl text-left transition-all"
                      style={{
                        background: selected ? `${TEAL}12` : '#FFFFFF',
                        border: `1.5px solid ${selected ? TEAL : 'rgba(28,46,62,0.1)'}`,
                        boxShadow: selected ? `0 0 0 1px ${TEAL}30` : '0 2px 8px rgba(28,46,62,0.05)',
                      }}
                    >
                      <div>
                        <div style={{ color: '#1C2E3E', fontWeight: 500 }}>{opt.label}</div>
                        <div style={{ color: '#8B9EB0', fontSize: '0.82rem', marginTop: 2 }}>{opt.desc}</div>
                      </div>
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ml-3 transition-all"
                        style={{
                          background: selected ? TEAL : 'rgba(28,46,62,0.07)',
                        }}
                      >
                        {selected && <Check className="w-3.5 h-3.5" style={{ color: 'white' }} />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Privacy — step 4 */}
          {step === 4 && (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="absolute inset-0 flex flex-col px-6 pt-8 overflow-y-auto"
            >
              <p className="mb-1" style={{ color: TEAL, fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Before you begin
              </p>
              <h2 className="mb-2" style={{ color: '#1C2E3E' }}>A few things to know</h2>
              <p className="mb-8" style={{ color: '#5A7080', fontSize: '0.9rem' }}>
                Luma is built around trust, transparency, and your comfort.
              </p>

              <div className="space-y-3">
                {privacyPoints.map((point, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-4 px-5 py-4 rounded-2xl"
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid rgba(28,46,62,0.08)',
                      boxShadow: '0 2px 8px rgba(28,46,62,0.05)',
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `${TEAL}15` }}
                    >
                      <Check className="w-3.5 h-3.5" style={{ color: TEAL }} />
                    </div>
                    <p style={{ color: '#5A7080', fontSize: '0.9rem', lineHeight: 1.6 }}>{point}</p>
                  </motion.div>
                ))}
              </div>

              <div
                className="mt-6 px-5 py-4 rounded-2xl"
                style={{ background: `${TEAL}10`, border: `1px solid ${TEAL}25` }}
              >
                <p style={{ color: '#5A7080', fontSize: '0.8rem', lineHeight: 1.6 }}>
                  Luma is a wellness companion, not a diagnostic tool. It does not replace professional eye care.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div className="px-6 pb-10 pt-4">
        <motion.button
          onClick={handleNext}
          disabled={!canContinue}
          whileTap={{ scale: 0.97 }}
          className="w-full px-6 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all"
          style={{
            background: canContinue ? `linear-gradient(135deg, ${TEAL}, #3A7A8E)` : 'rgba(28,46,62,0.1)',
            color: canContinue ? 'white' : '#8B9EB0',
            boxShadow: canContinue ? `0 8px 24px ${TEAL}35` : 'none',
          }}
        >
          <span>{isLastStep ? 'Begin with Luma' : 'Continue'}</span>
          <ChevronRight className="w-5 h-5" />
        </motion.button>

        {step > 0 && (
          <button
            onClick={() => setStep(s => s - 1)}
            className="w-full mt-3 py-2 text-center transition-all"
            style={{ color: '#8B9EB0', fontSize: '0.875rem' }}
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
}