import assert from 'node:assert';

import {
  hasDataKey,
} from '@quanxiaoxiao/utils';
import chalk from 'chalk';
import _ from 'lodash';

import resources from './resources.mjs';

export default (name) => {
  if (!hasDataKey(resources, name)) {
    console.warn(`unkown resource name ${chalk.red(name)}`);
    process.exit(1);
  }
  const resourceTarget = resources[name];
  assert(_.isPlainObject(resourceTarget));
  return resourceTarget;
};
