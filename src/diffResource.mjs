import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import process from 'node:process';

import { template } from '@quanxiaoxiao/utils';
import chalk from 'chalk';
import * as Diff from 'diff';
import shelljs from 'shelljs';

import fetchResource from './fetchResource.mjs';
import getResourceTargetByName from './getResourceTargetByName.mjs';
import resources from './resources.mjs';

export default async (type) => {
  const resourceTarget = getResourceTargetByName(type);
  assert(resourceTarget.localPath);
  const targetPathname = template(resources[type].localPath)({
    home: os.homedir(),
    pwd: process.cwd(),
  });
  const dataWithDest = await fetchResource(type);
  let diffLine = [];
  if (shelljs.test('-f', targetPathname)) {
    const dataWithSrouce = fs.readFileSync(targetPathname, 'utf-8');
    diffLine = Diff.diffLines(dataWithSrouce, dataWithDest);
  } else {
    diffLine = Diff.diffLines('', dataWithDest);
  }
  for (let i = 0; i < diffLine.length; i++) {
    const item = diffLine[i];
    if (item.added) {
      process.stdout.write(chalk.green(item.value));
    }
    if (item.removed) {
      process.stdout.write(chalk.red(item.value));
    }
  }
};
