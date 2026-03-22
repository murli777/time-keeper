# Time Keeper API

A Node.js REST API for managing user authentication and time-tracking tasks. Built with Express.js, MongoDB, and JWT for secure authentication.

## Features

- User registration, login, logout, and token refresh
- JWT-based authentication with access and refresh tokens
- Task management (create, read, update, delete tasks)
- Input validation using Joi schemas
- Password hashing with bcrypt
- Rate limiting and security middleware (Helmet, CORS)
- MongoDB for data storage

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd time-keeper
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables. Create a `.env` file in the root directory with the following:
   ```
   PORT=3001
   MONGO_URI=<your-mongodb-connection-string>
   ACCESS_TOKEN_SECRET=<your-access-token-secret>
   REFRESH_TOKEN_SECRET=<your-refresh-token-secret>
   ACCESS_TOKEN_LIFETIME=15m
   REFRESH_TOKEN_LIFETIME=7d
   NODE_ENV=development
   ```

4. Start the server:
   ```bash
   npm start
   ```

The server will run on `http://localhost:3001`.

## API Endpoints

### Authentication

#### Register (Sign Up)
- **URL:** `POST /api/v1/auth/signup`
- **Description:** Register a new user.
- **Request Body:**
  ```json
  {
    "name": "string (1-25 chars)",
    "email": "string (valid email)",
    "password": "string (8-20 chars, must include uppercase, lowercase, and special char)"
  }
  ```
- **Responses:**
  - `201 Created`: `{ "success": true, "msg": "created" }`
  - `400 Bad Request`: Validation errors or duplicate email
  - `500 Internal Server Error`

#### Login
- **URL:** `POST /api/v1/auth/login`
- **Description:** Authenticate a user.
- **Request Body:**
  ```json
  {
    "email": "string (valid email)",
    "password": "string"
  }
  ```
- **Responses:**
  - `201 Created`: `{ "success": true, "msg": "authenticated", "userId": "...", "accessToken": "..." }`
  - `400 Bad Request`: Missing credentials
  - `401 Unauthorized`: Invalid credentials

#### Logout
- **URL:** `GET /api/v1/auth/logout`
- **Description:** Logout the user (clears refresh token).
- **Responses:**
  - `200 OK`: `{ "success": true, "msg": "logged out" }`

#### Refresh Token
- **URL:** `GET /api/v1/refresh`
- **Description:** Refresh the access token using the refresh token cookie.
- **Responses:**
  - `200 OK`: `{ "accessToken": "..." }`
  - `401 Unauthorized`: Invalid or missing refresh token

### Tasks (Requires Authentication)

All task endpoints require a valid JWT in the `Authorization` header: `Bearer <access_token>`.

#### Get User Tasks
- **URL:** `GET /api/v1/tasks`
- **Description:** Retrieve tasks for the authenticated user with optional filters.
- **Query Params:** (e.g., `?status=pending&limit=10`)
- **Responses:**
  - `200 OK`: Array of tasks
  - `400 Bad Request`: Invalid filters

#### Create Task
- **URL:** `POST /api/v1/tasks`
- **Description:** Create a new task.
- **Request Body:**
  ```json
  {
    "title": "string",
    "description": "string",
    "status": "pending|in-progress|completed",
    "priority": "low|medium|high",
    "dueDate": "ISO date string"
  }
  ```
- **Responses:**
  - `201 Created`: Task object
  - `400 Bad Request`: Validation errors

#### Get Task by ID
- **URL:** `GET /api/v1/tasks/:id`
- **Description:** Retrieve a specific task by ID.
- **Responses:**
  - `200 OK`: Task object
  - `404 Not Found`: Task not found
  - `400 Bad Request`: Invalid ID

#### Update Task
- **URL:** `PATCH /api/v1/tasks/:id`
- **Description:** Update a task.
- **Request Body:** Partial task data (same as create).
- **Responses:**
  - `200 OK`: Updated task
  - `404 Not Found`: Task not found
  - `400 Bad Request`: Validation errors

#### Delete Task
- **URL:** `DELETE /api/v1/tasks/:id`
- **Description:** Delete a task.
- **Responses:**
  - `200 OK`: `{ "success": true, "msg": "deleted" }`
  - `404 Not Found`: Task not found

## Error Handling

- All errors return JSON with `success: false` and an error message or array of errors.
- Common status codes: 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 500 (Internal Server Error).

## Technologies

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT, bcrypt
- **Validation:** Joi
- **Security:** Helmet, CORS, express-rate-limit

## Example Usage

**Register a user:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "Password1!"}'
```

**Login:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "Password1!"}'
```

**Create a task (replace <token> with actual access token):**
```bash
curl -X POST http://localhost:3001/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title": "My Task", "description": "Task description", "status": "pending"}'
```
