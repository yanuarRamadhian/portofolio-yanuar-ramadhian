import { build } from 'esbuild';
import fs from 'node:fs';

await build({
  entryPoints: ['src/app.jsx'],
  bundle: true,
  minify: true,
  sourcemap: true,
  outfile: 'Asset/dist/app.js',
  loader: { '.jsx': 'jsx' },
  jsx: 'automatic',
  target: ['es2020'],
  define: { 'process.env.NODE_ENV': '"production"' }
});

// Prepare production distribution folder for Vercel / static hosting
fs.mkdirSync('dist', { recursive: true });
fs.copyFileSync('index.html', 'dist/index.html');
fs.cpSync('Asset', 'dist/Asset', { recursive: true });

console.log('Portfolio built: dist/index.html + dist/Asset/ (production ready for Vercel)');
