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

export const fetchSleepLogs = async (): Promise<SleepLog[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/sleep-logs`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching sleep logs');
  }
};

export const fetchSleepLogDetails = async (logId: number): Promise<SleepLog> => {
  try {
    const response = await axios.get(`${BASE_URL}/sleep-logs/${logId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching sleep log details');
  }
};

export const addNewSleepLog = async (newLog: SleepLog): Promise<SleepLog> => {
  try {
    const response = await axios.post(`${BASE_URL}/sleep-logs`, newLog);
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