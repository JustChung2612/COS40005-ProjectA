// pages/adminPage/AdminPage.jsx
import './adminPage.scss';
import { useState, useMemo } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import AdminNavbar from '../../components/adminNavbar/AdminNavbar';
import StationList from './adminComp/stationList/StationList.jsx';
import RoomStationlist from './adminComp/roomStationList/RoomStationList.jsx';
import { stations } from '../../data/stationsData.js';

const AdminPage = () => {
  const [activeSection , setActiveSection ] = useState('station');

  // ---- selection state for creating a room
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // ---- rooms (simple: one room for now)
  const [rooms, setRooms] = useState([]); // each room: { id, stationIds: string[] }

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
        <div className="homeContainer">

          <AdminNavbar
            selectionMode={selectionMode}
            selectedCount={selectedIds.length}
            onStartSelection={handleStartSelection}
            onCompleteSelection={handleCompleteSelection}
          />

          {sectionComponents[activeSection] || sectionComponents.station}
        </div>
      </div>
    </>
  )
}

export default AdminPage
