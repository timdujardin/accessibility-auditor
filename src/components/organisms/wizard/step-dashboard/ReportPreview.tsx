import type { FC } from 'react';

import type { ReportPreviewProps } from './report-preview.types';

import Accordion from '@/components/atoms/accordion/Accordion';
import Tag from '@/components/atoms/tag/Tag';
import Text from '@/components/atoms/text/Text';
import Wrapper from '@/components/atoms/wrapper/Wrapper';
import { pluralize } from '@/utils/format.util';

import ReportFindingCard from './ReportFindingCard';

/**
 * Collapsible report preview showing all findings grouped by sample page.
 * Intended as a client-deliverable overview within the audit dashboard step.
 * @param {ReportPreviewProps} props - The report page groups to display.
 * @returns {JSX.Element} An accordion with per-page sub-sections and finding cards.
 */
const ReportPreview: FC<ReportPreviewProps> = ({ reportPages }) => {
  const totalFindings = reportPages.reduce((sum, page) => sum + page.findings.length, 0);

  if (totalFindings === 0) {
    return null;
  }

  return (
    <Accordion
      defaultExpanded={false}
      summary={
        <Wrapper sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Text variant="subtitle1" fontWeight={700}>
            Report Preview
          </Text>
          <Tag
            label={`${totalFindings} ${pluralize(totalFindings, 'finding').split(' ').slice(1).join(' ')}`}
            size="small"
            color="primary"
          />
        </Wrapper>
      }
      sx={{ marginBlockEnd: 3 }}
    >
      <Text variant="body2" color="text.secondary" sx={{ marginBlockEnd: 2 }}>
        Client-deliverable overview of all findings per sample page, including screenshots and recommendations.
      </Text>

      {reportPages.map((page) => (
        <Accordion
          key={page.pageId}
          defaultExpanded
          summary={
            <Wrapper sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Text variant="subtitle2" fontWeight={600}>
                {page.pageTitle}
              </Text>
              <Text variant="caption" color="text.secondary">
                {page.pageUrl}
              </Text>
              <Tag label={pluralize(page.findings.length, 'finding')} size="small" variant="outlined" />
            </Wrapper>
          }
          sx={{ marginBlockEnd: 1, '&::before': { display: 'none' } }}
        >
          {page.findings.map((finding) => (
            <ReportFindingCard key={finding.id} finding={finding} />
          ))}
        </Accordion>
      ))}
    </Accordion>
  );
};

export default ReportPreview;
