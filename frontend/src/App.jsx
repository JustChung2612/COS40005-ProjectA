import { Routes, Route, Link } from 'react-router-dom';
import './App.css'
import Header from './components/header/Header.jsx'
import Footer from './components/footer/Footer.jsx';
import HomePage from './pages/homePage/HomePage';
import OSCESPage from './pages/OSCESPage/OSCESPage.jsx';
import LoadingPage from './pages/loadingPage/LoadingPage.jsx';
import LoginPage from './pages/loginPage/LoginPage.jsx';
import SignupPage from './pages/signUpPage/SignUpPage.jsx';
import AdminPage from './pages/adminPage/AdminPage.jsx';

const App = () => {
  const user = 'teacher';
  return (
    <>

      <div class="gradient-wrapper">
        <div class="gradient-inner">
          <div class="gradient-bg"></div>
        </div>
      </div>

      <div>
        { user == 'student' ? (<Header/> ) : <></> 
        }
        
        <Routes>
            <Route path='/' element={<HomePage/>} />
            <Route path='/login' element = {<LoginPage/>}/>
            <Route path='/signup' element = {<SignupPage/>} />
            <Route path='/osce' element = {<OSCESPage/>} />
            <Route path='/loading' element = {<LoadingPage/>} />
            <Route path='/admin' element={<AdminPage/>} />
        </Routes>
        <Footer/>
      </div>
    </>
  )
}

export default App