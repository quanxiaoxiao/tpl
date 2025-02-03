import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

export default () => {
  const __dirname = path.resolve(url.fileURLToPath(import.meta.url), '..', '..');
  const pkg = fs.readFileSync(path.resolve(__dirname, 'package.json'));
  return JSON.parse(pkg);
};
