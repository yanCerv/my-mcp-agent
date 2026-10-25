# Project Organization

This is the starting convention for the workspace. It is intentionally small:
refine it from observed project practice instead of imposing a generic folder
template on every repository.

## Principles

- Group source by feature/domain first, then by responsibility inside that
  feature.
- Keep generated output, dependencies, local environment files and temporary
  artifacts outside committed source.
- Keep one obvious place for API clients, models, tests and public docs.
- Prefer descriptive names over ambiguous global utility folders.
- Preserve existing repository conventions unless a migration is deliberate and
  documented.

## Current examples

| Project | Organizing idea |
| --- | --- |
| MyAPIRest | NestJS modules with presentation, application, domain and infrastructure boundaries. |
| TicketSeller | Feature-oriented Swift client, shared networking and typed models. |
| my-mcp-agent | MCP server source plus contracts, skills and cross-project standards. |

## Personal workflow to refine together

As recurring preferences become clear, add only concrete rules here, for
example naming, DTO placement, feature folders, test naming, documentation
location or commit preparation. This keeps the guide faithful to the way the
projects are actually maintained.
