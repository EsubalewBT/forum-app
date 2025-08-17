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
