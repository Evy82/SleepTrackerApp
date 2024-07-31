import React from 'react';
import ReactDOM from 'react-dom';
import SleepTrackerApp from './SleepTrackerApp';
import envConfig from 'dotenv';

envConfig.config();

ReactDOM.render(
  <React.StrictMode>
    <SleepTrackerApp />
  </React.StrictMode>,
  document.getElementById('appRoot')
);