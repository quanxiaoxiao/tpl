import { resolve } from 'node:path';

import chalk from 'chalk';
import shelljs from 'shelljs';

import fetchResource from './fetchResource.mjs';
import writeFile from './writeFile.mjs';

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
  writeFile(
    resolve(targetDir, 'index.js'),
    resourceWithIndex,
    name,
  );
  if (type === 'memo') {
    const resourceWithComponent = await fetchResource('reactComponent', configPathname);
    writeFile(
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
    writeFile(
      resolve(targetDir, `${name}.js`),
      resourceWithContainer,
      name,
    );
    writeFile(
      resolve(targetDir, 'Context.js'),
      resourceWithContext,
      name,
    );
    writeFile(
      resolve(targetDir, 'useStore.js'),
      resourceWithUseStore,
      name,
    );
    writeFile(
      resolve(targetDir, 'useRedux.js'),
      resourceWithUseRedux,
      name,
    );
  }
};
