import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sun,
  Moon,
  Briefcase,
  Coffee,
  Search,
  RefreshCcw,
  Waves,
  ChevronRight,
  TrendingUp,
  Clock,
  Lightbulb,
} from "lucide-react";
import { useHealth } from "../context/HealthContext";

const exposureSources = [
  {
    id: "morning",
    label: "Morning Screen",
    val: 420,
    peak: 680,
    duration: "2h 15m",
    icon: <Sun className="size-5" />,
    color: "#4A8FA5",
    desc: "Phone + laptop before 10am",
    tip: "Try 15 minutes of natural light first",
    time: "6:30 – 8:45 AM",
  },
  {
    id: "office",
    label: "Office Lighting",
    val: 580,
    peak: 1200,
    duration: "5h 40m",
    icon: <Briefcase className="size-5" />,
    color: "#A8854A",
    desc: "Overhead + window light",
    tip: "Repositioning may reduce indirect light",
    time: "9:00 AM – 2:40 PM",
  },
  {
    id: "cafe",
    label: "Café Environment",
    val: 120,
    peak: 350,
    duration: "45m",
    icon: <Coffee className="size-5" />,
    color: "#1edd00",
    desc: "Warm ambient lighting",
    tip: "A good recovery environment",
    time: "3:00 – 3:45 PM",
  },
  {
    id: "night",
    label: "Night Screen",
    val: 120,
    peak: 480,
    duration: "1h 20m",
    icon: <Moon className="size-5" />,
    color: "#2619D0",
    desc: "Phone in low-light room",
    tip: "Consider enabling screen adjustment after 8pm",
    time: "10:00 – 11:20 PM",
  },
];

export function Tracker() {
  const { luxHours, currentLux, environment, load, state } = useHealth();
  const [isScanning, setIsScanning] = useState(false);
  const [expandedSource, setExpandedSource] = useState<string | null>(null);
  const totalVal = exposureSources.reduce((s, b) => s + b.val, 0);

  const startScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  };

  const getLuxBarColor = () => {
    if (currentLux > 1200) return "#B8724A";
    if (currentLux > 600) return "#FFAA01";
    return "#1edd00";
  };

  const getStateLabel = () => {
    switch (state) {
      case "Low": return "Low";
      case "Moderate": return "Moderate";
      case "High": return "High";
      case "Resting": return "Resting";
    }
  };

  return (
    <div className="flex flex-col gap-6 px-5 sm:px-6 pt-12 pb-28">
      {/* Header */}
      <header className="flex flex-col gap-1">
        <p
          className="text-[#1C2E3E] text-[24px]"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontVariationSettings: "'opsz' 14",
          }}
        >
          Light Exposure
        </p>
        <p
          className="text-[#8b9eb0] text-[13px]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Understanding your daily light patterns
        </p>
      </header>

      {/* Real-time Sensor */}
      <section className="bg-[#1C2E3E] rounded-[24px] p-6 text-white flex flex-col items-center gap-5 relative overflow-hidden">
        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ top: "-10%" }}
              animate={{ top: "110%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, repeat: 1, ease: "linear" }}
              className="absolute left-0 right-0 h-1 bg-[#FFAA01] shadow-[0_0_20px_rgba(255,170,1,0.6)] z-10 rounded-full"
            />
          )}
        </AnimatePresence>

        {/* Sensor Header */}
        <div className="flex items-center gap-2 text-[#FFAA01]">
          <Search className="size-3.5" />
          <span
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ fontWeight: 700, fontFamily: "'Inter', sans-serif" }}
          >
            Ambient Light Estimate
          </span>
        </div>

        {/* Lux Number */}
        <div className="flex flex-col items-center gap-1">
          <motion.div
            key={currentLux}
            initial={{ scale: 0.95, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-[48px] tracking-tighter"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
            }}
          >
            {currentLux}
          </motion.div>
          <span
            className="text-[10px] text-[#8b9eb0] uppercase tracking-[0.15em]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Estimated Lux
          </span>
        </div>

        {/* Environment */}
        <div className="w-full flex flex-col gap-2.5">
          <div className="flex justify-between items-end">
            <span
              className="text-[11px] text-[#8b9eb0] uppercase"
              style={{ fontWeight: 500, fontFamily: "'Inter', sans-serif" }}
            >
              Environment
            </span>
            <span
              className="text-[12px] text-[#FFAA01]"
              style={{
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {environment}
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              animate={{
                width: `${Math.min(100, (currentLux / 2000) * 100)}%`,
              }}
              className="h-full rounded-full"
              style={{ backgroundColor: getLuxBarColor() }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-white/30">
            <span>Low</span>
            <span>Moderate</span>
            <span>Bright</span>
          </div>
        </div>

        {/* Re-calibrate */}
        <button
          onClick={startScan}
          disabled={isScanning}
          className="w-full py-3.5 bg-white/8 hover:bg-white/12 rounded-2xl flex items-center justify-center gap-2 transition-colors border border-white/5"
        >
          <RefreshCcw
            className={`size-3.5 ${isScanning ? "animate-spin" : ""}`}
          />
          <span
            className="text-[11px] uppercase tracking-[0.15em]"
            style={{ fontWeight: 700, fontFamily: "'Inter', sans-serif" }}
          >
            {isScanning ? "Updating..." : "Refresh estimate"}
          </span>
        </button>
      </section>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <MiniStatCard
          icon={<Waves className="size-3.5" />}
          label="Cumulative"
          value={`${luxHours}`}
          suffix="lux-h"
          iconColor="#4A8FA5"
        />
        <MiniStatCard
          icon={<TrendingUp className="size-3.5" />}
          label="Light Load"
          value={`${load}`}
          suffix="/100"
          iconColor="#FFAA01"
        />
        <MiniStatCard
          icon={<Lightbulb className="size-3.5" />}
          label="Status"
          value={getStateLabel()}
          iconColor={
            state === "Low"
              ? "#1edd00"
              : state === "Moderate"
              ? "#A8854A"
              : "#B8724A"
          }
          isSmallText
        />
      </div>

      {/* Exposure Breakdown */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p
            className="text-[#1C2E3E] text-[16px]"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontVariationSettings: "'opsz' 14",
            }}
          >
            Exposure Breakdown
          </p>
          <span
            className="text-[11px] text-[#8b9eb0]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {totalVal} lux-h total
          </span>
        </div>

        {/* Donut Ring */}
        <div className="bg-white rounded-[20px] p-5 shadow-[0_2px_12px_rgba(28,46,62,0.06)] border border-[rgba(28,46,62,0.08)]">
          <div className="flex items-center gap-6">
            <div className="relative flex-shrink-0" style={{ width: 110, height: 110 }}>
              <svg viewBox="0 0 42 42" className="w-full h-full -rotate-90">
                {(() => {
                  let offset = 0;
                  return exposureSources.map((s) => {
                    const pct = (s.val / totalVal) * 100;
                    const dashLen = pct * 0.2827;
                    const gap = 28.274 - dashLen;
                    const el = (
                      <motion.circle
                        key={s.id}
                        cx="21"
                        cy="21"
                        r="9"
                        fill="transparent"
                        stroke={s.color}
                        strokeWidth="4"
                        strokeDasharray={`${dashLen} ${gap}`}
                        strokeDashoffset={-offset * 0.2827}
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    );
                    offset += pct;
                    return el;
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="text-[18px] text-[#1C2E3E]"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}
                >
                  {totalVal}
                </span>
                <span
                  className="text-[8px] text-[#8b9eb0] uppercase tracking-wider"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  lux-h
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 flex-1">
              {exposureSources.map((s) => (
                <div key={s.id} className="flex items-center gap-2.5">
                  <div
                    className="size-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <div className="flex-1 flex items-center justify-between">
                    <span
                      className="text-[11px] text-[#1C2E3E]"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 500,
                      }}
                    >
                      {s.label}
                    </span>
                    <span
                      className="text-[11px] text-[#8b9eb0]"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      {Math.round((s.val / totalVal) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Expandable Source Cards */}
        <div className="flex flex-col gap-3">
          {exposureSources.map((source, i) => {
            const isExpanded = expandedSource === source.id;
            return (
              <motion.div
                key={source.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`bg-white rounded-[20px] overflow-hidden border border-[rgba(28,46,62,0.08)] shadow-[0_2px_12px_rgba(28,46,62,0.06)] transition-shadow ${
                  isExpanded ? "shadow-[0_8px_32px_rgba(28,46,62,0.12)]" : ""
                }`}
              >
                <button
                  onClick={() =>
                    setExpandedSource(isExpanded ? null : source.id)
                  }
                  className="w-full p-4 flex items-center gap-4"
                >
                  <div
                    className="size-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: `${source.color}15`,
                      color: source.color,
                    }}
                  >
                    {source.icon}
                  </div>
                  <div className="flex-1 flex flex-col items-start gap-0.5">
                    <span
                      className="text-[13px] text-[#1C2E3E]"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      {source.label}
                    </span>
                    <span
                      className="text-[10px] text-[#8b9eb0]"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {source.desc}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span
                      className="text-[14px] text-[#1C2E3E]"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 700,
                      }}
                    >
                      {source.val}
                      <span className="text-[10px] text-[#8b9eb0]" style={{ fontWeight: 400 }}> lux-h</span>
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    className="text-[#8b9eb0]"
                  >
                    <ChevronRight className="size-4" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-0">
                        <div className="border-t border-[rgba(28,46,62,0.06)] pt-4">
                          {/* Stats Row */}
                          <div className="grid grid-cols-3 gap-3 mb-4">
                            <div
                              className="rounded-xl p-3 flex flex-col gap-1"
                              style={{ backgroundColor: `${source.color}08` }}
                            >
                              <span className="text-[9px] text-[#8b9eb0] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                                Peak
                              </span>
                              <span className="text-[14px] text-[#1C2E3E]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
                                {source.peak}
                                <span className="text-[9px] text-[#8b9eb0]" style={{ fontWeight: 400 }}> lux</span>
                              </span>
                            </div>
                            <div
                              className="rounded-xl p-3 flex flex-col gap-1"
                              style={{ backgroundColor: `${source.color}08` }}
                            >
                              <span className="text-[9px] text-[#8b9eb0] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                                Duration
                              </span>
                              <span className="text-[14px] text-[#1C2E3E]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
                                {source.duration}
                              </span>
                            </div>
                            <div
                              className="rounded-xl p-3 flex flex-col gap-1"
                              style={{ backgroundColor: `${source.color}08` }}
                            >
                              <span className="text-[9px] text-[#8b9eb0] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                                Share
                              </span>
                              <span className="text-[14px] text-[#1C2E3E]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
                                {Math.round((source.val / totalVal) * 100)}%
                              </span>
                            </div>
                          </div>

                          {/* Intensity Bar */}
                          <div className="mb-3">
                            <div className="flex justify-between mb-1.5">
                              <span className="text-[9px] text-[#8b9eb0] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                                Exposure over time
                              </span>
                              <span className="text-[9px] text-[#8b9eb0]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                {source.time}
                              </span>
                            </div>
                            <div className="h-6 bg-[#F5F2EC] rounded-lg overflow-hidden flex items-end gap-px p-0.5">
                              {Array.from({ length: 20 }).map((_, idx) => {
                                const h = Math.random() * 80 + 20;
                                return (
                                  <motion.div
                                    key={`bar-${source.id}-${idx}`}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{
                                      duration: 0.5,
                                      delay: idx * 0.03,
                                    }}
                                    className="flex-1 rounded-sm"
                                    style={{
                                      backgroundColor: source.color,
                                      opacity: 0.3 + (h / 100) * 0.7,
                                    }}
                                  />
                                );
                              })}
                            </div>
                          </div>

                          {/* Suggestion — calm, actionable */}
                          <div
                            className="flex items-center gap-2 rounded-xl p-3"
                            style={{ backgroundColor: `${source.color}10` }}
                          >
                            <Lightbulb
                              className="size-3.5 flex-shrink-0"
                              style={{ color: source.color }}
                            />
                            <span
                              className="text-[11px] text-[#1C2E3E]/80"
                              style={{
                                fontFamily: "'DM Sans', sans-serif",
                                fontWeight: 500,
                              }}
                            >
                              {source.tip}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-white rounded-[20px] p-5 shadow-[0_2px_12px_rgba(28,46,62,0.06)] border border-[rgba(28,46,62,0.08)]">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="size-4 text-[#A8854A]" />
          <p
            className="text-[14px] text-[#1C2E3E]"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontVariationSettings: "'opsz' 14",
            }}
          >
            Today's Timeline
          </p>
        </div>
        <div className="flex flex-col gap-0">
          {exposureSources.map((s, i) => (
            <div key={s.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className="size-3 rounded-full border-2 flex-shrink-0"
                  style={{ borderColor: s.color, backgroundColor: `${s.color}30` }}
                />
                {i < exposureSources.length - 1 && (
                  <div className="w-px flex-1 bg-[rgba(28,46,62,0.08)] min-h-[32px]" />
                )}
              </div>
              <div className="pb-4 flex-1">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[12px] text-[#1C2E3E]"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    {s.label}
                  </span>
                  <span
                    className="text-[10px] text-[#8b9eb0]"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {s.time}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 bg-[#F5F2EC] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(s.val / totalVal) * 100}%` }}
                    transition={{ duration: 0.8, delay: i * 0.15 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Educational Card — transparent, humble */}
      <section className="bg-[#F9F8F6] border border-[#A8854A]/20 rounded-[20px] p-5 flex items-start gap-3">
        <div
          className="p-2 rounded-xl flex-shrink-0"
          style={{ backgroundColor: "#A8854A15", color: "#A8854A" }}
        >
          <TrendingUp className="size-4" />
        </div>
        <div className="flex flex-col gap-1">
          <span
            className="text-[11px] text-[#A8854A] uppercase tracking-[0.15em]"
            style={{ fontWeight: 700, fontFamily: "'Inter', sans-serif" }}
          >
            About Light Exposure
          </span>
          <p
            className="text-[12px] text-[#1C2E3E]/70 leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <span style={{ fontWeight: 600 }}>Lux-hours</span> are an estimated
            measure of your cumulative light exposure over time. Higher
            values may indicate environments where reducing screen brightness
            or taking breaks could improve comfort.
          </p>
        </div>
      </section>
    </div>
  );
}

/* Mini Stat Card */
function MiniStatCard({
  icon,
  label,
  value,
  suffix,
  iconColor,
  isSmallText,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  suffix?: string;
  iconColor: string;
  isSmallText?: boolean;
}) {
  return (
    <div className="bg-white rounded-[16px] p-3.5 flex flex-col gap-2.5 shadow-[0_2px_12px_rgba(28,46,62,0.06)] border border-[rgba(28,46,62,0.08)]">
      <div style={{ color: iconColor }}>{icon}</div>
      <div className="flex flex-col gap-0.5">
        <div className="flex items-baseline gap-0.5">
          <span
            className={`text-[#1C2E3E] ${isSmallText ? "text-[11px]" : "text-[18px]"}`}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontVariationSettings: "'opsz' 14",
            }}
          >
            {value}
          </span>
          {suffix && (
            <span
              className="text-[10px] text-[#8b9eb0]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {suffix}
            </span>
          )}
        </div>
        <span
          className="text-[10px] text-[#8b9eb0]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
