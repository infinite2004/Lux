import { motion } from "motion/react";
import { useHealth } from "../context/HealthContext";

export function IrisGraphic() {
  const { state, load } = useHealth();

  const getAnimationProps = () => {
    switch (state) {
      case "Comfortable":
        return {
          scale: [1, 1.05, 1],
          rotate: [0, 5, 0],
          transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const },
        };
      case "Building Strain":
        return {
          scale: [1, 1.08, 1],
          rotate: [0, 10, 0],
          transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const },
        };
      case "Sensitive":
        return {
          scale: [1, 1.15, 1],
          rotate: [0, 15, -15, 0],
          transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const },
        };
      case "Recovering":
        return {
          scale: [1, 1.03, 1],
          rotate: [0, 2, 0],
          transition: { duration: 6, repeat: Infinity, ease: "easeInOut" as const },
        };
      default:
        return {};
    }
  };

  // Colors coordinated with the Home page Figma iris
  const getColors = () => {
    switch (state) {
      case "Comfortable":
        return { outer: "#FFAA01", inner1: "#2619D0", inner2: "#5E9B85", pulse: "rgba(255, 170, 1, 0.2)" };
      case "Building Strain":
        return { outer: "#FFAA01", inner1: "#A8854A", inner2: "#2619D0", pulse: "rgba(168, 133, 74, 0.2)" };
      case "Sensitive":
        return { outer: "#FFAA01", inner1: "#E81A01", inner2: "#2619D0", pulse: "rgba(232, 26, 1, 0.3)" };
      case "Recovering":
        return { outer: "#FFAA01", inner1: "#4A8FA5", inner2: "#2619D0", pulse: "rgba(74, 143, 165, 0.2)" };
    }
  };

  const colors = getColors();

  return (
    <div className="relative size-64 flex items-center justify-center">
      {/* Dynamic Pulse Ring */}
      <motion.div
        animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: state === 'Sensitive' ? 1.5 : 3, repeat: Infinity }}
        className="absolute inset-0 rounded-full blur-xl"
        style={{ backgroundColor: colors.outer }}
      />

      {/* Outer Dashed Orbit */}
      <motion.div
        animate={getAnimationProps()}
        className="absolute inset-0 rounded-full border-2 border-dashed opacity-30"
        style={{ borderColor: colors.outer }}
      />

      {/* Main Iris Body */}
      <motion.div
        animate={getAnimationProps()}
        className="relative size-52 rounded-full flex items-center justify-center shadow-2xl overflow-hidden"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${colors.inner1} 0%, ${colors.outer} 60%, ${colors.inner2} 100%)`,
        }}
      >
        {/* Inner Iris Pattern */}
        <div className="absolute inset-4 rounded-full overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: state === 'Sensitive' ? 10 : 30, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {[...Array(24)].map((_, i) => (
              <div
                key={i}
                className="absolute h-full w-1 opacity-20"
                style={{
                  transform: `rotate(${i * 15}deg)`,
                  background: `linear-gradient(to bottom, transparent, #fff, transparent)`,
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Pupil */}
        <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute size-32 bg-[#1C2E3E] rounded-full shadow-inner flex items-center justify-center"
        >
             {/* Score Display */}
            <div className="z-10 text-white flex flex-col items-center">
                <span className="text-5xl tracking-tighter" style={{ fontWeight: 900 }}>{load}</span>
                <span className="text-[10px] uppercase tracking-[0.3em] opacity-40" style={{ fontWeight: 900 }}>Load</span>
            </div>
        </motion.div>
      </motion.div>

      {/* Sensitive State Floaters */}
      {state === "Sensitive" && (
        <>
          <motion.div
            animate={{ 
                x: [0, 50, -30, 0], 
                y: [0, -30, 40, 0],
                opacity: [0, 0.8, 0] 
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute size-4 bg-[#E81A01] rounded-full blur-md z-20"
          />
           <motion.div
            animate={{ 
                x: [0, -40, 20, 0], 
                y: [0, 50, -30, 0],
                opacity: [0, 0.6, 0] 
            }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className="absolute size-3 bg-[#FFAA01] rounded-full blur-md z-20"
          />
        </>
      )}
    </div>
  );
}
