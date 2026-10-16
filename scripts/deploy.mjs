// Builds the site for GitHub Pages and force-pushes dist/ to the gh-pages branch.
// Usage: npm run deploy
import { execSync } from 'node:child_process';
import fs from 'node:fs';

const SITE_URL = 'https://orasifhaber-web.github.io';
const remote = execSync('git remote get-url origin').toString().trim();
const run = (cmd, opts = {}) => execSync(cmd, { stdio: 'inherit', ...opts });

run('npx astro build', { env: { ...process.env, SITE_URL } });
run('node scripts/check.mjs');
fs.writeFileSync('dist/.nojekyll', '');
fs.rmSync('dist/.git', { recursive: true, force: true });
const git = (c) => run(`git ${c}`, { cwd: 'dist' });
git('init -q -b gh-pages');
git('add -A');
git('-c user.name="Or Asif-Haber" -c user.email="orasifhaber@gmail.com" commit -q -m "Deploy"');
git(`push -q -f ${remote} gh-pages`);
fs.rmSync('dist/.git', { recursive: true, force: true });
console.log(`Deployed → ${SITE_URL}/`);
