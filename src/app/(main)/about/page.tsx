import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Database, BarChart2, Briefcase } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-center">About Quantum Scraper</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-accent">The Ultimate Scraping Dashboard</CardTitle>
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
              <Briefcase className="size-6 text-accent" />
              <CardTitle className="text-accent">Live Job Monitoring</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1 text-foreground">
            <p>Keep a close eye on all active, pending, and completed jobs. Our live-updating interface ensures you're always aware of the status of your scraping tasks, with progress bars and detailed logs at your fingertips.</p>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-3">
              <BarChart2 className="size-6 text-accent" />
              <CardTitle className="text-accent">Insightful Analytics</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1 text-foreground">
            <p>Visualize performance trends with our comprehensive statistics module. Understand job success rates, data throughput, and historical performance to optimize your scraping strategies.</p>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Database className="size-6 text-accent" />
              <CardTitle className="text-accent">Data Exploration</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1 text-foreground">
            <p>Dive deep into your scraped data. With powerful filtering and search capabilities, you can quickly locate specific information and gain valuable insights from the vast amounts of data you collect.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
