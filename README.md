# TalentFlow AI 🚀

TalentFlow AI is an intelligent, multi-tenant HR (Human Resources) platform designed to revolutionize recruitment and internal talent management. By integrating generative AI, it automates CV screening, generates complex administrative documents dynamically, and provides dedicated role-based dashboards.

## ✨ Features

* **Multi-Tenant Architecture**: Strict data isolation per company using Prisma ORM.
* **Role-Based Access Control (RBAC)**: Dedicated interfaces and permissions for HR, Managers, Employees, and Candidates.
* **AI-Powered CV Screening**: Integration with Groq (Llama 3) for deep candidate analysis, scoring, and matching.
* **Automated Document Generation**: Dynamic generation of complex HR forms (e.g., Auto Nejma use-case) with print-to-PDF capabilities.
* **Dynamic Dashboards**: Pipeline visualization, 9-Box Matrix for talent management, and personalized job recommendations.

## 🛠️ Tech Stack

### Frontend
* React.js (TypeScript)
* Vite
* Tailwind CSS
* Lucide React (Icons)
* Axios

### Backend
* Node.js & Express
* Prisma ORM
* SQLite (Development) / PostgreSQL (Production)
* JWT Authentication
* Groq SDK (Llama 3 Model)

## 📦 Installation & Setup

### Prerequisites
Make sure you have Node.js (v18+) and npm installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/naoualhoussni/talentflow.git
cd talentflow
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory based on the `.env.example` structure:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-key"
PORT=5000
GROQ_API_KEY="your-groq-api-key"
```
Run the database setup and seed the mock data:
```bash
npx prisma db push
npm run seed
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```
Start the Vite development server:
```bash
npm run dev
```

## 🔑 Test Credentials (Demo)

Once both servers are running, you can log in at `http://localhost:5173/login` using the seeded accounts (Password for all accounts is `password123`):

* **HR Manager**: `rh@techflow.ai`
* **Candidate**: `candidate@techflow.ai`
* **Employee**: `employee@techflow.ai`
* **Admin**: `admin@techflow.ai`

## 🔒 Security

Sensitive files such as `.env` containing API keys and the local `dev.db` database are ignored via `.gitignore` to prevent secret leaks.

---
*Developed as a full-stack SaaS project.*
