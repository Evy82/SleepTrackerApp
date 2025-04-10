import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
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
  onSleepLogSaved: (sleepLog: SleepLogDetails) => void; // Callback function to refresh the list or take other actions on save
}

const SleepLogDetailsComponent: React.FC<SleepLogProps> = ({ selectedSleepLogId, onSleepLogSaved }) => {
  const [sleepLogDetails, setSleepLogDetails] = useState<SleepLogDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // States for form inputs
  const [date, setDate] = useState<string>('');
  const [duration, setDuration] = useState<number>(0);
  const [quality, setQuality] = useState<string>('');

  useEffect(() => {
    const fetchSleepLogDetails = async () => {
      setIsLoading(true);
      setError(null);
      if (selectedSleepLogId) {
        try {
          const response = await axios.get<SleepLogDetails>(`${API_BASE_URL}/sleep-logs/${selectedSleepLogId}`);
          setSleepLogDetails(response.data);
          setDate(response.data.date);
          setDuration(response.data.duration);
          setQuality(response.data.quality);
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
        setDate('');
        setDuration(0);
        setQuality('');
        setIsLoading(false);
      }
    };

    fetchSleepLogDetails();
  }, [selectedSleepLogId]);

  // Handlers for form inputs
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value);
  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>) => setDuration(Number(e.target.value));
  const handleQualityChange = (e: ChangeEvent<HTMLInputElement>) => setQuality(e.target.value);

  // Handle form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const payload = { date, duration, quality };
      let response;
      if (selectedSleepLogId) {
        response = await axios.put<SleepLogDetails>(`${API_BASE_URL}/sleep-logs/${selectedSleepLogId}`, payload);
      } else {
        response = await axios.post<SleepLogDetails>(`${API_BASE_URL}/sleep-logs`, payload);
      }
      setSleepLogDetails(response.data);
      onSleepLogSaved(response.data); // Notify parent component or handle as needed
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.message || 'An unexpected error occurred');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return <div>Loading sleep log details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>{selectedSleepLogId ? 'Edit' : 'Add'} Sleep Log</h2>
      <form onSubmit={handleSubmit}>
        <input type="date" value={date} onChange={handleDateChange} required />
        <input type="number" value={duration} onChange={handleDurationChange} min="0" required />
        <select value={quality} onChange={handleQualityChange} required>
          <option value="">Select Quality</option>
          <option value="Poor">Poor</option>
          <option value="Fair">Fair</option>
          <option value="Good">Good</option>
          <option value="Excellent">Excellent</option>
        </select>
        <button type="submit">{selectedSleepLogId ? 'Update' : 'Add'} Log</button>
      </form>

      {sleepLogDetails && (
        <>
          <h2>Sleep Log Details</h2>
          <div>Date: {sleepLogDetails.date}</div>
          <div>Duration: {sleepLogDetails.duration} hours</div>
          <div>Quality: {sleepLogDetails.quality}</div>
        </>
      )}
    </div>
  );
};

export default SleepLogDetailsComponent;