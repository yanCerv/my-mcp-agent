# Security Baseline

- Keep `.env`, access tokens, refresh tokens, API keys, OAuth client secrets,
  payment secrets and personal test data out of Git.
- Use the API as the only boundary for provider credentials, authorization,
  prices, inventory and payment confirmation.
- Use HTTPS outside local development; treat `localhost` as development-only.
- Validate untrusted input and return the shared safe error shape.
- Use least privilege for MCP tools: one narrowly scoped tool at a time,
  validated input, API authorization and explicit confirmation before a
  destructive action.
- Log operational context without passwords, token values, OTP values, card
  data or unnecessary personal information.

Before a public deployment, add project-specific production controls such as
CORS policy, security headers, secret scanning, dependency updates and audit
logging.
