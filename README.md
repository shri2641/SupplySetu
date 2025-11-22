# SupplySetu - Full-Stack Application

This is a full-stack web application built with React for the frontend and Node.js/Express for the backend, using MongoDB as the database.

## Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)
- MongoDB (running locally on default port 27017)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd setu-main
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   cd ..
   ```

## Running the Application

### Backend
1. Ensure MongoDB is running locally.
2. Start the backend server:
   ```bash
   cd backend
   npm run dev  # For development with nodemon
   # or
   npm start    # For production
   ```
   The backend will run on http://localhost:5000 by default.

### Frontend
1. In a new terminal, from the root directory:
   ```bash
   npm start
   ```
   The frontend will run on http://localhost:3000 by default.

## API Endpoints

- `GET /api/suppliers` — Get all suppliers
- `POST /api/suppliers` — Add a new supplier (JSON: `{ name, location, rating }`)
- `DELETE /api/suppliers/:id` — Delete a supplier by ID

For more details on the backend, see [backend/README.md](backend/README.md).

## Notes

- Make sure both frontend and backend are running simultaneously.
- The backend connects to MongoDB at `mongodb://localhost:27017/hackathon` by default. Update the connection string in `backend/index.js` if needed.
- The application uses Material-UI for the frontend UI components.
