import "./patientCaseDetailPage.scss";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ArrowLeft, Loader2 ,Clock, FileText, AlertCircle, CheckCircle2, ArrowBigRight } from "lucide-react";


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

      <div className="caseDetail-main"  >
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
                      <p>{benh_an_tinh_huong?.benh_su?.mo_ta1}</p>
                      <p>{benh_an_tinh_huong?.benh_su?.mo_ta2}</p>
                      <p>{benh_an_tinh_huong?.benh_su?.mo_ta3}</p>
                    </div>
                  </section>

                  <section ref={tienCanRef} className="section">
                    <h3 className="section__title">Tiền căn</h3>
                    <ul className="list">
                      {(benh_an_tinh_huong?.tien_can || []).map((t,i)=><li key={i}> {t}</li>)}
                    </ul>
                  </section>

                  <section ref={luocQuaRef} className="section">
                    <h3 className="section__title">Lược qua các cơ quan</h3>
                    <ul className="list">
                      {(benh_an_tinh_huong?.luoc_qua_cac_co_quan || []).map((t,i)=><li key={i}> {t}</li>)}
                    </ul>
                  </section>

                  <section ref={khamLSRef} className="section">
                    <h3 className="section__title">Khám lâm sàng</h3>
                    <ul className="list">
                      {(benh_an_tinh_huong?.kham_lam_sang || []).map((t,i)=><li key={i}> {t}</li>)}
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
            a
          </section>

      </div>


      
    </div>
  );
};

export default PatientCaseDetailPage;
