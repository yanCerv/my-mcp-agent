# Backend Contracts

This layer captures server-side delivery expectations that are useful across
projects while remaining independent of a specific framework.

## Current reference

MyAPIRest is the active reference implementation. Its NestJS modules expose
versioned REST routes, validate inputs at the boundary, use the shared error
contract, and keep third-party credentials on the server.

## Rules for a new backend capability

1. Define the consumer-visible route and response in the shared contract or
   project API documentation.
2. State authorization and ownership before adding persistence.
3. Keep provider credentials and pricing/business decisions server-side.
4. Add validation, error mapping, Swagger/OpenAPI documentation and focused
   tests before calling the endpoint delivered.

Framework-specific implementation guidance belongs in
[the backend skills](../../skills/backend/README.md).
