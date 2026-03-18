import type { FC } from 'react';

import Typography from '@mui/material/Typography';

import type { TextProps } from './text.types';

/**
 * Body text element wrapping MUI Typography.
 * @param {TextProps} props - Text configuration.
 * @returns {JSX.Element} A text element with the specified variant and styling.
 */
const Text: FC<TextProps> = ({ variant = 'body1', children, ...rest }) => (
  <Typography variant={variant} {...rest}>
    {children}
  </Typography>
);

export default Text;
