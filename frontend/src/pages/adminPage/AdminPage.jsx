import {useState} from 'react';
import './adminPage.scss';
import Sidebar from '../../components/sidebar/Sidebar';
import AdminNavbar from '../../components/adminNavbar/AdminNavbar';
import ExamCard from "../../components/examCard/ExamCard";
import benhAnData1 from "../../data/benhAn2.js";
import benhAnData2 from "../../data/benhAn2.js";

const AdminPage = () => {

  const [examCases] = useState([ benhAnData1 , benhAnData1 , benhAnData1 , benhAnData1 ]);

  // -------------------- Filter State
  const [filters, setFilters] = useState({
    mon_thi: '',
    co_quan: '',
    trieu_chung: '',
    do_kho: '',
    doi_tuong: '',
    loai_benh: '',
    do_tuoi: [18, 60],
  });

  // -------------------- FILTER OPTIONS 
  const subjectOptions = ['Nội tim mạch – Suy tim', 'Ngoại tiêu hóa', 'Thần kinh', 'Nhi khoa'];
  const organOptions = ['Tim mạch', 'Hô hấp', 'Thận – tiết niệu', 'Tiêu hóa', 'Thần kinh'];
  const symptomOptions = ['Khó thở', 'Ho ra máu', 'Lơ mơ', 'Đau ngực', 'Sốt'];
  const difficultyOptions = ['Cơ bản', 'Trung bình', 'Nâng cao'];
  const targetGroupOptions = ['Người lớn', 'Người già', 'Trẻ em', 'Thai phụ'];
  const diseaseTypeOptions = ['Cấp tính', 'Mạn tính', 'Tái phát'];


  // -------------------- HANDLERS --------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleRangeChange = (e, index) => {
    const newRange = [...filters.do_tuoi];
    newRange[index] = Number(e.target.value);
    setFilters({ ...filters, do_tuoi: newRange });
  };

  const handleApplyFilter = () => {
    console.log('Applied filters:', filters);
    // TODO: Fetch filtered exams from backend later
  };

  return (
    <>
        <div className="AdminPageHome" >
            <Sidebar/>
            <div className="homeContainer">
              <AdminNavbar/>
              <div className='examContainer'>
                {/* ---------- FILTER SECTION ---------- */}
                <div className="filterExam">
                  <h3>Bộ lọc đề thi</h3>

                  <div className="filterGroup">
                    {/* --- Môn thi --- */}
                    <div className="filterItem">
                      <label>Môn thi</label>
                      <select name="mon_thi" value={filters.mon_thi} onChange={handleChange}>
                        <option value="">Tất cả</option>
                        {subjectOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    {/* --- Cơ quan --- */}
                    <div className="filterItem">
                      <label>Cơ quan</label>
                      <select name="co_quan" value={filters.co_quan} onChange={handleChange}>
                        <option value="">Tất cả</option>
                        {organOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    {/* --- Triệu chứng --- */}
                    <div className="filterItem">
                      <label>Triệu chứng</label>
                      <select name="trieu_chung" value={filters.trieu_chung} onChange={handleChange}>
                        <option value="">Tất cả</option>
                        {symptomOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    {/* --- Độ khó --- */}
                    <div className="filterItem">
                      <label>Độ khó</label>
                      <select name="do_kho" value={filters.do_kho} onChange={handleChange}>
                        <option value="">Tất cả</option>
                        {difficultyOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    {/* --- Đối tượng --- */}
                    <div className="filterItem">
                      <label>Đối tượng</label>
                      <select name="doi_tuong" value={filters.doi_tuong} onChange={handleChange}>
                        <option value="">Tất cả</option>
                        {targetGroupOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    {/* --- Loại bệnh --- */}
                    <div className="filterItem">
                      <label>Loại bệnh</label>
                      <select name="loai_benh" value={filters.loai_benh} onChange={handleChange}>
                        <option value="">Tất cả</option>
                        {diseaseTypeOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    {/* --- Độ tuổi (Range Slider) --- */}
                    <div className="filterItem rangeItem">
                      <label>
                        Độ tuổi: {filters.do_tuoi[0]} - {filters.do_tuoi[1]}
                      </label>

                      <div className="rangeSlider">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={filters.do_tuoi[0]}
                          onChange={(e) => handleRangeChange(e, 0)}
                          className="thumb thumb--left"
                          style={{ zIndex: filters.do_tuoi[0] > 90 ? '5' : 'auto' }}
                        />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={filters.do_tuoi[1]}
                          onChange={(e) => handleRangeChange(e, 1)}
                          className="thumb thumb--right"
                        />

                        <div className="slider">
                          <div className="slider__track"></div>
                          <div
                            className="slider__range"
                            style={{
                              left: `${filters.do_tuoi[0]}%`,
                              width: `${filters.do_tuoi[1] - filters.do_tuoi[0]}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* --- Apply Button --- */}
                    <button className="applyButton" onClick={handleApplyFilter}>
                      Áp dụng bộ lọc
                    </button>
                  </div>
                </div>

                <div className='examListContainer' >
                   <h3 className='listTitle' >Danh sách đề thi</h3>
                    <div className="examList">
                      {examCases.map((caseData, i) => (
                        <ExamCard
                          key={i}
                          data={caseData}
                          onView={(d) => console.log("View", d)}
                          onEdit={(d) => console.log("Edit", d)}
                          onDelete={(d) => console.log("Delete", d)}
                        />
                      ))}
                    </div>

                </div>

                

              </div>
              

            </div>

        </div>
    </>
  )
}

export default AdminPage