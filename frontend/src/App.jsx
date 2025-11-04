import { Routes, Route, useLocation  } from 'react-router-dom';
import './App.css'
import Header from './components/header/Header.jsx'
import Footer from './components/footer/Footer.jsx';
import HomePage from './pages/homePage/HomePage';
import OSCESPage from './pages/OsceStationPage/OsceStationPage.jsx';
import LoginPage from './pages/loginPage/LoginPage.jsx';
import SignupPage from './pages/signUpPage/SignUpPage.jsx';
import AdminPage from './pages/adminPage/AdminPage.jsx';
import Library from './pages/libraryPage/Library.jsx';
import OscePrepRoomPage from './pages/OscePrepRoomPage/OscePrepRoomPage.jsx';

const App = () => {
 
  return (
    <>

      <div className="gradient-wrapper">
        <div className="gradient-inner">
          <div className="gradient-bg"></div>
        </div>
      </div>

      <div>
        <Header />
        
        <Routes>
            <Route path='/' element = {<HomePage/>} />
            <Route path='/dang-nhap' element = {<LoginPage/>}/>
            <Route path='/dang-ky' element = {<SignupPage/>} />
            <Route path='/osce/phong-chuan-bi' element={ <OscePrepRoomPage/> } />
            <Route path='/osce/tram/:tramId' element = {<OSCESPage/>} />
            <Route path='/quan-tri' element = {<AdminPage/>} />
            <Route path='/thu-vien' element = {<Library/>} />

          
        </Routes>
        <Footer/>
      </div>
    </>
  )
}

export default App