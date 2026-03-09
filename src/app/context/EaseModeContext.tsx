import React, { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface EaseModeData {
  isEnabled: boolean;
  intensity: number;
  warmth: number;
  toggleEase: () => void;
  setIntensity: (val: number) => void;
  setWarmth: (val: number) => void;
}

const EaseModeContext = createContext<EaseModeData | undefined>(undefined);

export function EaseModeProvider({ children }: { children: React.ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [intensity, setIntensity] = useState(40);
  const [warmth, setWarmth] = useState(50);

  const toggleEase = () => setIsEnabled((v) => !v);

  return (
    <EaseModeContext.Provider value={{ isEnabled, intensity, warmth, toggleEase, setIntensity, setWarmth }}>
      {children}
      <EaseModeOverlay />
    </EaseModeContext.Provider>
  );
}

export function useEase() {
  const context = useContext(EaseModeContext);
  if (!context) throw new Error("useEase must be used within EaseModeProvider");
  return context;
}

function EaseModeOverlay() {
  const { isEnabled, intensity, warmth } = useEase();

  return (
    <AnimatePresence>
      {isEnabled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: intensity / 100 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 pointer-events-none z-[9999] mix-blend-multiply"
          style={{
            backgroundColor: `rgba(255, ${Math.round(255 - (warmth * 0.85))}, ${Math.round(255 - (warmth * 2.2))}, 1)`,
            filter: `contrast(${100 - (intensity / 10)}%) brightness(${100 - (intensity / 10)}%)`,
          }}
        />
      )}
    </AnimatePresence>
  );
}