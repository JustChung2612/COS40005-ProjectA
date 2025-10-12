import React from "react";
import toast, { Toaster } from "react-hot-toast";
import "./OSCESPage.scss";

const OSCESPage = () => {
  const handleNext = () => {
    toast.success("Đang chuyển đến trạm kế tiếp...", {
      duration: 2000,
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });

    setTimeout(() => {
      alert("Navigate to next station");
      // You can replace the alert with your actual navigation logic later
      // e.g., navigate("/next-station");
    }, 2000);
  };

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />

      {/* Fixed Header */}
      <header className="header">
        <span className="timer-badge">Thời gian còn lại: 07:00</span>
      </header>

      {/* Main Content */}
      <main>
        <div className="content-grid">
          {/* Left Column: Patient Info */}
          <aside className="card patient-info">
            <h2>Thông tin bệnh nhân</h2>
            <p>BN nam, 54 tuổi, nhân viên văn phòng, nhập viện vì tiểu đỏ.</p>

            <h3>Bệnh sử</h3>
            <ul>
              <li>1 ngày trước: nước tiểu đỏ toàn dòng, sau khi tiểu xong thấy sợi máu.</li>
              <li>Kèm cảm giác tiểu khó/tiểu gắt mỗi khi đi tiểu.</li>
              <li>Đôi khi rỉ vài giọt nước tiểu không kiểm soát.</li>
              <li>Không sốt, không đau hông lưng, không phù.</li>
            </ul>

            <h3>Tiền căn</h3>
            <ul>
              <li>Hút thuốc 34 gói-năm, hiện còn hút.</li>
              <li>Uống rượu nhẹ hằng ngày (~300 ml).</li>
              <li>ĐTĐ type 2, Metformin 5 năm, kiểm soát tốt.</li>
              <li>Thoái hóa khớp gối 5 năm, thỉnh thoảng dùng thuốc giảm đau.</li>
              <li>Chưa ghi nhận tiểu đỏ trước đây.</li>
              <li>Không chấn thương vùng hông lưng gần đây.</li>
              <li>Không bệnh lý máu/huyết học gia đình.</li>
              <li>Chưa phẫu thuật ngoại khoa.</li>
              <li>Gia đình: chưa ghi nhận bất thường.</li>
            </ul>

            <h3>Khám lúc nhập viện</h3>
            <ul>
              <li>Tỉnh, tiếp xúc tốt; da niêm hồng, không phù; BMI ~21,4 kg/m².</li>
              <li>Mạch 84 lần/phút; HA 120/80 mmHg; SpO₂ 98%; Nhịp thở 20 lần/phút; Nhiệt 37°C.</li>
              <li>Tim đều, phổi trong, bụng mềm, không điểm đau; chạm thận (-), rung thận (-).</li>
              <li>
                Gan lách không to; Q/S hậu môn trực tràng: tiền liệt tuyến to, mật độ mềm, rãnh
                phân cách rõ, ấn không đau.
              </li>
            </ul>
          </aside>

          {/* Right Column: Questions */}
          <section className="card questions">
            <h2>Câu hỏi</h2>

            <div className="question-item">
              <div className="question-text">
                1. Vị trí tổn thương gây tiểu máu ở bệnh nhân này nghĩ nhiều nhất là?
              </div>
              <ul className="options">
                <li>a) Cầu thận</li>
                <li>b) Niệu quản</li>
                <li>c) Bàng quang</li>
                <li>d) Tiền liệt tuyến</li>
              </ul>
            </div>

            <div className="question-item">
              <div className="question-text">
                2. Chọn 2 cận lâm sàng cần thực hiện để hỗ trợ chẩn đoán:
              </div>
              <ul className="options">
                <li>a) Tổng phân tích nước tiểu (TPNT); siêu âm bụng</li>
                <li>b) TPNT; sinh thiết thận</li>
                <li>c) Chức năng thận: BUN, Creatinine; Siêu âm bụng</li>
                <li>d) Cặn lắng Addis; CN thận: BUN, Creatinine</li>
              </ul>
            </div>

            <div className="question-item">
              <div className="question-text">3. Hướng dẫn lấy mẫu Cặn Addis đúng là:</div>
              <ul className="options">
                <li>a) Lấy nước tiểu buổi sáng, giữa dòng tiểu, cho vào lọ chứa sạch</li>
                <li>b) Lấy toàn bộ nước tiểu trong 24 giờ, bảo quản lạnh</li>
                <li>c) Lấy nước tiểu đầu dòng buổi sáng, cho vào lọ vô trùng</li>
                <li>d) Lấy nước tiểu giữa dòng, bất kỳ thời điểm nào trong ngày</li>
              </ul>
            </div>

            <div className="question-item">
              <div className="question-text">4. KQ tổng phân tích nước tiểu nào phù hợp với ca này?</div>
              <ul className="options">
                <li>
                  a) Protein (+), Hồng cầu 8-10/LP, Bạch cầu 2-3/LP, Trụ hồng cầu (+)
                </li>
                <li>
                  b) Protein (-), Hồng cầu &gt; 100/LP, Bạch cầu 15-20/LP, Vi khuẩn (+)
                </li>
                <li>
                  c) Protein (-), Hồng cầu &gt; 100/LP, Bạch cầu 4-6/LP, Vi khuẩn (-)
                </li>
                <li>
                  d) Protein (++), Hồng cầu 3-5/LP, Bạch cầu 1-2/LP, Trụ sáp (+)
                </li>
              </ul>
            </div>

            <div className="question-item">
              <div className="question-text">5. Chẩn đoán nghĩ nhiều nhất?</div>
              <ul className="options">
                <li>a) Nhiễm trùng tiểu dưới</li>
                <li>b) Bệnh lý cầu thận</li>
                <li>c) Ung thư ác tính ở tiền liệt tuyến</li>
                <li>d) Bướu bàng quang chảy máu</li>
                <li>e) Viêm bàng quang xuất huyết</li>
              </ul>
            </div>
          </section>
        </div>
      </main>

      {/* Next Station Button */}
      <div className="button-container">
        <button className="toast-button" onClick={handleNext}>
          ⟶ Next station
        </button>
      </div>
    </div>
  );
};

export default OSCESPage;
