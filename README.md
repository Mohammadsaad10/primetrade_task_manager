# PrimeTrade Backend Internship Assignment

**Author:** Mohammadsaad  

---

## 🚀 Project Overview

A full-stack **MERN** application (MongoDB, Express, React, Node.js) built for the PrimeTrade Backend Developer Intern assignment. Features a robust REST API with **Role-Based Access Control (RBAC)**, secure JWT authentication, and a React dashboard for task management.

---

## 🛠️ Tech Stack

| Layer                | Technology                  |
| -------------------- | --------------------------- |
| **Frontend**         | React 18, Vite, TailwindCSS |
| **Backend**          | Node.js, Express.js         |
| **Database**         | MongoDB 7                   |
| **Auth**             | JWT (HTTP-Only Cookies)     |
| **Containerization** | Docker, Docker Compose      |
| **Logging**          | Winston                     |

---

## 📂 Repository Structure

```
├── backend/                # Node.js/Express API (MVC Architecture)
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Auth & validation
│   │   └── utils/          # Logger utility
│   ├── seeder.js           # Admin account seeder
│   └── Dockerfile
├── frontend/               # Vite + React Dashboard
│   ├── src/
│   │   ├── pages/          # Dashboard, Login, Register
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # API client (Axios)
│   └── Dockerfile
├── docker-compose.yml      # Multi-container orchestration
├── scalability_note.md     # Architecture & scaling strategy
└── README.md
```

---

## ✨ Key Features

### Authentication & Security

- ✅ JWT-based auth with **HTTP-Only cookies** (XSS protection)
- ✅ Password hashing via `bcryptjs`
- ✅ Helmet security headers
- ✅ Schema-level validation (required fields, max lengths, enums)
- ✅ Input sanitization via Mongoose (trim, type coercion)

### Role-Based Access Control (RBAC)

| Role      | Permissions                             |
| --------- | --------------------------------------- |
| **Admin** | Full CRUD on ALL tasks (Global View)    |
| **User**  | CRUD only on OWN tasks (Data Isolation) |

### Frontend Features

- ✅ React 18 with Vite for fast development
- ✅ Protected dashboard (redirects to login if not authenticated)
- ✅ Full CRUD interface for tasks (create, edit, delete)
- ✅ Real-time error/success toast messages from API responses
- ✅ Responsive UI with TailwindCSS

### API Design

- ✅ RESTful endpoints with proper HTTP methods & status codes
- ✅ Consistent JSON response format (`success`, `data`, `message`)
- ✅ Centralized error handling with meaningful error messages
- ✅ Winston logging (file: `combined.log`, `error.log` + console)
- ✅ Modular MVC architecture (easily extensible for new entities)

---

## 🐳 Quick Start (Docker)

```bash
# Clone the repository
git clone https://github.com/Mohammadsaad10/primetrade_task_manager.git
cd primetrade-task-manager

# Start all services (MongoDB, Backend, Frontend)
docker-compose up --build
```

### Access Points

| Service         | URL                   |
| --------------- | --------------------- |
| **Frontend**    | http://localhost      |
| **Backend API** | http://localhost:3000 |
| **MongoDB**     | localhost:27017       |

---

## 🔐 Admin Access (For Evaluation)

> **Security Note:** Public registration as Admin is intentionally disabled to prevent privilege escalation attacks.

### Create Admin Account

```bash
# Run the seeder script inside the backend container
docker-compose exec backend node seeder.js
```

### Admin Credentials

| Field    | Value                 |
| -------- | --------------------- |
| Email    | `admin@primetrade.ai` |
| Password | `adminpassword123`    |

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint             | Description            | Access        |
| ------ | -------------------- | ---------------------- | ------------- |
| POST   | `/api/auth/register` | Register new user      | Public        |
| POST   | `/api/auth/login`    | Login & get JWT cookie | Public        |
| POST   | `/api/auth/logout`   | Clear auth cookie      | Authenticated |

### Tasks

| Method | Endpoint         | Description    | Access                |
| ------ | ---------------- | -------------- | --------------------- |
| GET    | `/api/tasks`     | Get all tasks  | Admin: All, User: Own |
| POST   | `/api/tasks`     | Create a task  | Authenticated         |
| GET    | `/api/tasks/:id` | Get task by ID | Owner or Admin        |
| PUT    | `/api/tasks/:id` | Update task    | Owner or Admin        |
| DELETE | `/api/tasks/:id` | Delete task    | Owner or Admin        |

### Task Schema

```json
{
  "title": "string (required, max 50 chars)",
  "description": "string (required, max 500 chars)",
  "status": "pending | in-progress | completed (default: pending)"
}
```

### Database Schema Design

**User Model:**

```
├── username    : String (required, trimmed)
├── email       : String (required, unique)
├── password    : String (required, min 6 chars, hashed, excluded from queries)
├── role        : Enum ['user', 'admin'] (default: 'user')
└── createdAt   : Date (auto-generated)
```

**Task Model:**

```
├── title       : String (required, max 50 chars, trimmed)
├── description : String (required, max 500 chars)
├── status      : Enum ['pending', 'in-progress', 'completed'] (default: 'pending')
├── user        : ObjectId (reference to User, required)
└── createdAt   : Date (auto-generated)
```

---

## ⚙️ Environment Variables

Docker Compose handles this automatically. For local development:

```bash
# backend/.env
PORT=3000
MONGO_URI=mongodb://localhost:27017/primetrade_assignment
JWT_SECRET_KEY=your_super_secret_key
NODE_ENV=development
```

---

## 🧪 Testing the API

### Using cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login (save cookies)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# Create Task (with cookies)
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title":"My First Task","description":"Complete the backend API"}'
```

### Using Postman

1. Import requests manually using the endpoints above
2. Enable "Cookies" in Postman to persist JWT across requests

---

## 📈 Scalability & Architecture

See [scalability_note.md](scalability_note.md) for details on:

- Horizontal scaling with Docker & load balancing
- Database indexing & connection pooling
- Redis caching strategy (future scope)
- Microservices transition path

---

## 📋 Notes for Reviewer

1. **API Documentation:** All endpoints are documented in this README with request/response formats, access levels, and cURL examples for testing.

2. **Logs:** Application logs (`combined.log`, `error.log`) are generated inside the container. Attached separately as `logs_Mohammadsaad.zip`.

3. **Security Design:** Admin self-registration is intentionally disabled to prevent privilege escalation attacks. Use the seeder script for testing admin features.

4. **RBAC Testing:**
   - Login as Admin → See all users' tasks
   - Login as regular User → See only your tasks

5. **Scalability:** Project follows MVC architecture with modular routes, making it easy to add new entities. See [scalability_note.md](scalability_note.md) for horizontal scaling, caching, and microservices notes.

---

## 📝 License

This project was created for the PrimeTrade Backend Developer Internship assignment.

