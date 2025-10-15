import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import "./OSCESPage.scss";

// 🩺 Import any case JSON
import benhAnData from "../../data/benhAn2.js";

const OSCESPage = () => {
  const [benhAn, setBenhAn] = useState(null);
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    setBenhAn(benhAnData);
  }, []);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleNext = () => {
    toast.success("Đang chuyển đến trạm kế tiếp...", {
      duration: 2000,
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });

    setTimeout(() => alert("Đi đến trạm kế tiếp!"), 2000);
  };

  if (!benhAn) {
    return (
      <div className="loading">
        <p>Đang tải dữ liệu bệnh án...</p>
      </div>
    );
  }

  // 🆕 Extract all parts (with new bullet/paragraph-ready design)
  const info = benhAn.benh_an_tinh_huong.thong_tin_benh_nhan;
  const benhSu = benhAn.benh_an_tinh_huong.benh_su;
  const tienCan = benhAn.benh_an_tinh_huong.tien_can;
  const luocQua = benhAn.benh_an_tinh_huong.luoc_qua_cac_co_quan;
  const kham = benhAn.benh_an_tinh_huong.kham_lam_sang;

  return (
    <div className="osce-page">
      <Toaster position="top-center" />
      <header className="header-timer-badge">
        <span className="timer-badge">Thời gian còn lại: 07:00</span>
      </header>

      <main>
        <div className="content-grid">
          {/* ================= LEFT COLUMN ================= */}
          <aside className="card patient-info">
            <h2>Thông tin bệnh nhân</h2>
            <p>
              <strong>Họ tên:</strong> {info.ho_ten} <br />
              <strong>Tuổi:</strong> {info.tuoi} <br />
              <strong>Giới tính:</strong> {info.gioi_tinh} <br />
              <strong>Nghề nghiệp:</strong> {info.nghe_nghiep} <br />
              <strong>Lý do nhập viện:</strong> {info.ly_do_nhap_vien}
            </p>

            {/* 🆕 BỆNH SỬ - show 1–3 paragraphs */}
            <div className="accordion-section">
              <h3 onClick={() => toggleSection("benhSu")}>
                {openSections.benhSu ? "▼" : "▶"} Bệnh sử
              </h3>
              {openSections.benhSu && (
                <div className="accordion-content">
                  {benhSu.mo_ta1 && <p>{benhSu.mo_ta1}</p>}
                  {benhSu.mo_ta2 && <p>{benhSu.mo_ta2}</p>}
                  {benhSu.mo_ta3 && <p>{benhSu.mo_ta3}</p>}
                </div>
              )}
            </div>

            {/* 🆕 TIỀN CĂN - render bullets */}
            {Array.isArray(tienCan) && tienCan.length > 0 && (
              <div className="accordion-section">
                <h3 onClick={() => toggleSection("tienCan")}>
                  {openSections.tienCan ? "▼" : "▶"} Tiền căn
                </h3>
                {openSections.tienCan && (
                  <ul className="accordion-content">
                    {tienCan.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* 🆕 LƯỢC QUA CÁC CƠ QUAN - render bullets */}
            {Array.isArray(luocQua) && luocQua.length > 0 && (
              <div className="accordion-section">
                <h3 onClick={() => toggleSection("luocQua")}>
                  {openSections.luocQua ? "▼" : "▶"} Lược qua các cơ quan
                </h3>
                {openSections.luocQua && (
                  <ul className="accordion-content">
                    {luocQua.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* 🆕 KHÁM LÂM SÀNG - render bullets */}
            {Array.isArray(kham) && kham.length > 0 && (
              <div className="accordion-section">
                <h3 onClick={() => toggleSection("kham")}>
                  {openSections.kham ? "▼" : "▶"} Khám lâm sàng
                </h3>
                {openSections.kham && (
                  <ul className="accordion-content">
                    {kham.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </aside>

          {/* ================= RIGHT COLUMN ================= */}
          <section className="card questions">
            <h2>Câu hỏi</h2>
            {benhAn.cau_hoi.map((q, index) => (
              <div key={q.id} className="question-item">
                <div className="question-text">
                  {index + 1}. {q.noi_dung}
                </div>

                {q.kieu === "radio" && (
                  <ul className="options">
                    {q.lua_chon.map((opt, i) => (
                      <li key={i}>
                        <label>
                          <input type="radio" name={`q${q.id}`} /> {opt}
                        </label>
                      </li>
                    ))}
                  </ul>
                )}

                {q.kieu === "checkbox" && (
                  <ul className="options">
                    {q.lua_chon.map((opt, i) => (
                      <li key={i}>
                        <label>
                          <input type="checkbox" /> {opt}
                        </label>
                      </li>
                    ))}
                  </ul>
                )}

                {q.kieu === "text" && (
                  <input
                    type="text"
                    className="text-answer"
                    placeholder={q.goi_y || "Nhập câu trả lời"}
                  />
                )}
              </div>
            ))}
          </section>
        </div>
      </main>

      {/* NEXT STATION BUTTON */}
      <div className="button-container">
        <button className="toast-button" onClick={handleNext}>
          ⟶ Next station
        </button>
      </div>
    </div>
  );
};

export default OSCESPage;
