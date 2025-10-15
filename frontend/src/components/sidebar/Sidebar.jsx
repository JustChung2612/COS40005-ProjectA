import './sidebar.scss'
import { Link } from "react-router-dom";
import { BookCopy } from 'lucide-react';


const Sidebar = () => {
  return (
    <>
      <div className="sidebar">

        <div className="top">
          <Link to="/" style={{ textDecoration: "none" }}>
            <span className="logo">Logo</span>
          </Link>
        </div>
        <hr />

        <div className="center">
          <ul>
            <li>
              <BookCopy className='sidebarIcon' />
              <span>Danh sách đề thi</span>
            </li>
          </ul>
        </div>
        
        <div className="bottom">

        </div>

      </div>
    </>
  )
}

export default Sidebar