import { useState, useEffect } from "react";
import "./oscePrepRoomPage.scss";

/**
 * OscePrepRoomPage Component
 * ---------------------------------------------
 * Displays exam information and a timed start sequence.
 * - Initially shows a "Bắt đầu làm bài" (Start) button.
 * - When clicked, triggers a countdown (default 5s).
 * - After countdown ends, displays a "Vào làm bài" (Enter) button.
 */
const OscePrepRoomPage = () => {
  // Controls whether the countdown has started
  const [isStarting, setIsStarting] = useState(false);

  // Countdown timer (in seconds)
  const [seconds, setSeconds] = useState(5);

  // Indicates when countdown has finished
  const [done, setDone] = useState(false);

  /**
   * useEffect handles countdown logic.
   * When the exam is starting and time remains,
   * decrease seconds every 1 second.
   */
  useEffect(() => {
    if (isStarting && seconds > 0) {
      const timer = setTimeout(() => setSeconds((prev) => prev - 1), 1000);
      return () => clearTimeout(timer); // cleanup previous timer
    } else if (seconds === 0) {
      setDone(true); // mark countdown complete
    }
  }, [isStarting, seconds]);

  return (
    <div className="exam-info-page">
      <div className="exam-card">
        {/* Section Title */}
        <h4 className="section-title">Thông tin đề thi</h4>

        {/* Main Exam Info Layout */}
        <div className="exam-header">
          {/* Exam Image */}
          <div className="exam-image">
            <img
              src="https://images.unsplash.com/photo-1504813184591-01572f98c85f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1171"
              alt="Exam"
            />
          </div>

          {/* Exam Details (Title, Type, Date, Stats, School Info) */}
          <div className="exam-details">
            <h3>OSCE Preparation Exam #1</h3>
            <p className="exam-type">All Students</p>
            <p className="exam-date">📅 31/10/2025</p>

            {/* Engagement Stats */}
            <div className="exam-stats">
              <span>👍 1</span>
              <span>💬 8</span>
              <span>👁️ 1</span>
              <span>❤️ 0</span>
            </div>

            {/* School Info */}
            <div className="school-info">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/No_image_available.svg/600px-No_image_available.svg.png"
                alt="School"
              />
              <span>Hanoi Medical University</span>
            </div>
          </div>

          {/* Right Section — Start, Countdown, or Enter Button */}
          <div className="start-section">
            {/* Step 1: Show Start Button */}
            {!isStarting ? (
              <button
                className="start-btn"
                onClick={() => setIsStarting(true)}
              >
                Bắt đầu làm bài
              </button>
            ) : !done ? (
              // Step 2: Show Countdown Circle
              <div className="countdown">
                <div className="circle">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    {/* Background Circle */}
                    <path
                      className="circle-bg"
                      d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831
                         a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    {/* Dynamic Progress Circle */}
                    <path
                      className="circle-progress"
                      strokeDasharray={`${(seconds / 5) * 100}, 100`}
                      d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831
                         a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>

                  {/* Centered Countdown Text */}
                  <div className="timer-text">
                    <p>Còn lại</p>
                    <h2>{seconds}</h2>
                    <p>giây</p>
                  </div>
                </div>
              </div>
            ) : (
              // Step 3: Show "Enter Exam" Button After Countdown
              <div className="enter-section">
                <button className="enter-btn">Vào làm bài</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OscePrepRoomPage;
