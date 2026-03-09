import { useState } from 'react';
import { motion } from 'motion/react';
import { Pause, Lock, Trash2, Shield, Info, ChevronRight, SlidersHorizontal } from 'lucide-react';

const TEAL = '#4A8FA5';
const GOLD = '#A8854A';

export function Privacy() {
  const [sensingPaused, setSensingPaused] = useState(false);
  const [privateMode, setPrivateMode] = useState(false);
  const [sensitivity, setSensitivity] = useState(50);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  return (
    <div
      className="min-h-screen max-w-md mx-auto pb-28"
      style={{ background: 'linear-gradient(180deg, #F8F5EF 0%, #EDF4F7 100%)' }}
    >
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <p style={{ color: '#8B9EB0', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Your preferences
        </p>
        <h1 style={{ color: '#1C2E3E', marginTop: 2 }}>Settings & Privacy</h1>
      </div>

      <div className="px-6 space-y-5">
        {/* Quick controls */}
        <div
          className="rounded-3xl px-5 py-5 space-y-3"
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(28,46,62,0.08)',
            boxShadow: '0 2px 12px rgba(28,46,62,0.05)',
          }}
        >
          <p style={{ color: '#1C2E3E', fontWeight: 600, marginBottom: 4 }}>Quick controls</p>

          {/* Pause Sensing */}
          <button
            onClick={() => setSensingPaused(!sensingPaused)}
            className="w-full flex items-center justify-between py-3.5 px-4 rounded-2xl transition-all"
            style={{
              background: sensingPaused ? `${GOLD}10` : 'rgba(28,46,62,0.03)',
              border: `1px solid ${sensingPaused ? GOLD + '30' : 'rgba(28,46,62,0.07)'}`,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: sensingPaused ? `${GOLD}18` : 'rgba(28,46,62,0.07)' }}
              >
                <Pause className="w-5 h-5" style={{ color: sensingPaused ? GOLD : '#8B9EB0' }} />
              </div>
              <div className="text-left">
                <div style={{ color: '#1C2E3E', fontWeight: 500, fontSize: '0.875rem' }}>Pause sensing</div>
                <div style={{ color: '#8B9EB0', fontSize: '0.72rem' }}>
                  {sensingPaused ? 'Sensing paused — no data collected' : 'Luma is gently monitoring'}
                </div>
              </div>
            </div>
            <Toggle active={sensingPaused} color={GOLD} />
          </button>

          {/* Private Mode */}
          <button
            onClick={() => setPrivateMode(!privateMode)}
            className="w-full flex items-center justify-between py-3.5 px-4 rounded-2xl transition-all"
            style={{
              background: privateMode ? `${TEAL}10` : 'rgba(28,46,62,0.03)',
              border: `1px solid ${privateMode ? TEAL + '30' : 'rgba(28,46,62,0.07)'}`,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: privateMode ? `${TEAL}18` : 'rgba(28,46,62,0.07)' }}
              >
                <Lock className="w-5 h-5" style={{ color: privateMode ? TEAL : '#8B9EB0' }} />
              </div>
              <div className="text-left">
                <div style={{ color: '#1C2E3E', fontWeight: 500, fontSize: '0.875rem' }}>Private mode</div>
                <div style={{ color: '#8B9EB0', fontSize: '0.72rem' }}>
                  {privateMode ? 'No usage data stored' : 'Standard privacy settings'}
                </div>
              </div>
            </div>
            <Toggle active={privateMode} color={TEAL} />
          </button>
        </div>

        {/* Sensitivity */}
        <div
          className="rounded-3xl px-5 py-5"
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(28,46,62,0.08)',
            boxShadow: '0 2px 12px rgba(28,46,62,0.05)',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <SlidersHorizontal className="w-5 h-5" style={{ color: TEAL }} />
            <p style={{ color: '#1C2E3E', fontWeight: 600 }}>Adjust sensitivity</p>
          </div>
          <p style={{ color: '#8B9EB0', fontSize: '0.82rem', marginBottom: 16, lineHeight: 1.6 }}>
            Controls how quickly Luma notices changes in your visual load.
          </p>
          <div className="flex items-center justify-between mb-2.5">
            <span style={{ color: '#5A7080', fontSize: '0.875rem' }}>Comfort threshold</span>
            <span style={{ color: TEAL, fontSize: '0.82rem', fontWeight: 600 }}>{sensitivity}%</span>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            value={sensitivity}
            onChange={e => setSensitivity(Number(e.target.value))}
            className="w-full rounded-full"
            style={{
              height: '5px',
              background: `linear-gradient(to right, ${TEAL} 0%, ${TEAL} ${sensitivity}%, rgba(28,46,62,0.12) ${sensitivity}%, rgba(28,46,62,0.12) 100%)`,
              borderRadius: '99px',
            }}
          />
          <div className="flex justify-between mt-2">
            <span style={{ color: '#8B9EB0', fontSize: '0.72rem' }}>More relaxed</span>
            <span style={{ color: '#8B9EB0', fontSize: '0.72rem' }}>More responsive</span>
          </div>
        </div>

        {/* Data */}
        <div
          className="rounded-3xl px-5 py-5"
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(28,46,62,0.08)',
            boxShadow: '0 2px 12px rgba(28,46,62,0.05)',
          }}
        >
          <p style={{ color: '#1C2E3E', fontWeight: 600, marginBottom: 4 }}>Your data</p>

          {!deleteConfirm ? (
            <button
              onClick={() => setDeleteConfirm(true)}
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl mt-3 transition-all"
              style={{
                background: 'rgba(184,114,74,0.07)',
                border: '1px solid rgba(184,114,74,0.2)',
              }}
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5" style={{ color: '#B8724A' }} />
                <div className="text-left">
                  <div style={{ color: '#1C2E3E', fontSize: '0.875rem', fontWeight: 500 }}>Delete today's data</div>
                  <div style={{ color: '#8B9EB0', fontSize: '0.72rem' }}>Removes all of today's observations</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4" style={{ color: '#8B9EB0' }} />
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-4 py-4 rounded-2xl mt-3"
              style={{ background: 'rgba(184,114,74,0.08)', border: '1px solid rgba(184,114,74,0.25)' }}
            >
              <p style={{ color: '#5A7080', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: 12 }}>
                Are you sure? Today's visual load data will be permanently removed.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl"
                  style={{ background: 'rgba(28,46,62,0.08)', color: '#5A7080', fontSize: '0.82rem' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl"
                  style={{ background: '#B8724A', color: 'white', fontSize: '0.82rem' }}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Privacy info */}
        <div className="space-y-3">
          <p style={{ color: '#5A7080', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.04em' }}>
            Privacy & transparency
          </p>

          {[
            {
              icon: Shield,
              color: TEAL,
              text: 'All sensing happens locally on your device. Your data stays private by default.',
            },
            {
              icon: Info,
              color: '#7B9BB5',
              text: 'Luma supports awareness and comfort, not diagnosis. Please consult an eye-care professional for any vision concerns.',
            },
            {
              icon: Lock,
              color: '#1edd00',
              text: 'Your data is never shared with schools, employers, or third parties. You have full control.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 px-5 py-4 rounded-2xl"
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(28,46,62,0.07)',
                boxShadow: '0 2px 8px rgba(28,46,62,0.04)',
              }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: `${item.color}15` }}
              >
                <item.icon className="w-4 h-4" style={{ color: item.color }} />
              </div>
              <p style={{ color: '#5A7080', fontSize: '0.82rem', lineHeight: 1.65 }}>{item.text}</p>
            </div>
          ))}
        </div>

        {/* Footer links */}
        <div className="pt-2 space-y-1">
          {['Privacy Policy', 'How Luma Works', 'Export My Data'].map(label => (
            <button
              key={label}
              className="w-full py-2.5 text-center flex items-center justify-center gap-2 transition-all"
              style={{ color: '#8B9EB0', fontSize: '0.82rem' }}
            >
              <span>{label}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>

        <div className="text-center pb-2" style={{ color: '#C0CDD8', fontSize: '0.72rem' }}>
          Luma v2.0
        </div>
      </div>
    </div>
  );
}

function Toggle({ active, color }: { active: boolean; color: string }) {
  return (
    <div
      className="relative flex-shrink-0 transition-all"
      style={{
        width: 44, height: 24, borderRadius: 99,
        background: active ? color : 'rgba(28,46,62,0.14)',
      }}
    >
      <motion.div
        animate={{ x: active ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="absolute top-1"
        style={{ width: 20, height: 20, borderRadius: 99, background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
      />
    </div>
  );
}