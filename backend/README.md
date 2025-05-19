# Book Review API

A RESTful API for a basic Book Review system built with Node.js, Express, MongoDB, and JWT authentication.

## Features
- User signup/login with JWT authentication
- CRUD for books and reviews
- Pagination, filtering, and search endpoints
- Modular code with environment variable config

## Tech Stack
- Node.js + Express.js
- MongoDB (Mongoose ODM)
- JWT for authentication
- dotenv for config

## Setup Instructions

1. Clone the repo
2. Install dependencies: `npm install`
3. Create a `.env` file (see below)
4. Start MongoDB locally
5. Run the server: `npm run dev` (with nodemon) or `npm start`

## .env Example
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/bookreview
JWT_SECRET=your_jwt_secret_here
```

## Example API Requests
(see below for curl/Postman examples)

## Database Schema
- User: username, email, password (hashed)
- Book: title, author, genre, description
- Review: book, user, rating, comment, timestamps

## Design Decisions
- One review per user per book (enforced in code)
- JWT used for stateless authentication
- Pagination defaults: 10 items per page

---

## Endpoints
- `POST /signup` – Register a new user
- `POST /login` – Authenticate and get JWT
- `POST /books` – Add a new book (auth required)
- `GET /books` – List books (pagination, filter by author/genre)
- `GET /books/:id` – Book details with average rating & reviews
- `POST /books/:id/reviews` – Add review (auth, one per user/book)
- `PUT /reviews/:id` – Update your review
- `DELETE /reviews/:id` – Delete your review
- `GET /search` – Search books by title/author

---

## To Do
- Implement all endpoints
- Add more sample requests
- Add ER diagram (optional)
