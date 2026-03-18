export interface ExecutiveSummaryCardProps {
  executiveSummary: string;
  isGenerating: boolean;
  aiError: string | null;
  onSummaryChange: (summary: string) => void;
  onGenerate: () => void;
}
