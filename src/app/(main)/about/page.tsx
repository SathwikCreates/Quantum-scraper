import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Database, BarChart2, Briefcase, BrainCircuit } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-center text-foreground">About Quantum Scraper</h1>
      <p className="text-center text-primary italic text-lg">
        “We show real-time jobs, while others only show you the job.”
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-primary">The Ultimate Scraping Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-foreground">
          <p>
            Welcome to Quantum Scraper, your centralized hub for monitoring and managing all web scraping operations. Built with efficiency and clarity in mind, this dashboard provides real-time insights, detailed analytics, and powerful data exploration tools to ensure your data acquisition pipelines are running smoothly and effectively.
          </p>
          <p>
            Our mission is to bring simplicity to the complex world of data scraping. Whether you are tracking a handful of jobs or orchestrating thousands, Quantum Scraper gives you the visibility you need to make informed decisions.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Briefcase className="size-6 text-primary" />
              <CardTitle className="text-primary">Live Job Monitoring</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1 text-foreground">
            <p>Keep a close eye on all active, pending, and completed jobs. Our live-updating interface ensures you're always aware of the status of your scraping tasks, with progress bars and detailed logs at your fingertips.</p>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-3">
              <BarChart2 className="size-6 text-primary" />
              <CardTitle className="text-primary">Insightful Analytics</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1 text-foreground">
            <p>Visualize performance trends with our comprehensive statistics module. Understand job success rates, data throughput, and historical performance to optimize your scraping strategies.</p>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Database className="size-6 text-primary" />
              <CardTitle className="text-primary">Data Exploration</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1 text-foreground">
            <p>Dive deep into your scraped data. With powerful filtering and search capabilities, you can quickly locate specific information and gain valuable insights from the vast amounts of data you collect.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <BrainCircuit className="size-6 text-primary" />
            <CardTitle className="text-primary">Quantum Job Runtime Predictor</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-foreground">
          <p>
            This dashboard uses a prediction model to estimate queue times and runtimes for jobs that are not yet complete. By analyzing historical data, the model can provide a valuable "Completion ETA" for queued and running jobs.
          </p>
          <h4 className="font-semibold text-primary pt-2">Time Complexity Analysis</h4>
          <ul className="list-disc pl-5 space-y-2 font-mono text-sm">
            <li>
              <span className="font-semibold text-foreground">Training (e.g., Random Forest):</span> O(N ⋅ log N), where N is the number of past jobs in the training set. This is done offline.
            </li>
            <li>
              <span className="font-semibold text-foreground">Prediction (per job):</span> O(1), a constant-time lookup once the model is trained.
            </li>
            <li>
              <span className="font-semibold text-foreground">Dashboard Update (Polling):</span> O(J), where J is the number of jobs being monitored. This is efficient enough for real-time updates.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}