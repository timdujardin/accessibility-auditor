import type { FC } from 'react';

import MuiStep from '@mui/material/Step';
import MuiStepLabel from '@mui/material/StepLabel';
import MuiStepper from '@mui/material/Stepper';

import type { StepperProps } from './stepper.types';

/**
 * Stepper component. Combines MUI Stepper, Step, StepLabel.
 * @param {StepperProps} props - Stepper configuration.
 * @returns {JSX.Element} A horizontal stepper with labeled steps.
 */
const Stepper: FC<StepperProps> = ({ steps, activeStep, sx }) => (
  <MuiStepper activeStep={activeStep} sx={sx}>
    {steps.map((step) => (
      <MuiStep key={step.label}>
        <MuiStepLabel>{step.label}</MuiStepLabel>
      </MuiStep>
    ))}
  </MuiStepper>
);

export default Stepper;
