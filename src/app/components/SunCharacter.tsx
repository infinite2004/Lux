import React from "react";
import { motion } from "motion/react";
import type { HealthState } from "../context/HealthContext";

// Angry sun SVG paths (High state) — viewBox 0 0 370 370
import angrySvg from "../../imports/svg-czkpbtah7m";
// Neutral sun SVG paths (Moderate state) — viewBox 0 0 291 291
import neutralSvg from "../../imports/svg-8wi54ffukr";
// Happy sun SVG paths (Low/Resting state) — viewBox 0 0 206 206
import happySvg from "../../imports/svg-bkajjwa10x";

interface SunCharacterProps {
  state: HealthState;
  size?: number;
}

export function SunCharacter({ state, size = 280 }: SunCharacterProps) {
  const pulseDuration =
    state === "High" ? 2.5 : state === "Moderate" ? 4 : 6;

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
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: pulseDuration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Sun body with gentle pulse */}
      <motion.div
        animate={{
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: pulseDuration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ width: size, height: size }}
      >
        {state === "High" && <AngrySun size={size} />}
        {state === "Moderate" && <NeutralSun size={size} />}
        {(state === "Low" || state === "Resting") && <HappySun size={size} />}
      </motion.div>
    </div>
  );
}

function AngrySun({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 370 370"
      fill="none"
      style={{ overflow: "visible" }}
    >
      {/* Outer ring */}
      <path d={angrySvg.p2e7e0b00} stroke="#FFAA01" strokeWidth="28" />
      {/* Middle ring */}
      <path d={angrySvg.p3065b800} stroke="#FFD88A" strokeWidth="28" />
      {/* Inner circle */}
      <path d={angrySvg.p67db00} fill="#FFF7E6" stroke="#FFEABF" strokeWidth="28" />
      {/* Left eye X */}
      <path d={angrySvg.p24815c00} fill="black" />
      {/* Right eye X */}
      <path d={angrySvg.p1efa8c80} fill="black" />
      {/* Wavy mouth */}
      <path d={angrySvg.p3cc5f300} fill="black" />
    </svg>
  );
}

function NeutralSun({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 291 291"
      fill="none"
      style={{ overflow: "visible" }}
    >
      {/* Outer ring */}
      <path d={neutralSvg.p327cbc80} stroke="#FFD88A" strokeWidth="28" />
      {/* Inner circle */}
      <path d={neutralSvg.p23ac6680} fill="#FFF7E6" stroke="#FFEABF" strokeWidth="28" />
      {/* Left eye dot */}
      <path d={neutralSvg.p2fc1700} fill="black" />
      {/* Right eye dot */}
      <path d={neutralSvg.p2fcf9800} fill="black" />
      {/* Straight mouth */}
      <path d={neutralSvg.p3c38800} fill="black" />
    </svg>
  );
}

function HappySun({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 206 206"
      fill="none"
      style={{ overflow: "visible" }}
    >
      {/* Amber ring + light-gray circle — matches Figma Group 4 */}
      <circle cx="103" cy="103" r="89" fill="#F5F4F4" stroke="#FFEABF" strokeWidth="28" />

      {/* Square face region (matches the 144.2×144.2 rect in Figma) — clips to circle */}
      <clipPath id="happyFaceClip">
        <circle cx="103" cy="103" r="89" />
      </clipPath>
      <rect
        x="29.96"
        y="39.33"
        width="144.2"
        height="144.2"
        fill="#F5F4F4"
        clipPath="url(#happyFaceClip)"
      />

      {/* Face paths — translated to match Figma's left-[29.96] top-[39.33] offset */}
      <g transform="translate(29.96, 39.33)">
        <path d={happySvg.p2e179af0} fill="black" />
        <path d={happySvg.p327d86f2} fill="black" />
        <path d={happySvg.pbc30d00} fill="black" />
      </g>
    </svg>
  );
}