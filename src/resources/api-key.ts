import type {
  ApiKeyCreateRequest,
  ApiKeyCreateVO,
  ApiKeyScopeVO,
  UserApiKeyVO,
} from '../contracts';
import type { SysqClient } from '../http/client';

const API_KEY_PREFIX = '/v1/user/api-key';

function normalizeIds(ids: string[] | string) {
  return Array.isArray(ids) ? ids.join(',') : ids;
}

export function createApiKeyApi(client: SysqClient) {
  return {
    create(payload: ApiKeyCreateRequest) {
      return client.post<ApiKeyCreateVO>(`${API_KEY_PREFIX}/create`, payload);
    },

    fetchScopes() {
      return client.get<ApiKeyScopeVO[]>(`${API_KEY_PREFIX}/scopes`);
    },

    fetchList() {
      return client.get<UserApiKeyVO[]>(`${API_KEY_PREFIX}/list`);
    },

    remove(ids: string[] | string) {
      const encoded = encodeURIComponent(normalizeIds(ids));
      return client.post<boolean>(`${API_KEY_PREFIX}/remove?ids=${encoded}`);
    },
  };
}

export type ApiKeyApi = ReturnType<typeof createApiKeyApi>;
