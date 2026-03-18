'use client';

import type { NextStepsContactFormValues } from '@/components/organisms/wizard/step-next-steps/step-next-steps.schema';
import type { FC } from 'react';

import { useMemo } from 'react';

import type { ContactFormCardProps } from './contact-form-card.types';

import FormTextField from '@/components/atoms/form-text-field/FormTextField';
import Form from '@/components/atoms/form/Form';
import Text from '@/components/atoms/text/Text';
import Wrapper from '@/components/atoms/wrapper/Wrapper';
import { nextStepsContactResolver } from '@/components/organisms/wizard/step-next-steps/step-next-steps.schema';

const ContactFormCard: FC<ContactFormCardProps> = ({
  ownerContactPhone,
  ownerContactEmail,
  ownerContactAddress,
  onContactChange,
}) => {
  const formSettings = useMemo(
    () => ({
      resolver: nextStepsContactResolver,
      values: { ownerContactPhone, ownerContactEmail, ownerContactAddress },
    }),
    [ownerContactPhone, ownerContactEmail, ownerContactAddress],
  );

  return (
    <>
      <Text variant="subtitle2" fontWeight={600} sx={{ marginBlockEnd: 1 }}>
        Website Owner Contact Details
      </Text>
      <Text variant="body2" color="text.secondary" sx={{ marginBlockEnd: 2 }}>
        Required for the accessibility statement. A dedicated <code>accessibility@</code> email address is recommended
        so that specialized staff can address questions from people with disabilities. The WAD (public sector) legally
        requires a specific accessibility email; for the EAA (private sector) this is strongly recommended.
      </Text>

      <Form<NextStepsContactFormValues> onChange={onContactChange} formSettings={formSettings}>
        <Wrapper sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', marginBlockEnd: 3 }}>
          <FormTextField<NextStepsContactFormValues>
            name="ownerContactPhone"
            label="Phone"
            size="small"
            placeholder="+12 34 567 89 00"
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ minInlineSize: 200 }}
          />
          <FormTextField<NextStepsContactFormValues>
            name="ownerContactEmail"
            label="Accessibility Email"
            size="small"
            placeholder="accessibility@example.org"
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ minInlineSize: 280 }}
          />
          <FormTextField<NextStepsContactFormValues>
            name="ownerContactAddress"
            label="Postal Address"
            size="small"
            placeholder="PO Box 1, 234 Example Ville"
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ minInlineSize: 280 }}
          />
        </Wrapper>
      </Form>
    </>
  );
};

export default ContactFormCard;
