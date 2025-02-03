import {
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { dirname,resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import chalk from 'chalk';
import shelljs from 'shelljs';

const configBase = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'templates', 'react');

const resources = {
  index: resolve(configBase, 'index.js'),
  component: resolve(configBase, 'Component.js'),
  reduxComponent: resolve(configBase, 'ReduxComponent.js'),
  context: resolve(configBase, 'Context.js'),
  useStore: resolve(configBase, 'useStore.js'),
  reducer: resolve(configBase, 'reducer.js'),
  useRedux: resolve(configBase, 'useRedux.js'),
};

const generateFile = (target, str, name) => {
  if (!shelljs.test('-f', target)) {
    writeFileSync(target, str.replace(/{{[^}]+}}/g, name), 'utf-8');
    console.log(`generate file \`${chalk.green(target)}\``);
  } else {
    console.log(`file \`${chalk.red(target)}\` already exit`);
  }
};

export default ({
  type,
  path,
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
  } else {
    shelljs.mkdir('-p', targetDir);
    console.log(`create dir \`${chalk.green(targetDir)}\``);
  }
  generateFile(
    resolve(targetDir, 'index.js'),
    readFileSync(resources.index, 'utf-8'),
    name,
  );
  if (type === 'memo') {
    generateFile(
      resolve(targetDir, `${name}.js`),
      readFileSync(resources.component, 'utf-8'),
      name,
    );
  }
  if (type === 'reducer') {
    generateFile(
      resolve(targetDir, `${name}.js`),
      readFileSync(resources.reduxComponent, 'utf-8'),
      name,
    );
    generateFile(
      resolve(targetDir, 'Context.js'),
      readFileSync(resources.context, 'utf-8'),
      name,
    );
    generateFile(
      resolve(targetDir, 'useStore.js'),
      readFileSync(resources.useStore, 'utf-8'),
      name,
    );
    generateFile(
      resolve(targetDir, 'reducer.js'),
      readFileSync(resources.reducer, 'utf-8'),
      name,
    );
    generateFile(
      resolve(targetDir, 'useRedux.js'),
      readFileSync(resources.useRedux, 'utf-8'),
      name,
    );
  }
};
