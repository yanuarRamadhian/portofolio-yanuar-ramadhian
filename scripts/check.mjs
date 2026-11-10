import fs from 'node:fs';
import { execSync } from 'node:child_process';

console.log('Running checks...');
const required = [
  'index.html',
  'package.json',
  'scripts/build.mjs',
  'src/app.jsx',
  'src/styles.css',
  'src/data/projects.json',
  'src/data/brands.json',
  'Asset/img/renando-portrait.png',
  'Asset/cv/Renando_Editor_VFX.pdf.pdf'
];

for (const file of required) {
  if (!fs.existsSync(file)) {
    console.error(`Missing required file: ${file}`);
    process.exit(1);
  }
}

execSync('node scripts/build.mjs', { stdio: 'inherit' });
if (!fs.existsSync('Asset/dist/app.js') || !fs.existsSync('Asset/dist/app.css')) {
  console.error('Dist files missing!');
  process.exit(1);
}

console.log('All checks passed successfully.');
