import fs from 'node:fs';
import path from 'node:path';

import chalk from 'chalk';
import * as Diff from 'diff';
import shelljs from 'shelljs';

import fetchResource from './fetchResource.mjs';
import resources from './resources.mjs';

export default async (type, configPathname) => {
  const targetPathname = path.resolve(process.cwd(), resources[type].filename);
  const dataWithDest = await fetchResource(type, configPathname);
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
