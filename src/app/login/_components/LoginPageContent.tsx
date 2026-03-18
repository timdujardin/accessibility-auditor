'use client';

import type { SignInForm } from '@/services/content-api/login/login.schema';
import type { FC } from 'react';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/atoms/button/Button';
import ContentCard from '@/components/atoms/content-card/ContentCard';
import ErrorAlert from '@/components/atoms/error/Error';
import FormTextField from '@/components/atoms/form-text-field/FormTextField';
import Form from '@/components/atoms/form/Form';
import Heading from '@/components/atoms/heading/Heading';
import Icon from '@/components/atoms/icon/Icon';
import Spinner from '@/components/atoms/spinner/Spinner';
import Wrapper from '@/components/atoms/wrapper/Wrapper';
import { useAuth } from '@/contexts/AuthContext';
import { signInResolver } from '@/services/content-api/login/login.schema';

const LoginPageContent: FC = () => {
  const { signIn, error, isSubmitting } = useAuth();
  const router = useRouter();

  const handleSignIn = async (data: SignInForm) => {
    const success = await signIn(data.username, data.password);
    if (success) {
      router.push('/dashboard');
    }
  };

  const signInSettings = useMemo(
    () => ({ resolver: signInResolver, defaultValues: { username: '', password: '' } }),
    [],
  );

  return (
    <Wrapper
      component="main"
      sx={{
        minBlockSize: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        paddingInline: 2,
      }}
    >
      <ContentCard sx={{ maxInlineSize: 440, inlineSize: '100%' }} contentSx={{ padding: 4 }}>
        <Wrapper sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBlockEnd: 3, gap: 1 }}>
          <Icon name="AccessibilityNew" color="primary" sx={{ fontSize: 40 }} />
          <Heading tag="h1" size="h5" fontWeight={700}>
            Accessibility Auditor
          </Heading>
        </Wrapper>

        <ErrorAlert error={error ?? undefined} />

        <Form<SignInForm> onSubmit={handleSignIn} isLoading={isSubmitting} formSettings={signInSettings}>
          <FormTextField<SignInForm>
            name="username"
            label="Username"
            fullWidth
            required
            sx={{ marginBlockEnd: 2 }}
            autoComplete="username"
          />
          <FormTextField<SignInForm>
            name="password"
            label="Password"
            type="password"
            fullWidth
            required
            sx={{ marginBlockEnd: 3 }}
            autoComplete="current-password"
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <Spinner size={20} /> : undefined}
          >
            Sign In
          </Button>
        </Form>
      </ContentCard>
    </Wrapper>
  );
};

export default LoginPageContent;
