import React from 'react'

const editRoom = () => {
  return (
    <div className="editRoomContainer">
      <h2>Thông tin phòng thi</h2>

      <div className="editRoomForm">
        <label>Tên phòng</label>
        <input
          name="exam_room_name"
          value={form.exam_room_name}
          onChange={handleChange}
        />

        <label>Mã phòng</label>
        <input
          name="exam_room_code"
          value={form.exam_room_code}
          onChange={handleChange}
        />

        <label>Chuyên ngành</label>
        <input
          name="terminology"
          value={form.terminology}
          onChange={handleChange}
        />

        <label>Thời gian bắt đầu</label>
        <input
          type="datetime-local"
          name="startAt"
          value={form.startAt}
          onChange={handleChange}
        />

        <label>Thời gian kết thúc</label>
        <input
          type="datetime-local"
          name="endAt"
          value={form.endAt}
          onChange={handleChange}
        />

        <button className="save-btn" onClick={handleSave}>
          💾 Lưu thay đổi
        </button>
      </div>
    </div>
  )
}

export default editRoom