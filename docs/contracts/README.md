# Contracts

Contracts define observable agreements between layers. They describe what a
consumer may rely on, not how a particular implementation happens to work.

## Layers

| Area | Scope | Current status |
| --- | --- | --- |
| [Frontend](frontend/README.md) | Mobile and web clients that call a project API. | Active for TicketSeller iOS. |
| [Backend](backend/README.md) | REST API delivery and server boundaries. | Active reference: myAPIRest. |
| [Shared](shared/README.md) | Rules both clients and APIs must obey. | Active. |
| [Gaming](gaming/README.md) | Future game clients, services, and realtime interactions. | Reserved; no implementation contract yet. |

## Contract rules

- A contract is versioned and reviewed before a breaking change is shipped.
- Keep implementation details, credentials, local hostnames, and SDK setup out
  of contracts.
- Prefer additive changes inside an API version. Use a new version for
  incompatible requests or responses.
- A skill may explain *how* to implement a contract; it cannot silently change
  the contract.
