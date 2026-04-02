//PatientCaseList.jsx
import { useState, useEffect } from "react";
import PatientCaseCard from "../../../../components/patientCaseCard/PatientCaseCard.jsx";
import axios from "axios";
import './patientCaseList.scss';
import { Search } from 'lucide-react';

const PatientCaseList = () => {
  const [examCases, setExamCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [aiExtractedFilters, setAiExtractedFilters] = useState(null);

  const [filters, setFilters] = useState({
    chuan_doan: "",
    co_quan: "",
    trieu_chung: "",
    do_kho: "",
    doi_tuong: "",
    do_tuoi: [0, 100],
  });

  const diagnosisOptions = ["Lao Phổi ", "Suy Tim", "Viêm Phổi", "Tràn Khí Màng", "Tăng Huyết Áp", "Lao"];
  const organOptions = ["Tim mạch", "Phổi", "Thận", "Tiêu hóa", "Thần kinh", "Gan", "Dạ dày"];
  const symptomOptions = ["Khó thở", "Ho ra máu", "Lơ mơ", "Đau ngực", "Sốt"];
  const difficultyOptions = ["Cơ bản", "Trung bình", "Nâng cao"];
  const targetGroupOptions = ["Người lớn", "Người già", "Trẻ em", "Thai phụ"];

  // -------------------- Fetch Patient Cases --------------------

  const fetchPatientCases = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get("http://localhost:5000/api/patient-cases");
      setExamCases(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch Patient Cases:", err);
      setError("Không thể tải danh sách Bệnh Án");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientCases();
  }, []);

  // -------------------- Filter Logic --------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleRangeChange = (e, index) => {
    const newRange = [...filters.do_tuoi];
    newRange[index] = Number(e.target.value);
    setFilters({ ...filters, do_tuoi: newRange });
  };

  const handleAiKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAiSearch();
    }
  };
  
  const handleResetAiSearch = async () => {
    setAiPrompt("");
    setAiMessage("");
    setAiExtractedFilters(null);
    setError(null);

    await fetchPatientCases();
  };

  const handleApplyFilter = async () => {
    try {
      setLoading(true);
      setAiMessage("");
      setAiExtractedFilters(null);
      setError(null);

      const queryParams = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          queryParams.append(key, value.join(","));
        } else if (value) {
          queryParams.append(key, value);
        }
      });

      const res = await axios.get(
        `http://localhost:5000/api/patient-cases?${queryParams.toString()}`
      );
      setExamCases(res.data?.data || []);
    } catch (err) {
      console.error("Error applying filter:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAiSearch = async () => {
    try {
      if (!aiPrompt.trim()) {
        setAiMessage("Vui lòng nhập yêu cầu để AI tìm bệnh án.");
        setAiExtractedFilters(null);
        return;
      }

      setAiLoading(true);
      setError(null);
      setAiMessage("");
      setAiExtractedFilters(null);

      const res = await axios.post("http://localhost:5000/api/openai/filter-patient-cases",
        {
          prompt: aiPrompt.trim(),
        }
      );

      const matchedCases = res.data?.data || [];
      const count = res.data?.count || 0;
      const extractedFilters = res.data?.extractedFilters || null;

      setExamCases(matchedCases);
      setAiExtractedFilters(extractedFilters);

      if (count === 0) {
        setAiMessage("AI đã hiểu yêu cầu nhưng không tìm thấy bệnh án phù hợp.");
      } else {
        setAiMessage(`AI đã tìm thấy ${count} bệnh án phù hợp.`);
      }
    } catch (err) {
      console.error("Error using AI search:", err);

      setAiExtractedFilters(null);
      setAiMessage(
        err?.response?.data?.message ||
          "AI chưa thể tìm bệnh án lúc này. Vui lòng thử lại."
      );
    } finally {
      setAiLoading(false);
    }
  };
  // -------------------- UI --------------------
  if (loading) return <div>Đang tải danh sách Bệnh Án...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="examContainer">
      {/* ---------- FILTER SECTION ---------- */}
      <div className="filterExam">
        <h3>Bộ lọc bệnh án</h3>

        <div className="filterGroup">
          {/* Chuẩn đoán */}
          <div className="filterItem">
            <label>Chuẩn Đoán - Chủ Đề</label>
            <select name="chuan_doan" value={filters.chuan_doan} onChange={handleChange}>
              <option value="">Tất cả</option>
              {diagnosisOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Cơ quan */}
          <div className="filterItem">
            <label>Cơ quan</label>
            <select name="co_quan" value={filters.co_quan} onChange={handleChange}>
              <option value="">Tất cả</option>
              {organOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Triệu chứng */}
          <div className="filterItem">
            <label>Triệu chứng</label>
            <select name="trieu_chung" value={filters.trieu_chung} onChange={handleChange}>
              <option value="">Tất cả</option>
              {symptomOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Độ khó */}
          <div className="filterItem">
            <label>Độ khó</label>
            <select name="do_kho" value={filters.do_kho} onChange={handleChange}>
              <option value="">Tất cả</option>
              {difficultyOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Đối tượng */}
          <div className="filterItem">
            <label>Đối tượng</label>
            <select name="doi_tuong" value={filters.doi_tuong} onChange={handleChange}>
              <option value="">Tất cả</option>
              {targetGroupOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Độ tuổi */}
          <div className="filterItem rangeItem">
            <label>
              Độ tuổi: {filters.do_tuoi[0]} - {filters.do_tuoi[1]}
            </label>
            <div className="rangeSlider">
              <input
                type="range"
                min="0"
                max="100"
                value={filters.do_tuoi[0]}
                onChange={(e) => handleRangeChange(e, 0)}
                className="thumb thumb--left"
              />
              <input
                type="range"
                min="0"
                max="100"
                value={filters.do_tuoi[1]}
                onChange={(e) => handleRangeChange(e, 1)}
                className="thumb thumb--right"
              />
            </div>
          </div>

          <button className="applyButton" onClick={handleApplyFilter}>
            Áp dụng bộ lọc
          </button>
        </div>
      </div>

      {/* ---------- AI FILTERING SECTION ---------- */}
      <div className="Ai_filter_con">
        <h3 className="Ai_title">Tìm trạm thi dễ hơn với AI</h3>

        <div className="adNavSearch">
          <Search className="icon" />
          <input
            type="text"
            id="SearchInput"
            placeholder="Ví dụ: Tìm bệnh án phổi cho người già khó thở..."
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={handleAiKeyDown}
          />

          <button
            type="button"
            className="applyButton"
            onClick={handleAiSearch}
            disabled={aiLoading}
          >
            {aiLoading ? "AI đang tìm..." : "Tìm với AI"}
          </button>

          <button
            type="button"
            className="applyButton"
            onClick={handleResetAiSearch}
            disabled={aiLoading}
          >
            Đặt lại
          </button>
        </div>

        {aiMessage && (
          <div  style={{ marginTop: "0.75rem", fontSize: "0.95rem", color: "#444", fontWeight: "500",}}
          >
            {aiMessage}
          </div>
        )}

        {aiExtractedFilters && (
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.75rem 1rem",
              background: "#f7f8fa",
              borderRadius: "10px",
              fontSize: "0.92rem",
              color: "#333",
              lineHeight: "1.6",
            }}
          >
            <strong>AI đã hiểu yêu cầu thành:</strong>
            <div>Chuẩn đoán: {aiExtractedFilters.chuan_doan || "Không có"}</div>
            <div>Cơ quan: {aiExtractedFilters.co_quan || "Không có"}</div>
            <div>Triệu chứng: {aiExtractedFilters.trieu_chung || "Không có"}</div>
            <div>Độ khó: {aiExtractedFilters.do_kho || "Không có"}</div>
            <div>Đối tượng: {aiExtractedFilters.doi_tuong || "Không có"}</div>
            <div>
              Độ tuổi:{" "}
              {aiExtractedFilters.min_tuoi !== null || aiExtractedFilters.max_tuoi !== null
                ? `${aiExtractedFilters.min_tuoi ?? "?"} - ${aiExtractedFilters.max_tuoi ?? "?"}`
                : "Không có"}
            </div>
          </div>
        )}
      </div>

      {/* ---------- EXAM LIST SECTION ---------- */}
      <div className="examListContainer">
        <h3 className="listTitle">Danh sách Bệnh Án</h3>
        <div className="examListMain">
          { examCases.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                marginTop: "3rem",
                fontSize: "1.2rem",
                color: "#555",
                fontWeight: "500",
              }}
            >
              {aiPrompt.trim()
              ? <>Không tìm thấy bệnh án phù hợp với yêu cầu AI.</>
              : <>Không có bệnh án nào, hãy <strong>tải bệnh án ngay!</strong></>}
            </div>
          ) : (
            <div className="examList">
              {examCases.map((caseData, i) => (
                <PatientCaseCard
                  key={caseData._id || i}
                  data={caseData}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientCaseList;
