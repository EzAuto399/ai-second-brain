#!/usr/bin/env node
/**
 * Render social-preview.html → social-preview.png
 * Prefers system Chrome/Chromium; falls back to puppeteer if installed.
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const htmlPath = path.resolve(__dirname, 'social-preview.html');
const outPath = path.resolve(__dirname, 'social-preview.png');
const fileUrl = 'file://' + htmlPath;

const chromeCandidates = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  'google-chrome',
  'chromium',
  'chromium-browser',
].filter(Boolean);

function findChrome() {
  for (const c of chromeCandidates) {
    if (c.includes('/') && fs.existsSync(c)) return c;
    const which = spawnSync('which', [c], { encoding: 'utf8' });
    if (which.status === 0 && which.stdout.trim()) return which.stdout.trim();
  }
  return null;
}

async function renderWithPuppeteer(executablePath) {
  let puppeteer;
  try {
    puppeteer = require('puppeteer-core');
  } catch {
    try {
      puppeteer = require('puppeteer');
    } catch {
      throw new Error('Install puppeteer-core or puppeteer, or set CHROME_PATH');
    }
  }

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: executablePath || undefined,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 640, deviceScaleFactor: 2 });
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  const element = await page.$('.canvas');
  await element.screenshot({ path: outPath, omitBackground: false });
  await browser.close();
  console.log('Rendered:', outPath);
}

(async () => {
  const chrome = findChrome();
  if (!chrome) {
    console.error('No Chrome/Chromium found. Set CHROME_PATH or install Chrome.');
    process.exit(1);
  }
  await renderWithPuppeteer(chrome);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
