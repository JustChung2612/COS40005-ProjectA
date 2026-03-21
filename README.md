# 🩺 Medic 6 — OSCE Exam Platform

A full-stack web application for creating, managing, and conducting online OSCE (Objective Structured Clinical Examination) sessions for medical universities.  
The system supports both instructors and students through role-based interfaces and enables realistic station-based exam simulations.

---

## 🧰 Tech Stack

| Layer | Technology |
|:------|:------------|
| 🖥️ Frontend | React (Vite), Zustand, Axios, React Router, SCSS |
| ⚙️ Backend | Node.js, Express.js |
| 🗄️ Database | MongoDB (Mongoose) |
| 🔐 Authentication | JWT + Redis (refresh token storage) |

---

# 📘 User Manual

## 👨‍🏫 Teacher Workflow (Admin Panel)

1. Log in to the Admin Panel at `/quan-tri`
2. Create a new exam room using the “Tạo Phòng” feature
3. Add stations and assign patient cases
4. Arrange stations in the desired order
5. Publish the exam room (🚀 Phát Đề Thi)
6. Students from the corresponding department can access the room
7. Teachers can edit, delete, or monitor exam rooms at any time

---

## 👩‍⚕️ Student Workflow

1. Register or log in with personal details
2. The Home Page displays exam rooms matching the student’s department
3. Enter an exam by:
   - Inputting a room code, or  
   - Clicking “Bắt đầu vào thi”
4. Complete stations sequentially:
   - View patient case information
   - Answer questions within the time limit
   - Proceed using “Trạm Kế Tiếp”
5. After finishing the final station:
   - Click “Kết thúc”
   - Return to homepage or results page

---

# ⚙️ System Installation and Deployment Guide

## 1. Prerequisites

Ensure the following software is installed:

- Node.js (v16 or later recommended)
- npm
- MongoDB (local or MongoDB Atlas)
- Git
- MongoDB Compass (optional)

---

## 2. Clone the Repository

git clone <repository-link>  
cd <project-folder>

---

## 3. Install Dependencies

### Frontend

cd frontend  
npm install  
npm run dev  

Frontend runs at: http://localhost:5173

### Backend

cd backend  
npm install  
npm start  

Backend runs at: http://localhost:5000

---

## 4. Configure Environment Variables

Create a `.env` file in the backend directory:

MONGO_URL=mongodb://127.0.0.1:27017/Medic-OSCE  
ACCESS_TOKEN_SECRET=access_token_secret  
REFRESH_TOKEN_SECRET=refresh_token_secret  
GOOGLE_CLIENT_ID=your_google_client_id  

---

## 5. Database Setup

### Import Sample Data

1. Open MongoDB Compass  
2. Connect to localhost:27017  
3. Create or select database: Medic-OSCE  
4. Select collection: patientcases  
5. Add Data → Import JSON or CSV  
6. Import PatientCases.json  

---

# 🧠 System Architecture Overview

Frontend (React)  
↓  
Backend API (Express)  
↓  
MongoDB Database  

Authentication uses JWT tokens with Redis for refresh token storage.

---

# 🧪 Running the Application

1. Start the backend server  
2. Start the frontend development server  
3. Open the application in a browser  
4. Register teacher and student accounts  

---

# 📌 Notes and Limitations

- Designed for educational OSCE simulation
- Performance depends on dataset size
- MongoDB service must be running
- Internet required for external authentication services

---

# 📄 Documentation Deliverables

This README serves as:

✔ User Manual for instructors and students  
✔ System Installation Guide for developers and administrators  
✔ Technical overview of the application
