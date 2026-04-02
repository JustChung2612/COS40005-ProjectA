import './adminNavbar.scss'
import { Search, NotebookPen, CheckCircle2, Menu } from 'lucide-react';
import { useUserStore } from '../../stores/useUserStore';

const AdminNavbar = ({
  selectionMode = false,
  selectedCount = 0,
  onCompleteSelection = () => {},
  onStartRoom = () => {},
  onToggleSidebar = () => {},
  isSidebarOpen = false,
}) => {
  const { user } = useUserStore();

  return (
    <>
      <div className='adminNavbar'>
        <div className="adNavWrapper">
          {/* Mobile trigger for the admin sidebar drawer. */}
          <button
            type="button"
            className="sidebarToggle"
            onClick={onToggleSidebar}
            aria-label="Open admin sidebar"
            aria-expanded={isSidebarOpen}
          >
            <Menu />
          </button>

          <div className="adNavSearch">

          </div>

          <div className="adNavItems" >
            {!selectionMode ? (
              <button className="adNavItem notUser" onClick={onStartRoom}>
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
                <img
                  src="https://img.freepik.com/premium-photo/3d-cartoon-avatar-man-minimal-3d-character-avatar-profile_652053-2067.jpg"
                  alt="Admin Avatar"
                />
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
