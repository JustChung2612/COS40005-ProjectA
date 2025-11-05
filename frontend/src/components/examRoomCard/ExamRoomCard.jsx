// components/examRoomCard/ExamRoomCard.jsx
import "./examRoomCard.scss";
import { SquarePen, Clock3  } from 'lucide-react';
import { useUserStore } from "../../stores/useUserStore";

const ExamRoomCard = () => {

  const { user } = useUserStore();

  const handleStart = () => {
    
  };

  return (
    <div className="examRoomCard-container">
      <div className="card__header">
        <div className="row">
          <h2 className="title"> Phòng ... - Mã </h2>
            {/* <span className="badge"> {status} </span>- Just keep this static */}
        </div>
      </div>

      <div className="card__body">
        <div className="mb-6">
          <p className="info" >Tên Phòng: </p>
          <p className="heading room-name "> Đang cập nhật... </p>
          <p className="info" >Chuyên Ngành: </p>
          <p className="heading terminology "> Đang cập nhật... </p>

          {/* Just keep this timeRange static */}
          <div className="time-row">
            <Clock3 />
            <span style={{ fontWeight: 500 }}>16:00–17:30</span>
          </div>
        </div>

        { user?.role === "admin" 
        ?
          <button className="btn btn-admin" onClick={handleStart}>
             <SquarePen/> Cập nhật
          </button> 
        : 
          <button className="btn" onClick={handleStart}>
            Bắt đầu vào thi
          </button> 
        }
      </div>
    </div>
  );
};

export default ExamRoomCard;
