import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', (m) => console.log('PAGE LOG>', m.text()));
  page.on('pageerror', (e) => console.error('PAGE ERROR>', e));

  const base = 'http://localhost:3000';
  console.log('Navigating to /demo');
  await page.goto(base + '/demo', { waitUntil: 'networkidle' });

  try {
    await page.waitForSelector('text=Customer Intent', { timeout: 5000 });
  } catch (e) {
    console.error('Demo did not render Customer Intent section:', e);
  }

  // Try to generate recommendations
  const gen = await page.$('text=Generate Recommendations');
  if (gen) { console.log('Clicking Generate Recommendations'); await gen.click(); await page.waitForTimeout(1000); }

  // Try to select a recommended model
  const select = await page.$('text=Select Model');
  if (select) { console.log('Clicking Select Model'); await select.click(); await page.waitForTimeout(1000); }

  // Advance through steps using persistent Next and other buttons
  for (let i = 0; i < 8; i++) {
    const next = await page.$('text=Next');
    if (!next) break;
    const disabled = await next.getAttribute('disabled');
    if (disabled !== null) break;
    console.log('Clicking Next (iteration)', i + 1);
    await next.click();
    await page.waitForTimeout(800);
  }

  // Try to save scenario
  const save = await page.$('text=Save Scenario');
  if (save) { console.log('Clicking Save Scenario'); await save.click(); await page.waitForTimeout(500); }

  // Try downloading JSONs (triggering the Blob downloads)
  const dlPermit = await page.$('text=Download permit-pack.json');
  if (dlPermit) { console.log('Click Download permit-pack.json'); await dlPermit.click(); await page.waitForTimeout(500); }
  const dlInvestor = await page.$('text=Download investor-summary.json');
  if (dlInvestor) { console.log('Click Download investor-summary.json'); await dlInvestor.click(); await page.waitForTimeout(500); }

  // Fetch export endpoints
  const permitResp = await page.request.get(base + '/export/permit');
  console.log('/export/permit status', permitResp.status());
  const permitText = await permitResp.text();
  console.log('/export/permit length', permitText.length);

  const invResp = await page.request.get(base + '/export/investor');
  console.log('/export/investor status', invResp.status());
  const invText = await invResp.text();
  console.log('/export/investor length', invText.length);

  // Save artifacts for CI upload
  const fs = await import('fs');
  const artifactsDir = './artifacts';
  try { fs.mkdirSync(artifactsDir, { recursive: true }); } catch (e) { /* exists */ }
  // screenshot
  try {
    await page.screenshot({ path: `${artifactsDir}/demo-page.png`, fullPage: true });
  } catch (e) { console.error('screenshot failed', e); }
  // save export responses
  try { fs.writeFileSync(`${artifactsDir}/export-permit.json`, permitText); } catch (e) { console.error('write permit failed', e); }
  try { fs.writeFileSync(`${artifactsDir}/export-investor.json`, invText); } catch (e) { console.error('write investor failed', e); }

  await browser.close();
  console.log('E2E script finished');
})();
