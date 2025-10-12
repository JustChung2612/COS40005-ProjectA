import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoadingPage.scss';

const LoadingPage = () => {
  const [seconds, setSeconds] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    if (seconds === 0) {
      navigate('/osce');
      return;
    }
    const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, navigate]);

  const progress = (seconds / 5) * 100;

  return (
    <div className="loading-page">
      <div className="loading-card">
        <p>Vui lòng chờ giây lát để vào làm bài thi</p>

    <div className="circle">
        <svg viewBox="0 0 36 36" className="circular-chart">
            <path
            className="circle-bg"
            d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
            className="circle-progress"
            strokeDasharray={`${100 - (seconds / 5) * 100}, 100`}
            d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
        </svg>

          <div className="timer-text">
            <p>Còn lại</p>
            <h2>{seconds}</h2>
            <p>giây</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
