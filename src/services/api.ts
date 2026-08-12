import axios from 'axios';
import type { AxiosResponse } from 'axios';

// ── Response envelope types ──
export interface ApiMeta {
  success: boolean;
  status_code: string;
  message: string;
}

export interface ApiPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

export interface ApiResponse<T> {
  meta: ApiMeta;
  data: T;
  pagination?: ApiPagination;
}

export interface ApiErrorBody {
  meta: ApiMeta;
  errors?: Record<string, string[]>;
}

// Custom error class for API validation errors (422)
export class ApiValidationError extends Error {
  status: number;
  errors: Record<string, string[]>;
  meta: ApiMeta;

  constructor(meta: ApiMeta, errors: Record<string, string[]>, status: number) {
    super(meta.message);
    this.name = 'ApiValidationError';
    this.status = status;
    this.errors = errors;
    this.meta = meta;
  }
}

// ── Axios instance ──
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.gardu.site/api',
  headers: {
    Accept: 'application/json',
  },
});

// ── Response interceptor: unwrap { meta, data, pagination } ──
api.interceptors.response.use(
  (response: AxiosResponse) => {
    const body = response.data;

    // If the response has the standard envelope shape, unwrap it
    if (body && typeof body === 'object' && 'meta' in body && 'data' in body) {
      const { meta, data, pagination } = body as ApiResponse<unknown>;

      // Check meta.success
      if (!meta.success) {
        const err = body as ApiErrorBody;
        throw new ApiValidationError(
          meta,
          err.errors || {},
          Number(meta.status_code) || response.status,
        );
      }

      // Attach pagination to response if present
      response.data = data;
      if (pagination) {
        (response as AxiosResponse & { pagination?: ApiPagination }).pagination = pagination;
      }
    }

    return response;
  },
  (error) => {
    // Handle error responses with envelope
    if (error.response?.data?.meta) {
      const body = error.response.data as ApiErrorBody;
      throw new ApiValidationError(
        body.meta,
        body.errors || {},
        error.response.status,
      );
    }
    return Promise.reject(error);
  },
);

export default api;
