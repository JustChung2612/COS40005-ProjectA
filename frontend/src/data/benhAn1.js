// ===========================
// 🩺 MẪU BỆNH ÁN TÌNH HUỐNG (CHUẨN HÓA)
// ===========================

const Mau_Benh_An = {
  // ======= BỆNH ÁN TÌNH HUỐNG =======
  "benh_an_tinh_huong": {
    // ------------------------------
    // Thông Tin Bệnh Nhân
    // ------------------------------
    "thong_tin_benh_nhan": {
      "ho_ten": "Dương Thị L.",
      "tuoi": 59,
      "gioi_tinh": "Nữ",
      "nghe_nghiep": "Nội trợ",
      "ly_do_nhap_vien": "Khó thở"
    },

    // ------------------------------
    // Bệnh Sử (3 đoạn mô tả tối đa)
    // ------------------------------
    "benh_su": {
      "mo_ta1": "Bệnh nhân phát hiện tăng huyết áp và đái tháo đường type 2 khoảng 3 năm. Sáu tháng trước nhập viện vì khó thở, được chẩn đoán: suy tim, thiếu máu cơ tim, tăng huyết áp, bệnh thận mạn giai đoạn 3, thiếu máu thiếu sắt, rối loạn lipid máu; điều trị nội trú 3 tuần rồi xuất viện.",
      "mo_ta2": "Từ khi ra viện, bệnh nhân đi bộ khoảng 200m đã khó thở, không khó thở khi nghỉ ngơi hay sinh hoạt cá nhân. Tái khám định kỳ hàng tháng tại bệnh viện Nhân Dân Gia Định.",
      "mo_ta3": "Hai ngày trước nhập viện, khó thở tăng dần, ban đầu khi đi lại trong nhà (~50m), sau đó cả khi nghỉ ngơi. Đêm trước nhập viện, khó thở khiến bệnh nhân phải ngồi dậy, ho khan; sau 20–30 phút đỡ, nhưng tái diễn giữa đêm, sáng không giảm nên nhập viện."
    },

    // ------------------------------
    // Tiền Căn (hiển thị dạng bullet points)
    // ------------------------------
    "tien_can": [
      "Tăng huyết áp 3 năm, điều trị thường xuyên, HA trung bình 130/70 mmHg.",
      "Đái tháo đường type 2, kiểm soát ổn định 3 năm, chưa biến chứng.",
      "Bệnh thận mạn giai đoạn 3, thiếu máu thiếu sắt, rối loạn lipid máu.",
      "Không hút thuốc, không uống rượu, không dị ứng thuốc/thức ăn ghi nhận."
    ],

    // ------------------------------
    // Lược Qua Các Cơ Quan (hiển thị dạng bullet points)
    // ------------------------------
    "luoc_qua_cac_co_quan": [
      "Tim mạch: không đau ngực, không hồi hộp đánh trống ngực.",
      "Hô hấp: không ho, không khò khè tại thời điểm thăm khám.",
      "Tiêu hoá: không đau bụng, không nôn ói; đi tiêu phân vàng đóng khuôn mỗi ngày.",
      "Tiết niệu: tiểu khoảng 1 lít/ngày, nước tiểu vàng trong, không gắt buốt.",
      "Cơ xương khớp: không đau nhức khớp, vận động bình thường."
    ],

    // ------------------------------
    // Khám Lâm Sàng (hiển thị dạng bullet points)
    // ------------------------------
    "kham_lam_sang": [
      "Tỉnh táo, tiếp xúc tốt. Huyết áp 150/70 mmHg, mạch 74 lần/phút, nhịp thở 20 lần/phút, nhiệt độ 37°C.",
      "Cân nặng 42 kg, chiều cao 1.56 m (BMI 17.3).",
      "Niêm nhạt, không phù, không hạch ngoại biên.",
      "Tim: mỏm tim KLS VI đường trung đòn trái; âm thổi toàn tâm thu 2/6 tại mỏm lan dọc bờ trái xương ức.",
      "Phổi: rì rào phế nang đều hai bên, ran nổ ít đáy phổi trái.",
      "Bụng mềm, không đau, gan không to, lách không sờ chạm.",
      "Không dấu thần kinh khu trú, các khớp bình thường."
    ]
  },

  // ======= CÂU HỎI =======
  "cau_hoi": [
    {
      "id": 1,
      "noi_dung": "Nguyên nhân có khả năng nhất gây khó thở cấp khi nhập viện ở bệnh nhân này là gì?",
      "kieu": "radio",
      "lua_chon": [
        "Suy tim mất bù cấp (trên nền suy tim mạn)",
        "Đợt cấp COPD",
        "Thuyên tắc phổi",
        "Cơn hen phế quản cấp"
      ],
      "dap_an_dung": "Suy tim mất bù cấp (trên nền suy tim mạn)"
    },
    {
      "id": 2,
      "noi_dung": "Dựa trên triệu chứng khó thở khi nằm và khó thở kịch phát về đêm, bệnh nhân thuộc phân độ NYHA nào khi nhập viện?",
      "kieu": "radio",
      "lua_chon": ["Độ I", "Độ II", "Độ III", "Độ IV"],
      "dap_an_dung": "Độ IV"
    },
    {
      "id": 3,
      "noi_dung": "Những dấu hiệu nào sau đây gợi ý suy tim trái ở bệnh nhân này? (Chọn tất cả đáp án đúng)",
      "kieu": "checkbox",
      "lua_chon": [
        "Khó thở phải ngồi dậy khi nằm",
        "Ran ẩm nổ ở hai đáy phổi",
        "Phù ngoại biên rõ 3+",
        "Tĩnh mạch cổ nổi cao",
        "Cần thở oxy để duy trì SpO₂ ≥ 95%"
      ],
      "dap_an_dung": [
        "Khó thở phải ngồi dậy khi nằm",
        "Ran ẩm nổ ở hai đáy phổi",
        "Cần thở oxy để duy trì SpO₂ ≥ 95%"
      ]
    },
    {
      "id": 4,
      "noi_dung": "Kể tên HAI xử trí cấp cứu ban đầu phù hợp cho bệnh nhân này khi nhập khoa Cấp cứu.",
      "kieu": "text",
      "goi_y": "Ví dụ: thở oxy, cho bệnh nhân ngồi, dùng furosemid, nitrate.",
      "dap_an_dung": "Thở oxy, cho ngồi đầu cao, truyền hoặc tiêm furosemid, dùng nitrate nếu có chỉ định."
    },
    {
      "id": 5,
      "noi_dung": "Âm thổi toàn tâm thu 2/6 tại mỏm tim lan dọc bờ trái xương ức phù hợp nhất với bệnh lý nào?",
      "kieu": "radio",
      "lua_chon": [
        "Hẹp van động mạch chủ",
        "Hở van hai lá",
        "Hở van động mạch chủ",
        "Hẹp van hai lá"
      ],
      "dap_an_dung": "Hở van hai lá"
    },
    {
      "id": 6,
      "noi_dung": "Các bệnh lý mạn tính nào sau đây được ghi nhận ở bệnh nhân? (Chọn tất cả đáp án đúng)",
      "kieu": "checkbox",
      "lua_chon": [
        "Tăng huyết áp",
        "Đái tháo đường type 2",
        "Bệnh thận mạn giai đoạn 3",
        "Rối loạn lipid máu",
        "Hen phế quản",
        "Bệnh tuyến giáp"
      ],
      "dap_an_dung": [
        "Tăng huyết áp",
        "Đái tháo đường type 2",
        "Bệnh thận mạn giai đoạn 3",
        "Rối loạn lipid máu"
      ]
    },
    {
      "id": 7,
      "noi_dung": "Bệnh nhân nặng 42 kg, cao 1,56 m. Chỉ số BMI của bệnh nhân thuộc nhóm nào?",
      "kieu": "radio",
      "lua_chon": [
        "Thiếu cân (<18,5)",
        "Bình thường (18,5–24,9)",
        "Thừa cân (25–29,9)",
        "Béo phì (≥30)"
      ],
      "dap_an_dung": "Thiếu cân (<18,5)"
    },
    {
      "id": 8,
      "noi_dung": "Giải thích ngắn gọn cơ chế gây khó thở khi nằm ở bệnh nhân suy tim trái.",
      "kieu": "text",
      "goi_y": "Gợi ý: tư thế nằm → máu tĩnh mạch trở về tim tăng → tăng áp mao mạch phổi → ứ huyết, phù phổi.",
      "dap_an_dung": "Khi nằm, lượng máu tĩnh mạch trở về tim tăng làm áp lực mao mạch phổi tăng, gây ứ huyết phổi và khó thở."
    },
    {
      "id": 9,
      "noi_dung": "Những nội dung tư vấn xuất viện nào là phù hợp cho bệnh nhân này? (Chọn tất cả đáp án đúng)",
      "kieu": "checkbox",
      "lua_chon": [
        "Chế độ ăn nhạt (<2g muối/ngày)",
        "Hạn chế dịch 1,5–2L/ngày nếu còn phù hoặc khó thở",
        "Cân buổi sáng hằng ngày, báo bác sĩ nếu tăng >2kg trong 3 ngày",
        "Dùng thuốc giảm đau NSAID liều cao khi đau nhức",
        "Tái khám định kỳ tại phòng khám tim mạch"
      ],
      "dap_an_dung": [
        "Chế độ ăn nhạt (<2g muối/ngày)",
        "Hạn chế dịch 1,5–2L/ngày nếu còn phù hoặc khó thở",
        "Cân buổi sáng hằng ngày, báo bác sĩ nếu tăng >2kg trong 3 ngày",
        "Tái khám định kỳ tại phòng khám tim mạch"
      ]
    },
    {
      "id": 10,
      "noi_dung": "Cận lâm sàng ban đầu nào giúp xác định nhanh tình trạng ứ huyết phổi cấp?",
      "kieu": "radio",
      "lua_chon": [
        "X-quang ngực",
        "Đo chức năng hô hấp (spirometry)",
        "Định lượng D-dimer",
        "Nội soi dạ dày – thực quản"
      ],
      "dap_an_dung": "X-quang ngực"
    }
  ]

};

export default Mau_Benh_An;
