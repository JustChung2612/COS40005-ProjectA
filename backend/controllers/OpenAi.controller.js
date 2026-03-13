import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";
import PatientCase from "../models/patientCase.model.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const ALLOWED_VALUES = {
  chuan_doan: ["Lao Phổi", "Suy Tim", "Viêm Phổi", "Tràn Khí Màng", "Tăng Huyết Áp", "Lao"],
  co_quan: ["Tim mạch", "Phổi", "Thận", "Tiêu hóa", "Thần kinh", "Gan", "Dạ dày"],
  trieu_chung: ["Khó thở", "Ho ra máu", "Lơ mơ", "Đau ngực", "Sốt"],
  do_kho: ["Cơ bản", "Trung bình", "Nâng cao"],
  doi_tuong: ["Người lớn", "Người già", "Trẻ em", "Thai phụ"],
};

const EMPTY_FILTERS = {
  chuan_doan: "",
  co_quan: "",
  trieu_chung: "",
  do_kho: "",
  doi_tuong: "",
  min_tuoi: null,
  max_tuoi: null,
};

const normalizeText = (value = "") => value.trim().toLowerCase();

const pickAllowedValue = (value, allowedList = []) => {
  if (!value || typeof value !== "string") return "";

  const normalizedValue = normalizeText(value);

  const exactMatch = allowedList.find(
    (item) => normalizeText(item) === normalizedValue
  );

  return exactMatch || "";
};

const normalizeAge = (value) => {
  if (value === null || value === undefined || value === "") return null;

  const num = Number(value);
  if (!Number.isFinite(num) || num < 0) return null;

  return num;
};

const cleanJsonText = (text = "") => {
  return text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
};

const sanitizeExtractedFilters = (raw = {}) => {
  const minAge = normalizeAge(raw.min_tuoi);
  const maxAge = normalizeAge(raw.max_tuoi);

  let safeMinAge = minAge;
  let safeMaxAge = maxAge;

  if (safeMinAge !== null && safeMaxAge !== null && safeMinAge > safeMaxAge) {
    [safeMinAge, safeMaxAge] = [safeMaxAge, safeMinAge];
  }

  return {
    chuan_doan: pickAllowedValue(raw.chuan_doan, ALLOWED_VALUES.chuan_doan),
    co_quan: pickAllowedValue(raw.co_quan, ALLOWED_VALUES.co_quan),
    trieu_chung: pickAllowedValue(raw.trieu_chung, ALLOWED_VALUES.trieu_chung),
    do_kho: pickAllowedValue(raw.do_kho, ALLOWED_VALUES.do_kho),
    doi_tuong: pickAllowedValue(raw.doi_tuong, ALLOWED_VALUES.doi_tuong),
    min_tuoi: safeMinAge,
    max_tuoi: safeMaxAge,
  };
};

const buildPatientCaseQuery = (filters = EMPTY_FILTERS) => {
  const query = {};

  if (filters.chuan_doan) {
    query["metadata.chuan_doan"] = {
      $regex: filters.chuan_doan,
      $options: "i",
    };
  }

  if (filters.co_quan) {
    query["metadata.co_quan"] = {
      $regex: filters.co_quan,
      $options: "i",
    };
  }

  if (filters.trieu_chung) {
    query["metadata.trieu_chung"] = {
      $regex: filters.trieu_chung,
      $options: "i",
    };
  }

  if (filters.do_kho) {
    query["metadata.do_kho"] = filters.do_kho;
  }

  if (filters.doi_tuong) {
    query["metadata.doi_tuong"] = filters.doi_tuong;
  }

  if (filters.min_tuoi !== null || filters.max_tuoi !== null) {
    query["benh_an_tinh_huong.thong_tin_benh_nhan.tuoi"] = {};

    if (filters.min_tuoi !== null) {
      query["benh_an_tinh_huong.thong_tin_benh_nhan.tuoi"].$gte = filters.min_tuoi;
    }

    if (filters.max_tuoi !== null) {
      query["benh_an_tinh_huong.thong_tin_benh_nhan.tuoi"].$lte = filters.max_tuoi;
    }
  }

  return query;
};

export const parseAiPatientCasePrompt = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({
        message: "Vui lòng nhập prompt để AI phân tích.",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        message: "Thiếu GEMINI_API_KEY trong file .env",
      });
    }

    const systemPrompt = `
Bạn là AI hỗ trợ lọc bệnh án cho hệ thống OSCE.
Nhiệm vụ của bạn là đọc yêu cầu tự nhiên của giáo viên và chuyển nó thành JSON filter.

QUY TẮC RẤT QUAN TRỌNG:
1. Chỉ trả về JSON hợp lệ.
2. Không giải thích.
3. Không thêm markdown.
4. Không thêm \`\`\`json.
5. Chỉ dùng đúng các giá trị cho phép bên dưới nếu có thể khớp.
6. Nếu không xác định được trường nào thì để chuỗi rỗng "" hoặc null.

Các field bắt buộc trong JSON trả về:
{
  "chuan_doan": "",
  "co_quan": "",
  "trieu_chung": "",
  "do_kho": "",
  "doi_tuong": "",
  "min_tuoi": null,
  "max_tuoi": null
}

Danh sách giá trị hợp lệ:

chuan_doan:
${JSON.stringify(ALLOWED_VALUES.chuan_doan)}

co_quan:
${JSON.stringify(ALLOWED_VALUES.co_quan)}

trieu_chung:
${JSON.stringify(ALLOWED_VALUES.trieu_chung)}

do_kho:
${JSON.stringify(ALLOWED_VALUES.do_kho)}

doi_tuong:
${JSON.stringify(ALLOWED_VALUES.doi_tuong)}

Ví dụ:
Yêu cầu: "Tìm bệnh án phổi cho người già khó thở"
Kết quả:
{
  "chuan_doan": "",
  "co_quan": "Phổi",
  "trieu_chung": "Khó thở",
  "do_kho": "",
  "doi_tuong": "Người già",
  "min_tuoi": null,
  "max_tuoi": null
}
`;

    const result = await model.generateContent(
      `${systemPrompt}  User request: ${prompt.trim()}`
    );

    const rawText = cleanJsonText(result.response.text() || "");

    if (!rawText) {
      return res.status(500).json({
        message: "AI không trả về dữ liệu hợp lệ.",
      });
    }

    let parsedFilters;

    try {
      parsedFilters = JSON.parse(rawText);
    } catch (parseError) {
      return res.status(500).json({
        message: "Không thể parse JSON từ phản hồi AI.",
        rawText,
        error: parseError.message,
      });
    }

    const extractedFilters = sanitizeExtractedFilters(parsedFilters);
    const mongoQuery = buildPatientCaseQuery(extractedFilters);

    const matchedPatientCases = await PatientCase.find(mongoQuery).sort({
    createdAt: -1,
    });

    return res.status(200).json({
    message: "AI filter parsed and patient cases fetched successfully.",
    originalPrompt: prompt.trim(),
    extractedFilters,
    mongoQuery,
    count: matchedPatientCases.length,
    data: matchedPatientCases,
    });
   

  } catch (error) {
    console.error("Error in parseAiPatientCasePrompt:", error);

    return res.status(500).json({
      message: "Có lỗi khi AI phân tích yêu cầu.",
      error: error.message,
    });
  }
};