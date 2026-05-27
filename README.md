# VoroWebCreator — Full-Stack Freelancing Platform

A production-ready freelancing platform for a web development agency, built with React, Spring Boot, and MySQL.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Tailwind CSS v3, Zustand, React Query |
| **Backend** | Java 17, Spring Boot 3.2, Spring Security, WebSocket |
| **Database** | MySQL 8.0 |
| **Auth** | JWT (access + refresh tokens) |
| **Charts** | Recharts |
| **Forms** | React Hook Form |
| **Notifications** | react-hot-toast |
| **Icons** | Lucide React |
| **Animation** | Framer Motion, CSS animations |

---

## 📁 Project Structure

```
vorowebcreator/
├── frontend/                        # React application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/              # Button, Input, Card, Modal, etc.
│   │   │   └── layout/              # Navbar, Footer, DashboardLayout
│   │   ├── context/
│   │   │   └── store.js             # Zustand stores (auth + theme)
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── AuthPages.jsx        # Login + Signup
│   │   │   ├── PortfolioPage.jsx
│   │   │   ├── PricingPage.jsx
│   │   │   ├── TemplatesPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ProjectPages.jsx     # List + Detail + Chat
│   │   │   ├── NewProjectPage.jsx   # Multi-step wizard
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   ├── AdminPages.jsx       # Users + Projects management
│   │   │   └── ProfilePages.jsx    # Profile + Notifications
│   │   ├── services/
│   │   │   └── api.js               # Axios instance + all API helpers
│   │   ├── utils/
│   │   │   ├── helpers.js           # Formatters, constants
│   │   │   └── mockData.js          # Sample data for development
│   │   ├── styles/
│   │   │   └── globals.css          # Tailwind + custom CSS vars
│   │   ├── App.jsx                  # Router + route guards
│   │   └── index.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── backend/                         # Spring Boot application
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/vorowebcreator/
│       │   ├── VoroWebCreatorApplication.java
│       │   ├── config/
│       │   │   └── SecurityConfig.java
│       │   ├── controller/
│       │   │   ├── AuthController.java
│       │   │   └── Controllers.java  # All other controllers
│       │   ├── dto/
│       │   │   └── Dtos.java         # Request/Response DTOs
│       │   ├── exception/
│       │   │   └── Exceptions.java   # Custom exceptions + global handler
│       │   ├── model/
│       │   │   ├── User.java
│       │   │   ├── Project.java
│       │   │   └── Models.java       # Other entities
│       │   ├── repository/
│       │   │   └── Repositories.java # All JPA repositories
│       │   ├── security/
│       │   │   ├── JwtUtils.java
│       │   │   └── JwtAuthFilter.java
│       │   └── service/
│       │       ├── AuthService.java
│       │       └── Services.java     # All other services
│       └── resources/
│           └── application.yml
│
└── database/
    └── schema.sql                   # Complete MySQL schema + seed data
```

---

## ✨ Features

### Public Pages
- **Home** — Hero, services, portfolio preview, process, testimonials, CTA
- **Portfolio** — Filterable grid with category + search
- **Pricing** — Package cards, comparison table, FAQ accordion
- **Templates** — Template library with category filters
- **Contact** — Form with validation, success state, contact info

### Authentication
- JWT login + signup
- Access token + refresh token
- Persistent auth via localStorage (Zustand persist)
- Role-based route guards (CLIENT / ADMIN)
- Auto-refresh on 401

### Client Dashboard
- **Overview** — Stats, project progress, charts, quick actions
- **Projects** — List with filter/search, status badges, progress bars
- **Project Detail** — Milestones, file upload zone, inline chat
- **New Project** — 3-step wizard: Package → Details → Review
- **Profile** — Edit info, change password, danger zone
- **Notifications** — Mark read/all-read, delete, type icons

### Admin Panel
- **Dashboard** — Revenue chart, project donut, recent tables
- **Users** — Table with toggle active/inactive, email link
- **Projects** — Status updater, progress slider per project

### Backend API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh

GET    /api/users/me
PUT    /api/users/me
PATCH  /api/users/me/password

POST   /api/projects
GET    /api/projects
GET    /api/projects/{id}
PATCH  /api/projects/{id}/status     [ADMIN]
PATCH  /api/projects/{id}/progress   [ADMIN]

GET    /api/packages
GET    /api/packages/{slug}

GET    /api/portfolio
GET    /api/portfolio/featured
GET    /api/portfolio/{slug}

GET    /api/reviews/public
POST   /api/reviews
PATCH  /api/reviews/{id}/publish     [ADMIN]

POST   /api/contact
GET    /api/contact                  [ADMIN]

POST   /api/files/upload
GET    /api/files/project/{id}
DELETE /api/files/{id}

GET    /api/notifications
GET    /api/notifications/unread-count
PATCH  /api/notifications/{id}/read
PATCH  /api/notifications/read-all

GET    /api/admin/stats              [ADMIN]
GET    /api/admin/users              [ADMIN]
GET    /api/admin/projects           [ADMIN]
PATCH  /api/admin/users/{id}/toggle-status [ADMIN]

GET    /api/chat/project/{id}/messages
POST   /api/chat/project/{id}/messages
```

---

## 🗄️ Database Schema (15 tables)

| Table | Description |
|---|---|
| `users` | Clients and admins |
| `packages` | Pricing packages |
| `portfolio_items` | Showcase projects |
| `projects` | Client project requests |
| `milestones` | Per-project milestones |
| `files` | Uploaded files |
| `chat_rooms` | One room per project |
| `chat_messages` | Chat messages |
| `invoices` | Billing invoices |
| `reviews` | Client reviews |
| `notifications` | User notifications |
| `contact_messages` | Contact form submissions |
| `templates` | Website templates |

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+
- Java 17+
- Maven 3.8+
- MySQL 8.0+

### 1. Database
```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend
```bash
cd backend

# Configure your environment
export DB_USERNAME=root
export DB_PASSWORD=yourpassword
export JWT_SECRET=YourSuperSecretKeyAtLeast32CharactersLong

mvn spring-boot:run
# API available at http://localhost:8080/api
```

### 3. Frontend
```bash
cd frontend
npm install
npm start
# App available at http://localhost:3000
```

---

## 🔐 Environment Variables

### Backend (`application.yml` or env)
```env
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=VoroWebCreatorSuperSecretKeyChangeThis2024!
FRONTEND_URL=http://localhost:3000
UPLOAD_DIR=./uploads
MAIL_HOST=smtp.gmail.com
MAIL_USERNAME=your@email.com
MAIL_PASSWORD=your_app_password
STRIPE_SECRET_KEY=sk_test_your_key
```

### Frontend (`.env`)
```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_WS_URL=ws://localhost:8080/ws
```

---

## 👤 Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@vorowebcreator.com | Admin@123 |
| Client | sarah@techcorp.com | Client@123 |

---

## 🎨 Design System

- **Colors** — Brand indigo (`#6366f1`) + accent green (`#06d6a0`)
- **Fonts** — Syne (display), DM Sans (body), JetBrains Mono (code)
- **Dark mode** — Full dark mode via CSS custom properties + Tailwind `dark:` classes
- **Animations** — Fade-in, slide-up, float, glow keyframes
- **Components** — Button (5 variants), Card, Input, Modal, Badge, Progress, StarRating, Avatar, Skeleton, Alert, EmptyState

---

## 🔧 Key Architecture Decisions

- **Monorepo** with separate `frontend/` and `backend/` directories
- **Zustand** for lightweight global state (auth + theme) with persistence
- **React Query** for server state caching and invalidation
- **CSS Custom Properties** for seamless dark/light theming
- **JWT refresh token** strategy with axios interceptors
- **Spring Security** with stateless JWT, no sessions
- **Controller → Service → Repository** pattern throughout backend
- **Global exception handler** with consistent `ApiResponse<T>` wrapper
- **Mock data** (`src/utils/mockData.js`) enables full frontend development without backend

---

## 📦 Production Deployment

### Frontend (Vercel / Netlify)
```bash
cd frontend
npm run build
# Deploy the `build/` folder
```

### Backend (Railway / Render / EC2)
```bash
cd backend
mvn clean package -DskipTests
java -jar target/vorowebcreator-api-1.0.0.jar
```

### Docker (optional)
```dockerfile
# Backend
FROM eclipse-temurin:17-jre
COPY target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]

# Frontend
FROM node:18-alpine AS build
WORKDIR /app
COPY . .
RUN npm ci && npm run build
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
```

---

## 📝 License

MIT License — feel free to use, modify, and distribute.

---

Built with ❤️ by the VoroWebCreator team.
