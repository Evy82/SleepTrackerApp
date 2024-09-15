import axios from 'axios';

const BASE_URL = process.env.API_BASE_URL || 'http://example.com/api';

interface SleepLog {
    id?: number;
    date: string;
    duration: number;
}

interface SleepGoal {
    hours: number;
}

const sleepLogCache = new Map<number, SleepLog>();
const sleepLogsCache = {
    lastFetch: 0,
    data: [] as SleepLog[],
};

export const fetchSleepLogs = async (): Promise<SleepLog[]> => {
    const cacheTimeout = 5 * 60 * 1000;
    const now = Date.now();

    if (now - sleepLogsCache.lastFetch < cacheTimeout) {
        return sleepLogsCache.data;
    }

    try {
        const response = await axios.get(`${BASE_URL}/sleep-logs`);
        sleepLogsCache.data = response.data;
        sleepLogsCache.lastFetch = now;
        return response.data;
    } catch (error) {
        throw new Error('Error fetching sleep logs');
    }
};

export const fetchSleepLogDetails = async (logId: number): Promise<SleepLog> => {
    if (sleepLogCache.has(logId)) {
        return sleepLogCache.get(logId) as SleepLog;
    }

    try {
        const response = await axios.get(`${BASE_URL}/sleep-logs/${logId}`);
        sleepLogCache.set(logId, response.data);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching sleep log details');
    }
};

export const addNewSleepLog = async (newLog: SleepLog): Promise<SleepLog> => {
    try {
        const response = await axios.post(`${BASE_URL}/sleep-logs`, newLog);
        sleepLogsCache.lastFetch = 0;
        return response.data;
    } catch (error) {
        throw new Error('Error adding new sleep log');
    }
};

export const setSleepGoal = async (newGoal: SleepGoal): Promise<SleepGoal> => {
    try {
        const response = await axios.post(`${BASE_URL}/sleep-goals`, newGoal);
        return response.data;
    } catch (error) {
        throw new Error('Error setting sleep goal');
    }
};