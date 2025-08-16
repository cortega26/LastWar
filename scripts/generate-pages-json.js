const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const repoRoot = path.join(__dirname, '..');
    const pagesDir = path.join(repoRoot, 'pages');
    const outputPath = path.join(repoRoot, 'assets', 'pages.json');

    const files = (await fs.promises.readdir(pagesDir)).filter(f => f.endsWith('.html'));
    const pages = [];
    for (const file of files) {
      const fullPath = path.join(pagesDir, file);
      const html = await fs.promises.readFile(fullPath, 'utf8');
      const match = html.match(/<title>([^<]*)<\/title>/i);
      if (!match) continue;
      const title = match[1].trim();
      pages.push({ title, href: `/pages/${file}` });
    }
    pages.sort((a, b) => a.title.localeCompare(b.title));
    const json = JSON.stringify(pages, null, 2) + '\n';

    let existing = null;
    try {
      existing = await fs.promises.readFile(outputPath, 'utf8');
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }

    if (existing !== null && existing === json) {
      // Up to date
      process.exit(0);
    }

    await fs.promises.writeFile(outputPath, json);

    if (existing !== null && existing !== json) {
      console.error('assets/pages.json is out of date.');
      process.exit(1);
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
