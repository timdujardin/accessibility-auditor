import type { SupabaseClient } from '@supabase/supabase-js';

import { createClient } from '@/server/api/supabase/client';

/**
 * Represents an API error with HTTP status and optional data payload.
 */
export class ApiError extends Error {
  /**
   * Creates a new ApiError instance.
   * @param {string} message - The error message.
   * @param {number} status - The HTTP status code.
   * @param {unknown} [data] - Optional additional error data from the response.
   */
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  /**
   * Converts an unknown error into an ApiError instance.
   * @param {unknown} e - The error to convert.
   * @returns {ApiError} An ApiError wrapping the original error.
   */
  static fromError(e: unknown): ApiError {
    if (e instanceof ApiError) {
      return e;
    }
    if (e instanceof Error) {
      return new ApiError(e.message, 500);
    }

    return new ApiError(String(e), 500);
  }
}

/**
 * Performs a fetch request with JSON headers and automatic error handling.
 * @param {RequestInfo} input - The URL or Request object to fetch.
 * @param {RequestInit} [init] - Optional fetch configuration.
 * @returns {Promise<T>} The parsed JSON response.
 * @throws {ApiError} When the response is not ok.
 */
export const apiFetch = async <T>(input: RequestInfo, init?: RequestInit): Promise<T> => {
  const response = await fetch(input, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new ApiError((data as { error?: string }).error ?? response.statusText, response.status, data);
  }

  return response.json() as Promise<T>;
};

/**
 * Returns the browser-side Supabase client instance.
 * @returns {SupabaseClient} The Supabase client for client-side usage.
 */
export const getSupabase = (): SupabaseClient => {
  return createClient();
};

export interface SupabaseResult<T> {
  data: T | null;
  error: { message: string } | null;
}

/**
 * Executes a Supabase query with automatic error handling.
 * @param {Function} queryFn - A function that receives a Supabase client and returns a query promise.
 * @returns {Promise<T>} The query result data.
 * @throws {ApiError} When the Supabase query returns an error.
 */
export const supabaseQuery = async <T>(
  queryFn: (supabase: SupabaseClient) => PromiseLike<SupabaseResult<T>>,
): Promise<T> => {
  const supabase = getSupabase();
  const { data, error } = await queryFn(supabase);

  if (error) {
    throw new ApiError(error.message, 500);
  }

  return data as T;
};
