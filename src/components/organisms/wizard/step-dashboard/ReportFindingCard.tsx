import type { FC } from 'react';

import type { ReportFindingCardProps } from './report-preview.types';

import ContentCard from '@/components/atoms/content-card/ContentCard';
import Icon from '@/components/atoms/icon/Icon';
import { ImageGallery, ImageGalleryItem } from '@/components/atoms/image-gallery/ImageGallery';
import PriorityChip from '@/components/atoms/priority-chip/PriorityChip';
import Tag from '@/components/atoms/tag/Tag';
import Text from '@/components/atoms/text/Text';
import Wrapper from '@/components/atoms/wrapper/Wrapper';

/**
 * Read-only card displaying a single finding in the report preview.
 * @param {ReportFindingCardProps} props - The finding data to display.
 * @returns {JSX.Element} A card with priority, criterion info, description, recommendation, element info, and screenshots.
 */
const ReportFindingCard: FC<ReportFindingCardProps> = ({ finding }) => {
  const {
    criterionId,
    criterionName,
    level,
    priority,
    description,
    recommendation,
    elementSelector,
    elementHtml,
    fromAutomatedScan,
    auditorValidated,
    screenshots,
  } = finding;

  return (
    <ContentCard variant="outlined" sx={{ marginBlockEnd: 1.5 }} contentSx={{ paddingBlock: 1.5 }}>
      <Wrapper sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', marginBlockEnd: 1 }}>
        <PriorityChip priority={priority} />
        <Tag label={criterionId} size="small" variant="outlined" />
        {level ? <Tag label={`Level ${level}`} size="small" variant="outlined" /> : null}
        {fromAutomatedScan ? (
          <Tag icon={<Icon name="SmartToy" />} label="Automated" size="small" variant="outlined" />
        ) : null}
        {auditorValidated ? (
          <Tag icon={<Icon name="CheckCircle" />} label="Validated" size="small" color="success" variant="outlined" />
        ) : null}
      </Wrapper>

      <Text variant="body2" fontWeight={600} sx={{ marginBlockEnd: 0.5 }}>
        {criterionName}
      </Text>
      <Text variant="body2" sx={{ marginBlockEnd: 0.5 }}>
        {description}
      </Text>

      {recommendation ? (
        <Text variant="body2" color="text.secondary" sx={{ marginBlockEnd: 0.5 }}>
          <strong>Recommendation:</strong> {recommendation}
        </Text>
      ) : null}

      {elementSelector ? (
        <Text variant="caption" color="text.secondary" component="code" sx={{ display: 'block', marginBlockEnd: 0.5 }}>
          {elementSelector}
        </Text>
      ) : null}

      {elementHtml ? (
        <Text
          variant="caption"
          color="text.secondary"
          component="pre"
          sx={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: 11 }}
        >
          {elementHtml}
        </Text>
      ) : null}

      {screenshots.length > 0 ? (
        <ImageGallery cols={Math.min(screenshots.length, 3)} rowHeight={140} gap={8} sx={{ marginBlockStart: 1 }}>
          {screenshots.map((ss, idx) => (
            <ImageGalleryItem key={idx}>
              {/* eslint-disable-next-line @next/next/no-img-element -- base64 data URL or external storage URL */}
              <img
                src={ss.src}
                alt={ss.alt}
                loading="lazy"
                style={{ objectFit: 'contain', blockSize: '100%', inlineSize: '100%' }}
              />
            </ImageGalleryItem>
          ))}
        </ImageGallery>
      ) : null}
    </ContentCard>
  );
};

export default ReportFindingCard;
