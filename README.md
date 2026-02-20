# 🚀 SkillNest  

> A modern full-stack course discovery and enrollment platform built with Next.js, Node.js, Express, and MongoDB.

SkillNest is designed to provide students with a seamless experience for discovering, exploring, and enrolling in online courses. The platform focuses on clean UI, smooth authentication, role-based access, and scalable backend architecture.

---

## 🌐 Live Links

🔗 **Live Website**  
https://smarrtif-assignment-skill-nest-6lslo64j3.vercel.app/

🎨 **Figma Wireframe**  
https://www.figma.com/design/ngTITZXfPWxqPiHLOzKAqW/SkillNest-Wireframe?node-id=0-1&t=SP5FjHVYmQ6iE4jH-1

---

## 🛠 Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Lucide React
- Axios

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB (Mongoose)
- JWT Authentication
- Bcrypt

### Database
- MongoDB

---

## 🧩 Features

### 👤 Authentication & Authorization
- JWT-based secure authentication
- Role-based access (Admin / Student)
- Protected routes
- Secure password hashing

### 📚 Course Management
- Browse all courses
- View detailed course pages
- Admin CRUD operations for courses
- Clean and responsive UI

### 🎓 Enrollment System
- Enroll in courses
- View enrolled courses
- Prevent duplicate enrollments
- User-specific dashboards

### ⚡ Performance & UX
- Responsive design
- Optimized frontend rendering
- Modular backend architecture
- Clean and scalable folder structure

---

## 📁 Project Structure

```text
skillnest/
├── client/                 # Next.js Frontend
│   ├── src/app/            # App Router Pages
│   ├── src/components/     # Reusable UI Components
│   └── ...
└── server/                 # Express Backend
    ├── src/models/         # Mongoose Models
    ├── src/controllers/    # Business Logic
    ├── src/routes/         # API Routes
    └── ...
```

---

## 📡 API Overview

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

### Courses
- `GET /api/courses`
- `GET /api/courses/:id`
- `POST /api/courses` (Admin)
- `PUT /api/courses/:id` (Admin)
- `DELETE /api/courses/:id` (Admin)

### Enrollment
- `POST /api/enroll/:courseId`
- `GET /api/enroll/my-enrollments`

### Users
- `GET /api/users` (Admin)

---

## 🚀 Deployment

### Backend
- Hosted on **Render**
- Environment variables configured securely
- Production-ready Express server

### Frontend
- Hosted on **Vercel**
- Connected directly to GitHub
- Optimized Next.js production build

For cross-domain authentication, cookies are configured with proper `SameSite` settings and `credentials: true` in Axios requests.

---

## 🎯 Design Philosophy

SkillNest focuses on:

- Clean minimal UI
- Smooth user journeys
- Clear course discovery experience
- Scalable full-stack architecture
- Industry-standard authentication practices

The wireframes were carefully planned in Figma before implementation to ensure structured layout and strong UX consistency.

---

## 📌 Why SkillNest?

SkillNest demonstrates:

- Full-stack development expertise
- Modern Next.js App Router implementation
- Secure backend API design
- Proper separation of concerns
- Clean UI with Tailwind CSS
- Real-world deployment setup

---

## 👨‍💻 Author

Built with precision and modern web practices to simulate a real-world ed-tech platform experience.
