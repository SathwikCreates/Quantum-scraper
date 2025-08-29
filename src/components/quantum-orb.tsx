
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { HeartPulse } from "lucide-react";

type Job = {
  id: string;
  status: 'Queued' | 'Running' | 'Completed' | 'Failed';
};

type QuantumOrbProps = {
  backend: string;
  jobs: Job[];
};

type HealthStatus = 'healthy' | 'moderate' | 'unstable';

const HeartbeatWaveform = ({ status }: { status: HealthStatus }) => {
    const colorMap: Record<HealthStatus, string> = {
        healthy: 'hsl(var(--chart-1))',
        moderate: 'hsl(var(--primary))',
        unstable: 'hsl(var(--destructive))',
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


export function QuantumOrb({ backend, jobs }: QuantumOrbProps) {
  const [completedJobIds, setCompletedJobIds] = useState<Set<string>>(new Set());
  const [pulse, setPulse] = useState(false);

  const { queuedJobs, runningJobsCount, health } = useMemo(() => {
    const queuedJobs = jobs.filter(j => j.status === 'Queued');
    const runningJobsCount = jobs.filter(j => j.status === 'Running').length;
    const failedJobsCount = jobs.filter(j => j.status === 'Failed').length;

    let currentHealth: HealthStatus = 'healthy';
    if (failedJobsCount > 0 || queuedJobs.length > 15) {
        currentHealth = 'unstable';
    } else if (queuedJobs.length > 5) {
        currentHealth = 'moderate';
    }

    return { queuedJobs, runningJobsCount, health: currentHealth };
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
  const jobSize = 14;
  const radius = orbSize / 2 + jobSize * 1.5;

  const healthConfig: Record<HealthStatus, { color: string; duration: number }> = {
    healthy: { color: 'hsl(var(--chart-1))', duration: 4 }, // Greenish-Teal, slow pulse
    moderate: { color: 'hsl(var(--primary))', duration: 2 }, // Orange, medium pulse
    unstable: { color: 'hsl(var(--destructive))', duration: 0.8 }, // Red, fast pulse
  }
  const { color: healthColor, duration: pulseDuration } = healthConfig[health];

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ minWidth: radius * 2.2, minHeight: radius * 2.2 }}>
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
                  `0 0 20px 5px ${healthColor.replace(')', ', 0.7)')}`, 
                  '0 0 50px 20px hsl(120 100% 50% / 0.7)',
                  `0 0 20px 5px ${healthColor.replace(')', ', 0.7)')}`
                ]
              : [
                  `0 0 20px 5px ${healthColor.replace(')', ', 0.7)')}`, 
                  `0 0 25px 8px ${healthColor.replace(')', ', 0.8)')}`, 
                  `0 0 20px 5px ${healthColor.replace(')', ', 0.7)')}`
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
                {queuedJobs.map((job, index) => {
                    const angle = (index / (queuedJobs.length || 1)) * 2 * Math.PI;
                    const orbitRadius = radius * (1 + (index % 3) * 0.1);
                    const initialX = Math.cos(angle) * orbitRadius;
                    const initialY = Math.sin(angle) * orbitRadius;
                    
                    return (
                        <motion.div
                            key={job.id}
                            className="absolute top-1/2 left-1/2"
                            style={{
                                x: '-50%',
                                y: '-50%',
                            }}
                            initial={{ x: `${initialX}px`, y: `${initialY}px`, rotate: 0 }}
                            animate={{
                                rotate: 360,
                                x: `${initialX}px`,
                                y: `${initialY}px`,
                            }}
                            transition={{
                                duration: 10 + (index % 3) * 2,
                                ease: 'linear',
                                repeat: Infinity,
                            }}
                            exit={{
                                scale: 0,
                                opacity: 0,
                                transition: { duration: 0.5 }
                            }}
                        >
                             <motion.div
                                className="w-3.5 h-3.5 rounded-full"
                                style={{
                                    backgroundColor: 'hsl(var(--primary))',
                                    boxShadow: '0 0 10px 1px hsl(var(--primary) / 0.8)',
                                }}
                             />
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
      </div>
      
      <p className="absolute -bottom-6 text-sm font-semibold text-foreground whitespace-nowrap">{backend}</p>
      <div className="absolute -bottom-12 h-6 w-full flex items-center justify-center">
        <HeartbeatWaveform status={health} />
      </div>
      <p className="absolute -bottom-[68px] text-xs text-muted-foreground whitespace-nowrap">{`Q:${queuedJobs.length} R:${runningJobsCount}`}</p>
    </div>
  );
}
