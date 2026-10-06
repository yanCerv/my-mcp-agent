# Swift API Client Contract

This contract defines how a Swift client integrates with APIs following the [API contract](api-contract.md). It protects session data, keeps networking behavior consistent, and gives the UI predictable errors.

## 1. Client boundaries

- Views and view models do not create URLs, attach authorization headers, or decode raw HTTP responses.
- A feature client, such as `AccountClient` or `MoviesClient`, defines feature requests.
- A shared networking layer executes requests, attaches authorization when required, decodes responses, and maps errors into one application error type.
- Each request declares whether authentication is required; public endpoints must not receive an `Authorization` header.

## 2. Session storage

- Store access and refresh tokens in Keychain, never in `UserDefaults`, source code, logs, screenshots, or analytics.
- Store only display data that is safe for offline UI separately from tokens.
- Persist the API values without inventing expiration dates:

```json
{
  "accessToken": "…",
  "refreshToken": "…",
  "accessTokenExpiresAt": "2026-10-07T12:00:00.000Z",
  "session": {
    "expiresAt": "2026-10-14T12:00:00.000Z",
    "timeZone": "UTC"
  }
}
```

- `accessTokenExpiresAt` controls when the access token can no longer authorize API requests.
- `session.expiresAt` controls the maximum life of the refresh-token session.
- Dates are parsed as ISO 8601 and compared in UTC.

## 3. Request authorization

- Protected requests send `Authorization: Bearer <accessToken>`.
- Login, registration, OTP request, password reset, and refresh endpoints are public by design and do not use that header.
- A logout request follows the API's documented contract; do not assume that a refresh token belongs in an HTTP header.
- Never send an access token to third-party provider hosts. Clients call the project API; the API owns provider credentials.

## 4. Refresh behavior

Before a protected request:

1. If `session.expiresAt` has passed, clear the stored session and report `sessionExpired` to the application.
2. If the access token is still valid, make the request normally.
3. If only the access token has expired, call the API refresh endpoint with the stored refresh token.
4. Atomically replace both stored tokens and expiration values with the refresh response.
5. Execute the original request once with the new access token.

If a protected request returns `401` unexpectedly, the client may perform one refresh-and-retry as a fallback. It must not loop indefinitely.

Concurrent requests must share one in-flight refresh operation. An `actor` or another serialized coordinator is appropriate for this responsibility; it prevents multiple requests from rotating the same refresh token at once.

## 5. Errors and UI behavior

- Decode the API error shape: `statusCode`, `code`, and `message`.
- Application logic branches on `code`; the UI can present the safe `message`.
- Treat `AUTH_UNAUTHORIZED`, an expired refresh session, or failed refresh as an invalid session: clear Keychain data and notify the application root to present login.
- Propagate cancellation as cancellation. Do not turn it into a generic alert.
- For grouped async loads, cancel or ignore stale work when the screen is no longer relevant; do not show multiple duplicate session alerts.

Suggested error categories:

| Category | Examples | UI action |
| --- | --- | --- |
| Session expired | refresh session elapsed, refresh rejected | Clear session and show login. |
| Authorization | `AUTH_UNAUTHORIZED`, `403` | Stop the protected action; re-authenticate if needed. |
| Validation | `400`, form-specific code | Show the API message near the relevant input. |
| Conflict | `409`, existing email | Explain the conflict and offer the appropriate path. |
| Transient | networking, `429`, `503` | Keep user data intact and offer a retry. |

## 6. Decoding and API evolution

- Models must match API field names and value types exactly.
- Represent API fields that may be JSON `null` as optionals in Swift, for example `String?` and `UserProfile?`.
- Do not make tokens or essential identifiers optional merely to hide a decoding problem.
- Add fields without breaking existing decoders when possible; create a new API version for incompatible changes.
- Use an explicit cache policy for session-sensitive endpoints such as `/users/me` when stale data would be misleading.

## 7. Feature mutations

- Show a loading state while a destructive or account-changing request is active.
- Disable the initiating control while its request is in flight to prevent accidental duplicates.
- Update local state only after the API confirms success, or perform an explicit optimistic update with rollback.
- Treat idempotent responses such as `{ "success": true }` as success even if the server reports that nothing remained to delete.

## 8. Client delivery checklist

Before shipping a feature that calls an API, confirm:

- [ ] The endpoint and response were verified in Swagger or a controlled test.
- [ ] The request uses the correct host, route, HTTP method, headers, and body.
- [ ] The decoded models represent API nullable fields safely.
- [ ] The feature participates in the shared access-token refresh flow.
- [ ] Error codes have intentional UI behavior.
- [ ] Tokens and secrets are absent from logs, fixtures, commits, and user-facing error text.
- [ ] Loading, cancellation, retry, and signed-out states are handled.

## 9. Current reference implementation

TicketSeller is the reference Swift client. Its authentication flow, Keychain-backed session, `GET /users/me`, Google sign-in handoff, and movie favorites feature are the current examples for this contract.
