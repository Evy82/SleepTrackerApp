import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface SleepLogDetails {
  id: number;
  date: string;
  duration: number;
  quality: string;
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

interface SleepLogProps {
  selectedSleepLogId: number | null;
}

const SleepLogDetailsComponent: React.FC<SleepLogProps> = ({ selectedSleepLogId }) => {
  const [sleepLogDetails, setSleepLogDetails] = useState<SleepLogDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSleepLogDetails = async () => {
      if (selectedSleepLogId) {
        setIsLoading(true);
        setError(null);
        try {
          const response = await axios.get<SleepLogDetails>(`${API_BASE_URL}/sleep-logs/${selectedSleepLogId}`);
          setSleepLogDetails(response.data);
        } catch (err) {
          if (axios.isAxiosError(err)) {
            setError(err.response?.data.message || 'An unexpected error occurred');
          } else {
            setError('An unexpected error occurred');
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        setSleepLogDetails(null);
      }
    };

    fetchSleepLogDetails();
  }, [selectedSleepLogId]);

  if (isLoading) {
    return <div>Loading sleep log details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!sleepLogDetails) {
    return <div>No sleep log selected</div>;
  }

  return (
    <div>
      <h2>Sleep Log Details</h2>
      <div>Date: {sleepLogDetails.date}</div>
      <div>Duration: {sleepLogDetails.duration} hours</div>
      <div>Quality: {sleepLogDetails.quality}</div>
    </div>
  );
};

export default SleepLogDetailsComponent;