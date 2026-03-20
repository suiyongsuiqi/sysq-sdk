export type PaginationPrimitive = string | number;

export type PaginationQuery = {
  current?: number;
  size?: number;
  ascs?: PaginationPrimitive[] | null;
  descs?: PaginationPrimitive[] | null;
};

export type Page<T> = {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
};
