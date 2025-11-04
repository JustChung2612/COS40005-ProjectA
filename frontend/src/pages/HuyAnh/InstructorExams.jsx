import { useNavigate } from "react-router-dom";
import { Clock, FileText } from "lucide-react";
import "./InstructorExams.scss";

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

/* Bảng đơn giản */
const Table = ({ children }) => <table className="ui-table">{children}</table>;
const THead = ({ children }) => <thead className="ui-table__head">{children}</thead>;
const TBody = ({ children }) => <tbody className="ui-table__body">{children}</tbody>;
const TR = ({ children, className = "" }) => <tr className={["ui-table__row", className].join(" ")}>{children}</tr>;
const TH = ({ children, className = "" }) => <th className={["ui-table__cell", "is-head", className].join(" ")}>{children}</th>;
const TD = ({ children, className = "" }) => <td className={["ui-table__cell", className].join(" ")}>{children}</td>;

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
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1 className="h1">Chấm điểm</h1>
          <p className="muted">Quản lý và chấm điểm các kỳ thi</p>
        </div>
      </header>

      {/* Content */}
      <main className="container">
        <Card>
          <CardContent>
            <div className="section-head">
              <h2 className="h2"><FileText className="ico" /> Danh sách kỳ thi</h2>
            </div>

            <Table>
              <THead>
                <TR>
                  <TH>Tên kỳ thi</TH>
                  <TH className="text-center">Số trạm</TH>
                  <TH className="text-center">Trạng thái</TH>
                  <TH className="text-center">Bài nộp</TH>
                  <TH>Thời gian</TH>
                  <TH className="text-right">Thao tác</TH>
                </TR>
              </THead>
              <TBody>
                {mockExams.map((exam) => (
                  <TR key={exam.id} className="hover">
                    <TD className="fw">{exam.name}</TD>
                    <TD className="text-center">{exam.stations}</TD>
                    <TD className="text-center">
                      <Badge variant={exam.status === "ongoing" ? "default" : "secondary"}
                             className={exam.status === "ongoing" ? "on" : ""}>
                        {exam.status === "ongoing" ? "Đang diễn ra" : "Đã kết thúc"}
                      </Badge>
                    </TD>
                    <TD className="text-center fw">{exam.attemptsSubmitted}</TD>
                    <TD>
                      <div className="time">
                        <Clock className="ico" />
                        <div>
                          <div>Mở: {exam.openTime}</div>
                          <div>Đóng: {exam.closeTime}</div>
                        </div>
                      </div>
                    </TD>
                    <TD className="text-right">
                      <Button onClick={() => navigate(`/instructor/exams/${exam.id}/attempts`)}>
                        Mở chấm điểm
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

export default InstructorExams;
