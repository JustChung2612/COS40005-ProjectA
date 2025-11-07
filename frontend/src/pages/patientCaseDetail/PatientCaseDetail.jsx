import "./patientCaseDetail.scss";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ArrowLeft, Loader2 } from "lucide-react";

const PatientCaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/patient-cases/${id}`);
        setCaseData(res.data?.data);
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

  if (loading)
    return (
      <div className="caseDetail__loading">
        <Loader2 className="spin" size={30} /> Đang tải bệnh án...
      </div>
    );

  if (error) return <div className="caseDetail__error">{error}</div>;
  if (!caseData) return <div className="caseDetail__error">Không tìm thấy bệnh án.</div>;

  const { metadata, benh_an_tinh_huong, cau_hoi } = caseData;
  const patient = benh_an_tinh_huong?.thong_tin_benh_nhan || {};

  return (
    <div className="caseDetail">
      <button className="backBtn" onClick={() => navigate(-1)}>
        <ArrowLeft /> Quay lại
      </button>

      <h1 className="caseDetail__title">{metadata?.chuan_doan || "Bệnh án"}</h1>
      <p className="caseDetail__subtitle">
        Cơ quan: {metadata?.co_quan || "Không rõ"} | Độ khó: {metadata?.do_kho || "Không rõ"}
      </p>

      <div className="caseDetail__section">
        <h2>🧍‍♀️ Thông tin bệnh nhân</h2>
        <ul>
          <li>Họ tên: {patient.ho_ten}</li>
          <li>Tuổi: {patient.tuoi}</li>
          <li>Giới tính: {patient.gioi_tinh}</li>
          <li>Nghề nghiệp: {patient.nghe_nghiep}</li>
          <li>Lý do nhập viện: {patient.ly_do_nhap_vien}</li>
        </ul>
      </div>

      <div className="caseDetail__section">
        <h2>📋 Bệnh sử</h2>
        <p>{benh_an_tinh_huong?.benh_su?.mo_ta1}</p>
        <p>{benh_an_tinh_huong?.benh_su?.mo_ta2}</p>
        <p>{benh_an_tinh_huong?.benh_su?.mo_ta3}</p>
      </div>

      <div className="caseDetail__section">
        <h2>💊 Tiền căn</h2>
        <ul>
          {(benh_an_tinh_huong?.tien_can || []).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="caseDetail__section">
        <h2>🧠 Lược qua các cơ quan</h2>
        <ul>
          {(benh_an_tinh_huong?.luoc_qua_cac_co_quan || []).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="caseDetail__section">
        <h2>🩺 Khám lâm sàng</h2>
        <ul>
          {(benh_an_tinh_huong?.kham_lam_sang || []).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="caseDetail__section">
        <h2>❓ Câu hỏi</h2>
        {cau_hoi?.length ? (
          <ol>
            {cau_hoi.map((q) => (
              <li key={q.id}>
                <strong>{q.noi_dung}</strong> <br />
                <em>Kiểu: {q.kieu}</em>
              </li>
            ))}
          </ol>
        ) : (
          <p>Không có câu hỏi nào.</p>
        )}
      </div>
    </div>
  );
};

export default PatientCaseDetail;
