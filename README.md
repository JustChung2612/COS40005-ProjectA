<p align="center">
  <img src="https://img.shields.io/badge/Medic6-OSCE%20Exam%20Platform-14b8a6?style=for-the-badge&logo=react&logoColor=white" alt="Medic 6 Banner" />
</p>

# 🩺 Medic 6 — OSCE Exam Platform

A full-stack system for **creating, managing, and conducting online OSCE (Objective Structured Clinical Examination)** sessions for medical universities.  
Teachers can build exam rooms with patient cases, and students can take virtual station-based exams filtered by their department.

---

## 🧰 Tech Stack

| Layer | Technology |
|:------|:------------|
| 🖥️ **Frontend** | React (Vite), Zustand, Axios, React Router, SCSS |
| ⚙️ **Backend** | Node.js, Express.js |
| 🗄️ **Database** | MongoDB (Mongoose ORM) |
| 🔐 **Auth / Tokens** | JWT + Redis (for refresh token storage) |

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/COS40005-SUVHN/capstone-project-a-hn1-1.git
cd medic6

🧭 Project Workflow Overview
🧩 Teacher Workflow (Admin Panel)

👨‍🏫 Teachers log into the Admin Panel (/quan-tri) →
Create new exam rooms through the “Tạo Phòng” popup →
Drag and drop patient cases into each exam station →
Add multiple stations (➕ Trạm) as needed, each containing one or more cases →
Save and publish the exam room (🚀 Phát Đề Thi) →
Students in the matching department will automatically see these published rooms on their homepage.

Once published, teachers can edit or delete stations, update room information, or monitor configuration through the Exam Room List section.


👩‍⚕️ Student Workflow

👩‍⚕️ Students register or log in with their details (name, class, and department) →
After login, the Home Page displays only exam rooms related to their department →
They can either:

Enter a room code manually (🔢), or

Click “Bắt đầu vào thi” on an available exam card (🎓).

Upon joining, the system retrieves the corresponding Exam Room and its ordered list of stations →
The student enters the first station page (/osce/tram/:id) →
Views patient information, clinical history, and questions →
Completes the station within a timed session ⏱ →
Moves forward with “Trạm Kế Tiếp” →
When the final station is finished, the button changes to “Kết thúc” 🏁, returning the student to the homepage (or later, a results page).