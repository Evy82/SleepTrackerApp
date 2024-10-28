import React, { useState, useEffect } from 'react';

interface SleepTracker {
  goalHours: number;
  achievedHours: number;
}

const SleepTrackerApp: React.FC = () => {
  const [sleepTracker, setSleepTracker] = useState<SleepTracker>({ goalHours: 8, achievedHours: 0 });
  const [sleptHours, setSleptHours] = useState<number>(0);

  useEffect(() => {
    const initialGoalHours = process.env.REACT_APP_INITIAL_GOAL_HOURS 
                               ? Number(process.env.REACT_APP_INITIAL_GOAL_HOURS)
                               : 8;
    setSleepTracker({ ...sleepTracker, goalHours: initialGoalHours });
  }, []);

  const handleGoalHoursChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSleepTracker({ ...sleepTracker, goalHours: Number(event.target.value) });
  };

  const handleSleptHoursChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSleptHours(Number(event.target.value));
  };

  const handleTrackerSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSleepTracker({ ...sleepTracker, achievedHours: sleptHours });
  };

  const calculateProgressPercentage = () => {
    const progress = (sleepTracker.achievedHours / sleepTracker.goalHours) * 100;
    return Math.min(progress, 100);
  };

  return (
    <div>
      <h2>Sleep Tracker</h2>
      <form onSubmit={handleTrackerSubmit}>
        <div>
          <label htmlFor="goalHours">Goal Sleep Hours:</label>
          <input
            type="number"
            id="goalHours"
            value={sleepTracker.goalHours}
            onChange={handleGoalHoursChange}
          />
        </div>
        <div>
          <label htmlFor="sleptHours">Hours Slept Last Night:</label>
          <input
            type="number"
            id="sleptHours"
            value={sleptHours}
            onChange={handleSleptHoursChange}
          />
        </div>
        <button type="submit">Update Goal</button>
      </form>
      <div>
        <h3>Your Sleep Progress</h3>
        <progress value={calculateProgressPercentage()} max="100"></progress>
        <p>{calculateProgressPercentage()}% towards your sleep goal.</p>
      </div>
    </div>
  );
};

export default SleepTrackerApp;