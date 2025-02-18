import assert from 'node:assert';
import fs from 'node:fs';

import {
  getValueOfPathList,
  hasDataKey,
  template,
} from '@quanxiaoxiao/utils';
import chalk from 'chalk';
import shelljs from 'shelljs';

import resources from './resources.mjs';

export default (type, configPathname) => {
  if (!shelljs.test('-f', configPathname)) {
    console.log(`config \`${chalk.red(configPathname)}\` not found`);
    process.exit(1);
  }
  const config = JSON.parse(fs.readFileSync(configPathname));
  assert(hasDataKey(resources, type));
  const requestUrl = template(getValueOfPathList(resources[type].pathname)(config))(config);
  assert(requestUrl);
  return requestUrl;
};
