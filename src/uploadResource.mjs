import assert from 'node:assert';
import os from 'node:os';
import process from 'node:process';

import { template } from '@quanxiaoxiao/utils';
import chalk from 'chalk';
import shelljs from 'shelljs';
import { $ } from 'zx';

import getResourceTargetByName from './getResourceTargetByName.mjs';
import getResourceUrl from './getResourceUrl.mjs';

export default async (type) => {
  const resourceTarget = getResourceTargetByName(type);
  assert(resourceTarget.localPath);
  const targetPathname = template(resourceTarget.localPath)({
    home: os.homedir(),
    pwd: process.cwd(),
  });
  if (!shelljs.test('-f', targetPathname)) {
    console.log(`${chalk.red(targetPathname)} not found`);
    process.exit(1);
  }
  const requestUrl = getResourceUrl(type);
  await $`curl -s -X PUT --data-binary @${targetPathname} ${requestUrl}`;
};
