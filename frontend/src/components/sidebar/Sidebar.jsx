import './sidebar.scss'
import { Link } from "react-router-dom";
import { BookCopy , Boxes , SquarePen  } from 'lucide-react';


const Sidebar = ({ active, onSelect }) => {
  
  // 1️⃣ Define all menu items here
  const menuItems = [
    { key: 'patientCase', label: 'Danh sách bệnh án', icon: <BookCopy className="sidebarIcon" /> },
    { key: 'examRoom', label: 'Danh sách phòng thi', icon: <Boxes className="sidebarIcon" /> },
    { key: 'editExamRoom', label: 'Chỉnh sửa phòng thi', icon: <SquarePen className="sidebarIcon" /> },
  ];


  // 2️⃣ Function: handle click
  const handleSelect = (key) => {
     onSelect(key)
  }

  // 3️⃣ Function: determine class
  const getItemClass = (key) => (active === key ? 'chosen' : '');

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
            {menuItems?.map((item) => (
              
                <li
                  key={item.key}
                  className={getItemClass(item.key)}
                  onClick={() => handleSelect(item.key) }
                >
                  {item.icon}
                  <span>{item.label}</span>

                </li>
            
            ))}
          </ul>
        </div>
        
        <div className="bottom">

        </div>

      </div>
    </>
  )
}

export default Sidebar