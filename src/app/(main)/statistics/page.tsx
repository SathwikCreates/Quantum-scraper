"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const jobsData = [
  { status: "Completed", count: 1189 },
  { status: "Running", count: 12 },
  { status: "Failed", count: 33 },
  { status: "Pending", count: 45 },
];

const activityData = [
  { date: "Oct 21", desktop: 18600, mobile: 8000 },
  { date: "Oct 22", desktop: 30500, mobile: 20000 },
  { date: "Oct 23", desktop: 23700, mobile: 12000 },
  { date: "Oct 24", desktop: 7300, mobile: 19000 },
  { date: "Oct 25", desktop: 20900, mobile: 13000 },
  { date: "Oct 26", desktop: 21400, mobile: 14000 },
  { date: "Oct 27", desktop: 39800, mobile: 21000 },
];

const jobsChartConfig = {
  count: {
    label: "Jobs",
  },
  status: {
    label: "Status"
  },
} satisfies ChartConfig;

const activityChartConfig = {
    dataPoints: {
      label: "Data Points",
    },
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

export default function StatisticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Jobs Overview</CardTitle>
            <CardDescription>A breakdown of all jobs by their current status.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={jobsChartConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={jobsData} margin={{ top: 20 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="status"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis />
                <Tooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="count" fill="hsl(var(--accent))" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scraping Activity</CardTitle>
            <CardDescription>Data points scraped over the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={activityChartConfig} className="h-[300px] w-full">
              <LineChart accessibilityLayer data={activityData} margin={{ top: 20 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis />
                <Tooltip content={<ChartTooltipContent hideLabel />} />
                <Line
                  dataKey="desktop"
                  type="natural"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{
                    fill: "hsl(var(--chart-1))",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
                <Line
                  dataKey="mobile"
                  type="natural"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={{
                    fill: "hsl(var(--chart-2))",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
