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
  const user = '';
  return (
    <>

      <div className="gradient-wrapper">
        <div className="gradient-inner">
          <div className="gradient-bg"></div>
        </div>
      </div>

      <div>
        { user == 'student' ? (<Header/> ) : <></> 
        }
        
        <Routes>
            <Route path='/' element={<HomePage/>} />
            <Route path='/login' element = {<LoginPage/>}/>
            <Route path='/signup' element = {<SignupPage/>} />
            <Route path='/tramthiOSCE/:id' element = {<OSCESPage/>} />
            <Route path='/loading' element = {<LoadingPage/>} />
            <Route path='/admin' element={<AdminPage/>} />
        </Routes>
        <Footer/>
      </div>
    </>
  )
}

export default App