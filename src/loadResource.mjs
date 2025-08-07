import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';

import { template } from '@quanxiaoxiao/utils';
import chalk from 'chalk';
import shelljs from 'shelljs';

import fetchResource from './fetchResource.mjs';
import getResourceTargetByName from './getResourceTargetByName.mjs';

export default async (resourceTypeName, pathname) => {
  const resourceTarget = getResourceTargetByName(resourceTypeName);
  let name;
  let targetPathname;
  if (pathname) {
    assert(resourceTarget.filename);
    targetPathname = path.resolve(
      process.cwd(),
      pathname,
    );
    name = path.basename(pathname);
    targetPathname = path.resolve(
      path.dirname(targetPathname),
      template(resourceTarget.filename)({ name }),
    );
  } else {
    assert(resourceTarget.localPath);
    targetPathname = template(resourceTarget.localPath)({
      home: os.homedir(),
      pwd: process.cwd(),
    });
  }
  const data = await fetchResource(resourceTypeName);
  if (!shelljs.test('-d', path.dirname(targetPathname))) {
    shelljs.mkdir('-p', path.dirname(targetPathname));
    console.log(`create dir: ${chalk.green(path.dirname(targetPathname))}`);
  }
  if (shelljs.test('-f', targetPathname)) {
    console.log(`overwrite file: ${chalk.yellow(targetPathname)}`);
  } else {
    console.log(`create file: ${chalk.green(targetPathname)}`);
  }
  if (name) {
    fs.writeFileSync(targetPathname, template(data)({ name }));
  } else {
    fs.writeFileSync(targetPathname, data);
  }
  if (resourceTarget.load) {
    await resourceTarget.load();
  }
};
