/**
 * API client — wraps all FastAPI calls with JWT auth injection,
 * consistent error shape parsing, and SWR-compatible fetcher.
 *
 * Pattern from context.md:
 *  - Base URL from NEXT_PUBLIC_API_URL (defaults to localhost:8000/api/v1)
 *  - JWT access token injected from NextAuth session cookie
 *  - Error shape: { error: string, message: string, detail?: string }
 */
import { getSession } from "next-auth/react";
import { APP_CONFIG } from "./constants";

// ── Error shape returned by FastAPI ──────────────────────────────────────────
export interface ApiError {
  error: string;
  message: string;
  detail?: string;
}

export class ApiRequestError extends Error {
  code: string;
  detail?: string;
  status: number;

  constructor(code: string, message: string, status: number, detail?: string) {
    super(message);
    this.name = "ApiRequestError";
    this.code = code;
    this.status = status;
    this.detail = detail;
  }
}

// ── Internal request helper ───────────────────────────────────────────────────
interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
  skipAuth?: boolean;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, headers = {}, skipAuth = false, ...customConfig } = options;

  let url = `${APP_CONFIG.apiUrl}${endpoint}`;
  if (params) {
    url += `?${new URLSearchParams(params).toString()}`;
  }

  // Inject JWT token from NextAuth session
  const authHeaders: Record<string, string> = {};
  if (!skipAuth) {
    const session = await getSession();
    const token = (session as any)?.accessToken as string | undefined;
    if (token) {
      authHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    ...customConfig,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...(headers as Record<string, string>),
    },
  };

  const response = await fetch(url, config);

  // Parse body regardless — FastAPI always returns JSON
  let data: unknown;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errData = data as Partial<ApiError>;
    throw new ApiRequestError(
      errData?.error ?? "UNKNOWN_ERROR",
      errData?.message ?? `HTTP ${response.status}`,
      response.status,
      errData?.detail
    );
  }

  return data as T;
}

// ── Public API surface ────────────────────────────────────────────────────────
export const api = {
  get<T>(endpoint: string, params?: Record<string, string>, opts?: RequestOptions) {
    return request<T>(endpoint, { method: "GET", params, ...opts });
  },

  post<T>(endpoint: string, body?: unknown, opts?: RequestOptions) {
    return request<T>(endpoint, {
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...opts,
    });
  },

  put<T>(endpoint: string, body?: unknown, opts?: RequestOptions) {
    return request<T>(endpoint, {
      method: "PUT",
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...opts,
    });
  },

  patch<T>(endpoint: string, body?: unknown, opts?: RequestOptions) {
    return request<T>(endpoint, {
      method: "PATCH",
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...opts,
    });
  },

  delete<T>(endpoint: string, opts?: RequestOptions) {
    return request<T>(endpoint, { method: "DELETE", ...opts });
  },
};

/**
 * SWR-compatible fetcher. Usage:
 *   const { data } = useSWR("/jobs", fetcher)
 */
export async function fetcher<T>(endpoint: string): Promise<T> {
  return api.get<T>(endpoint);
}
