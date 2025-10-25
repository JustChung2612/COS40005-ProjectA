// components/examRoomCard/ExamRoomCard.jsx
import "./examRoomCard.scss";

const ExamRoomCard = ({
  roomLabel = "Phòng 302 · RM-302",
  status = "Chuẩn bị",
  title = "OSCE Nội tổng hợp – Ca 2",
  timeRange = "14:00–15:30",
  onStart,
}) => {
  const handleStart = () => {
    if (typeof onStart === "function") onStart();
  };

  return (
    <div className="examRoomCard-container">
      <div className="card__header">
        <div className="row">
          <h2 className="title">{roomLabel}</h2>
          <span className="badge">{status}</span>
        </div>
      </div>

      <div className="card__body">
        <div className="mb-6">
          <h3 className="heading">{title}</h3>
          <div className="time-row">
            {/* inline SVG clock to avoid extra deps */}
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span style={{ fontWeight: 500 }}>{timeRange}</span>
          </div>
        </div>

        <button className="btn" onClick={handleStart}>
          Bắt đầu vào thi
        </button>
      </div>
    </div>
  );
};

export default ExamRoomCard;
