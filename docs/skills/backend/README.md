# Backend Skills

## NestJS and Prisma

Use this guidance when changing MyAPIRest or a similarly structured service:

- Place HTTP DTOs and controllers in `presentation`, use cases and ports in
  `application`, and adapters in `infrastructure`.
- Validate input at the HTTP boundary; do not rely on the mobile client for
  validation or authorization.
- Add Prisma migrations deliberately, regenerate the client, and test the
  migration against the local database before reporting it ready.
- Never place access tokens, provider keys, payment secrets or raw PII in code,
  test output, Swagger examples or logs.
- Preserve the shared error contract and document routes in Swagger.

For evolving framework APIs, consult the version-matched official NestJS,
Prisma, Node.js and provider documentation.
