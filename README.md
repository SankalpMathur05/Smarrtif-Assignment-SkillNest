# SkillNest

SkillNest is a complete course discovery platform for students. It features a modern Next.js frontend and a robust Node.js/Express backend with MongoDB.

## Tech Stack

*   **Frontend:** Next.js 14 (App Router), Tailwind CSS, Lucide React, Axios
*   **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Bcrypt
*   **Database:** MongoDB
*   **Language:** TypeScript (Frontend & Backend)

## Project Structure

```
skillnest/
 ├── client/          # Next.js Frontend
 │   ├── src/app      # App Router Pages
 │   ├── src/components # UI Components
 │   └── ...
 └── server/          # Express Backend
     ├── src/models   # Mongoose Models
     ├── src/controllers # Route Controllers
     ├── src/routes   # API Routes
     └── ...
```

## Setup Instructions

### Prerequisites
*   Node.js (v18+)
*   MongoDB (Local or Atlas)

### 1. Backend Setup

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment Variables:
    *   Create a `.env` file in `server/` root.
    *   Add the following:
        ```
        PORT=5000
        MONGO_URI=mongodb://localhost:27017/skillnest
        JWT_SECRET=your_super_secret_key
        JWT_EXPIRE=30d
        NODE_ENV=development
        ```
4.  Seed the Database (Optional but recommended):
    ```bash
    npm run data:import
    ```
5.  Start the Server:
    ```bash
    npm run dev
    ```

### 2. Frontend Setup

1.  Navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Development Server:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Documentation

*   **Auth**
    *   `POST /api/auth/register` - Register a new user
    *   `POST /api/auth/login` - Login user
    *   `POST /api/auth/logout` - Logout user
*   **Courses**
    *   `GET /api/courses` - Get all courses
    *   `GET /api/courses/:id` - Get single course
    *   `POST /api/courses` - Create course (Admin)
    *   `PUT /api/courses/:id` - Update course (Admin)
    *   `DELETE /api/courses/:id` - Delete course (Admin)
*   **Enrollment**
    *   `POST /api/enroll/:courseId` - Enroll in a course
    *   `GET /api/enroll/my-enrollments` - Get enrolled courses
*   **Users**
    *   `GET /api/users` - Get all users (Admin)

## Credentials

*   **Admin User:**
    *   Email: `admin@example.com`
    *   Password: `password123`
*   **Student User:**
    *   Email: `john@example.com`
    *   Password: `password123`

## Deployment

### Backend (Render/Railway)
1.  Push `server` folder to GitHub.
2.  Connect to Render/Railway.
3.  Set Build Command: `npm install && npm run build`
4.  Set Start Command: `npm start`
5.  Add Environment Variables.

### Frontend (Vercel)
1.  Push `client` folder to GitHub.
2.  Connect to Vercel.
3.  Framework Preset: Next.js.
4.  Add Environment Variables (if any).
5.  Deploy.

Note regarding Cookies: For cross-domain cookies (Vercel Frontend + Render Backend), ensure `SameSite` is set correctly and `credentials: true` is used in Axios. You may need to set `trust proxy` in Express.

## License

MIT
