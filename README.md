## Auth / Token Flow

Endpoints:

- POST /api/users/register -> { message, user, tokens }
- POST /api/users/login -> { message, user, tokens }
- POST /api/users/refresh-token -> { tokens } (body: { refreshToken })
- POST /api/users/logout -> 204 (body: { refreshToken })

tokens object structure:

```
{
	access: { token: string, expiresAt: epochSeconds },
	refresh: { token: string, expiresAt: epochSeconds }
}
```

Access token lifetime: 15 minutes.
Refresh token lifetime: 7 days (rotated on each refresh, old becomes invalid).

Include access token in Authorization header:

```
Authorization: Bearer <accessToken>
```

Refresh Flow:

1. When access token expires, call /refresh-token with the current refresh token.
2. Server verifies, rotates, and returns a new pair.
3. Replace stored tokens client-side.

Logout Flow:
Send refresh token to /logout so it is deleted server-side; then discard tokens client-side.

#My Forum App

## Setup

1. Create a `.env` file at the project root (do not commit this):

```
# Server
PORT=4001
NODE_ENV=development
JWT_SECRET=your-long-random-secret-at-least-16-chars
JWT_REFRESH_SECRET=your-long-random-refresh-secret-at-least-16-chars

# Database (MySQL)
user=your_mysql_user
password=your_mysql_password
database=your_db_name

# Frontend (optional CORS override)
FRONTEND_URL=http://localhost:5173
```

2. Install dependencies:

Backend (root):

```
npm install
```

Client (Vite React app):

```
cd client/student-forum
npm install
```

3. Run the apps:

Backend:

```
npm start
```

Client:

```
cd client/student-forum
npm run dev
```

Open the client at http://localhost:5173 and the server at http://localhost:4001.

## Git hygiene

- Secrets are ignored via `.gitignore` (e.g., `.env`).
- Do not commit node_modules, dist, or coverage outputs.
- If you accidentally track something that should be ignored: `git rm -r --cached <path>` then commit.
