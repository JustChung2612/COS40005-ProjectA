import { Link } from "react-router-dom";
import './header.scss';
import { School, LibraryBig ,UserRoundPen, LogIn, LogOut , UserPlus  } from 'lucide-react';

const Header = () => {

  const currentUser = true ;

  return (
    <div className='header'>
      <div className='wrapper' >
          <div className='logo'> 
            Logo
          </div>

          <div className='items' >
            
            <Link to='' className='osceLink' >  
              <div className='item'>
                <School className="icon" />
                Thi OSCE
              </div>
            </Link>
            
              <Link to='/thuvien' className='libraryLink' > 
                <div className='item'>
                <LibraryBig className="icon" />
                  Thư Viện
                </div>
              </Link>
            
            <div className='item'>
              {currentUser ? (
                <div className="user">
                  <Link to="/quan-tri" className='avatarLink' >
                    <div className='avatar' >             
                      <img
                        src={ './noAvatar.jpg' }
                        alt=""
                      />
                      {/* <span>{currentUser.username}</span> */}
                      <span>Duc Chung</span>
                    </div>
                  </Link>

                  
                  <Link to="" className="navButton" >
                      <LogOut className="icon" /> 
                      <span>Đăng Xuất</span>
                  </Link>
                </div>
              ) : (
                <>
                <Link to='/dang-nhap' className="navButton" >
                  
                    <LogIn className="icon"  /> 
                    <span> Đăng Nhập </span>
                  
                </Link>
                <Link to='/dang-ky' className="navButton" >
                  
                    <UserPlus className="icon" /> 
                    <span> Đăng Ký </span>
                  
                </Link>

                </>
              )}
            </div>



          </div>
      </div>      
    </div>
  )
}

export default Header