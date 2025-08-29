
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertTriangle } from "lucide-react";

type JobStatus = 'Completed' | 'Running' | 'Failed' | 'Queued';
type FailureRisk = 'Low' | 'Medium' | 'High' | null;

type Job = {
  id: string;
  backend: string;
  status: JobStatus;
  queue_position: number | null;
  submitted_at: string;
  runtime_seconds: number | null;
  predicted_runtime_seconds: number | null;
  estimated_completion_time: string | null;
  failure_risk: FailureRisk;
  failure_reason: string | null;
};

type JobsData = {
    queued: Job[];
    running: Job[];
    completed: Job[];
    failed: Job[];
}

const LiveBadge = ({ status }: { status: 'ws' | 'sse' | 'poll' }) => {
    const statusConfig = {
        ws: { text: 'LIVE', color: 'bg-green-500', tooltip: 'Connected via WebSocket' },
        sse: { text: 'LIVE', color: 'bg-green-500/80', tooltip: 'Connected via SSE' },
        poll: { text: 'POLLING', color: 'bg-muted-foreground', tooltip: 'Polling every 60 seconds' },
    };
    const { text, color, tooltip } = statusConfig[status];

    return (
        <div className="flex items-center gap-2" title={tooltip}>
            <span className={`relative flex h-3 w-3`}>
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${color}`}></span>
            </span>
            <span className="text-sm font-medium text-foreground">{text}</span>
        </div>
    );
};


const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case 'Completed':
        return <Badge variant="default" className="bg-green-500/80 text-white">Completed</Badge>;
      case 'Running':
        return <Badge variant="default" className="bg-accent text-accent-foreground">Running</Badge>;
      case 'Failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'Queued':
        return <Badge variant="secondary" className="bg-muted text-muted-foreground">Queued</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
};

const getFailureRiskBadge = (risk: FailureRisk, reason: string | null) => {
    if (!risk) return <span className="text-muted-foreground">N/A</span>;
    
    const baseClasses = "flex items-center gap-1";
    let badge;

    switch (risk) {
        case 'Low':
            badge = <Badge variant="default" className="bg-green-500/30 text-green-300 border-green-500/50">{risk}</Badge>;
            break;
        case 'Medium':
            badge = <Badge variant="default" className="bg-yellow-500/30 text-yellow-300 border-yellow-500/50">{risk}</Badge>;
            break;
        case 'High':
            badge = <Badge variant="destructive" className="bg-red-500/30 text-red-300 border-red-500/50">{risk}</Badge>;
            break;
        default:
            return <span className="text-muted-foreground">N/A</span>;
    }

    if ((risk === 'Medium' || risk === 'High') && reason) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger className="cursor-help">
                        <div className={baseClasses}>
                            {badge}
                            <AlertTriangle className="size-3.5 text-yellow-400" />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{reason}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }
    
    return <div className={baseClasses}>{badge}</div>;
};


export default function JobsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [backendFilter, setBackendFilter] = useState('all');
    const [jobsData, setJobsData] = useState<JobsData | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<'ws' | 'sse' | 'poll'>('poll');
    const [lastUpdated, setLastUpdated] = useState<string>('N/A');
    
    const allJobs = jobsData ? [...jobsData.queued, ...jobsData.running, ...jobsData.completed, ...jobsData.failed] : [];
    
    const availableBackends = allJobs.length > 0 ? [...new Set(allJobs.map(j => j.backend))] : [];

    const fetchData = async () => {
        try {
            const response = await fetch('/api/mockData?type=jobs');
            const jsonData = await response.json();
            setJobsData(jsonData);
            setLastUpdated(new Date().toLocaleTimeString());
        } catch (error) {
            console.error("Failed to fetch jobs data:", error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000); // Polling fallback
        return () => clearInterval(interval);
    }, []);

    const filteredJobs = allJobs.filter(job => {
        const matchesSearch = job.id.toLowerCase().includes(searchTerm.toLowerCase()) || job.backend.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || job.status.toLowerCase() === statusFilter;
        const matchesBackend = backendFilter === 'all' || job.backend === backendFilter;
        return matchesSearch && matchesStatus && matchesBackend;
    });

    const renderRuntime = (job: Job) => {
      let progressValue = 0;
      let text = 'N/A';
      let isPulsing = false;
      
      switch(job.status) {
        case 'Completed':
          progressValue = 100;
          text = job.runtime_seconds !== null ? `${job.runtime_seconds}s` : 'N/A';
          break;
        case 'Failed':
          progressValue = 100;
          text = job.runtime_seconds !== null ? `${job.runtime_seconds}s` : 'N/A';
          break;
        case 'Running':
          if (job.runtime_seconds !== null && job.predicted_runtime_seconds !== null && job.predicted_runtime_seconds > 0) {
            progressValue = Math.min(100, (job.runtime_seconds / job.predicted_runtime_seconds) * 100);
          }
          text = `${job.runtime_seconds}s / ~${job.predicted_runtime_seconds}s`;
          break;
        case 'Queued':
          isPulsing = true;
          progressValue = 2; // Small fixed value for visual feedback
          text = job.predicted_runtime_seconds !== null ? `~${job.predicted_runtime_seconds}s` : 'N/A';
          break;
        default:
          text = 'N/A';
      }

      return (
        <div className="flex flex-col gap-1">
          <Progress value={progressValue} className="h-2" isPulsing={isPulsing} indicatorClassName={
            job.status === 'Failed' ? 'bg-destructive' 
            : job.status === 'Completed' ? 'bg-green-500'
            : 'bg-accent'
          } />
          <span className="text-xs text-muted-foreground text-center">{text}</span>
        </div>
      )
    };

    return (
        <div className="space-y-6 w-full max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Jobs</h1>
                <div className="flex items-center gap-4">
                    <LiveBadge status={connectionStatus} />
                    <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-primary">All Jobs</CardTitle>
                    <CardDescription className="text-muted-foreground">Search, filter, and monitor all quantum jobs.</CardDescription>
                    <div className="mt-4 flex flex-col md:flex-row gap-2">
                        <Input
                            placeholder="Search by Job ID or Backend..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm bg-secondary border-muted placeholder:text-muted-foreground"
                        />
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                        <Select value={backendFilter} onValueChange={setBackendFilter}>
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
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-card/60 border-b border-muted">
                                <TableHead className="text-foreground">Job ID</TableHead>
                                <TableHead className="text-foreground">Backend</TableHead>
                                <TableHead className="text-foreground">Status</TableHead>
                                <TableHead className="text-foreground">Failure Risk</TableHead>
                                <TableHead className="text-foreground">Submitted Time</TableHead>
                                <TableHead className="text-foreground">Queue Position</TableHead>
                                <TableHead className="text-foreground">Runtime (Predicted)</TableHead>
                                <TableHead className="text-right text-foreground">Completion ETA</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredJobs.length > 0 ? filteredJobs.map((job) => (
                                <TableRow key={job.id} className="border-b-0 hover:bg-white/5">
                                    <TableCell className="font-medium">{job.id}</TableCell>
                                    <TableCell className="truncate max-w-xs">{job.backend}</TableCell>
                                    <TableCell>{getStatusBadge(job.status)}</TableCell>
                                    <TableCell>{getFailureRiskBadge(job.failure_risk, job.failure_reason)}</TableCell>
                                    <TableCell>{new Date(job.submitted_at).toLocaleString()}</TableCell>
                                    <TableCell>
                                        {job.queue_position !== null ? job.queue_position : 'N/A'}
                                    </TableCell>
                                    <TableCell>{renderRuntime(job)}</TableCell>
                                    <TableCell className="text-right">
                                        {job.estimated_completion_time ? new Date(job.estimated_completion_time).toLocaleString() : 'N/A'}
                                    </TableCell>
                                </TableRow>
                            )) : (
                              <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center text-foreground">
                                  No results found.
                                </TableCell>
                              </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
