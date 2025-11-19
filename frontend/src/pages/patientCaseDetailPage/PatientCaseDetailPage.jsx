import "./patientCaseDetailPage.scss";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ArrowLeft, Loader2, AlertCircle, PlusCircle, Trash2 } from "lucide-react";


/* ========= UI PRIMITIVES (local, giống Stations) ========= */
export const Card = ({ className = "", children, ...p }) => (
  <div className={["card", className].join(" ")} {...p}>
    {children}
  </div>
);

export const CardContent = ({ className = "", children, ...p }) => (
  <div className={["card__content", className].join(" ")} {...p}>
    {children}
  </div>
);

/* ========= Hằng số ========= */
const QUESTION_TYPES = [
  { value: "radio", label: "Trắc nghiệm (1 đáp án đúng)" },
  { value: "checkbox", label: "Trắc nghiệm (nhiều đáp án đúng)" },
  { value: "text", label: "Câu trả lời ngắn" },
];

const createEmptyQuestion = (index) => ({
  id: `new-${Date.now()}-${index}`,
  noi_dung: "",
  kieu: "radio",
  lua_chon: ["Tùy chọn 1", "Tùy chọn 2"],
  // lưu index các đáp án đúng
  dap_an_dung: [],
  diem: 1,
  bat_buoc: false,
});

const normalizeQuestionsFromCase = (caseData) => {
  const raw = caseData?.cau_hoi;
  if (!Array.isArray(raw) || raw.length === 0) return [];

  return raw.map((q, idx) => {
    const options =
      Array.isArray(q.lua_chon) && q.lua_chon.length > 0
        ? q.lua_chon
        : ["Tùy chọn 1"]; // fallback option

    // Convert dap_an_dung → array of indexes
    let correctIndexes = [];

    if (Array.isArray(q.dap_an_dung)) {
      // convert each answer text → index
      correctIndexes = q.dap_an_dung
        .map((ansText) => options.indexOf(ansText))
        .filter((i) => i >= 0);
    } else if (typeof q.dap_an_dung === "string") {
      const idxFound = options.indexOf(q.dap_an_dung);
      correctIndexes = idxFound >= 0 ? [idxFound] : [];
    }

    return {
      id: q.id ?? `q-${idx + 1}`,
      noi_dung: q.noi_dung || "",
      kieu: q.kieu || "radio",
      lua_chon: options,
      dap_an_dung: correctIndexes,
      diem: Number(q.diem) || 1,
      bat_buoc: Boolean(q.bat_buoc),
    };
  });
};

// ====== Convert UI questions → backend payload ======
const buildQuestionsPayload = (questions, caseData) => {
  const raw = Array.isArray(caseData?.cau_hoi) ? caseData.cau_hoi : [];

  // Map original questions by id (if exists) to reuse fields like goi_y
  const originalById = new Map(
    raw
      .filter((q) => q && (q.id !== undefined && q.id !== null))
      .map((q) => [q.id, q])
  );

  return questions.map((q, index) => {
    const original = originalById.get(q.id) || null;

    const options =
      Array.isArray(q.lua_chon) && q.lua_chon.length > 0
        ? q.lua_chon
        : [];

    // Convert indexes → actual option texts
    let correctTexts = [];
    if (Array.isArray(q.dap_an_dung) && options.length > 0) {
      correctTexts = q.dap_an_dung
        .map((idx) => options[idx])
        .filter(Boolean);
    }

    // Decide how to store dap_an_dung
    let dapAnForBackend;
    if (q.kieu === "text") {
      // For text type, we currently don't edit answers in UI → keep old if any
      dapAnForBackend =
        original && original.dap_an_dung !== undefined
          ? original.dap_an_dung
          : "";
    } else if (q.kieu === "radio") {
      // Single answer → store as string (or empty string if none)
      dapAnForBackend = correctTexts.length > 0 ? correctTexts[0] : "";
    } else if (q.kieu === "checkbox") {
      // Multiple answers → store as array of strings
      dapAnForBackend = correctTexts;
    } else {
      dapAnForBackend = correctTexts;
    }

    return {
      // 👉 Use sequential numeric id to satisfy schema (Number)
      id: index + 1,

      noi_dung: (q.noi_dung || "").trim(),
      kieu: q.kieu || "radio",

      // For text questions, no options are needed
      lua_chon: q.kieu === "text" ? [] : options,

      // Keep existing goi_y if it exists in backend
      goi_y: original?.goi_y || "",

      dap_an_dung: dapAnForBackend,

      // Extra fields (schema allows them as Mixed)
      diem: typeof q.diem === "number" ? q.diem : 1,
      bat_buoc: Boolean(q.bat_buoc),
    };
  });
};

/* ========= Component chính ========= */
const PatientCaseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("thong_tin");
  const [saving, setSaving] = useState(false);

  // refs để scroll tới từng phần bệnh án
  const thongTinRef = useRef(null);
  const benhSuRef = useRef(null);
  const tienCanRef = useRef(null);
  const luocQuaRef = useRef(null);
  const khamLSRef = useRef(null);

  const scrollToSection = (ref, key) => {
    setActiveSection(key);
    ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ====== Fetch patient case from backend ======
  useEffect(() => {
    const fetchCase = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`http://localhost:5000/api/patient-cases/${id}`);

        setCaseData(res.data?.data);
        setError(null);

      } catch (err) {
        console.error("❌ Lỗi khi tải bệnh án:", err);
        setError("Không thể tải thông tin bệnh án.");
        toast.error("Không thể tải thông tin bệnh án.");
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [id]);


  // Khi caseData có dữ liệu, chuẩn hóa câu hỏi cho chế độ soạn đề
  useEffect(() => {
    if (!caseData) {
      setQuestions([]);
      return;
    }
    const normalized = normalizeQuestionsFromCase(caseData);
    setQuestions(normalized.length > 0 ? normalized : [createEmptyQuestion(1)]);
  }, [caseData]);

  const totalPoints = useMemo(
    () => questions.reduce((sum, q) => sum + (Number(q.diem) || 0), 0),
    [questions]
  );

  const updateQuestion = (index, partial) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, ...partial } : q))
    );
  };

  const handleAddQuestion = () => {
    setQuestions((prev) => [...prev, createEmptyQuestion(prev.length + 1)]);
  };

  const handleDeleteQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDuplicateQuestion = (index) => {
    setQuestions((prev) => {
      const q = prev[index];
      const clone = {
        ...q,
        id: `${q.id || index + 1}-copy-${Date.now()}`,
        noi_dung: q.noi_dung ? `${q.noi_dung} (bản sao)` : "",
      };
      const next = [...prev];
      next.splice(index + 1, 0, clone);
      return next;
    });
  };

  const handleAddOption = (qIndex) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              lua_chon: [
                ...(q.lua_chon || []),
                `Tùy chọn ${q.lua_chon.length + 1}`,
              ],
            }
          : q
      )
    );
  };

  const handleRemoveOption = (qIndex, optIndex) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        const newOptions = (q.lua_chon || []).filter(
          (_, idx) => idx !== optIndex
        );
        const newCorrect = (q.dap_an_dung || [])
          .filter((idx) => idx !== optIndex)
          .map((idx) => (idx > optIndex ? idx - 1 : idx));
        return { ...q, lua_chon: newOptions, dap_an_dung: newCorrect };
      })
    );
  };

  const handleChangeCorrect = (qIndex, optIndex, isCheckbox) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        const current = q.dap_an_dung || [];
        if (isCheckbox) {
          const exists = current.includes(optIndex);
          const next = exists
            ? current.filter((idx) => idx !== optIndex)
            : [...current, optIndex];
          return { ...q, dap_an_dung: next };
        }
        // radio
        return { ...q, dap_an_dung: [optIndex] };
      })
    );
  };

  // ====== SAVE to backend ======
  const handleSaveToBackend = async () => {
    if (!caseData) return;

    try {
      setSaving(true);

      // Convert UI → backend format
      const payloadQuestions = buildQuestionsPayload(questions, caseData);

      const payload = {
        cau_hoi: payloadQuestions,
      };

      const res = await axios.patch(
        `http://localhost:5000/api/patient-cases/${id}`,
        payload
      );

      toast.success("🎉 Đã lưu câu hỏi và thông tin bệnh án!");

      // Refresh local data so UI stays in sync
      if (res.data?.data) {
        setCaseData(res.data.data);
      }

    } catch (err) {
      console.error("❌ Lỗi khi lưu bệnh án:", err);
      toast.error("Không thể lưu bệnh án.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="caseDetail__loading">
        <Loader2 className="spin" size={30} /> Đang tải bệnh án...
      </div>
    );
  }

  if (error) {
    return <div className="caseDetail__error">{error}</div>;
  }

  if (!caseData) {
    return <div className="caseDetail__error">Không tìm thấy bệnh án.</div>;
  }

  const metadata = caseData.metadata || {};
  const benhAn = caseData.benh_an_tinh_huong || caseData.benh_an || {};
  const patient =
    benhAn.thong_tin_benh_nhan || caseData.thong_tin_benh_nhan || {};

  return (
    <div className="patientCaseDetail-page">
      {/* Case Detail TOP */}
      <div className="caseDetail-top">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft /> Quay lại
        </button>

        <div className="caseDetail-top__main">
          <h1 className="caseDetail__title">
            {metadata.chuan_doan || "Bệnh án tình huống"}
          </h1>
          <p className="caseDetail__subtitle">
            Cơ quan: {metadata.co_quan || "Chưa rõ"} · Độ khó:{" "}
            {metadata.do_kho || "Chưa rõ"}
          </p>
        </div>

      </div>

      {/* Case Detail MAIN  */}
      <div className="caseDetail-main">
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
                    <li><b>Họ tên:</b> {patient.ho_ten}</li>
                    <li><b>Tuổi:</b> {patient.tuoi}</li>
                    <li><b>Giới tính:</b> {patient.gioi_tinh}</li>
                    <li><b>Nghề nghiệp:</b> {patient.nghe_nghiep}</li>
                    <li><b>Lý do nhập viện:</b> {patient.ly_do_nhap_vien}</li>
                  </ul>
                </section>

                <section ref={benhSuRef} className="section">
                  <h3 className="section__title">Bệnh sử</h3>
                  <div className="paras">
                    {benhAn.benh_su?.mo_ta1 && <p>{benhAn.benh_su.mo_ta1}</p>}
                    {benhAn.benh_su?.mo_ta2 && <p>{benhAn.benh_su.mo_ta2}</p>}
                    {benhAn.benh_su?.mo_ta3 && <p>{benhAn.benh_su.mo_ta3}</p>}
                  </div>
                </section>

                <section ref={tienCanRef} className="section">
                  <h3 className="section__title">Tiền căn</h3>
                  <ul className="list">
                    {(benhAn.tien_can || []).map((t, i) => (<li key={i}>{t}</li>))}
                  </ul>
                </section>

                <section ref={luocQuaRef} className="section">
                  <h3 className="section__title">Lược qua các cơ quan</h3>
                  <ul className="list">
                    {(benhAn.luoc_qua_cac_co_quan || []).map((t, i) => (<li key={i}>{t}</li>))}
                  </ul>
                </section>

                <section ref={khamLSRef} className="section">
                  <h3 className="section__title">Khám lâm sàng</h3>
                  <ul className="list">
                    {(benhAn.kham_lam_sang || []).map((t, i) => (<li key={i}>{t}</li>))}
                  </ul>
                </section>
              </CardContent>
            </Card>

            <div className="note">
              <div className="note__head"><AlertCircle className="ico primary" /><span>Ghi chú</span></div>
              <p> Đọc kỹ bệnh án trước khi soạn câu hỏi. Cố gắng bao quát đủ thông tin quan trọng trong từng câu.</p>
            </div>
          </div>
        </aside>

        {/* Bên phải: khu GIẢNG VIÊN SOẠN CÂU HỎI */}
        <section className="right">
          <div className="qbuilder">
            <div className="qbuilder__header">
              <div>
                <h2 className="qbuilder__title">Soạn câu hỏi</h2>
                <p className="qbuilder__subtitle">
                  Dựa trên bệnh án bên trái, hãy tạo danh sách câu hỏi trắc nghiệm / tự
                  luận.
                </p>
              </div>

              <button className="btn btn--primary" type="button" onClick={handleAddQuestion} >
                <PlusCircle size={18} />
                <span>Thêm câu hỏi</span>
              </button>
            </div>

            <div className="qbuilder__summary">
              <span> <b>{questions.length}</b> câu hỏi </span>
              <span> Tổng điểm: <b>{totalPoints}</b> </span>
            </div>

            <div className="qbuilder__list">
              {questions.map((q, index) => (
                <Card key={q.id || index} className="qbuilder__item">
                  <CardContent>
                    <div className="qbuilder__row qbuilder__row--top">
                      <input
                        className="qbuilder__question-input"
                        type="text"
                        placeholder={`Câu hỏi ${index + 1} (nhập nội dung câu hỏi)`}
                        value={q.noi_dung}
                        onChange={(e) =>
                          updateQuestion(index, { noi_dung: e.target.value })
                        }
                      />

                      <select
                        className="qbuilder__type-select"
                        value={q.kieu}
                        onChange={(e) =>
                          updateQuestion(index, { kieu: e.target.value })
                        }
                      >
                        {QUESTION_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Options cho câu hỏi trắc nghiệm */}
                    {q.kieu === "radio" || q.kieu === "checkbox" ? (
                      <div className="qbuilder__options">
                        {(q.lua_chon || []).map((opt, optIndex) => {
                          const isCheckbox = q.kieu === "checkbox";
                          const checked =
                            Array.isArray(q.dap_an_dung) &&
                            q.dap_an_dung.includes(optIndex);

                          return (
                            <div className="qbuilder__option-row" key={optIndex}>
                              <input
                                type={isCheckbox ? "checkbox" : "radio"}
                                name={`correct-${q.id}`}
                                className="qbuilder__option-correct"
                                checked={checked}
                                onChange={() =>
                                  handleChangeCorrect(index, optIndex, isCheckbox)
                                }
                              />

                              <input
                                className="qbuilder__option-input"
                                type="text"
                                placeholder={`Tùy chọn ${optIndex + 1}`}
                                value={opt}
                                onChange={(e) => {
                                  const nextOpts = [...(q.lua_chon || [])];
                                  nextOpts[optIndex] = e.target.value;
                                  updateQuestion(index, { lua_chon: nextOpts });
                                }}
                              />

                              <button
                                type="button"
                                className="qbuilder__option-remove"
                                onClick={() => handleRemoveOption(index, optIndex)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          );
                        })}

                        <button
                          type="button"
                          className="qbuilder__add-option"
                          onClick={() => handleAddOption(index)}
                        >
                          Thêm tùy chọn
                        </button>
                      </div>
                    ) : null}

                    {/* Câu trả lời dạng text */}
                    {q.kieu === "text" && (
                      <div className="qbuilder__text-preview">
                        <input
                          className="qbuilder__text-input"
                          type="text"
                          disabled
                          placeholder="Ô trả lời ngắn của sinh viên (preview)"
                        />
                      </div>
                    )}

                    <div className="qbuilder__footer">
                      <div className="qbuilder__score">
                        <span>Điểm:</span>
                        <input
                          type="number"
                          min={0}
                          className="qbuilder__score-input"
                          value={q.diem}
                          onChange={(e) =>
                            updateQuestion(index, {
                              diem: Number(e.target.value) || 0,
                            })
                          }
                        />
                      </div>

                      <label className="qbuilder__required">
                        <input
                          type="checkbox"
                          checked={q.bat_buoc}
                          onChange={(e) =>
                            updateQuestion(index, { bat_buoc: e.target.checked })
                          }
                        />
                        <span>Bắt buộc</span>
                      </label>

                      <div className="qbuilder__actions">
                        <button
                          type="button"
                          className="btn btn--ghost dublicate"
                          onClick={() => handleDuplicateQuestion(index)}
                        >
                          Nhân bản
                        </button>
                        <button
                          type="button"
                          className="btn btn--ghost delete"
                          onClick={() => handleDeleteQuestion(index)}
                        >
                          Xóa câu hỏi
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Case Detail BOTTOM  */}
      <div className="caseDetail-bottom" >
        <button onClick={handleSaveToBackend} disabled={saving}>
            {saving ? "⏳ Đang lưu..." : "Lưu thông tin & câu hỏi bệnh án !"}
        </button>
      </div>
    </div>
  );
};

export default PatientCaseDetailPage;
