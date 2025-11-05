import './adminPage.scss';
import { useState, useMemo } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import AdminNavbar from '../../components/adminNavbar/AdminNavbar';
import StationList from './adminComp/stationList/StationList.jsx';
import RoomStationlist from './adminComp/roomStationList/RoomStationList.jsx';
import CreateRoomPopup from './adminComp/createRoomPopup/CreateRoomPopup.jsx';

const AdminPage = () => {
  const [activeSection , setActiveSection ] = useState('station');

  // ---- selection state for creating a room
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // ---- rooms (simple: one room for now)
  const [rooms, setRooms] = useState([]); // each room: { id, stationIds: string[] }

  //🆕 UPDATE -- Handle PopUp Open section
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const handleStartRoom = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);
  const handleCancelRoom = () => {
    console.log("🗑️ Room creation cancelled");
    setIsPopupOpen(false);
    setSelectionMode(false);
    setSelectedIds([]);
    setRooms([]); // remove temporary room data
  };
  const handleFinishRoom = (stations) => {
    console.log("✅ ROOM CREATED:", stations);
    setIsPopupOpen(false);
    setRooms([{ id: `room_${Date.now()}`, stationIds: stations.map((s) => s.name) }]);
    setActiveSection("roomStation");
    // TODO: send stations to backend / move to RoomStationList
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleStartSelection = () => {
    setActiveSection('station');
    setSelectionMode(true);
    setSelectedIds([]);
  };

  const handleCompleteSelection = () => {
    if (selectedIds.length === 0) return;

    const newRoom = {
      id: `room_${Date.now()}`,
      stationIds: selectedIds,
    };
    setRooms([newRoom]);     // simple single-room example
    setSelectionMode(false);
    setSelectedIds([]);
    setActiveSection('roomStation'); // go to room list after done
  };

  const sectionComponents = useMemo(() => ({
    station: (
      <StationList
        selectionMode={selectionMode}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
      />
    ),
    roomStation: (
      <RoomStationlist
        rooms={rooms}
      />
    )
  }), [selectionMode, selectedIds, rooms]);

  return (
    <>
      <div className="AdminPageHome" >
        <Sidebar active={activeSection} onSelect={setActiveSection} />

        {/* ✅ UPDATED: add popup-open class when popup is open */}
        <div className={`homeContainer ${isPopupOpen ? "popup-open" : ""}`}>

          <AdminNavbar
            selectionMode={selectionMode}
            selectedCount={selectedIds.length}
            onStartSelection={handleStartSelection}
            onCompleteSelection={handleCompleteSelection}
            //🆕 UPDATE -- Modify AdminNavbar trigger button
            onStartRoom={handleStartRoom} // 
          />

          {sectionComponents[activeSection] || sectionComponents.station}
        </div>
      </div>

      {/* 🆕 UPDATED: render the CreateRoomPopup overlay */}
      <CreateRoomPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}   // 👁️ toggle close (temporary)
        onCancelRoom={handleCancelRoom}         // 🗑️ full cancel + reset
        onFinishRoom={handleFinishRoom}
        onAddPatientToStation={(patient, index) => {
          console.log(`➕ Added patient to station ${index + 1}`, patient);
        }}
      />
    </>
  )
}

export default AdminPage
