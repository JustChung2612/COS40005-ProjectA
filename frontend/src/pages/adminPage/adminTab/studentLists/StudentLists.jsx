/* eslint-disable */
import "./studentlists.scss";
import { Upload, UserPlus, Trash2, Download, CheckCircle2, XCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";

export default function StudentLists() {

  // ====== STATE ======

  const [emailInput, setEmailInput] = useState("");

  // 🆕 Students assigned to the currently-selected room
  const [roomStudents, setRoomStudents] = useState([]);

  // 🆕NEW: which input mode is selected: "manual" or "upload"
  const [inputMode, setInputMode] = useState("manual");

  // 🆕 Store real exam rooms fetched from backend
  const [examRooms, setExamRooms] = useState([]);

  // 🆕 Store which room is selected (roomId)
  const [selectedExamRoom, setSelectedExamRoom] = useState(null);

  // 🆕 Loading indicators
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);


  // 🆕 Add student emails manually
  const handleAddEmails = () => {
    if (!emailInput.trim()) return;

    if (!selectedExamRoom) {
      toast.error("Vui lòng chọn phòng thi trước khi thêm email.");
      return;
    }

    // Split by comma OR newline
    const splitEmails = emailInput
      .split(/[\n,]+/)
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.length > 0);

    // Convert emails into student objects
    const newStudents = splitEmails
      .filter((email) => !roomStudents.some((s) => s.email === email))
      .map((email) => ({
        email,
        name: "-",
        studentCode: "-",
        group: "-",
        className: "-",
        phone: "-",
      }));
    // Add to current list
    setRoomStudents((prev) => [...prev, ...newStudents]);
    // Clear textarea
    setEmailInput("");
  };

  // 🆕 Handle Excel Upload
  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];

    if (!selectedExamRoom) {
      toast.error("Vui lòng chọn phòng thi trước khi tải file Excel.");
      return;
    }

    if (!file) return;

    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = (evt) => {
      try {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const parsedRows = XLSX.utils.sheet_to_json(sheet);

        // Convert Excel rows into student objects
        const extractedStudents = parsedRows.map((row) => {
          const rawKeys = Object.keys(row);

          // Detect email key
          const emailKey = rawKeys.find((k) =>
            k.toLowerCase().trim().includes("email") ||
            k.toLowerCase().trim().includes("gmail") ||
            k.toLowerCase().trim().includes("mail")
          );

          if (!emailKey) return null;

          const student = {
            email: String(row[emailKey]).trim().toLowerCase(),
            name: row["Họ và tên"] || row["Ho ten"] || row["Name"] || "-",
            studentCode: row["Mã SV"] || row["Ma SV"] || row["StudentCode"] || "-",
            group: row["Tổ"] || row["To"] || row["Group"] || "-",
            className: row["Lớp"] || row["Lop"] || row["Class"] || "-",
            phone: row["Điện thoại"] || row["Dien thoai"] || row["Phone"] || "-",
          };

          return student;
        }).filter(Boolean);

        // Remove duplicates by email
        const uniqueStudents = extractedStudents.filter(
          (s) => !roomStudents.some((x) => x.email === s.email)
        );

        // Add to current student list
        setRoomStudents((prev) => [...prev, ...uniqueStudents]);

      } catch (error) {
        console.error("❌ Lỗi khi đọc file Excel:", error);
      }
    };
  };

  // 🆕 Save students to backend
  const handleSaveToBackend = async () => {
    if (!selectedExamRoom) { toast.error("Vui lòng chọn một phòng thi."); return; }
    if (roomStudents.length === 0) {  toast.error("Danh sách học sinh trống."); return; }

    setSaving(true);
    try {
      // Extract ONLY email list for backend
      const emailList = roomStudents.map((s) => s.email);

      await axios.post(
        `http://localhost:5000/api/exam-rooms/${selectedExamRoom}/students`,
        { students: emailList }
      );

      toast.success("Bạn đã thêm danh sách vào phòng thi thành công!");
    } catch (err) {
      console.error("❌ Lỗi khi lưu danh sách vào backend:", err);
      toast.error("Không thể lưu danh sách. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  // 🆕 Fetch rooms from backend

  useEffect(() => {
    const fetchRooms = async () => {
      setLoadingRooms(true);
      try {
        const res = await axios.get("http://localhost:5000/api/exam-rooms");
        if (Array.isArray(res.data?.data)) {
          setExamRooms(res.data.data);
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải phòng thi:", err);
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
  }, []);


  // 🆕 Load assigned students whenever teacher selects a room
  useEffect(() => {
    if (!selectedExamRoom) return;

    const fetchRoomStudents = async () => {
      setLoadingStudents(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/exam-rooms/${selectedExamRoom}/students`);
        const loadedEmails = res.data?.students || [];

        // Convert email strings → same object structure as Excel/manual
        const loadedStudents = loadedEmails.map((email) => ({
          email,
          name: "-",
          studentCode: "-",
          group: "-",
          className: "-",
          phone: "-",
        }));

        setRoomStudents(loadedStudents);

      } catch (err) {
        console.error("❌ Lỗi khi tải danh sách học sinh cho phòng:", err);
        setRoomStudents([]); // fallback to empty list
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchRoomStudents();
  }, [selectedExamRoom]);



  return (
    <div className="student-lists-tab">
      <div className="sl-container">
        {/* --- TOP SECTION --- */}
        <div className="sl-top">
          <h2>Danh Sách Phòng Thi</h2>
          <div className="exam-name-list">
            {examRooms.length === 0 ? (
              <p>Không có phòng thi nào.</p>
            ) : (
              examRooms.map((room) => (
                <div
                  key={room._id}
                  className={`exam-room-tab ${selectedExamRoom === room._id ? 'exam-room-tab--selected' : ''}`}
                  onClick={() => setSelectedExamRoom(room._id)}
                >
                  {room.exam_room_name}
                </div>
              ))
            )}
          </div>

        </div>

        {/* --- MAIN SECTION --- */}
        <div className="sl-main">
          {/* Card TOP */}
          <div className="sl-card sl-card-top">
            <div className="sl-card-head">
              <h3>Thêm Học Sinh</h3>
              <p className="muted small">
                Nhập email hoặc tải file Excel (ngăn cách bằng dấu phẩy hoặc xuống dòng)
              </p>
            </div>

            <div className="card-content">
              {/* --- SWITCH --- */}
              <div className="switch-student-option">
                <div>
                  <input type="radio" name="switch" id="manual"
                    checked={inputMode === "manual"}
                    onChange={() => setInputMode("manual")}
                  />
                  <label htmlFor="manual" className="switch login">
                    Nhập Email
                  </label>
                </div>

                <div>
                  <input type="radio" name="switch" id="upload"
                    checked={inputMode === "upload"}
                    onChange={() => setInputMode("upload")}
                  />
                  <label htmlFor="upload" className="switch signup">
                    Tải File Excel
                  </label>
                </div>

              </div>

              {/* --- OPTION 1: MANUAL EMAIL INPUT --- */}
              {inputMode === "manual" && (
                <div className="option1-manual">
                  <textarea
                    className="textarea base mono"
                    rows={8}
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder={"student1@edu.vn\nstudent2@edu.vn, student3@edu.vn\n..."}
                  />
                  <button className="add-email-btn" onClick={handleAddEmails} >
                    <UserPlus />
                    Thêm Email
                  </button>
                </div>
              )}

              {/* --- OPTION 2: EXCEL UPLOAD --- */}
              {inputMode === "upload" && (
                <div className="option2-upload">
                  <div className="btn-upload">
                    <label htmlFor="excel" className="label-upload">
                      Tải File Excel lên
                    </label>
                    <input 
                      type="file"   accept=".xlsx, .xls" 
                      className="excel-input"   id="excel"
                      onChange={handleExcelUpload}
                    />

                  </div>
                </div>
              )}
            </div>

            <div className="tips">
              <p className="muted small">
                💡 <strong>Mẹo:</strong> Dán nhiều email cùng lúc
              </p>
              <ul className="tips-list">
                <li>Ngăn cách bằng dấu phẩy (,) hoặc xuống dòng</li>
                <li>Email trùng sẽ tự động bị bỏ qua</li>
                <li>Định dạng CSV: Email, Tên (tùy chọn)</li>
              </ul>
            </div>
          </div>

          {/* Card BOTTOM */}
          <div className="sl-card sl-card-bottom">
            <div className="sl-card-head">
              <div>
                <h3>Danh Sách Học Sinh</h3>
                <p className="muted small">Xem trước và quản lý học sinh đã gán</p>
              </div>
            </div>
            <div className="card-content">
              { loadingStudents ? (
                  <div className="loader"></div>
                ) : (
                  <div className="table-wrap">
                    <table className="table">
                      <thead className="thead">
                        <tr className="trow head">
                          <th className="th">Họ và tên</th>
                          <th className="th">Mã SV</th>
                          <th className="th">Tổ</th>
                          <th className="th">Lớp</th>
                          <th className="th">Email / Gmail</th>
                          <th className="th">Điện thoại</th>
                          <th className="th w-compact"></th>
                        </tr>
                      </thead>
                      <tbody className="tbody">
                          {roomStudents.length === 0 ? (
                            <tr>
                              <td className="td" colSpan="6" style={{ textAlign: "center", padding: "1rem" }}>
                                Chưa có học sinh nào trong phòng này
                              </td>
                            </tr>
                          ) : (
                            roomStudents.map((s, i) => (
                              <tr key={i} className="trow">
                                <td className="td">{s.name || "-"}</td>
                                <td className="td">{s.studentCode || "-"}</td>
                                <td className="td">{s.group || "-"}</td>
                                <td className="td">{s.className || "-"}</td>
                                <td className="td mono">{s.email}</td>
                                <td className="td">{s.phone || "-"}</td>

                                <td className="td actions">
                                  <button
                                    className="btn"
                                    onClick={() => {
                                      setRoomStudents((prev) => prev.filter((x) => x.email !== s.email));
                                    }}
                                  >
                                    <Trash2 className="tw h4 w4" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                      </tbody>
                    </table>

                  </div>
                ) }
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION --- */}
        <div className="sl-bottom">
          
            <button className="publish-btn" onClick={handleSaveToBackend} disabled={saving} >
              {saving ? <div className="loader small"></div> : ''}
              Thêm danh sách vào phòng thi
            </button>
          
        </div>
      </div>


    </div>
  );
}
