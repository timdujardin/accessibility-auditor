export interface EarlEvaluation {
  '@type': 'Evaluation';
  '@language': string;
  'dct:title': string;
  'dct:summary': string;
  'dct:creator': string | EarlAssertor;
  'dct:date': string;
  commissioner: string;
  'WCAG2:reliedupondef': EarlTechnology[];
  step1: EarlEvaluationScope;
  step2a: string;
  step2b: string;
  step2c: string;
  step2e: string;
  step3a: EarlSample;
  step3b: EarlSample;
  step4: EarlAssertion[];
  step5b: string;
}

export interface EarlEvaluationScope {
  '@type': 'EvaluationScope';
  'WCAG2:set-of-web-pagesdef': EarlWebSite;
  step1b: string;
  step1c: string;
  step1d: string;
}

export interface EarlWebSite {
  '@type': ('earl:TestSubject' | 'sch:WebSite')[];
  step1a: string;
  'sch:name': string;
}

export interface EarlSample {
  '@type': 'Sample';
  'WCAG2:webpagedef': EarlWebPage[];
}

export interface EarlWebPage {
  '@type': ('earl:TestSubject' | 'sch:WebPage')[];
  '@id': string;
  'dct:title': string;
  'dct:description': string;
  'dct:source': string;
  'reporter:tested': boolean;
}

export interface EarlAssertion {
  '@type': 'earl:Assertion';
  'earl:test': string;
  'earl:assertedBy': string;
  'earl:subject': string;
  'earl:result': EarlTestResult;
  'earl:mode': 'manual' | 'automatic';
  'dct:hasPart'?: EarlAssertion[];
}

export interface EarlTestResult {
  '@type': 'earl:TestResult';
  'earl:outcome': string;
  'dct:description': string;
}

export interface EarlAssertor {
  '@type': 'earl:Assertor';
  'foaf:name': string;
}

export interface EarlTechnology {
  '@type': 'WCAG2:technologydef';
  '@id': string;
  'dct:title': string;
}

// --- WCAG-EM Report Tool v3 format ---

export type OneOrMany<T> = T | T[];

export interface WcagEmWebPage {
  id: string;
  type: string | string[];
  title: string;
  description: string;
  date?: string;
}

export interface WcagEmTestRef {
  id: string;
  type?: string | string[];
}

export interface WcagEmOutcome {
  id: string;
  type?: string | string[];
  title?: string;
}

export interface WcagEmAssertionResult {
  outcome: WcagEmOutcome;
  description?: string;
  impact?: { id: string; type?: string; title?: string };
}

export interface WcagEmModeObject {
  type?: string;
  '@value': string;
}

export interface WcagEmAssertion {
  type: string;
  test: WcagEmTestRef;
  subject: WcagEmWebPage | { id: string };
  result: WcagEmAssertionResult;
  mode?: string | WcagEmModeObject;
  date?: string;
  hasPart?: OneOrMany<WcagEmAssertion>;
}

export interface WcagEmEvaluation {
  type: 'Evaluation';
  language?: string;
  reportToolVersion?: string;
  defineScope: {
    scope?: { title: string; description: string };
    conformanceTarget: string;
    accessibilitySupportBaseline?: string;
    wcagVersion?: string;
  };
  exploreTarget?: {
    technologiesReliedUpon?: OneOrMany<string>;
  };
  selectSample: {
    structuredSample: OneOrMany<WcagEmWebPage>;
    randomSample?: OneOrMany<WcagEmWebPage>;
  };
  auditSample: WcagEmAssertion[];
  reportFindings?: {
    title?: string;
    commissioner?: string;
    summary?: string;
    date?: string;
    evaluator?: string;
  };
}

/**
 * Normalizes a JSON-LD value that may be a single item or an array into a consistent array.
 * @param {OneOrMany<T> | undefined | null} value - The value to normalize.
 * @returns {T[]} An array containing the value(s), or an empty array if undefined/null.
 */
export const toArray = <T>(value: OneOrMany<T> | undefined | null): T[] => {
  if (value == null) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
};
