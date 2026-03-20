export const KNOWN_API_KEY_SCOPES = [
  'MAIL_BUY',
  'MAIL_READ',
  'MAIL_ASSET',
  'MAIL_MARK_READ',
] as const;

export type KnownApiKeyScope = (typeof KNOWN_API_KEY_SCOPES)[number];
