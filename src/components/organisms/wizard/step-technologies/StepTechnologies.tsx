'use client';

import type { FC } from 'react';

import FormGroup from '@/components/atoms/form-group/FormGroup';
import Heading from '@/components/atoms/heading/Heading';
import Text from '@/components/atoms/text/Text';
import Wrapper from '@/components/atoms/wrapper/Wrapper';
import TechnologyCheckbox from '@/components/molecules/technology-checkbox/TechnologyCheckbox';
import { selectTechnologies, toggleTechnology } from '@/redux/slices/audit';
import { useAppDispatch, useAppSelector } from '@/redux/store';

import { TECHNOLOGY_OPTIONS } from './step-technologies.constants';

const StepTechnologies: FC = () => {
  const dispatch = useAppDispatch();
  const selected = useAppSelector(selectTechnologies);

  return (
    <Wrapper>
      <Heading tag="h2" size="h6" gutterBottom>
        Relied-Upon Technologies
      </Heading>
      <Text variant="body2" color="text.secondary" sx={{ marginBlockEnd: 3 }}>
        Select the web technologies the digital product relies upon for providing its content. This corresponds to
        WCAG-EM Step 2.4.
      </Text>

      <FormGroup>
        {TECHNOLOGY_OPTIONS.map((tech) => (
          <TechnologyCheckbox
            key={tech.id}
            id={tech.id}
            label={tech.label}
            url={tech.url}
            checked={selected.includes(tech.id)}
            onChange={() => dispatch(toggleTechnology(tech.id))}
          />
        ))}
      </FormGroup>
    </Wrapper>
  );
};

export default StepTechnologies;
