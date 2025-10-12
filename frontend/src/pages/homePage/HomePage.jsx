import { Link } from "react-router-dom";
import {
  Stethoscope,
  ClipboardCheck,
  BarChart3,
  Award,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import "./HomePage.scss";

/* Nút nội bộ (thay cho shadcn Button) */
const Button = ({ children, variant = "primary", size = "lg", className = "", ...props }) => {
  const cls = ["btn", `btn--${variant}`, `btn--${size}`, className].join(" ");
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
};

const HomePage = () => {
  return (
    <div className="home">
      {/* Section 1 - Giới thiệu nền tảng (nền trắng) */}
      <section className="section section--intro">
        <div className="container intro">
          <div className="intro__grid">
            <div className="intro__copy">
              <h1 className="intro__title">
                Nền tảng luyện thi OSCE toàn diện dành cho sinh viên y khoa.
              </h1>
              <p className="intro__subtitle">
                Luyện tập với bệnh nhân ảo, rubric đánh giá chuẩn hoá và phản hồi tức thì giúp bạn
                nâng cao kỹ năng lâm sàng và tự tin bước vào kỳ thi thật.
              </p>
            </div>

            <div className="intro__visual">
              <div className="visual-card">
                <div className="visual-card__inner">
                  <div className="visual-row">
                    <Stethoscope className="icon icon--lg text-primary" />
                    <span className="visual-row__title">Giao diện Bệnh nhân Ảo</span>
                  </div>

                  <div className="visual-list">
                    <div className="visual-list__item">
                      <CheckCircle2 className="icon icon--sm text-success" />
                      <span>Tình huống OSCE thực tế</span>
                    </div>
                    <div className="visual-list__item">
                      <CheckCircle2 className="icon icon--sm text-success" />
                      <span>Phiên luyện tập có giới hạn thời gian</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>{/* intro__visual */}
          </div>
        </div>
      </section>

      {/* Section 2 - Lời kêu gọi hành động (nền xanh teal gradient) */}
      <section className="section section--cta">
        <div className="container cta">
          <h2 className="cta__title">
            Sẵn sàng luyện tập và theo dõi tiến trình học tập
          </h2>
          <p className="cta__subtitle">
            Truy cập các trạm luyện tập OSCE mọi lúc, mọi nơi — và theo dõi sự tiến bộ của bạn theo thời gian.
          </p>

          <div className="cta__actions">
            <Link to="/stations">
              <Button variant="primary" size="xl" className="tile">
                <Stethoscope className="icon icon--tile" />
                <span>Bắt đầu luyện tập</span>
              </Button>
            </Link>

            <Link to="/history">
              <Button variant="outline" size="xl" className="tile">
                <BarChart3 className="icon icon--tile" />
                <span>Xem tiến trình</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 3 - Tính năng chính (nền trắng) */}
      <section className="section section--features">
        <div className="container features">
          <div className="features__grid">
            <div className="features__copy">
              <h2 className="features__title">
                Trải nghiệm mô phỏng OSCE chân thực — như trong kỳ thi thật.
              </h2>

              <ul className="features__list">
                <li className="features__item">
                  <ClipboardCheck className="icon icon--md text-primary" />
                  <div>
                    <h3 className="features__item-title">Đa dạng chuyên khoa và loại trạm thi</h3>
                    <p className="muted">Luyện tập qua nhiều tình huống lâm sàng khác nhau</p>
                  </div>
                </li>

                <li className="features__item">
                  <Award className="icon icon--md text-primary" />
                  <div>
                    <h3 className="features__item-title">Chấm điểm tự động theo rubric</h3>
                    <p className="muted">Nhận đánh giá khách quan, nhanh chóng sau mỗi lần luyện tập</p>
                  </div>
                </li>

                <li className="features__item">
                  <BarChart3 className="icon icon--md text-primary" />
                  <div>
                    <h3 className="features__item-title">Phân tích hiệu suất và theo dõi kỹ năng</h3>
                    <p className="muted">Theo dõi quá trình phát triển năng lực của bạn</p>
                  </div>
                </li>

                <li className="features__item">
                  <TrendingUp className="icon icon--md text-primary" />
                  <div>
                    <h3 className="features__item-title">Gợi ý cải thiện cá nhân hóa</h3>
                    <p className="muted">Nhận phản hồi chi tiết để cải thiện qua từng buổi luyện tập</p>
                  </div>
                </li>
              </ul>

              <Link to="/stations">
                <Button variant="primary" size="lg" className="features__cta">Thử ngay</Button>
              </Link>
            </div>

            <div className="features__mock">
              <div className="mock">
                <div className="mock__card">
                  <div className="mock__row">
                    <span className="small font-medium">Ca bệnh</span>
                    <span className="small muted">15:00</span>
                  </div>
                  <div className="mock__bar">
                    <div className="mock__bar-fill" style={{ width: "75%" }} />
                  </div>
                </div>

                <div className="mock__card">
                  <h4 className="mock__title">Chấm điểm theo rubric</h4>
                  <div className="mock__scores">
                    <div className="mock__line">
                      <span>Khai thác bệnh sử</span>
                      <span className="text-success strong">8/10</span>
                    </div>
                    <div className="mock__line">
                      <span>Kỹ năng giao tiếp</span>
                      <span className="text-success strong">9/10</span>
                    </div>
                    <div className="mock__line">
                      <span>Lập kế hoạch điều trị</span>
                      <span className="text-warning strong">6/10</span>
                    </div>
                  </div>
                </div>

                <div className="mock__card">
                  <h4 className="mock__title mock__title--icon">
                    <TrendingUp className="icon icon--sm text-success" />
                    Biểu đồ tiến bộ
                  </h4>
                  <div className="mock__bars">
                    <div style={{ height: "40%" }} />
                    <div style={{ height: "60%" }} />
                    <div style={{ height: "75%" }} />
                    <div style={{ height: "90%" }} />
                  </div>
                </div>
              </div>{/* .mock */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
