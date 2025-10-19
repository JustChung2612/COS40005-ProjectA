import './adminPage.scss';
import {useState} from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import AdminNavbar from '../../components/adminNavbar/AdminNavbar';
import StationList from './adminComp/stationList/StationList.jsx';
import RoomStationlist from './adminComp/roomStationList/roomStationlist.jsx';


const AdminPage = () => {
  const [ activeSection , setActiveSection ] = useState('station');

  const sectionComponents = {
    station: <StationList/>,
    roomStation: <RoomStationlist/>
  }

  return (
    <>
        <div className="AdminPageHome" >
            <Sidebar active={activeSection} onSelect ={setActiveSection} />
            <div className="homeContainer">

              {/* ///// Admin Bar Secton ///// */}
              <AdminNavbar/>

              {/* ///// Routing Section ///// */}

              {sectionComponents[activeSection] || <StationList />}
              

            </div>

        </div>
    </>
  )
}

export default AdminPage