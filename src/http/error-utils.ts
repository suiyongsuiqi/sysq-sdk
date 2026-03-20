import { ApiError } from './api-error';

type AnyRecord = Record<string, unknown>;

const BUSINESS_CODE_MESSAGES: Record<number, string> = {
  2003: 'Too many failed login attempts. Please try again later.',
};

const HTTP_STATUS_MESSAGES: Record<number, string> = {
  400: 'Invalid request. Please check and try again.',
  401: 'Unauthorized.',
  403: 'Access denied.',
  404: 'Resource not found.',
  405: 'Method not allowed.',
  415: 'Unsupported media type.',
  500: 'Server error. Please try again.',
};

export function createNetworkError(error?: unknown) {
  return new ApiError(0, 0, 'Network error. Please check your connection.', error);
}

export function isPlainObject(value: unknown): value is AnyRecord {
  return !!value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype;
}

function getString(value: unknown) {
  return typeof value === 'string' ? value : undefined;
}

function pickFirstString(payload: AnyRecord, keys: string[]) {
  for (const key of keys) {
    const candidate = getString(payload[key]);
    if (candidate) return candidate;
  }
  return undefined;
}

function toUserMessage(params: {
  status?: number;
  code?: number;
  payload?: AnyRecord;
  fallback?: string;
}) {
  const { status, code, payload, fallback = 'Request failed. Please try again.' } = params;

  if (typeof code === 'number' && BUSINESS_CODE_MESSAGES[code]) {
    return BUSINESS_CODE_MESSAGES[code];
  }

  const raw = payload
    ? pickFirstString(payload, ['error_description', 'msg', 'message', 'error', 'errorMessage'])
    : undefined;
  if (raw) return raw;

  if (typeof status === 'number' && HTTP_STATUS_MESSAGES[status]) {
    return HTTP_STATUS_MESSAGES[status];
  }

  return fallback;
}

export function createApiError(params: {
  status?: number;
  code?: number;
  payload?: AnyRecord;
  fallback?: string;
}) {
  const { status, code, payload, fallback } = params;
  const message = toUserMessage({ status, code, payload, fallback });
  return new ApiError(status ?? 0, code ?? status ?? 0, message, payload);
}

export function isBladeOauthFailure(payload: unknown) {
  return (
    isPlainObject(payload) &&
    ((payload.success === false && ('error_code' in payload || 'error_description' in payload)) ||
      'error_description' in payload ||
      'error' in payload)
  );
}
