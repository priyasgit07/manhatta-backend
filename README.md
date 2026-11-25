# Manhatta Backend API

A RESTful backend API for a real-estate platform built using Node.js, TypeScript, Express.js, MySQL, and Prisma ORM.

## Overview

Manhatta is a real-estate backend application that provides user authentication and property listing management. It includes secure authentication, CRUD operations, property search, filtering, and pagination.

## Tech Stack

- Node.js
- TypeScript
- Express.js
- MySQL
- Prisma ORM
- JWT (JSON Web Token)
- bcrypt
- Postman

## Features

### Authentication
- User registration
- Secure password hashing using bcrypt
- User login
- JWT-based authentication
- Protected API routes

### Property Management
- Create property listings
- Retrieve all properties
- Retrieve property by ID
- Update property details
- Delete property listings

### Additional Features
- Property search
- Filtering by location, bedrooms, and price
- Pagination
- Input validation
- Authentication middleware
- RESTful API structure

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |

### Protected Routes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/protected` | Test authenticated access |

### Properties

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/properties` | Create a property |
| GET | `/api/properties` | Get all properties |
| GET | `/api/properties/:id` | Get property by ID |
| PUT | `/api/properties/:id` | Update a property |
| DELETE | `/api/properties/:id` | Delete a property |

## Authentication

Authentication uses JSON Web Tokens (JWT).

After successful login, the API returns a token. Use this token to access protected endpoints by including it in the Authorization header:

`Authorization: Bearer <your_token>`

Passwords are hashed using bcrypt before being stored in the database.

## Database

The application uses MySQL with Prisma ORM.

Main models:

- **User** – stores user information and authentication details
- **Property** – stores property listing details and is associated with its owner

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/manhatta-backend.git
cd manhatta-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/manhatta_db"
JWT_SECRET="your_secret_key"
PORT=3000
```

Replace the database credentials and JWT secret with your own values.

**Never commit your `.env` file to GitHub.**

### 4. Set up the database

Create the MySQL database:

```sql
CREATE DATABASE manhatta_db;


Configure your database connection in `.env`.

### 5. Run Prisma migrations

npx prisma migrate dev

### 6. Start the development server

npm run dev

The server will run at:

`http://localhost:3000`

## Testing

APIs were tested using Postman.

The Postman collection includes:

- Register User
- Login
- Protected Route
- Create Property
- Get All Properties
- Get Property by ID
- Update Property
- Delete Property

## Project Structure

manhatta-backend/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── lib/
│   │   └── prisma.ts
│   ├── middleware/
│   │   └── auth.middleware.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   └── property.routes.ts
│   └── server.ts
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md

## What I Learned

- Building RESTful APIs using Node.js and Express.js
- TypeScript for backend development
- Database integration using Prisma ORM and MySQL
- JWT authentication and protected routes
- Password hashing using bcrypt
- Implementing CRUD operations
- API testing using Postman
- Search, filtering, and pagination

## Future Improvements

- Role-based access control
- Property image upload
- Advanced search and filtering
- API documentation using Swagger
- Deployment to a cloud platform
