// AiResultPage.jsx
import "./AiResultPage.scss";
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";


const AiResultPage = () => {
  const { id } = useParams(); // caseId
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [caseTitle, setCaseTitle] = useState("");
  const [aiAssess, setAiAssess] = useState(null);

  useEffect(() => {
    const runtimeAssess = location.state?.aiAssess;
    const runtimeCaseTitle = location.state?.caseTitle;

    if (runtimeAssess) {
      setAiAssess(runtimeAssess);
      setCaseTitle(runtimeCaseTitle || "");
      setLoading(false);
      setError("");
      return;
    }

    if (!id) {
      setError("Missing case id.");
      setLoading(false);
      return;
    }

    const fetchCase = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(`http://localhost:5000/api/ai-cases/${id}`);

        const foundCase = res.data?.data;

        setCaseTitle(foundCase?.title || "");
        setAiAssess(foundCase?.ai_assess_schema || null);

      } catch (err) {
        console.error("Failed to load AI result:", err);
        setError("Failed to load AI evaluation. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [id, location.state]);

  const quantitative = aiAssess?.quantitative || {};
  const evaluationResults = aiAssess?.evaluation_results || {};
  const qualitativeFeedback = aiAssess?.qualitative_feedback || {};

  const conclusion = quantitative?.conclusion || "Fail";
  const conclusionLabel = conclusion === "Pass" ? "Đạt" : "Chưa đạt";

  const FEEDBACK_TRANSLATIONS = {
    "Asked about main symptoms and presenting complaint.": "Đã hỏi các triệu chứng chính và lý do vào khám.",
    "Mentioned some symptom questions but not consistently.": "Có hỏi triệu chứng nhưng chưa đều và chưa sâu.",
    "Core symptom exploration was limited.": "Phần khai thác triệu chứng cốt lõi còn hạn chế.",
    "Explored symptom timeline (onset or duration).": "Đã khai thác diễn tiến thời gian triệu chứng (khởi phát/thời lượng).",
    "Timeline cues appeared but were not actively explored by the student.": "Có tín hiệu về thời gian triệu chứng nhưng chưa được hỏi chủ động.",
    "Timeline of symptoms was not clearly asked.": "Chưa hỏi rõ diễn tiến thời gian của triệu chứng.",
    "Collected relevant background history (medical/family/social/medication).": "Đã khai thác tiền sử liên quan (bệnh, gia đình, xã hội, thuốc).",
    "Background history was touched indirectly.": "Tiền sử có được đề cập gián tiếp nhưng chưa rõ ràng.",
    "Background history coverage was minimal.": "Mức độ khai thác tiền sử còn ít.",
    "Conversation stayed aligned with case-specific details.": "Nội dung hội thoại bám sát thông tin của ca bệnh.",
    "Some case-specific details were mentioned.": "Đã đề cập một phần thông tin đặc thù của ca bệnh.",
    "Case-specific detail coverage was low.": "Mức độ bám thông tin ca bệnh còn thấp.",
    "Maintained enough follow-up questions for data collection.": "Có đủ câu hỏi follow-up để thu thập dữ liệu.",
    "Moderate follow-up questioning was present.": "Có follow-up ở mức trung bình.",
    "Interaction was too short for strong data gathering.": "Thời lượng tương tác còn ngắn để khai thác dữ liệu tốt.",
    "Asked for plan/test/treatment direction": "Đã hỏi định hướng kế hoạch/xét nghiệm/điều trị.",
    "Management intent was mentioned": "Có đề cập hướng xử trí nhưng chưa rõ.",
    "Management direction was unclear": "Định hướng xử trí còn mơ hồ.",
    "Included basic safety-net advice": "Đã có dặn dò an toàn cơ bản (safety-net).",
    "Safety advice was only partially clear": "Dặn dò an toàn có nhắc đến nhưng chưa rõ ràng.",
    "Safety-net advice was missing": "Chưa có dặn dò an toàn (safety-net).",
    "Used empathic and polite language": "Cách giao tiếp thể hiện sự đồng cảm và lịch sự.",
    "Basic empathy markers were present": "Có dấu hiệu đồng cảm ở mức cơ bản.",
    "Empathy markers were limited": "Dấu hiệu đồng cảm còn hạn chế.",
    "Conversation flow stayed consistent": "Mạch hội thoại ổn định và nhất quán.",
    "Conversation flow was moderately consistent": "Mạch hội thoại tương đối ổn định.",
    "Conversation flow was fragmented": "Mạch hội thoại còn rời rạc.",
    "Ask more structured symptom-history questions to improve coverage.": "Nên hỏi bệnh sử và triệu chứng theo cấu trúc rõ hơn để tăng độ bao phủ.",
    "State a clearer next-step plan (test, treatment, follow-up).": "Nên nêu rõ kế hoạch bước tiếp theo (xét nghiệm, điều trị, theo dõi).",
    "Use more explicit empathy and reassurance statements.": "Nên dùng thêm câu thể hiện đồng cảm và trấn an người bệnh.",
    "Maintained an active interview with the virtual patient.": "Duy trì tương tác chủ động với bệnh nhân ảo.",
    "Covered key case details with reasonable breadth.": "Đã bao quát được các ý quan trọng của ca bệnh ở mức tốt.",
    "Showed practical management direction.": "Đã thể hiện định hướng xử trí thực tế.",
    "Communication style was clear and patient-friendly.": "Giao tiếp rõ ràng và thân thiện với người bệnh.",
  };

  const toVietnamese = (text) => FEEDBACK_TRANSLATIONS[text] || text;

  const safeArray = (v) => (Array.isArray(v) ? v : []);
  const renderList = (items) => {
    const arr = safeArray(items);
    if (arr.length === 0) {
      return (
        <ul className="result_list">
          <li className="list_empty_item">Không có</li>
        </ul>
      );
    }
    return (
      <ul className="result_list">
        {arr.map((it, idx) => {
          const label = typeof it === "string" ? it : JSON.stringify(it);
          return <li key={idx}>{toVietnamese(label)}</li>;
        })}
      </ul>
    );
  };

  const needsImprovement = safeArray(qualitativeFeedback?.needs_improvement);
  const good = safeArray(qualitativeFeedback?.good);

  // For "needs_improvement": allow either strings OR objects like { title, detail }
  const needsImprovementBlocks = useMemo(() => {
    if (needsImprovement.length === 0) return null;

    return needsImprovement.map((item, idx) => {
      if (typeof item === "string") {
        return (
          <div className="feedback_item" key={idx}>
            <p>{toVietnamese(item)}</p>
          </div>
        );
      }
      // try common shapes
      const title = toVietnamese(item?.title || item?.name || item?.category || `Mục ${idx + 1}`);
      const detail = toVietnamese(item?.detail || item?.text || item?.message || JSON.stringify(item));

      return (
        <div className="feedback_item" key={idx}>
          <h4>{title}</h4>
          <p>{detail}</p>
        </div>
      );
    });
  }, [needsImprovement]);

  if (loading) {
    return <h2 className="Ai_result_title">Đang tải kết quả đánh giá...</h2>;
  }

  if (error) {
    return <h2 className="Ai_result_title">{error}</h2>;
  }

  if (!aiAssess) {
    return <h2 className="Ai_result_title">Không tìm thấy dữ liệu đánh giá AI cho ca này.</h2>;
  }

  return (
    <>
      <h1 className="Ai_result_title">Kết quả đánh giá với Bệnh Nhân AI</h1>
      <div className="result_back_btn">
        <button
          type="button"
          onClick={() => navigate(-1)}
        >
          ← Quay lại
        </button>
      </div>

      <section className="Ai_assess_container">
        {/* ================= TABLE SCORE ================= */}
        <div className="table_score">
          <h2>Điểm định lượng</h2>

          <table>
            <thead>
              <tr>
                <th>Ca bệnh</th>
                <th>Khai thác thông tin</th>
                <th>Hướng giải quyết</th>
                <th>Giao tiếp</th>
                <th>Tổng điểm</th>
                <th>Điểm cần đạt</th>
                <th>Kết quả</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>{caseTitle || "Ca bệnh chưa đặt tên"}</td>
                <td>{Number(quantitative?.data_gathering ?? 0).toFixed(2)}</td>
                <td>{Number(quantitative?.management ?? 0).toFixed(2)}</td>
                <td>{Number(quantitative?.interpersonal ?? 0).toFixed(2)}</td>
                <td>{Number(quantitative?.total ?? 0).toFixed(2)}</td>
                <td>{quantitative?.score_needed ?? 0}</td>
                <td className={conclusion === "Pass" ? "pass" : "fail"}>{conclusionLabel}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ================= EVALUATION RESULT ================= */}
        <div className="evaluation_result">
          <h2>Chi tiết đánh giá</h2>

          {/* ================= DATA GATHERING ================= */}
          <div className="criteria data_gathering">
            <h3>📊 Khai thác thông tin</h3>

            <div className="criteria_boxes">
              <div className="box covered">
                <h4>Đã làm tốt</h4>
                {renderList(evaluationResults?.data_gathering?.covered)}
              </div>

              <div className="box partial">
                <h4>Làm một phần</h4>
                {renderList(evaluationResults?.data_gathering?.partially_covered)}
              </div>

              <div className="box missed">
                <h4>Cần bổ sung</h4>
                {renderList(evaluationResults?.data_gathering?.missed)}
              </div>
            </div>
          </div>

          {/* ================= MANAGEMENT ================= */}
          <div className="criteria management">
            <h3>🩺 Hướng giải quyết</h3>

            <div className="criteria_boxes">
              <div className="box covered">
                <h4>Đã làm tốt</h4>
                {renderList(evaluationResults?.management?.covered)}
              </div>

              <div className="box partial">
                <h4>Làm một phần</h4>
                {renderList(evaluationResults?.management?.partially_covered)}
              </div>

              <div className="box missed">
                <h4>Cần bổ sung</h4>
                {renderList(evaluationResults?.management?.missed)}
              </div>
            </div>
          </div>

          {/* ================= INTERPERSONAL ================= */}
          <div className="criteria interpersonal">
            <h3>🤝 Kỹ năng giao tiếp</h3>

            <div className="criteria_boxes">
              <div className="box covered">
                <h4>Đã làm tốt</h4>
                {renderList(evaluationResults?.interpersonal?.covered)}
              </div>

              <div className="box partial">
                <h4>Làm một phần</h4>
                {renderList(evaluationResults?.interpersonal?.partially_covered)}
              </div>

              <div className="box missed">
                <h4>Cần bổ sung</h4>
                {renderList(evaluationResults?.interpersonal?.missed)}
              </div>
            </div>
          </div>
        </div>

        {/* ================= QUALITATIVE FEEDBACK ================= */}
        <div className="qualitative_feedback">
          <h2>🎯 Nhận xét định tính</h2>

          <div className="qualitative_container">
            <div className="qual_box needs_improvement">
              <h3>Cần cải thiện</h3>
              {needsImprovementBlocks || <p>Không có</p>}
            </div>

            <div className="qual_box good">
              <h3>Điểm tốt</h3>
              {good.length === 0 ? (
                <p>Không có</p>
              ) : (
                good.map((item, idx) => (
                  <div className="feedback_item" key={idx}>
                    {typeof item === "string" ? toVietnamese(item) : JSON.stringify(item)}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AiResultPage;