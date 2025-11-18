import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from "react";
import { Toaster } from 'react-hot-toast';
import './App.css'
import Header from './components/header/Header.jsx'
import Footer from './components/footer/Footer.jsx';
import HomePage from './pages/homePage/HomePage';
import OSCESPage from './pages/OsceStationPage/OsceStationPage.jsx';
import LoginPage from './pages/loginPage/LoginPage.jsx';
import SignupPage from './pages/signUpPage/SignUpPage.jsx';
import AdminPage from './pages/adminPage/AdminPage.jsx';
import OscePrepRoomPage from './pages/OscePrepRoomPage/OscePrepRoomPage.jsx';
import EditExamRoom from './pages/adminPage/adminTab/editExamRoom/EditExamRoom.jsx'
import { useUserStore } from './stores/useUserStore.js';


{/* New File */}

import PatientCaseDetailPage from './pages/patientCaseDetailPage/PatientCaseDetailPage.jsx';
import Library from './pages/libraryPage/Library.jsx';


const App = () => {

  const { user, checkAuth, checkingAuth } = useUserStore();
  const location = useLocation();
  const hideHeader = location.pathname === '/quan-tri' ||
                     location.pathname.startsWith('/osce/tram/'); ;

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
            <Route path='/osce/phong-chuan-bi' element={ <OscePrepRoomPage/> } />
            <Route path='/osce/tram/:tramId' element = {<OSCESPage/>} />
            <Route 
              path='/quan-tri' 
              element = {user?.role === "admin" ? <AdminPage/> : <Navigate to="/dang-nhap" /> } 
            />
            <Route path="/quan-tri/sua-phong/:id" element={<EditExamRoom />} />

            <Route path='/thu-vien' element = {user ? <Library/> : <Navigate to="/dang-nhap" /> } />

            {/* New Route */}
            <Route path="/benh-an/:id" element={<PatientCaseDetailPage />} />

            
          
        </Routes>
        <Footer/>
      </div>
    </>
  )
}

export default App