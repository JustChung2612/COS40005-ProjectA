// ✅ CreateRoomPopup.jsx — Phase 1: Popup UI + Drag-Drop logic
import React, { useState } from "react";
import "./createRoomPopup.scss";

const CreateRoomPopup = ({
  isOpen,
  onClose,
  onCancelRoom,
  onFinishRoom,
  onAddPatientToStation
}) => {
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [stations, setStations] = useState([{ name: "Trạm 1", patients: [] }]);

  // ---- 🧩 Handle drop from StationCard ----
  const handleDrop = (e) => {
    e.preventDefault();
    const json = e.dataTransfer.getData("application/json");
    if (!json) return;

    const patient = JSON.parse(json);
    const id = patient._id; // ✅ unified: only _id now

    setStations((prev) => {
      const updated = prev.map((s, i) => {
        if (i !== currentStationIndex) return s;
        const alreadyExists = s.patients.some(
          (p) => String(p._id) === String(id)
        );
        if (alreadyExists) return s;

        // ✅ Always return a fresh copy
        return {
          ...s,
          patients: [...s.patients, patient],
        };
      });
      return updated;
    });

    onAddPatientToStation?.(patient, currentStationIndex);
  };


  const handleDragOver = (e) => e.preventDefault();

  // ---- 🧩 Navigation buttons ----
  const handleNextStation = () => {
    setStations((prev) => [
      ...prev,
      { name: `Trạm ${prev.length + 1}`, patients: [] },
    ]);
    setCurrentStationIndex((prev) => prev + 1);
  };

  const handleFinish = () => {
    onFinishRoom?.(stations);
  };

  if (!isOpen) return null; // hidden when closed

  return (
    <div className="createRoomPopup__overlay">
      <div className="createRoomPopup">
        {/* ---- HEADER ---- */}
        <div className="createRoomPopup__header">
          <h2>Đang tạo {stations[currentStationIndex].name}</h2>
          <div className="createRoomPopup__controls">
            <button className="icon-btn" onClick={onClose}>❌</button>
            <button className="cancel-btn" onClick={onCancelRoom}>Hủy tạo phòng</button>
          </div>
        </div>

        {/* ---- DROP ZONE ---- */}
        <div
          className="createRoomPopup__dropzone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <p>Kéo thả bệnh án (StationCard) vào đây 👇</p>
          <div className="added-patients">
            {stations[currentStationIndex].patients.map((p, i) => (
              <div key={i} className="added-patient">
                <strong>{p.metadata?.chuan_doan}</strong>
                <span> – {p.metadata?.co_quan}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ---- FOOTER ---- */}
        <div className="createRoomPopup__footer">
          <button className="finish-btn" onClick={handleFinish}>
            Hoàn thành phòng
          </button>
          <button className="next-btn" onClick={handleNextStation}>
            Tạo trạm tiếp theo ➕
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoomPopup;
