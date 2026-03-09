import { motion } from "motion/react";
import { useHealth } from "../context/HealthContext";

export function VisualLoadChart() {
  const { state } = useHealth();

  // Mock data for the 24-hour cycle (hourly bars)
  const hourlyData = [
    { hour: "6am", val: 10, s: "Comfortable" },
    { hour: "7am", val: 15, s: "Comfortable" },
    { hour: "8am", val: 12, s: "Comfortable" },
    { hour: "9am", val: 18, s: "Comfortable" },
    { hour: "10am", val: 25, s: "Building Strain" },
    { hour: "11am", val: 35, s: "Building Strain" },
    { hour: "12pm", val: 42, s: "Building Strain" },
    { hour: "1pm", val: 38, s: "Building Strain" },
    { hour: "2pm", val: 45, s: "Sensitive" },
    { hour: "3pm", val: 55, s: "Sensitive" },
    { hour: "4pm", val: 62, s: "Sensitive" },
    { hour: "5pm", val: 58, s: "Sensitive" }, 
    { hour: "6pm", val: 50, s: "Building Strain" },
    { hour: "7pm", val: 45, s: "Building Strain" },
    { hour: "8pm", val: 35, s: "Building Strain" },
    { hour: "9pm", val: 20, s: "Comfortable" },
    { hour: "10pm", val: 15, s: "Comfortable" },
    { hour: "11pm", val: 10, s: "Comfortable" },
    { hour: "12am", val: 5, s: "Comfortable" },
    { hour: "1am", val: 5, s: "Comfortable" },
    { hour: "2am", val: 5, s: "Comfortable" },
    { hour: "3am", val: 5, s: "Comfortable" },
    { hour: "4am", val: 5, s: "Comfortable" },
    { hour: "5am", val: 5, s: "Comfortable" },
  ];

  const getColor = (s: string) => {
    switch (s) {
      case "Comfortable": return "bg-[#1edd00]";
      case "Building Strain": return "bg-[#A8854A]";
      case "Sensitive": return "bg-[#B8724A]";
      case "Recovering": return "bg-[#4A8FA5]";
      default: return "bg-[#EAE7E1]";
    }
  };

  return (
    <div className="w-full h-20 flex items-end justify-between gap-1">
      {hourlyData.map((d, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${d.val}%` }}
          transition={{ duration: 1, delay: i * 0.02 }}
          className={`flex-1 rounded-t-[2px] opacity-40 transition-all duration-300 ${getColor(d.s)} ${
            i === 11 ? "opacity-100 shadow-[0_0_10px_rgba(38,25,208,0.5)] z-10 scale-x-125" : ""
          }`}
        />
      ))}
    </div>
  );
}