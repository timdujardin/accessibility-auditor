'use client';

import type { FC } from 'react';

import type { IssueCardProps } from './issue-card.types';

import ContentCard from '@/components/atoms/content-card/ContentCard';
import IconButton from '@/components/atoms/icon-button/IconButton';
import Icon from '@/components/atoms/icon/Icon';
import PriorityChip from '@/components/atoms/priority-chip/PriorityChip';
import Tag from '@/components/atoms/tag/Tag';
import Text from '@/components/atoms/text/Text';
import Tooltip from '@/components/atoms/tooltip/Tooltip';
import Wrapper from '@/components/atoms/wrapper/Wrapper';

const IssueCard: FC<IssueCardProps> = ({
  id,
  description,
  recommendation,
  priority,
  elementSelector,
  elementHtml,
  fromAutomatedScan,
  auditorValidated,
  onValidate,
  onDelete,
}) => {
  return (
    <ContentCard
      variant="outlined"
      sx={{ marginBlockEnd: 1 }}
      contentSx={{ paddingBlockEnd: '12px !important', paddingBlock: 1.5 }}
    >
      <Wrapper sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <Wrapper sx={{ flexGrow: 1 }}>
          <Wrapper sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBlockEnd: 0.5 }}>
            <PriorityChip priority={priority} />
            {fromAutomatedScan ? (
              <Tag icon={<Icon name="SmartToy" />} label="Automated" size="small" variant="outlined" />
            ) : null}
            {auditorValidated ? (
              <Tag
                icon={<Icon name="CheckCircle" />}
                label="Validated"
                size="small"
                color="success"
                variant="outlined"
              />
            ) : null}
          </Wrapper>
          <Text variant="body2" sx={{ marginBlockEnd: 0.5 }}>
            {description}
          </Text>
          {recommendation ? (
            <Text variant="body2" color="text.secondary" sx={{ marginBlockEnd: 0.5 }}>
              <strong>Recommendation:</strong> {recommendation}
            </Text>
          ) : null}
          {elementSelector ? (
            <Text variant="caption" color="text.secondary" component="code" sx={{ display: 'block' }}>
              {elementSelector}
            </Text>
          ) : null}
          {elementHtml ? (
            <Text
              variant="caption"
              color="text.secondary"
              component="pre"
              sx={{ margin: 0, marginBlockStart: 0.5, whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: 11 }}
            >
              {elementHtml}
            </Text>
          ) : null}
        </Wrapper>
        <Wrapper sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {onValidate && !auditorValidated ? (
            <Tooltip title="Validate finding">
              <IconButton size="small" color="success" onClick={() => onValidate(id)} aria-label="Validate finding">
                <Icon name="CheckCircle" fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : null}
          {onDelete ? (
            <Tooltip title="Delete finding">
              <IconButton size="small" color="error" onClick={() => onDelete(id)} aria-label="Delete finding">
                <Icon name="Delete" fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : null}
        </Wrapper>
      </Wrapper>
    </ContentCard>
  );
};

export default IssueCard;
