# API Contract

This contract defines the minimum public behavior expected from REST APIs used by the projects in this workspace. It is intentionally implementation-neutral: a NestJS API, a future Health service, and a client application can share it.

## 1. Versioning and routes

- Public routes use a versioned prefix: `/api/v1`.
- Use resource-oriented, lowercase, plural paths: `/users`, `/favorites/movies`.
- Use HTTP methods for intent: `GET` reads, `POST` creates or performs a named action, `DELETE` removes.
- Path parameters identify a resource; request bodies carry creation or update data.

Example:

```http
DELETE /api/v1/favorites/movies/969681
```

## 2. Authentication and authorization

- Protected routes require an access token in the `Authorization` header.
- The format is `Bearer <accessToken>`.
- The API obtains the acting user from the verified token; clients never send a `userId` to act as another user.
- Every user-owned resource must be isolated by the authenticated user identifier.
- A missing, malformed, expired, or revoked access token returns `401` using the standard error contract.

```http
Authorization: Bearer eyJ...
```

## 3. Success responses

- Return JSON with an explicit response body, including successful actions such as logout or deletion.
- Dates are ISO 8601 UTC strings, for example `2026-10-07T12:00:00.000Z`.
- Preserve stable field names and types within an API version.
- `DELETE` operations that are intentionally idempotent return `200` even when the resource was already absent.

Example:

```json
{
  "success": true
}
```

## 4. Error response

Every expected error uses exactly this stable shape:

```json
{
  "statusCode": 401,
  "code": "AUTH_UNAUTHORIZED",
  "message": "No estás autorizado para realizar esta acción."
}
```

Rules:

- `statusCode` is the matching HTTP status.
- `code` is a stable, machine-readable identifier in `UPPER_SNAKE_CASE`.
- `message` is safe to show to a person and must not leak secrets, stack traces, database details, or provider credentials.
- Clients should branch on `code`, not translated message text.

Common statuses:

| Status | Meaning |
| --- | --- |
| `400` | Invalid request input. |
| `401` | Missing, invalid, expired, or revoked authentication. |
| `403` | Authenticated but not permitted. |
| `404` | Resource does not exist or is not visible to the current user. |
| `409` | Conflicting state, such as an already registered email. |
| `429` | Rate limit reached. |
| `503` | A required upstream service is unavailable. |

## 5. Input validation

- Validate path parameters, query parameters, and bodies at the API boundary.
- Reject unknown or malformed input rather than silently coercing business-critical values.
- Validate IDs, emails, enums, lengths, and numeric limits explicitly.
- Never trust identifiers received in a body when the authenticated session already defines the owner.

## 6. External providers

- Keep external API keys and base URLs server-side in environment configuration.
- Application clients call the project API, not third-party providers directly.
- Translate provider failures to the standard error response without exposing provider secrets.
- Cache read-only provider data only when the feature tolerates temporary staleness.

## 7. Security baseline

- Do not commit `.env` files, access tokens, refresh tokens, API keys, or OAuth client secrets.
- Use HTTPS for public or production deployments; `http://localhost` is acceptable only for local development.
- Apply rate limiting to public authentication and provider-backed routes.
- Use short-lived access tokens and rotate refresh tokens where session refresh is supported.
- Record operational logs without passwords, tokens, OTP values, or personally sensitive request data.

## 8. Endpoint delivery checklist

Before considering an endpoint complete, confirm:

- [ ] Route, method, request data, success responses, and errors are documented in OpenAPI/Swagger.
- [ ] Authentication and ownership rules are explicit.
- [ ] DTOs or equivalent boundary validation exist.
- [ ] The standard error contract is used.
- [ ] Tests cover the primary success case and at least one important rejection or authorization case.
- [ ] The Swift client model can decode the response, including nullable fields.
- [ ] Secrets remain outside source control.

## 9. Current reference implementation

`myAPIRest` is the reference implementation for this contract. Its authenticated movie favorites endpoints demonstrate ownership isolation, idempotent deletion, standard errors, Swagger documentation, and a typed Swift consumer in TicketSeller.
