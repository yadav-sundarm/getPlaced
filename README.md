# GetPlaced 🎯

> An all-in-one AI-powered placement preparation platform built for students at VESIT. GetPlaced helps you practice DSA, sharpen aptitude, ace mock interviews with real-time AI feedback, analyze your resume, and collaborate with peers through group discussions — all in one place.

🔗 **Live Demo:** [your-live-link-here](https://your-live-link-here.com)

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#️-getting-started)
- [API Routes](#-api-routes)
- [Authentication](#-authentication)
- [Screenshots](#-screenshots)
- [Contributors](#contributors)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🤖 AI Mock Interviews
- Practice interviews for companies that actively recruit at VESIT (Saint Gobain, Accenture, Clariant, Nomura, Erutech, and more).
- Questions are company-specific and grounded in real data — seniors' interview experience PDFs are parsed by Gemini AI and seeded into the database by the admin, ensuring every mock interview reflects questions previously asked by that company.
- Select your interview type — **Technical**, **HR**, or **Mixed** — and answer questions via voice; **AssemblyAI** transcribes responses in real time.
- Timed interview sessions with tab-switch detection to simulate real proctored interview conditions.
- **Google Gemini** evaluates your interview and provides an overall score, communication score, technical score, confidence score, strengths, weaknesses, and personalized improvement suggestions.

### 💻 DSA Practice
- Browse 335+ problems organized by topic — Arrays, Hash Tables, Linked Lists, Math, Recursion, Strings, Sliding Window, Binary Search, Divide and Conquer, and more
- In-browser **Monaco code editor** with support for Java, Python, and JavaScript
- Run your code securely via the **JDoodle Compiler API**
- Get instant **AI code review** powered by Gemini with complexity analysis and improvement tips

### 📐 Aptitude Practice
- Three categories: Quantitative Aptitude, Logical Reasoning, and Computer Aptitude
- Timed mock tests with tab-switch detection to simulate real exam conditions
- Full mock test mode covering all three categories in one sitting
- Instant aptitude score on submission.
  
### 📄 Resume Analyzer
- Upload your resume (PDF, DOC, DOCX) and get an **ATS Compatibility Score out of 100**
- High-impact and medium-impact suggestions with before/after rewrites powered by Gemini AI
- Files handled server-side via **Multer** (local/in-memory processing)

### 👥 Group Discussion (Video Meet)
- Create or join a meeting room with a unique code
- Real-time video and audio conferencing via **WebRTC + Socket.IO**
- Practice GD rounds with peers before the actual placement rounds

### 🏆 Experience Share
- Share your real interview experiences (company, role, year, difficulty, result, round-wise questions)
- Admin-moderated — submissions go through approval before being published
- Helps juniors prepare with real company-specific questions

### 🛠️ Admin Panel
- Admin is a regular user account with `role: "admin"` — no separate model or login flow
- Admins can review, approve, or reject student-submitted interview experiences with optional notes
- Upload PDF experience letters directly — Gemini AI parses them and seeds questions into the mock interview database automatically
- Dashboard overview with stats: pending reviews, approved, rejected, and total companies in DB

### 📊 Student Dashboard
- Personalized welcome with your Aptitude Score, DSA Solved count, and Communication Score
- Quick action buttons to jump to any section
- Recent activity feed showing your latest practice sessions

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, React Router v7, MUI (Material UI), TanStack Query |
| **Backend** | Node.js, Express 5, ES Modules |
| **Database** | MongoDB with Mongoose |
| **Real-time** | Socket.IO (video meet & GD rooms) |
| **AI / ML** | Google Gemini (`@google/genai`) — interview evaluation, DSA feedback, resume analysis, PDF parsing |
| **Speech-to-Text** | AssemblyAI — real-time voice transcription in mock interviews |
| **Code Execution** | JDoodle Compiler API — remote sandboxed execution for 110+ languages |
| **Code Editor** | Monaco Editor (`@monaco-editor/react`) |
| **File Handling** | Multer — in-memory file processing for resume uploads |
| **Auth** | JWT + bcrypt |

---

## 📁 Project Structure

```
getPlaced/
├── Frontend/
│   ├── src/
│   │   ├── api/               # API configuration
│   │   ├── assets/            # Images & static assets
│   │   ├── components/
│   │   │   ├── auth/          # ProtectedRoute, AdminRoute
│   │   │   ├── common/        # Reusable UI components
│   │   │   └── layout/        # Sidebar, Header, Layout
│   │   ├── pages/
│   │   │   ├── admin/         # Admin panel pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MockInterview.jsx
│   │   │   ├── MockInterviewSetup.jsx
│   │   │   ├── ResumeAnalyzer.jsx
│   │   │   ├── GroupDiscussion.jsx
│   │   │   ├── AptitudePractice.jsx
│   │   │   ├── DSAPractice.jsx
│   │   │   ├── DsaReview.jsx
│   │   │   ├── ExperienceShare.jsx
│   │   │   ├── VideoMeet.jsx
│   │   │   └── ...
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── Backend/
    ├── config/                # Environment configuration
    ├── controllers/           # Route handler logic
    ├── db/                    # MongoDB connection
    ├── middlewares/           # Authentication & file upload
    ├── models/                # Mongoose schemas
    ├── routes/                # Express route definitions
    ├── services/              # Gemini AI & AssemblyAI integrations
    ├── utils/                 # Helpers, JWT & error handling
    ├── aptitudeData/          # Aptitude questions dataset
    ├── dsaData/               # 335+ DSA problems dataset
    ├── uploads/               # Uploaded resumes & other files
    ├── server.js              # Application entry point
    └── package.json
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- API keys for: Google Gemini, AssemblyAI, JDoodle

### 1. Clone the repository

```bash
git clone https://github.com/yadav-sundarm/getPlaced.git
cd getPlaced
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` directory:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret

# Gemini AI (separate keys per feature, or reuse one)
GEMINI_RESUME_ANALYZER_API_KEY=your_gemini_api_key
GEMINI_MOCK_INTERVIEW_API_KEY=your_gemini_api_key
GEMINI_EVALUATION_API_KEY=your_gemini_api_key
GEMINI_EXPERIENCE_PDF_API_KEY=your_gemini_api_key

# AssemblyAI (real-time voice transcription in mock interviews)
ASSEMBLYAI_API_KEY=your_assemblyai_api_key

# JDoodle (remote code execution for DSA practice)
JDOODLE_CLIENT_ID=your_jdoodle_client_id
JDOODLE_CLIENT_SECRET=your_jdoodle_client_secret

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm start
```

> The server runs on `http://localhost:8000` and will auto-seed aptitude and DSA questions on first startup.

### 3. Frontend Setup

```bash
cd ../Frontend
npm install
npm run dev
```

> The frontend runs on `http://localhost:5173`.

---

## 📡 API Routes

All backend routes are served from `http://localhost:8000`.

### 👤 Users — `/api/users`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/signup` | Register a new student account |
| `POST` | `/login` | Log in and receive a JWT token |
| `POST` | `/logout` | Log out the current user |
| `GET` | `/dashboard-stats` | Get personalized dashboard stats |

### 🤖 Mock Interviews — `/api/companies`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Get all available companies for mock interviews |
| `POST` | `/start` | Start a mock interview session (returns questions) |
| `POST` | `/evaluate` | Submit interview responses for AI evaluation (`multipart/form-data`) |

### 💻 DSA — `/api/dsa`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/get-dsa-topics` | Get all DSA topic categories |
| `POST` | `/get-topic-wise-dsa-questions` | Get paginated questions for a specific topic |
| `GET` | `/get-single-dsa-question` | Get a single DSA problem by ID |
| `POST` | `/run-code` | Execute code via JDoodle Compiler API |
| `POST` | `/get-review` | Get AI-powered code review via Gemini |
| `GET` | `/get-solved-questions` | Get list of questions solved by the user |

### 📄 Resume — `/api/resume`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/analyze` | Upload a resume and get ATS score + suggestions |

> Accepts `multipart/form-data` with field name `file`. Files are processed in-memory via Multer.

### 📐 Aptitude — `/api/aptitude-questions`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/get-mock-questions` | Get a full mixed aptitude mock test |
| `GET` | `/get-math-questions` | Get quantitative aptitude questions |
| `GET` | `/get-logical-questions` | Get logical reasoning questions |
| `GET` | `/get-computer-questions` | Get computer aptitude questions |
| `POST` | `/submit-test` | Submit answers and get score |

### 🏆 Experience Share — `/api/experience`

> All routes require JWT authentication.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/submit` | Submit a new interview experience (pending admin approval) |

### 🛠️ Admin — `/api/admin`

> All routes require authentication **and** admin role.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/stats` | Dashboard overview stats |
| `GET` | `/submissions` | List all submissions (filter by `?status=pending\|approved\|rejected\|all`) |
| `GET` | `/submissions/:id` | Get a single submission by ID |
| `PATCH` | `/submissions/:id/approve` | Approve a student submission |
| `PATCH` | `/submissions/:id/reject` | Reject a submission with a note |
| `POST` | `/upload-pdf` | Upload a PDF — Gemini AI parses and seeds to DB |

---

## 🔐 Authentication

- Students register and log in using email and password (JWT-based authentication).
- Admin access is determined by the user's `role` (`student` by default, `admin` for privileged accounts).
- Protected routes require a valid JWT token; admin routes additionally verify the user's `role`.

---

## 📸 Screenshots

### 📊 Dashboard & Account Settings

![Dashboard](https://github.com/user-attachments/assets/21bae569-dced-47a2-a670-3b7c5efbb7b9)
![Account Settings](https://github.com/user-attachments/assets/b0c65a90-ac5a-47b2-a27e-28d68c4698a0)
![Settings](https://github.com/user-attachments/assets/522f3fec-cde6-4710-a433-490887de5a05)

---

### 🤖 Mock Interview

![Mock Interview 1](https://github.com/user-attachments/assets/5adb4b3c-7407-45ce-a0cb-3f6d07f052b7)
![Mock Interview 2](https://github.com/user-attachments/assets/d0dfcc88-0c74-4e8c-951d-c51a3cf7f809)
![Mock Interview 3](https://github.com/user-attachments/assets/393c2049-003a-4b51-bd3e-25ab9b0cc141)
![Mock Interview 4](https://github.com/user-attachments/assets/753bd7a4-9325-4945-9154-a0a2b755a060)
![Mock Interview 5](https://github.com/user-attachments/assets/b238883c-36ec-4297-801e-d3a723c3494b)
![Mock Interview 6](https://github.com/user-attachments/assets/19490969-2f35-44eb-80d7-ff1e0a6d6bb6)

---

### 💻 DSA Practice

![DSA Practice 1](https://github.com/user-attachments/assets/556b230b-098c-4264-bcdf-523e8714f417)
![DSA Practice 2](https://github.com/user-attachments/assets/6669212c-6457-475d-8da3-7f00cd5b80f4)
![DSA Practice 3](https://github.com/user-attachments/assets/0b5ea316-2848-4201-8858-ff8a6b2e643b)
![DSA Practice 4](https://github.com/user-attachments/assets/152faedd-5e79-4be4-a186-f84f716abd4a)

---

### 📐 Aptitude Practice

![Aptitude 1](https://github.com/user-attachments/assets/3f0b274d-06cc-47bb-a45e-de6bf6bc5f80)
![Aptitude 2](https://github.com/user-attachments/assets/b9fb99d3-b453-4776-8f8c-ccecb9528f2f)
![Aptitude 3](https://github.com/user-attachments/assets/d677940c-5211-4b9f-b039-fe4b05f4088e)
![Aptitude 4](https://github.com/user-attachments/assets/10c38b3a-4c97-4014-8ab7-e16071f9390a)
![Aptitude 5](https://github.com/user-attachments/assets/d879b018-f727-4957-bad6-0da2291799b7)

---

### 📄 Resume Analysis

![Resume Analysis 1](https://github.com/user-attachments/assets/d12daa89-a3c0-42b0-b031-587f99d703dc)
![Resume Analysis 2](https://github.com/user-attachments/assets/c75a3bbb-0ca8-4ea7-87b2-a48551b4e3de)
![Resume Analysis 3](https://github.com/user-attachments/assets/96988592-a577-43b7-bc85-7de47ebf49ed)

---

### 👥 Group Discussion (GD)

![Group Discussion 1](https://github.com/user-attachments/assets/d28710e1-3e47-454c-88c6-1861f03f33f5)
![Group Discussion 2](https://github.com/user-attachments/assets/5097b6fe-0109-45b0-8905-9946b2b436cf)

---

### 🏆 Share Experience

![Share Experience 1](https://github.com/user-attachments/assets/5a3a1623-adff-41c3-85f7-b9de887e92ea)
![Share Experience 2](https://github.com/user-attachments/assets/f722e027-1a9f-446a-adf3-be65985567a4)
![Share Experience 3](https://github.com/user-attachments/assets/adcb8052-6a19-4bcd-975b-d6da094111a9)

---

### 🛠️ Admin Panel

![Admin Panel 1](https://github.com/user-attachments/assets/82147e71-35d2-459f-9dba-55b665cb0d37)
![Admin Panel 2](https://github.com/user-attachments/assets/9146458d-d82e-4a42-b5e8-59968fe35367)
![Admin Panel 3](https://github.com/user-attachments/assets/be39dee9-e35d-4951-9d55-96252bbe615d)

---

## Contributors

This project was built collaboratively by a team of developers from VESIT.

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/yadav-sundarm">
        <img src="https://github.com/yadav-sundarm.png" width="80px" alt="Sundarm Yadav"/><br />
        <sub><b>Sundarm Yadav</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/supriyakushwaha27">
        <img src="https://github.com/supriyakushwaha27.png" width="80px" alt="Supriya Kushwaha"/><br />
        <sub><b>Supriya Kushwaha</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Dhruv13g45">
        <img src="https://github.com/Dhruv13g45.png" width="80px" alt="Dhruv Goradia"/><br />
        <sub><b>Dhruv Goradia</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/druv200">
        <img src="https://github.com/druv200.png" width="80px" alt="druv200"/><br />
        <sub><b>druv200</b></sub>
      </a>
    </td>
  </tr>
</table>

---

## 🤝 Contributing

Want to improve GetPlaced? Contributions are welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  <p>Built with ❤️ by the GetPlaced team for VESIT placement aspirants.</p>
</div>
