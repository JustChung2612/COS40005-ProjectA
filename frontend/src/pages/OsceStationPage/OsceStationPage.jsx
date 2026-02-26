// /pages/OsceStationPage/OsceStationPage.jsx
import "./osceStationPage.scss";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Clock, FileText, AlertCircle, CheckCircle2, ArrowBigRight } from "lucide-react";
import { useUserStore } from "../../stores/useUserStore.js"; 
import { toast } from "react-hot-toast";


/* ========= UI PRIMITIVES (same as before) ========= */
const Progress = ({ value = 0, className = "" }) => (
  <div className={["ui-progress", className].join(" ")}>
    <div className="ui-progress__bar" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
  </div>
);

/* ========= 🧩 UPDATED MAIN COMPONENT ========= */
const OsceStationPage = () => {
  const { tramId } = useParams();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const studentEmail = user?.email?.toLowerCase();

  // draft key to store per-room-progress (multi stations)
  const getDraftKey = (roomId) => `osce_draft_${roomId}_${studentEmail || "guest"}`;

  const loadDraft = (roomId) => {
    try {
      const raw = localStorage.getItem(getDraftKey(roomId));
      return raw ? JSON.parse(raw) : { examRoomId: roomId, studentEmail, stations: [] };
    } catch {
      return { examRoomId: roomId, studentEmail, stations: [] };
    }
  };

  const saveDraft = (roomId, draft) => {
    localStorage.setItem(getDraftKey(roomId), JSON.stringify(draft));
  };

  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientCase, setPatientCase] = useState(null);
  const [nextStationId, setNextStationId] = useState(null);

  // ✅ UPDATED: fetch station + assigned case together & respect OSCE rules
  useEffect(() => {
    if (!tramId) return;

    let isMounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        // Get station & the assigned case simultaneously
        const [stationRes, assignRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/exam-stations/${tramId}`),
          axios.get(`http://localhost:5000/api/exam-stations/${tramId}/assign`),
        ]);

        const station = stationRes.data?.data;
        if (!station) throw new Error("Không tìm thấy trạm thi");

        // 🔁 Compute next station from parentRoom info
        let nextId = null;
        if (station.parentRoom && Array.isArray(station.parentRoom.stations)) {
          const list = station.parentRoom.stations;
          const currentIndex = list.findIndex((s) => s._id === tramId);
          if (currentIndex !== -1 && currentIndex < list.length - 1) {
            nextId = list[currentIndex + 1]._id;
          }
        }

        // Backend already applies the rule:
        // - 1 case  -> returns that case
        // - 2+ cases -> returns a random case
        const assigned = assignRes.data?.data || null;

        if (isMounted) {
          setExamData(station);
          setPatientCase(assigned || station.patientCaseIds?.[0] || null);
          setNextStationId(nextId);
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải trạm/case:", err);
        if (isMounted) setError("Không thể tải dữ liệu trạm thi này");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [tramId]);



  // ✅ NEW — always render from the assigned patient case
  const caseSource = patientCase || {};
  const caseData = caseSource?.benh_an_tinh_huong || {};
  const questions = caseSource?.cau_hoi || [];
  const totalQuestions = questions.length;
  const examRoomId = examData?.parentRoom?._id; // comes from getExamStationById response

  // Save current station answers into local draft
  const persistCurrentStationToDraft = () => {
    if (!examRoomId) return false;
    if (!studentEmail) {
      toast.error("Bạn cần đăng nhập để nộp bài.");
      return false;
    }
    if (!patientCase?._id) {
      toast.error("Không tìm thấy bệnh án để lưu bài.");
      return false;
    }

    const draft = loadDraft(examRoomId);

    // convert answers state => array payload
    const payloadAnswers = questions.map((q, idx) => {
      const n = idx + 1;
      return {
        questionId: q.id,     // IMPORTANT: matches patientCase.cau_hoi.id
        kieu: q.kieu,
        answer: answers[n] ?? null,
      };
    });

    const stationPayload = {
      stationId: tramId,
      patientCaseId: patientCase._id,
      answers: payloadAnswers,
    };

    // replace existing station entry if student revisits station
    const existingIndex = (draft.stations || []).findIndex(
      (s) => String(s.stationId) === String(tramId)
    );

    if (existingIndex !== -1) {
      draft.stations[existingIndex] = stationPayload;
    } else {
      draft.stations.push(stationPayload);
    }

    draft.examRoomId = examRoomId;
    draft.studentEmail = studentEmail;

    saveDraft(examRoomId, draft);
    return true;
  };

  // Handle NEXT / FINISH
  const handleNextOrFinish = async () => {
    const ok = persistCurrentStationToDraft();
    if (!ok) return;

    // if there is next station => move on
    if (nextStationId) {
      navigate(`/osce/tram/${nextStationId}`);
      return;
    }

    // last station => submit the whole room
    try {
      const draft = loadDraft(examRoomId);

      const res = await axios.post("http://localhost:5000/api/exam-submissions/submit", {
        examRoomId: draft.examRoomId,
        studentEmail: draft.studentEmail,
        stations: draft.stations,
      });

      const submissionId = res.data?.data?._id;

      // clear draft after submit
      localStorage.removeItem(getDraftKey(examRoomId));

      toast.success("✅ Nộp bài thành công! Trắc nghiệm đã được chấm tự động.");
      navigate("/hoan_thanh");
    } catch (err) {
      console.error("❌ Submit error:", err);
      toast.error(err.response?.data?.message || "Nộp bài thất bại.");
    }
  };


  // ✅ Safe hook order — all hooks before any return

  // 1️⃣ Timer hooks
  const totalDurationSec = useMemo(() => 15 * 60, []);
  const [timeRemaining, setTimeRemaining] = useState(totalDurationSec);

  useEffect(() => {
    if (timeRemaining <= 0) return;
    const t = setInterval(() => setTimeRemaining((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [timeRemaining]);

  const progress = (timeRemaining / totalDurationSec) * 100;
  const formatTime = (sec) =>
  `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;

// 2️⃣ Refs & UI state
const thongTinRef = useRef(null);
const benhSuRef = useRef(null);
const tienCanRef = useRef(null);
const luocQuaRef = useRef(null);
const khamLSRef = useRef(null);
const qScrollRef = useRef(null);
const questionRefs = useRef({});

const [activeSection, setActiveSection] = useState("thong_tin");
const [activeQuestion, setActiveQuestion] = useState(1);
const [answers, setAnswers] = useState({});

const scrollToSection = (ref, key) => {
  setActiveSection(key);
  ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const scrollToQuestion = (n) => {
  setActiveQuestion(n);
  questionRefs.current[n]?.scrollIntoView({ behavior: "smooth", block: "start" });
};

// 3️⃣ Scroll handler for active question
useEffect(() => {
  const el = qScrollRef.current;
  if (!el) return;
  const handler = () => {
    const rect = el.getBoundingClientRect();
    const mid = rect.top + rect.height / 2;
    for (let i = totalQuestions; i >= 1; i--) {
      const r = questionRefs.current[i]?.getBoundingClientRect();
      if (r && r.top <= mid) {
        setActiveQuestion(i);
        break;
      }
    }
  };
  el.addEventListener("scroll", handler, { passive: true });
  return () => el.removeEventListener("scroll", handler);
}, [totalQuestions]);

const isAnswered = (n) => {
  const v = answers[n];
  if (v === undefined || v === null) return false;
  if (Array.isArray(v)) return v.length > 0;
  return String(v).trim().length > 0;
};



// ✅ Now safe conditional rendering
if (loading) return <div className="loading">Đang tải dữ liệu trạm thi...</div>;
if (error) return <div className="error">{error}</div>;
if (!examData || !patientCase) {
   return <div className="loading">Đang tải bệnh án...</div>;
}
  

  return (
    <div className="stations-page">
      {/* Dải nền/gradient giống OSCESPage */}
      <div className="page-hero">
        <div className="hero-inner">
          <div className="timer">
            <Clock className={["ico", timeRemaining < 60 ? "danger" : ""].join(" ")} />
            <span className="label">Thời gian còn lại:</span>
            <span
              className={
                "ui-badge " +
                (timeRemaining < 60
                  ? "ui-badge--danger"
                  : "ui-badge--muted") +
                " mono"
              }
            >
              {formatTime(timeRemaining)}
            </span>

            <button className="btn btn--ghost btn--md exit">
              <Link to="/">Thoát</Link>
            </button>

          </div>
          <Progress value={progress} className={timeRemaining < 60 ? "pulse" : ""} />
        </div>
      </div>

      {/* Split layout gốc của Stations */}
      <div className="split">
        {/* Bên trái: Bệnh án + TOC */}
        <aside className="left">
          <nav className="toc">
            <div className="toc__title">Bệnh Án</div>
            <button className={["toc__item", activeSection==="thong_tin" ? "is-active" : ""].join(" ")} onClick={() => scrollToSection(thongTinRef,"thong_tin")}>Thông tin bệnh nhân</button>
            <button className={["toc__item", activeSection==="benh_su" ? "is-active" : ""].join(" ")} onClick={() => scrollToSection(benhSuRef,"benh_su")}>Bệnh sử</button>
            <button className={["toc__item", activeSection==="tien_can" ? "is-active" : ""].join(" ")} onClick={() => scrollToSection(tienCanRef,"tien_can")}>Tiền căn</button>
            <button className={["toc__item", activeSection==="luoc_qua" ? "is-active" : ""].join(" ")} onClick={() => scrollToSection(luocQuaRef,"luoc_qua")}>Lược qua các cơ quan</button>
            <button className={["toc__item", activeSection==="kham" ? "is-active" : ""].join(" ")} onClick={() => scrollToSection(khamLSRef,"kham")}>Khám lâm sàng</button>
          </nav>

          <div className="case">
            <div className="card mb">
              <div className="card__content">
                <section ref={thongTinRef} className="section">
                  <h2 className="section__title">Thông tin bệnh nhân</h2>
                  <ul className="list">
                    <li><b>Họ tên:</b> {caseData?.thong_tin_benh_nhan?.ho_ten}</li>
                    <li><b>Tuổi:</b> {caseData?.thong_tin_benh_nhan?.tuoi}</li>
                    <li><b>Giới tính:</b> {caseData?.thong_tin_benh_nhan?.gioi_tinh}</li>
                    <li><b>Nghề nghiệp:</b> {caseData?.thong_tin_benh_nhan?.nghe_nghiep}</li>
                    <li><b>Lý do nhập viện:</b> {caseData?.thong_tin_benh_nhan?.ly_do_nhap_vien}</li>
                  </ul>
                </section>

                <section ref={benhSuRef} className="section">
                  <h3 className="section__title">Bệnh sử</h3>
                  <div className="paras">
                    <p>{caseData?.benh_su?.mo_ta1}</p>
                    <p>{caseData?.benh_su?.mo_ta2}</p>
                    <p>{caseData?.benh_su?.mo_ta3}</p>
                  </div>
                </section>

                <section ref={tienCanRef} className="section">
                  <h3 className="section__title">Tiền căn</h3>
                  <ul className="list">
                    {(caseData?.tien_can || []).map((t,i)=><li key={i}> {t}</li>)}
                  </ul>
                </section>

                <section ref={luocQuaRef} className="section">
                  <h3 className="section__title">Lược qua các cơ quan</h3>
                  <ul className="list">
                    {(caseData?.luoc_qua_cac_co_quan || []).map((t,i)=><li key={i}> {t}</li>)}
                  </ul>
                </section>

                <section ref={khamLSRef} className="section">
                  <h3 className="section__title">Khám lâm sàng</h3>
                  <ul className="list">
                    {(caseData?.kham_lam_sang || []).map((t,i)=><li key={i}> {t}</li>)}
                  </ul>
                </section>
              </div>
            </div>

            <div className="note">
              <div className="note__head"><AlertCircle className="ico primary" /><span>Ghi chú</span></div>
              <p>Đọc kỹ bệnh án trước khi trả lời câu hỏi. Trả lời ngắn gọn, chính xác.</p>
            </div>
          </div>
        </aside>

        {/* Bên phải: Câu hỏi + thanh CÂU */}
        <section className="right">
          <div className="ui-scroll q-scroll" ref={qScrollRef}>
            <div className="q-wrap">
              {questions.map((q, idx) => {
                const n = idx + 1;
                const answered = isAnswered(n);
                return (
                  <div key={n} ref={(el)=>questionRefs.current[n]=el} className={["q-card", activeQuestion===n?"is-current":""].join(" ")}>
                    <div className="card">
                      <div className="card__content">
                        <div className="q-head">
                          <h3 className="q-title">Câu hỏi {n}</h3>
                          <span
                            className={ "ui-badge " + (answered ? "ui-badge--default" : "ui-badge--outline") }
                          >
                            {answered ? "Đã trả lời" : "Chưa trả lời"}
                          </span>
                        </div>
                        <p className="q-text">{q.noi_dung}</p>

                        {q.kieu === "radio" && (
                          <div className="ui-radio-group">
                            {(q.lua_chon || []).map((opt, i) => (
                              <label key={i} className="ui-radio">
                                <input
                                  type="radio"
                                  id={`q${n}-r${i}`}
                                  name={`q${n}`}                 // IMPORTANT: same name per question
                                  value={opt}
                                  checked={answers[n] === opt}   // selected?
                                  onChange={() =>
                                    setAnswers((p) => ({ ...p, [n]: opt }))
                                  }
                                />
                                <span className="ui-radio__control" />
                                <span className="ui-radio__label">{opt}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {q.kieu === "checkbox" && (
                          <div className="ui-checkbox-group">
                            {(q.lua_chon||[]).map((opt,i)=>{
                              const cur = Array.isArray(answers[n]) ? answers[n] : [];
                              const on = cur.includes(opt);
                              return (
                                <label className="ui-checkbox">
                                  <input
                                    type="checkbox"
                                    id={`q${n}-c${i}`}
                                    checked={on}
                                    onChange={(e) => {
                                      const flag = e.target.checked;
                                      setAnswers((p) => {
                                        const arr = Array.isArray(p[n]) ? p[n] : [];
                                        return {
                                          ...p,
                                          [n]: flag
                                            ? [...arr, opt]
                                            : arr.filter((x) => x !== opt),
                                        };
                                      });
                                    }}
                                  />
                                  <span className="ui-checkbox__control" />
                                  <span className="ui-checkbox__label">{opt}</span>
                                </label>

                              );
                            })}
                          </div>
                        )}

                        {q.kieu === "text" && (
                          <>
                            <textarea
                              className="ui-textarea q-textarea"
                              placeholder={q.goi_y || "Nhập câu trả lời…"}
                              value={answers[n] || ""}
                              onChange={(e) =>
                                setAnswers((p) => ({
                                  ...p,
                                  [n]: e.target.value,
                                }))
                              }
                            />

                            <div className="q-meta">
                              <span className="q-count">{String(answers[n] || "").length} ký tự</span>
                              {q.goi_y && <span className="q-hint">{q.goi_y}</span>}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="q-submit">
                <button
                  className="btn btn--primary btn--lg w-100"
                  onClick={handleNextOrFinish}
                >
                  {nextStationId ? (
                    <span className="next-Btn">
                      Trạm Kế Tiếp <ArrowBigRight />
                    </span>
                  ) : (
                    <span className="finish-Btn">
                      Kết thúc
                    </span>
                  )}
                </button>
              </div>



            </div>
          </div>

          <div className="q-rail">
            <div className="q-rail__title">Câu Hỏi</div>
            <div className="q-rail__list">
              {Array.from({length: totalQuestions}, (_,i)=>i+1).map((n)=>{
                const answered = isAnswered(n);
                const current = activeQuestion === n;
                return (
                  <button
                    key={n}
                    onClick={()=>scrollToQuestion(n)}
                    className={["q-rail__btn", current?"is-current":"", !current && answered ? "is-answered":""].join(" ")}
                    title={`Câu ${n}`}
                  >
                    {answered && !current && <CheckCircle2 className="tick" />} {n}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>

    </div>
  );
};

export default OsceStationPage;
