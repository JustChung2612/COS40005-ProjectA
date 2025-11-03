import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import TramThi1 from "../../data/TramThi1.js";
import "./Stations.scss";

/* ========= UI PRIMITIVES (local) ========= */
const Button = ({ children, variant = "primary", size = "md", className = "", ...props }) => {
  const cls = ["btn", `btn--${variant}`, `btn--${size}`, className].join(" ");
  return <button className={cls} {...props}>{children}</button>;
};

const Card = ({ className = "", children, ...p }) => <div className={["card", className].join(" ")} {...p}>{children}</div>;
const CardContent = ({ className = "", children, ...p }) => <div className={["card__content", className].join(" ")} {...p}>{children}</div>;

const Progress = ({ value = 0, className = "" }) => (
  <div className={["ui-progress", className].join(" ")}>
    <div className="ui-progress__bar" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
  </div>
);

const Textarea = ({ className = "", ...p }) => <textarea className={["ui-textarea", className].join(" ")} {...p} />;

const RadioGroup = ({ value, onChange, name, children }) => {
  const kids = (Array.isArray(children) ? children : [children]).map((c, i) =>
    c && c.type === RadioGroupItem
      ? { ...c, props: { ...c.props, name, checked: value === c.props.value, onChange: () => onChange(c.props.value) } }
      : c
  );
  return <div className="ui-radio-group">{kids}</div>;
};
const RadioGroupItem = ({ id, value, checked, onChange, label }) => (
  <label className="ui-radio">
    <input type="radio" id={id} value={value} checked={!!checked} onChange={onChange} />
    <span className="ui-radio__control" />
    <span className="ui-radio__label">{label ?? value}</span>
  </label>
);

const Checkbox = ({ id, checked, onChange, label }) => (
  <label className="ui-checkbox">
    <input type="checkbox" id={id} checked={!!checked} onChange={(e) => onChange(e.target.checked)} />
    <span className="ui-checkbox__control" />
    <span className="ui-checkbox__label">{label}</span>
  </label>
);

const Badge = ({ children, variant = "default", className = "" }) => (
  <span className={["ui-badge", `ui-badge--${variant}`, className].join(" ")}>{children}</span>
);

const ScrollArea = ({ className = "", style, children, scrollRef }) => (
  <div className={["ui-scroll", className].join(" ")} style={style} ref={scrollRef}>{children}</div>
);

/* ========= Stations (gộp timer/background của OSCESPage) ========= */
const Stations = () => {
  // Dữ liệu trạm thi 1
  const examData = TramThi1;
  const caseData = examData.benh_an_tinh_huong || {};
  const questions = examData.cau_hoi || [];
  const totalQuestions = questions.length;

  // Thời gian: dùng logic đếm ngược như Stations (giây), nhưng UI/SCSS theo OSCES
  const totalDurationSec = useMemo(() => 15 * 60, []);
  const [timeRemaining, setTimeRemaining] = useState(totalDurationSec);
  useEffect(() => {
    if (timeRemaining <= 0) return;
    const t = setInterval(() => setTimeRemaining((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [timeRemaining]);
  const progress = (timeRemaining / totalDurationSec) * 100;
  const formatTime = (sec) => `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;

  // Điều hướng mục bên trái
  const thongTinRef = useRef(null);
  const benhSuRef = useRef(null);
  const tienCanRef = useRef(null);
  const luocQuaRef = useRef(null);
  const khamLSRef = useRef(null);
  const [activeSection, setActiveSection] = useState("thong_tin");
  const scrollToSection = (ref, key) => {
    setActiveSection(key);
    ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Câu hỏi + thanh CÂU
  const qScrollRef = useRef(null);
  const questionRefs = useRef({});
  const [activeQuestion, setActiveQuestion] = useState(1);
  const [answers, setAnswers] = useState({});
  const isAnswered = (n) => {
    const v = answers[n];
    if (v === undefined || v === null) return false;
    if (Array.isArray(v)) return v.length > 0;
    return String(v).trim().length > 0;
  };
  const scrollToQuestion = (n) => {
    setActiveQuestion(n);
    questionRefs.current[n]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  useEffect(() => {
    const el = qScrollRef.current;
    if (!el) return;
    const handler = () => {
      const rect = el.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      for (let i = totalQuestions; i >= 1; i--) {
        const r = questionRefs.current[i]?.getBoundingClientRect();
        if (r && r.top <= mid) { setActiveQuestion(i); break; }
      }
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, [totalQuestions]);

  const submit = () => {
    console.log("BÀI LÀM:", answers);
    alert("Đã nộp bài! (Bạn có thể nối API chấm điểm sau)");
  };

  return (
    <div className="stations-page">
      {/* Dải nền/gradient giống OSCESPage */}
      <div className="page-hero">
        <div className="hero-inner">
          <div className="timer">
            <Clock className={["ico", timeRemaining < 60 ? "danger" : ""].join(" ")} />
            <span className="label">Thời gian còn lại:</span>
            <Badge variant={timeRemaining < 60 ? "danger" : "muted"} className="mono">{formatTime(timeRemaining)}</Badge>
            <Button variant="ghost" className="exit">
              <Link to="/">Thoát</Link>
            </Button>
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
            <Card className="mb">
              <CardContent>
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
              </CardContent>
            </Card>

            <div className="note">
              <div className="note__head"><AlertCircle className="ico primary" /><span>Ghi chú</span></div>
              <p>Đọc kỹ bệnh án trước khi trả lời câu hỏi. Trả lời ngắn gọn, chính xác.</p>
            </div>
          </div>
        </aside>

        {/* Bên phải: Câu hỏi + thanh CÂU */}
        <section className="right">
          <ScrollArea className="q-scroll" scrollRef={qScrollRef}>
            <div className="q-wrap">
              {questions.map((q, idx) => {
                const n = idx + 1;
                const answered = isAnswered(n);
                return (
                  <div key={n} ref={(el)=>questionRefs.current[n]=el} className={["q-card", activeQuestion===n?"is-current":""].join(" ")}>
                    <Card>
                      <CardContent>
                        <div className="q-head">
                          <h3 className="q-title">Câu hỏi {n}</h3>
                          <Badge variant={answered ? "default" : "outline"}>{answered ? "Đã trả lời" : "Chưa trả lời"}</Badge>
                        </div>
                        <p className="q-text">{q.noi_dung}</p>

                        {q.kieu === "radio" && (
                          <RadioGroup
                            name={`q${n}`}
                            value={answers[n] || ""}
                            onChange={(val)=>setAnswers((p)=>({ ...p, [n]: val }))}
                          >
                            {(q.lua_chon||[]).map((opt,i)=>(
                              <RadioGroupItem key={i} id={`q${n}-r${i}`} value={opt} label={opt} />
                            ))}
                          </RadioGroup>
                        )}

                        {q.kieu === "checkbox" && (
                          <div className="ui-checkbox-group">
                            {(q.lua_chon||[]).map((opt,i)=>{
                              const cur = Array.isArray(answers[n]) ? answers[n] : [];
                              const on = cur.includes(opt);
                              return (
                                <Checkbox
                                  key={i}
                                  id={`q${n}-c${i}`}
                                  checked={on}
                                  onChange={(flag)=>{
                                    setAnswers((p)=>{
                                      const arr = Array.isArray(p[n]) ? p[n] : [];
                                      return { ...p, [n]: flag ? [...arr, opt] : arr.filter(x=>x!==opt) };
                                    });
                                  }}
                                  label={opt}
                                />
                              );
                            })}
                          </div>
                        )}

                        {q.kieu === "text" && (
                          <>
                            <Textarea
                              placeholder={q.goi_y || "Nhập câu trả lời…"}
                              value={answers[n] || ""}
                              onChange={(e)=>setAnswers((p)=>({ ...p, [n]: e.target.value }))}
                              className="q-textarea"
                            />
                            <div className="q-meta">
                              <span className="q-count">{String(answers[n] || "").length} ký tự</span>
                              {q.goi_y && <span className="q-hint">{q.goi_y}</span>}
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                );
              })}

              <div className="q-submit">
                <Button className="w-100" size="lg" onClick={submit}>Nộp bài thi</Button>
              </div>
            </div>
          </ScrollArea>

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

export default Stations;
