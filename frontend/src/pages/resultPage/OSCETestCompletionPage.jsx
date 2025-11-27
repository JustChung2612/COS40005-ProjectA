import React from "react";
import "./OSCETestCompletionPage.scss";

const OSCETestCompletionPage = ({ student, stations }) => {
  return (
    <div className="completion-page">
      <div className="completion-card">
        {/* --- Title --- */}
        <h2 className="completion-title">
          🎉 Bạn đã hoàn thành bài thi
          <span className="vn-text">🎉 Kết quả của bạn như sau</span>
        </h2>

        {/* --- Student Information --- */}
        <div className="student-info">
          <p>
            <strong>Họ và tên:</strong> {student.name}
          </p>
          <p>
            <strong>Mã số sinh viên:</strong> {student.id}
          </p>
          <p>
            <strong>Lớp:</strong> {student.className}
          </p>
        </div>

        {/* --- Results Section --- */}
        <div className="results-section">
          <h3 className="section-title">Kết quả bài thi</h3>

          <table className="results-table">
            <thead>
              <tr>
                <th>Trạm thi</th>
                <th>Kết quả</th>
              </tr>
            </thead>
            <tbody>
              {stations.map((station, index) => (
                <tr key={index}>
                  <td>{station.name}</td>
                  <td>
                    {station.type === "mcq"
                      ? `${station.score}/100`
                      : "Câu hỏi tự luận đang được chấm bởi giảng viên"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- Action Buttons --- */}
        <div className="action-buttons">
          <button>Quay lại Dashboard</button>
          <button className="secondary">Tải báo cáo kết quả thi</button>
        </div>
      </div>
    </div>
  );
};

export default OSCETestCompletionPage;
