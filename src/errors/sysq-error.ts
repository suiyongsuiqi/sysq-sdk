export type SysqPrimitive = string | number | boolean | null;

export type SysqParams = Record<string, SysqPrimitive>;

export type SysqFieldErrorDetail = {
  field: string;
  reason: string;
  params?: SysqParams;
};

export type SysqErrorData = {
  errorKey: string;
  traceId: string;
  params?: SysqParams;
  details?: SysqFieldErrorDetail[];
};

export type SysqNormalizedError =
  | {
      type: 'network';
      errorKey: 'network.failed';
      messageFallback?: string;
      raw?: unknown;
    }
  | {
      type: 'legacy';
      code: number;
      errorKey: string;
      messageFallback?: string;
      raw?: unknown;
    }
  | {
      type: 'biz';
      code: number;
      errorKey: string;
      traceId?: string;
      params?: SysqParams;
      messageFallback?: string;
      raw?: unknown;
    }
  | {
      type: 'validation';
      code: number;
      errorKey: string;
      traceId?: string;
      details: SysqFieldErrorDetail[];
      messageFallback?: string;
      raw?: unknown;
    };

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype;

export function isSysqParams(value: unknown): value is SysqParams {
  if (!isPlainObject(value)) return false;
  return Object.values(value).every(
    (item) =>
      item === null ||
      typeof item === 'string' ||
      typeof item === 'number' ||
      typeof item === 'boolean'
  );
}

export function isSysqFieldErrorDetail(value: unknown): value is SysqFieldErrorDetail {
  if (!isPlainObject(value)) return false;
  if (typeof value.field !== 'string') return false;
  if (typeof value.reason !== 'string') return false;
  if ('params' in value && value.params !== undefined && !isSysqParams(value.params)) return false;
  return true;
}

export function isSysqErrorData(value: unknown): value is SysqErrorData {
  if (!isPlainObject(value)) return false;
  if (typeof value.errorKey !== 'string') return false;
  if (typeof value.traceId !== 'string') return false;
  if ('params' in value && value.params !== undefined && !isSysqParams(value.params)) return false;
  if ('details' in value && value.details !== undefined) {
    if (!Array.isArray(value.details)) return false;
    if (!value.details.every(isSysqFieldErrorDetail)) return false;
  }
  return true;
}
