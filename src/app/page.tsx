import type { FC } from 'react';

import { redirect } from 'next/navigation';

const Home: FC = () => {
  redirect('/dashboard');
};

export default Home;
