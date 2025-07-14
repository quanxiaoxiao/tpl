import assert from 'node:assert';
import os from 'node:os';
import process from 'node:process';

import { template } from '@quanxiaoxiao/utils';
import chalk from 'chalk';
import shelljs from 'shelljs';
import { $ } from 'zx';

import getResourceUrl from './getResourceUrl.mjs';
import resources from './resources.mjs';

export default async (type, configPathname) => {
  assert(resources[type] && resources[type].localPath);
  const targetPathname = template(resources[type].localPath)({
    home: os.homedir(),
    pwd: process.cwd(),
  });
  if (!shelljs.test('-f', targetPathname)) {
    console.log(`${chalk.red(targetPathname)} not found`);
    process.exit(1);
  }
  const requestUrl = getResourceUrl(type, configPathname);
  await $`curl -s -X PUT --data-binary @${targetPathname} ${requestUrl}`;
};
