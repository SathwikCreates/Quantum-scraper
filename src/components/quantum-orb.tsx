"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

type Job = {
  id: string;
  status: 'Queued' | 'Running' | 'Completed' | 'Failed';
};

type QuantumOrbProps = {
  backend: string;
  jobs: Job[];
};

export function QuantumOrb({ backend, jobs }: QuantumOrbProps) {
  const [completedJobIds, setCompletedJobIds] = useState<Set<string>>(new Set());
  const [pulse, setPulse] = useState(false);

  // Memoize job counts to prevent recalculations on every render
  const { queuedJobs, runningJobsCount } = useMemo(() => {
    const queuedJobs = jobs.filter(j => j.status === 'Queued');
    const runningJobsCount = jobs.filter(j => j.status === 'Running').length;
    return { queuedJobs, runningJobsCount };
  }, [jobs]);

  useEffect(() => {
    const justCompleted = jobs.some(job => 
        job.status === 'Completed' && !completedJobIds.has(job.id)
    );

    if (justCompleted) {
        setPulse(true);
        setTimeout(() => setPulse(false), 1200); // Duration of the pulse animation
    }
    
    // Update the set of completed jobs for the next check
    const currentCompletedIds = new Set(jobs.filter(j => j.status === 'Completed').map(j => j.id));
    setCompletedJobIds(currentCompletedIds);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs]);

  const orbSize = 120;
  const jobSize = 14;
  const radius = orbSize / 2 + jobSize * 1.5;

  const dynamicOrbBrightness = Math.min(1, 0.3 + (runningJobsCount * 0.2));

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ minWidth: radius * 2.2, minHeight: radius * 2.2 }}>
      <div className="relative" style={{ width: orbSize, height: orbSize }}>

        {/* Backend Orb */}
        <motion.div
          className="w-full h-full rounded-full bg-accent/30"
          style={{
              boxShadow: `0 0 20px 5px hsl(var(--accent) / ${dynamicOrbBrightness}), inset 0 0 15px 2px hsl(var(--accent) / ${dynamicOrbBrightness * 0.8})`,
          }}
          animate={{
            scale: pulse ? [1, 1.2, 1] : [1, 1.05, 1],
            boxShadow: pulse 
              ? [
                  `0 0 20px 5px hsl(var(--accent) / ${dynamicOrbBrightness})`, 
                  '0 0 50px 20px hsl(120 100% 50% / 0.7)', // Green pulse
                  `0 0 20px 5px hsl(var(--accent) / ${dynamicOrbBrightness})`
                ]
              : [
                  `0 0 20px 5px hsl(var(--accent) / ${dynamicOrbBrightness})`, 
                  `0 0 25px 8px hsl(var(--accent) / ${dynamicOrbBrightness + 0.1})`, 
                  `0 0 20px 5px hsl(var(--accent) / ${dynamicOrbBrightness})`
                ],
          }}
          transition={{ 
              duration: pulse ? 1.2 : 5, 
              repeat: pulse ? 0 : Infinity,
              ease: pulse ? 'easeOut' : 'easeInOut',
              repeatType: 'reverse'
          }}
        />
        
        {/* Orbiting Jobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <AnimatePresence>
                {queuedJobs.map((job, index) => {
                    const angle = (index / queuedJobs.length) * 2 * Math.PI;
                    const orbitRadius = radius * (1 + (index % 3) * 0.1); // Stagger orbits
                    
                    return (
                        <motion.div
                            key={job.id}
                            className="absolute w-3.5 h-3.5 rounded-full"
                            style={{
                                backgroundColor: 'hsl(var(--primary))',
                                boxShadow: '0 0 10px 1px hsl(var(--primary) / 0.8)',
                                transformOrigin: `${orbitRadius}px center`,
                            }}
                            initial={{
                                x: -jobSize/2,
                                y: -jobSize/2,
                                rotate: angle * (180 / Math.PI),
                            }}
                            animate={{
                                rotate: angle * (180 / Math.PI) + 360,
                            }}
                            exit={{
                                scale: 0,
                                opacity: 0,
                                transition: { duration: 0.5 }
                            }}
                            transition={{
                                duration: 10 + (index % 3) * 2, // Vary rotation speed
                                ease: 'linear',
                                repeat: Infinity,
                            }}
                        >
                             <div style={{ transform: `translateX(${orbitRadius}px)` }} className="w-full h-full rounded-full" />
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
      </div>
      
      <p className="absolute -bottom-6 text-sm font-semibold text-foreground whitespace-nowrap">{backend}</p>
      <p className="absolute -bottom-12 text-xs text-muted-foreground whitespace-nowrap">{`Q:${queuedJobs.length} R:${runningJobsCount}`}</p>
    </div>
  );
}