import React, { useState, useEffect } from 'react';

interface SleepGoal {
  targetHours: number;
  achievedHours: number;
}

const SleepGoalTracker: React.FC = () => {
  const [sleepGoal, setSleepGoal] = useState<SleepGoal>({ targetHours: 8, achievedHours: 0 });
  const [hoursSlept, setHoursSlept] = useState<number>(0);

  useEffect(() => {
    const initialTargetHours = process.env.REACT_APP_INITIAL_TARGET_HOURS 
                               ? Number(process.env.REACT_APP_INITIAL_TARGET_HOURS)
                               : 8;
    setSleepGoal({ ...sleepGoal, targetHours: initialTargetHours });
  }, []);

  const handleSleepGoalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSleepGoal({ ...sleepGoal, targetHours: Number(event.target.value) });
  };

  const handleHoursSleptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHoursSlept(Number(event.target.value));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSleepGoal({ ...sleepGoal, achievedHours: hoursSlept });
  };

  const progressPercentage = () => {
    const progress = (sleepGoal.achievedHours / sleepGoal.targetHours) * 100;
    return Math.min(progress, 100);
  };

  return (
    <div>
      <h2>Sleep Goal Tracker</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="targetHours">Target Sleep Hours:</label>
          <input
            type="number"
            id="targetHours"
            value={sleepGoal.targetHours}
            onChange={handleSleepGoalChange}
          />
        </div>
        <div>
          <label htmlFor="hoursSlept">Hours Slept Last Night:</label>
          <input
            type="number"
            id="hoursSlept"
            value={hoursSlept}
            onChange={handleHoursSleptChange}
          />
        </div>
        <button type="submit">Update Goal</button>
      </form>
      <div>
        <h3>Progress</h3>
        <progress value={progressPercentage()} max="100"></progress>
        <p>{progressPercentage()}% towards your goal.</p>
      </div>
    </div>
  );
};

export default SleepGoalTracker;