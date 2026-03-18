'use client';

import type { FC } from 'react';

import type { TechnologyCheckboxProps } from './technology-checkbox.types';

import { Checkbox, FormControlLabel } from '@/components/atoms/checkbox/Checkbox';
import Link from '@/components/atoms/link/Link';
import Text from '@/components/atoms/text/Text';
import Wrapper from '@/components/atoms/wrapper/Wrapper';

const TechnologyCheckbox: FC<TechnologyCheckboxProps> = ({ id: _id, label, url, checked, onChange }) => {
  return (
    <FormControlLabel
      control={<Checkbox checked={checked} onChange={onChange} />}
      label={
        <Wrapper sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Text variant="body1" fontWeight={600}>
            {label}
          </Text>
          <Link href={url} target="_blank" rel="noopener noreferrer" variant="caption" sx={{ textDecoration: 'none' }}>
            (spec)
          </Link>
        </Wrapper>
      }
    />
  );
};

export default TechnologyCheckbox;
