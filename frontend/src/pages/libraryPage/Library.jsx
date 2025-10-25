import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Shuffle, Clock, Users, FileText } from "lucide-react";
import "./library.scss";

/* ===== Nhãn hiển thị ===== */
const specialtyLabels = {
  "Internal Medicine": "Nội khoa",
  Surgery: "Ngoại khoa",
  Pediatrics: "Nhi khoa",
  Obstetrics: "Sản khoa",
  Psychiatry: "Tâm thần",
};
const stationTypeLabels = {
  History: "Khai thác bệnh sử",
  Examination: "Khám lâm sàng",
  Plan: "Kế hoạch điều trị",
};
const difficultyLabels = {
  Beginner: "Mới bắt đầu",
  Intermediate: "Trung bình",
  Advanced: "Nâng cao",
};
const genderLabels = {
  Male: "Nam",
  Female: "Nữ",
  "Non-binary": "Phi nhị nguyên",
};

/* ========== Local UI primitives ========== */
const Input = ({ className = "", ...props }) => (
  <input className={["ui-input", className].join(" ")} {...props} />
);

const Button = ({ children, variant = "default", size = "md", className = "", ...props }) => {
  const cls = ["ui-btn", `ui-btn--${variant}`, `ui-btn--${size}`, className].join(" ");
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
};

const Badge = ({ children, variant = "outline", className = "", ...props }) => {
  return (
    <span className={["ui-badge", `ui-badge--${variant}`, className].join(" ")} {...props}>
      {children}
    </span>
  );
};

const Card = ({ className = "", ...props }) => <div className={["ui-card", className].join(" ")} {...props} />;
const CardHeader = ({ className = "", ...props }) => <div className={["ui-card__header", className].join(" ")} {...props} />;
const CardTitle = ({ className = "", ...props }) => <h3 className={["ui-card__title", className].join(" ")} {...props} />;
const CardDescription = ({ className = "", ...props }) => <p className={["ui-card__desc", className].join(" ")} {...props} />;
const CardContent = ({ className = "", ...props }) => <div className={["ui-card__content", className].join(" ")} {...props} />;

/* ========== CaseCard ========== */
const CaseCard = ({
  id,
  title,
  description,
  specialty,
  difficulty,
  duration,
  stationType,
  patientAge,
  patientGender,
}) => {
  const difficultyColors = {
    Beginner: "badge-beginner",
    Intermediate: "badge-intermediate",
    Advanced: "badge-advanced",
  };
  const stationColors = {
    History: "station-history",
    Examination: "station-exam",
    Plan: "station-plan",
  };

  return (
    <Card className="group case-card">
      <CardHeader className="pb-3">
        <div className="case-card__top">
          <div className="space-y-1">
            <CardTitle className="group-hover:text-primary transition-colors">{title}</CardTitle>
            <CardDescription className="text-sm">{description}</CardDescription>
          </div>
          <Badge className={["font-medium", stationColors[stationType]].join(" ")}>
            {stationTypeLabels[stationType] || stationType}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="case-card__meta">
          <div className="meta-pair">
            <Clock className="i" />
            <span>{duration} phút</span>
          </div>
          <div className="meta-pair">
            <Users className="i" />
            <span>
              {patientAge} tuổi • {genderLabels[patientGender] || patientGender}
            </span>
          </div>
          <div className="meta-pair">
            <FileText className="i" />
            <span>{specialtyLabels[specialty] || specialty}</span>
          </div>
        </div>

        <div className="case-card__actions">
          <Badge variant="outline" className={["no-border", difficultyColors[difficulty]].join(" ")}>
            {difficultyLabels[difficulty] || difficulty}
          </Badge>

          <Link to={`/stations/${id}/intro`}>
            <Button size="sm" className="font-medium">Bắt đầu</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

/* ========== Dữ liệu gốc (giữ giá trị tiếng Anh để filter), chỉ content hiển thị đã dịch thông qua label map ========== */
const specialties = ["Internal Medicine", "Surgery", "Pediatrics", "Obstetrics", "Psychiatry"];
const stationTypes = ["History", "Examination", "Plan"];
const mockCases = [
  {
    id: "case-1",
    title: "Đau bụng cấp",
    description: "Nữ 25 tuổi đau bụng hố chậu phải, sốt nhẹ.",
    specialty: "Internal Medicine",
    difficulty: "Intermediate",
    duration: 15,
    stationType: "History",
    patientAge: 25,
    patientGender: "Female",
  },
  {
    id: "case-2",
    title: "Chấn thương bàn tay",
    description: "Nam 30 tuổi, vết rách bàn tay do tai nạn lao động.",
    specialty: "Surgery",
    difficulty: "Beginner",
    duration: 12,
    stationType: "Examination",
    patientAge: 30,
    patientGender: "Male",
  },
  {
    id: "case-3",
    title: "Ho khò khè ở trẻ",
    description: "Trẻ 5 tuổi ho khò khè, khó thở từng cơn.",
    specialty: "Pediatrics",
    difficulty: "Advanced",
    duration: 10,
    stationType: "Plan",
    patientAge: 5,
    patientGender: "Male",
  },
  {
    id: "case-4",
    title: "Ho khò khè ở trẻ",
    description: "Trẻ 5 tuổi ho khò khè, khó thở từng cơn.",
    specialty: "Pediatrics",
    difficulty: "Advanced",
    duration: 10,
    stationType: "Plan",
    patientAge: 5,
    patientGender: "Male",
  },
  {
    id: "case-5",
    title: "Ho khò khè ở trẻ",
    description: "Trẻ 5 tuổi ho khò khè, khó thở từng cơn.",
    specialty: "Pediatrics",
    difficulty: "Advanced",
    duration: 10,
    stationType: "Plan",
    patientAge: 5,
    patientGender: "Male",
  },
  {
    id: "case-6",
    title: "Ho khò khè ở trẻ",
    description: "Trẻ 5 tuổi ho khò khè, khó thở từng cơn.",
    specialty: "Pediatrics",
    difficulty: "Advanced",
    duration: 10,
    stationType: "Plan",
    patientAge: 5,
    patientGender: "Male",
  },
];

/* ========== Trang Library ========== */
const Library = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedStationType, setSelectedStationType] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  const filteredCases = mockCases.filter((c) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.specialty.toLowerCase().includes(q);

    const matchesSpecialty = !selectedSpecialty || c.specialty === selectedSpecialty;
    const matchesStationType = !selectedStationType || c.stationType === selectedStationType;
    const matchesDifficulty = !selectedDifficulty || c.difficulty === selectedDifficulty;

    return matchesSearch && matchesSpecialty && matchesStationType && matchesDifficulty;
  });

  const clearFilters = () => {
    setSelectedSpecialty(null);
    setSelectedStationType(null);
    setSelectedDifficulty(null);
    setSearchTerm("");
  };

  return (
    <div className="library">
      <div className="container">
        {/* Header */}
        <div className="lib-header">
          <h1 className="lib-title">Thư viện</h1>
          <p className="lib-sub">Chọn một ca bệnh để luyện tập kỹ năng lâm sàng của bạn</p>
        </div>

        {/* Search & Filters */}
        <div className="lib-controls">
          {/* Search */}
          <div className="search">
            <Search className="search__icon" />
            <Input
              placeholder="Tìm theo chuyên khoa, chủ đề hoặc triệu chứng…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search__input"
            />
          </div>

          {/* Specialty */}
          <div className="filter">
            <div className="filter__label">
              <Filter className="i" />
              <span>Chuyên khoa</span>
            </div>
            <div className="filter__chips">
              {specialties.map((sp) => (
                <Badge
                  key={sp}
                  variant={selectedSpecialty === sp ? "solid" : "outline"}
                  className="chip"
                  onClick={() => setSelectedSpecialty(selectedSpecialty === sp ? null : sp)}
                >
                  {specialtyLabels[sp] || sp}
                </Badge>
              ))}
            </div>
          </div>

          {/* Station type + Difficulty */}
          <div className="flex-row">
            <div className="filter">
              <div className="filter__label">Loại trạm</div>
              <div className="filter__chips">
                {stationTypes.map((type) => (
                  <Badge
                    key={type}
                    variant={selectedStationType === type ? "solid" : "outline"}
                    className="chip"
                    onClick={() => setSelectedStationType(selectedStationType === type ? null : type)}
                  >
                    {stationTypeLabels[type] || type}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="filter">
              <div className="filter__label">Độ khó</div>
              <div className="filter__chips">
                {["Beginner", "Intermediate", "Advanced"].map((lv) => (
                  <Badge
                    key={lv}
                    variant={selectedDifficulty === lv ? "solid" : "outline"}
                    className="chip"
                    onClick={() => setSelectedDifficulty(selectedDifficulty === lv ? null : lv)}
                  >
                    {difficultyLabels[lv] || lv}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="controls__bar">
            <div className="controls__left">
              <Button variant="outline" onClick={clearFilters}>Xoá bộ lọc</Button>
              <Button variant="outline">
                <Shuffle className="i" />
                Ngẫu nhiên
              </Button>
            </div>
            <div className="controls__right">
              <span className="muted">{filteredCases.length} ca phù hợp</span>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid">
          {filteredCases.map((c) => (
            <CaseCard key={c.id} {...c} />
          ))}
        </div>

        {/* Empty state */}
        {filteredCases.length === 0 && (
          <div className="empty">
            <Search className="empty__icon" />
            <p className="empty__title">Không tìm thấy ca bệnh phù hợp</p>
            <p className="empty__sub">Hãy điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
            <Button variant="outline" onClick={clearFilters}>Xoá tất cả bộ lọc</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
