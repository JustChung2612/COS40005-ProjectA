import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AiPatientListTab.scss";

const mockStations = [
  // History
  { id: "1", title: "Abdominal pain 01", category: "History", thumbnail: "pink", diagnosis: "Gastritis", createdAt: "2025-01-10" },
  { id: "2", title: "Abdominal pain 09", category: "History", thumbnail: "dark", diagnosis: "Appendicitis", createdAt: "2025-03-02" },
  { id: "3", title: "Abdominal pain 10", category: "History", thumbnail: "dark", diagnosis: "Peptic ulcer", createdAt: "2025-02-12" },
  { id: "4", title: "Chest pain 01", category: "History", thumbnail: "pink", diagnosis: "Angina", createdAt: "2024-12-21" },
  { id: "5", title: "Headache 02", category: "History", thumbnail: "dark", diagnosis: "Migraine", createdAt: "2025-04-18" },
  { id: "6", title: "Back pain 03", category: "History", thumbnail: "pink", diagnosis: "Sciatica", createdAt: "2025-05-01" },

  // Counselling
  { id: "7", title: "Smoking cessation 01", category: "Counselling", thumbnail: "pink", diagnosis: "—", createdAt: "2025-01-28" },
  { id: "8", title: "Diabetes lifestyle 02", category: "Counselling", thumbnail: "dark", diagnosis: "—", createdAt: "2025-02-20" },

  // Examination
  { id: "9", title: "Abdominal exam 01", category: "Examination", thumbnail: "dark", diagnosis: "—", createdAt: "2025-03-25" },
  { id: "10", title: "Cardiovascular exam 02", category: "Examination", thumbnail: "pink", diagnosis: "—", createdAt: "2025-04-05" },
];

const filterCategories = ["History", "Counselling", "Examination"];

function compareBySort(a, b, sortOrder) {
  if (sortOrder === "A–Z") return a.title.localeCompare(b.title);
  if (sortOrder === "Z–A") return b.title.localeCompare(a.title);
  // Newest
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

function pickRandomFrom(list) {
  if (!list.length) return null;
  const idx = Math.floor(Math.random() * list.length);
  return list[idx];
}

export default function AiPatientListTab({ onOpenStation }) {

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("History");
  const [diagnosisEnabled, setDiagnosisEnabled] = useState(false);
  const [sortOrder, setSortOrder] = useState("A–Z");
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  const toggleBookmark = (id) => {
    setBookmarkedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const filteredStations = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    const base = mockStations.filter((s) => {
      const matchesCategory = s.category === selectedCategory;
      const matchesSearch = !q || s.title.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });

    return [...base].sort((a, b) => compareBySort(a, b, sortOrder));
  }, [searchTerm, selectedCategory, sortOrder]);

  const stationsInSelectedCategory = useMemo(
    () => mockStations.filter((s) => s.category === selectedCategory),
    [selectedCategory],
  );

  const handleRandom = (scope) => {
    const list = scope === "all" ? mockStations : stationsInSelectedCategory;
    const chosen = pickRandomFrom(list);
    if (!chosen) return;

    if (onOpenStation) return onOpenStation(chosen.id);
    navigate(`/Ai-patient-detail/${chosen.id}`);
  };

  const handleOpenStation = (station) => {
    if (onOpenStation) return onOpenStation(station.id);
    navigate(`/Ai-patient-detail/${station.id}`);
  };

  return (
    <div className="aiPatient">
      <div className="aiPatient__container">
        <h1 className="aiPatient__title">OSCE station and virtual patient bank</h1>

        {/* Filters + actions */}
        <div className="toolbar">
          <div className="toolbar__left">
            {filterCategories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  className={`chip ${active ? "chip--active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  <span className="chip__text">{cat}</span>
                  {active && (
                    <span className="chip__chev" aria-hidden="true">
                      <svg viewBox="0 0 20 20" width="14" height="14">
                        <path d="M5 7l5 6 5-6" fill="none" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>


        </div>

        {/* Options row */}
        <div className="optionsRow">
          <details className="dropdown">
            <summary className="dropdown__trigger">
              <span className="dropdown__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path
                    d="M16 3h5v5h-2V6.4l-3 3A8 8 0 0 1 4 12H2a10 10 0 0 0 15-4.2l2-2V8h2V3h-5v2Zm-8 18H3v-5h2v1.6l3-3A8 8 0 0 1 20 12h2a10 10 0 0 0-15 4.2l-2 2V16H3v5h5v-2Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <span>Random station</span>
              <span className="dropdown__chev" aria-hidden="true">
                <svg viewBox="0 0 20 20" width="14" height="14">
                  <path d="M5 7l5 6 5-6" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </span>
            </summary>

            <div className="dropdown__menu" role="menu">
              <button type="button" className="dropdown__item" onClick={() => handleRandom("all")}>
                Random from all
              </button>
              <button type="button" className="dropdown__item" onClick={() => handleRandom("category")}>
                Random from {selectedCategory}
              </button>
            </div>
          </details>

          <details className="dropdown">
            <summary className="dropdown__trigger">
              <span>{sortOrder}</span>
              <span className="dropdown__chev" aria-hidden="true">
                <svg viewBox="0 0 20 20" width="14" height="14">
                  <path d="M5 7l5 6 5-6" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </span>
            </summary>

            <div className="dropdown__menu" role="menu">
              <button type="button" className="dropdown__item" onClick={() => setSortOrder("A–Z")}>
                A–Z
              </button>
              <button type="button" className="dropdown__item" onClick={() => setSortOrder("Z–A")}>
                Z–A
              </button>
              <button type="button" className="dropdown__item" onClick={() => setSortOrder("Newest")}>
                Newest
              </button>
            </div>
          </details>

          <label className="toggle">
            <input
              className="toggle__input"
              type="checkbox"
              checked={diagnosisEnabled}
              onChange={(e) => setDiagnosisEnabled(e.target.checked)}
            />
            <span className="toggle__track" aria-hidden="true">
              <span className="toggle__thumb" />
            </span>
            <span className="toggle__label">Diagnosis</span>
          </label>
        </div>

        <div className="divider" />

        <h2 className="sectionTitle">{selectedCategory}</h2>

        <div className="cardGrid">
          {filteredStations.map((station) => {
            const isBookmarked = bookmarkedIds.includes(station.id);

            return (
              <div
                key={station.id}
                className="card"
                role="button"
                tabIndex={0}
                onClick={() => handleOpenStation(station)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleOpenStation(station);
                }}
              >
                <div className={`card__thumb ${station.thumbnail === "pink" ? "card__thumb--pink" : "card__thumb--dark"}`}>
                  <span className="card__tag">{station.category}</span>

                  <button
                    type="button"
                    className={`card__bookmark ${isBookmarked ? "card__bookmark--active" : ""}`}
                    aria-pressed={isBookmarked}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(station.id);
                    }}
                    title={isBookmarked ? "Remove bookmark" : "Bookmark"}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path
                        d="M7 4.5A2.5 2.5 0 0 1 9.5 2h5A2.5 2.5 0 0 1 17 4.5V22l-5-3-5 3V4.5Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>

                <div className="card__body">
                  <div className="card__title">{station.title}</div>
                  {diagnosisEnabled && (
                    <div className="card__meta">
                      <span className="card__metaLabel">Diagnosis:</span> {station.diagnosis}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredStations.length === 0 && (
          <div className="empty">
            No stations found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
}
