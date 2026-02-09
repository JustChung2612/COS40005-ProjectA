// InstructorAttempts.jsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Users, Filter } from "lucide-react";
import "./InstructorAttempts.scss";


/* ====== MOCK DATA ====== */
const mockAttempts = [
  { id:"attempt-1", studentName:"Nguyễn Văn An",   studentId:"SV001", attemptNumber:"A12", gradingStatus:"ungraded",   submitTime:"2025-01-15 09:30", cohort:"K18", major: "răng hàm mặt" },
  { id:"attempt-2", studentName:"Trần Thị Bình",   studentId:"SV002", attemptNumber:"A4", gradingStatus:"in-progress", submitTime:"2025-01-15 09:45", cohort:"K18", major: "y cổ truyền"},
  { id:"attempt-3", studentName:"Lê Minh Cường",   studentId:"SV003", attemptNumber:"A4", gradingStatus:"graded",      submitTime:"2025-01-15 10:00", cohort:"K17", major: "y đa khoa"}, 
  { id:"attempt-4", studentName:"Phạm Thu Dung",   studentId:"SV004", attemptNumber:"A4", gradingStatus:"ungraded",    submitTime:"2025-01-15 10:15", cohort:"K18", major: "y nội trú"}, 
  { id:"attempt-5", studentName:"Hoàng Văn Em",    studentId:"SV005", attemptNumber:"A4", gradingStatus:"ungraded",    submitTime:"2025-01-15 10:30", cohort:"K17", major: "răng hàm mặt"},
];

const InstructorAttempts = () => {
  const navigate = useNavigate();
  const { examId } = useParams();
  const [cohortFilter, setCohortFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = mockAttempts.filter(a => {
    if (cohortFilter !== "all" && a.cohort !== cohortFilter) return false;
    if (statusFilter !== "all" && a.gradingStatus !== statusFilter) return false;
    return true;
  });

  const renderStatusBadge = (status) => {
    if (status === "graded") {
      return <span className="ui-badge ui-badge--default on">Đã chấm</span>;
    }
    if (status === "in-progress") {
      return <span className="ui-badge ui-badge--secondary">Đang chấm</span>;
    }
    if (status === "ungraded") {
      return <span className="ui-badge ui-badge--outline">Chưa chấm</span>;
    }
    return null;
  };


  const nextUngraded = filtered.find((a) => a.gradingStatus === "ungraded");

  return (
    <div className="instructor-page attempts">
      {/* Header */}
      <header className="header">
        <div className="container">
            <button className="btn btn--ghost back"
                    onClick={() => {}}
            >
              <ArrowLeft className="ico" /> Quay lại danh sách kỳ thi
            </button>

            <div className="title-row">
              <div>
                <h1 className="h1">Bài thi sinh viên</h1>
                <p className="muted">Kỳ thi Nội khoa - Đợt 1/2025</p>
              </div>
            </div>
        </div>
      </header>

      {/* Content */}
      <main className="container">
        <div className="card">
          <div className="card__content">
              <div className="section-head">
                <h2 className="h2"><Users className="ico" /> Danh sách bài thi ({filtered.length})</h2>

                {/* Filters */}
                <div className="filters">
                  <Filter className="ico muted" />
                  <select
                    className="ui-select"
                    value={cohortFilter}
                    onChange={(e) => setCohortFilter(e.target.value)}
                  >
                    <option value="all">Tất cả khóa</option>
                    <option value="K17">K17</option>
                    <option value="K18">K18</option>
                  </select>

                  <select className="ui-select"
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="ungraded">Chưa chấm</option>
                    <option value="in-progress">Đang chấm</option>
                    <option value="graded">Đã chấm</option>
                  </select>

                </div>
              </div>

              <table className="ui-table">
                <thead className="ui-table__head">
                  <tr className="ui-table__row">
                    <th className="ui-table__cell is-head">Sinh viên</th>
                    <th className="ui-table__cell is-head text-center">Mã SV</th>
                    <th className="ui-table__cell is-head text-center">Khóa</th>
                    <th className="ui-table__cell is-head text-center">Lớp</th>
                    <th className="ui-table__cell is-head text-center">Trạng thái</th>
                    <th className="ui-table__cell is-head text-center">Chuyên ngành</th>
                    <th className="ui-table__cell is-head">Thời gian nộp</th>
                    <th className="ui-table__cell is-head text-right">Thao tác</th>
                  </tr>
                </thead>

                <tbody className="ui-table__body">
                  {filtered.map((a) => (
                    <tr key={a.id} className="ui-table__row hover">
                      <td className="ui-table__cell fw">{a.studentName}</td>
                      <td className="ui-table__cell text-center">{a.studentId}</td>

                      <td className="ui-table__cell text-center">
                        <span className="ui-badge ui-badge--outline">{a.cohort}</span>
                      </td>

                      <td className="ui-table__cell text-center">{a.attemptNumber}</td>

                      <td className="ui-table__cell text-center">
                        {renderStatusBadge(a.gradingStatus)}
                      </td>

                      <td className="ui-table__cell text-center">{a.major}</td>

                      <td className="ui-table__cell muted">{a.submitTime}</td>

                      <td className="ui-table__cell text-right">
                        <button
                          className={`btn ${a.gradingStatus === "ungraded" ? "btn--primary" : "btn--ghost"}`}
                          onClick={() => navigate(`/exams/${examId}/attempts/${a.id}/grade`)}
                        >
                          {a.gradingStatus === "graded" ? "Xem lại" : "Chấm điểm"}
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

export default InstructorAttempts;
