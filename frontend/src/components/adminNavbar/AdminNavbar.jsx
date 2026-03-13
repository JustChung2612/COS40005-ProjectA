// components/adminNavbar/AdminNavbar.jsx
import './adminNavbar.scss'
import { Search, NotebookPen, CheckCircle2 } from 'lucide-react';
import { useUserStore } from '../../stores/useUserStore';

const AdminNavbar = ({
  selectionMode = false,
  selectedCount = 0,
  onCompleteSelection = () => {},
  onStartRoom = () => {},  // ✅ UPDATED: add onStartRoom for the Create Room popup
}) => {
  const { user, logout } = useUserStore();

  return (
    <>
      <div className='adminNavbar'>
        <div className="adNavWrapper">
          <div></div>
          <div className="adNavItems" >
            {!selectionMode ? (
              <button className="adNavItem notUser" 
                onClick={onStartRoom}  // ✅ UPDATED
              >
                <NotebookPen/>
                Tạo Phòng
              </button>
            ) : (
              <button className="adNavItem notUser" onClick={onCompleteSelection} title="Hoàn Thành chọn trạm">
                <CheckCircle2/>
                Hoàn Thành ({selectedCount})
              </button>
            )}

            <div className="adNavItem ">
              <div className="user" >
                <img src="https://img.freepik.com/premium-photo/3d-cartoon-avatar-man-minimal-3d-character-avatar-profile_652053-2067.jpg" 
                    alt="Admin Avatar" />
                <span>{user.username}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default AdminNavbar
