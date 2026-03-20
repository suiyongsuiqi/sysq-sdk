# `@suiyongsuiqi/sysq-sdk`

Official TypeScript SDK for SYSQ mailbox automation.

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

## Scripts

```bash
pnpm install
pnpm build
pnpm typecheck
```
