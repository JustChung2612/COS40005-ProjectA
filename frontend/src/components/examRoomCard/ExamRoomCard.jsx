// components/examRoomCard/ExamRoomCard.jsx
import "./examRoomCard.scss";
import { SquarePen, Clock3 } from "lucide-react";
import { useUserStore } from "../../stores/useUserStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";             // 🆕
import { toast } from "react-hot-toast"; // 🆕

const ExamRoomCard = ({ data }) => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { _id, exam_room_code, exam_room_name, terminology, status } = data || {};

  // 🆕 Student starts by joining with room code, then navigate
  const handleStudentStart = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/exam-rooms/join", {
        code: exam_room_code,
      });
      toast.success("🎓 Tham gia phòng thi thành công!");
      const room = res.data.data; // { roomId, exam_room_name, terminology, stations }
      const firstStationId = room?.stations?.[0]?._id;
      
      console.log("🧭 Stations:", room.stations);
      console.log("🧭 First station ID:", firstStationId);


      if (!firstStationId) {
        return toast.error("Phòng thi chưa có trạm. Vui lòng liên hệ giảng viên.");
      }

      navigate(`/osce/tram/${firstStationId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể tham gia phòng thi.");
    }
  };

  return (
    <div className="examRoomCard-container">
      <div className="card__header">
        <div className="row">
          <h2 className="title">
            {exam_room_name || "Phòng chưa đặt tên"} – {exam_room_code}
          </h2>
          {/* Optional badge */}
          {status && (
            <span className="badge">
              {status}
            </span>
          )}
        </div>
      </div>

      <div className="card__body">
        <div className="mb-6">
          <p className="info">Tên Phòng:</p>
          <p className="heading room-name">
            {exam_room_name || "Đang cập nhật..."}
          </p>

          <p className="info">Chuyên Ngành:</p>
          <p className="heading terminology">
            {terminology || "Đang cập nhật..."}
          </p>

          {/* Just keep this timeRange static for now */}
          <div className="time-row">
            <Clock3 />
            <span style={{ fontWeight: 500 }}>16:00–17:30 (demo)</span>
          </div>
        </div>

        {user?.role === "admin" ? (
          <button
            className="btn btn-admin"
            onClick={() => navigate(`/quan-tri/sua-phong/${_id}`)}
          >
            <SquarePen /> Cập nhật
          </button>
        ) : (
          <button className="btn" onClick={handleStudentStart}>
            Bắt đầu vào thi
          </button>
        )}
      </div>
    </div>
  );
};

export default ExamRoomCard;
