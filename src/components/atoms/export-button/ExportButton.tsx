import type { FC } from 'react';

import type { ExportButtonProps } from './export-button.types';

import Button from '@/components/atoms/button/Button';
import Icon from '@/components/atoms/icon/Icon';

const ExportButton: FC<ExportButtonProps> = ({ label, iconName, onClick, size = 'small', variant = 'outlined' }) => {
  return (
    <Button size={size} variant={variant} startIcon={<Icon name={iconName} />} onClick={onClick}>
      {label}
    </Button>
  );
};

export default ExportButton;
