# Healthcare Appointment Booking System

A full-stack web application to browse doctors and book appointments with them.

---

## Project Structure

```
healthcare-appointment/
├── backend/         # Node.js + Express + MongoDB
├── frontend/        # Vite + React + TypeScript + Tailwind CSS
```

---

## 🛠️ Tools & Libraries Used

### Frontend (Vite + React + TS)

- **React 18 + Vite** – SPA framework
- **Tailwind CSS + shadcn/ui** – Utility-first CSS with styled components
- **React Router DOM** – Routing
- **React Hook Form + Zod** – Form validation
- **Radix UI** – Accessible primitives
- **TanStack Query (React Query)** – Data fetching and caching
- **Sonner** – Toast notifications

### Backend (Node.js + Express)

- **Express.js** – API server
- **Mongoose** – ODM for MongoDB
- **Validator** – Input validation (e.g., email, phone)
- **Rate Limit** – Prevent abuse of endpoints
- **dotenv** – Environment variable management
- **CORS + Cookie Parser** – Middleware support

---

## 🌍 Environment Variables

### Backend (`backend/.env`)

```
PORT=5000
MONGO_URI=<your mongoDB connection string>
FRONTEND_URL=<your frontend domain url>
```

### Frontend (`frontend/.env`)

```
VITE_API_BASE_URL=<your backend domain url + "/api"">
```

---

## ✅ Features

- View list of doctors (with search support)
- Book appointments with doctor (date/time slots)
- Input validation on both client and server
- Rate-limited API to prevent abuse
- Persistent storage in MongoDB

---

## 📌 Improvements with More Time

- Add authentication for patients and doctors
- Calendar availability for doctors
- Admin panel to manage doctors and appointments
- Appointment status updates
- Pagination & filtering
- Image upload for doctor profile

---

## ⚠️ Challenges Faced & Solutions

### 1. **Aligning Frontend and Backend Data Models**

- Challenge: Field mismatches like `phone` vs `phoneNo`.
- Solution: Unified both sides using consistent schemas and updated frontend accordingly.

### 2. **Validation Errors from Backend**

- Challenge: Displaying server-side errors in frontend.
- Solution: Standardized error responses and displayed using `toast.error`.

### 3. **CORS and Environment Setup**

- Challenge: Dev server communication (frontend ↔ backend).
- Solution: Added CORS middleware with `FRONTEND_URL` and used `.env` for config.

### 4. **Testing Without Production API**

- Challenge: Initial frontend used mock API.
- Solution: Replaced `api.ts` with actual endpoints while keeping types and structure.

---

## 🚀 Getting Started

### 1. Clone the repo:

```bash
git clone https://github.com/your-username/healthcare-appointment.git
cd healthcare-appointment
```

### 2. Setup backend:

```bash
cd backend
create your own .env
npm install
npm run dev
```

### 3. Setup frontend:

```bash
cd frontend
create your own .env
npm install
npm run dev
```

---

## 📄 License

MIT – Feel free to use and modify.
