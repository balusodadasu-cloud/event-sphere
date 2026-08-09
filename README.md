# 🎓 Campus Connect – Smart College Event Management System

> **"One Campus. Every Event. Stay Connected."**

Campus Connect is a production-quality full-stack college event management platform that solves the problem of scattered event announcements by providing one centralized hub for students, faculty, and administrators to discover, register for, and manage college events.

---

## 📋 Table of Contents

- [Problem Statement](#problem-statement)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Seeding Demo Data](#seeding-demo-data)
- [API Overview](#api-overview)
- [User Roles & Permissions](#user-roles--permissions)
- [Demo Credentials](#demo-credentials)
- [Screenshots](#screenshots)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)

---

## 🚨 Problem Statement

In many colleges, event announcements are scattered across multiple WhatsApp groups. This leads to:

- Students missing important events
- Class Representatives manually forwarding messages to many groups
- Registration links and venue details being hard to find
- Reduced event participation due to communication gaps
- No centralized platform for faculty or coordinators to manage events

---

## ✅ Features

### For Students
- 🔍 **Discover Events** – Browse, search, and filter all campus events
- 📝 **One-Click Registration** – Register instantly with seat availability checks
- 📱 **QR Code** – Get a unique QR code for each registration (for attendance)
- 🔖 **Bookmark Events** – Save events to view later
- 🔔 **Notifications** – Real-time notifications for event updates, results, certificates
- 📅 **Calendar View** – View events on an interactive calendar
- 🏆 **Certificates** – Download participation/achievement certificates
- 📊 **Results** – View event results and rankings

### For Faculty & Coordinators
- ➕ **Create/Manage Events** – Full CRUD with image upload
- 📋 **Registration Management** – View and manage participant lists
- 📸 **Gallery Upload** – Add photos after events
- 🏅 **Publish Results** – Announce event winners
- 📜 **Issue Certificates** – Upload and distribute certificates
- 📣 **Send Notifications** – Broadcast announcements to students

### For Admins
- 📊 **Analytics Dashboard** – Charts for registrations, events, participation
- 👥 **User Management** – Manage students, faculty, coordinators
- 🏛️ **Club Management** – Create and manage college clubs
- 🛡️ **Complete Control** – Full access to all system features

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js 19 | UI Framework |
| Vite | Build Tool |
| Tailwind CSS v3 | Styling |
| React Router v6 | Client-side Routing |
| Axios | HTTP Client |
| Lucide React | Icon Library |
| Recharts | Analytics Charts |
| react-hot-toast | Toast Notifications |
| react-qr-code | QR Code Display |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Web Framework |
| MongoDB Atlas | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| multer | File Uploads |
| qrcode | QR Generation |
| helmet | Security Headers |
| morgan | HTTP Logging |

---

## 🏗️ Architecture

```
Campus Connect
├── Frontend (React/Vite)     → Vercel
│   └── src/
│       ├── pages/            # Route components
│       ├── components/       # Reusable UI components
│       ├── layouts/          # Layout wrappers
│       ├── services/         # Axios API calls
│       ├── context/          # React Context (Auth, Notifications)
│       ├── hooks/            # Custom React hooks
│       └── utils/            # Helpers, constants
│
└── Backend (Node/Express)    → Render/Railway
    ├── controllers/          # Business logic
    ├── models/               # Mongoose schemas
    ├── routes/               # Express routers
    ├── middleware/           # Auth, error handling
    ├── config/               # DB, Cloudinary setup
    ├── utils/                # QR, token, notification helpers
    └── seeders/              # Demo data seeding
```

---

## 📁 Folder Structure

```
EventSphere/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/        # Button, Modal, Spinner, etc.
│   │   │   ├── events/        # EventCard, EventGrid, etc.
│   │   │   ├── layout/        # Navbar, Footer, Layouts
│   │   │   └── notifications/ # NotificationBell, Item
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── admin/         # Admin dashboard pages
│   │   │   └── dashboard/     # Student dashboard pages
│   │   ├── services/
│   │   └── utils/
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── backend/
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── seeders/
    ├── utils/
    ├── .env.example
    └── server.js
```

---

## ⚙️ Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **MongoDB Atlas** account (free tier works) OR local MongoDB
- **Git**

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/campus-connect.git
cd campus-connect
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

Copy the example file:

```bash
cp backend/.env.example backend/.env
```

Then fill in your values:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/campus-connect
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

> ⚠️ **Never commit your `.env` file.** It's listed in `.gitignore`.

---

## ▶️ Running the Application

### Start the Backend

```bash
cd backend
npm run dev
```

Backend runs at: `http://localhost:5000`

Health check: `GET http://localhost:5000/api/health`

### Start the Frontend

```bash
cd frontend
npm run dev
```

Frontend runs at: `http://localhost:5173`

The Vite dev server proxies `/api` requests to `http://localhost:5000`.

---

## 🌱 Seeding Demo Data

To populate the database with sample data (students, faculty, clubs, events, registrations, etc.):

```bash
cd backend
npm run seed
```

This will create:
- 1 Admin, 2 Faculty, 2 Coordinators, 8 Students
- 5 Clubs
- 10 Events (8 upcoming, 2 past/completed)
- Sample registrations with QR codes
- Notifications, certificates, results, gallery images, bookmarks

---

## 📡 API Overview

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login | Public |
| GET | `/api/auth/me` | Get current user | Protected |
| GET | `/api/events` | List events (search/filter/paginate) | Public |
| GET | `/api/events/:id` | Get event details | Public |
| POST | `/api/events` | Create event | Admin/Faculty/Coordinator |
| PUT | `/api/events/:id` | Update event | Admin/Faculty/Coordinator |
| DELETE | `/api/events/:id` | Delete event | Admin/Faculty/Coordinator |
| POST | `/api/registrations` | Register for event | Student |
| GET | `/api/registrations/my` | My registrations | Protected |
| POST | `/api/bookmarks` | Add bookmark | Protected |
| GET | `/api/bookmarks` | Get bookmarks | Protected |
| GET | `/api/notifications` | Get notifications | Protected |
| GET | `/api/clubs` | List clubs | Public |
| GET | `/api/certificates/my` | My certificates | Protected |
| GET | `/api/results/:eventId` | Get event results | Public |
| POST | `/api/attendance/scan` | Scan QR attendance | Admin/Faculty/Coordinator |

**Base URL:** `http://localhost:5000/api`

**Response Format:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { }
}
```

---

## 👥 User Roles & Permissions

| Feature | Student | Faculty | Coordinator | Admin |
|---------|---------|---------|-------------|-------|
| Browse Events | ✅ | ✅ | ✅ | ✅ |
| Register for Events | ✅ | ❌ | ❌ | ❌ |
| Create Events | ❌ | ✅ | ✅ | ✅ |
| Manage All Events | ❌ | ❌ | ❌ | ✅ |
| View Registrations | Own | Their Events | Their Events | All |
| Issue Certificates | ❌ | ✅ | ✅ | ✅ |
| Publish Results | ❌ | ✅ | ✅ | ✅ |
| Manage Users | ❌ | ❌ | ❌ | ✅ |
| System Admin | ❌ | ❌ | ❌ | ✅ |

---

## 🔑 Demo Credentials

After running `npm run seed`:

| Role | Email | Password |
|------|-------|----------|
| 👑 Admin | `admin@campusconnect.com` | `Admin@123` |
| 👨‍🏫 Faculty | `rajesh@campusconnect.com` | `Student@123` |
| 🎯 Coordinator | `vikram@campusconnect.com` | `Student@123` |
| 👨‍🎓 Student | `arjun@campusconnect.com` | `Student@123` |

---

## 📸 Screenshots

> *Run the application to see the UI. Screenshots will be added here.*

- Landing Page
- Events Discovery
- Event Detail with Registration
- Student Dashboard
- Admin Dashboard with Analytics
- Registration QR Code

---

## 🚀 Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
```

### Backend → Render/Railway

1. Push backend to GitHub
2. Connect to Render/Railway
3. Set environment variables
4. Deploy

---

## 🔮 Future Enhancements

- [ ] Email notifications via Nodemailer/SendGrid
- [ ] Progressive Web App (PWA) support
- [ ] QR code scanner for mobile attendance
- [ ] Video conferencing integration for online events
- [ ] Alumni portal
- [ ] Event recommendation system using ML
- [ ] Payment gateway for paid events
- [ ] Multi-language support
- [ ] Dark/Light mode toggle
- [ ] Advanced analytics and reporting
- [ ] Push notifications via Firebase
- [ ] Student community discussion boards

---

## 📄 License

MIT License – see [LICENSE](LICENSE) for details.

---

<div align="center">
  <strong>Built with ❤️ for college students everywhere</strong><br>
  <em>Campus Connect – One Campus. Every Event. Stay Connected.</em>
</div>
#   f s d - 2 - p r o j e c t  
 