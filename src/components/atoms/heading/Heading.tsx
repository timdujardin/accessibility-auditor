import type { FC } from 'react';

import Typography from '@mui/material/Typography';

import type { HeadingProps } from './heading.types';

/**
 * Semantic heading element wrapping MUI Typography.
 * @param {HeadingProps} props - Heading configuration.
 * @returns {JSX.Element} A heading element with correct semantic tag and visual size.
 */
const Heading: FC<HeadingProps> = ({ tag = 'h2', size, gutterBottom, noWrap, children, ...rest }) => (
  <Typography variant={size ?? tag} component={tag} gutterBottom={gutterBottom} noWrap={noWrap} {...rest}>
    {children}
  </Typography>
);

export default Heading;
