import { createApiKeyApi } from './resources/api-key';
import { createMailApi } from './resources/mail';
import { createSysqClient, type SysqClientConfig } from './http/client';

export function createSysqSdk(config: SysqClientConfig) {
  const client = createSysqClient(config);

  return {
    client,
    mail: createMailApi(client),
    apiKey: createApiKeyApi(client),
  };
}

export type SysqSdk = ReturnType<typeof createSysqSdk>;
