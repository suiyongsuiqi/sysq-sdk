import { ApiError } from '../http/api-error';
import type { SysqNormalizedError } from './sysq-error';
import { isSysqErrorData } from './sysq-error';

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype;

function mapOauthErrorCodeToKey(code: number) {
  if (code === 2000) return 'auth.oauth.invalidRequest';
  if (code === 2001) return 'auth.oauth.userNotFound';
  if (code === 2002) return 'auth.oauth.tenantNotFound';
  if (code === 2003) return 'auth.login.tooManyAttempts';
  if (code === 2006) return 'auth.oauth.tenantUnauthorized';
  if (code === 2010) return 'auth.oauth.invalidRefreshToken';
  if (code === 2004) return 'auth.oauth.invalidCredentials';
  if (code === 2005) return 'auth.oauth.invalidCredentials';
  if (code === 3000) return 'auth.oauth.clientNotFound';
  if (code === 3001) return 'auth.oauth.invalidClient';
  if (code === 3002) return 'auth.oauth.clientUnauthorized';
  if (code === 3003) return 'auth.oauth.clientUnauthorized';
  if (code === 4000) return 'auth.oauth.unsupportedGrantType';
  if (code === 4001) return 'auth.oauth.unsupportedGrantType';
  if (code === 4002) return 'auth.oauth.invalidScope';
  if (code === 5000) return 'auth.oauth.serverError';
  if (code === 5001) return 'auth.oauth.accessDenied';
  if (code === 5002) return 'auth.oauth.temporarilyUnavailable';
  return 'auth.oauth.unknown';
}

function extractSysqErrorData(payload: unknown) {
  if (!payload) return undefined;
  if (isSysqErrorData(payload)) return payload;
  if (isPlainObject(payload) && isSysqErrorData(payload.data)) return payload.data;
  return undefined;
}

function extractBladeOauthFailure(payload: unknown) {
  if (!isPlainObject(payload)) return undefined;

  const errorCode = payload.error_code;
  if (typeof errorCode !== 'number') return undefined;

  const errorDescription =
    typeof payload.error_description === 'string' ? payload.error_description : undefined;
  const errorKey = mapOauthErrorCodeToKey(errorCode);

  return { errorCode, errorKey, errorDescription };
}

function pickFallbackMsg(payload: unknown) {
  if (!isPlainObject(payload)) return undefined;
  return typeof payload.msg === 'string' ? payload.msg : undefined;
}

function toLegacyErrorKey(code: number) {
  if (code >= 400 && code <= 599) return `http.${code}`;
  return 'request.failed';
}

export function normalizeSysqError(error: unknown): SysqNormalizedError {
  if (error instanceof ApiError) {
    const oauthFailure = extractBladeOauthFailure(error.payload);
    if (oauthFailure) {
      return {
        type: 'biz',
        code: oauthFailure.errorCode,
        errorKey: oauthFailure.errorKey,
        params:
          oauthFailure.errorKey === 'auth.oauth.unknown'
            ? { code: oauthFailure.errorCode }
            : undefined,
        messageFallback: oauthFailure.errorDescription ?? error.message,
        raw: error.payload,
      };
    }

    const sysqData = extractSysqErrorData(error.payload);
    const msgFallback = pickFallbackMsg(error.payload) ?? error.message;

    if (sysqData) {
      const details = Array.isArray(sysqData.details) ? sysqData.details : undefined;

      if (details && details.length > 0) {
        return {
          type: 'validation',
          code: error.code,
          errorKey: sysqData.errorKey,
          traceId: sysqData.traceId,
          details,
          messageFallback: msgFallback,
          raw: error.payload,
        };
      }

      return {
        type: 'biz',
        code: error.code,
        errorKey: sysqData.errorKey,
        traceId: sysqData.traceId,
        params: sysqData.params,
        messageFallback: msgFallback,
        raw: error.payload,
      };
    }

    if (error.code === 0) {
      return {
        type: 'network',
        errorKey: 'network.failed',
        messageFallback: error.message,
        raw: error.payload,
      };
    }

    return {
      type: 'legacy',
      code: error.code,
      errorKey: toLegacyErrorKey(error.code),
      messageFallback: msgFallback,
      raw: error.payload,
    };
  }

  if (error instanceof Error) {
    return {
      type: 'legacy',
      code: 0,
      errorKey: toLegacyErrorKey(0),
      messageFallback: error.message,
      raw: error,
    };
  }

  return {
    type: 'legacy',
    code: 0,
    errorKey: toLegacyErrorKey(0),
    messageFallback: 'Unknown error',
    raw: error,
  };
}
