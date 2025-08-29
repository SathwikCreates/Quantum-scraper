

"use client";

import { useEffect, useState, useMemo } from 'react';
import { Bar, Line, Scatter } from 'react-chartjs-2';
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
import 'chartjs-adapter-date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { QuantumOrb, Job as QuantumOrbJob, Predictions } from '@/components/quantum-orb';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

type BackendDetail = {
  name: string;
  jobs: QuantumOrbJob[];
  predictions: Predictions;
}

type Job = {
  id: string;
  backend: string;
  status: 'Queued' | 'Running' | 'Completed' | 'Failed';
  submitted_at: string;
  runtime_seconds: number | null;
}

type StatsData = {
    avg_wait_seconds: number;
    trends: { time: string; avg_wait_seconds: number }[];
    backend_usage: { backend: string; jobs: number }[];
    running_vs_completed: { time: string; running: number; completed: number }[];
    busiest_backend: string;
    fastest_backend: string;
    backends: BackendDetail[];
    all_jobs: Job[];
};

export default function StatisticsPage() {
    const [statsData, setStatsData] = useState<StatsData | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string>('N/A');
    const [historyStatusFilter, setHistoryStatusFilter] = useState('all');
    const [historyBackendFilter, setHistoryBackendFilter] = useState('all');

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
        const interval = setInterval(fetchData, 5000); // Fetch more frequently for live orbs
        return () => clearInterval(interval);
    }, []);

    const historyChartData = useMemo(() => {
        if (!statsData) return { datasets: [] };

        const filteredJobs = statsData.all_jobs.filter(job => {
            const matchesStatus = historyStatusFilter === 'all' || job.status.toLowerCase() === historyStatusFilter;
            const matchesBackend = historyBackendFilter === 'all' || job.backend === historyBackendFilter;
            return matchesStatus && matchesBackend;
        });
        
        const statusMap: any = {
            Completed: {
                data: [],
                backgroundColor: 'hsla(140, 70%, 60%, 0.7)',
                borderColor: 'hsl(140, 70%, 60%)',
            },
            Running: {
                data: [],
                backgroundColor: 'hsla(var(--accent), 0.7)',
                borderColor: 'hsl(var(--accent))',
            },
            Failed: {
                data: [],
                backgroundColor: 'hsla(0, 70%, 60%, 0.7)',
                borderColor: 'hsl(0, 70%, 60%)',
            },
            Queued: {
                data: [],
                backgroundColor: 'hsla(var(--primary), 0.7)',
                borderColor: 'hsl(var(--primary))',
            }
        };

        filteredJobs.forEach(job => {
            if (job.status in statusMap && job.runtime_seconds !== null) {
                statusMap[job.status].data.push({
                    x: new Date(job.submitted_at).getTime(),
                    y: job.runtime_seconds,
                    job: job // Store full job object for tooltip
                });
            }
        });

        return {
            datasets: Object.entries(statusMap).map(([status, { data, backgroundColor, borderColor }]: [string, any]) => ({
                label: status,
                data: data,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                pointRadius: 5,
                pointHoverRadius: 8,
            }))
        }
    }, [statsData, historyStatusFilter, historyBackendFilter]);
    

    if (!statsData) {
        return <div className="w-full text-center text-foreground">Loading statistics...</div>;
    }

    const availableBackends = statsData.backends.length > 0 ? [...new Set(statsData.backends.map(j => j.name))] : [];

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
                backgroundColor: 'hsla(var(--primary), 0.8)',
            },
            {
                label: 'Completed',
                data: statsData.running_vs_completed.map(d => d.completed),
                 backgroundColor: 'hsla(var(--accent), 0.8)',
            },
        ],
    };
    const stackedBarOptions = { ...chartOptions, scales: { ...chartOptions.scales, x: { ...chartOptions.scales?.x, stacked: true }, y: { ...chartOptions.scales?.y, stacked: true } }};

    const historyChartOptions: ChartOptions<'scatter'> = {
        ...chartOptions,
        scales: {
            x: {
                ...chartOptions.scales?.x,
                type: 'time',
                time: {
                    unit: 'hour'
                },
                title: {
                    display: true,
                    text: 'Submission Time',
                    color: 'hsl(var(--foreground))'
                }
            },
            y: {
                ...chartOptions.scales?.y,
                title: {
                    display: true,
                    text: 'Runtime (seconds)',
                    color: 'hsl(var(--foreground))'
                }
            }
        },
        plugins: {
            ...chartOptions.plugins,
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const point: any = context.dataset.data[context.dataIndex];
                        const job = point.job;
                        if (!job) return '';
                        return [
                            `Job ID: ${job.id}`,
                            `Backend: ${job.backend}`,
                            `Status: ${job.status}`,
                            `Runtime: ${job.runtime_seconds}s`,
                            `Submitted: ${new Date(job.submitted_at).toLocaleString()}`
                        ];
                    }
                }
            }
        }
    };


  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Statistics</h1>
            <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle className="text-primary">Constellation View</CardTitle>
                <CardDescription className="text-muted-foreground">A galactic view of your quantum backends. Each orb is a backend, and orbiting dots are queued jobs.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-20 gap-x-8 p-6 place-items-center min-h-[300px]">
                {statsData.backends.map((backend) => (
                    <QuantumOrb key={backend.name} backend={backend.name} jobs={backend.jobs} predictions={backend.predictions} />
                ))}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="text-primary">Interactive Job History Explorer</CardTitle>
                <CardDescription className="text-muted-foreground">Explore historical job performance. Hover over points for details.</CardDescription>
                 <div className="mt-4 flex flex-col md:flex-row gap-2">
                        <Select value={historyStatusFilter} onValueChange={setHistoryStatusFilter}>
                            <SelectTrigger className="w-full md:w-[180px] bg-secondary border-muted">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="running">Running</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                                <SelectItem value="queued">Queued</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={historyBackendFilter} onValueChange={setHistoryBackendFilter}>
                            <SelectTrigger className="w-full md:w-[180px] bg-secondary border-muted">
                                <SelectValue placeholder="Filter by backend" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Backends</SelectItem>
                                {availableBackends.map(backend => (
                                    <SelectItem key={backend} value={backend}>{backend}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
            </CardHeader>
            <CardContent className="h-[400px]">
                <Scatter options={historyChartOptions} data={historyChartData} />
            </CardContent>
        </Card>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Average Wait Time Trend</CardTitle>
            <CardDescription className="text-muted-foreground">Average job wait time over the last hour.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Line options={chartOptions as any} data={lineChartData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Backend Usage</CardTitle>
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
                <CardTitle className="text-primary">Running vs Completed Jobs</CardTitle>
                <CardDescription className="text-muted-foreground">The current status of all submitted jobs.</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] flex justify-center">
                <Bar options={stackedBarOptions as any} data={stackedBarChartData} />
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="text-primary">Key Insights</CardTitle>
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
