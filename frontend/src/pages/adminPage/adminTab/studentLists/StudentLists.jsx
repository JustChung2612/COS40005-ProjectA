/* eslint-disable */
import { Upload, UserPlus, Trash2, Download, CheckCircle2, XCircle, AlertCircle,ArrowLeft, } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import "./studentlists.scss";

export default function StudentLists() {
  const navigate = useNavigate();
  const { roomId } = useParams();

  // ====== state ======
  const [emailInput, setEmailInput] = useState("");
  const [students, setStudents] = useState([
    { email: "nguyenvana@student.edu.vn", name: "Nguyễn Văn A", status: "assigned" },
    { email: "tranthib@student.edu.vn", name: "Trần Thị B", status: "assigned" },
    { email: "lethic@student.edu.vn", status: "invited" },
  ]);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);

  // ====== mock room ======
  const roomData = {
    id: roomId || "1",
    code: "RM-302",
    name: "OSCE Nội tổng hợp – Ca 2",
  };

  const handleDeleteStudent = (email) => {
    setSelectedEmail(email);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedEmail) {
      setStudents((prev) => prev.filter((s) => s.email !== selectedEmail));
      toast({ title: "Đã xóa", description: `Đã gỡ ${selectedEmail} khỏi danh sách.` });
    }
    setSelectedEmail(null);
    setShowDeleteDialog(false);
  };
  const validCount = students.filter((s) => s.status !== "error").length;
  const errorCount = students.filter((s) => s.status === "error").length;

  return (
    <div className=" student-lists-page ">
      {/* Header */}
      <div className="container">
        <div className="header">
          <button className="btn base btn-ghost btn-icon" onClick={() => navigate("/")}>
            <ArrowLeft className="tw h5 w5" /> 
          </button>
          <div>
            <h1 className="h1">Gán Học Sinh</h1>
            <p className="muted">{roomData.name} ({roomData.code})</p>
          </div>
        </div>

        <div className="grid2 gap6">
          {/* LEFT */}
          <div className="card">
            <div className="card-head">
              <h3 className="h3">Thêm Học Sinh</h3>
              <p className="muted small">Nhập email hoặc tải lên CSV (ngăn cách bằng dấu phẩy hoặc xuống dòng)</p>
            </div>
            <div className="card-content">
              <textarea
                className="textarea base mono"
                rows={8}
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder={"student1@edu.vn\nstudent2@edu.vn, student3@edu.vn\n..."}
              />
              <div className="row gap2">
                <button className="btn base btn-default grow" >
                  <UserPlus className="tw h4 w4 mr2" />
                  Thêm Email
                </button>

                <label htmlFor="csv-upload">
                  <span className="btn base btn-outline cursor">
                    <Upload className="tw h4 w4 mr2" />
                    Nhập CSV
                  </span>
                </label>
                <input id="csv-upload" type="file" accept=".csv" className="hidden" />
              </div>

              <div className="tips">
                <p className="muted small mb2">💡 <strong>Mẹo:</strong> Dán nhiều email cùng lúc</p>
                <ul className="tips-list">
                  <li>Ngăn cách bằng dấu phẩy (,) hoặc xuống dòng</li>
                  <li>Email trùng sẽ tự động bị bỏ qua</li>
                  <li>Định dạng CSV: Email, Tên (tùy chọn)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="card">
            <div className="card-head row between">
              <div>
                <h3 className="h3">Danh Sách Học Sinh ({students.length})</h3>
                <p className="muted small">Xem trước và quản lý học sinh đã gán</p>
              </div>
            </div>
            <div className="card-content">
              <div className="table-wrap">
                <table className="table">
                  <thead className="thead">
                    <tr className="trow head">
                      <th className="th">Email</th>
                      <th className="th">Tên</th>
                      <th className="th w-compact"></th>
                    </tr>
                  </thead>
                  <tbody className="tbody">
                    {students.map((s) => (
                      <tr key={s.email} className="trow">
                        <td className="td mono">{s.email}</td>
                        <td className="td">{s.name || "-"}</td>

                        <td className="td actions">
                          <button className="btn base btn-ghost btn-icon" onClick={() => handleDeleteStudent(s.email)}>
                            <Trash2 className="tw h4 w4 text-destructive" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {students.length === 0 && <div className="empty">Chưa có học sinh nào được thêm</div>}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="card mt6">
          <div className="card-content">
            <div className="row between wrap gap3">
              <div className="muted small">
                <strong>{validCount}</strong> học sinh hợp lệ • <strong>{errorCount}</strong> lỗi
              </div>
              <div className="row gap3">
                <button className="btn base btn-outline" onClick={() => navigate("/instructor/rooms")}>Hủy</button>
                <button className="btn base btn-default" onClick={() => toast({title:"Đã phát hành", description:`${validCount} học sinh có thể thấy phòng thi.`})} disabled={validCount === 0}>
                  <CheckCircle2 className="tw h4 w4 mr2" />
                  Lưu &amp; Phát Hành Danh Sách
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AlertDialog (từ alert-dialog.tsx -> markup thuần + class tương đương) */}
      {showDeleteDialog && (
        <>
          <div className="ad-overlay" onClick={() => setShowDeleteDialog(false)} />
          <div className="ad-content" role="dialog" aria-modal="true">
            <div className="ad-header">
              <h2 className="ad-title">Xác nhận xóa</h2>
              <p className="ad-desc">
                Bạn có chắc muốn gỡ <strong>{selectedEmail}</strong> khỏi phòng thi này?
                Học sinh sẽ không còn thấy phòng trên trang chủ.
              </p>
            </div>
            <div className="ad-footer">
              <button className="btn base btn-outline" onClick={() => setShowDeleteDialog(false)}>Hủy</button>
              <button className="btn base btn-default" onClick={confirmDelete}>Xóa</button>
            </div>
          </div>
        </>
      )}


    </div>
  );
}
