'use server';

import 'server-only';

import { ApiError } from '@/services/api.service';

/**
 * Maps an unknown caught error into a structured ApiError instance.
 * @param {unknown} err - The caught error value.
 * @returns {ApiError} A structured ApiError preserving the original message when possible.
 */
const handleApiError = (err: unknown): ApiError => {
  if (err instanceof ApiError) {
    return err;
  }
  if (err instanceof Error) {
    return new ApiError(err.message, 500);
  }

  return new ApiError(String(err), 500);
};

/**
 * Stalls execution for a given number of milliseconds.
 * @param {number} ms - The number of milliseconds to wait.
 * @returns {Promise<unknown>} A promise that resolves after the specified delay.
 */
export const wait = async (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Wraps a promise to return a tuple of [error, result] instead of throwing.
 * Caught errors are mapped to ApiError via handleApiError for consistent typing.
 * @param {Promise<T>} promise - The promise to execute safely.
 * @returns {Promise<[null, T] | [ApiError, null]>} A tuple with null error and result on success, or ApiError and null on failure.
 */
export const safeAwait = async <T>(promise: Promise<T>): Promise<[null, T] | [ApiError, null]> => {
  try {
    return [null, await promise];
  } catch (err) {
    return [handleApiError(err), null];
  }
};
