'use client';

import type { FC } from 'react';

import type { ViolationListItemProps } from './violation-list-item.types';

import { getTestability } from '@/../config/automation.config';
import Button from '@/components/atoms/button/Button';
import Collapsible from '@/components/atoms/collapsible/Collapsible';
import Icon from '@/components/atoms/icon/Icon';
import Link from '@/components/atoms/link/Link';
import { ListItem, ListItemText } from '@/components/atoms/list/List';
import PriorityChip from '@/components/atoms/priority-chip/PriorityChip';
import Tag from '@/components/atoms/tag/Tag';
import TestabilityBadge from '@/components/atoms/testability-badge/TestabilityBadge';
import Text from '@/components/atoms/text/Text';
import Wrapper from '@/components/atoms/wrapper/Wrapper';
import { pluralize } from '@/utils/format.util';
import { getActRulesWithCriteria, getCannotVerifyItems, getViolationTestabilityInfo } from '@/utils/violations.util';
import { mapAxeImpactToPriority, mapAxeTagsToCriteria } from '@/utils/wcagMapping.util';

const ViolationListItem: FC<ViolationListItemProps> = ({
  violation,
  violationKey,
  isGapExpanded,
  isApproved,
  isDismissed,
  screenshots,
  onToggleGap,
  onApprove,
  onDismiss,
}) => {
  const { id: violationId, tags, impact, help, description, nodes } = violation;
  const criteria = mapAxeTagsToCriteria(tags);
  const priority = mapAxeImpactToPriority(impact);

  const testabilityInfo = getViolationTestabilityInfo(criteria);
  const cannotVerify = getCannotVerifyItems(testabilityInfo);
  const actRules = getActRulesWithCriteria(testabilityInfo);

  return (
    <ListItem
      sx={{
        alignItems: 'flex-start',
        paddingInline: 0,
        flexDirection: 'column',
        opacity: isDismissed ? 0.5 : 1,
        textDecoration: isDismissed ? 'line-through' : 'none',
      }}
    >
      <ListItemText
        sx={{ inlineSize: '100%' }}
        primary={
          <Wrapper sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <PriorityChip priority={priority} />
            <Text variant="body2" fontWeight={600}>
              {help}
            </Text>
            {criteria.map((c) => {
              const t = getTestability(c);

              return (
                <Wrapper key={c} sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                  <Tag label={c} size="small" variant="outlined" />
                  <TestabilityBadge level={t.level} />
                </Wrapper>
              );
            })}
            {isApproved ? (
              <Tag
                icon={<Icon name="CheckCircle" />}
                label="Approved"
                size="small"
                color="success"
                variant="outlined"
              />
            ) : null}
            {isDismissed ? (
              <Tag icon={<Icon name="Cancel" />} label="Dismissed" size="small" color="default" variant="outlined" />
            ) : null}
          </Wrapper>
        }
        secondary={
          <>
            <Text variant="body2" color="text.secondary" component="span">
              {description}
            </Text>
            <Text variant="caption" color="text.secondary" component="span" sx={{ display: 'block' }}>
              {pluralize(nodes.length, 'element')} affected
            </Text>
          </>
        }
      />

      {screenshots && nodes.length > 0 ? (
        <Wrapper sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', marginBlockStart: 1 }}>
          {nodes.map((node) => {
            const selector = node.target[0];
            const base64 = screenshots[`${violationId}__${selector}`];
            if (!base64) {
              return null;
            }

            return (
              <Wrapper
                key={selector}
                component="img"
                sx={{
                  maxInlineSize: 200,
                  maxBlockSize: 120,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  objectFit: 'contain',
                }}
                {...({ src: `data:image/png;base64,${base64}`, alt: `Screenshot of ${selector}` } as Record<
                  string,
                  string
                >)}
              />
            );
          })}
        </Wrapper>
      ) : null}

      {(onApprove ?? onDismiss) && !isApproved && !isDismissed ? (
        <Wrapper sx={{ display: 'flex', gap: 1, marginBlockStart: 1 }}>
          {onApprove ? (
            <Button
              size="small"
              variant="outlined"
              color="success"
              startIcon={<Icon name="CheckCircle" />}
              onClick={() => onApprove(violationKey)}
              sx={{ textTransform: 'none', fontSize: 12 }}
            >
              Approve
            </Button>
          ) : null}
          {onDismiss ? (
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              startIcon={<Icon name="Cancel" />}
              onClick={() => onDismiss(violationKey)}
              sx={{ textTransform: 'none', fontSize: 12 }}
            >
              Dismiss
            </Button>
          ) : null}
        </Wrapper>
      ) : null}

      {cannotVerify.length > 0 && (
        <Wrapper sx={{ inlineSize: '100%', marginBlockStart: 0.5 }}>
          <Button
            size="small"
            variant="text"
            startIcon={<Icon name="SmartToy" />}
            onClick={() => onToggleGap(isGapExpanded ? null : violationKey)}
            sx={{ textTransform: 'none', fontSize: 12 }}
          >
            {isGapExpanded ? 'Hide' : 'Show'} automation gap info
          </Button>
          <Collapsible in={isGapExpanded}>
            <Wrapper
              sx={{
                paddingInline: 2,
                paddingBlock: 1,
                marginBlockStart: 0.5,
                backgroundColor: 'warning.50',
                borderInlineStart: '3px solid',
                borderColor: 'warning.main',
                borderRadius: 1,
              }}
            >
              <Text variant="caption" fontWeight={600} color="warning.dark">
                What automated tools cannot verify:
              </Text>
              <Wrapper component="ul" sx={{ margin: 0, paddingInlineStart: 2 }}>
                {cannotVerify.map((item, i) => (
                  <Text key={i} component="li" variant="caption" color="text.secondary">
                    <strong>{item.criterionId}:</strong> {item.item}
                  </Text>
                ))}
              </Wrapper>

              {actRules.length > 0 && (
                <Wrapper sx={{ marginBlockStart: 1 }}>
                  <Text variant="caption" fontWeight={600} color="text.secondary">
                    Related ACT Rules:
                  </Text>
                  {actRules.map((rule, i) => (
                    <Wrapper key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Tag
                        label={rule.status}
                        size="small"
                        color={rule.status === 'approved' ? 'success' : 'default'}
                        variant="outlined"
                        sx={{ fontSize: 10, blockSize: 18 }}
                      />
                      <Tag
                        label={rule.implementation}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: 10, blockSize: 18 }}
                      />
                      <Link href={rule.url} target="_blank" rel="noopener noreferrer" variant="caption">
                        {rule.name}
                      </Link>
                    </Wrapper>
                  ))}
                </Wrapper>
              )}
            </Wrapper>
          </Collapsible>
        </Wrapper>
      )}
    </ListItem>
  );
};

export default ViolationListItem;
