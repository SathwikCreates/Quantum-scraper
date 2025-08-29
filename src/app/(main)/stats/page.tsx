
"use client";

import { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ChartOptions,
} from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { QuantumOrb } from '@/components/quantum-orb';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

type Job = {
    id: string;
    backend: string;
    status: 'Queued' | 'Running' | 'Completed' | 'Failed';
};

type StatsData = {
    avg_wait_seconds: number;
    trends: { time: string; avg_wait_seconds: number }[];
    backend_usage: { backend: string; jobs: number }[];
    running_vs_completed: { time: string; running: number; completed: number }[];
    busiest_backend: string;
    fastest_backend: string;
    jobs: {
      queued: Job[];
      running: Job[];
      completed: Job[];
      failed: Job[];
    }
};

export default function StatisticsPage() {
    const [statsData, setStatsData] = useState<StatsData | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string>('N/A');

    const fetchData = async () => {
        try {
            const response = await fetch('/api/mockData?type=stats');
            const jsonData = await response.json();
            setStatsData(jsonData);
            setLastUpdated(new Date().toLocaleTimeString());
        } catch (error) {
            console.error("Failed to fetch statistics data:", error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    if (!statsData) {
        return <div className="w-full text-center text-foreground">Loading statistics...</div>;
    }

    const chartOptions: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: 'hsl(var(--foreground))',
                }
            },
            title: {
                display: false,
            },
        },
        scales: {
            x: {
                ticks: {
                    color: 'hsl(var(--foreground))',
                },
                grid: {
                    color: 'hsl(var(--muted))',
                },
            },
            y: {
                ticks: {
                    color: 'hsl(var(--foreground))',
                },
                grid: {
                    color: 'hsl(var(--muted))',
                },
            },
        },
    };
    
    const lineChartData = {
        labels: statsData.trends.map(t => t.time),
        datasets: [
            {
                label: 'Average Wait Time (s)',
                data: statsData.trends.map(t => t.avg_wait_seconds),
                borderColor: 'hsl(var(--accent))',
                backgroundColor: 'hsla(var(--accent), 0.5)',
                tension: 0.3,
            },
        ],
    };

    const barChartData = {
        labels: statsData.backend_usage.map(b => b.backend),
        datasets: [
            {
                label: 'Job Count',
                data: statsData.backend_usage.map(b => b.jobs),
                backgroundColor: 'hsl(var(--accent))',
            },
        ],
    };

    const stackedBarChartData = {
        labels: statsData.running_vs_completed.map(d => d.time),
        datasets: [
            {
                label: 'Running',
                data: statsData.running_vs_completed.map(d => d.running),
                backgroundColor: 'hsla(var(--accent), 0.8)',
            },
            {
                label: 'Completed',
                data: statsData.running_vs_completed.map(d => d.completed),
                 backgroundColor: 'hsla(var(--accent), 0.5)',
            },
        ],
    };
    const stackedBarOptions = { ...chartOptions, scales: { ...chartOptions.scales, x: { ...chartOptions.scales?.x, stacked: true }, y: { ...chartOptions.scales?.y, stacked: true } }};

    const allJobs = [...statsData.jobs.queued, ...statsData.jobs.running, ...statsData.jobs.completed, ...statsData.jobs.failed];
    const jobsByBackend: Record<string, Job[]> = allJobs.reduce((acc, job) => {
        if (!acc[job.backend]) {
            acc[job.backend] = [];
        }
        acc[job.backend].push(job);
        return acc;
    }, {} as Record<string, Job[]>);


  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Statistics</h1>
            <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle className="text-accent">Constellation View</CardTitle>
                <CardDescription className="text-muted-foreground">A galactic view of your quantum backends. Each orb is a backend, and orbiting dots are queued jobs.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-12 gap-x-8 p-6 place-items-center min-h-[300px]">
                {Object.entries(jobsByBackend).map(([backend, jobs]) => (
                    <QuantumOrb key={backend} backend={backend} jobs={jobs} />
                ))}
            </CardContent>
        </Card>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-accent">Average Wait Time Trend</CardTitle>
            <CardDescription className="text-muted-foreground">Average job wait time over the last hour.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Line options={chartOptions as any} data={lineChartData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-accent">Backend Usage</CardTitle>
            <CardDescription className="text-muted-foreground">Distribution of jobs across different backends.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
             <Bar options={chartOptions as any} data={barChartData} />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle className="text-accent">Running vs Completed Jobs</CardTitle>
                <CardDescription className="text-muted-foreground">The current status of all submitted jobs.</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] flex justify-center">
                <Bar options={stackedBarOptions as any} data={stackedBarChartData} />
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="text-accent">Key Insights</CardTitle>
                <CardDescription className="text-muted-foreground">At a glance statistics.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                    <p className="text-foreground">Busiest Backend</p>
                    <p className="font-bold text-accent">{statsData.busiest_backend}</p>
                </div>
                 <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                    <p className="text-foreground">Fastest Backend</p>
                    <p className="font-bold text-accent">{statsData.fastest_backend}</p>
                </div>
                 <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                    <p className="text-foreground">Average Wait Time</p>
                    <p className="font-bold text-accent">{statsData.avg_wait_seconds}s</p>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
