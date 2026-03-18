'use client';

import type { FC } from 'react';

import { useMemo } from 'react';

import type { SamplePageFormValues } from './step-sample-pages.schema';

import Button from '@/components/atoms/button/Button';
import ContentCard from '@/components/atoms/content-card/ContentCard';
import FormSelect from '@/components/atoms/form-select/FormSelect';
import FormTextField from '@/components/atoms/form-text-field/FormTextField';
import Form from '@/components/atoms/form/Form';
import Heading from '@/components/atoms/heading/Heading';
import LayoutGrid from '@/components/atoms/layout-grid/LayoutGrid';
import Text from '@/components/atoms/text/Text';
import Wrapper from '@/components/atoms/wrapper/Wrapper';
import SamplePageCard from '@/components/molecules/sample-page-card/SamplePageCard';
import { addSamplePage, removeSamplePage, selectSamplePages, updateSamplePage } from '@/redux/slices/audit';
import { useAppDispatch, useAppSelector } from '@/redux/store';

import { AUDIT_MODE_OPTIONS, DEFAULT_VALUES, SAMPLE_TYPE_OPTIONS } from './step-sample-pages.constants';
import { samplePageResolver } from './step-sample-pages.schema';

const StepSamplePages: FC = () => {
  const dispatch = useAppDispatch();
  const samplePages = useAppSelector(selectSamplePages);

  const formSettings = useMemo(
    () => ({
      resolver: samplePageResolver,
      defaultValues: DEFAULT_VALUES,
    }),
    [],
  );

  const handleAddPage = (data: SamplePageFormValues) => {
    dispatch(
      addSamplePage({
        ...data,
        isTested: false,
        sortOrder: 0,
      }),
    );
  };

  const handleRemovePage = (index: number) => {
    dispatch(removeSamplePage(index));
  };

  const handleUpdatePage = (index: number, updates: Record<string, unknown>) => {
    dispatch(updateSamplePage({ index, updates }));
  };

  return (
    <Wrapper>
      <Heading tag="h2" size="h6" gutterBottom>
        Sample Pages
      </Heading>
      <Text variant="body2" color="text.secondary" sx={{ marginBlockEnd: 3 }}>
        Add the pages that will be evaluated. Categorize each as structured (intentionally selected) or random, and
        choose the audit mode.
      </Text>

      {samplePages.map((page, index) => (
        <SamplePageCard
          key={index}
          title={page.title}
          url={page.url}
          sampleType={page.sampleType}
          auditMode={page.auditMode}
          index={index}
          onUpdate={handleUpdatePage}
          onRemove={handleRemovePage}
        />
      ))}

      <ContentCard variant="outlined" sx={{ borderStyle: 'dashed' }}>
        <Text variant="subtitle2" fontWeight={600} sx={{ marginBlockEnd: 2 }}>
          Add New Sample Page
        </Text>
        <Form<SamplePageFormValues> onSubmit={handleAddPage} formSettings={formSettings}>
          <LayoutGrid container spacing={2} alignItems="flex-end">
            <LayoutGrid size={{ xs: 12, sm: 3 }}>
              <FormTextField<SamplePageFormValues>
                name="title"
                label="Page Title"
                fullWidth
                size="small"
                placeholder="e.g., Homepage"
              />
            </LayoutGrid>
            <LayoutGrid size={{ xs: 12, sm: 3 }}>
              <FormTextField<SamplePageFormValues>
                name="url"
                label="URL"
                fullWidth
                size="small"
                placeholder="https://example.com"
              />
            </LayoutGrid>
            <LayoutGrid size={{ xs: 6, sm: 2 }}>
              <FormSelect<SamplePageFormValues>
                name="sampleType"
                label="Sample Type"
                options={SAMPLE_TYPE_OPTIONS}
                size="small"
              />
            </LayoutGrid>
            <LayoutGrid size={{ xs: 6, sm: 2 }}>
              <FormSelect<SamplePageFormValues>
                name="auditMode"
                label="Audit Mode"
                options={AUDIT_MODE_OPTIONS}
                size="small"
              />
            </LayoutGrid>
            <LayoutGrid size={{ xs: 12, sm: 2 }}>
              <Button type="submit" variant="contained" fullWidth>
                Add
              </Button>
            </LayoutGrid>
          </LayoutGrid>
        </Form>
      </ContentCard>
    </Wrapper>
  );
};

export default StepSamplePages;
