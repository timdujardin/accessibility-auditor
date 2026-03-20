import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, useStore } from 'react-redux';

import audit from '@/redux/slices/audit';
import criteria from '@/redux/slices/criteria';

const rootReducer = combineReducers({ audit, criteria });

const DEVTOOLS_ARRAY_LIMIT = 50;
const devToolsReplacer = (_key: string, value: unknown): unknown => {
  if (Array.isArray(value) && value.length > DEVTOOLS_ARRAY_LIMIT) {
    return `<<${value.length} items>>`;
  }

  return value;
};

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    devTools: {
      maxAge: 25,
      serialize: { replacer: devToolsReplacer as never },
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const useAppStore = useStore.withTypes<AppStore>();
export const useAppSelector = useSelector.withTypes<AppState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

const globalForStore = globalThis as unknown as {
  store: AppStore | undefined;
};

const store = globalForStore.store ?? makeStore();
if (process.env.NODE_ENV !== 'production') {
  globalForStore.store = store;
}

export default store;
