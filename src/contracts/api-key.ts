export type ApiKeyCreateRequest = {
  name: string;
  expireTime?: string | null;
  scopes?: string[] | null;
};

export type ApiKeyCreateVO = {
  id: string;
  name: string;
  apiKey: string;
  expireTime: string | null;
  apiPath: string;
};

export type ApiKeyScopeVO = {
  code: string;
  name: string;
  description: string;
  defaultSelected?: boolean | null;
};

export type UserApiKeyVO = {
  id: string;
  name: string;
  expireTime: string | null;
  expireTimeInfo: string;
  apiPath: string;
  scopes: string[];
  createTime: string;
};
