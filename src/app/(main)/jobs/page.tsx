"use client";

import { useState } from "react";
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

type Job = {
  id: string;
  target: string;
  status: 'Completed' | 'Running' | 'Failed' | 'Pending';
  dataPoints: number;
  progress: number;
  startedAt: string;
};

const allJobs: Job[] = [
    { id: 'JOB-2301', target: 'ecom-store.com/products', status: 'Running', dataPoints: 1250, progress: 62, startedAt: '2023-10-27 10:00 AM' },
    { id: 'JOB-2300', target: 'news-aggregator.net/articles', status: 'Completed', dataPoints: 5420, progress: 100, startedAt: '2023-10-27 09:30 AM' },
    { id: 'JOB-2299', target: 'social-media-trends.io/posts', status: 'Completed', dataPoints: 15230, progress: 100, startedAt: '2023-10-27 09:00 AM' },
    { id: 'JOB-2298', target: 'finance-data.co/stocks', status: 'Failed', dataPoints: 0, progress: 15, startedAt: '2023-10-26 05:00 PM' },
    { id: 'JOB-2297', target: 'travel-deals.com/flights', status: 'Completed', dataPoints: 8800, progress: 100, startedAt: '2023-10-26 04:00 PM' },
    { id: 'JOB-2296', target: 'recipe-database.org/recipes', status: 'Pending', dataPoints: 0, progress: 0, startedAt: '2023-10-27 10:05 AM' },
    { id: 'JOB-2295', target: 'real-estate-listings.com/homes', status: 'Running', dataPoints: 340, progress: 22, startedAt: '2023-10-27 10:02 AM' },
];

const getStatusBadge = (status: Job['status']) => {
    switch (status) {
      case 'Completed':
        return <Badge variant="outline" className="border-[hsl(var(--chart-1))] text-[hsl(var(--chart-1))]">Completed</Badge>;
      case 'Running':
        return <Badge variant="default">Running</Badge>;
      case 'Failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'Pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
};

export default function JobsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredJobs = allJobs.filter(job => {
        const matchesSearch = job.id.toLowerCase().includes(searchTerm.toLowerCase()) || job.target.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || job.status.toLowerCase() === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6 w-full max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight text-center">Jobs</h1>
            <Card>
                <CardHeader>
                    <CardTitle>All Jobs</CardTitle>
                    <CardDescription>Search, filter, and monitor all scraping jobs.</CardDescription>
                    <div className="mt-4 flex flex-col md:flex-row gap-2">
                        <Input
                            placeholder="Search by Job ID or Target..."
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
                                <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Job ID</TableHead>
                                <TableHead>Target</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Started At</TableHead>
                                <TableHead>Progress</TableHead>
                                <TableHead className="text-right">Data Points</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredJobs.length > 0 ? filteredJobs.map((job) => (
                                <TableRow key={job.id}>
                                    <TableCell className="font-medium">{job.id}</TableCell>
                                    <TableCell className="truncate max-w-xs">{job.target}</TableCell>
                                    <TableCell>{getStatusBadge(job.status)}</TableCell>
                                    <TableCell>{job.startedAt}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Progress value={job.progress} className="w-24" />
                                            <span className="text-sm text-muted-foreground">{job.progress}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">{job.dataPoints.toLocaleString()}</TableCell>
                                </TableRow>
                            )) : (
                              <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
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
