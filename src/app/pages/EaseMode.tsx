import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Wifi,
  WifiOff,
  Lightbulb,
  Monitor,
  Moon,
  Sun,
  Sunrise,
  BedDouble,
  UtensilsCrossed,
  Sofa,
  Zap,
  ChevronDown,
  Check,
  AlertTriangle,
  Info,
  Plus,
  ToggleLeft,
  ToggleRight,
  Clock,
  Sparkles,
} from "lucide-react";
import { useHealth } from "../context/HealthContext";

/* ─── Data ────────────────────────────────────────────────── */

const HUBS = [
  { id: "hue", name: "Philips Hue", rooms: 4, connected: true },
  { id: "lifx", name: "LIFX", rooms: 0, connected: false },
  { id: "homekit", name: "Apple HomeKit", rooms: 0, connected: false },
  { id: "google", name: "Google Home", rooms: 0, connected: false },
];

type Scene = {
  name: string;
  tagline: string;
  brightness: number;
  kelvin: number;
  warmHex: string;
  accent: string;
  reasoning: string;
  icon: React.ReactNode;
};

const SCENES: Record<string, Scene> = {
  Low: {
    name: "Energise",
    tagline: "Bright & cool — complement your low exposure",
    brightness: 85,
    kelvin: 5500,
    warmHex: "#E8F5FF",
    accent: "#4A8FA5",
    reasoning:
      "You've taken in relatively little light today. Brighter, cooler home lights can support alertness and pair well with natural daylight.",
    icon: <Sunrise className="size-5" />,
  },
  Moderate: {
    name: "Balance",
    tagline: "Neutral light — maintain a steady rhythm",
    brightness: 60,
    kelvin: 4000,
    warmHex: "#FFFBEF",
    accent: "#A8854A",
    reasoning:
      "Your exposure is within a comfortable range. Neutral-toned lighting keeps your daily rhythm steady without adding unnecessary load.",
    icon: <Sun className="size-5" />,
  },
  High: {
    name: "Wind Down",
    tagline: "Warm & dim — ease the accumulated load",
    brightness: 32,
    kelvin: 2700,
    warmHex: "#FFF3DC",
    accent: "#B8724A",
    reasoning:
      "You've built up significant light exposure today. Warmer, dimmer home lights help signal wind-down and give your visual system a break.",
    icon: <Lightbulb className="size-5" />,
  },
  Resting: {
    name: "Night Mode",
    tagline: "Minimal amber — support rest & recovery",
    brightness: 12,
    kelvin: 2200,
    warmHex: "#FFE8BB",
    accent: "#2619D0",
    reasoning:
      "Your system is in recovery mode. Very dim, amber-tinted lights support natural melatonin patterns and help prepare you for sleep.",
    icon: <Moon className="size-5" />,
  },
};

const SCHEDULE_PRESETS = [
  {
    id: "morning",
    label: "Morning Boost",
    time: "7:00 AM",
    desc: "Bright cool light as you start your day",
    icon: <Sunrise className="size-4" />,
    state: "Low",
  },
  {
    id: "afternoon",
    label: "Afternoon Balance",
    time: "2:00 PM",
    desc: "Neutral blend mid-day",
    icon: <Sun className="size-4" />,
    state: "Moderate",
  },
  {
    id: "evening",
    label: "Evening Wind-Down",
    time: "7:30 PM",
    desc: "Warm dimming as exposure accumulates",
    icon: <Moon className="size-4" />,
    state: "High",
  },
];

const INITIAL_ROOMS = [
  {
    id: "living",
    name: "Living Room",
    icon: <Sofa className="size-4" />,
    on: true,
    brightness: 65,
    kelvin: 4000,
  },
  {
    id: "office",
    name: "Home Office",
    icon: <Monitor className="size-4" />,
    on: true,
    brightness: 78,
    kelvin: 5000,
  },
  {
    id: "bedroom",
    name: "Bedroom",
    icon: <BedDouble className="size-4" />,
    on: false,
    brightness: 28,
    kelvin: 2700,
  },
  {
    id: "kitchen",
    name: "Kitchen",
    icon: <UtensilsCrossed className="size-4" />,
    on: true,
    brightness: 70,
    kelvin: 4200,
  },
];

/* ─── Helpers ─────────────────────────────────────────────── */

function kelvinLabel(k: number) {
  if (k >= 5000) return "Cool White";
  if (k >= 3500) return "Neutral";
  if (k >= 2900) return "Warm White";
  return "Amber";
}

function kelvinToColor(k: number) {
  // rough interpolation cool→warm
  const t = Math.max(0, Math.min(1, (k - 2000) / 4000));
  const r = Math.round(255);
  const g = Math.round(180 + 75 * t);
  const b = Math.round(20 + 235 * t);
  return `rgb(${r},${g},${b})`;
}

/* ─── Sub-components ──────────────────────────────────────── */

function HubChip({
  hub,
  onToggle,
}: {
  hub: (typeof HUBS)[0];
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 px-3 py-2 rounded-2xl border transition-all ${
        hub.connected
          ? "bg-[#2619D0]/6 border-[#2619D0]/20 text-[#2619D0]"
          : "bg-white border-[rgba(28,46,62,0.1)] text-[#8b9eb0]"
      }`}
    >
      <div
        className={`size-1.5 rounded-full ${
          hub.connected ? "bg-[#5eb53e]" : "bg-[#8b9eb0]/40"
        }`}
      />
      <span
        className="text-[11px]"
        style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
      >
        {hub.name}
      </span>
      {hub.connected && (
        <span
          className="text-[10px] text-[#5eb53e]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {hub.rooms} rooms
        </span>
      )}
      {!hub.connected && <Plus className="size-3" />}
    </button>
  );
}

type RoomState = {
  id: string;
  name: string;
  icon: React.ReactNode;
  on: boolean;
  brightness: number;
  kelvin: number;
};

function RoomCard({
  room,
  onChange,
}: {
  room: RoomState;
  onChange: (patch: Partial<RoomState>) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const warmColor = kelvinToColor(room.kelvin);

  return (
    <motion.div
      layout
      className="bg-white rounded-[20px] border border-[rgba(28,46,62,0.08)] shadow-[0_2px_12px_rgba(28,46,62,0.05)] overflow-hidden"
    >
      {/* Header row */}
      <div className="flex items-center gap-3 p-4">
        {/* Light orb */}
        <motion.div
          animate={{
            backgroundColor: room.on ? warmColor : "#EAE7E1",
            boxShadow: room.on
              ? `0 0 16px ${warmColor}60`
              : "none",
          }}
          transition={{ duration: 0.5 }}
          className="size-10 rounded-2xl flex items-center justify-center flex-shrink-0"
        >
          <span
            className={`transition-colors ${
              room.on ? "text-[#1C2E3E]" : "text-[#8b9eb0]"
            }`}
          >
            {room.icon}
          </span>
        </motion.div>

        <div className="flex-1 min-w-0">
          <p
            className="text-[13px] text-[#1C2E3E]"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
          >
            {room.name}
          </p>
          <p
            className="text-[10px] text-[#8b9eb0]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {room.on
              ? `${room.brightness}% · ${kelvinLabel(room.kelvin)}`
              : "Off"}
          </p>
        </div>

        {/* On/off toggle */}
        <button
          onClick={() => onChange({ on: !room.on })}
          className="flex-shrink-0 transition-colors"
        >
          {room.on ? (
            <ToggleRight
              className="size-8 transition-colors"
              style={{ color: "#2619D0" }}
            />
          ) : (
            <ToggleLeft className="size-8 text-[#C5BFB5]" />
          )}
        </button>

        {/* Expand */}
        <button
          onClick={() => setExpanded((p) => !p)}
          className="ml-1 flex-shrink-0"
        >
          <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
            <ChevronDown className="size-4 text-[#8b9eb0]" />
          </motion.div>
        </button>
      </div>

      {/* Expanded sliders */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              className={`px-4 pb-4 flex flex-col gap-4 transition-opacity ${
                room.on ? "opacity-100" : "opacity-40 pointer-events-none"
              }`}
            >
              <div className="h-px bg-[rgba(28,46,62,0.06)]" />

              {/* Brightness */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] text-[#8b9eb0] uppercase tracking-[0.1em]"
                    style={{ fontWeight: 700, fontFamily: "'Inter', sans-serif" }}
                  >
                    Brightness
                  </span>
                  <span
                    className="text-[12px] text-[#1C2E3E]"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}
                  >
                    {room.brightness}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={room.brightness}
                  onChange={(e) =>
                    onChange({ brightness: Number(e.target.value) })
                  }
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: "#2619D0", background: "#EAE7E1" }}
                />
              </div>

              {/* Color Temperature */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] text-[#8b9eb0] uppercase tracking-[0.1em]"
                    style={{ fontWeight: 700, fontFamily: "'Inter', sans-serif" }}
                  >
                    Color Temp
                  </span>
                  <span
                    className="text-[12px] text-[#1C2E3E]"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}
                  >
                    {kelvinLabel(room.kelvin)}
                  </span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="6500"
                  step="100"
                  value={room.kelvin}
                  onChange={(e) => onChange({ kelvin: Number(e.target.value) })}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: "#FFAA01", background: "#EAE7E1" }}
                />
                <div className="flex justify-between">
                  <span
                    className="text-[9px] text-[#8b9eb0]"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Amber
                  </span>
                  <span
                    className="text-[9px] text-[#8b9eb0]"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Cool White
                  </span>
                </div>
                {/* Color strip */}
                <div
                  className="h-5 rounded-xl border border-[rgba(28,46,62,0.06)]"
                  style={{
                    background:
                      "linear-gradient(to right, #FF8C00, #FFD080, #FFFDE8, #E8F4FF)",
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Main Page ───────────────────────────────────────────── */

export function EaseMode() {
  const { load, state, luxHours } = useHealth();

  const [hubs, setHubs] = useState(HUBS);
  const [rooms, setRooms] = useState<RoomState[]>(INITIAL_ROOMS);
  const [autoAdapt, setAutoAdapt] = useState(true);
  const [applied, setApplied] = useState(false);
  const [activeSchedule, setActiveSchedule] = useState<string | null>(
    "evening"
  );
  const [showReasoning, setShowReasoning] = useState(false);
  const [connectedToast, setConnectedToast] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [pendingRoomUpdate, setPendingRoomUpdate] = useState<{
    id: string;
    patch: Partial<RoomState>;
  } | null>(null);
  const [confirmedRoomIds, setConfirmedRoomIds] = useState<Set<string>>(
    new Set()
  );

  const scene = SCENES[state];

  const connectedHub = hubs.find((h) => h.connected);

  function handleApplyScene() {
    setApplied(true);
    setRooms((prev) =>
      prev.map((r) =>
        r.on
          ? {
              ...r,
              brightness: scene.brightness,
              kelvin: scene.kelvin,
            }
          : r
      )
    );
    setTimeout(() => setApplied(false), 2400);
  }

  function updateRoom(id: string, patch: Partial<RoomState>) {
    if (patch.brightness !== undefined || patch.kelvin !== undefined) {
      const room = rooms.find((r) => r.id === id);
      if (room && !confirmedRoomIds.has(id)) {
        const newBrightness = patch.brightness ?? room.brightness;
        const newKelvin = patch.kelvin ?? room.kelvin;
        if (newBrightness > 50 || newKelvin >= 5000) {
          setPendingRoomUpdate({ id, patch });
          setShowWarning(true);
          return;
        }
      }
    }
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
    );
  }

  function confirmWarning() {
    if (pendingRoomUpdate) {
      setRooms((prev) =>
        prev.map((r) =>
          r.id === pendingRoomUpdate.id
            ? { ...r, ...pendingRoomUpdate.patch }
            : r
        )
      );
      setConfirmedRoomIds(
        (prev) => new Set(prev).add(pendingRoomUpdate.id)
      );
    }
    setShowWarning(false);
    setPendingRoomUpdate(null);
  }

  function rejectWarning() {
    setShowWarning(false);
    setPendingRoomUpdate(null);
  }

  function toggleHub(id: string) {
    setHubs((prev) =>
      prev.map((h) =>
        h.id === id
          ? { ...h, connected: !h.connected, rooms: h.connected ? 0 : 4 }
          : h
      )
    );
    // Show green toast only when connecting
    const hub = hubs.find((h) => h.id === id);
    if (hub && !hub.connected) {
      setConnectedToast(hub.name);
      setTimeout(() => setConnectedToast(null), 2800);
    }
  }

  return (
    <div className="flex flex-col gap-6 px-7 pt-[83px] pb-28">

      {/* ── Connected Toast ── */}
      <AnimatePresence>
        {connectedToast && (
          <motion.div
            key="hub-toast"
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="fixed top-12 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.12)]"
            style={{ background: "#5eb53e", minWidth: 220, maxWidth: 320 }}
          >
            <div className="size-6 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0">
              <Check className="size-3.5 text-white" strokeWidth={3} />
            </div>
            <div>
              <p
                className="text-white text-[13px]"
                style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 700 }}
              >
                {connectedToast} connected
              </p>
              <p
                className="text-white/80 text-[10px]"
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
              >
                4 rooms now syncing with Lux
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <header className="flex flex-col gap-1">
        <p
          className="text-[#1C2E3E] text-[32px]"
          style={{
            fontFamily: "'Manuale', serif",
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "36px",
          }}
        >Smart Lighting</p>
        <p
          className="text-[#8b9eb0] text-[13px]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Adjusts your home lights based on today's light exposure
        </p>
      </header>

      {/* ── Hubs ── */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p
            className="text-[#1C2E3E] text-[13px]"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontVariationSettings: "'opsz' 14",
            }}
          >
            Connected Hubs
          </p>
          {connectedHub && (
            <span className="flex items-center gap-1.5">
              <div className="size-1.5 rounded-full bg-[#5eb53e]" />
              <span
                className="text-[10px] text-[#5eb53e]"
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
              >
                {connectedHub.name} active
              </span>
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {hubs.map((hub) => (
            <HubChip key={hub.id} hub={hub} onToggle={() => toggleHub(hub.id)} />
          ))}
        </div>
      </section>

      {/* ── Adaptive Scene Recommendation ── */}
      <section className="relative overflow-hidden rounded-[24px] border border-[rgba(28,46,62,0.08)] shadow-[0_4px_24px_rgba(28,46,62,0.08)]">
        {/* Ambient glow background */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0.6, 0.85, 0.6] }}
          transition={{ duration: 5, repeat: Infinity }}
          style={{
            background: `radial-gradient(ellipse at 60% 30%, ${scene.warmHex} 0%, #ffffff 70%)`,
          }}
        />

        <div className="relative z-10 p-5 flex flex-col gap-4">
          {/* Scene label row */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] uppercase tracking-[0.15em]"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    color: scene.accent,
                  }}
                >
                  Recommended Scene
                </span>
              </div>
              <p
                className="text-[22px] text-[#1C2E3E]"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontVariationSettings: "'opsz' 14",
                }}
              >
                {scene.name}
              </p>
              <p
                className="text-[11px] text-[#8b9eb0]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {scene.tagline}
              </p>
            </div>

            {/* Animated light icon */}
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.85, 1, 0.85],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="size-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: scene.warmHex, color: scene.accent }}
            >
              {scene.icon}
            </motion.div>
          </div>

          {/* Scene settings chips */}
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/60 rounded-xl border border-white/80">
              <div
                className="size-2 rounded-full"
                style={{ backgroundColor: scene.accent }}
              />
              <span
                className="text-[11px] text-[#1C2E3E]"
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
              >
                {scene.brightness}% brightness
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/60 rounded-xl border border-white/80">
              <div
                className="size-2 rounded-full"
                style={{
                  background: `linear-gradient(135deg, #FF8C00, ${kelvinToColor(scene.kelvin)})`,
                }}
              />
              <span
                className="text-[11px] text-[#1C2E3E]"
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
              >
                {kelvinLabel(scene.kelvin)}
              </span>
            </div>
          </div>

          {/* Exposure context */}
          <div className="bg-white/60 rounded-2xl p-3.5 flex flex-col gap-2.5 border border-white/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="size-3.5" style={{ color: scene.accent }} />
                <span
                  className="text-[11px] text-[#1C2E3E]"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
                >
                  Based on your exposure today
                </span>
              </div>
              <button
                onClick={() => setShowReasoning((p) => !p)}
                className="text-[10px]"
                style={{ color: scene.accent, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
              >
                {showReasoning ? "Less" : "Why?"}
              </button>
            </div>

            {/* Lux-hours bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-[rgba(28,46,62,0.08)] rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${load}%` }}
                  transition={{ duration: 1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: scene.accent }}
                />
              </div>
              <span
                className="text-[11px] text-[#1C2E3E] flex-shrink-0"
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}
              >
                {load}/100
              </span>
              <span
                className="text-[10px] text-[#8b9eb0] flex-shrink-0"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {luxHours.toLocaleString()} lux·h
              </span>
            </div>

            <AnimatePresence>
              {showReasoning && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-[10px] text-[#8b9eb0] leading-relaxed overflow-hidden"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {scene.reasoning}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Apply button */}
          <motion.button
            onClick={handleApplyScene}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all"
            style={{
              backgroundColor: applied ? "#5eb53e" : scene.accent,
              color: "white",
            }}
          >
            <AnimatePresence mode="wait">
              {applied ? (
                <motion.span
                  key="done"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Check className="size-4" />
                  <span
                    className="text-[12px] uppercase tracking-[0.12em]"
                    style={{ fontWeight: 700, fontFamily: "'Inter', sans-serif" }}
                  >
                    Applied to All Rooms
                  </span>
                </motion.span>
              ) : (
                <motion.span
                  key="apply"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Zap className="size-4" />
                  <span
                    className="text-[12px] uppercase tracking-[0.12em]"
                    style={{ fontWeight: 700, fontFamily: "'Inter', sans-serif" }}
                  >
                    Apply Scene to All Rooms
                  </span>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </section>

      {/* ── Auto-Adapt Toggle ── */}
      <section className="bg-white rounded-[20px] p-4 flex items-center gap-4 border border-[rgba(28,46,62,0.08)] shadow-[0_2px_12px_rgba(28,46,62,0.05)]">
        <div
          className="size-10 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: autoAdapt ? "#2619D0" : "#EAE7E1",
            color: autoAdapt ? "white" : "#8b9eb0",
          }}
        >
          <Sparkles className="size-4" />
        </div>
        <div className="flex-1">
          <p
            className="text-[13px] text-[#1C2E3E]"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
          >
            Auto-Adapt Lighting
          </p>
          <p
            className="text-[10px] text-[#8b9eb0]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {autoAdapt
              ? "Adjusts scene as your exposure changes"
              : "Scenes applied manually only"}
          </p>
        </div>
        <button onClick={() => setAutoAdapt((p) => !p)} className="flex-shrink-0">
          {autoAdapt ? (
            <ToggleRight className="size-9 text-[#2619D0]" />
          ) : (
            <ToggleLeft className="size-9 text-[#C5BFB5]" />
          )}
        </button>
      </section>

      {/* ── Room Controls ── */}
      <section className="flex flex-col gap-3">
        <p
          className="text-[#1C2E3E] text-[16px]"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontVariationSettings: "'opsz' 14",
          }}
        >
          Rooms
        </p>
        <div className="flex flex-col gap-2.5">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onChange={(patch) => updateRoom(room.id, patch)}
            />
          ))}
        </div>
      </section>

      {/* ── Scheduling ── */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-[#FFAA01]" />
          <p
            className="text-[#1C2E3E] text-[16px]"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontVariationSettings: "'opsz' 14",
            }}
          >
            Scheduled Scenes
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {SCHEDULE_PRESETS.map((preset) => {
            const s = SCENES[preset.state];
            const isActive = activeSchedule === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() =>
                  setActiveSchedule(isActive ? null : preset.id)
                }
                className={`w-full bg-white rounded-[16px] p-4 flex items-center gap-3.5 border transition-all ${
                  isActive
                    ? "border-[#2619D0]/25 shadow-[0_4px_16px_rgba(38,25,208,0.08)]"
                    : "border-[rgba(28,46,62,0.08)] shadow-[0_2px_12px_rgba(28,46,62,0.05)]"
                }`}
              >
                <div
                  className={`size-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${
                    isActive
                      ? "bg-[#2619D0] text-white"
                      : "bg-[#2619D0]/8 text-[#2619D0]"
                  }`}
                >
                  {preset.icon}
                </div>
                <div className="flex-1 text-left">
                  <p
                    className="text-[13px] text-[#1C2E3E]"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}
                  >
                    {preset.label}
                  </p>
                  <p
                    className="text-[10px] text-[#8b9eb0]"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {preset.desc}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span
                    className={`text-[12px] ${
                      isActive ? "text-[#2619D0]" : "text-[#8b9eb0]"
                    }`}
                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}
                  >
                    {preset.time}
                  </span>
                  <div
                    className="w-8 h-2 rounded-full"
                    style={{ backgroundColor: s.warmHex, border: `1px solid ${s.accent}30` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Tip footer ── */}
      <div className="bg-[#F9F8F6] border border-[#FFAA01]/20 rounded-[16px] p-4 flex items-start gap-3">
        <Lightbulb className="size-4 text-[#FFAA01] flex-shrink-0 mt-0.5" />
        <p
          className="text-[11px] text-[#1C2E3E]/70 leading-relaxed"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        > Lux reads your cumulative lux-hours and automatically selects a home lighting scene designed to complement — not add to — your light load. The lower your remaining capacity, the warmer and dimmer the lights should be.</p>
      </div>

      {/* Warning Overlay */}
      <AnimatePresence>
        {showWarning && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={rejectWarning}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-3rem)] max-w-sm bg-white rounded-[24px] p-6 shadow-[0_16px_64px_rgba(0,0,0,0.2)] flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-[#FFAA01]/15 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="size-5 text-[#FFAA01]" />
                </div>
                <p
                  className="text-[16px] text-[#1C2E3E]"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700,
                  }}
                >
                  Caution
                </p>
              </div>
              <p
                className="text-[13px] text-[#1C2E3E]/80 leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Going past 50% brightness and neutral temperature is not
                advised. Are you sure you want to continue?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={rejectWarning}
                  className="flex-1 py-3 rounded-2xl border border-[rgba(28,46,62,0.12)] bg-white text-[#1C2E3E] text-[13px]"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  No
                </button>
                <button
                  onClick={confirmWarning}
                  className="flex-1 py-3 rounded-2xl bg-[#FFAA01] text-white text-[13px]"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  Yes
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}