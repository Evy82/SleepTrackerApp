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
    if (selectedSleepLogId) {
      setIsLoading(true);
      setError(null);
      axios.get<SleepLogDetails>(`${API_BASE_URL}/sleep-logs/${selectedSleepLogId}`)
        .then(response => {
          setSleepLogDetails(response.data);
          setIsLoading(false);
        })
        .catch(error => {
          setError('Failed to fetch sleep log details');
          setIsLoading(false);
        });
    } else {
      setSleepLogDetails(null); 
    }
  }, [selectedSleepLogId]);

  if (isLoading) {
    return <div>Loading sleep log details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
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