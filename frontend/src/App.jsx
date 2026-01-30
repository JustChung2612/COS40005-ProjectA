import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from "react";
import { useUserStore } from './stores/useUserStore.js';
import { Toaster } from 'react-hot-toast';
import './App.css'
import Header from './components/header/Header.jsx'
import Footer from './components/footer/Footer.jsx';
import HomePage from './pages/homePage/HomePage';
import OSCESPage from './pages/OsceStationPage/OsceStationPage.jsx';
import LoginPage from './pages/loginPage/LoginPage.jsx';
import SignupPage from './pages/signUpPage/SignUpPage.jsx';
import AdminPage from './pages/adminPage/AdminPage.jsx';
import EditExamRoom from './pages/adminPage/adminTab/editExamRoom/EditExamRoom.jsx';
import PatientCaseDetailPage from './pages/patientCaseDetailPage/PatientCaseDetailPage.jsx';

// Project B
import StudentDashBoardPage from './pages/studentDashBoardPage/StudentDashBoardPage.jsx';

// Project B - UI only
import InstructorAttempts from './pages/Update/InstructorAttempts/InstructorAttempts.jsx';
import InstructorExams from './pages/Update/InstructorExams/InstructorExams.jsx';
import OSCETestCompletionPage from './pages/resultPage/OSCETestCompletionPage.jsx';


const studentInfo = {
  name: "Nguyen Van A",
  id: "SV20251234",
  className: "OSCE Prep - Group 3",
};

const sampleStations = [
  { name: "Station 1: Cardiology", type: "mcq", score: 87 },
  { name: "Station 2: Neurology", type: "mcq", score: 92 },
  { name: "Station 3: Pediatrics", type: "free-text" },
  { name: "Station 4: Surgery", type: "mcq", score: 75 },
];


const App = () => {

  const { user, checkAuth, checkingAuth } = useUserStore();
  const location = useLocation();

  const hideHeaderRoutes = [
    "/quan-tri",
    "/quan-tri/sua-phong/",  
    "/osce/tram/",
    "/benh-an/"            
  ];
  const hideHeader = hideHeaderRoutes.some((route) =>
    location.pathname === route || location.pathname.startsWith(route)
  );

  const hideFooterRoutes = [
    "/osce/tram/"
  ];
  const hideFooter = hideFooterRoutes.some((route) => 
    location.pathname === route || location.pathname.startsWith(route)
  );


  useEffect(() => {
		checkAuth();
	}, [checkAuth]);


  if (checkingAuth) return <div className="route-loading">Đang kiểm tra phiên đăng nhập…</div>

  return (
    <>
      <div className="gradient-wrapper">
        <div className="gradient-inner">
          <div className="gradient-bg"></div>
        </div>
      </div>

      <div>
        <Toaster />
        {!hideHeader && <Header />}
        
        <Routes>
            <Route path='/' element = {<HomePage/>} />
            <Route path='/dang-nhap' element = { !user ? <LoginPage/> : <Navigate to='/' /> }/>
            <Route path='/dang-ky' element = { !user ? <SignupPage/> : <Navigate to='/' /> } />
            <Route path='/osce/tram/:tramId' element = {<OSCESPage/>} />
            <Route 
              path='/quan-tri' 
              element = {user?.role === "admin" ? <AdminPage/> : <Navigate to="/dang-nhap" /> } 
            />
            <Route path="/quan-tri/sua-phong/:id" element={<EditExamRoom />} />
            <Route path="/benh-an/:id" element={<PatientCaseDetailPage />} />

            {/* Project B */}
            <Route 
              path='/sinh-vien' 
              element={user?.role === "user" ? <StudentDashBoardPage/> : <Navigate to="/dang-nhap" /> }
            />

            {/* Project B - UI only */}
            <Route path="/exams" element={<InstructorExams />} />
            <Route path="/exams/:examId/attempts" element={<InstructorAttempts />} />
            <Route path='/test-result' element={<OSCETestCompletionPage  student={studentInfo} stations={sampleStations} />} />
            
          
        </Routes>
        { !hideFooter && <Footer/>}
      </div>
    </>
  )
}

export default App