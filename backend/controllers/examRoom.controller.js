// controllers/examRoom.controller.js
import ExamRoom from "../models/examRoom.model.js";
import ExamStation from "../models/examStation.model.js";

/**
 * 🧩 TẠO PHÒNG THI MỚI (POST /api/exam-rooms)
 * Nhận dữ liệu từ frontend (popup) bao gồm:
 * - exam_room_code, exam_room_name, terminology
 * - exam_room_settings
 * - danh sách stations: [{ stationIndex, stationName, patientCaseIds }]
 */
export const createExamRoom = async (req, res) => {
  try {
    const {
      exam_room_code,
      exam_room_name,
      terminology,
      exam_room_settings,
      stations, // danh sách trạm từ frontend
      createdBy,
    } = req.body;

    // 1️⃣ Kiểm tra dữ liệu bắt buộc
    if (!exam_room_code || !exam_room_name || !terminology) {
      return res
        .status(400)
        .json({ message: "Thiếu dữ liệu bắt buộc để tạo phòng thi." });
    }

    // 2️⃣ Tạo ExamRoom trước (trạng thái bản nháp)
    const newRoom = await ExamRoom.create({
      exam_room_code,
      exam_room_name,
      terminology,
      exam_room_settings,
      createdBy,
    });

    // 3️⃣ Nếu có danh sách trạm, tạo từng trạm và liên kết với room
    let createdStations = [];
    if (stations && Array.isArray(stations)) {
      for (const [i, stationData] of stations.entries()) {
        const newStation = await ExamStation.create({
          exam_room_Id: newRoom._id,
          stationIndex: i + 1,
          stationName: stationData.stationName || `Trạm ${i + 1}`,
          durationMinutes: stationData.durationMinutes || 15,
          patientCaseIds: stationData.patientCaseIds || [],
        });
        createdStations.push(newStation._id);
      }
    }

    // 4️⃣ Cập nhật lại ExamRoom với danh sách trạm
    newRoom.stations = createdStations;
    await newRoom.save();

    return res.status(201).json({
      message: "Phòng thi đã được tạo thành công (bản nháp).",
      data: newRoom,
    });
  } catch (error) {
    console.error("❌ Lỗi trong createExamRoom:", error);
    res.status(500).json({ message: "Lỗi khi tạo phòng thi.", error: error.message });
  }
};

/**
 * 📋 LẤY DANH SÁCH TẤT CẢ PHÒNG THI (GET /api/exam-rooms)
 * Dùng cho ExamRoomList.jsx
 */
export const getExamRooms = async (req, res) => {
  try {
    const rooms = await ExamRoom.find()
      .populate("stations") // lấy danh sách trạm liên kết
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Danh sách phòng thi đã được tải thành công.",
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    console.error("❌ Lỗi trong getExamRooms:", error);
    res.status(500).json({ message: "Không thể tải danh sách phòng thi." });
  }
};

/**
 * 🔍 LẤY CHI TIẾT 1 PHÒNG THEO ID (GET /api/exam-rooms/:id)
 * Dùng cho EditExamRoom.jsx (Phase 3)
 */
export const getExamRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await ExamRoom.findById(id).populate({
      path: "stations",
      populate: { path: "patientCaseIds" },
    });

    if (!room)
      return res.status(404).json({ message: "Không tìm thấy phòng thi." });

    res.status(200).json({ message: "Chi tiết phòng thi.", data: room });
  } catch (error) {
    console.error("❌ Lỗi trong getExamRoomById:", error);
    res.status(500).json({ message: "Không thể tải phòng thi." });
  }
};

/**
 * ✏️ CẬP NHẬT PHÒNG THI (PATCH /api/exam-rooms/:id)
 * Cho phép giáo viên chỉnh sửa thông tin phòng thi
 */
export const updateExamRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { exam_room_name, exam_room_code, terminology, timeWindow } = req.body;

    const updatedRoom = await ExamRoom.findByIdAndUpdate(
      id,
      {
        exam_room_name,
        exam_room_code,
        terminology,
        timeWindow,
      },
      { new: true, runValidators: true }
    );

    if (!updatedRoom)
      return res.status(404).json({ message: "Không tìm thấy phòng thi để cập nhật." });

    res.status(200).json({
      message: "Phòng thi đã được cập nhật thành công.",
      data: updatedRoom,
    });
  } catch (error) {
    console.error("❌ Lỗi trong updateExamRoom:", error);
    res.status(500).json({
      message: "Không thể cập nhật phòng thi.",
      error: error.message,
    });
  }
};

/**
 * 🚀 PHÁT ĐỀ THI (POST /api/exam-rooms/:id/publish)
 */
export const publishExamRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await ExamRoom.findById(id).populate("stations");

    if (!room)
      return res.status(404).json({ message: "Không tìm thấy phòng thi." });

    // 1️⃣ Validation: ensure room has at least 1 station
    if (!room.stations || room.stations.length === 0) {
      return res
        .status(400)
        .json({ message: "Phòng thi chưa có trạm nào, không thể phát đề." });
    }

    // 2️⃣ Validation: each station must have at least 1 patient case
    const emptyStations = room.stations.filter(
      (s) => !s.patientCaseIds || s.patientCaseIds.length === 0
    );
    if (emptyStations.length > 0) {
      return res.status(400).json({
        message: `Một số trạm chưa có bệnh án (${emptyStations.length} trạm trống).`,
      });
    }

    // 3️⃣ Update status and publishedAt
    room.status = "Đã phát hành";
    room.publishedAt = new Date();
    await room.save();

    res.status(200).json({
      message: "🎉 Phòng thi đã được phát hành thành công!",
      data: room,
    });
  } catch (error) {
    console.error("❌ Lỗi trong publishExamRoom:", error);
    res
      .status(500)
      .json({ message: "Không thể phát đề thi.", error: error.message });
  }
};


/**
 * 🎓 SINH VIÊN THAM GIA PHÒNG THI (POST /api/exam-rooms/join)
 */
// ✅ Allow student to join an exam room using its code
export const joinExamRoom = async (req, res) => {
  try {
    const { code } = req.body;

    // 🧩 Find the exam room and include its stations
    const room = await ExamRoom.findOne({ exam_room_code: code })
      .populate({
        path: "stations",
        select: "_id stationName durationMinutes patientCaseIds",
      });

    // 🛑 Not found
    if (!room) {
      return res.status(404).json({ message: "Phòng thi không tồn tại." });
    }

    // 🛑 Not published yet
    if (room.status !== "Đã phát hành") {
      return res.status(403).json({ message: "Phòng thi chưa được phát hành." });
    }

    // 🩺 No stations in room
    if (!room.stations || room.stations.length === 0) {
      return res.status(400).json({ message: "Phòng thi chưa có trạm nào." });
    }

    // ✅ Success
    return res.status(200).json({
      message: "Joined exam room successfully",
      data: room,
    });
  } catch (error) {
    console.error("❌ Error joining exam room:", error);
    return res.status(500).json({
      message: "Lỗi máy chủ khi tham gia phòng thi.",
      error: error.message,
    });
  }
};

