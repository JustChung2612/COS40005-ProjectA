// ===========================
// 🩺 TRẠM THI 3 – NỘI TỔNG QUÁT: THẬN
// ===========================

const Tram_Thi_3 = {
  "tram_thi_ID": "tramthiid3",

  // ======= METADATA =======
  "metadata": {
    "chuan_doan": "Tổn thương thận cấp ",
    "co_quan": "Thận",
    "trieu_chung": "Tăng creatinin huyết, giảm chức năng thận",
    "do_kho": "Cơ bản",
    "doi_tuong": "Người lớn"
  },

  "ten_tram": "Thận",

  // ======= BỆNH ÁN TÌNH HUỐNG =======
  "benh_an_tinh_huong": {
    "thong_tin_benh_nhan": {
      "ho_ten": "Không ghi",
      "tuoi": 55,
      "gioi_tinh": "Nam",
      "nghe_nghiep": "",
      "ly_do_nhap_vien": "Đau ngực và khó thở"
    },

    "benh_su": {
      "mo_ta1": "Bệnh nhân nam 55 tuổi, có tiền sử tăng huyết áp và đái tháo đường được điều trị đều đặn.",
      "mo_ta2": "Bệnh nhân nhập viện vì đau thắt ngực và khó thở. ECG ghi nhận nhồi máu cơ tim cấp. Bệnh nhân được điều trị can thiệp mạch vành cấp cứu.",
      "mo_ta3": "Sau can thiệp mạch vành, bệnh nhân có biểu hiện tiểu ít và tăng creatinin huyết thanh trong những ngày sau nhập viện."
    },

    "tien_can": [
      "Tăng huyết áp, điều trị thường xuyên.",
      "Đái tháo đường type 2, kiểm soát ổn định.",
      "Không ghi nhận bệnh thận mạn trước đó."
    ],

    "luoc_qua_cac_co_quan": [
      "Tim mạch: đau thắt ngực, điều trị nhồi máu cơ tim cấp.",
      "Thận: tiểu ít sau can thiệp, không có phù rõ.",
      "Hô hấp, tiêu hóa: chưa ghi nhận bất thường đáng kể."
    ],

    "kham_lam_sang": [
      "Bệnh nhân tỉnh, mạch và huyết áp ổn.",
      "Không phù, không khó thở khi nghỉ.",
      "Lượng nước tiểu giảm so với bình thường."
    ]
  },

  // ======= CÂU HỎI =======
  "cau_hoi": [
    {
      "id": 1,
      "noi_dung": "Chẩn đoán và phân loại giai đoạn bệnh thận cấp ở bệnh nhân trên theo hướng dẫn KDIGO 2012. Chọn câu đúng và giải thích.",
      "kieu": "radio",
      "lua_chon": [
        "A. Tổn thương thận cấp – Giai đoạn 1",
        "B. Tổn thương thận cấp – Giai đoạn 2",
        "C. Tổn thương thận cấp – Giai đoạn 3"
      ],
      "dap_an_dung": "C. Tổn thương thận cấp – Giai đoạn 3",
      "goi_y": "Dựa trên sự thay đổi của creatinin huyết thanh theo thời gian"
    },
    {
      "id": 2,
      "noi_dung": "Giải thích cơ sở chẩn đoán tổn thương thận cấp giai đoạn 3 ở bệnh nhân này theo KDIGO 2012.",
      "kieu": "text",
      "goi_y": "Phân tích mức tăng creatinin huyết thanh và mối liên hệ với giá trị ban đầu",
      "dap_an_dung": "Mức tăng creatinin huyết thanh: ngày 2 là 122 µmol/L, ngày 5 là 230 µmol/L. So với giá trị nền 70 µmol/L, tăng > 3 lần (230 ÷ 70 ≈ 3,3). Theo KDIGO 2012, đây là tiêu chuẩn của tổn thương thận cấp giai đoạn 3."
    }
  ]
};

export default Tram_Thi_3;
