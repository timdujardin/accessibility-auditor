'use client';

import type { FC } from 'react';

import type { ScanProgressCardProps } from './scan-progress-card.types';

import Button from '@/components/atoms/button/Button';
import Collapsible from '@/components/atoms/collapsible/Collapsible';
import ContentCard from '@/components/atoms/content-card/ContentCard';
import Divider from '@/components/atoms/divider/Divider';
import Icon from '@/components/atoms/icon/Icon';
import { List } from '@/components/atoms/list/List';
import ProgressBar from '@/components/atoms/progress-bar/ProgressBar';
import Tag from '@/components/atoms/tag/Tag';
import Text from '@/components/atoms/text/Text';
import Wrapper from '@/components/atoms/wrapper/Wrapper';
import ViolationListItem from '@/components/molecules/violation-list-item/ViolationListItem';

const ScanProgressCard: FC<ScanProgressCardProps> = ({
  pageId,
  title,
  url,
  result,
  isScanning,
  isExpanded,
  expandedViolationGap,
  approvedKeys,
  dismissedKeys,
  onScan,
  onToggleExpand,
  onToggleViolationGap,
  onApproveViolation,
  onDismissViolation,
}) => {
  return (
    <ContentCard variant="outlined" sx={{ marginBlockEnd: 2 }}>
      <Wrapper sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Wrapper sx={{ flexGrow: 1 }}>
          <Text variant="subtitle2" fontWeight={600}>
            {title}
          </Text>
          <Text variant="caption" color="text.secondary">
            {url}
          </Text>
        </Wrapper>

        {result ? (
          <Tag
            icon={<Icon name="CheckCircle" />}
            label={`${result.violations.length} violations`}
            color={result.violations.length === 0 ? 'success' : 'warning'}
            size="small"
          />
        ) : null}

        {!result && !isScanning && (
          <Button size="small" variant="outlined" startIcon={<Icon name="PlayArrow" />} onClick={onScan}>
            Scan
          </Button>
        )}

        {result && result.violations.length > 0 ? (
          <Button
            size="small"
            onClick={onToggleExpand}
            endIcon={isExpanded ? <Icon name="ExpandLess" /> : <Icon name="ExpandMore" />}
          >
            {isExpanded ? 'Collapse' : 'Details'}
          </Button>
        ) : null}
      </Wrapper>

      {isScanning ? <ProgressBar sx={{ marginBlockStart: 1 }} /> : null}

      {result ? (
        <Wrapper sx={{ display: 'flex', gap: 2, marginBlockStart: 1 }}>
          <Text variant="caption" color="success.main">
            {result.passesCount} passed
          </Text>
          <Text variant="caption" color="text.secondary">
            {result.inapplicableCount} not applicable
          </Text>
          <Text variant="caption" color="warning.main">
            {result.incompleteCount} incomplete
          </Text>
        </Wrapper>
      ) : null}

      <Collapsible in={isExpanded}>
        {result ? (
          <Wrapper sx={{ marginBlockStart: 2 }}>
            <Divider sx={{ marginBlockEnd: 1 }} />
            <List dense disablePadding>
              {result.violations.map((violation, vIdx) => {
                const vKey = `${pageId}-${vIdx}`;

                return (
                  <ViolationListItem
                    key={vIdx}
                    violation={violation}
                    violationKey={vKey}
                    isGapExpanded={expandedViolationGap === vKey}
                    isApproved={approvedKeys.includes(vKey)}
                    isDismissed={dismissedKeys.includes(vKey)}
                    screenshots={result.screenshots}
                    onToggleGap={onToggleViolationGap}
                    onApprove={onApproveViolation}
                    onDismiss={onDismissViolation}
                  />
                );
              })}
            </List>
          </Wrapper>
        ) : null}
      </Collapsible>
    </ContentCard>
  );
};

export default ScanProgressCard;
