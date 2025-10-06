# Bookstore Backend

This is the backend server for the Bookstore application, built with **Node.js** and connected to **MongoDB**.

## Project Structure

- `server/` – Contains all backend logic including APIs, JWT auth, and database operations.

## Tech Stack

- Node.js + Express
- MongoDB with Mongoose
- JWT for authentication
- REST APIs for books, users, cart, and orders

## Setup Instructions
- Open a terminal, navigate to each folder, and install required packages:
  In server: npm install
- Navigate to the server folder in Command Prompt.
- Start the server with: node server.js
- Make sure it prints a message like “Server running at http://localhost:5000 and Connected to MongoDB”

## MongoDB Setup
- Install MongoDB locally.
  Run MongoDB by using commands
        mongodb --version
        mongosh
- Create a new database named “bookstore1” and a collections in MongoDB 
- Create config/db.js in the server folder and add connection code
- Open command prompt and type “node server.js” to start the server.


### 1. Navigate to Backend Directory
```bash
cd server
