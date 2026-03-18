import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export const POST = async (request: NextRequest) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { auditTitle, auditScope, stats } = body;

    const prompt = `You are an expert web accessibility auditor. Generate a concise executive summary (3-5 paragraphs) for the following WCAG accessibility audit report.

Audit: "${auditTitle}"
Scope: ${auditScope}
Conformance: ${stats.conformancePercentage}% of evaluated criteria conform (passed or not present)
Total findings: ${stats.totalFindings}
- Critical: ${stats.findingsByPriority?.critical ?? 0}
- Major: ${stats.findingsByPriority?.major ?? 0}
- Minor: ${stats.findingsByPriority?.minor ?? 0}
- Advisory: ${stats.findingsByPriority?.advisory ?? 0}

Top issues by WCAG principle:
${Object.entries(stats.findingsByPrinciple ?? {})
  .map(([p, count]) => `- ${p}: ${count} issues`)
  .join('\n')}

Write the summary in a professional tone suitable for a client-facing audit report. Include:
1. Overall conformance status
2. Key areas of concern
3. Positive observations (if conformance > 50%)
4. Recommended next steps

Do not include specific WCAG criterion numbers in the summary, keep it high-level.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      return NextResponse.json({ error: errorData.error?.message ?? 'Gemini API error' }, { status: response.status });
    }

    const data = await response.json();
    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('AI summary generation failed:', error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
};
