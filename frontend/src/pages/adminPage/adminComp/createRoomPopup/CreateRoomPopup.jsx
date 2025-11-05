
import "./createRoomPopup.scss";
import { useState } from "react";
import { X, ArrowBigLeft, ArrowBigRight } from 'lucide-react';

const CreateRoomPopup = ({
  isOpen,
  onClose,
  onCancelRoom,
  onFinishRoom,
  onAddPatientToStation
}) => {
  // ---------------------- STATE ----------------------
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [stations, setStations] = useState([{ name: "Trạm 1", patients: [] }]);

  // ---------------------- 🧩 DROP HANDLER ----------------------
  const handleDrop = (e) => {
    e.preventDefault();
    const json = e.dataTransfer.getData("application/json");
    if (!json) return;
    const patient = JSON.parse(json);
    const id = patient._id; // ✅ unified: only _id now

    setStations((prev) =>
      prev.map((s, i) => {
        if (i !== currentStationIndex) return s;
        const alreadyExists = s.patients.some((p) => String(p._id) === String(id));
        if (alreadyExists) return s;
        return { ...s, patients: [...s.patients, patient] };
      })
    );

    onAddPatientToStation?.(patient, currentStationIndex);
  };
  const handleDragOver = (e) => e.preventDefault();

  // ---------------------- ⚙️ NEW: PAGINATION ----------------------
  const handleGoToStation = (index) => {
    if (index >= 0 && index < stations.length) {
      setCurrentStationIndex(index);
    }
  };

  // ---------------------- ✅ BUTTON LOGIC ----------------------
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

  // ✅ REPLACE WITH THIS ↓↓↓
  const handleCancelRoom = () => {
    // 🧹 Reset all station data when cancel
    setStations([{ name: "Trạm 1", patients: [] }]);
    setCurrentStationIndex(0);
    onCancelRoom?.(); // will close popup from parent
  };

  if (!isOpen) return null;

  return (
    <div className="createRoomPopup__overlay">
      <div className="createRoomPopup">
        {/* =========================================================
           🆕 HEADER SECTION 
        ========================================================= */}
        <div className="createRoomPopup-header-container">
                      <button className="toggle-btn"  onClick={onClose} title="Đóng tạm thời" >
                <X />
            </button>   
          <div className="createRoomPopup-header-main" >       

            <h2 >Đang tạo {stations[currentStationIndex].name}</h2>

            <div className="createRoomPopup__controls">
              <button className="cancel-btn" onClick={handleCancelRoom}>
                🗑️ Hủy tạo phòng
              </button>
            </div>
          </div>

         
        </div>

        {/* =========================================================
           🧩 DROPZONE SECTION
        ========================================================= */}
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


        <div className="pagination-section">
          <button
            className="left-pagin"
            onClick={() => handleGoToStation(currentStationIndex - 1)}
            disabled={currentStationIndex === 0}
            title="Trạm trước đó"
          >
            <ArrowBigLeft className="pagin-arrow" />
          </button>

          <h3 className="current-station">
            Đang ở trạm {currentStationIndex + 1} / Tổng {stations.length}
          </h3>

          <button
            className="right-pagin"
            onClick={() => handleGoToStation(currentStationIndex + 1)}
            disabled={currentStationIndex === stations.length - 1}
            title="Trạm kế tiếp"
          >
            <ArrowBigRight className="pagin-arrow" />
          </button>
        </div>


        {/* =========================================================
           🦶 FOOTER SECTION
        ========================================================= */}
        <div className="createRoomPopup__footer">
          <button className="finish-btn" onClick={handleFinish}>
            ✅ Hoàn thành phòng
          </button>
          <button className="next-btn" onClick={handleNextStation}>
            ➕ Tạo trạm tiếp theo
          </button>
        </div>
      </div>

    </div>
  );
};

export default CreateRoomPopup;
