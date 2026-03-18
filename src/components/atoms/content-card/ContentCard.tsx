import type { FC } from 'react';

import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';

import type { ContentCardProps } from './content-card.types';

/**
 * Card with content wrapper. Combines MUI Card + CardContent.
 * @param {ContentCardProps} props - Card configuration.
 * @returns {JSX.Element} A card element with content area and optional action area.
 */
const ContentCard: FC<ContentCardProps> = ({ children, variant, actionArea, onClick, sx, contentSx }) => {
  const content = <CardContent sx={contentSx}>{children}</CardContent>;

  return (
    <Card variant={variant} sx={sx}>
      {actionArea ? <CardActionArea onClick={onClick}>{content}</CardActionArea> : content}
    </Card>
  );
};

export default ContentCard;
