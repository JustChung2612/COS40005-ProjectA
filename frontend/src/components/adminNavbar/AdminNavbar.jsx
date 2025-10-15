import './adminNavbar.scss'
import { Search, NotebookPen } from 'lucide-react';


const AdminNavbar = () => {
  return (
    <>
      <div className='adminNavbar'>
        <div className="adNavWrapper">
            <div className="adNavSearch">
              <Search className='icon' />
              <input type="text" id="SearchInput" placeholder="Tìm đề thi dễ hơn với AI..." />
            </div>

            <div className="adNavItems" >
              
              <div className="adNavItem notUser ">
                  <NotebookPen/>
                  Tạo Phòng Thi
              </div>

              <div className="adNavItem ">
                  <div className="user" >
                       <img src="https://img.freepik.com/premium-photo/3d-cartoon-avatar-man-minimal-3d-character-avatar-profile_652053-2067.jpg" 
                       alt="Admin Avatar" 
                  />
                  <span>Duc Chung</span>

                  </div>
              </div>
            </div>
          
        </div>
      </div>
    </>
  )
}

export default AdminNavbar