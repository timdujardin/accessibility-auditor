import { requireAnonymous } from '@/auth/auth';

import LoginPageContent from './_components/LoginPageContent';

const LoginPage = async () => {
  await requireAnonymous();

  return <LoginPageContent />;
};

export default LoginPage;
