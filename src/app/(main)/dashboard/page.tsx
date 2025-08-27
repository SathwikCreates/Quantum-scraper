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
            <div className="text-2xl font-bold text-accent">1,234</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Active Jobs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">12</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Data Points Scraped</CardTitle>
            <DatabaseZap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">1.4M</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">98.2%</div>
            <p className="text-xs text-muted-foreground">+2.5% from last month</p>
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
                    {recentJobs.map((job, index) => (
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
