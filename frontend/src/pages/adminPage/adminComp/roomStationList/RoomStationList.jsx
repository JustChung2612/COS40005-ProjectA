// pages/adminPage/adminComp/roomStationList/RoomStationList.jsx
import React, { useMemo, useState } from 'react'
import OSCESPage from '../../../OsceStationPage/OsceStationPage.jsx'
import { stationById } from '../../../../data/stationsData.js'
import './roomstationlist.scss'

const RoomStationlist = ({ rooms = [] }) => {
  if (!rooms.length) {
    return <div>Chưa có phòng nào. Hãy nhấn “Tạo Phòng” và chọn trạm.</div>
  }

  // Lấy phòng đầu tiên (đơn giản)
  const room = rooms[0]
  const stationObjs = useMemo(
    () => room.stationIds.map(id => stationById[id]).filter(Boolean),
    [room.stationIds]
  )

  // viewMode: 'grid' (hiển thị card) | 'detail' (hiển thị duy nhất OSCESPage)
  const [viewMode, setViewMode] = useState('grid')
  const [idx, setIdx] = useState(null)

  const openStation = (i) => {
    setIdx(i)
    setViewMode('detail')
  }

  const handleBackToGrid = () => {
    setViewMode('grid')
    setIdx(null)
  }

  const handleNext = () => {
    if (idx === null) return
    setIdx(prev => (prev < stationObjs.length - 1 ? prev + 1 : prev))
  }

  if (!stationObjs.length) {
    return <div>Phòng này chưa có trạm hợp lệ.</div>
  }

  // ====== DETAIL MODE: chỉ hiển thị OSCESPage + nút quay lại ======
  if (viewMode === 'detail' && idx !== null) {
    return (
      <div className="roomDetailOnly">
        <button className="backBtn" type="button" onClick={handleBackToGrid}>
          ← Quay lại Danh Sách Phòng
        </button>

        <OSCESPage
          overrideStations={stationObjs}
          currentIndex={idx}
          onNext={handleNext}
        />
      </div>
    )
  }

  // ====== GRID MODE: hiển thị danh sách card ======
  return (
    <div className="roomList">
      <h3>Danh Sách Phòng</h3>
      <p>
        Phòng: <strong>{room.id}</strong> • Tổng trạm: <strong>{stationObjs.length}</strong>
      </p>

      <div className="roomGrid">
        {stationObjs.map((s, i) => (
          <div
            key={s.tram_thi_ID}
            className="roomCard"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' ? openStation(i) : null)}
          >
            <div className="roomCardHeader">
              <span className="roomBadge">{s.metadata?.do_kho || '—'}</span>
            </div>
            <h4 className="roomTitle">{s.metadata?.chuan_doan || '—'}</h4>
            <div className="roomMeta">
              <div>🫁 Cơ quan: <strong>{s.metadata?.co_quan || '—'}</strong></div>
              <div>👤 Đối tượng: <strong>{s.metadata?.doi_tuong || '—'}</strong></div>
            </div>
            <button
              className="roomOpenBtn"
              type="button"
              onClick={() => openStation(i)}
            >
              Xem trạm
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RoomStationlist
