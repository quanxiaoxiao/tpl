import assert from 'node:assert';
import { writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import ora from 'ora';
import shelljs from 'shelljs';
import chalk from 'chalk';
import getPackageInfo from './getPackageInfo.mjs';

const basePath = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const resources = {
  'eslint.config.mjs': resolve(basePath, 'eslint.config.mjs'),
  '.editorconfig': resolve(basePath, '.editorconfig'),
  '.gitignore': resolve(basePath, '.gitignore'),
};

export default (name) => {
  const targetDir = resolve(process.cwd(), name);
  if (shelljs.test('-d', targetDir)) {
    console.warn(`\`${chalk.red(targetDir)}\` alread exist`);
    process.exit(1);
  }
  shelljs.mkdir(targetDir);
  console.log(`create dir \`${chalk.green(targetDir)}\``);
  Object
    .keys(resources)
    .forEach((resourceName) => {
      assert(shelljs.test('-f', resources[resourceName]));
      shelljs.cp(resources[resourceName], resolve(targetDir, resourceName));
      console.log(`create file \`${chalk.green(resourceName)}\``);
    });
  writeFileSync(resolve(targetDir, 'package.json'), JSON.stringify({
    name,
    version: '0.0.1',
    type: 'module',
    scripts: {
      test: 'node --test',
    },
    dependencies: {},
    devDependencies: {},
    engines: {
      node: '>= 20.0.0',
    },
  }, null, 2));
  console.log(`create file \`${chalk.green('package.json')}\``);
  shelljs.mkdir(resolve(targetDir, 'src'));
  console.log(`create dir \`${chalk.green(resolve(targetDir, 'src'))}\``);
  writeFileSync(resolve(targetDir, 'src', 'index.mjs'), 'console.log(\'hello, world\');');
  console.log(`create file \`${chalk.green(resolve(targetDir, 'src', 'index.mjs'))}\``);
  const dependencyList = Object
    .keys(getPackageInfo().devDependencies)
    .sort((a, b) => {
      if (a === b) {
        return 0;
      }
      if (a > b) {
        return 1;
      }
      return -1;
    });
  console.log(`will add devDependencies \`${chalk.green(dependencyList.join(' '))}\``);
  const install = spawn('npm', ['install', '--save-dev', ...dependencyList], {
    cwd: targetDir,
  });
  const spinner = ora('install...').start();
  install.stdout.on('data', (data) => {
    console.log(data.toString());
    spinner.stop();
  });
  install.stderr.on('data', (data) => {
    console.error(data.toString());
    spinner.stop();
  });
  install.on('close', () => {
    spinner.stop();
  });
};
