import React, { useState } from 'react';
import axios from 'axios';

interface SleepLogForm {
  date: string;
  hoursSlept: number;
  mood: string;
}

const AddSleepLog: React.FC = () => {
  const [formState, setFormState] = useState<SleepLogForm>({
    date: '',
    hoursSlept: 0,
    mood: '',
  });

  const convertValue = (name: string, value: string) => {
    if (name === 'hoursSlept') {
      const parsedValue = parseInt(value, 10);
      if (isNaN(parsedValue)) {
        alert('Please enter a valid number for hours slept.');
        return 0;
      }
      return parsedValue;
    }
    return value;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: convertValue(name, value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sleepLogs`, formState);
      console.log(response.data);
      alert('Sleep log added successfully!');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Failed to submit sleep log:', error.response?.data || error.message);
        alert(`Error submitting sleep log: ${error.response?.data?.message || error.message}`);
      } else if (error instanceof Error) {
        console.error('An unexpected error occurred:', error.message);
        alert(`An unexpected error occurred: ${error.message}`);
      }
    }
  };

  return (
    <div>
      <h2>Add New Sleep Log</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formState.date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="hoursSlept">Hours Slept:</label>
          <input
            type="number"
            id="hoursSlept"
            name="hoursSlept"
            value={formState.hoursSlept.toString()}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="mood">Mood:</label>
          <input
            type="text"
            id="mood"
            name="mood"
            value={formState.mood}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Add Log</button>
      </form>
    </div>
  );
};

export default AddSleepLog;