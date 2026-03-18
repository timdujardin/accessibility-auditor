import type { ApiError } from '@/services/api.service';
import type { FC } from 'react';

import Alert from '@/components/atoms/alert/Alert';

interface ErrorAlertProps {
  error: ApiError | string | undefined;
}

const ErrorAlert: FC<ErrorAlertProps> = ({ error }) => {
  if (!error) {
    return null;
  }

  return (
    <Alert severity="error" sx={{ marginBlockEnd: 2 }}>
      {typeof error === 'string' ? error : error.message}
    </Alert>
  );
};

export default ErrorAlert;
