import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useHealth } from "../context/HealthContext";
import { useSheet } from "../context/SheetContext";
import { SunCharacter } from "../components/SunCharacter";
import svgPaths from "../../imports/svg-fg0yok610r";

// ── per-state config ────────────────────────────────────────────────────────
const STATE_CONFIG = {
  Low: {
    barColor: "#5eb53e",
    badgeBg: "rgba(94,181,62,0.12)",
    badgeText: "#5eb53e",
    label: "Low Light",
    message: "Eyes at ease — great conditions",
    luxLabel: "Dim / Indoor",
  },
  Moderate: {
    barColor: "#FFAA01",
    badgeBg: "rgba(255,170,1,0.12)",
    badgeText: "#a06d00",
    label: "Moderate Light",
    message: "Balanced exposure — all good",
    luxLabel: "Office / Indoor",
  },
  High: {
    barColor: "#E81A01",
    badgeBg: "rgba(232,26,1,0.10)",
    badgeText: "#c21500",
    label: "Bright Light",
    message: "High exposure — consider a rest",
    luxLabel: "Bright / Outdoor",
  },
  Resting: {
    barColor: "#4A8FA5",
    badgeBg: "rgba(74,143,165,0.12)",
    badgeText: "#2d6d87",
    label: "Resting",
    message: "Recovery mode — eyes relaxing",
    luxLabel: "Dim / Rest",
  },
};

// ── mock bluetooth devices ──────────────────────────────────────────────────
const DEVICES = [
  { id: "1", name: "Luma Sensor S1", type: "Light Sensor", battery: 82, connected: true },
  { id: "2", name: "Smart Frames Pro", type: "Smart Glasses", battery: 67, connected: true },
  { id: "3", name: "Luma Hub", type: "Base Station", battery: null, connected: true },
];

export function Home() {
  const { load, state, currentLux, luxHours } = useHealth();
  const { showDevices, setShowDevices } = useSheet();

  const progressPercent = Math.min(100, Math.max(0, load));
  const cfg = STATE_CONFIG[state];

  return (
    <div
      className="relative w-full bg-[#fff7ec] overflow-hidden"
      style={{ minHeight: "100svh" }}
    >
      {/* ── TOP SECTION ───────────────────────────────────────────── */}
      <div className="relative z-10 px-7 pt-[83px] flex flex-col">

        {/* Header row */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex items-center justify-between"
          style={{ height: 36 }}
        >
          <p
            className="text-[#1C2E3E] text-[15px] whitespace-nowrap"
            style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 500, lineHeight: "36px" }}
          >
            Hi there user!
          </p>

          {/* Bluetooth icon — tap to open devices */}
          <button
            onClick={() => setShowDevices(true)}
            className="relative flex items-center justify-center rounded-full"
            style={{ width: 36, height: 36, background: "rgba(38,25,208,0.07)" }}
          >
            {/* active dot */}
            <span
              className="absolute rounded-full bg-[#5eb53e]"
              style={{ width: 7, height: 7, top: 5, right: 5 }}
            />
            <svg width="12" height="20" fill="none" viewBox="0 0 12.2959 20.6964">
              <path
                clipRule="evenodd"
                d={svgPaths.p30cb1c00}
                fill="#2619D0"
                fillRule="evenodd"
              />
            </svg>
          </button>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
          className="text-[#1C2E3E] text-[32px] whitespace-nowrap"
          style={{
            fontFamily: "'Manuale', serif",
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "36px",
            marginTop: 0,
          }}
        >
          How are your eyes?
        </motion.h1>

        {/* Connected badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
          className="mt-1"
        >
          <span
            className="inline-block rounded-[71px] px-3 py-0.5 text-[#5eb53e] text-[12px]"
            style={{
              backgroundColor: "rgba(94,181,62,0.09)",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontVariationSettings: "'opsz' 14",
              lineHeight: "18px",
            }}
          >
            Connected
          </span>
        </motion.div>

        {/* ── Environment Card ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
          className="rounded-[24px] mt-[16.78px]"
          style={{
            width: "100%",
            boxShadow: "0px 0px 15px 0px rgba(202,202,202,0.44)",
            background: "rgba(255,252,248,0.96)",
            paddingTop: 17,
            paddingBottom: 17,
            paddingLeft: 14,
            paddingRight: 14,
          }}
        >
          {/* Top row: label + animated state badge */}
          <div className="flex items-center justify-between w-full">
            <span
              className="uppercase text-[#1c2e3e] text-[11px]"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                lineHeight: "16.5px",
                letterSpacing: "0.05em",
              }}
            >
              Current Environment
            </span>

            <AnimatePresence mode="wait">
              <motion.span
                key={state}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.25 }}
                className="rounded-full px-2.5 py-0.5 text-[10.5px]"
                style={{
                  background: cfg.badgeBg,
                  color: cfg.badgeText,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                }}
              >
                {cfg.label}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Lux value row */}
          <div className="flex items-end justify-between w-full mt-1">
            <AnimatePresence mode="wait">
              <motion.span
                key={cfg.luxLabel}
                initial={{ opacity: 0.5, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.3 }}
                className="text-[#8b9eb0] text-[11px]"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  fontVariationSettings: "'opsz' 11",
                }}
              >
                {cfg.luxLabel}
              </motion.span>
            </AnimatePresence>
            <motion.span
              key={Math.round(luxHours / 10)}
              initial={{ opacity: 0.6, y: -3 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-[11.5px]"
              style={{
                color: cfg.barColor,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 800,
                fontVariationSettings: "'opsz' 14",
                lineHeight: "28px",
                letterSpacing: "0.5px",
              }}
            >
              {Math.round(currentLux).toLocaleString()} lux · {luxHours} Lux-h
            </motion.span>
          </div>

          {/* Progress track */}
          <div
            className="relative rounded-full overflow-hidden w-full"
            style={{
              marginTop: 10,
              height: 8,
              backgroundColor: "rgba(200,200,200,0.4)",
            }}
          >
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full"
              style={{ backgroundColor: cfg.barColor }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
          </div>

          {/* Scale labels */}
          <div className="flex items-start justify-between w-full" style={{ marginTop: 6 }}>
            {["Low", "Moderate", "Bright"].map((label) => (
              <span
                key={label}
                className="text-[9px]"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                  fontVariationSettings: "'opsz' 9",
                  lineHeight: "13.5px",
                  color: "#8b9eb0",
                }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* State message */}
          <AnimatePresence mode="wait">
            <motion.p
              key={state + "-msg"}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.35 }}
              className="text-[11px] mt-3"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                color: cfg.badgeText,
                fontVariationSettings: "'opsz' 11",
              }}
            >
              {cfg.message}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── WHITE FILL (nav bar area) ────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-white pointer-events-none"
        style={{ height: 160, zIndex: 0 }}
      />

      {/* ── WHITE ELLIPSE ─────────────────────────────────────────── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: 370,
          left: "50%",
          transform: "translateX(-50%)",
          width: 796,
          height: 643,
          zIndex: 1,
        }}
      >
        <svg
          className="block w-full h-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 796 643"
        >
          <path d={svgPaths.pe09d200} fill="white" />
        </svg>
      </div>

      {/* ── SUN CHARACTER ─────────────────────────────────────────── */}
      <div
        className="absolute"
        style={{
          top: 390,
          left: "50%",
          transform: "translateX(-50%)",
          width: 370,
          height: 370,
          zIndex: 5,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={state}
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ width: 370, height: 370 }}
          >
            <SunCharacter state={state} size={370} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── BLUETOOTH DEVICES SHEET ───────────────────────────────── */}
      <AnimatePresence>
        {showDevices && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/30 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDevices(false)}
            />

            {/* Bottom sheet */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[28px] bg-white"
              style={{ paddingBottom: "env(safe-area-inset-bottom, 24px)" }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 36 }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-9 h-1 rounded-full bg-[#d0d8e4]" />
              </div>

              <div className="px-6 pb-6">
                {/* Sheet header */}
                <div className="flex items-center justify-between mt-3 mb-5">
                  <div>
                    <h2
                      className="text-[#1C2E3E] text-[18px]"
                      style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700 }}
                    >
                      Connected Devices
                    </h2>
                    <p
                      className="text-[12px] text-[#8b9eb0] mt-0.5"
                      style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
                    >
                      {DEVICES.filter((d) => d.connected).length} device
                      {DEVICES.filter((d) => d.connected).length !== 1 ? "s" : ""} active
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDevices(false)}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(200,210,220,0.25)" }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M1 1l10 10M11 1L1 11" stroke="#8b9eb0" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>

                {/* Device list */}
                <div className="flex flex-col gap-3">
                  {DEVICES.map((device) => (
                    <motion.div
                      key={device.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Number(device.id) * 0.07 }}
                      className="flex items-center justify-between rounded-[16px] px-4 py-3.5"
                      style={{ background: "#F9F8F6" }}
                    >
                      <div className="flex items-center gap-3">
                        {/* BT device icon */}
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center"
                          style={{ background: "rgba(38,25,208,0.09)" }}
                        >
                          <svg width="10" height="17" fill="none" viewBox="0 0 12.2959 20.6964">
                            <path
                              clipRule="evenodd"
                              d={svgPaths.p30cb1c00}
                              fill="#2619D0"
                              fillRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <p
                            className="text-[#1C2E3E] text-[13.5px]"
                            style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 600 }}
                          >
                            {device.name}
                          </p>
                          <p
                            className="text-[11px] text-[#8b9eb0]"
                            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
                          >
                            {device.type}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        {/* Connected dot */}
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#5eb53e]" />
                          <span
                            className="text-[10px] text-[#5eb53e]"
                            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
                          >
                            Active
                          </span>
                        </span>
                        {/* Battery */}
                        {device.battery !== null && (
                          <BatteryBar pct={device.battery} />
                        )}
                        {device.battery === null && (
                          <span
                            className="text-[10px] text-[#8b9eb0]"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                          >
                            Wired
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Scan button */}
                <button
                  className="mt-5 w-full rounded-[14px] py-3.5 text-[13px] text-[#2619D0]"
                  style={{
                    fontFamily: "'Figtree', sans-serif",
                    fontWeight: 700,
                    background: "rgba(38,25,208,0.07)",
                    letterSpacing: "0.01em",
                  }}
                >
                  Scan for new devices
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── small battery bar component ─────────────────────────────────────────────
function BatteryBar({ pct }: { pct: number }) {
  const color = pct > 50 ? "#5eb53e" : pct > 20 ? "#FFAA01" : "#E81A01";
  return (
    <div className="flex items-center gap-1">
      <div
        className="relative rounded-sm overflow-hidden"
        style={{ width: 24, height: 8, background: "rgba(0,0,0,0.08)" }}
      >
        <div
          className="absolute left-0 top-0 h-full rounded-sm"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span
        className="text-[10px]"
        style={{ color, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
      >
        {pct}%
      </span>
    </div>
  );
}