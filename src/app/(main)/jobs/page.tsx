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

type JobStatus = 'Completed' | 'Running' | 'Failed' | 'Queued';

type Job = {
  id: string;
  backend: string;
  status: JobStatus;
  queuePosition: number | null;
  submittedTime: string;
  runtime: string;
};

const getStatusBadge = (status: Job['status']) => {
    switch (status) {
      case 'Completed':
        return <Badge variant="default" className="bg-accent text-accent-foreground">Completed</Badge>;
      case 'Running':
        return <Badge variant="default" className="bg-accent/80 text-accent-foreground">Running</Badge>;
      case 'Failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'Queued':
        return <Badge variant="secondary" className="bg-muted text-muted-foreground">Queued</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
};

export default function JobsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [jobs, setJobs] = useState<Job[]>([]);

    const fetchData = async () => {
        try {
            const response = await fetch('/api/mockData?type=jobs');
            const jsonData = await response.json();
            setJobs(jsonData);
        } catch (error) {
            console.error("Failed to fetch jobs data:", error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000); // Refresh every 60 seconds
        return () => clearInterval(interval);
    }, []);

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.id.toLowerCase().includes(searchTerm.toLowerCase()) || job.backend.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || job.status.toLowerCase() === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6 w-full max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight text-center text-foreground">Jobs</h1>
            <Card>
                <CardHeader>
                    <CardTitle className="text-foreground">All Jobs</CardTitle>
                    <CardDescription className="text-muted-foreground">Search, filter, and monitor all quantum jobs.</CardDescription>
                    <div className="mt-4 flex flex-col md:flex-row gap-2">
                        <Input
                            placeholder="Search by Job ID or Backend..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-[180px]">
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
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-card/60">
                                <TableHead className="text-foreground">Job ID</TableHead>
                                <TableHead className="text-foreground">Backend</TableHead>
                                <TableHead className="text-foreground">Status</TableHead>
                                <TableHead className="text-foreground">Submitted Time</TableHead>
                                <TableHead className="text-foreground">Queue Position</TableHead>
                                <TableHead className="text-right text-foreground">Runtime</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredJobs.length > 0 ? filteredJobs.map((job, index) => (
                                <TableRow key={job.id} className={index % 2 === 0 ? 'bg-background hover:bg-card/60' : 'bg-card hover:bg-card/60'}>
                                    <TableCell className="font-medium">{job.id}</TableCell>
                                    <TableCell className="truncate max-w-xs">{job.backend}</TableCell>
                                    <TableCell>{getStatusBadge(job.status)}</TableCell>
                                    <TableCell>{job.submittedTime}</TableCell>
                                    <TableCell>
                                        {job.queuePosition !== null ? job.queuePosition : 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-right">{job.runtime}</TableCell>
                                </TableRow>
                            )) : (
                              <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-foreground">
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
