# `@suiyongsuiqi/sysq-sdk`

Official TypeScript SDK for SYSQ mailbox automation.

`sysq-sdk` is the official TypeScript SDK for SYSQ. It provides stable, reusable OpenAPI access for mailbox assets, message retrieval, read-state updates, API key operations, and shared SYSQ request and error contracts. It is designed to be the unified business access layer for Node.js services, scripts, CLIs, and other higher-level SYSQ integrations.
This package is being bootstrapped as the shared core for:

- `sysq-cli`
- future reusable API access from other internal or public tools

## Current Scope

The initial SDK surface focuses on the parts that are safe to share across runtimes:

- HTTP client core
- SYSQ error normalization
- mailbox resource APIs
- API key resource APIs
- shared request/response types

It intentionally does **not** include:

- React hooks
- browser stores
- Next.js integrations
- UI i18n helpers

## Example

```ts
import { createSysqSdk } from '@suiyongsuiqi/sysq-sdk';

const sdk = createSysqSdk({
  baseUrl: 'https://your-domain.com/api',
  apiKey: process.env.SYSQ_API_KEY,
});

const mailboxes = await sdk.mail.fetchUserMailBoxes({ current: 1, size: 20 });
console.log(mailboxes.records);
```

Notes:

- The SDK always sends `Tenant-Id: 000000`, which matches the current SYSQ backend contract.
- SYSQ server responses are keyed by `errorKey`; response localization is handled by clients, not by passing a locale to the backend.

## Scripts

```bash
pnpm install
pnpm build
pnpm typecheck
```
