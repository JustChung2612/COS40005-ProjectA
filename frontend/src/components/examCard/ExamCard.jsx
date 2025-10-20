// components/examCard/ExamCard.jsx
import "./examCard.scss";
import { Eye, Edit, Trash2 } from "lucide-react"; 
import { Link } from "react-router-dom"

const ExamCard = ({ data, onView, onEdit, onDelete, selectionMode=false, checked=false, onToggleSelect=()=>{} }) => {
  const { metadata, benh_an_tinh_huong } = data;

  const patient = benh_an_tinh_huong.thong_tin_benh_nhan;
  const diffClass =
    metadata.do_kho === "Cơ bản"
      ? "basic"
      : metadata.do_kho === "Trung bình"
      ? "medium"
      : "advanced";

  return (
    <div className="examCard">
      {/* selection checkbox in top-right */}
      {selectionMode && (
        <label className="selectBoxTopRight">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => onToggleSelect(data.tram_thi_ID)}
          />
        </label>
      )}

      {/* Card Header */}
      <div className="cardHeader">
        <p>Chuẩn Đoán: </p>
        <div className="cardHeader_Inner" >
          <h2 className="subject">{metadata.chuan_doan}</h2>
          <span className={`difficultyBadge ${diffClass}`}>
            {metadata.do_kho}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="cardBody">
        <p>
          <strong>👤 Bệnh nhân:</strong> {patient.ho_ten} – {patient.tuoi} tuổi –{" "}
          {patient.gioi_tinh}
        </p>
        <p>
          <strong>💬 Lý do:</strong> {patient.ly_do_nhap_vien}
        </p>
        <p>
          <strong>⚙️ Cơ quan:</strong> {metadata.co_quan} 
        </p>
        <p>
          <strong>🧍‍♀️ Đối tượng:</strong> {metadata.doi_tuong}
        </p>
      </div>

      {/* Card Footer */}
      <div className="cardFooter">
        <Link to={`/tramthiOSCE/${data.tram_thi_ID}`} className='examLink' >
          <button className="btn view">
            <Eye size={16} /> Xem
          </button>
        </Link>

        <Link className='examLink' >
          <button className="btn edit" onClick={() => onEdit?.(data)}>
            <Edit size={16} /> Sửa
          </button>
        </Link>

        <Link className='examLink' >
          <button className="btn delete" onClick={() => onDelete?.(data)}>
            <Trash2 size={16} /> Xóa
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ExamCard;
