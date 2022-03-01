import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import _ from 'lodash';
import shelljs from 'shelljs';
import { CONFIG_NAME } from './constants.mjs';

export default () => {
  const target = resolve(process.cwd(), CONFIG_NAME);
  if (!shelljs.test('-f', target)) {
    console.error(`config \`${target}\` is not found`);
    process.exit(1);
  }
  const { resources, url, entry } = JSON.parse(readFileSync(target));
  if (!url) {
    console.error('config url unset');
    process.exit(1);
  }

  if (!_.isPlainObject(resources)) {
    console.error('config resources unset or invalid');
    process.exit(1);
  }

  return {
    path: target,
    entry,
    resources,
    url,
  };
};
