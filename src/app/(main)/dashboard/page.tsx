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
import { BackButton } from "@/components/layout/back-button";

type JobStatus = 'Completed' | 'Running' | 'Failed';

const recentJobs: { id: string; target: string; status: JobStatus; dataPoints: number }[] = [
    { id: 'JOB-001', target: 'example.com', status: 'Completed', dataPoints: 1200 },
    { id: 'JOB-002', target: 'anothersite.dev', status: 'Running', dataPoints: 450 },
    { id: 'JOB-003', target: 'test-scrape.io', status: 'Failed', dataPoints: 0 },
    { id: 'JOB-004', target: 'data-source.net', status: 'Completed', dataPoints: 8750 },
    { id: 'JOB-005', target: 'web-archive.org', status: 'Completed', dataPoints: 2300 },
  ];

const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case 'Completed':
        return <Badge variant="outline" className="border-[hsl(var(--chart-1))] text-[hsl(var(--chart-1))]">Completed</Badge>;
      case 'Running':
        return <Badge variant="default">Running</Badge>;
      case 'Failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };


export default function DashboardPage() {
  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
       <div className="flex items-center justify-between">
        <BackButton />
        <h1 className="text-3xl font-bold tracking-tight text-center flex-1">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Points Scraped</CardTitle>
            <DatabaseZap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.4M</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.2%</div>
            <p className="text-xs text-muted-foreground">+2.5% from last month</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
            <CardDescription>An overview of the most recent scraping jobs.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Job ID</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Data Points</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentJobs.map((job) => (
                        <TableRow key={job.id}>
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
    </div>
  );
}
