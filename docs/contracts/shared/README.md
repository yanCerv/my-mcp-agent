# Shared Contracts

Shared contracts are the non-negotiable boundary between any frontend, API, MCP
tool, or future game client in this workspace.

## Active contracts

- [API contract](api-contract.md): API versioning, authorization, error shape,
  validation, external-provider isolation and security baseline.

## Ownership

- The API owns identity verification, authorization, provider secrets, prices,
  inventory and final transaction state.
- Clients own presentation, user interaction, safe local display data and the
  timing of requests.
- MCP tools are constrained API consumers; they do not bypass API authorization
  or access databases directly.
