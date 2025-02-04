import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { template } from '@quanxiaoxiao/utils';
import chalk from 'chalk';
import shelljs from 'shelljs';

import fetchResource from './fetchResource.mjs';

const generateFile = (target, str, name) => {
  if (!shelljs.test('-f', target)) {
    writeFileSync(target, template(str)({ name }));
    console.log(`generate file \`${chalk.green(target)}\``);
  } else {
    console.log(`file \`${chalk.red(target)}\` already exit`);
  }
};

export default async ({
  type,
  path,
  configPathname,
}) => {
  const fileNameMatches = path.match(/\/?([A-Z]\w+)$/);
  if (!fileNameMatches) {
    console.warn(`\`${chalk.red(path)}\` invalid`);
    process.exit(1);
  }
  const name = fileNameMatches[1];
  const targetDir = path;
  if (shelljs.test('-d', targetDir)) {
    console.warn(`\`${chalk.red(targetDir)}\` alread exist`);
    process.exit(1);
  }
  shelljs.mkdir('-p', targetDir);
  console.log(`create dir \`${chalk.green(targetDir)}\``);
  const resourceWithIndex = await fetchResource('reactComponentIndex', configPathname);
  generateFile(
    resolve(targetDir, 'index.js'),
    resourceWithIndex,
    name,
  );
  if (type === 'memo') {
    const resourceWithComponent = await fetchResource('reactComponent', configPathname);
    generateFile(
      resolve(targetDir, `${name}.js`),
      resourceWithComponent,
      name,
    );
  } else if (type === 'redux') {
    const [
      resourceWithContext,
      resourceWithContainer,
      resourceWithUseStore,
      resourceWithUseRedux,
    ] = await Promise.all([
      fetchResource('reactContext', configPathname),
      fetchResource('reactContainer', configPathname),
      fetchResource('reactUseStore', configPathname),
      fetchResource('reactUseRedux', configPathname),
    ]);
    generateFile(
      resolve(targetDir, `${name}.js`),
      resourceWithContainer,
      name,
    );
    generateFile(
      resolve(targetDir, 'Context.js'),
      resourceWithContext,
      name,
    );
    generateFile(
      resolve(targetDir, 'useStore.js'),
      resourceWithUseStore,
      name,
    );
    generateFile(
      resolve(targetDir, 'useRedux.js'),
      resourceWithUseRedux,
      name,
    );
  }
};
