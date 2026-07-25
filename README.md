# Online Boutique Management System

Full-stack MERN application for managing a custom boutique — orders, measurements, workers, billing, and notifications.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Backend | Node.js, Express.js, MongoDB, Mongoose, JWT, Nodemailer, Multer, xlsx |
| Frontend | React 18, Vite, Redux Toolkit, Tailwind CSS, Material UI, Recharts, Lucide React |

## Features

- **Authentication** — JWT login/signup with roles: Admin, Customer, Worker
- **Admin Dashboard** — Stats cards, monthly orders/revenue charts, status pie chart
- **Customer Module** — Profile, measurements, reference images, modification requests, order tracking
- **Worker Module** — Assigned tasks, view measurements, update/submit work status
- **Order Management** — Create, assign workers, status workflow, search/filter
- **Billing** — Auto-generate invoices, email notifications via Nodemailer
- **Data Tables** — Sortable, paginated tables with Excel export

## Project Structure

```
ecommerce/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── redux/
│       └── services/
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB running locally (or MongoDB Atlas URI)

## Setup

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure environment

Copy `backend/.env.example` to `backend/.env` and update:

- `MONGODB_URI` — your MongoDB connection string
- `JWT_SECRET` — a strong secret key
- `SMTP_*` — email credentials for Nodemailer (optional; emails log to console if unset)

### 3. Seed demo data

```bash
npm run seed
```

**Demo accounts:**

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@boutique.com | admin123 |
| Customer | customer@boutique.com | customer123 |
| Worker | worker@boutique.com | worker123 |

### 4. Run the application

**Terminal 1 — Backend:**
```bash
npm run dev:backend
```

**Terminal 2 — Frontend:**
```bash
npm run dev:frontend
```

- Frontend: http://localhost:5173
- API: http://localhost:5000/api

## API Overview

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/login` | Login |
| `POST /api/auth/register` | Register (customer/worker) |
| `GET /api/dashboard/stats` | Admin dashboard data |
| `GET/POST /api/orders` | Order management |
| `GET /api/workers/tasks` | Worker assigned tasks |
| `GET/POST /api/measurements` | Customer measurements |
| `POST /api/orders/:id/invoice` | Generate invoice |
| `GET /api/export/orders` | Export orders to Excel |

## Order Status Flow

`received` → `processing` → `stitching` → `ready` → `delivered`

## License

MIT
