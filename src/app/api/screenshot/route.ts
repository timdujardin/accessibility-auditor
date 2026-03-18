import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { url, selector } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'A valid URL is required' }, { status: 400 });
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    /* eslint-disable @typescript-eslint/no-require-imports */
    let chromium: { args: string[]; defaultViewport: object; executablePath: () => Promise<string> };
    let puppeteer: { launch: (opts: object) => Promise<unknown> };

    try {
      chromium = require('@sparticuz/chromium');
      puppeteer = require('puppeteer-core');
    } catch {
      return NextResponse.json(
        { error: 'Scanning dependencies not installed. Run: npm install puppeteer-core @sparticuz/chromium' },
        { status: 500 },
      );
    }
    /* eslint-enable @typescript-eslint/no-require-imports */

    const browser = (await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: true,
    })) as {
      newPage: () => Promise<{
        goto: (url: string, opts: object) => Promise<void>;
        $: (s: string) => Promise<{ screenshot: (opts: object) => Promise<Uint8Array> } | null>;
        screenshot: (opts: object) => Promise<Uint8Array>;
      }>;
      close: () => Promise<void>;
    };

    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

      let screenshotBytes: Uint8Array;

      if (selector) {
        const element = await page.$(selector);
        if (element) {
          screenshotBytes = await element.screenshot({ type: 'png', encoding: 'binary' });
        } else {
          screenshotBytes = await page.screenshot({ type: 'png', encoding: 'binary', fullPage: true });
        }
      } else {
        screenshotBytes = await page.screenshot({ type: 'png', encoding: 'binary', fullPage: true });
      }

      return new Response(Buffer.from(screenshotBytes), {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': 'inline; filename="screenshot.png"',
        },
      });
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error('Screenshot failed:', error);
    return NextResponse.json({ error: 'Screenshot capture failed.' }, { status: 500 });
  }
};
