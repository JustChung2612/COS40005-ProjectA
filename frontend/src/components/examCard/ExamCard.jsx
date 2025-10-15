import React from "react";
import "./examCard.scss";
import { Eye, Edit, Trash2 } from "lucide-react"; // nice icons

const ExamCard = ({ data, onView, onEdit, onDelete }) => {
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
      <div className="cardHeader">
        <h3 className="subject">{metadata.mon_thi}</h3>
        <span className={`difficultyBadge ${diffClass}`}>
          {metadata.do_kho}
        </span>
      </div>

      <div className="cardBody">
        <p>
          <strong>👤 Bệnh nhân:</strong> {patient.ho_ten} – {patient.tuoi} tuổi –{" "}
          {patient.gioi_tinh}
        </p>
        <p>
          <strong>💬 Lý do:</strong> {patient.ly_do_nhap_vien}
        </p>
        <p>
          <strong>⚙️ Cơ quan:</strong> {metadata.co_quan} |{" "}
          <strong>🕰 Loại bệnh:</strong> {metadata.loai_benh}
        </p>
        <p>
          <strong>🧍‍♀️ Đối tượng:</strong> {metadata.doi_tuong}
        </p>
      </div>

      <div className="cardFooter">
        <button className="btn view" onClick={() => onView(data)}>
          <Eye size={16} /> Xem
        </button>
        <button className="btn edit" onClick={() => onEdit(data)}>
          <Edit size={16} /> Sửa
        </button>
        <button className="btn delete" onClick={() => onDelete(data)}>
          <Trash2 size={16} /> Xóa
        </button>
      </div>
    </div>
  );
};

export default ExamCard;
