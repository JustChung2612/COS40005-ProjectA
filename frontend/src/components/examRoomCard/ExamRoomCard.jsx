// components/examRoomCard/ExamRoomCard.jsx
import { useState } from "react";
import "./examRoomCard.scss";
import { SquarePen, Clock3 } from "lucide-react";
import { useUserStore } from "../../stores/useUserStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";             // 🆕
import { toast } from "react-hot-toast"; // 🆕

const ExamRoomCard = ({ data }) => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const studentEmail = user?.email?.toLowerCase();
  const { _id, exam_room_code, exam_room_name, terminology, status } = data || {};

  const [showEnterCodeModal, setShowEnterCodeModal] = useState(false);
  const [enteredCode, setEnteredCode] = useState("");


  // 🆕 Helper: navigate into the first station of the room
  const goToFirstStation = (room) => {
    const firstStationId = room?.stations?.[0]?._id;

    if (!firstStationId) {
      toast.error("Phòng thi chưa có trạm. Vui lòng liên hệ giảng viên.");
      return false;
    }

    navigate(`/osce/tram/${firstStationId}`);
    return true;
  };

  // 🆕 Unified exam entry logic
  const handleEnterExam = async () => {
    try {
      if (!studentEmail) {
        toast.error("Bạn cần đăng nhập để vào phòng thi.");
        return;
      }

      // Step 1: Check if student is allowed without code
      const check = await axios.get(
        `http://localhost:5000/api/exam-rooms/${_id}/check-allowed`,
        { params: { email: studentEmail } }
      );

      // ✔ Direct Access
      if (check.data?.directAccess) {
        const join = await axios.post("http://localhost:5000/api/exam-rooms/join", {
          email: studentEmail,
          code: exam_room_code
        });

        const room = join.data.data;

        if (goToFirstStation(room)) {
          toast.success("🎉 Bạn được phép vào trực tiếp!");
        }

        return;
      }

      // ❌ NOT allowed → show popup (Feature 4.2)
      setShowEnterCodeModal(true);

    } catch (err) {
      console.error("❌ Lỗi kiểm tra quyền:", err);
      toast.error("Không thể kiểm tra quyền vào phòng.");
    }
  };

  // 🆕 Student submits room code manually
  const handleSubmitRoomCode = async () => {
    if (!enteredCode.trim()) {
      toast.error("Vui lòng nhập mã phòng thi.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/exam-rooms/join", {
        code: enteredCode.trim(),
        email: studentEmail
      });

      const room = res.data.data;

      if (goToFirstStation(room)) {
        toast.success("🎉 Vào phòng thi thành công!");
        setShowEnterCodeModal(false);
      }


    } catch (err) {
      toast.error(err.response?.data?.message || "Mã phòng thi không hợp lệ.");
    }
  };

  return (
    <>
      <div className="examRoomCard-container">
        <div className="card__header">
          <div className="row">
            <h2 className="title">
              {exam_room_name || "Phòng chưa đặt tên"} 
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
            <button className="btn" onClick={handleEnterExam}>
              Bắt đầu vào thi
            </button>
          )}
        </div>
      </div>

        {showEnterCodeModal && (
          <>
            <div className="ad-overlay" onClick={() => setShowEnterCodeModal(false)} />

            <div className="ad-content" role="dialog" aria-modal="true">
              <div className="ad-header">
                <h2 className="ad-title">Nhập Mã Phòng Thi</h2>
                <p className="ad-desc">
                  Email của bạn không có trong danh sách cho phép vào trực tiếp.  
                  Vui lòng nhập mã phòng thi để tiếp tục.
                </p>
              </div>

              <div className="ad-body" style={{ marginBottom: "12px" }}>
                <input
                  type="text"
                  className="input base mono"
                  placeholder="Nhập mã phòng thi..."
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value)}
                />
              </div>

              <div className="ad-footer">
                <button className="btn base btn-outline" onClick={() => setShowEnterCodeModal(false)}>
                  Hủy
                </button>

                <button className="btn base btn-default" onClick={handleSubmitRoomCode}>
                  Xác nhận
                </button>
              </div>
            </div>
          </>
        )}
    </>

    
  );
  
};

export default ExamRoomCard;
