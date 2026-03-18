'use client';

import type { FC } from 'react';

import { useMemo, useState } from 'react';

import type { FindingFormValues } from './finding-form.schema';
import type { FindingFormProps } from './finding-form.types';

import FormSelect from '@/components/atoms/form-select/FormSelect';
import FormTextField from '@/components/atoms/form-text-field/FormTextField';
import Form from '@/components/atoms/form/Form';
import LayoutGrid from '@/components/atoms/layout-grid/LayoutGrid';
import Wrapper from '@/components/atoms/wrapper/Wrapper';

import { DEFAULT_VALUES, PRIORITY_OPTIONS } from './finding-form.constants';
import { findingResolver } from './finding-form.schema';
import FindingFormSubmitButton from './FindingFormSubmitButton';

const FindingForm: FC<FindingFormProps> = ({ onSubmit, initialValues, submitLabel = 'Add Finding' }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSettings = useMemo(
    () => ({
      resolver: findingResolver,
      defaultValues: { ...DEFAULT_VALUES, ...initialValues },
    }),
    [initialValues],
  );

  const handleSubmit = async (data: FindingFormValues) => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    await onSubmit(data);
    setIsSubmitting(false);
  };

  return (
    <Wrapper>
      <Form<FindingFormValues> onSubmit={handleSubmit} formSettings={formSettings}>
        <LayoutGrid container spacing={2}>
          <LayoutGrid size={{ xs: 12 }}>
            <FormTextField<FindingFormValues>
              name="description"
              label="Issue Description"
              fullWidth
              size="small"
              multiline
              minRows={2}
              required
            />
          </LayoutGrid>
          <LayoutGrid size={{ xs: 12 }}>
            <FormTextField<FindingFormValues>
              name="recommendation"
              label="Recommendation"
              fullWidth
              size="small"
              multiline
              minRows={2}
            />
          </LayoutGrid>
          <LayoutGrid size={{ xs: 12, sm: 4 }}>
            <FormSelect<FindingFormValues> name="priority" label="Priority" options={PRIORITY_OPTIONS} size="small" />
          </LayoutGrid>
          <LayoutGrid size={{ xs: 12, sm: 4 }}>
            <FormTextField<FindingFormValues>
              name="elementSelector"
              label="CSS Selector"
              fullWidth
              size="small"
              placeholder="e.g. #main > img.hero"
            />
          </LayoutGrid>
          <LayoutGrid size={{ xs: 12, sm: 4 }}>
            <FormTextField<FindingFormValues>
              name="elementHtml"
              label="Element HTML"
              fullWidth
              size="small"
              placeholder='e.g. <img src="..." />'
            />
          </LayoutGrid>
          <LayoutGrid size={{ xs: 12 }}>
            <FindingFormSubmitButton label={submitLabel} isSubmitting={isSubmitting} />
          </LayoutGrid>
        </LayoutGrid>
      </Form>
    </Wrapper>
  );
};

export default FindingForm;
