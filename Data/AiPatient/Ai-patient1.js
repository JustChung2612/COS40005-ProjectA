export const candidate_instruction = [
  "Bạn là một sinh viên y khoa đang làm việc tại khoa cấp cứu",
  "Một phụ nữ 34 tuổi đến khám để được đánh giá tình trạng bệnh",
  "Triệu chứng chính khi vào viện là đau bụng",
  "Vui lòng khai thác bệnh sử",
  "Khi kết thúc trạm, giám khảo có thể hỏi bạn thêm một số câu hỏi"
];

export const Ai_patient_script_model = {
  brief_info: {
    name_symptom: "Đau Bụng 1",
    desc: `Phụ nữ 34 tuổi tại khoa cấp cứu với
          cơn đau thượng vị dữ dội khởi phát đột ngột, lan ra sau lưng,
          kèm buồn nôn và cảm giác nóng, vã mồ hôi.`,
    topic: "Khai thác bệnh sử",
  },

  key_details: [
    "Phụ nữ 34 tuổi",
    "Địa điểm: khoa cấp cứu",
    "Nội trợ toàn thời gian",
  ],

  presenting_complaint: [
    'Đau thượng vị ("Bụng tôi đau lắm, đau không chịu nổi")',
  ],

  history_of_presenting_complaint: [
    'Vị trí: thượng vị ("Đau ở giữa, ngay dưới xương sườn")',
    'Khởi phát: đột ngột, khoảng 90 phút trước ("Cơn đau xuất hiện đột ngột khoảng một tiếng rưỡi trước")',
    'Tính chất: đau nhói, quặn ("Đó là cơn đau nhói, quặn thắt")',
    'Lan đau: lan ra sau lưng ("Thực ra nó lan xuyên từ bụng ra sau lưng")',
    'Triệu chứng kèm theo: buồn nôn ("Tôi cảm thấy rất buồn nôn và phải cố gắng không nôn"); sốt/cảm giác nóng và vã mồ hôi ("Tôi thấy nóng và đổ mồ hôi từ khi cơn đau bắt đầu")',
    'Diễn tiến theo thời gian: đau liên tục và ngày càng nặng ("Cơn đau liên tục và đang trở nên tệ hơn. Rất kinh khủng")',
    'Yếu tố làm nặng/giảm đau: đau tăng khi hít sâu và cử động ("Đau hơn khi tôi hít sâu hoặc di chuyển"); giảm khi cúi người về phía trước ("Cách duy nhất giúp tôi đỡ đau là cúi người về phía trước")',
    'Mức độ đau: 11/10 ("Đau mức 11/10!")',
    'Cơn tương tự trước đây: chưa từng ("Không, đây là lần đầu tiên tôi bị như thế này")',
    'Triệu chứng kèm theo khác: khó thở ("Tôi cảm thấy khó thở từ khi bắt đầu, kể cả khi đang ngồi")',
    'Thói quen đại tiện: đi cầu sáng nay ("Tôi đi cầu sáng nay, không có vấn đề gì")',
    "Sụt cân: giảm 3kg có chủ ý trong 4 tuần qua – gần đây bắt đầu chế độ tập luyện mới",
    "Triệu chứng âm tính liên quan: không vàng da/ngứa; không nuốt khó/đau khi nuốt; không trào ngược; không thay đổi thói quen đại tiện/không đi cầu ra máu hay phân đen; không tiểu buốt; không lú lẫn; không đi du lịch gần đây; không đổ mồ hôi đêm",
  ],

  ice: [
    'Suy nghĩ của bệnh nhân: "Tôi không biết chuyện gì đang xảy ra, có thể là đau bụng do nhiễm trùng?"',
    'Lo lắng: "Chỉ là cơn đau thôi..."',
    'Kỳ vọng: "Tôi muốn cơn đau dừng lại. Làm ơn giúp tôi!"',
  ],

  past_medical_and_surgical_history: [
    'Sỏi mật ("Tôi bị sỏi mật vài tháng trước, nhưng cơn đau lần này tệ hơn nhiều")',
    'Đái tháo đường thai kỳ ("Tôi bị tiểu đường khi mang thai cả hai bé, nhưng sau đó đường huyết đã trở lại bình thường")',
  ],

  drug_history: [
    "Thuốc tránh thai uống phối hợp (Gedarel 30/150)",
    "Không có tiền sử dị ứng thuốc đã biết",
  ],

  family_history: [
    'Mẹ có tiền sử sỏi mật và đái tháo đường típ 2 ("Mẹ tôi bị sỏi mật và tiểu đường típ 2 trước khi qua đời")',
    "Không có tiền sử gia đình đáng chú ý khác",
  ],

  social_history: [
    "Sống cùng chồng và hai con (5 tuổi và 1 tuổi)",
    "Nội trợ toàn thời gian",
    'Không hút thuốc ("Không, tôi chưa bao giờ hút thuốc")',
    'Rượu bia: uống 2 chai rượu vang vào cuối tuần ("Tôi thường uống hai chai rượu vang vào cuối tuần, không uống trong tuần")',
    'Tập luyện và ăn uống: bắt đầu chế độ tập luyện mới ("Gần đây tôi bắt đầu chạy bộ và kiểm soát chế độ ăn...")',
    'Chất kích thích: không sử dụng ("Không, không dùng gì cả")',
  ],

  diagnosis: "Viêm tụy cấp",
};
