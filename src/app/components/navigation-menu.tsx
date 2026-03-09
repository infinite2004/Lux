import { useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { Home, BarChart2, Eye } from 'lucide-react';

const ACCENT = '#2619D0';

const NAV_ITEMS = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/activity', icon: BarChart2, label: 'Activity' },
  { path: '/lighting', icon: Eye, label: 'Lighting' },
];

const HIDDEN_PATHS = ['/recovery'];

export function NavigationMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  if (HIDDEN_PATHS.includes(location.pathname)) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* Gradient fade above nav */}
      <div
        className="h-8 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(245,242,236,0.95), transparent)' }}
      />
      <div
        className="mx-3 mb-4 px-3 py-2 rounded-3xl"
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(28,46,62,0.09)',
          boxShadow: '0 8px 32px rgba(28,46,62,0.10), 0 2px 8px rgba(28,46,62,0.07)',
        }}
      >
        <div className="flex justify-around items-center">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path ||
              (item.path === '/home' && location.pathname === '/');

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="relative flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all"
                style={{ minWidth: 52 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavBg"
                    className="absolute inset-0 rounded-2xl"
                    style={{ background: `${ACCENT}12` }}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <Icon
                  className="w-5 h-5 relative z-10 transition-all"
                  style={{ color: isActive ? ACCENT : '#8B9EB0' }}
                />
                <span
                  className="relative z-10 transition-all"
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? ACCENT : '#8B9EB0',
                    letterSpacing: '0.01em',
                  }}
                >
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeNavDot"
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: ACCENT }}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}