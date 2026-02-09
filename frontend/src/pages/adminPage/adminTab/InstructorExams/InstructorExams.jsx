//InstructorExams.jsx
import { useNavigate } from "react-router-dom";
import { Clock, FileText } from "lucide-react";
import "./InstructorExams.scss";

/* ====== MOCK DATA (giữ nguyên ý nghĩa gốc) ====== */
const mockExams = [
  { id: "exam-1", name: "Kỳ thi Nội khoa - Đợt 1/2025", stations: 20, status: "ongoing", attemptsSubmitted: 45, openTime: "2025-01-15 08:00", closeTime: "2025-01-15 12:00" },
  { id: "exam-2", name: "Kỳ thi Ngoại khoa - Đợt 1/2025", stations: 15, status: "closed",  attemptsSubmitted: 52, openTime: "2025-01-10 08:00", closeTime: "2025-01-10 12:00" },
  { id: "exam-3", name: "Kỳ thi Sản phụ khoa - Đợt 12/2024", stations: 18, status: "closed",  attemptsSubmitted: 48, openTime: "2024-12-20 08:00", closeTime: "2024-12-20 12:00" },
];

const InstructorExams = () => {
  const navigate = useNavigate();

  return (
    <div className="instructor-page exams">

      {/* Content */}
      <main className="container">
        <div className="card">
          <div className="card__content">
            <div className="section-head">
              <h2 className="h2"><FileText className="ico" /> Danh sách kỳ thi</h2>
            </div>

            <table className="ui-table">
              <thead className="ui-table__head">
                <tr className="ui-table__row">
                  <th className="ui-table__cell is-head">Tên kỳ thi</th>
                  <th className="ui-table__cell is-head text-center">Số trạm</th>
                  <th className="ui-table__cell is-head text-center">Trạng thái</th>
                  <th className="ui-table__cell is-head text-center">Bài nộp</th>
                  <th className="ui-table__cell is-head">Thời gian</th>
                  <th className="ui-table__cell is-head text-right">Thao tác</th>
                </tr>
              </thead>

              <tbody className="ui-table__body">
                {mockExams.map((exam) => (
                  <tr key={exam.id} className="ui-table__row hover">
                    <td className="ui-table__cell fw">{exam.name}</td>

                    <td className="ui-table__cell text-center">{exam.stations}</td>

                    <td className="ui-table__cell text-center">
                      <span
                        className={[
                          "ui-badge",
                          exam.status === "ongoing" ? "ui-badge--default on" : "ui-badge--secondary",
                        ].join(" ")}
                      >
                        {exam.status === "ongoing" ? "Đang diễn ra" : "Đã kết thúc"}
                      </span>
                    </td>

                    <td className="ui-table__cell text-center fw">{exam.attemptsSubmitted}</td>

                    <td className="ui-table__cell">
                      <div className="time">
                        <Clock className="ico" />
                        <div>
                          <div>Mở: {exam.openTime}</div>
                          <div>Đóng: {exam.closeTime}</div>
                        </div>
                      </div>
                    </td>

                    <td className="ui-table__cell text-right">
                      <button
                        className="btn"
                        onClick={() => {}}
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>
      </main>
    </div>
  );
};

export default InstructorExams;
