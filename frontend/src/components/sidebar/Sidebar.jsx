import './sidebar.scss'
import { Link } from "react-router-dom";
import { BookCopy , Building  } from 'lucide-react';


const Sidebar = ({ active, onSelect }) => {
  
  // 1️⃣ Define all menu items here
  const menuItems = [
    { key: 'station', label: 'Danh sách trạm thi', icon: <BookCopy className="sidebarIcon" /> },
    { key: 'roomStation', label: 'Danh sách phòng', icon: <Building className="sidebarIcon" /> },
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