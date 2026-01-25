// ===========================
// 🩺 MẪU BỆNH ÁN TÌNH HUỐNG (CHUẨN HÓA)
// Môn thi: NỘI HÔ HẤP – HO RA MÁU (LAO PHỔI CŨ TÁI PHÁT)
// ===========================

const TramThi1 = {
  "tram_thi_ID": "tramthiid1",

  "metadata": {
    "chuan_doan": "Suy tim",
    "co_quan": "Tim mạch",
    "trieu_chung": "Khó thở",
    "do_kho": "Trung bình",
    "doi_tuong": "Người lớn",
    "loai_benh": "Mạn tính",
    "nam": 2025
  },
  "benh_an_tinh_huong": {
    "thong_tin_benh_nhan": {
      "ho_ten": "Lê Văn Ph.",
      "tuoi": 80,
      "gioi_tinh": "Nam",
      "nghe_nghiep": "Thợ máy (đã nghỉ hưu)",
      "ly_do_nhap_vien": "Ho ra máu"
    },

    "benh_su": {
      "mo_ta1": "Bệnh khởi phát 2 ngày trước nhập viện với ho khan tăng dần về đêm. Sau đó bệnh nhân ngứa cổ, nặng ngực bên trái và bắt đầu ho ra máu đỏ tươi lẫn đàm trắng bọt, không lẫn thức ăn hay máu cục, lượng khoảng 2 muỗng cà phê, không khó thở.",
      "mo_ta2": "Trong đêm, bệnh nhân tiếp tục ho ra máu thêm 4 lần, lượng tăng (#2–3 mcf/lần). Sáng hôm sau ho ra máu đỏ tươi, lẫn máu cục, không hoa mắt, không khó thở. Không sốt, không đau ngực, không sụt cân.",
      "mo_ta3": "Trước đó, bệnh nhân có tiền sử lao phổi điều trị 8 tháng tại BV Phạm Ngọc Thạch (cách đây 5 năm), sau điều trị BK đàm âm tính. Gần đây thỉnh thoảng còn ho khan ít, không khó thở, không đau ngực."
    },

    "tien_can": [
      "Tăng huyết áp 13 năm, điều trị liên tục, HA trung bình 130/70 mmHg.",
      "Nhồi máu cơ tim cách 7 năm, đã đặt stent, hiện dùng Telmisartan, Amlodipin, Bisoprolol, Trimetazidin, Atorvastatin.",
      "Tiền sử lao phổi cũ điều trị 8 tháng, BK (-) sau điều trị.",
      "Không hút thuốc, không uống rượu.",
      "Không ghi nhận tiền căn phẫu thuật hay chấn thương."
    ],

    "luoc_qua_cac_co_quan": [
      "Tim mạch: không đau ngực.",
      "Hô hấp: không ho khạc đàm, không khó thở (ngoài cơn).",
      "Tiêu hóa: không đau bụng, không nôn, đi tiêu phân vàng đóng khuôn.",
      "Tiết niệu: tiểu khoảng 1 L/ngày, nước tiểu vàng trong, không gắt buốt.",
      "Cơ xương khớp: không đau nhức tay chân, vận động bình thường."
    ],

    "kham_lam_sang": [
      "Bệnh nhân tỉnh, tiếp xúc tốt.",
      "Sinh hiệu: HA 130/70 mmHg, M 86 lần/phút, T 37°C, SpO₂ 94%.",
      "Cân nặng 45 kg, chiều cao 1.6 m (BMI 17.6).",
      "Niêm hồng, không dấu xuất huyết, không phù.",
      "Hạch ngoại biên không sờ chạm.",
      "Đầu mặt cổ bình thường, không tĩnh mạch cổ nổi tư thế 45°, tuyến giáp không to.",
      "Tim: mỏm tim KLS V đường trung đòn trái, nhịp đều, không âm thổi, không rung miêu.",
      "Phổi: rung thanh đều hai bên, gõ trong, rì rào phế nang êm dịu; ran nổ nhẹ hai đáy phổi.",
      "Bụng mềm, gan lách không sờ chạm, không đau.",
      "Thận chạm (-), cầu bàng quang (-).",
      "Cổ mềm, không dấu thần kinh khu trú.",
      "Các cơ quan khác: chưa ghi nhận bất thường."
    ]
  },

  "cau_hoi": [
    {
      "id": 1,
      "noi_dung": "Nguyên nhân thường gặp nhất gây ho ra máu ở bệnh nhân này là gì?",
      "hinh_anh" : '',
      "kieu": "radio",
      "lua_chon": [
        "Lao phổi cũ tái phát",
        "Ung thư phổi",
        "Giãn phế quản",
        "Viêm phổi cấp"
      ],
      "dap_an_dung": "Lao phổi cũ tái phát"
    },
    {
      "id": 2,
      "noi_dung": "Cơ chế ho ra máu trong lao phổi cũ là gì?",
      "kieu": "text",
      "goi_y": "Gợi ý: do tổn thương mạch máu trong hang lao, giãn phế quản hoặc viêm mạn tính.",
      "dap_an_dung": "Do vỡ mạch máu trong tổn thương hang lao hoặc giãn phế quản trên nền viêm phổi mạn tính."
    },
    {
      "id": 3,
      "noi_dung": "Triệu chứng nào sau đây KHÔNG phù hợp với ho ra máu nặng?",
      "kieu": "radio",
      "lua_chon": [
        "Ho ra máu đỏ tươi số lượng nhiều",
        "Khó thở, tụt SpO₂",
        "Ho khan ít, lượng vài giọt máu lẫn đàm",
        "Ho ra máu liên tục nhiều giờ"
      ],
      "dap_an_dung": "Ho khan ít, lượng vài giọt máu lẫn đàm"
    },
    {
      "id": 4,
      "noi_dung": "Cận lâm sàng nào cần thực hiện đầu tiên khi bệnh nhân nhập viện ho ra máu?",
      "kieu": "radio",
      "lua_chon": [
        "Chụp X-quang ngực",
        "CT-scan não",
        "Siêu âm bụng",
        "Điện tâm đồ"
      ],
      "dap_an_dung": "Chụp X-quang ngực"
    },
    {
      "id": 5,
      "noi_dung": "Bệnh nhân có tiền sử lao phổi cũ, điều này gợi ý nguy cơ gì?",
      "kieu": "checkbox",
      "lua_chon": [
        "Tái phát lao phổi",
        "Giãn phế quản sau lao",
        "U phổi",
        "Bệnh phổi tắc nghẽn mạn tính"
      ],
      "dap_an_dung": ["Tái phát lao phổi", "Giãn phế quản sau lao"]
    },
    {
      "id": 6,
      "noi_dung": "Xử trí ban đầu khi bệnh nhân đang ho ra máu tươi là gì? (Chọn tất cả đáp án đúng)",
      "kieu": "checkbox",
      "lua_chon": [
        "Cho bệnh nhân nằm nghỉ tư thế Fowler",
        "Đặt nằm nghiêng bên phổi chảy máu xuống dưới",
        "Cho thuốc cầm máu (Transamin)",
        "Khuyến khích bệnh nhân nói nhiều để đờm ra dễ",
        "Theo dõi mạch, HA, SpO₂ liên tục"
      ],
      "dap_an_dung": [
        "Cho bệnh nhân nằm nghỉ tư thế Fowler",
        "Đặt nằm nghiêng bên phổi chảy máu xuống dưới",
        "Cho thuốc cầm máu (Transamin)",
        "Theo dõi mạch, HA, SpO₂ liên tục"
      ]
    },
    {
      "id": 7,
      "noi_dung": "Nguyên tắc điều trị ho ra máu do lao phổi bao gồm những gì?",
      "kieu": "checkbox",
      "lua_chon": [
        "Điều trị nguyên nhân (lao)",
        "Cầm máu, giảm ho",
        "Nâng đỡ toàn trạng",
        "Phẫu thuật ngay lập tức"
      ],
      "dap_an_dung": [
        "Điều trị nguyên nhân (lao)",
        "Cầm máu, giảm ho",
        "Nâng đỡ toàn trạng"
      ]
    },
    {
      "id": 8,
      "noi_dung": "Thuốc nào sau đây KHÔNG nên dùng trong điều trị ho ra máu?",
      "kieu": "radio",
      "lua_chon": [
        "Thuốc chống đông",
        "Thuốc cầm máu (Transamin)",
        "Thuốc giảm ho",
        "Thuốc an thần nhẹ"
      ],
      "dap_an_dung": "Thuốc chống đông"
    },
    {
      "id": 9,
      "noi_dung": "Những xét nghiệm nào giúp xác định nguyên nhân ho ra máu? (Chọn tất cả đáp án đúng)",
      "kieu": "checkbox",
      "lua_chon": [
        "X-quang ngực thẳng nghiêng",
        "CT-scan ngực có cản quang",
        "Xét nghiệm đàm tìm BK",
        "Xét nghiệm chức năng gan"
      ],
      "dap_an_dung": [
        "X-quang ngực thẳng nghiêng",
        "CT-scan ngực có cản quang",
        "Xét nghiệm đàm tìm BK"
      ]
    },
    {
      "id": 10,
      "noi_dung": "Tư vấn cho bệnh nhân ho ra máu tái phát là gì?",
      "kieu": "checkbox",
      "lua_chon": [
        "Không hút thuốc, tránh bụi và khói",
        "Tái khám định kỳ chuyên khoa hô hấp",
        "Theo dõi lượng máu ho ra mỗi ngày",
        "Nằm nghỉ tuyệt đối khi đang ra máu",
        "Tăng cường vận động hằng ngày"
      ],
      "dap_an_dung": [
        "Không hút thuốc, tránh bụi và khói",
        "Tái khám định kỳ chuyên khoa hô hấp",
        "Theo dõi lượng máu ho ra mỗi ngày",
        "Nằm nghỉ tuyệt đối khi đang ra máu"
      ]
    }
  ]
};

export default TramThi1 ;
