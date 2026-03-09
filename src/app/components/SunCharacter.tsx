import React from "react";
import { motion, AnimatePresence } from "motion/react";
import type { HealthState } from "../context/HealthContext";

import angrySvg from "../../imports/svg-czkpbtah7m";
import neutralSvg from "../../imports/svg-8wi54ffukr";
import happySvg from "../../imports/svg-bkajjwa10x";

interface SunCharacterProps {
  state: HealthState;
  size?: number;
}

export function SunCharacter({ state, size = 280 }: SunCharacterProps) {
  const pulseDuration = state === "High" ? 2.5 : state === "Moderate" ? 4 : 6;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Ambient glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 1.25,
          height: size * 1.25,
          background:
            state === "High"
              ? "radial-gradient(circle, rgba(255,170,1,0.18) 0%, rgba(255,170,1,0) 70%)"
              : state === "Moderate"
              ? "radial-gradient(circle, rgba(255,170,1,0.12) 0%, rgba(255,170,1,0) 70%)"
              : "radial-gradient(circle, rgba(255,170,1,0.08) 0%, rgba(255,170,1,0) 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: pulseDuration, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Sun body */}
      <motion.div
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: pulseDuration, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: size, height: size }}
      >
        {/*
          Triple-ring body uses angrySvg's three circle paths (370×370 viewBox).
          Each state's face is a nested <svg> centered at (185, 185) — the midpoint
          of the 370×370 space — so all expressions stay aligned over the same body.
        */}
        <svg width={size} height={size} viewBox="0 0 370 370" fill="none" style={{ overflow: "visible" }}>

          {/* ── Triple-ring body — always visible ── */}
          <path d={angrySvg.p2e7e0b00} stroke="#FFAA01" strokeWidth="28" />
          <path d={angrySvg.p3065b800} stroke="#FFD88A" strokeWidth="28" />
          <path d={angrySvg.p67db00}   fill="#FFF7E6"  stroke="#FFEABF" strokeWidth="28" />

          {/* ── Face expression — only these paths swap ── */}
          <AnimatePresence mode="wait">

            {(state === "Low" || state === "Resting") && (
              <motion.g
                key="happy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {/* Happy face lives in a 206×206 space; center it at (185,185) */}
                <svg x={82} y={82} width={206} height={206} viewBox="0 0 206 206">
                  <g transform="translate(29.96, 39.33)">
                    <path d={happySvg.p2e179af0} fill="black" />
                    <path d={happySvg.p327d86f2} fill="black" />
                    <path d={happySvg.pbc30d00}   fill="black" />
                  </g>
                </svg>
              </motion.g>
            )}

            {state === "Moderate" && (
              <motion.g
                key="neutral"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {/* Neutral face lives in a 291×291 space; center it at (185,185) */}
                <svg x={39.5} y={39.5} width={291} height={291} viewBox="0 0 291 291">
                  <path d={neutralSvg.p2fc1700}  fill="black" />
                  <path d={neutralSvg.p2fcf9800} fill="black" />
                  <path d={neutralSvg.p3c38800}  fill="black" />
                </svg>
              </motion.g>
            )}

            {state === "High" && (
              <motion.g
                key="angry"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {/* Angry face is natively in 370×370 — no transform needed */}
                <path d={angrySvg.p24815c00} fill="black" />
                <path d={angrySvg.p1efa8c80} fill="black" />
                <path d={angrySvg.p3cc5f300} fill="black" />
              </motion.g>
            )}

          </AnimatePresence>
        </svg>
      </motion.div>
    </div>
  );
}
