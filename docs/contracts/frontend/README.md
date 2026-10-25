# Frontend Contracts

This layer documents the stable rules an application client follows when it
consumes a project API. It covers request ownership, session behavior, decoding,
loading and error behavior — not visual design.

## Active contracts

- [Swift API client](swift-client-contract.md): TicketSeller's current iOS
  reference for Keychain-backed sessions, refresh handling and API mutations.

## Future clients

When a web, Android, or game client is added, create a client-specific contract
only for platform behavior that differs. Reuse the shared API contract for
routes, authentication, errors and date formats.
