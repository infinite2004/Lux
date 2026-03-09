import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, RefreshCw, Scan } from 'lucide-react';

interface Zone {
  id: string;
  x: number;
  y: number;
  label: string;
  type: 'glare' | 'balanced' | 'contrast' | 'quiet';
}

const ZONES: Zone[] = [
  { id: '1', x: 72, y: 22, label: 'Glare-heavy', type: 'glare' },
  { id: '2', x: 28, y: 38, label: 'Bright but balanced', type: 'balanced' },
  { id: '3', x: 58, y: 52, label: 'High contrast', type: 'contrast' },
  { id: '4', x: 18, y: 65, label: 'Visually quiet', type: 'quiet' },
];

const ZONE_STYLE = {
  glare:    { color: '#B8724A', bg: '#B8724A18', border: '#B8724A40' },
  balanced: { color: '#1edd00', bg: '#1edd0018', border: '#1edd0040' },
  contrast: { color: '#A8854A', bg: '#A8854A18', border: '#A8854A40' },
  quiet:    { color: '#4A8FA5', bg: '#4A8FA518', border: '#4A8FA540' },
};

const RECOMMENDATIONS = [
  {
    type: 'glare' as const,
    title: 'Reflected light detected',
    message: 'Moving one position away from the window may reduce glare on your screen significantly.',
  },
  {
    type: 'contrast' as const,
    title: 'Contrast variation',
    message: 'Lowering your screen angle slightly may ease strain from overhead lighting.',
  },
  {
    type: 'quiet' as const,
    title: 'Comfortable viewing area',
    message: 'The left side of your space offers a softer, more visually stable viewing angle.',
  },
];

export function EnvironmentScan() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setDone(false);
    setTimeout(() => {
      setScanning(false);
      setDone(true);
    }, 2800);
  };

  const overallLabel = done ? 'Glare-heavy in places' : 'Not yet scanned';

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
            Around you
          </p>
          <h1 style={{ color: '#1C2E3E', marginTop: 1, lineHeight: 1.2 }}>Your Environment</h1>
        </div>
      </div>

      <div className="px-6 space-y-5">
        {/* Status pill */}
        <div
          className="flex items-center justify-between px-5 py-3.5 rounded-2xl"
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(28,46,62,0.08)',
            boxShadow: '0 2px 10px rgba(28,46,62,0.05)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: done ? '#B8724A' : '#8B9EB0' }}
            />
            <span style={{ color: '#1C2E3E', fontWeight: 500, fontSize: '0.875rem' }}>
              {overallLabel}
            </span>
          </div>
          {done && (
            <span style={{ color: '#8B9EB0', fontSize: '0.75rem' }}>Just now</span>
          )}
        </div>

        {/* Camera / scan area */}
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            aspectRatio: '3/4',
            background: 'linear-gradient(145deg, #D8E8F0 0%, #C8D8E8 40%, #D0DDE8 100%)',
            border: '1px solid rgba(28,46,62,0.1)',
            boxShadow: '0 4px 20px rgba(28,46,62,0.08)',
          }}
        >
          {/* Atmospheric room suggestion */}
          <div className="absolute inset-0 opacity-30"
            style={{
              background: 'radial-gradient(ellipse at 70% 20%, rgba(255,240,200,0.8) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(200,220,240,0.6) 0%, transparent 50%)',
            }}
          />

          {/* Floor/ceiling lines */}
          <div className="absolute inset-x-0" style={{ top: '65%', height: '1px', background: 'rgba(28,46,62,0.1)' }} />
          <div className="absolute" style={{ left: '15%', top: 0, bottom: '35%', width: '1px', background: 'rgba(28,46,62,0.07)' }} />
          <div className="absolute" style={{ right: '20%', top: 0, bottom: '35%', width: '1px', background: 'rgba(28,46,62,0.07)' }} />

          {/* Window light suggestion */}
          <div
            className="absolute"
            style={{
              top: '8%', right: '18%',
              width: '22%', height: '28%',
              background: 'rgba(255,240,180,0.55)',
              borderRadius: '4px',
              boxShadow: '0 0 30px rgba(255,230,120,0.4)',
            }}
          />

          {/* Scan line */}
          <AnimatePresence>
            {scanning && (
              <motion.div
                initial={{ y: '-5%' }}
                animate={{ y: '105%' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.6, ease: 'linear' }}
                className="absolute inset-x-0"
                style={{
                  height: '3px',
                  background: 'linear-gradient(90deg, transparent, #4A8FA5, #1edd00, #4A8FA5, transparent)',
                  boxShadow: '0 0 16px rgba(74, 143, 165, 0.8)',
                }}
              />
            )}
          </AnimatePresence>

          {/* Zone overlays */}
          <AnimatePresence>
            {done && ZONES.map((zone, i) => {
              const zs = ZONE_STYLE[zone.type];
              return (
                <motion.div
                  key={zone.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.15, type: 'spring', stiffness: 200 }}
                  className="absolute"
                  style={{
                    left: `${zone.x}%`,
                    top: `${zone.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div
                    className="rounded-xl px-3 py-1.5"
                    style={{
                      background: zs.bg,
                      border: `1.5px solid ${zs.border}`,
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: zs.color }} />
                      <span style={{ color: zs.color, fontSize: '0.72rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {zone.label}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Corner scan guides */}
          {!done && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-36 h-36">
                {['top-0 left-0 border-t-2 border-l-2', 'top-0 right-0 border-t-2 border-r-2',
                  'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2'].map((cls, i) => (
                  <div key={i} className={`absolute w-5 h-5 ${cls} border-[#4A8FA5]`} style={{ borderRadius: '2px' }} />
                ))}
                {scanning && (
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 rounded-lg"
                    style={{ border: '1.5px solid #4A8FA5' }}
                  />
                )}
              </div>
            </div>
          )}

          {/* Scanning label */}
          {scanning && (
            <div
              className="absolute bottom-4 left-0 right-0 flex justify-center"
            >
              <div
                className="px-4 py-2 rounded-full"
                style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}
              >
                <span style={{ color: '#4A8FA5', fontSize: '0.82rem', fontWeight: 600 }}>
                  Reading your environment…
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Scan / Rescan button */}
        <button
          onClick={handleScan}
          disabled={scanning}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl transition-all"
          style={{
            background: scanning
              ? 'rgba(28,46,62,0.07)'
              : 'linear-gradient(135deg, #4A8FA5, #3A7A8E)',
            color: scanning ? '#8B9EB0' : 'white',
            boxShadow: scanning ? 'none' : '0 8px 24px rgba(74,143,165,0.3)',
          }}
        >
          {done ? (
            <><RefreshCw className="w-5 h-5" /><span>Scan Again</span></>
          ) : (
            <><Scan className="w-5 h-5" /><span>{scanning ? 'Reading…' : 'Scan Your Space'}</span></>
          )}
        </button>

        {/* Recommendations */}
        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <p style={{ color: '#5A7080', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.04em' }}>
                What Luma noticed
              </p>

              {RECOMMENDATIONS.map((r, i) => {
                const zs = ZONE_STYLE[r.type];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4 px-5 py-4 rounded-2xl"
                    style={{
                      background: '#FFFFFF',
                      border: `1px solid ${zs.border}`,
                      boxShadow: '0 2px 10px rgba(28,46,62,0.05)',
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: zs.bg }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: zs.color }} />
                    </div>
                    <div>
                      <p style={{ color: '#1C2E3E', fontWeight: 500, fontSize: '0.875rem', marginBottom: 4 }}>
                        {r.title}
                      </p>
                      <p style={{ color: '#5A7080', fontSize: '0.82rem', lineHeight: 1.65 }}>
                        {r.message}
                      </p>
                    </div>
                  </motion.div>
                );
              })}

              {/* Legend */}
              <div
                className="px-5 py-4 rounded-2xl"
                style={{ background: '#FFFFFF', border: '1px solid rgba(28,46,62,0.07)' }}
              >
                <p style={{ color: '#8B9EB0', fontSize: '0.72rem', fontWeight: 600, marginBottom: 10 }}>
                  Zone guide
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.entries(ZONE_STYLE).map(([key, val]) => (
                    <div key={key} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: val.color }} />
                      <span style={{ color: '#5A7080', fontSize: '0.78rem', textTransform: 'capitalize' }}>{key}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
