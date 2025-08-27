"use client";

import { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
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
} from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

type StatsData = {
    avgWaitTime: { labels: string[]; data: number[] };
    backendUsage: { labels: string[]; data: number[] };
    jobStatusDistribution: { labels: string[]; data: number[] };
};

export default function StatisticsPage() {
    const [statsData, setStatsData] = useState<StatsData | null>(null);

    const fetchData = async () => {
        try {
            const response = await fetch('/api/mockData?type=stats');
            const jsonData = await response.json();
            setStatsData(jsonData);
        } catch (error) {
            console.error("Failed to fetch statistics data:", error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000); // Refresh every 60 seconds
        return () => clearInterval(interval);
    }, []);

    if (!statsData) {
        return <div className="w-full text-center text-foreground">Loading statistics...</div>;
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: '#EEEEEE',
                }
            },
            title: {
                display: false,
            },
        },
        scales: {
            x: {
                ticks: {
                    color: '#EEEEEE',
                },
                grid: {
                    color: '#393E46',
                },
            },
            y: {
                ticks: {
                    color: '#EEEEEE',
                },
                grid: {
                    color: '#393E46',
                },
            },
        },
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: '#EEEEEE',
                },
            },
        },
    };
    
    const lineChartData = {
        labels: statsData.avgWaitTime.labels,
        datasets: [
            {
                label: 'Average Wait Time (s)',
                data: statsData.avgWaitTime.data,
                borderColor: '#00ADB5',
                backgroundColor: 'rgba(0, 173, 181, 0.5)',
                tension: 0.3,
            },
        ],
    };

    const barChartData = {
        labels: statsData.backendUsage.labels,
        datasets: [
            {
                label: 'Job Count',
                data: statsData.backendUsage.data,
                backgroundColor: '#00ADB5',
            },
        ],
    };

    const pieChartData = {
        labels: statsData.jobStatusDistribution.labels,
        datasets: [
            {
                label: 'Job Status',
                data: statsData.jobStatusDistribution.data,
                backgroundColor: ['#00ADB5', '#393E46', '#EEEEEE', '#888'],
                borderColor: '#222831',
                borderWidth: 2,
            },
        ],
    };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-center text-foreground">Statistics</h1>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-accent">Average Wait Time Trend</CardTitle>
            <CardDescription className="text-muted-foreground">Average job wait time over the last hour.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Line options={chartOptions} data={lineChartData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-accent">Backend Usage</CardTitle>
            <CardDescription className="text-muted-foreground">Distribution of jobs across different backends.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
             <Bar options={chartOptions} data={barChartData} />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="items-center">
            <CardTitle className="text-accent">Job Status Distribution</CardTitle>
            <CardDescription className="text-muted-foreground">The current status of all submitted jobs.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex justify-center">
            <div className="w-full max-w-[350px]">
                <Pie options={pieChartOptions} data={pieChartData} />
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
