export interface ApiResponse<T = any> {
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  pageInfo?: {
    nextCursor?: string;
    hasNextPage: boolean;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pageInfo?: {
    nextCursor?: string;
    hasNextPage: boolean;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}