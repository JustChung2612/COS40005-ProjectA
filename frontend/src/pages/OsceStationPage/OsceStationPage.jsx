// pages/OsceStationPage/OsceStationPage.jsx
import  { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";              // keep route mode
import toast, { Toaster } from "react-hot-toast";
import "./osceStationPage.scss";
import TramThi1 from "../../data/TramThi1.js";
import TramThi2 from "../../data/TramThi2.js";
import TramThi3 from "../../data/TramThi3.js";
import { stationById } from "../../data/stationsData.js";

const OsceStationPage = ({ overrideStations = null, currentIndex = 0, onNext = null }) => {
  const params = useParams(); // will be {} when embedded
  const [thongTin, setThongtin] = useState(null);

  // TOC toggles
  const [showLeftMenu, setShowLeftMenu]   = useState(true);
  const [showQMenu, setShowQMenu]         = useState(true);

  // Refs for patient-info sections
  const infoRef    = useRef(null);
  const benhSuRef  = useRef(null);
  const tienCanRef = useRef(null);
  const luocQuaRef = useRef(null);
  const khamRef    = useRef(null);

  // Refs for each question (q.id -> element)
  const qRefs = useRef({});

  useEffect(() => {
    if (overrideStations && overrideStations.length) {
      setThongtin(overrideStations[currentIndex] || null);
      return;
    }

    // Route mode fallback:
    const { tramId } = params || {};
    if (!tramId ) {
      setThongtin(null);
      return;
    }

    // pick station by tramId
    const selected = stationById[tramId] || [TramThi1, TramThi2, TramThi3].find(s => s.tram_thi_ID === id);
    if (selected) setThongtin(selected);
    else {
      setThongtin(null);
      toast.error("Không tìm thấy trạm thi tương ứng!");
    }
  }, [overrideStations, currentIndex, params]);

  const handleNext = () => {
    if (overrideStations && typeof onNext === 'function') {
      onNext();
    } else {
      toast("Chuyển trạm bằng danh sách phòng.", { icon: "ℹ️" });
    }
  };

  const smoothScrollTo = (el) => {
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  };

  if (!thongTin) {
    return (
      <div className="loading">
        <h2>Đang tải dữ liệu bệnh án...</h2>
      </div>
    );
  }

  // Extract parts
  const info    = thongTin.benh_an_tinh_huong.thong_tin_benh_nhan;
  const benhSu  = thongTin.benh_an_tinh_huong.benh_su;
  const tienCan = thongTin.benh_an_tinh_huong.tien_can;
  const luocQua = thongTin.benh_an_tinh_huong.luoc_qua_cac_co_quan;
  const kham    = thongTin.benh_an_tinh_huong.kham_lam_sang;

  // Determine which patient-info sections actually exist to show in TOC
  const leftTocItems = [
    { key: "ttbn",    label: "Thông tin bệnh nhân",  ref: infoRef,    show: true },
    { key: "benh_su", label: "Bệnh sử",              ref: benhSuRef,  show: !!(benhSu?.mo_ta1 || benhSu?.mo_ta2 || benhSu?.mo_ta3) },
    { key: "tien_can",label: "Tiền căn",             ref: tienCanRef, show: Array.isArray(tienCan) && tienCan.length > 0 },
    { key: "luoc_qua",label: "Lược qua các cơ quan", ref: luocQuaRef, show: Array.isArray(luocQua) && luocQua.length > 0 },
    { key: "kham",    label: "Khám lâm sàng",        ref: khamRef,    show: Array.isArray(kham) && kham.length > 0 },
  ].filter(i => i.show);


  // UPDATED--- simplified layout; inline TOC buttons in headers; removed openSections 🧭
  return (
    <div className="osce-page">
      <Toaster position="top-center" />
      <header className="header-timer-badge">
        <span className="timer-badge">Thời gian còn lại: 07:00</span>
      </header>

      <main>
        <div className="content-grid">

          {/* LEFT */}
          <div className='patient-container' >
              <div className="Toc-btn-Container" >
                  {showLeftMenu && (
                    <div className="toc-panel" role="menu">
                      <div className="toc-title">Bệnh Án</div>
                        <ul className="toc-grid" >
                          {leftTocItems.map(item => (
                            <li key={item.key}>
                              <button
                                className="toc-link"
                                onClick={() => {
                                  
                                  smoothScrollTo(item.ref.current);
                                }}
                              >
                                {item.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                    </div>
                  )}
              </div>
              <section className="card patient-info ">
                
                  <div className="section-header">
                    <h2 ref={infoRef}>Thông tin bệnh nhân</h2>
                  </div>

                  <div className='patient-biref'>
                    <span>Họ tên:</span> {info.ho_ten} <br />
                    <span>Tuổi:</span> {info.tuoi} <br />
                    <span>Giới tính:</span> {info.gioi_tinh} <br />
                    <span>Nghề nghiệp:</span> {info.nghe_nghiep} <br />
                    <span>Lý do nhập viện:</span> {info.ly_do_nhap_vien}
                  </div>

                  <div className="accordion-section" ref={benhSuRef}>
                    <h3>Bệnh sử</h3>
                    <div className="accordion-content">
                      {benhSu.mo_ta1 && <p>{benhSu.mo_ta1}</p>}
                      {benhSu.mo_ta2 && <p>{benhSu.mo_ta2}</p>}
                      {benhSu.mo_ta3 && <p>{benhSu.mo_ta3}</p>}
                    </div>
                  </div>

                  {Array.isArray(tienCan) && tienCan.length > 0 && (
                    <div className="accordion-section" ref={tienCanRef}>
                      <h3>Tiền căn</h3>
                      <ul className="accordion-content">
                        {tienCan.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {Array.isArray(luocQua) && luocQua.length > 0 && (
                    <div className="accordion-section" ref={luocQuaRef}>
                      <h3>Lược qua các cơ quan</h3>
                      <ul className="accordion-content">
                        {luocQua.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {Array.isArray(kham) && kham.length > 0 && (
                    <div className="accordion-section" ref={khamRef}>
                      <h3>Khám lâm sàng</h3>
                      <ul className="accordion-content">
                        {kham.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                
              </section>
          </div>

          {/* RIGHT */}
          <div className='questions-container' >
              <section className="card questions ">
                <div className="section-header">
                  <h2>Câu hỏi</h2>
                </div>

                {thongTin.cau_hoi.map((q, index) => (
                  <div
                    key={q.id}
                    className="question-item"
                    ref={(el) => (qRefs.current[q.id] = el)}
                    id={`q-${q.id}`}
                  >
                    <div className="question-text">
                      {index + 1}. {q.noi_dung} 
                    </div>

                    {q.hinh_anh && (
                      <div className="question-img">
                        <img
                          className="image"
                          src={q.hinh_anh}
                          alt="Hình Ảnh Bệnh Án (Nếu Có)"
                        />
                      </div>
                    )}

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
                      <textarea
                        className="text-answer"
                        placeholder={q.goi_y || "Nhập câu trả lời"}
                      ></textarea>
                    )}
                  </div>
                ))}
              </section>
              <div className="Toc-btn-Container" >
                {showQMenu && (
                  <div className="toc-panel" role="menu">
                    <div className="toc-title">Câu Hỏi</div>
                      <ul className="toc-grid">
                        {thongTin.cau_hoi.map((q, idx) => (
                          <li key={q.id}>
                            <button
                              className="toc-link"
                              onClick={() => {
                               
                                smoothScrollTo(qRefs.current[q.id]);
                              }}
                              title={q.noi_dung}
                            >
                              Câu {idx + 1}
                            </button>
                          </li>
                        ))}
                      </ul>
                  </div>
                )}
              </div>
          </div>

        </div>
      </main>

      <div className="button-container">
        <button className="toast-button" onClick={handleNext}>
          ⟶ Next station
        </button>
      </div>
    </div>
  );

};

export default OsceStationPage;
