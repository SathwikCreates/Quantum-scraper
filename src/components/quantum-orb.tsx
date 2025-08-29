"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

type Job = {
  id: string;
  status: 'Queued' | 'Running' | 'Completed' | 'Failed';
};

type QuantumOrbProps = {
  backend: string;
  jobs: Job[];
};

export function QuantumOrb({ backend, jobs }: QuantumOrbProps) {
  const [completedJobs, setCompletedJobs] = useState<Set<string>>(new Set());
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const currentCompleted = new Set(jobs.filter(j => j.status === 'Completed').map(j => j.id));
    
    jobs.forEach(job => {
      if (job.status === 'Completed' && !completedJobs.has(job.id)) {
        setPulse(true);
        setTimeout(() => setPulse(false), 1000);
      }
    });

    setCompletedJobs(currentCompleted);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs]);

  const orbSize = 120;
  const jobSize = 14;
  const radius = orbSize / 2 + jobSize * 1.5;

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: orbSize, height: orbSize, minWidth: radius * 2, minHeight: radius * 2 }}>
      {/* Backend Orb */}
      <motion.div
        className="w-full h-full rounded-full bg-accent/30"
        style={{
            boxShadow: '0 0 20px 5px hsl(var(--accent) / 0.4), inset 0 0 15px 2px hsl(var(--accent) / 0.3)',
        }}
        animate={{
          scale: pulse ? [1, 1.2, 1] : [1, 1.05, 1],
          boxShadow: pulse 
            ? ['0 0 20px 5px hsl(var(--accent) / 0.4)', '0 0 40px 15px hsl(var(--accent) / 0.7)', '0 0 20px 5px hsl(var(--accent) / 0.4)']
            : ['0 0 20px 5px hsl(var(--accent) / 0.4)', '0 0 25px 8px hsl(var(--accent) / 0.5)', '0 0 20px 5px hsl(var(--accent) / 0.4)'],
        }}
        transition={{ 
            duration: pulse ? 0.8 : 5, 
            repeat: pulse ? 0 : Infinity,
            ease: pulse ? 'easeOut' : 'easeInOut',
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* Orbiting Jobs */}
        <AnimatePresence>
            {jobs.map((job, index) => {
                const angle = (index / jobs.length) * 2 * Math.PI;
                const isQueued = job.status === "Queued";
                
                return (
                    <motion.div
                        key={job.id}
                        className="absolute w-3.5 h-3.5 rounded-full"
                        style={{
                            backgroundColor: 'hsl(var(--accent))',
                            boxShadow: '0 0 10px 1px hsl(var(--accent) / 0.8)',
                            transformOrigin: 'center center',
                        }}
                        initial={{
                            x: Math.cos(angle) * radius,
                            y: Math.sin(angle) * radius,
                            opacity: 0,
                            scale: 0.5,
                        }}
                        animate={{
                            x: isQueued ? Math.cos(angle + (Date.now() / 5000)) * radius : 0,
                            y: isQueued ? Math.sin(angle + (Date.now() / 5000)) * radius : 0,
                            scale: isQueued ? 1 : 0,
                            opacity: isQueued ? 1 : 0,
                        }}
                        exit={{
                            scale: 0,
                            opacity: 0,
                        }}
                        transition={{
                            duration: isQueued ? 0.5 : 1.5,
                            ease: isQueued ? 'linear' : 'easeIn',
                        }}
                    />
                );
            })}
        </AnimatePresence>
      </div>
      
      <p className="absolute -bottom-6 text-sm text-foreground whitespace-nowrap">{backend}</p>
    </div>
  );
}
