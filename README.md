# Product Management

A full-stack application for managing products built using React, Express.js, and MySQL.

## Setup Instructions

### 1. Database Setup
Run the SQL script located at `server/database/schema.sql` to create the database, table, and trigger for the application.

### 2. Backend Setup
1. Open the `server` folder: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file inside the `server` folder and configure your MySQL credentials.

Example `.env`:

DB_HOST=localhost  
DB_USER=root  
DB_PASSWORD=yourpassword
DB_NAME=product_db  
PORT=5000  

4. Run the server: `npm start`

### 3. Frontend Setup
1. Open the `client` folder: `cd client`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`

The frontend will run on `http://localhost:5173`.