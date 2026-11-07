# User Directory Application

## Overview
A full-stack User Directory application built using React, ASP.NET Core Web API (.NET 8), and SQLite. The application supports creating, viewing, editing, and deleting users, with Auth0 authentication and JWT-based API security.

## Technologies Used
- **Frontend:** React, JavaScript, React Router, Axios, HTML, CSS
- **Backend:** ASP.NET Core Web API (.NET 8), C#
- **Database:** SQLite, Entity Framework Core
- **Authentication:** Auth0, OAuth 2.0 / OpenID Connect, JWT Bearer Authentication
- **Testing:** xUnit, Vitest, React Testing Library
- **Development Tools:** Visual Studio Code, Git, npm

## Application Features
- Add new users with form validation.
- View all users in a directory.
- Edit existing user details.
- Delete users with confirmation.
- Auth0 login and logout functionality.
- JWT validation on protected API endpoints.
- Public user listing and authenticated user creation.
- Loading indicators, error handling, and success notifications.
- Responsive user interface.

## Project Structure

```text
UserDirectory/
│
├── backend/
│   ├── UserDirectory.Api/
│   │   ├── Controllers/
│   │   ├── Data/
│   │   ├── DTOs/
│   │   ├── Models/
│   │   ├── Program.cs
│   │   └── appsettings.json
│   │
│   └── UserDirectory.Api.Tests/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   └── package.json
│
└── README.md
```

## Prerequisites
- .NET 8 SDK
- Node.js and npm
- Visual Studio Code or another suitable IDE
- Auth0 account and configured application/API

## Backend Setup

1. Navigate to the backend API directory:

```bash
cd backend/UserDirectory.Api
```

2. Configure the Auth0 settings in `appsettings.json`:

```json
"Auth0": {
  "Domain": "dev-uhtipz5fax1jawls.us.auth0.com",
  "Audience": "https://userdirectory-api"
}
```

3. Run the API:

```bash
dotnet restore
dotnet build
dotnet run
```

API URL: `http://localhost:5027`

Swagger: `http://localhost:5027/swagger/index.html`

The SQLite database is created automatically when the application starts.

## Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Configure the `.env` file:

```env
VITE_AUTH0_DOMAIN=dev-uhtipz5fax1jawls.us.auth0.com
VITE_AUTH0_CLIENT_ID=DXHBlgCa0v81ZTE9vrGA96bH6nPKJB1a
```

4. Start the React application:

```bash
npm run dev OR npm.cmd run dev 
```

Frontend URL: `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | Get all users |
| GET | `/api/users/{id}` | Get user by ID |
| POST | `/api/users` | Create a user |
| PUT | `/api/users/{id}` | Update a user |
| DELETE | `/api/users/{id}` | Delete a user |

**Security:** The POST endpoint requires a valid Auth0 JWT Bearer token. User listing and the other endpoints are currently public.

## Authentication Flow
- Auth0 handles user login and logout.
- The React application obtains an access token after successful authentication.
- The access token is sent in the Authorization Bearer header when creating a user.
- The .NET API validates the JWT using Auth0 configuration.
- Unauthenticated requests to protected endpoints are rejected.

## Running Tests

**Backend tests:**

```bash
cd backend/UserDirectory.Api.Tests
dotnet test
```

**Frontend tests:**

```bash
cd frontend
npm run test -- --run  OR npm.cmd run test -- --run
```

**Frontend lint:**

```bash
npm run lint  OR  npm.cmd run lint
```

**Frontend production build:**

```bash
npm run build  OR  npm.cmd run build
```

## Development Process
The application was developed incrementally, implementing the backend APIs and SQLite persistence first, followed by the React user interface. Authentication, validation, error handling, and unit testing were subsequently integrated and verified.

## AI Tools Disclosure
ChatGPT was used as an AI assistance tool during development for technical guidance, debugging, code explanations, and test preparation. The application was implemented, reviewed, and tested as part of the development process.

## Future Enhancements
- Docker and Docker Compose containerization.
- Additional authorization policies for update and delete operations.
- Enhanced UI styling and deployment configuration.

## Reviewer Notes

- **Please sign up or log in using Auth0 before creating a new user.**
- The **POST `/api/users`** endpoint (Create User) is protected and requires a valid JWT Bearer access token.
- User creation is available only to authenticated users.
- The User List and other API endpoints are publicly accessible and do not require authentication.
- If you try to create a user without logging in, the application will ask you to log in first.