import fs from 'node:fs';
import url from 'node:url';
import path from 'node:path';

export default () => {
  const __dirname = path.resolve(url.fileURLToPath(import.meta.url), '..', '..');
  const pkg = fs.readFileSync(path.resolve(__dirname, 'package.json'));
  return JSON.parse(pkg);
};
