// ===========================
// 🩺 TRẠM THI 2 – NỘI TỔNG QUÁT: TRÀN DỊCH MÀNG PHỔI
// ===========================

const Tram_Thi_2 = {
  "tram_thi_ID": "tramthiid2",

  // ======= METADATA =======
  "metadata": {
    "chuan_doan": "Tràn dịch màng phổi",
    "co_quan": "Hô hấp",
    "trieu_chung": "Khó thở, ho khan, sụt cân",
    "do_kho": "Trung bình",
    "doi_tuong": "Người già"
  },

  "ten_tram": "Hô hấp",

  // ======= BỆNH ÁN TÌNH HUỐNG =======
  "benh_an_tinh_huong": {
    "thong_tin_benh_nhan": {
      "ho_ten": "Không ghi",
      "tuoi": 80,
      "gioi_tinh": "Nam",
      "nghe_nghiep": "",
      "ly_do_nhap_vien": "Khó thở"
    },

    "benh_su": {
      "mo_ta1": "Cách nhập viện 3 tháng: Bệnh nhân ho khan, ho nhiều hơn về đêm, có sốt nhẹ khoảng 38°C, tự mua thuốc uống, sốt có giảm nhưng ho vẫn còn.",
      "mo_ta2": "Cách nhập viện 3 ngày: Bệnh nhân khó thở nhiều, tăng nhiều sau khi ho, khó thở liên tục 2 ngày, không đỡ theo tư thế, khó thở ngày càng tăng nên nhập viện.",
      "mo_ta3": "Không phù, không hạn chế vận động, không đi du lịch gần đây. Sụt cân 5 kg trong 2 tháng, cân nặng hiện tại 45 kg."
    },

    "tien_can": [
      "Hút thuốc lá 50 gói-năm.",
      "Tiền căn lao phổi cách 10 năm, điều trị phác đồ 8 tháng, xơ hóa rải rác đỉnh phổi phải.",
      "Chưa ghi nhận bệnh lý tăng huyết áp, đái tháo đường, rối loạn lipid máu, hen, bệnh tim mạch, K.",
      "Không dùng thuốc khác tại nhà, không tiền căn phẫu thuật/chấn thương.",
      "Gia đình: chưa ghi nhận COPD, hen, THA, ĐTĐ, K,…"
    ],

    "luoc_qua_cac_co_quan": [
      "Không ghi nhận phù, không hạn chế vận động.",
      "Không ghi nhận triệu chứng tim mạch, tiêu hóa, tiết niệu bất thường."
    ],

    "kham_lam_sang": [
      "Bệnh nhân tỉnh, có co kéo nhẹ cơ hô hấp phụ, nói chuyện được nhưng chậm.",
      "Mạch 120 lần/phút, HA 120/80 mmHg, Nhiệt độ 37°C, NT 26 lần/phút, SpO₂ 97% khí trời.",
      "Môi khô, lưỡi dơ, chi ấm, mạch rõ.",
      "Có hạch thượng đòn (T) (+).",
      "Thể trạng gầy, cao 1m62, nặng 45 kg.",
      "Ngực giảm cử động lồng ngực bên phải.",
      "Tim: mỏm tim KLS V trung đòn trái, tần số 120 lần/phút, đều, không âm thổi.",
      "Phổi phải: rung thanh giảm, gõ đục đáy, âm phế bào giảm từ KLS 4 đến đáy phổi.",
      "Các cơ quan khác chưa ghi nhận bất thường."
    ]
  },

  // ======= CÂU HỎI =======
  "cau_hoi": [
    {
      "id": 1,
      "noi_dung": "Đặt vấn đề ở bệnh nhân này?",
      "kieu": "text",
      "goi_y": "Mô tả các hội chứng chính phát hiện được qua thăm khám",
      "dap_an_dung": "1. Hội chứng 3 giảm đáy phổi phải (giảm âm phế bào, gõ đục, rung thanh giảm). 2. Hội chứng nhiễm lao chung (ho, sốt về chiều, sụt cân, tiền căn lao). 3. Hội chứng tăng chuyển hóa (sốt, sụt cân, hạch thượng đòn (+) Virchow)."
    },
    {
      "id": 2,
      "noi_dung": "Nêu chẩn đoán sơ bộ của bạn ở bệnh nhân này và giải thích ngắn gọn?",
      "kieu": "text",
      "goi_y": "Đưa ra chẩn đoán ban đầu phù hợp với dữ kiện lâm sàng",
      "dap_an_dung": "Tràn dịch màng phổi phải nghi nhiều do u. Lý do: bệnh nhân lớn tuổi, hút thuốc lá nhiều, sụt cân nhanh, có hạch thượng đòn (+) — gợi ý hội chứng cận ung."
    },
    {
      "id": 3,
      "noi_dung": "Nêu thêm 2 chẩn đoán phân biệt ở bệnh nhân này và giải thích ngắn gọn?",
      "kieu": "text",
      "goi_y": "Liệt kê 2 khả năng khác có thể gây tràn dịch màng phổi ở bệnh nhân này",
      "dap_an_dung": "+ Tràn dịch màng phổi phải do lao (bệnh nhân có tiền căn lao phổi, biểu hiện hội chứng nhiễm lao). + Tràn dịch màng phổi phải do viêm thùy dưới phổi phải (ít nghĩ nhất, phù hợp trên bệnh nhân lớn tuổi, giảm miễn dịch chức năng, biểu hiện nhiễm trùng kín đáo)."
    },
    {
      "id": 4,
      "noi_dung": "Hãy đề nghị các cận lâm sàng cần thiết để hỗ trợ chẩn đoán?",
      "kieu": "checkbox",
      "lua_chon": [
        "X-quang ngực",
        "Chọc dò dịch màng phổi",
        "Xét nghiệm CTM, CRP",
        "AFB đàm 2 mẫu",
        "Cấy đàm",
        "CT ngực có cản quang"
      ],
      "dap_an_dung": [
        "X-quang ngực",
        "Chọc dò dịch màng phổi",
        "CTM, CRP",
        "AFB đàm 2 mẫu",
        "Cấy đàm",
        "CT ngực có cản quang"
      ]
    }
  ]
};

export default Tram_Thi_2;
