import {
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { spawn } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import {
  cwd,
  exit,
} from 'node:process';
import { fileURLToPath } from 'node:url';
import ora from 'ora';
import shelljs from 'shelljs';
import chalk from 'chalk';

const basePath = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const resources = {
  '.eslintrc': resolve(basePath, '.eslintrc'),
  '.babelrc': resolve(basePath, '.babelrc'),
  '.editorconfig': resolve(basePath, '.editorconfig'),
  '.gitignore': resolve(basePath, '.gitignore'),
};

export default (name) => {
  const pkg = JSON.parse(readFileSync(resolve(basePath, 'package.json'), 'utf-8'));
  const targetDir = resolve(cwd(), name);
  if (shelljs.test('-d', targetDir)) {
    console.warn(`\`${chalk.red(targetDir)}\` alread exist`);
    exit(1);
  }
  shelljs.mkdir(targetDir);
  console.log(`create dir \`${chalk.green(targetDir)}\``);
  Object
    .keys(resources)
    .forEach((resourceName) => {
      shelljs.cp(resources[resourceName], resolve(targetDir, resourceName));
      console.log(`create file \`${chalk.green(resourceName)}\``);
    });
  writeFileSync(resolve(targetDir, 'package.json'), JSON.stringify({
    name,
    version: '0.0.1',
    type: 'module',
    scripts: {},
    dependencies: {},
    devDependencies: {},
    engines: {
      node: '>= 14.18.0',
    },
  }, null, 2));
  console.log(`create file \`${chalk.green('package.json')}\``);
  shelljs.mkdir(resolve(targetDir, 'src'));
  console.log(`create dir \`${chalk.green(resolve(targetDir, 'src'))}\``);
  writeFileSync(resolve(targetDir, 'src', 'index.mjs'), 'console.log(\'hello, world\');');
  console.log(`create file \`${chalk.green(resolve(targetDir, 'src', 'index.mjs'))}\``);
  const dependencyList = Object
    .keys(pkg.devDependencies)
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