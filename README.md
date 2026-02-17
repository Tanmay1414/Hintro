🚀 Hintro – Real-Time Collaborative Task Platform

Hintro is a full-stack real-time task management platform inspired by Trello and Notion.
It enables users to create boards, manage lists and tasks with drag-and-drop functionality, and collaborate in real time using WebSockets.

The application demonstrates scalable architecture, clean UI design, and seamless frontend-backend integration.

🌟 Live Features
🔐 Authentication

Secure authentication using Clerk

Modal-based Sign In / Sign Up

Protected routes

Session management

📋 Boards, Lists & Tasks

Create multiple boards

Create and manage lists within boards

Create, update, delete tasks

Task ordering support

🔄 Real-Time Updates

Powered by Socket.io

Live task creation, updates & deletion

Board room-based WebSocket architecture

🎯 Drag & Drop

Implemented using @hello-pangea/dnd

Reorder tasks within lists

Move tasks across lists

Backend order persistence

📊 Activity Log

Real-time activity tracking per board

Clear activity option with confirmation modal

🎨 UI/UX Enhancements

Modern glassmorphism-inspired UI

Tailwind CSS styling

Animated gradient background

Custom board covers (colors & images)

Responsive layout

🛠 Tech Stack
Frontend

React (Vite)

Tailwind CSS

Clerk Authentication

Zustand (State Management)

Socket.io Client

@hello-pangea/dnd

React Router DOM

Backend

Node.js

Express.js

MongoDB

Mongoose

Socket.io

RESTful APIs

🏗 Architecture Overview
🔹 Frontend Architecture

Component-based modular structure

Global auth handled via Clerk Provider

Drag & drop state synchronized with backend

Axios-based API service layer

Real-time socket connection per board room

🔹 Backend Architecture

REST API for CRUD operations

MongoDB schema-based data modeling

Socket.io server for real-time sync

Board-based room joining for scoped updates

🗄 Database Schema Overview
Board

title

coverImage

coverColor

createdBy

List

title

boardId

Task

title

description

listId

boardId

order

Activity

message

boardId

createdAt

📂 Project Structure
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

⚙️ Setup Instructions
1️⃣ Clone Repository
git clone https://github.com/Tanmay1414/Hintro.git
cd Hintro

2️⃣ Backend Setup
cd backend
npm install
npm run dev


Make sure to configure:

MongoDB connection string

Environment variables

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Add .env file inside frontend:

VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key_here

🔐 Demo Credentials (If Required)

You may create a new user using Clerk Sign Up.

📈 Key Implementation Highlights

Real-time synchronization using WebSockets

Optimistic UI updates

Drag-and-drop with backend persistence

Modular scalable project structure

Clean modern UI with responsive design

Proper route protection & authentication flow

👨‍💻 Author

Tanmay Bansal
Full Stack Developer | MERN Stack | Real-Time Systems
GitHub: https://github.com/Tanmay1414