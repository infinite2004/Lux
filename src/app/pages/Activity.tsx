import React from "react";
import { motion } from "motion/react";
import { useHealth } from "../context/HealthContext";

const barData = [
  { h: 10.5, color: "#2619d0", opacity: 0.75 },
  { h: 13.4, color: "#2619d0", opacity: 0.75 },
  { h: 12, color: "#2619d0", opacity: 0.75 },
  { h: 15.4, color: "#2619d0", opacity: 0.75 },
  { h: 21.6, color: "#2619d0", opacity: 0.75 },
  { h: 28.8, color: "#ffaa01", opacity: 0.75 },
  { h: 34.5, color: "#B8724A", opacity: 0.85 },
  { h: 32.6, color: "#B8724A", opacity: 0.85 },
  { h: 26.4, color: "#ffaa01", opacity: 0.75 },
  { h: 31.2, color: "#ffaa01", opacity: 0.85 },
  { h: 37.4, color: "#B8724A", opacity: 0.85 },
  { h: 33.6, color: "#B8724A", opacity: 0.85 },
  { h: 29.7, color: "#ffaa01", opacity: 0.85 },
  { h: 26.4, color: "#ffaa01", opacity: 0.75 },
  { h: 23, color: "#ffaa01", opacity: 0.75 },
  { h: 7.2, color: "rgba(28,46,62,0.08)", opacity: 0.4 },
  { h: 7.2, color: "rgba(28,46,62,0.08)", opacity: 0.4 },
  { h: 7.2, color: "rgba(28,46,62,0.08)", opacity: 0.4 },
  { h: 7.2, color: "rgba(28,46,62,0.08)", opacity: 0.4 },
  { h: 7.2, color: "rgba(28,46,62,0.08)", opacity: 0.4 },
  { h: 7.2, color: "rgba(28,46,62,0.08)", opacity: 0.4 },
  { h: 7.2, color: "rgba(28,46,62,0.08)", opacity: 0.4 },
  { h: 7.2, color: "rgba(28,46,62,0.08)", opacity: 0.4 },
  { h: 7.2, color: "rgba(28,46,62,0.08)", opacity: 0.4 },
];

const locationData = [
  { label: "Morning Screen", pct: 34, color: "#E81A01" },
  { label: "Office Lighting", pct: 47, color: "#FFAA01" },
  { label: "Café Environment", pct: 10, color: "#1edd00" },
  { label: "Night Screen", pct: 10, color: "#2619D0" },
];

export function Activity() {
  const { luxHours, currentLux } = useHealth();

  return (
    <div className="relative flex flex-col min-h-screen w-full">
      <div className="flex flex-col px-5 sm:px-7 pt-16 pb-32">
        {/* Title */}
        <h1
          className="text-[#1C2E3E] text-[29px]"
          style={{
            fontFamily: "'Figtree', sans-serif",
            fontWeight: 700,
            lineHeight: "36px",
          }}
        >
          Light Exposure
        </h1>
        <p
          className="text-[#8b9eb0] text-[13px] mt-1"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Understanding your daily light patterns
        </p>

        {/* Today's Pattern Card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8 bg-white rounded-[16px] p-5 border border-[rgba(28,46,62,0.08)] shadow-[0px_2px_12px_0px_rgba(28,46,62,0.06)]"
        >
          <p
            className="text-[#1c2e3e] text-[16px] mb-4"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              fontVariationSettings: "'opsz' 14",
            }}
          >
            Today's Pattern
          </p>

          {/* Bar Chart */}
          <div className="w-full h-[48px] flex items-end gap-[2px]">
            {barData.map((bar, i) => (
              <motion.div
                key={`bar-${i}`}
                initial={{ height: 0 }}
                animate={{ height: bar.h }}
                transition={{ duration: 0.8, delay: i * 0.03 }}
                className="flex-1 min-w-px rounded-t-[4px]"
                style={{
                  backgroundColor: bar.color,
                  opacity: bar.opacity,
                }}
              />
            ))}
          </div>

          {/* Time Labels */}
          <div className="flex items-start justify-between mt-3">
            {["Morning", "Afternoon", "Evening", "Night"].map((label) => (
              <span
                key={label}
                className="text-[#FFAA01] text-[11.2px]"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  fontVariationSettings: "'opsz' 14",
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Cumulative + Peak — two separate cards in a row */}
        <div className="flex gap-3 mt-2">
          {/* Cumulative card */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 bg-white rounded-[16px] px-3 py-2.5 border border-[rgba(28,46,62,0.08)] shadow-[0px_2px_12px_0px_rgba(28,46,62,0.06)] flex items-center gap-2"
          >
            <svg className="size-5 text-[#1C2E3E] shrink-0" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" d="M3 5h14M3 10h14M3 15h14" />
            </svg>
            <div>
              <div className="flex items-baseline gap-1">
                <span
                  className="text-[#1C2E3E] text-[24px]"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700,
                    fontVariationSettings: "'opsz' 14",
                  }}
                >
                  {luxHours}
                </span>
                <span
                  className="text-[#8b9eb0] text-[11px]"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  lux-h
                </span>
              </div>
              <p
                className="text-[#8b9eb0] text-[11px]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Cumulative
              </p>
            </div>
          </motion.div>

          {/* Peak card */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex-1 bg-white rounded-[16px] px-3 py-2.5 border border-[rgba(28,46,62,0.08)] shadow-[0px_2px_12px_0px_rgba(28,46,62,0.06)] flex items-center gap-2"
          >
            <svg className="size-5 text-[#FFAA01] shrink-0" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2 14l4-5 3 3 3-4 4 5" />
            </svg>
            <div>
              <div className="flex items-baseline gap-1">
                <span
                  className="text-[#FFAA01] text-[24px]"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700,
                    fontVariationSettings: "'opsz' 14",
                  }}
                >
                  {currentLux}
                </span>
                <span
                  className="text-[#8b9eb0] text-[11px]"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  lux
                </span>
              </div>
              <p
                className="text-[#8b9eb0] text-[11px]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Peak
              </p>
            </div>
          </motion.div>
        </div>

        {/* Location Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <p
            className="text-[#1C2E3E] text-[18px] mb-4"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontVariationSettings: "'opsz' 14",
            }}
          >
            Location Breakdown
          </p>

          <div className="bg-white rounded-[16px] p-5 border border-[rgba(28,46,62,0.08)] shadow-[0px_2px_12px_0px_rgba(28,46,62,0.06)] flex items-center gap-6">
            {/* Donut chart */}
            <DonutChart luxHours={luxHours} data={locationData} />

            {/* Legend */}
            <div className="flex flex-col gap-3 flex-1">
              {locationData.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div
                    className="size-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span
                    className="text-[#1C2E3E] text-[12px] flex-1"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    {item.label}
                  </span>
                  <span
                    className="text-[#8b9eb0] text-[12px]"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    {item.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* About Light Exposure */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 bg-[#fef7ed] rounded-[16px] p-5 border border-[rgba(28,46,62,0.08)]"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[16px]">☀️</span>
            <span
              className="text-[#FFAA01] text-[11px] uppercase tracking-wider"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
              }}
            >
              About Light Exposure
            </span>
          </div>
          <p
            className="text-[#1C2E3E] text-[12.5px] leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Lux-hours are an estimated measure of your cumulative light exposure over time. Higher
            values may indicate environments where reducing screen brightness or taking breaks
            could improve comfort.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

/* Donut / Ring Chart */
function DonutChart({
  luxHours,
  data,
}: {
  luxHours: number;
  data: { label: string; pct: number; color: string }[];
}) {
  const size = 130;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  let accumulated = 0;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background ring */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="rgba(28,46,62,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Data arcs */}
        {data.map((item, i) => {
          const dashLength = (item.pct / 100) * circumference;
          const dashGap = circumference - dashLength;
          const offset = -(accumulated / 100) * circumference;
          accumulated += item.pct;

          return (
            <motion.circle
              key={item.label}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={`${dashLength} ${dashGap}`}
              strokeDashoffset={offset}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
              style={{
                transformOrigin: `${cx}px ${cy}px`,
                transform: "rotate(-90deg)",
              }}
            />
          );
        })}
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-[#2619D0] text-[22px]"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontVariationSettings: "'opsz' 14",
          }}
        >
          {luxHours}
        </span>
        <span
          className="text-[#8b9eb0] text-[9px] -mt-0.5"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          lux-h
        </span>
      </div>
    </div>
  );
}