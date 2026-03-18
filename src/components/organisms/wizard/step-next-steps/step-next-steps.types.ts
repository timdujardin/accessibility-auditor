export interface StepNextStepsProps {
  statementGuidance: string;
  ownerContactPhone: string;
  ownerContactEmail: string;
  ownerContactAddress: string;
  onUpdate: (updates: {
    statementGuidance?: string;
    ownerContactPhone?: string;
    ownerContactEmail?: string;
    ownerContactAddress?: string;
  }) => void;
}
