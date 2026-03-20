export class ApiError extends Error {
  constructor(
    public status: number,
    public code: number,
    message: string,
    public payload?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
