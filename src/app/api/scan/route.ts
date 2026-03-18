import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

interface ScanDependencies {
  chromium: { args: string[]; defaultViewport: object; executablePath: () => Promise<string> } | undefined;
  puppeteer: {
    launch: (opts: object) => Promise<{ newPage: () => Promise<unknown>; close: () => Promise<void> }>;
  };
  AxePuppeteer: new (page: unknown) => {
    analyze: () => Promise<{
      violations: unknown[];
      passes: unknown[];
      incomplete: unknown[];
      inapplicable: unknown[];
    }>;
  };
}

interface PageHandle {
  goto: (url: string, opts: object) => Promise<void>;
  $: (selector: string) => Promise<{ screenshot: (opts: object) => Promise<Uint8Array> } | null>;
}

const validateUrl = (url: unknown): NextResponse | null => {
  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'A valid URL is required' }, { status: 400 });
  }

  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
  }

  return null;
};

const LOCAL_CHROME_PATHS = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
];

const loadDependencies = (): ScanDependencies | NextResponse => {
  /* eslint-disable @typescript-eslint/no-require-imports */
  try {
    const puppeteer = require('puppeteer-core');
    const { AxePuppeteer } = require('@axe-core/puppeteer');

    let chromium: ScanDependencies['chromium'] | undefined;
    try {
      chromium = require('@sparticuz/chromium');
    } catch {
      /* @sparticuz/chromium not available — will fall back to local Chrome */
    }

    return { chromium, puppeteer, AxePuppeteer };
  } catch {
    return NextResponse.json(
      {
        error:
          'Scanning dependencies not installed. Run: npm install puppeteer-core @sparticuz/chromium @axe-core/puppeteer',
      },
      { status: 500 },
    );
  }
  /* eslint-enable @typescript-eslint/no-require-imports */
};

/**
 * Resolves the Chromium executable path. Uses @sparticuz/chromium in production,
 * falls back to a local Chrome/Chromium installation for development.
 * @param {ScanDependencies['chromium'] | undefined} chromium - The @sparticuz/chromium module, if available.
 * @returns {Promise<string>} The path to the Chromium executable.
 */
const resolveExecutablePath = async (chromium: ScanDependencies['chromium'] | undefined): Promise<string> => {
  if (chromium && process.env.NODE_ENV === 'production') {
    return chromium.executablePath();
  }

  const { existsSync } = await import('fs');
  const localPath = LOCAL_CHROME_PATHS.find((p) => existsSync(p));
  if (localPath) {
    return localPath;
  }

  if (chromium) {
    return chromium.executablePath();
  }

  throw new Error('No Chrome/Chromium executable found. Install Google Chrome or @sparticuz/chromium.');
};

const captureViolationScreenshots = async (
  pageObj: PageHandle,
  violations: Array<{ id: string; nodes: Array<{ target: string[] }> }>,
): Promise<Record<string, string>> => {
  const screenshotData: Record<string, string> = {};

  for (const violation of violations) {
    for (const node of violation.nodes) {
      const selector = node.target[0];
      if (typeof selector !== 'string') {
        continue;
      }

      try {
        const element = await pageObj.$(selector);
        if (element) {
          const screenshot = await element.screenshot({ type: 'png', encoding: 'binary' });
          const key = `${violation.id}__${selector}`;
          screenshotData[key] = Buffer.from(screenshot).toString('base64');
        }
      } catch {
        // Element may not be visible or have zero dimensions
      }
    }
  }

  return screenshotData;
};

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { url, captureScreenshots = true } = body;

    const urlError = validateUrl(url);
    if (urlError) {
      return urlError;
    }

    const deps = loadDependencies();
    if (deps instanceof NextResponse) {
      return deps;
    }

    const { chromium, puppeteer, AxePuppeteer } = deps;
    const executablePath = await resolveExecutablePath(chromium);
    const isServerless = chromium !== undefined && process.env.NODE_ENV === 'production';

    const browser = await puppeteer.launch({
      args: isServerless ? chromium.args : ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: isServerless ? chromium.defaultViewport : { width: 1280, height: 720 },
      executablePath,
      headless: true,
    });

    try {
      const page = await (browser as { newPage: () => Promise<unknown> }).newPage();
      const pageObj = page as PageHandle;
      await pageObj.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

      const results = await new AxePuppeteer(page).analyze();

      const screenshotData = captureScreenshots
        ? await captureViolationScreenshots(
            pageObj,
            results.violations as Array<{ id: string; nodes: Array<{ target: string[] }> }>,
          )
        : {};

      return NextResponse.json({
        violations: results.violations,
        passes: results.passes.length,
        incomplete: results.incomplete.length,
        inapplicable: results.inapplicable.length,
        screenshots: screenshotData,
        scannedAt: new Date().toISOString(),
      });
    } finally {
      await (browser as { close: () => Promise<void> }).close();
    }
  } catch (error) {
    console.error('Scan failed:', error);
    return NextResponse.json(
      { error: 'Scan failed. Make sure the URL is accessible and scanning dependencies are installed.' },
      { status: 500 },
    );
  }
};
