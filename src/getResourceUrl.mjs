import assert from 'node:assert';
import process from 'node:process';

import {
  getValueOfPathList,
  template,
} from '@quanxiaoxiao/utils';
import chalk from 'chalk';

import getConfig from './getConfig.mjs';
import getResourceTargetByName from './getResourceTargetByName.mjs';

export default (name) => {
  const config = getConfig();
  const resourceTarget = getResourceTargetByName(name);
  const resourceUrlWithDataKeyPath = resourceTarget.pathname;
  assert(Array.isArray(resourceUrlWithDataKeyPath));
  const requestUrl = getValueOfPathList(resourceUrlWithDataKeyPath)(config);
  if (!requestUrl) {
    console.log(`config ${chalk.red(resourceUrlWithDataKeyPath.join('.'))} unset`);
    process.exit(1);
  }
  return template(requestUrl)(config);
};
