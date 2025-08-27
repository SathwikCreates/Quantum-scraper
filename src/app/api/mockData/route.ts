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
        totalJobsChange: `+${getRandomFloat(18, 22, 1)}% from last month`,
        activeJobs: getRandomInt(10, 15).toLocaleString(),
        activeJobsChange: 'Currently running',
        dataPoints: `${getRandomFloat(1.3, 1.5, 1)}M`,
        dataPointsChange: `+${getRandomFloat(170, 190, 1)}% from last month`,
        successRate: `${getRandomFloat(98, 99, 1)}%`,
        successRateChange: `+${getRandomFloat(2, 3, 1)}% from last month`,
    },
    recentJobs: [
        { id: `JOB-${getRandomInt(100,999)}`, target: 'example.com', status: 'Completed', dataPoints: getRandomInt(1000, 1500) },
        { id: `JOB-${getRandomInt(100,999)}`, target: 'anothersite.dev', status: 'Running', dataPoints: getRandomInt(400, 500) },
        { id: `JOB-${getRandomInt(100,999)}`, target: 'test-scrape.io', status: 'Failed', dataPoints: 0 },
        { id: `JOB-${getRandomInt(100,999)}`, target: 'data-source.net', status: 'Completed', dataPoints: getRandomInt(8000, 9000) },
        { id: `JOB-${getRandomInt(100,999)}`, target: 'web-archive.org', status: 'Completed', dataPoints: getRandomInt(2000, 2500) },
    ],
});

const jobsData = () => {
    const statuses: Array<'Completed' | 'Running' | 'Failed' | 'Queued'> = ['Completed', 'Running', 'Failed', 'Queued'];
    const backends = ['ibm_q_16_melbourne', 'ibmq_armonk', 'ibmq_santiago', 'ibmq_bogota', 'ibmq_lima', 'ibmq_belem', 'ibmq_quito'];
    
    return Array.from({ length: 20 }, (_, i) => {
        const status = statuses[getRandomInt(0,3)];
        return {
            id: `job-${getRandomInt(10000, 99999)}`,
            backend: backends[getRandomInt(0, backends.length - 1)],
            status: status,
            queuePosition: status === 'Queued' ? getRandomInt(1, 50) : null,
            submittedTime: new Date(Date.now() - getRandomInt(1000, 3600000)).toLocaleString(),
            runtime: status === 'Completed' || status === 'Running' ? `${getRandomInt(5, 300)}s` : 'N/A'
        }
    });
}

const statsData = () => ({
    avgWaitTime: {
        labels: Array.from({length: 7}, (_, i) => `T-${(6-i)*10}m`),
        data: Array.from({length: 7}, () => getRandomInt(30, 120)),
    },
    backendUsage: {
        labels: ['ibm_q_16_melbourne', 'ibmq_santiago', 'ibmq_bogota', 'ibmq_lima', 'ibmq_belem'],
        data: Array.from({length: 5}, () => getRandomInt(5, 50)),
    },
    jobStatusDistribution: {
        labels: ['Completed', 'Running', 'Failed', 'Queued'],
        data: [getRandomInt(100, 200), getRandomInt(10, 20), getRandomInt(5, 15), getRandomInt(20, 40)],
    }
});


const exploreData = () => {
    return Array.from({ length: 15 }, () => ({
        id: `REC-${getRandomInt(1000, 9999)}`,
        sourceJob: `JOB-${getRandomInt(2000, 3000)}`,
        timestamp: new Date(Date.now() - getRandomInt(1000, 7200000)).toLocaleString(),
        content: `{"data": "...", "value": ${getRandomFloat(1, 1000, 2)}}`
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
        case 'explore':
            data = exploreData();
            break;
        default:
            return NextResponse.json({ error: 'Invalid data type requested' }, { status: 400 });
    }

    return NextResponse.json(data);
}
