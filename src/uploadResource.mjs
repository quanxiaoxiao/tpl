import path from 'node:path';
import process from 'node:process';

import chalk from 'chalk';
import shelljs from 'shelljs';
import { $ } from 'zx';

import getResourceUrl from './getResourceUrl.mjs';
import resources from './resources.mjs';

export default async (type, configPathname) => {
  const targetPathname = path.resolve(process.cwd(), resources[type].filename);
  if (!shelljs.test('-f', targetPathname)) {
    console.log(`${chalk.red(targetPathname)} not found`);
    process.exit(1);
  }
  const requestUrl = getResourceUrl(type, configPathname);
  await $`curl -s -X PUT --data-binary @${targetPathname} ${requestUrl}`;
};
