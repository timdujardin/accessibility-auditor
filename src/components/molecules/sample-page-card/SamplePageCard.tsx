'use client';

import type { AuditMode, SampleType } from '@/@types/sample';
import type { FC } from 'react';

import type { SamplePageCardProps } from './sample-page-card.types';

import ContentCard from '@/components/atoms/content-card/ContentCard';
import IconButton from '@/components/atoms/icon-button/IconButton';
import Icon from '@/components/atoms/icon/Icon';
import LayoutGrid from '@/components/atoms/layout-grid/LayoutGrid';
import { SelectFormControl, SelectInput, SelectLabel, SelectOption } from '@/components/atoms/select-input/SelectInput';
import Tag from '@/components/atoms/tag/Tag';
import TextInput from '@/components/atoms/text-input/TextInput';
import Text from '@/components/atoms/text/Text';
import Tooltip from '@/components/atoms/tooltip/Tooltip';
import Wrapper from '@/components/atoms/wrapper/Wrapper';

const SamplePageCard: FC<SamplePageCardProps> = ({ title, url, sampleType, auditMode, index, onUpdate, onRemove }) => {
  return (
    <ContentCard sx={{ marginBlockEnd: 2 }}>
      <Wrapper sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBlockEnd: 2 }}>
        <Icon name="DragIndicator" color="disabled" />
        <Text variant="subtitle2" fontWeight={600} sx={{ flexGrow: 1 }}>
          {title || `Page ${index + 1}`}
        </Text>
        <Tag label={sampleType} size="small" variant="outlined" />
        <Tag label={auditMode} size="small" color="primary" variant="outlined" />
        <Tooltip title="Remove page">
          <IconButton
            size="small"
            color="error"
            onClick={() => onRemove(index)}
            aria-label={'Remove ' + (title || 'page ' + (index + 1))}
          >
            <Icon name="Delete" fontSize="small" />
          </IconButton>
        </Tooltip>
      </Wrapper>
      <LayoutGrid container spacing={2}>
        <LayoutGrid size={{ xs: 12, sm: 4 }}>
          <TextInput
            label="Page Title"
            fullWidth
            size="small"
            value={title}
            onChange={(e) => onUpdate(index, { title: e.target.value })}
          />
        </LayoutGrid>
        <LayoutGrid size={{ xs: 12, sm: 4 }}>
          <TextInput
            label="URL"
            fullWidth
            size="small"
            value={url}
            onChange={(e) => onUpdate(index, { url: e.target.value })}
          />
        </LayoutGrid>
        <LayoutGrid size={{ xs: 6, sm: 2 }}>
          <SelectFormControl fullWidth size="small">
            <SelectLabel>Sample Type</SelectLabel>
            <SelectInput
              value={sampleType}
              label="Sample Type"
              onChange={(e) => onUpdate(index, { sampleType: e.target.value as SampleType })}
            >
              <SelectOption value="structured">Structured</SelectOption>
              <SelectOption value="random">Random</SelectOption>
            </SelectInput>
          </SelectFormControl>
        </LayoutGrid>
        <LayoutGrid size={{ xs: 6, sm: 2 }}>
          <SelectFormControl fullWidth size="small">
            <SelectLabel>Audit Mode</SelectLabel>
            <SelectInput
              value={auditMode}
              label="Audit Mode"
              onChange={(e) => onUpdate(index, { auditMode: e.target.value as AuditMode })}
            >
              <SelectOption value="automated">Automated</SelectOption>
              <SelectOption value="full">Full (Manual)</SelectOption>
              <SelectOption value="both">Both</SelectOption>
            </SelectInput>
          </SelectFormControl>
        </LayoutGrid>
      </LayoutGrid>
    </ContentCard>
  );
};

export default SamplePageCard;
