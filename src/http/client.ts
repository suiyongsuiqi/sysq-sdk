import { ApiError } from './api-error';
import { DEFAULT_TENANT_ID } from './config';
import { createApiError, createNetworkError, isBladeOauthFailure, isPlainObject } from './error-utils';

type ApiEnvelope<T> = {
  code: number;
  success: boolean;
  msg?: string | null;
  data: T;
};

export type RequestOptions = RequestInit & {
  skipAuth?: boolean;
};

export type SysqClientConfig = {
  baseUrl: string;
  apiKey?: string;
  accessToken?: string;
  fetcher?: typeof fetch;
  headers?: HeadersInit;
};

const isApiEnvelope = (value: unknown): value is ApiEnvelope<unknown> =>
  !!value &&
  typeof value === 'object' &&
  'code' in value &&
  'success' in value &&
  'data' in value;

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '');
}

function ensureLeadingSlash(value: string) {
  return value.startsWith('/') ? value : `/${value}`;
}

function resolveUrl(baseUrl: string, endpoint: string) {
  if (/^https?:/i.test(endpoint)) return endpoint;
  return `${trimTrailingSlash(baseUrl)}${ensureLeadingSlash(endpoint)}`;
}

export class SysqClient {
  constructor(private readonly config: SysqClientConfig) {
    if (!config.baseUrl?.trim()) {
      throw new Error('baseUrl is required');
    }

    if (config.apiKey && config.accessToken) {
      throw new Error('Provide either apiKey or accessToken, not both.');
    }
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const headers = new Headers(this.config.headers);

    if (options.headers) {
      new Headers(options.headers).forEach((value, key) => headers.set(key, value));
    }

    if (!headers.has('Accept')) {
      headers.set('Accept', 'application/json, */*;q=0.8');
    }

    if (!headers.has('Tenant-Id')) {
      headers.set('Tenant-Id', DEFAULT_TENANT_ID);
    }

    if (!options.skipAuth && !headers.has('Sysq-Auth')) {
      if (this.config.apiKey) {
        headers.set('Sysq-Auth', this.config.apiKey);
      } else if (this.config.accessToken) {
        headers.set('Sysq-Auth', `bearer ${this.config.accessToken}`);
      }
    }

    const body = options.body;
    const isRawBody = body instanceof FormData || body instanceof URLSearchParams;

    if (body !== undefined && body !== null && !isRawBody && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const fetcher = this.config.fetcher ?? globalThis.fetch;
    if (!fetcher) {
      throw new Error('No fetch implementation available.');
    }

    let response: Response;
    try {
      response = await fetcher(resolveUrl(this.config.baseUrl, endpoint), {
        ...options,
        headers,
        body:
          isRawBody || typeof body === 'string'
            ? (body as BodyInit)
            : body !== undefined && body !== null
              ? JSON.stringify(body)
              : undefined,
      });
    } catch (error) {
      throw createNetworkError(error);
    }

    return this.parseResponse<T>(response);
  }

  get<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body as BodyInit | null | undefined,
    });
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    if (response.status === 204) {
      return undefined as T;
    }

    const raw = await response.text();

    if (!raw) {
      if (!response.ok) {
        throw new ApiError(response.status, response.status, response.statusText || 'Request failed');
      }

      return undefined as T;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new ApiError(response.status, response.status, 'Response parsing failed', raw);
    }

    if (isApiEnvelope(parsed)) {
      if (!parsed.success) {
        throw createApiError({
          status: response.status,
          code: parsed.code,
          payload: parsed as Record<string, unknown>,
        });
      }

      return parsed.data as T;
    }

    if (isBladeOauthFailure(parsed)) {
      const payload = parsed as Record<string, unknown>;
      const code = typeof payload.error_code === 'number' ? payload.error_code : response.status;
      throw createApiError({ status: response.status, code, payload });
    }

    if (!response.ok) {
      const payload = isPlainObject(parsed) ? parsed : undefined;
      throw createApiError({ status: response.status, payload });
    }

    return parsed as T;
  }
}

export function createSysqClient(config: SysqClientConfig) {
  return new SysqClient(config);
}
