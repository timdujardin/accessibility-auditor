'use client';

import type { FC } from 'react';

import { useCallback } from 'react';

import type { FindingItemProps } from './step-manual-reporting.types';

import Wrapper from '@/components/atoms/wrapper/Wrapper';
import IssueCard from '@/components/molecules/issue-card/IssueCard';
import ScreenshotUploader from '@/components/molecules/screenshot-uploader/ScreenshotUploader';

import { handleUpload } from './step-manual-reporting.callbacks';

const FindingItem: FC<FindingItemProps> = ({ finding, existingScreenshots, onValidate, onDelete, onUpload }) => {
  const {
    id,
    description,
    recommendation,
    priority,
    element_selector,
    element_html,
    from_automated_scan,
    auditor_validated,
  } = finding;

  const onUploadScreenshot = useCallback(
    (path: string, alt: string) => handleUpload(id, onUpload, path, alt),
    [id, onUpload],
  );

  return (
    <Wrapper sx={{ marginBlockEnd: 1 }}>
      <IssueCard
        id={id}
        description={description}
        recommendation={recommendation}
        priority={priority}
        elementSelector={element_selector}
        elementHtml={element_html}
        fromAutomatedScan={from_automated_scan}
        auditorValidated={auditor_validated}
        onValidate={onValidate}
        onDelete={onDelete}
      />
      <ScreenshotUploader findingId={id} existingScreenshots={existingScreenshots} onUpload={onUploadScreenshot} />
    </Wrapper>
  );
};

export default FindingItem;
