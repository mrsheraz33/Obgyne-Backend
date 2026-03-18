# OBGyne Simplified — Backend API

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs

---

## Admin Credentials
| Field | Value |
|-------|-------|
| Email | ........@gmail.com |
| Password | .......@H26 |
| Role | Admin |

---

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Variables
`.env` file already included. Variables:
```env
PORT=5000
MONGO_URI=..........
JWT_SECRET=..........
JWT_EXPIRE=30d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 3. Run Development Server
```bash
npm run dev
```
Server runs on: **http://localhost:5000**

### 4. Run Production
```bash
npm start
```

---

## Auto Seed on First Run
When server starts for the first time:
- ✅ Admin account created automatically
- ✅ 3 courses seeded automatically

---

## API Endpoints

### Auth Routes `/api/auth`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register new student |
| POST | `/login` | Public | Login + get JWT token |
| GET | `/me` | Private | Get current user |
| PUT | `/updateprofile` | Private | Update name, phone, city |
| PUT | `/updatepassword` | Private | Change password |
| POST | `/forgotpassword` | Public | Generate reset token |
| PUT | `/resetpassword/:token` | Public | Reset password with token |

### Course Routes `/api/courses`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | Get all published courses |
| GET | `/admin/all` | Admin | Get all courses including drafts |
| GET | `/:slug` | Public | Get single course by slug |
| POST | `/` | Admin | Create new course |
| PUT | `/:id` | Admin | Update course |
| DELETE | `/:id` | Admin | Delete course |

### Enrollment Routes `/api/enrollments`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/:courseId` | Private | Enroll in a course |
| GET | `/my` | Private | Get my enrollments |
| PUT | `/:enrollmentId/progress` | Private | Update lesson progress |
| GET | `/` | Admin | Get all enrollments |

### Admin Routes `/api/admin`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/stats` | Admin | Dashboard statistics |
| GET | `/users` | Admin | Get all users |
| PUT | `/users/:id` | Admin | Update user |
| DELETE | `/users/:id` | Admin | Delete user |
| PUT | `/resetpassword` | Admin | Reset any account password |

### Health Check
```
GET /api/health
```
Response: `{ "success": true, "message": "OBGyne API is running 🚀" }`

---

## Project Structure
```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── middleware/
│   └── auth.js            # JWT protect + admin check
├── models/
│   ├── User.js            # User model with bcrypt + JWT
│   ├── Course.js          # Course model with modules
│   └── Enrollment.js      # Enrollment + progress tracking
├── routes/
│   ├── auth.js            # Auth routes
│   ├── courses.js         # Course CRUD routes
│   ├── enrollments.js     # Enrollment routes
│   └── admin.js           # Admin panel routes
├── .env                   # Environment variables
├── package.json
└── server.js              # Main entry point + seed data
```

---

## Courses in Database
| Course | Slug | Type |
|--------|------|------|
| Theory Group | `theory-group` | Flat lessons (25 lessons) |
| TOACS Preparatory Group | `toacs-group` | Modules (6 modules, 35 lessons) |
| Past Papers | `past-papers` | Flat lessons (9 lessons) |

---

## Deployment on Render

### Steps
1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo
4. Set root directory: `backend`
5. Build command: `npm install`
6. Start command: `node server.js`
7. Add environment variables (same as .env)

### Update CLIENT_URL after frontend deploy
```env
CLIENT_URL=https://your-frontend.vercel.app
```

---

## Password Reset (No Email Setup)
Currently reset token is returned directly in API response.
To use:
1. Call `POST /api/auth/forgotpassword` with email
2. Copy `resetToken` from response
3. Call `PUT /api/auth/resetpassword/:token` with new password

Or use **Admin Panel → Settings** to reset any password directly.

---

## Common Issues & Fixes

### Duplicate key error on startup
```
E11000 duplicate key error — email already exists
```
**Fix:** Already handled with try/catch — server will start normally.

### MongoDB connection timeout
**Fix:** Go to MongoDB Atlas → Network Access → Add `0.0.0.0/0`

### CORS error from frontend
**Fix:** Update `CLIENT_URL` in environment variables to your frontend URL.
