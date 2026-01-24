# Book Inventory Management System

A production-ready, full-stack Book Inventory Management System built for **Vercel Serverless** deployment.

## 🚀 Tech Stack

### Backend (Serverless)
-   **Node.js**: Vercel API Routes (`/api`).
-   **MongoDB + Mongoose**: Cloud database with connection caching for serverless efficiency.
-   **JWT Auth**: Secure Admin authentication (HttpOnly/Bearer).
-   **Environment Variables**: Secure configuration management.

### Frontend
-   **React (Vite)**: Fast, modern UI.
-   **Material UI (MUI)**: Responsive and accessible design components.
-   **Axios**: API integration with interceptors.

## 📂 Project Structure

```bash
/
├── api/                  # Serverless Backend functions
│   ├── books/            # Public & Protected Book APIs
│   ├── admin/            # Admin Authentication
│   └── _lib/             # Shared logic (DB, Auth, Validation)
├── client/               # React Frontend Application
│   ├── src/
│   │   ├── pages/        # Route components (Home, Details, Admin)
│   │   ├── components/   # Reusable UI components
│   │   └── services/     # API Axios service
└── ...
```

## 🛠️ Getting Started

### 1. Prerequisites
-   Node.js (v18+)
-   A MongoDB Atlas URI

### 2. Environment Configuration
Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/dbname

# Security
JWT_SECRET=your_super_secret_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=your_bcrypt_hash
```

> **Tip**: Generate a password hash using:
> `node -e "console.log(require('bcryptjs').hashSync('your_password', 10))"`

### 3. Installation

**Install Backend Dependencies**:
```bash
npm install
```

**Install Frontend Dependencies**:
```bash
cd client
npm install
```

### 4. Running Locally

**Method 1: Using Vercel CLI (Recommended)**
Simulates the serverless environment perfectly.
```bash
npm i -g vercel
vercel dev
```
Access at `http://localhost:3000`.

**Method 2: Manual (Frontend only)**
If you just want to work on UI (API calls might fail if backend isn't running).
```bash
cd client
npm run dev
```

## 🔐 API Endpoints

### Public
-   `GET /api/books`: List all books (Paginated).
-   `GET /api/books/:id`: Get book details.

### Admin (Protected)
-   `POST /api/admin/login`: Authenticate as admin.
-   `POST /api/books`: Add a new book.
-   `PUT /api/books/:id`: Update a book.
-   `DELETE /api/books/:id`: Remove a book.

## 📜 License
MIT
