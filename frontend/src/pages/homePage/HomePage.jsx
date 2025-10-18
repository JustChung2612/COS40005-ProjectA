import { Link } from "react-router-dom";
import {
  Stethoscope,
  ClipboardCheck,
  BarChart3,
  Award,
  CheckCircle2,
  TrendingUp,
  Microscope
} from "lucide-react";
import "./HomePage.scss";

const HomePage = () => {
  return (
    <div className="home">
      {/* Section 1 - Giới thiệu nền tảng (nền trắng) */}
      <section className="section section--intro">
          <div className="intro__flex">
            <div className="intro__copy">
              <h1 className="intro__title">
                Nền tảng thi 
                <br/> 
                <span className="loader" > 
                  <span className="loader-text">Trạm OSCE</span> 
                </span> 
                <br/> 
                toàn diện dành cho sinh viên y khoa.
              </h1>
              <p className="intro__subtitle">
                Nền tảng giúp sinh viên Y thuận tiện trong việc thi Trạm OSCE dưới dạng Trắc Nghiệm và tự Luận
              </p>

                <div className="intro__visual__inner">
                  <div className="visual-car-input " >
                    Nhập Mã Trạm Thi Tại Đây
                  </div>

                  <div className="visual-card">
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

            </div>

            <div className='intro__images' >    
                
                  <div className="box box1" > 
                      <img src="https://hips.hearstapps.com/hmg-prod/images/2026-ferrari-f80-176-686e843d2569f.jpg?crop=0.636xw:0.536xh;0.165xw,0.325xh&resize=700:*" alt="img1" /> 
                  </div>
                  <div className="box box2" > 
                      <img src="https://hips.hearstapps.com/hmg-prod/images/2025-chevrolet-corvette-zr-1-2021-68309392a5327.jpg?crop=0.595xw:0.501xh;0.210xw,0.321xh&resize=700:*" alt="img2" />
                  </div>
                  <div className="box box3" > 
                      <img src="https://hips.hearstapps.com/hmg-prod/images/2024-mclaren-750s-120-66cdd39ae5413.jpg?crop=0.522xw:0.442xh;0.442xw,0.272xh&resize=700:*" alt="img3" />
                  </div>
            
            </div>

          </div>
      </section>

      {/* Section 2 - Lời kêu gọi hành động (nền xanh teal gradient) */}
      <section className="section section--cta">
        <div className=" cta">
          <h2 className="cta__title">
            Sẵn sàng luyện tập và theo dõi tiến trình học tập
          </h2>
          <p className="cta__subtitle">
            Truy cập các trạm luyện tập OSCE mọi lúc, mọi nơi — và theo dõi sự tiến bộ của bạn theo thời gian.
          </p>

        
          <div className="cta_cards_area">
            <Link to="/library" className='link' >
              <div className='cta_card' >
                <img src="https://www.healthskillstraining.com/wp-content/uploads/2020/05/Classroom-pix-1.jpg" 
                     alt="CTA Card Image 1" 
                />
                <div className='overlay'>
                  <h3> Vào Luyện Tập  </h3>
                  <Microscope className="icon" />
                </div>
              </div>

            </Link>

            <Link to="/history" >

              <div className='cta_card' >
                <img src="https://library.mednet.iu.edu/_images/banners/hom-tablet.webp" 
                     alt="CTA Card Image 1" 
                />
                <div className='overlay'>
                  <h3> Thư Viện  </h3>
                  <Microscope className="icon" />
                </div>
              </div>

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
