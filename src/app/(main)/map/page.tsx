
"use client";

import { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from "react-simple-maps";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type Backend = {
    name: string;
    coordinates: [number, number];
    runningJobs: number;
    queuedJobs: number;
};

type RunningJob = {
    id: string;
    backend: string;
    backendCoords: [number, number];
};

type MapData = {
    backends: Backend[];
    runningJobs: RunningJob[];
};

const USER_LOCATION: [number, number] = [-98.5795, 39.8283]; // Center of the US

export default function MapPage() {
    const [data, setData] = useState<MapData | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string>("N/A");

    const fetchData = async () => {
        try {
            const response = await fetch('/api/mockData?type=map');
            if (!response.ok) throw new Error("Failed to fetch map data");
            const jsonData: MapData = await response.json();
            setData(jsonData);
            setLastUpdated(new Date().toLocaleTimeString());
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds
        return () => clearInterval(interval);
    }, []);

    if (!data) {
        return <div className="w-full text-center text-foreground">Loading map...</div>;
    }

    return (
        <div className="space-y-6 w-full max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Global Backend Map</h1>
                <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-primary">Live Job Connections</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        A real-time visualization of running jobs connecting to quantum backends across the globe.
                    </CardDescription>
                </CardHeader>
                <CardContent className="h-[600px] bg-background/50 rounded-lg border border-muted overflow-hidden">
                    <TooltipProvider>
                        <ComposableMap
                            projectionConfig={{ rotate: [5, -20, 0], scale: 180 }}
                            style={{ width: "100%", height: "100%" }}
                        >
                            <Geographies geography={geoUrl}>
                                {({ geographies }) =>
                                    geographies.map((geo) => (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill="hsl(var(--muted))"
                                            stroke="hsl(var(--background))"
                                            style={{
                                                default: { outline: 'none' },
                                                hover: { outline: 'none' },
                                                pressed: { outline: 'none' },
                                            }}
                                        />
                                    ))
                                }
                            </Geographies>

                            {data.runningJobs.map((job) => (
                                <Line
                                    key={job.id}
                                    from={USER_LOCATION}
                                    to={job.backendCoords}
                                    stroke="hsl(var(--accent))"
                                    strokeWidth={1.5}
                                    strokeLinecap="round"
                                    style={{
                                        filter: "drop-shadow(0 0 2px hsl(var(--accent)))",
                                        animation: "pulse-arc 3s infinite ease-in-out"
                                    }}
                                />
                            ))}
                            
                             <Marker coordinates={USER_LOCATION}>
                                <circle r={5} fill="hsl(var(--primary))" stroke="hsl(var(--primary-foreground))" strokeWidth={2} style={{ filter: "drop-shadow(0 0 5px hsl(var(--primary)))" }} />
                                <text textAnchor="middle" y={-10} className="text-primary font-bold fill-current text-xs">
                                    YOU
                                </text>
                            </Marker>

                            {data.backends.map(({ name, coordinates, runningJobs, queuedJobs }) => (
                                <Marker key={name} coordinates={coordinates}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <g>
                                                <circle r={8} fill="hsl(var(--card))" stroke="hsl(var(--accent))" strokeWidth={2} />
                                                <circle r={runningJobs > 0 ? 5 : 0} fill="hsl(var(--accent))" style={{ filter: `drop-shadow(0 0 8px hsl(var(--accent)))`, animation: "pulse-marker 2s infinite" }} />
                                            </g>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <div className="p-1 space-y-1">
                                                <h4 className="font-bold text-primary">{name}</h4>
                                                <Badge>Running Jobs: {runningJobs}</Badge>
                                                <Badge variant="secondary">Queued Jobs: {queuedJobs}</Badge>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </Marker>
                            ))}
                        </ComposableMap>
                    </TooltipProvider>
                </CardContent>
            </Card>
        </div>
    );
}

// Add keyframes to globals.css if they don't exist
const style = document.createElement('style');
style.innerHTML = `
@keyframes pulse-marker {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.7;
  }
}
@keyframes pulse-arc {
    0%, 100% {
        opacity: 0.4;
    }
    50% {
        opacity: 1;
    }
}
`;
if(typeof window !== 'undefined') {
    document.head.appendChild(style);
}
