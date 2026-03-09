import React, { createContext, useContext, useState, useEffect } from "react";

export type HealthState = "Low" | "Moderate" | "High" | "Resting";

interface HealthData {
  load: number;
  state: HealthState;
  luxHours: number;
  currentLux: number;
  environment: string;
  timeSinceRest: string;
  setLoad: (val: number) => void;
  setRecovering: (val: boolean) => void;
  setEnvironment: (val: string) => void;
}

const HealthContext = createContext<HealthData | undefined>(undefined);

export function HealthProvider({ children }: { children: React.ReactNode }) {
  const [load, setLoad] = useState(10);
  const [luxHours, setLuxHours] = useState(1240);
  const [environment, setEnvironment] = useState("Office — standard lighting");
  const [isRecovering, setIsRecovering] = useState(false);
  const [currentLux, setCurrentLux] = useState(10);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Cycle lux through a full range: dim → office → bright → dim (~40s full cycle)
    // Uses a sine wave biased upward so it naturally passes through all states
    const period = 20; // seconds per full cycle (10s up, 10s down)
    const phase = (tick % period) / period; // 0 → 1
    const sine = -Math.cos(phase * 2 * Math.PI); // starts at -1 (low), peaks at 1 (high), returns to -1
    // Map sine to 10–1500 lux
    const baseLux = 10 + ((sine + 1) / 2) * 1490;
    // Add small noise
    const noise = (Math.random() - 0.5) * 60;
    const newLux = Math.max(10, Math.round(baseLux + noise));

    setCurrentLux(newLux);

    if (newLux > 1500) setEnvironment("Bright outdoor — direct sunlight");
    else if (newLux > 800) setEnvironment("Well-lit indoors — near window");
    else if (newLux > 300) setEnvironment("Office — standard lighting");
    else if (newLux > 50) setEnvironment("Living room — warm ambient");
    else setEnvironment("Dim environment — restful");

    setLuxHours((prev) => prev + (newLux / 3600) * 5);

    if (!isRecovering) {
      // Directly map currentLux (10–1500) to load (0–100) for immediate UI response
      setLoad(Math.min(100, Math.max(0, Math.round((newLux / 1500) * 100))));
    } else {
      setLoad((prev) => Math.max(0, prev - 1.5));
    }
  }, [tick, isRecovering]);

  const state: HealthState = isRecovering
    ? "Resting"
    : load < 40
    ? "Low"
    : load < 70
    ? "Moderate"
    : "High";

  const timeSinceRest = isRecovering ? "0m" : "1h 40m";

  return (
    <HealthContext.Provider
      value={{
        load: Math.round(load),
        state,
        luxHours: Math.round(luxHours),
        currentLux: Math.round(currentLux),
        environment,
        timeSinceRest,
        setLoad,
        setRecovering: setIsRecovering,
        setEnvironment,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
}

export function useHealth() {
  const context = useContext(HealthContext);
  if (!context) throw new Error("useHealth must be used within HealthProvider");
  return context;
}