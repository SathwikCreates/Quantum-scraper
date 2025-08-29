
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { HeartPulse } from "lucide-react";
import { JobProgressRing } from "./job-progress-ring";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


export type Job = {
  id: string;
  status: 'Queued' | 'Running' | 'Completed' | 'Failed';
  runtime_seconds: number | null;
  predicted_runtime_seconds: number | null;
};

export type Predictions = {
    predicted_load: 'low' | 'medium' | 'high';
    predicted_avg_wait_seconds: number;
    predicted_success_rate: number;
};

type QuantumOrbProps = {
  backend: string;
  jobs: Job[];
  predictions: Predictions;
};

const HeartbeatWaveform = ({ status }: { status: 'low' | 'medium' | 'high' }) => {
    const colorMap = {
        low: 'hsl(var(--chart-1))',
        medium: 'hsl(var(--primary))',
        high: 'hsl(var(--destructive))',
    };
    const color = colorMap[status];

    return (
        <svg
            width="80"
            height="20"
            viewBox="0 0 80 20"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute -bottom-1"
        >
            <path
                d="M0 10 H20 L25 5 L30 15 L35 2 L40 18 L45 10 H80"
                stroke={color}
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="heartbeat-path"
            />
            <style jsx>{`
                .heartbeat-path {
                    stroke-dasharray: 100;
                    stroke-dashoffset: 100;
                    animation: draw-heartbeat 2s linear infinite;
                    filter: drop-shadow(0 0 3px ${color});
                }
                @keyframes draw-heartbeat {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
            `}</style>
        </svg>
    );
};


export function QuantumOrb({ backend, jobs, predictions }: QuantumOrbProps) {
  const [completedJobIds, setCompletedJobIds] = useState<Set<string>>(new Set());
  const [pulse, setPulse] = useState(false);

  const { queuedJobs, runningJobs, runningJobsCount } = useMemo(() => {
    const queuedJobs = jobs.filter(j => j.status === 'Queued');
    const runningJobs = jobs.filter(j => j.status === 'Running');
    return { queuedJobs, runningJobs, runningJobsCount: runningJobs.length };
  }, [jobs]);

  useEffect(() => {
    const justCompleted = jobs.some(job => 
        job.status === 'Completed' && !completedJobIds.has(job.id)
    );

    if (justCompleted) {
        setPulse(true);
        setTimeout(() => setPulse(false), 1200);
    }
    
    const currentCompletedIds = new Set(jobs.filter(j => j.status === 'Completed').map(j => j.id));
    setCompletedJobIds(currentCompletedIds);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs]);

  const orbSize = 120;
  const jobSize = 18; // Increased to accommodate the ring
  const radius = orbSize / 2 + jobSize * 1.5;

  const healthConfig = {
    low: { color: 'hsl(var(--chart-1))', duration: 4 }, // Greenish-Teal, slow pulse
    medium: { color: 'hsl(var(--primary))', duration: 2 }, // Orange, medium pulse
    high: { color: 'hsl(var(--destructive))', duration: 0.8 }, // Red, fast pulse
  }
  const { color: healthColor, duration: pulseDuration } = healthConfig[predictions.predicted_load];

  const allVisibleJobs = useMemo(() => {
    return jobs.filter(j => j.status === 'Queued' || j.status === 'Running');
  }, [jobs]);


  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative flex flex-col items-center justify-center cursor-pointer" style={{ minWidth: radius * 2.2, minHeight: radius * 2.2 }}>
            <div className="relative" style={{ width: orbSize, height: orbSize }}>

              <motion.div
                className="w-full h-full rounded-full"
                style={{
                    backgroundColor: `${healthColor.replace(')', ', 0.3)')}`, // Make color transparent
                    boxShadow: `0 0 20px 5px ${healthColor.replace(')', ', 0.7)')}, inset 0 0 15px 2px ${healthColor.replace(')', ', 0.6)')}`,
                }}
                animate={{
                  scale: pulse ? [1, 1.2, 1] : [1, 1.05, 1],
                  boxShadow: pulse 
                    ? [
                        `0 0 40px 10px ${healthColor.replace(')', ', 0.8)')}`, 
                        '0 0 70px 30px hsl(120 100% 70% / 0.7)',
                        `0 0 40px 10px ${healthColor.replace(')', ', 0.8)')}`
                      ]
                    : [
                        `0 0 40px 10px ${healthColor.replace(')', ', 0.8)')}`, 
                        `0 0 50px 15px ${healthColor.replace(')', ', 0.9)')}`, 
                        `0 0 40px 10px ${healthColor.replace(')', ', 0.8)')}`
                      ],
                }}
                transition={{ 
                    duration: pulse ? 1.2 : pulseDuration, 
                    repeat: pulse ? 0 : Infinity,
                    ease: pulse ? 'easeOut' : 'easeInOut',
                    repeatType: 'reverse'
                }}
              />
              
              <div className="absolute top-0 left-0 w-full h-full" style={{ transform: "translateZ(0)" }}>
                  <AnimatePresence>
                      {allVisibleJobs.map((job, index) => {
                          const angle = (index / (allVisibleJobs.length || 1)) * 2 * Math.PI;
                          const orbitRadius = radius * (1 + (index % 3) * 0.1);
                          
                          return (
                              <motion.div
                                  key={job.id}
                                  className="absolute top-1/2 left-1/2"
                                  style={{
                                      x: '-50%',
                                      y: '-50%',
                                  }}
                                  initial={{ rotate: 0 }}
                                  animate={{
                                      rotate: 360,
                                  }}
                                  transition={{
                                      duration: 10 + (index % 3) * 5,
                                      ease: 'linear',
                                      repeat: Infinity,
                                  }}
                                  exit={{
                                      scale: 0,
                                      opacity: 0,
                                      transition: { duration: 0.5 }
                                  }}
                              >
                                  <div style={{ transform: `translate(${orbitRadius}px, 0px)` }}>
                                    <JobProgressRing job={job} />
                                  </div>
                              </motion.div>
                          );
                      })}
                  </AnimatePresence>
              </div>
            </div>
            
            <p className="absolute -bottom-6 text-sm font-semibold text-foreground whitespace-nowrap">{backend}</p>
            <div className="absolute -bottom-12 h-6 w-full flex items-center justify-center">
              <HeartbeatWaveform status={predictions.predicted_load} />
            </div>
            <p className="absolute -bottom-[68px] text-xs text-muted-foreground whitespace-nowrap">{`Q:${queuedJobs.length} R:${runningJobsCount}`}</p>
          </div>
        </TooltipTrigger>
        <TooltipContent>
            <div className="space-y-1 p-1 text-foreground">
                <h4 className="font-bold text-primary">{backend} - Forecast</h4>
                <p>Predicted Load: <span className="font-semibold" style={{ color: healthColor }}>{predictions.predicted_load.toUpperCase()}</span></p>
                <p>Est. Wait Time: <span className="font-semibold">{predictions.predicted_avg_wait_seconds}s</span></p>
                <p>Est. Success Rate: <span className="font-semibold">{(predictions.predicted_success_rate * 100).toFixed(1)}%</span></p>
            </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
