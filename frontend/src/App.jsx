import { Routes, Route, Link } from 'react-router-dom';
import Header from './components/header/Header.jsx'
import HomePage from './pages/homePage/HomePage';

const App = () => {
  return (
    <>
      <div>
        <Header/>
        <Routes>
            <Route path='/' element={<HomePage/>} />
        </Routes>
      </div>
    </>
  )
}

export default App