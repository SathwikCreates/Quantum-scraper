import { NextResponse } from 'next/server';

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min: number, max: number, decimals: number) {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(str);
}

const dashboardData = () => ({
    stats: {
        totalJobs: getRandomInt(1200, 1300).toLocaleString(),
        totalJobsChange: `+${getRandomFloat(2, 3, 1)}% today`,
        activeJobs: getRandomInt(10, 15).toLocaleString(),
        activeJobsChange: 'Currently running',
        dataPoints: `${getRandomInt(130, 150)}s`, // Representing avg wait time
        dataPointsChange: `+${getRandomFloat(1, 5, 1)}s from last hour`,
        successRate: `${getRandomFloat(98, 99, 1)}%`,
        successRateChange: `+${getRandomFloat(0.1, 0.3, 1)}% from last month`,
    },
    recentJobs: [
        { id: `JOB-${getRandomInt(3000, 3100)}`, target: 'ibm_oslo', status: 'Completed', dataPoints: getRandomInt(1000, 1500) },
        { id: `JOB-${getRandomInt(2990, 3000)}`, target: 'ibm_lima', status: 'Running', dataPoints: getRandomInt(400, 500) },
        { id: `JOB-${getRandomInt(2980, 2990)}`, target: 'ibmq_qasm_simulator', status: 'Failed', dataPoints: 0 },
        { id: `JOB-${getRandomInt(2970, 2980)}`, target: 'ibm_lima', status: 'Completed', dataPoints: getRandomInt(8000, 9000) },
        { id: `JOB-${getRandomInt(2960, 2970)}`, target: 'ibm_oslo', status: 'Queued', dataPoints: getRandomInt(2000, 2500) },
    ],
    lastUpdated: new Date().toISOString(),
});

const jobsData = () => {
    const backends = ['ibm_q_16_melbourne', 'ibmq_armonk', 'ibmq_santiago', 'ibmq_bogota', 'ibmq_lima', 'ibmq_belem', 'ibmq_quito', 'ibmq_qasm_simulator', 'ibm_oslo'];
    
    const generateJob = (status: 'Queued' | 'Running' | 'Completed' | 'Failed'): any => {
        const job: any = {
            id: `JOB-${getRandomInt(1000, 4000)}`,
            backend: backends[getRandomInt(0, backends.length - 1)],
            status: status,
            submitted_at: new Date(Date.now() - getRandomInt(1000, 86400000)).toISOString(),
            queue_position: null,
            runtime_seconds: null
        }
        if (status === 'Queued') {
            job.queue_position = getRandomInt(1, 50);
        }
        if (status === 'Running') {
             job.runtime_seconds = getRandomInt(5, 300);
        }
        if (status === 'Completed' || status === 'Failed') {
            job.runtime_seconds = getRandomInt(5, 1200);
        }
        return job;
    }
    
    return {
        queued: Array.from({ length: getRandomInt(5, 15) }, () => generateJob('Queued')),
        running: Array.from({ length: getRandomInt(3, 8) }, () => generateJob('Running')),
        completed: Array.from({ length: getRandomInt(10, 20) }, () => generateJob('Completed')),
        failed: Array.from({ length: getRandomInt(0, 2) }, () => generateJob('Failed')),
    }
}

const statsData = () => ({
    total_jobs: getRandomInt(1200, 1300),
    running_jobs: getRandomInt(10, 20),
    avg_wait_seconds: getRandomInt(120, 180),
    success_rate: getRandomFloat(0.97, 0.99, 3),
    trends: [
        {time: "12:00", avg_wait_seconds: getRandomInt(140, 160)},
        {time: "13:00", avg_wait_seconds: getRandomInt(130, 150)},
        {time: "14:00", avg_wait_seconds: getRandomInt(120, 140)},
        {time: "15:00", avg_wait_seconds: getRandomInt(135, 155)},
        {time: "16:00", avg_wait_seconds: getRandomInt(130, 145)},
    ],
    backend_usage: [
        {backend: "ibm_lima", jobs: getRandomInt(300, 400)},
        {backend: "ibm_oslo", jobs: getRandomInt(250, 350)},
        {backend: "ibmq_qasm_simulator", jobs: getRandomInt(400, 500)},
        {backend: "ibmq_belem", jobs: getRandomInt(100, 200)},
        {backend: "ibmq_quito", jobs: getRandomInt(150, 250)},
    ],
    running_vs_completed: [
        {time: "12:00", running: getRandomInt(8, 12), completed: getRandomInt(90, 110)},
        {time: "13:00", running: getRandomInt(10, 15), completed: getRandomInt(100, 120)},
        {time: "14:00", running: getRandomInt(9, 13), completed: getRandomInt(95, 115)},
        {time: "15:00", running: getRandomInt(11, 16), completed: getRandomInt(105, 125)},
        {time: "16:00", running: getRandomInt(12, 18), completed: getRandomInt(110, 130)},
    ],
    busiest_backend: "ibmq_qasm_simulator",
    fastest_backend: "ibmq_qasm_simulator", // It's a simulator, it should be fast
    last_updated: new Date().toISOString()
});

const recordsData = () => {
    return Array.from({ length: 15 }, () => ({
        record_id: `REC-${getRandomInt(1000, 9999)}`,
        job_id: `JOB-${getRandomInt(2000, 3000)}`,
        timestamp: new Date(Date.now() - getRandomInt(1000, 7200000)).toISOString(),
        content: { data: "...", value: getRandomFloat(1, 1000, 2) }
    }));
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let data;
    switch (type) {
        case 'dashboard':
            data = dashboardData();
            break;
        case 'jobs':
            data = jobsData();
            break;
        case 'stats':
            data = statsData();
            break;
        case 'records':
            data = recordsData();
            break;
        default:
            return NextResponse.json({ error: 'Invalid data type requested' }, { status: 400 });
    }

    return NextResponse.json(data);
}
