# Frontend Skills

## iOS and SwiftUI

Use this guidance when changing TicketSeller or another Apple-platform client:

- Keep view code separate from feature clients and the shared networking layer.
- Store session credentials in Keychain; do not send provider credentials from
  the app when MyAPIRest can make the provider call.
- Treat API nullability as part of the client model contract.
- Coordinate a token refresh so concurrent requests do not rotate one refresh
  token multiple times.
- Follow the current Apple/Xcode documentation for SDK APIs, signing,
  capabilities and platform availability before coding.

The detailed behavioral agreement is the
[Swift API client contract](../../contracts/frontend/swift-client-contract.md).
