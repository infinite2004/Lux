import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TrendingUp,
  Sun,
  Moon,
  Briefcase,
  Calendar,
  Download,
  Share2,
  ChevronRight,
  Monitor,
  Lightbulb,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
} from "recharts";

/* ── Data ───────────────────────────────────────── */

const dailyHourly = [
  { t: "6a", lux: 120, id: "h6a" },
  { t: "7a", lux: 210, id: "h7a" },
  { t: "8a", lux: 380, id: "h8a" },
  { t: "9a", lux: 520, id: "h9a" },
  { t: "10a", lux: 680, id: "h10a" },
  { t: "11a", lux: 850, id: "h11a" },
  { t: "12p", lux: 1100, id: "h12p" },
  { t: "1p", lux: 980, id: "h1p" },
  { t: "2p", lux: 1250, id: "h2p" },
  { t: "3p", lux: 1400, id: "h3p" },
  { t: "4p", lux: 1600, id: "h4p" },
  { t: "5p", lux: 1350, id: "h5p" },
  { t: "6p", lux: 900, id: "h6p" },
  { t: "7p", lux: 620, id: "h7p" },
  { t: "8p", lux: 380, id: "h8p" },
  { t: "9p", lux: 240, id: "h9p" },
  { t: "10p", lux: 150, id: "h10p" },
  { t: "11p", lux: 80, id: "h11p" },
];

const weeklyData = [
  { day: "Mon", lux: 1400, load: 75, barColor: "#B8724A" },
  { day: "Tue", lux: 1100, load: 55, barColor: "#A8854A" },
  { day: "Wed", lux: 900, load: 40, barColor: "#A8854A" },
  { day: "Thu", lux: 1200, load: 70, barColor: "#B8724A" },
  { day: "Fri", lux: 1600, load: 90, barColor: "#B8724A" },
  { day: "Sat", lux: 800, load: 30, barColor: "#1edd00" },
  { day: "Sun", lux: 700, load: 25, barColor: "#1edd00" },
];

const patternInsights = [
  {
    id: "office-light",
    label: "Afternoon Office Light",
    pct: 85,
    icon: <Briefcase className="size-4" />,
    color: "#A8854A",
    when: "Weekdays 2–5 PM",
    detail:
      "Your estimated exposure tends to peak near a window-facing position during afternoons. Repositioning or adjusting blinds may help.",
  },
  {
    id: "morning-screen",
    label: "Early Morning Screen Use",
    pct: 62,
    icon: <Monitor className="size-4" />,
    color: "#2619D0",
    when: "Daily 6–7 AM",
    detail:
      "Screens used right after waking may feel brighter to your eyes. Delaying screen use by 15–20 minutes is a simple adjustment.",
  },
  {
    id: "night-exposure",
    label: "Late Evening Screen Time",
    pct: 48,
    icon: <Moon className="size-4" />,
    color: "#B8724A",
    when: "Mon, Wed, Fri after 10 PM",
    detail:
      "Bright screens late at night can affect your evening routine. Using screen adjustment during these times may improve comfort.",
  },
];

const weeklyStats = [
  { label: "Avg Daily Load", value: "55", suffix: "/100", change: -8, color: "#1edd00" },
  { label: "Busiest Day", value: "Fri", suffix: "", change: 0, color: "#B8724A" },
  { label: "Rest Periods", value: "12", suffix: "", change: 3, color: "#4A8FA5" },
  { label: "Screen Adj.", value: "3.2", suffix: "h/day", change: 1.5, color: "#2619D0" },
];

const tips = [
  {
    id: "morning",
    title: "Morning Natural Light",
    desc: "Spending 10–15 minutes outdoors in the morning may help your eyes adjust better to indoor lighting for the rest of the day.",
    tag: "Recommended",
    tagColor: "#1edd00",
    icon: <Sun className="size-5" />,
    when: "Before 10 AM",
  },
  {
    id: "ease",
    title: "Pre-emptive Screen Dimming",
    desc: "Based on your patterns, enabling screen adjustment by 3:30 PM on Fridays could reduce your exposure during typically bright hours.",
    tag: "Based on your data",
    tagColor: "#2619D0",
    icon: <Lightbulb className="size-5" />,
    when: "Fridays 3:30 PM",
  },
  {
    id: "break",
    title: "Regular Short Breaks",
    desc: "Looking away from your screen for 20 seconds every 20 minutes is a simple habit that can reduce cumulative discomfort.",
    tag: "Daily habit",
    tagColor: "#A8854A",
    icon: <TrendingUp className="size-5" />,
    when: "Every 20 min",
  },
];

/* ── Component ──────────────────────────────────── */

export function Insights() {
  const [chartView, setChartView] = useState<"daily" | "weekly">("daily");
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [expandedTip, setExpandedTip] = useState<string | null>(null);

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
          Weekly Recap
        </p>
        <p
          className="text-[#8b9eb0] text-[13px]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Reflecting on your light patterns this week
        </p>
      </header>

      {/* ── Weekly Summary Stats ───────────────────── */}
      <div className="grid grid-cols-4 gap-2.5">
        {weeklyStats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-[14px] p-3 flex flex-col gap-1.5 shadow-[0_2px_12px_rgba(28,46,62,0.06)] border border-[rgba(28,46,62,0.08)]"
          >
            <span
              className="text-[8px] text-[#8b9eb0] uppercase tracking-wider leading-tight"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
            >
              {s.label}
            </span>
            <div className="flex items-baseline gap-0.5">
              <span
                className="text-[16px] text-[#1C2E3E]"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                }}
              >
                {s.value}
              </span>
              {s.suffix && (
                <span
                  className="text-[9px] text-[#8b9eb0]"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {s.suffix}
                </span>
              )}
            </div>
            {s.change !== 0 && (
              <div
                className="flex items-center gap-0.5"
                style={{
                  color: s.change > 0 ? "#1edd00" : "#B8724A",
                }}
              >
                {s.change > 0 ? (
                  <ArrowUp className="size-2.5" />
                ) : (
                  <ArrowDown className="size-2.5" />
                )}
                <span
                  className="text-[9px]"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                  }}
                >
                  {Math.abs(s.change)}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Exposure Trend Chart ─────────────────────── */}
      <section className="bg-white rounded-[20px] p-5 shadow-[0_2px_12px_rgba(28,46,62,0.06)] border border-[rgba(28,46,62,0.08)] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-[#2619D0]" />
            <p
              className="text-[14px] text-[#1C2E3E]"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontVariationSettings: "'opsz' 14",
              }}
            >
              Exposure Trend
            </p>
          </div>
          <span
            className="text-[10px] text-[#8b9eb0] uppercase tracking-wider"
            style={{ fontWeight: 700, fontFamily: "'Inter', sans-serif" }}
          >
            Mar 1 – 7
          </span>
        </div>

        {/* Toggle */}
        <div className="flex bg-[#F5F2EC] rounded-xl p-1 gap-1">
          {(["daily", "weekly"] as const).map((view) => (
            <button
              key={view}
              onClick={() => setChartView(view)}
              className={`flex-1 py-2 rounded-lg text-[11px] uppercase tracking-wider transition-all ${
                chartView === view
                  ? "bg-white text-[#1C2E3E] shadow-sm"
                  : "text-[#8b9eb0]"
              }`}
              style={{ fontWeight: 700, fontFamily: "'Inter', sans-serif" }}
            >
              {view}
            </button>
          ))}
        </div>

        {/* Chart */}
        <AnimatePresence mode="wait">
          {chartView === "daily" ? (
            <motion.div
              key="daily"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="w-full h-52"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dailyHourly}
                  margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(28,46,62,0.05)"
                  />
                  <XAxis
                    dataKey="t"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 9,
                      fontWeight: 600,
                      fill: "#8b9eb0",
                    }}
                    interval={2}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 9,
                      fontWeight: 600,
                      fill: "#8b9eb0",
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid rgba(28,46,62,0.08)",
                      boxShadow: "0 4px 12px rgba(28,46,62,0.1)",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12,
                    }}
                    cursor={{ stroke: "#FFAA01", strokeWidth: 1 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="lux"
                    stroke="#FFAA01"
                    strokeWidth={2}
                    fill="#FFAA01"
                    fillOpacity={0.15}
                    dot={false}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="flex justify-between items-center px-1 mt-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-0.5 rounded-full bg-[#1edd00]" />
                  <span
                    className="text-[9px] text-[#8b9eb0]"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Low (&lt;500)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-0.5 rounded-full bg-[#A8854A]" />
                  <span
                    className="text-[9px] text-[#8b9eb0]"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Moderate
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-0.5 rounded-full bg-[#B8724A]" />
                  <span
                    className="text-[9px] text-[#8b9eb0]"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    High (&gt;1000)
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="weekly"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="w-full h-52"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weeklyData}
                  margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(28,46,62,0.05)"
                  />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 10,
                      fontWeight: 700,
                      fill: "#8b9eb0",
                    }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 10,
                      fontWeight: 700,
                      fill: "#8b9eb0",
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid rgba(28,46,62,0.08)",
                      boxShadow: "0 4px 12px rgba(28,46,62,0.1)",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12,
                    }}
                    cursor={{ fill: "transparent" }}
                  />
                  <Bar
                    dataKey="lux"
                    radius={[6, 6, 0, 0]}
                    isAnimationActive={false}
                  >
                    {weeklyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.barColor} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="flex justify-between items-center px-1 mt-2">
                <div className="flex items-center gap-1.5">
                  <div className="size-2 rounded-full bg-[#1edd00]" />
                  <span
                    className="text-[9px] text-[#8b9eb0]"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
                  >
                    Low range
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="size-2 rounded-full bg-[#A8854A]" />
                  <span
                    className="text-[9px] text-[#8b9eb0]"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
                  >
                    Moderate
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="size-2 rounded-full bg-[#B8724A]" />
                  <span
                    className="text-[9px] text-[#8b9eb0]"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
                  >
                    Elevated
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── Patterns — calm, insightful ─────────────────────── */}
      <section className="bg-[#1C2E3E] rounded-[24px] p-6 text-white flex flex-col gap-5 shadow-[0_8px_32px_rgba(28,46,62,0.2)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-[#FFAA01]" />
            <span
              className="text-[12px] uppercase tracking-[0.15em]"
              style={{ fontWeight: 700, fontFamily: "'Inter', sans-serif" }}
            >
              Your Patterns
            </span>
          </div>
          <button className="p-2 bg-white/8 rounded-xl hover:bg-white/12 transition-colors">
            <Share2 className="size-3.5" />
          </button>
        </div>

        <p
          className="text-[13px] opacity-80 leading-relaxed"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
          }}
        >
          Based on your recent data, your estimated exposure tends to be highest on{" "}
          <span
            className="text-[#FFAA01]"
            style={{ fontWeight: 700 }}
          >
            Fridays around 4:30 PM
          </span>
          . This appears to correlate with afternoon indoor lighting conditions.
        </p>

        {/* Insight Cards */}
        <div className="flex flex-col gap-2.5">
          {patternInsights.map((s) => {
            const isExpanded = expandedInsight === s.id;
            return (
              <div key={s.id}>
                <button
                  onClick={() =>
                    setExpandedInsight(isExpanded ? null : s.id)
                  }
                  className="w-full p-4 bg-white/5 rounded-2xl border border-white/8 flex flex-col gap-3 hover:bg-white/8 transition-colors"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div
                      className="size-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: `${s.color}25`,
                        color: s.color,
                      }}
                    >
                      {s.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <p
                        className="text-[12px]"
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        {s.label}
                      </p>
                      <p
                        className="text-[10px] text-[#8b9eb0]"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {s.when}
                      </p>
                    </div>
                    <span
                      className="text-[14px]"
                      style={{
                        color: s.color,
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 700,
                      }}
                    >
                      {s.pct}%
                    </span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      className="text-white/40"
                    >
                      <ChevronRight className="size-3.5" />
                    </motion.div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1 bg-white/8 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.pct}%` }}
                      transition={{ duration: 1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: s.color }}
                    />
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 py-3 bg-white/3 rounded-b-2xl border-x border-b border-white/5 -mt-1">
                        <p
                          className="text-[11px] text-white/60 leading-relaxed"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {s.detail}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Personalized Tips ─────────────────── */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="size-4 text-[#A8854A]" />
            <p
              className="text-[#1C2E3E] text-[16px]"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontVariationSettings: "'opsz' 14",
              }}
            >
              Personalized Tips
            </p>
          </div>
          <span
            className="text-[10px] text-[#8b9eb0]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Based on your week
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {tips.map((p, i) => {
            const isExpanded = expandedTip === p.id;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`bg-white rounded-[20px] overflow-hidden border transition-all ${
                  isExpanded
                    ? "border-[rgba(28,46,62,0.15)] shadow-[0_8px_32px_rgba(28,46,62,0.12)]"
                    : "border-[rgba(28,46,62,0.08)] shadow-[0_2px_12px_rgba(28,46,62,0.06)]"
                }`}
              >
                <button
                  onClick={() =>
                    setExpandedTip(isExpanded ? null : p.id)
                  }
                  className="w-full p-4 flex items-start gap-3.5"
                >
                  <div
                    className="size-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: `${p.tagColor}12`,
                      color: p.tagColor,
                    }}
                  >
                    {p.icon}
                  </div>
                  <div className="flex-1 text-left flex flex-col gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-[13px] text-[#1C2E3E]"
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        {p.title}
                      </span>
                      <span
                        className="text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{
                          fontWeight: 700,
                          fontFamily: "'Inter', sans-serif",
                          backgroundColor: `${p.tagColor}12`,
                          color: p.tagColor,
                        }}
                      >
                        {p.tag}
                      </span>
                    </div>
                    <p
                      className="text-[11px] text-[#8b9eb0] leading-relaxed"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {p.desc}
                    </p>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    className="text-[#8b9eb0] flex-shrink-0 mt-1"
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
                      <div className="px-4 pb-5 pt-0">
                        <div className="border-t border-[rgba(28,46,62,0.06)] pt-4 flex flex-col gap-3">
                          <div
                            className="rounded-xl p-3 flex items-center gap-3"
                            style={{
                              backgroundColor: `${p.tagColor}08`,
                            }}
                          >
                            <span
                              className="text-[9px] text-[#8b9eb0] uppercase tracking-wider"
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 600,
                              }}
                            >
                              Best time:
                            </span>
                            <span
                              className="text-[12px] text-[#1C2E3E]"
                              style={{
                                fontFamily: "'DM Sans', sans-serif",
                                fontWeight: 700,
                              }}
                            >
                              {p.when}
                            </span>
                          </div>

                          <p
                            className="text-[11px] text-[#1C2E3E]/60 leading-relaxed"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                          >
                            This suggestion is based on your recent exposure patterns. Results may vary — listen to what feels comfortable for you.
                          </p>
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

      {/* Export */}
      <button
        className="w-full py-4 border-2 border-dashed border-[rgba(28,46,62,0.12)] rounded-2xl flex items-center justify-center gap-2 text-[#8b9eb0] uppercase text-[11px] tracking-[0.15em] hover:bg-[#F5F2EC] hover:border-[#2619D0] hover:text-[#2619D0] transition-all"
        style={{ fontWeight: 700, fontFamily: "'Inter', sans-serif" }}
      >
        <Download className="size-4" />
        Export Weekly Summary
      </button>
    </div>
  );
}