<div align="center">
	<h1>🚀 Hintro</h1>
	<p><b>Real-Time Collaborative Task Platform</b></p>
	<p>
		<a href="https://github.com/Tanmay1414/Hintro"><img src="https://img.shields.io/github/stars/Tanmay1414/Hintro?style=social" alt="GitHub stars"></a>
		<a href="https://github.com/Tanmay1414/Hintro"><img src="https://img.shields.io/github/forks/Tanmay1414/Hintro?style=social" alt="GitHub forks"></a>
		<a href="https://github.com/Tanmay1414/Hintro/blob/main/LICENSE"><img src="https://img.shields.io/github/license/Tanmay1414/Hintro" alt="License"></a>
	</p>
</div>

> Hintro is a full-stack real-time task management platform inspired by Trello and Notion. It enables users to create boards, manage lists and tasks with drag-and-drop functionality, and collaborate in real time using WebSockets.

---

## ✨ Features

- **Authentication**: Secure Clerk-based auth, modal sign in/up, protected routes
- **Boards, Lists & Tasks**: Create boards, manage lists, CRUD tasks, drag-and-drop ordering
- **Real-Time Updates**: Live sync via Socket.io, board room-based WebSocket architecture
- **Drag & Drop**: Move/reorder tasks with @hello-pangea/dnd, backend order persistence
- **Activity Log**: Real-time activity tracking, clear activity option
- **Modern UI/UX**: Glassmorphism-inspired, Tailwind CSS, animated backgrounds, custom covers, responsive

---

## 🛠 Tech Stack

**Frontend:**

- React (Vite)
- Tailwind CSS
- Clerk Authentication
- Zustand (State Management)
- Socket.io Client
- @hello-pangea/dnd
- React Router DOM

**Backend:**

- Node.js
- Express.js
- MongoDB & Mongoose
- Socket.io
- RESTful APIs

---

## 🏗 Architecture Overview

**Frontend:**

- Modular component-based structure
- Clerk Provider for global auth
- Drag & drop state sync with backend
- Axios-based API service
- Real-time socket connection per board

**Backend:**

- REST API for CRUD
- MongoDB schema-based models
- Socket.io for real-time sync
- Board-based room joining for scoped updates

---

## 🗄 Database Schema Overview

**Board**: `title`, `coverImage`, `coverColor`, `createdBy`

**List**: `title`, `boardId`

**Task**: `title`, `description`, `listId`, `boardId`, `order`

**Activity**: `message`, `boardId`, `createdAt`

---

## 📂 Project Structure

```
Hintro/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── socket/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── store/
│   ├── services/
│   └── socket/
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Tanmay1414/Hintro.git
cd Hintro
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

Configure your MongoDB connection string and environment variables in `.env`.

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Add a `.env` file inside `frontend/`:

```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
```

---

## 🔐 Demo Credentials

Sign up with Clerk or use your own credentials.

---

## 📈 Key Implementation Highlights

- Real-time sync with WebSockets
- Optimistic UI updates
- Drag-and-drop with backend persistence
- Modular, scalable project structure
- Clean, modern, responsive UI
- Route protection & authentication

---

## 👨‍💻 Author

**Tanmay Bansal**  
Full Stack Developer | MERN Stack | Real-Time Systems  
[GitHub: Tanmay1414](https://github.com/Tanmay1414)
