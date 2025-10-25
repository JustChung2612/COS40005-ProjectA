import { Link } from "react-router-dom";
import {
  Search,
  Stethoscope,
  ClipboardCheck,
  BarChart3,
  Award,
  CheckCircle2,
  TrendingUp,
  Microscope,
  LibraryBig 
} from "lucide-react";
import "./HomePage.scss";
import ExamRoomCard from "../../components/examRoomCard/ExamRoomCard";

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
                
                  <div className='intro-search-con' >
                    <div className="intro-search">
                      <Search className='icon' />
                      <input type="text" id="intro-search-input" 
                            placeholder="Nhập mã phòng trạm tại đây..." 
                      />
                    </div>
                    <button className=' btn-section btn-vaoTram ' >
                      Vào Trạm 
                    </button>
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
                      <img src='./homepage/rotate1.png' alt="img1" /> 
                  </div>
                  <div className="box box2" > 
                      <img src="./homepage/rotate2.png" alt="img2" />
                  </div>
                  <div className="box box3" > 
                      <img src='./homepage/rotate1.png' alt="img3" />
                  </div>
            
            </div>

          </div>
      </section>

      {/* Section 2 - Hiện các phòng đang thi */}
      <section className="section--examRoom">
        <h2>Danh Sách Các Phòng Đang Thi</h2>

        <div className="examRoom-container">
          {/* Demo room cards — replace with your real data/map() later */}
          <ExamRoomCard
            roomLabel="Phòng 302 · RM-302"
            status="Chuẩn bị"
            title="OSCE Nội tổng hợp – Ca 2"
            timeRange="14:00–15:30"
          />
          <ExamRoomCard
            roomLabel="Phòng 205 · RM-205"
            status="Đang thi"
            title="OSCE Ngoại khoa – Ca 1"
            timeRange="13:00–14:30"
          />
          <ExamRoomCard
            roomLabel="Phòng 118 · RM-118"
            status="Sắp mở"
            title="OSCE Nhi khoa – Ca 3"
            timeRange="16:00–17:30"
          />
                    
        </div>

        <button className='  btn-section btn-findRoom' >
          Tìm Phòng Thi
        </button>
        
      </section>

      {/* Section 3 - Hiện mục Luyện Tập - Thư Viện */}
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
                  <LibraryBig className="icon" />
                </div>
              </div>

            </Link>
          </div>
        </div>
      </section>

  
    </div>
  );
};

export default HomePage;
