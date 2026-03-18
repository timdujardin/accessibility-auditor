import type { EvaluationOutcome, WcagCriterion } from '@/@types/criteria';
import type { ReactNode } from 'react';

export interface CriterionCardProps {
  criterion: WcagCriterion;
  outcome: EvaluationOutcome;
  observations: string;
  findingsCount: number;
  onOutcomeChange: (outcome: EvaluationOutcome) => void;
  onObservationsChange: (observations: string) => void;
  children?: ReactNode;
}
