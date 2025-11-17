import "./patientCaseDetailPage.scss";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ArrowLeft, Loader2 ,Clock, FileText, AlertCircle, CheckCircle2, ArrowBigRight } from "lucide-react";

import EditPatientCaseSection from "../HuyAnh1/EditPatientCaseSection";

export const Card = ({ className = "", children, ...p }) => <div className={["card", className].join(" ")} {...p}>{children}</div>;
export const CardContent = ({ className = "", children, ...p }) => <div className={["card__content", className].join(" ")} {...p}>{children}</div>;

const PatientCaseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("thong_tin");


const scrollToSection = (ref, key) => {
  setActiveSection(key);
  ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
};

    // 2️⃣ Refs & UI state
  const thongTinRef = useRef(null);
  const benhSuRef = useRef(null);
  const tienCanRef = useRef(null);
  const luocQuaRef = useRef(null);
  const khamLSRef = useRef(null);
  const qScrollRef = useRef(null);
  const questionRefs = useRef({});

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
    <div className="patientCaseDetail-page">

      <div className="caseDetail-top" >
          <button className="backBtn" onClick={() => navigate(-1)}>
            <ArrowLeft /> Quay lại
          </button>
          <h1 className="caseDetail__title">{metadata?.chuan_doan || "Bệnh án"}</h1>
          <p className="caseDetail__subtitle">
            Cơ quan: {metadata?.co_quan || "Không rõ"} | Độ khó: {metadata?.do_kho || "Không rõ"}
          </p>
      </div>

      <EditPatientCaseSection
        caseData={caseData}
        // questions={questions}
        // onQuestionsChange={setQuestions}
      /> 


      
    </div>
  );
};

export default PatientCaseDetailPage;
