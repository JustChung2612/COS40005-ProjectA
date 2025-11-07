// models/examStation.model.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const ExamStationSchema = new Schema(
  {
    // 🔗 Liên kết đến phòng thi (ExamRoom)
    exam_room_Id: {
      type: Schema.Types.ObjectId,
      ref: "ExamRoom",
      required: true,
    },

    // 🧭 Số thứ tự trạm trong phòng
    stationIndex: {
      type: Number,
      required: true,
    },

    // 🧾 Tên hoặc tiêu đề trạm (vd: "Trạm 1 - Hô hấp")
    stationName: {
      type: String,
      trim: true,
    },

    // ⏱️ Thời lượng làm trạm (phút)
    durationMinutes: {
      type: Number,
      default: 15,
    },

    // 🩺 Danh sách bệnh án thuộc trạm này
    patientCaseIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "PatientCase",
      },
    ],

    // ⚙️ Cấu hình riêng cho trạm (tùy chọn)
    stationSettings: {
      selectionPolicy: {
        type: String,
        enum: ["random", "roundRobin", "seeded"],
        default: "random",
      },
      uniquePerStudent: { type: Boolean, default: true },
      notes: { type: String, trim: true },
    },
  },
  {
    timestamps: true,
  }
);


const ExamStation = mongoose.model("ExamStation", ExamStationSchema);
export default ExamStation;



  // 690c68055001ba5efc12bd1d
  // 690c6b785001ba5efc12be43
  // 690c6b785001ba5efc12be47
  // 690c95f3badba4c0b8a46028
  // 690c95f3badba4c0b8a4602a
  // 690ca66bd43a9c68fc5d323d
  // 690ca66bd43a9c68fc5d323f
  // 690ca66bd43a9c68fc5d3241