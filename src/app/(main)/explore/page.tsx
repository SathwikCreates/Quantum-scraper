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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

type RecordItem = {
  record_id: string;
  job_id: string;
  timestamp: string;
  content: object;
};

export default function ExplorePage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState<RecordItem[]>([]);
    const [lastUpdated, setLastUpdated] = useState<string>('N/A');

    const fetchData = async () => {
        try {
            const response = await fetch('/api/mockData?type=records');
            const jsonData = await response.json();
            setData(jsonData);
            setLastUpdated(new Date().toLocaleTimeString());
        } catch (error) {
            console.error("Failed to fetch explore data:", error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    const filteredData = data.filter(record =>
        record.record_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.job_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        JSON.stringify(record.content).toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 w-full max-w-7xl mx-auto">
             <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Explore Data</h1>
                <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-accent">Scraped Data Records</CardTitle>
                            <CardDescription className="text-muted-foreground">Search and explore the data collected from all jobs.</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Search by Record ID, Job ID, or content..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="max-w-md bg-secondary border-muted placeholder:text-muted-foreground"
                            />
                            <Button variant="outline">
                                <Search className="mr-2"/>
                                Search
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-card/60 border-b border-muted">
                                <TableHead className="text-foreground">Record ID</TableHead>
                                <TableHead className="text-foreground">Source Job</TableHead>
                                <TableHead className="text-foreground">Timestamp</TableHead>
                                <TableHead className="text-foreground">Content</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.length > 0 ? filteredData.map((record, index) => (
                                <TableRow key={record.record_id} className={index % 2 === 0 ? 'bg-background hover:bg-card/60' : 'bg-card hover:bg-card/60'}>
                                    <TableCell className="font-medium">{record.record_id}</TableCell>
                                    <TableCell>{record.job_id}</TableCell>
                                    <TableCell>{record.timestamp}</TableCell>
                                    <TableCell className="font-mono text-sm">{JSON.stringify(record.content)}</TableCell>
                                </TableRow>
                            )) : (
                              <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-foreground">
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
