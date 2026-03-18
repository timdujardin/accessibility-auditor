'use client';

import type { PropsWithChildren } from 'react';

import { Provider } from 'react-redux';

import store from '@/redux/store';

const StoreProvider = ({ children }: Readonly<PropsWithChildren>) => {
  return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
