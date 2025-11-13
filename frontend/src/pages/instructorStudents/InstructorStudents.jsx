/* eslint-disable */
import {
  Upload,
  UserPlus,
  Trash2,
  Download,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import "./InstructorStudents.scss";

export default function InstructorStudents() {
  const navigate = useNavigate();
  const { roomId } = useParams();

  // ====== state ======
  const [emailInput, setEmailInput] = useState("");
  const [students, setStudents] = useState([
    { email: "nguyenvana@student.edu.vn", name: "Nguyễn Văn A", status: "assigned" },
    { email: "tranthib@student.edu.vn", name: "Trần Thị B", status: "assigned" },
    { email: "lethic@student.edu.vn", status: "invited" },
  ]);

  const [toasts, setToasts] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);

  // ====== mock room ======
  const roomData = {
    id: roomId || "1",
    code: "RM-302",
    name: "OSCE Nội tổng hợp – Ca 2",
  };

  // ====== toast (thay use-toast) ======
  const toast = ({ title, description, variant }) => {
    setToasts((prev) => [...prev, { title, description, variant }]);
    setTimeout(() => setToasts((prev) => prev.slice(1)), 3000);
  };

  // ====== handlers ======
  const handleAddEmails = () => {
    if (!emailInput.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập ít nhất một địa chỉ email.",
        variant: "destructive",
      });
      return;
    }

    const emailList = emailInput
      .split(/[,;\n]/)
      .map((e) => e.trim())
      .filter(Boolean);

    const next = [...students];
    let ok = 0, dup = 0, err = 0;

    emailList.forEach((email) => {
      if (next.some((s) => s.email === email)) {
        dup++;
        return;
      }
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(email)) {
        err++;
        next.push({ email, status: "error", errorMessage: "Định dạng email không hợp lệ" });
        return;
      }
      ok++;
      next.push({ email, status: "invited" });
    });

    setStudents(next);
    setEmailInput("");
    toast({
      title: "Đã thêm học sinh",
      description: `Thành công: ${ok} | Trùng: ${dup} | Lỗi: ${err}`,
    });
  };

  const handleImportCSV = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = String(ev.target?.result || "");
      const lines = text.split("\n").slice(1);
      const imported = lines
        .map((line) => {
          const [email, name] = line.split(",");
          return email?.trim()
            ? { email: email.trim(), name: (name || "").trim(), status: "invited" }
            : null;
        })
        .filter(Boolean);
      setStudents((prev) => [...prev, ...imported]);
      toast({ title: "Đã nhập", description: `Đã thêm ${imported.length} học sinh từ CSV.` });
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleExportCSV = () => {
    const csv = [
      ["Email", "Tên", "Trạng thái"],
      ...students.map((s) => [s.email, s.name || "", s.status]),
    ].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${roomData.code}_students.csv`; a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Đã xuất", description: "Danh sách học sinh đã được tải về." });
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

  // ====== helpers ======
  const StatusIcon = ({ status }) => {
    if (status === "assigned") return <CheckCircle2 className="tw h4 w4 text-success" />;
    if (status === "invited") return <AlertCircle className="tw h4 w4 text-warning" />;
    if (status === "error") return <XCircle className="tw h4 w4 text-destructive" />;
    return null;
  };
  const StatusBadge = ({ status }) => {
    // mapping từ badge.tsx (default/outline/destructive)
    if (status === "assigned")
      return <div className="badge base badge-default">Đã gán</div>;
    if (status === "invited")
      return <div className="badge base badge-outline">Đã mời</div>;
    if (status === "error")
      return <div className="badge base badge-destructive">Lỗi</div>;
    return null;
  };

  const validCount = students.filter((s) => s.status !== "error").length;
  const errorCount = students.filter((s) => s.status === "error").length;

  return (
    <div className="page bg-background text-foreground">
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
                <button className="btn base btn-default grow" onClick={handleAddEmails}>
                  <UserPlus className="tw h4 w4 mr2" />
                  Thêm Email
                </button>

                <label htmlFor="csv-upload">
                  <span className="btn base btn-outline cursor">
                    <Upload className="tw h4 w4 mr2" />
                    Nhập CSV
                  </span>
                </label>
                <input id="csv-upload" type="file" accept=".csv" className="hidden" onChange={handleImportCSV} />
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
              <button className="btn base btn-outline btn-sm" onClick={handleExportCSV} disabled={students.length === 0}>
                <Download className="tw h4 w4 mr2" />
                Xuất CSV
              </button>
            </div>
            <div className="card-content">
              <div className="table-wrap">
                <table className="table">
                  <thead className="thead">
                    <tr className="trow head">
                      <th className="th">Email</th>
                      <th className="th">Tên</th>
                      <th className="th">Trạng thái</th>
                      <th className="th w-compact"></th>
                    </tr>
                  </thead>
                  <tbody className="tbody">
                    {students.map((s) => (
                      <tr key={s.email} className="trow">
                        <td className="td mono">{s.email}</td>
                        <td className="td">{s.name || "-"}</td>
                        <td className="td">
                          <div className="row gap2">
                            <StatusIcon status={s.status} />
                            <StatusBadge status={s.status} />
                          </div>
                          {s.errorMessage && <p className="small text-destructive mt4">{s.errorMessage}</p>}
                        </td>
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

      {/* Toasts */}
      <div className="toast">
        {toasts.map((t, i) => (
          <div key={i} className={"toast-item " + (t.variant === "destructive" ? "destructive" : "")}>
            <div className="toast-title">{t.title}</div>
            {t.description && <div className="toast-desc">{t.description}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
