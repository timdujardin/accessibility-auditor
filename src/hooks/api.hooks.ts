'use client';

import type { ApiRequestStatus } from '@/@types/api';

import { useCallback, useMemo, useState } from 'react';

import { ApiError } from '@/services/api.service';

const IDLE_RESET_MS = 1000;
const resetToIdle = (setter: (s: ApiRequestStatus) => void) => setTimeout(() => setter('idle'), IDLE_RESET_MS);

/**
 * Generic hook for fetching a list from an async service function.
 * Tracks loading, error, and response state.
 * @param {Function} func - The async service function to wrap.
 * @returns {{ getList: Function, response: Return | undefined, status: ApiRequestStatus, error: ApiError | undefined }} List fetch controls and state.
 */
export const useGetList = <Args extends unknown[], Return>(func: (...args: Args) => Promise<Return>) => {
  const [status, setStatus] = useState<ApiRequestStatus>('idle');
  const [error, setError] = useState<ApiError>();
  const [response, setResponse] = useState<Return>();

  const getList = useCallback(
    async (...args: Args): Promise<Return> => {
      setStatus('loading');
      setError(undefined);

      try {
        const newResponse = await func(...args);
        setResponse(newResponse);
        setStatus('succeeded');
        return newResponse;
      } catch (e) {
        setError(ApiError.fromError(e));
        setStatus('failed');
        throw e;
      }
    },
    [func],
  );

  return useMemo(() => ({ error, status, response, getList }), [error, getList, response, status]);
};

/**
 * Generic hook for fetching a single item from an async service function.
 * Wraps useGetList with a renamed `getItem` action.
 * @param {Function} func - The async service function to wrap.
 * @returns {{ getItem: Function, response: Return | undefined, status: ApiRequestStatus, error: ApiError | undefined }} Item fetch controls and state.
 */
export const useGetItem = <Args extends unknown[], Return>(func: (...args: Args) => Promise<Return>) => {
  const result = useGetList(func);

  return useMemo(() => {
    const { getList: getItem, ...rest } = result;

    return { getItem, ...rest };
  }, [result]);
};

/**
 * Generic hook for API mutations. Wraps an async function with loading,
 * error, and status tracking. Status resets to idle after completion.
 * @param {Function} func - The async service function to wrap.
 * @returns {{ action: Function, status: ApiRequestStatus, error: ApiError | undefined }} Mutation controls and state.
 */
export const useAction = <Args extends unknown[], Return>(func: (...args: Args) => Promise<Return>) => {
  const [status, setStatus] = useState<ApiRequestStatus>('idle');
  const [error, setError] = useState<ApiError>();

  const action = useCallback(
    async (...args: Args): Promise<Return> => {
      setStatus('loading');
      setError(undefined);

      try {
        const result = await func(...args);
        setStatus('succeeded');
        resetToIdle(setStatus);
        return result;
      } catch (e) {
        setError(ApiError.fromError(e));
        setStatus('failed');
        resetToIdle(setStatus);
        throw e;
      }
    },
    [func],
  );

  return useMemo(() => ({ error, status, action }), [error, action, status]);
};
