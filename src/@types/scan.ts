export interface AxeViolationNode {
  target: string[];
  html: string;
  failureSummary: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
}

export interface AxeViolation {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  tags: string[];
  description: string;
  help: string;
  helpUrl: string;
  nodes: AxeViolationNode[];
}

export interface ScanResult {
  id: string;
  samplePageId: string;
  axeResults: {
    violations: AxeViolation[];
    passes: unknown[];
    incomplete: unknown[];
    inapplicable: unknown[];
  };
  screenshotPath: string;
  scannedAt: string;
}
