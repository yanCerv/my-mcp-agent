# my-mcp-agent

A local, security-first Model Context Protocol (MCP) server that exposes controlled myAPIRest capabilities to AI agents through typed, least-privilege tools.

## Scope

The first tool is intentionally read-only:

| Tool | Purpose |
| --- | --- |
| `get_current_user` | Retrieves the safe profile returned by `GET /api/v1/users/me`. |

The server never connects to PostgreSQL or Docker directly. It calls myAPIRest over HTTP, so it follows the same authentication, validation, and error contract as application clients.

## Requirements

- Node.js 24
- A local myAPIRest instance running at `http://localhost:3000`
- A valid local access token obtained from `POST /api/v1/auth/login`

## Setup

```bash
npm install
cp .env.example .env
```

Set `MY_API_REST_ACCESS_TOKEN` in `.env`. Never commit a real token.

```bash
npm run build
npm start
```

The server uses STDIO. Do not call it in a regular terminal expecting a web page; an MCP client such as Codex or VS Code launches it and exchanges JSON-RPC messages over standard input/output.

## Security decisions

- Local STDIO transport only; no public MCP endpoint.
- One read-only tool with an empty input schema.
- Access token stays in the local `.env`, which is ignored by Git.
- No direct database, Docker daemon, filesystem, or secret-manager access.
- Tool errors preserve myAPIRest's stable error code when available.
- Logs use `stderr`; `stdout` is reserved for the MCP protocol.

## Development

```bash
npm run build
npm test
```

## Future tools

Future tools must be added one at a time, with an explicit scope, input validation, API-level authorization, tests, and confirmation requirements for destructive actions.
