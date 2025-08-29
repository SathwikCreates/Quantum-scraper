
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

const backends = ['ibm_q_16_melbourne', 'ibmq_armonk', 'ibmq_santiago', 'ibmq_bogota', 'ibmq_lima', 'ibmq_belem', 'ibmq_quito', 'ibmq_qasm_simulator', 'ibm_oslo'];
const jobIds = new Set<string>();

const generateJob = (status: 'Queued' | 'Running' | 'Completed' | 'Failed', backend?: string): any => {
    const submittedAt = new Date(Date.now() - getRandomInt(1000, 86400000));
    let jobId;
    do {
        jobId = `JOB-${getRandomInt(1000, 4000)}`;
    } while (jobIds.has(jobId));
    jobIds.add(jobId);

    const job: any = {
        id: jobId,
        backend: backend || backends[getRandomInt(0, backends.length - 1)],
        status: status,
        submitted_at: submittedAt.toISOString(),
        queue_position: null,
        runtime_seconds: null,
        predicted_runtime_seconds: null,
        estimated_completion_time: null,
        failure_risk: null,
        failure_reason: null,
    }

    if (status === 'Queued' || status === 'Running') {
        const riskRoll = Math.random();
        if (riskRoll > 0.9) {
            job.failure_risk = 'High';
            job.failure_reason = 'High contention on this backend recently.';
        } else if (riskRoll > 0.7) {
            job.failure_risk = 'Medium';
            job.failure_reason = 'Slight increase in backend error rates.';
        } else {
            job.failure_risk = 'Low';
        }
    }


    if (status === 'Queued') {
        job.queue_position = getRandomInt(1, 50);
        const predicted_runtime_seconds = getRandomInt(180, 700);
        job.predicted_runtime_seconds = predicted_runtime_seconds;
        job.estimated_completion_time = new Date(submittedAt.getTime() + (job.queue_position * 30000) + (predicted_runtime_seconds * 1000)).toISOString();
    }
    if (status === 'Running') {
         job.runtime_seconds = getRandomInt(5, 300);
         const predicted_runtime_seconds = getRandomInt(job.runtime_seconds + 10, 800);
         job.predicted_runtime_seconds = predicted_runtime_seconds;
         job.estimated_completion_time = new Date(submittedAt.getTime() + (predicted_runtime_seconds * 1000)).toISOString();
    }
    if (status === 'Completed' || status === 'Failed') {
        job.runtime_seconds = getRandomInt(5, 1200);
        job.predicted_runtime_seconds = job.runtime_seconds + getRandomInt(-50, 50);
    }
    return job;
}

const dashboardData = () => {
    const recentJobs = [];
    const recentJobIds = new Set();
    const statuses: ('Completed' | 'Running' | 'Failed' | 'Queued')[] = ['Completed', 'Running', 'Failed', 'Completed', 'Queued'];
    const targets = ['ibm_oslo', 'ibm_lima', 'ibmq_qasm_simulator', 'ibm_lima', 'ibm_oslo'];

    for (let i = 0; i < 5; i++) {
        let jobId;
        do {
            jobId = `JOB-${getRandomInt(2960, 3100)}`;
        } while (recentJobIds.has(jobId));
        recentJobIds.add(jobId);

        recentJobs.push({
            id: jobId,
            target: targets[i],
            status: statuses[i],
            dataPoints: statuses[i] === 'Failed' ? 0 : getRandomInt(400, 9000)
        });
    }

    return {
        stats: {
            totalJobs: getRandomInt(1200, 1300).toLocaleString(),
            totalJobsChange: `+${getRandomFloat(2, 3, 1)}% today`,
            activeJobs: getRandomInt(10, 15).toLocaleString(),
            activeJobsChange: 'Currently running',
            dataPoints: `${getRandomInt(130, 150)}s`,
            dataPointsChange: `+${getRandomFloat(1, 5, 1)}s from last hour`,
            successRate: `${getRandomFloat(98, 99, 1)}%`,
            successRateChange: `+${getRandomFloat(0.1, 0.3, 1)}% from last month`,
        },
        recentJobs: recentJobs,
        lastUpdated: new Date().toISOString(),
    };
};

const jobsData = () => {
    jobIds.clear();
    return {
        queued: Array.from({ length: getRandomInt(20, 30) }, () => generateJob('Queued')),
        running: Array.from({ length: getRandomInt(5, 10) }, () => generateJob('Running')),
        completed: Array.from({ length: getRandomInt(20, 30) }, () => generateJob('Completed')),
        failed: Array.from({ length: getRandomInt(1, 3) }, () => generateJob('Failed')),
    }
}

const statsData = () => {
    jobIds.clear();

    const backendDetails = backends.map(backend => {
        const queuedCount = getRandomInt(0, 20);
        const runningCount = getRandomInt(0, 5);
        const completedCount = getRandomInt(10, 30);
        const failedCount = getRandomInt(0, 2);

        let predicted_load: 'low' | 'medium' | 'high' = 'low';
        if (queuedCount > 15 || failedCount > 1) {
            predicted_load = 'high';
        } else if (queuedCount > 5) {
            predicted_load = 'medium';
        }

        return {
            name: backend,
            jobs: [
                ...Array.from({ length: queuedCount }, () => generateJob('Queued', backend)),
                ...Array.from({ length: runningCount }, () => generateJob('Running', backend)),
                ...Array.from({ length: completedCount }, () => generateJob('Completed', backend)),
                ...Array.from({ length: failedCount }, () => generateJob('Failed', backend)),
            ],
            predictions: {
                predicted_load,
                predicted_avg_wait_seconds: queuedCount * getRandomInt(5, 15),
                predicted_success_rate: 1 - (failedCount / (completedCount + failedCount + 1)),
            }
        };
    });

    const allJobsForHistory = [
        ...Array.from({ length: 50 }, () => generateJob('Completed')),
        ...Array.from({ length: 10 }, () => generateJob('Running')),
        ...Array.from({ length: 5 }, () => generateJob('Failed')),
        ...Array.from({ length: 20 }, () => generateJob('Queued')),
    ];
    
    return {
        total_jobs: getRandomInt(1200, 1300),
        running_jobs: allJobsForHistory.filter(j => j.status === 'Running').length,
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
        fastest_backend: "ibmq_qasm_simulator",
        last_updated: new Date().toISOString(),
        backends: backendDetails,
        all_jobs: allJobsForHistory,
    }
};

const recordsData = () => {
    const records = [];
    const recordIds = new Set();
    const totalRecords = 50;

    for (let i = 0; i < totalRecords; i++) {
        let recordId;
        do {
            recordId = `REC-${getRandomInt(1000, 9999)}`;
        } while (recordIds.has(recordId));
        recordIds.add(recordId);

        records.push({
            record_id: recordId,
            job_id: `JOB-${getRandomInt(2000, 3000)}`,
            timestamp: new Date(Date.now() - getRandomInt(1000, 7200000)).toISOString(),
            content: { data: "...", value: getRandomFloat(1, 1000, 2) }
        });
    }
    return records;
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
