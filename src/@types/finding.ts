export type FindingPriority = 'critical' | 'major' | 'minor' | 'advisory';

export interface Finding {
  id: string;
  auditResultId: string;
  description: string;
  recommendation: string;
  priority: FindingPriority;
  elementSelector: string;
  elementHtml: string;
  fromAutomatedScan: boolean;
  auditorValidated: boolean;
  isUnresolvable: boolean;
  alternativeSolution: string;
  createdAt: string;
}

export interface FindingScreenshot {
  id: string;
  findingId: string;
  storagePath: string;
  altText: string;
  uploadedAt: string;
}
