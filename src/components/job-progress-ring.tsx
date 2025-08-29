
"use client";

import { motion } from "framer-motion";
import { Job } from "./quantum-orb";

type JobProgressRingProps = {
  job: Job;
};

export function JobProgressRing({ job }: JobProgressRingProps) {
  const size = 28;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  let progress = 0;
  let color = "hsl(var(--muted))";
  let shadowColor = "hsl(var(--muted) / 0.5)";
  let isPulsing = false;

  switch (job.status) {
    case "Running":
      if (job.runtime_seconds != null && job.predicted_runtime_seconds != null && job.predicted_runtime_seconds > 0) {
        progress = Math.min(100, (job.runtime_seconds / job.predicted_runtime_seconds) * 100);
      }
      color = "hsl(var(--accent))";
      shadowColor = "hsl(var(--accent) / 0.7)";
      break;
    case "Completed":
      progress = 100;
      color = "hsl(var(--chart-1))";
      shadowColor = "hsl(var(--chart-1) / 0.7)";
      break;
    case "Failed":
      progress = 100;
      color = "hsl(var(--destructive))";
      shadowColor = "hsl(var(--destructive) / 0.7)";
      break;
    case "Queued":
      progress = 100; // Full circle for pulsing effect
      color = "hsl(var(--primary))";
      shadowColor = "hsl(var(--primary) / 0.7)";
      isPulsing = true;
      break;
  }

  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--muted) / 0.2)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ filter: `drop-shadow(0 0 3px ${shadowColor})` }}
          animate={isPulsing ? { opacity: [0.3, 1, 0.3] } : { opacity: 1 }}
          transition={isPulsing ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.5 }}
        />
      </svg>
       {/* Central Dot */}
      <div 
        className="absolute rounded-full"
        style={{
            top: '50%',
            left: '50%',
            width: '8px',
            height: '8px',
            transform: 'translate(-50%, -50%)',
            background: color,
            boxShadow: `0 0 6px 1px ${shadowColor}`
        }}
      />
    </div>
  );
}
