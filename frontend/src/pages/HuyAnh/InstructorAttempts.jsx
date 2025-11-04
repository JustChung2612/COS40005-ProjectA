import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Users, Filter } from "lucide-react";
import "./InstructorAttempts.scss";

/* ====== UI PRIMITIVES (local) ====== */
const Button = ({ children, variant = "primary", size = "md", className = "", ...props }) => {
  const cls = ["btn", `btn--${variant}`, `btn--${size}`, className].join(" ");
  return <button className={cls} {...props}>{children}</button>;
};

const Card = ({ className = "", children }) => <div className={["card", className].join(" ")}>{children}</div>;
const CardContent = ({ className = "", children }) => <div className={["card__content", className].join(" ")}>{children}</div>;
const Badge = ({ children, variant = "default", className = "" }) => (
  <span className={["ui-badge", `ui-badge--${variant}`, className].join(" ")}>{children}</span>
);

/* Select (native) */
const Select = ({ value, onChange, children, className = "" }) => (
  <select className={["ui-select", className].join(" ")} value={value} onChange={(e)=>onChange(e.target.value)}>
    {children}
  </select>
);
const Option = ({ value, children }) => <option value={value}>{children}</option>;

/* Bảng */
const Table = ({ children }) => <table className="ui-table">{children}</table>;
const THead = ({ children }) => <thead className="ui-table__head">{children}</thead>;
const TBody = ({ children }) => <tbody className="ui-table__body">{children}</tbody>;
const TR = ({ children, className = "" }) => <tr className={["ui-table__row", className].join(" ")}>{children}</tr>;
const TH = ({ children, className = "" }) => <th className={["ui-table__cell", "is-head", className].join(" ")}>{children}</th>;
const TD = ({ children, className = "" }) => <td className={["ui-table__cell", className].join(" ")}>{children}</td>;

/* ====== MOCK DATA ====== */
const mockAttempts = [
  { id:"attempt-1", studentName:"Nguyễn Văn An",   studentId:"SV001", attemptNumber:1, autoScore:75, gradingStatus:"ungraded",   submitTime:"2025-01-15 09:30", cohort:"K18" },
  { id:"attempt-2", studentName:"Trần Thị Bình",   studentId:"SV002", attemptNumber:1, autoScore:82, gradingStatus:"in-progress", submitTime:"2025-01-15 09:45", cohort:"K18" },
  { id:"attempt-3", studentName:"Lê Minh Cường",   studentId:"SV003", attemptNumber:1, autoScore:68, gradingStatus:"graded",      submitTime:"2025-01-15 10:00", cohort:"K17" },
  { id:"attempt-4", studentName:"Phạm Thu Dung",   studentId:"SV004", attemptNumber:1, autoScore:91, gradingStatus:"ungraded",    submitTime:"2025-01-15 10:15", cohort:"K18" },
  { id:"attempt-5", studentName:"Hoàng Văn Em",    studentId:"SV005", attemptNumber:1, autoScore:77, gradingStatus:"ungraded",    submitTime:"2025-01-15 10:30", cohort:"K17" },
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

  const getStatusBadge = (status) => {
    switch (status) {
      case "graded":      return <Badge className="on">Đã chấm</Badge>;
      case "in-progress": return <Badge variant="secondary">Đang chấm</Badge>;
      case "ungraded":    return <Badge variant="outline">Chưa chấm</Badge>;
      default: return null;
    }
  };

  const nextUngraded = filtered.find((a) => a.gradingStatus === "ungraded");

  return (
    <div className="instructor-page attempts">
      {/* Header */}
      <header className="header">
        <div className="container">
          <Button variant="ghost" onClick={() => navigate("/instructor/exams")} className="back">
            <ArrowLeft className="ico" /> Quay lại danh sách kỳ thi
          </Button>
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
        <Card>
          <CardContent>
            <div className="section-head">
              <h2 className="h2"><Users className="ico" /> Danh sách bài thi ({filtered.length})</h2>

              {/* Filters */}
              <div className="filters">
                <Filter className="ico muted" />
                <Select value={cohortFilter} onChange={setCohortFilter}>
                  <Option value="all">Tất cả khóa</Option>
                  <Option value="K17">K17</Option>
                  <Option value="K18">K18</Option>
                </Select>
                <Select value={statusFilter} onChange={setStatusFilter}>
                  <Option value="all">Tất cả trạng thái</Option>
                  <Option value="ungraded">Chưa chấm</Option>
                  <Option value="in-progress">Đang chấm</Option>
                  <Option value="graded">Đã chấm</Option>
                </Select>
              </div>
            </div>

            <Table>
              <THead>
                <TR>
                  <TH>Sinh viên</TH>
                  <TH className="text-center">Mã SV</TH>
                  <TH className="text-center">Khóa</TH>
                  <TH className="text-center">Lần thi</TH>
                  <TH className="text-center">Điểm tự động</TH>
                  <TH className="text-center">Trạng thái</TH>
                  <TH>Thời gian nộp</TH>
                  <TH className="text-right">Thao tác</TH>
                </TR>
              </THead>
              <TBody>
                {filtered.map((a) => (
                  <TR key={a.id} className="hover">
                    <TD className="fw">{a.studentName}</TD>
                    <TD className="text-center">{a.studentId}</TD>
                    <TD className="text-center"><Badge variant="outline">{a.cohort}</Badge></TD>
                    <TD className="text-center">{a.attemptNumber}</TD>
                    <TD className="text-center fw">{a.autoScore}%</TD>
                    <TD className="text-center">{getStatusBadge(a.gradingStatus)}</TD>
                    <TD className="muted">{a.submitTime}</TD>
                    <TD className="text-right">
                      <Button
                        variant={a.gradingStatus === "ungraded" ? "primary" : "ghost"}
                        onClick={() => navigate(`/instructor/exams/${examId}/attempts/${a.id}/grade`)}
                      >
                        {a.gradingStatus === "graded" ? "Xem lại" : "Chấm điểm"}
                      </Button>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default InstructorAttempts;
