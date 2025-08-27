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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

type DataRecord = {
  id: string;
  sourceJob: string;
  timestamp: string;
  content: string;
};

const sampleData: DataRecord[] = [
  { id: 'REC-001', sourceJob: 'JOB-2300', timestamp: '2023-10-27 09:32 AM', content: '{"product": "Laptop", "price": 1200}' },
  { id: 'REC-002', sourceJob: 'JOB-2300', timestamp: '2023-10-27 09:33 AM', content: '{"product": "Mouse", "price": 25}' },
  { id: 'REC-003', sourceJob: 'JOB-2299', timestamp: '2023-10-27 09:05 AM', content: '{"user": "alex", "post": "Just saw the new movie, it was great!"}' },
  { id: 'REC-004', sourceJob: 'JOB-2297', timestamp: '2023-10-26 04:10 PM', content: '{"flight": "UA234", "destination": "SFO", "price": 345.60}' },
  { id: 'REC-005', sourceJob: 'JOB-2297', timestamp: '2023-10-26 04:11 PM', content: '{"flight": "DL588", "destination": "JFK", "price": 289.00}' },
  { id: 'REC-006', sourceJob: 'JOB-2301', timestamp: '2023-10-27 10:15 AM', content: '{"product": "Keyboard", "price": 75}' },
];

export default function ExplorePage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = sampleData.filter(record =>
        record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.sourceJob.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 w-full max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight text-center">Explore Data</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Scraped Data Records</CardTitle>
                    <CardDescription className="text-accent">Search and explore the data collected from all jobs.</CardDescription>
                    <div className="mt-4 flex gap-2">
                        <Input
                            placeholder="Search by Record ID, Job ID, or content..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-md"
                        />
                        <Button>
                            <Search className="mr-2"/>
                            Search
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-card">
                                <TableHead className="text-accent">Record ID</TableHead>
                                <TableHead className="text-accent">Source Job</TableHead>
                                <TableHead className="text-accent">Timestamp</TableHead>
                                <TableHead className="text-accent">Content</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.length > 0 ? filteredData.map((record, index) => (
                                <TableRow key={record.id} className={index % 2 === 0 ? 'bg-background' : 'bg-card'}>
                                    <TableCell className="font-medium">{record.id}</TableCell>
                                    <TableCell>{record.sourceJob}</TableCell>
                                    <TableCell>{record.timestamp}</TableCell>
                                    <TableCell className="font-mono text-sm">{record.content}</TableCell>
                                </TableRow>
                            )) : (
                              <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
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
