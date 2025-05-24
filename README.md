# Book Review App

A full-stack Book Review application with a Node.js/Express backend (with MongoDB) and a React frontend.

## 📁 Project Structure
```
book-review-app/
  ├── backend/    # Node.js/Express API
  └── frontend/   # React frontend
```

---

## 🚀 Backend (Node.js/Express)
- RESTful API for books, users, and reviews
- JWT authentication
- MongoDB via Mongoose
- Modular code: controllers, routes, models

### Main Endpoints
- `POST /signup` – Register new user
- `POST /login` – Authenticate and get JWT
- `POST /books` – Add book (auth only)
- `GET /books` – List books (pagination, filter)
- `GET /books/:id` – Book details (avg rating, paginated reviews)
- `POST /books/:id/reviews` – Add review (auth only, one per user/book)
- `PUT /reviews/:id` – Update your review
- `DELETE /reviews/:id` – Delete your review
- `GET /search` – Search books by title/author

### How to Run Backend
```
cd backend
npm install
npm run dev
```
- Set up your `.env` file (see `.env.example` if present)

---

## 💻 Frontend (React)
- Modern UI with Material UI
- Auth, book browsing, add/review books
- Responsive design

### How to Run Frontend
```
cd frontend
npm install
npm start
```
- Make sure backend is running at `http://localhost:3000`

---

## 🗄️ Database Schema (Summary)
- **User:** username (unique), email (unique), password (hashed)
- **Book:** title, author, genre, description
- **Review:** book (ref), user (ref), rating, comment

---

## 📝 Example API Requests
- Register:
  ```bash
  curl -X POST http://localhost:3000/signup -H 'Content-Type: application/json' -d '{"username":"user1","email":"user1@mail.com","password":"pass"}'
  ```
- Login:
  ```bash
  curl -X POST http://localhost:3000/login -H 'Content-Type: application/json' -d '{"email":"user1@mail.com","password":"pass"}'
  ```
- Add Book (authenticated):
  ```bash
  curl -X POST http://localhost:3000/books -H 'Authorization: Bearer <token>' -H 'Content-Type: application/json' -d '{"title":"Book Title","author":"Author","genre":"Fiction","description":"A great book."}'
  ```
