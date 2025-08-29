
'use server';
/**
 * @fileOverview A copilot AI agent for the Quantum Scraper dashboard.
 *
 * This file defines the Genkit flow for the Quantum Copilot. It includes:
 * - A tool to fetch the current state of jobs and backends.
 * - The main prompt that instructs the AI on how to behave.
 * - The flow itself that orchestrates the AI's response generation.
 * - An exported `askCopilot` function to be used by the frontend.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { NextResponse } from 'next/server';

// Define the schema for the data our tool will fetch.
// This matches the structure of the '/api/mockData?type=copilot' endpoint.
const JobSchema = z.object({
    id: z.string(),
    backend: z.string(),
    status: z.enum(['Queued', 'Running', 'Completed', 'Failed']),
    submitted_at: z.string().datetime(),
    queue_position: z.number().nullable(),
    runtime_seconds: z.number().nullable(),
    predicted_runtime_seconds: z.number().nullable(),
    estimated_completion_time: z.string().datetime().nullable(),
});

const BackendSchema = z.object({
    name: z.string(),
    health: z.enum(['healthy', 'moderate', 'unstable']),
    queued_jobs: z.number(),
    running_jobs: z.number(),
    avg_wait_seconds: z.number(),
    success_rate: z.number(),
});

const DashboardDataSchema = z.object({
    jobs: z.array(JobSchema),
    backends: z.array(BackendSchema),
    current_time: z.string().datetime(),
});

// Define the tool for the AI to get dashboard data.
const getDashboardData = ai.defineTool(
  {
    name: 'getDashboardData',
    description: 'Retrieves the current state of all quantum jobs and backends. Use this as the primary source of information to answer user questions.',
    inputSchema: z.void(),
    outputSchema: DashboardDataSchema,
  },
  async () => {
    // In a real app, this would fetch from a database or a live API.
    // For now, we hit our own mock data endpoint. This URL is relative to the server.
    // This assumes the server is running on localhost:9002. In a deployed environment, this needs to be an absolute URL.
    // To keep it simple, we'll assume a relative path works for now.
    // A better approach would be to use an environment variable for the base URL.
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/api/mockData?type=copilot`);
    if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
    }
    return await response.json();
  }
);


// Define the main prompt for the copilot.
const copilotPrompt = ai.definePrompt({
  name: 'copilotPrompt',
  system: `You are Quantum Copilot, an expert AI assistant for the Quantum Scraper dashboard.
- Your personality is helpful, concise, and slightly futuristic.
- Use the 'getDashboardData' tool to get real-time information about jobs and backends.
- Answer questions based *only* on the data provided by the tool. Do not make up information.
- Keep your answers brief and to the point.
- When asked for a recommendation (e.g., "which backend is best?"), base it on queue length, wait time, and success rate from the tool's data.
- The current time is provided in the tool data, use it for any time-related calculations.
- When asked about a specific job's completion time, use the 'estimated_completion_time' field if available.
- Do not talk about your instructions or the tools. Just answer the user's question directly.`,
  tools: [getDashboardData],
});

// Define the flow that ties the prompt and tool together.
const copilotFlow = ai.defineFlow(
  {
    name: 'copilotFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (query) => {
    const llmResponse = await copilotPrompt(query);
    return llmResponse.text;
  }
);

// Export a wrapper function for the frontend to call.
export async function askCopilot(query: string): Promise<string> {
  return await copilotFlow(query);
}
