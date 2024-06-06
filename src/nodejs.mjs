import assert from 'node:assert';
import { writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import _ from 'lodash';
import ora from 'ora';
import shelljs from 'shelljs';
import chalk from 'chalk';
import { getFileList } from '@quanxiaoxiao/node-utils';
import getPackageInfo from './getPackageInfo.mjs';

const basePath = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const configResources = {
  'eslint.config.mjs': resolve(basePath, 'eslint.config.mjs'),
  '.editorconfig': resolve(basePath, '.editorconfig'),
  '.gitignore': resolve(basePath, '.gitignore'),
};

const installPackage = async (targetDir, packages, isDev) => {
  if (!_.isEmpty(packages)) {
    console.log(`will add ${isDev ? 'devDependencies' : 'dependencies'} \`${chalk.green(packages.sort((a, b) => {
      if (a === b) {
        return 0;
      }
      if (a > b) {
        return 1;
      }
      return -1;
    }).join(' '))}\``);
    await new Promise((resolve) => {
      const install = spawn('npm', ['install', ...isDev ? ['--save-dev'] : [], ...packages], {
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
        resolve();
      });
    });
  }
};

export default async (name, isHttpServer) => {
  const dependencyList = [];
  const targetDir = resolve(process.cwd(), name);
  if (shelljs.test('-d', targetDir)) {
    console.warn(`\`${chalk.red(targetDir)}\` alread exist`);
    process.exit(1);
  }
  shelljs.mkdir(targetDir);
  console.log(`create dir \`${chalk.green(targetDir)}\``);
  Object
    .keys(configResources)
    .forEach((resourceName) => {
      assert(shelljs.test('-f', configResources[resourceName]));
      shelljs.cp(configResources[resourceName], resolve(targetDir, resourceName));
      console.log(`create file \`${chalk.green(resourceName)}\``);
    });
  writeFileSync(resolve(targetDir, 'package.json'), JSON.stringify({
    name,
    version: '0.0.1',
    type: 'module',
    scripts: {
      ...isHttpServer ? { start: 'node src/index.mjs' } : {},
      test: 'node --test',
    },
    dependencies: {},
    devDependencies: {},
    engines: {
      node: '>= 20.0.0',
    },
  }, null, 2));
  console.log(`create file \`${chalk.green('package.json')}\``);
  if (isHttpServer) {
    shelljs.cp('-R', resolve(basePath, 'templates', 'http', 'src'), targetDir);
    writeFileSync(resolve(targetDir, '.env'), 'SERVER_PORT=3000\nNODE_ENV=development\n');
    console.log(`create file \`${chalk.green('.env')}\``);
    const fileList = getFileList(resolve(targetDir, 'src'));
    fileList.forEach((pathname) => {
      console.log(`create file \`${chalk.green(pathname.slice(targetDir.length))}\``);
    });
    dependencyList.push('@quanxiaoxiao/datav');
    dependencyList.push('@quanxiaoxiao/http-router');
    dependencyList.push('@quanxiaoxiao/httttp');
    dependencyList.push('@quanxiaoxiao/store');
    dependencyList.push('dotenv');
  } else {
    shelljs.mkdir(resolve(targetDir, 'src'));
    console.log(`create dir \`${chalk.green(resolve(targetDir, 'src'))}\``);
    writeFileSync(resolve(targetDir, 'src', 'index.mjs'), 'console.log(\'hello, world\');');
    console.log(`create file \`${chalk.green(resolve(targetDir, 'src', 'index.mjs'))}\``);
  }
  const devDependencyList = Object
    .keys(getPackageInfo().devDependencies)
  await installPackage(targetDir, devDependencyList, true);
  await installPackage(targetDir, dependencyList, false);
};
