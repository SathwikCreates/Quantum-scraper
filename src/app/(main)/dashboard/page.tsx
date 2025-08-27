"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Activity, CheckCircle, DatabaseZap } from "lucide-react";

type JobStatus = 'Completed' | 'Running' | 'Failed';

type RecentJob = {
  id: string;
  target: string;
  status: JobStatus;
  dataPoints: number;
};

type DashboardData = {
  stats: {
    totalJobs: string;
    totalJobsChange: string;
    activeJobs: string;
    activeJobsChange: string;
    dataPoints: string;
    dataPointsChange: string;
    successRate: string;
    successRateChange: string;
  };
  recentJobs: RecentJob[];
};

const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case 'Completed':
        return <Badge variant="default" className="bg-accent text-accent-foreground">Completed</Badge>;
      case 'Running':
        return <Badge variant="default" className="bg-accent/80 text-accent-foreground">Running</Badge>;
      case 'Failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/mockData?type=dashboard');
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return <div className="w-full text-center text-foreground">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-center text-foreground">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{data.stats.totalJobs}</div>
            <p className="text-xs text-muted-foreground">{data.stats.totalJobsChange}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Active Jobs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{data.stats.activeJobs}</div>
            <p className="text-xs text-muted-foreground">{data.stats.activeJobsChange}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Data Points Scraped</CardTitle>
            <DatabaseZap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{data.stats.dataPoints}</div>
            <p className="text-xs text-muted-foreground">{data.stats.dataPointsChange}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{data.stats.successRate}</div>
            <p className="text-xs text-muted-foreground">{data.stats.successRateChange}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
            <CardTitle className="text-foreground">Recent Jobs</CardTitle>
            <CardDescription className="text-muted-foreground">An overview of the most recent scraping jobs.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-card/60">
                        <TableHead className="text-foreground">Job ID</TableHead>
                        <TableHead className="text-foreground">Target</TableHead>
                        <TableHead className="text-foreground">Status</TableHead>
                        <TableHead className="text-right text-foreground">Data Points</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.recentJobs.map((job, index) => (
                        <TableRow key={job.id} className={index % 2 === 0 ? 'bg-background hover:bg-card/60' : 'bg-card hover:bg-card/60'}>
                            <TableCell className="font-medium">{job.id}</TableCell>
                            <TableCell>{job.target}</TableCell>
                            <TableCell>{getStatusBadge(job.status)}</TableCell>
                            <TableCell className="text-right">{job.dataPoints.toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
      <footer className="text-right text-sm text-muted-foreground mt-4">
        Powered by Quantum Dashboard
      </footer>
    </div>
  );
}
