import chalk from 'chalk';
import shelljs from 'shelljs';
import { $, cd } from 'zx';

import loadResource from './loadResource.mjs';

export default async (path) => {
  const targetDir = path;
  if (shelljs.test('-d', targetDir)) {
    console.warn(`\`${chalk.red(targetDir)}\` alread exist`);
    process.exit(1);
  }
  shelljs.mkdir('-p', targetDir);
  console.log(`create dir: ${chalk.green(targetDir)}`);
  cd(targetDir);
  await $`npm init -y`;
  await $`mkdir src`;
  await $`echo "console.log('hello');" > src/index.mjs`;
  await loadResource('editorconfig');
  await loadResource('gitignore');
  await loadResource('eslint');
};
