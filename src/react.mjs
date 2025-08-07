import { resolve } from 'node:path';

import chalk from 'chalk';
import shelljs from 'shelljs';

import fetchResource from './fetchResource.mjs';
import writeFile from './writeFile.mjs';

const handleMemo = async (targetDir, name) => {
  const resourceWithComponent = await fetchResource('reactComponent');
  writeFile(
    resolve(targetDir, `${name}.js`),
    resourceWithComponent,
    name,
  );
};

const handleRedux = async (targetDir, name) => {
  const [
    resourceWithContext,
    resourceWithContainer,
    resourceWithUseStore,
    resourceWithUseRedux,
  ] = await Promise.all([
    fetchResource('reactContext'),
    fetchResource('reactContainer'),
    fetchResource('reactUseStore'),
    fetchResource('reactUseRedux'),
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
};

const writeIndexResource = async (targetDir, name) => {
  const resourceWithIndex = await fetchResource('reactComponentIndex');
  writeFile(
    resolve(targetDir, 'index.js'),
    resourceWithIndex,
    name,
  );
};

export default async ({
  type,
  path,
}) => {
  const fileNameMatches = path.match(/\/?([A-Z]\w+)$/);
  if (!fileNameMatches) {
    console.warn(`${chalk.red(path)} invalid`);
    process.exit(1);
  }
  const name = fileNameMatches[1];
  const targetDir = path;
  if (shelljs.test('-d', targetDir)) {
    console.warn(`${chalk.red(targetDir)} alread exist`);
    process.exit(1);
  }
  shelljs.mkdir('-p', targetDir);
  console.log(`create dir: ${chalk.green(targetDir)}`);
  await writeIndexResource(targetDir, name);
  if (type === 'memo') {
    await handleMemo(targetDir, name);
  } else if (type === 'redux') {
    await handleRedux(targetDir, name);
  }
};
