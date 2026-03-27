// Sidebar.jsx
import './sidebar.scss'
import { Link } from "react-router-dom";
import { BookCopy , Boxes , SquarePen , UserPlus, X } from 'lucide-react';


const Sidebar = ({ active, onSelect, isOpen = false, onClose = () => {} }) => {
  
  // 1️⃣ Define all menu items here
  const menuItems = [
    { key: 'patientCase', label: 'Danh sách bệnh án', icon: <BookCopy className="sidebarIcon" /> },
    { key: 'examRoom', label: 'Danh sách phòng thi', icon: <Boxes className="sidebarIcon" /> },
    { key: 'studentLists', label: 'Danh sách học sinh', icon: <UserPlus className="sidebarIcon" /> },
    { key: 'examRoom_Taking_Place', label: 'Phòng đang thi', icon: <SquarePen className="sidebarIcon" /> },

  ];


  // 2️⃣ Function: handle click
  const handleSelect = (key) => {
     onSelect(key)
     // Close the drawer after navigating on narrow screens.
     onClose()
  }

  // 3️⃣ Function: determine class
  const getItemClass = (key) => (active === key ? 'chosen' : '');

  return (
    <>
      {/* click outside the drawer to close it. */}
      <div
        className={`sidebarOverlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      <div className={`sidebar ${isOpen ? 'active' : ''}`}>

        <div className="top">
          <div className='logo'> 
            <Link to="/" style={{ textDecoration: "none" }}>
              <img src="./homepage/logo.png" alt="" />
            </Link>
          </div>
          {/* Visible on mobile only. Desktop keeps the sidebar always open. */}
          <button
            type="button"
            className="sidebarClose"
            onClick={onClose}
            aria-label="Đóng sidebar"
          >
            <X />
          </button>
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
