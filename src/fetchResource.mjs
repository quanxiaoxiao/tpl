import assert from 'node:assert';

import {
  hasDataKey,
} from '@quanxiaoxiao/utils';
import chalk from 'chalk';
import shelljs from 'shelljs';
import { $ } from 'zx';

import getResourceUrl from './getResourceUrl.mjs';
import resources from './resources.mjs';

export default async (type, configPathname) => {
  if (!shelljs.test('-f', configPathname)) {
    console.log(`config \`${chalk.red(configPathname)}\` not found`);
    process.exit(1);
  }
  assert(hasDataKey(resources, type));
  const requestUrl = getResourceUrl(type, configPathname);
  const resultWithRequest = await $`curl -s ${requestUrl}`;
  return resultWithRequest.stdout;
};
