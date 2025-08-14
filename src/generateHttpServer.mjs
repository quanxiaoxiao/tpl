import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';

import { template } from '@quanxiaoxiao/utils';
import chalk from 'chalk';
import shelljs from 'shelljs';

import fetchResource from './fetchResource.mjs';
import getResourceTargetByName from './getResourceTargetByName.mjs';

export default async () => {
  [
    'src',
    'src/store',
    'src/routes',
  ]
    .forEach((dirPahtname) => {
      if (!shelljs.test('-d', dirPahtname)) {
        shelljs.mkdir(dirPahtname);
        console.warn(`create dir: ${chalk.green(dirPahtname)}`);
      }
    });

  await [
    'nodejsLogger',
    'createHttpServer',
    'connectMongo',
    'nodejsStore',
    'nodejsInitialState',
    'nodejsSelector',
    'nodejsRoute',
    'nodejsEnv',
  ]
    .reduce(async (acc, resourceName) => {
      await acc;
      const resourceTarget = getResourceTargetByName(resourceName);
      if (!resourceTarget.localPath) {
        console.log(`resources ${chalk.red(resourceName)} localPath unset`);
        process.exit(1);
      }
      const resourcePathnameAtLocal = template(resourceTarget.localPath)({
        pwd: process.cwd(),
        home: os.homedir(),
      });
      if (!shelljs.test('-f', resourcePathnameAtLocal)) {
        const resourceContent = await fetchResource(resourceName);
        fs.writeFileSync(resourcePathnameAtLocal, resourceContent);
        console.warn(`create file: ${chalk.green(resourcePathnameAtLocal)}`);
      }
      if (resourceTarget.load) {
        await resourceTarget.load();
      }
    }, Promise.resolve);
  const projectPackagePathname = path.resolve(process.cwd(), 'package.json');
  const packageStr = fs.readFileSync(projectPackagePathname).toString();
  const packageJSON = JSON.parse(packageStr);
  if (!packageJSON.imports) {
    packageJSON.imports = {
      '#store.mjs': './src/store/store.mjs',
      '#selector.mjs': './src/store/selector.mjs',
      '#models.mjs': './src/models/index.mjs',
      '#logger.mjs': './src/logger.mjs',
      '#controllers/*': './src/controllers/*',
    };
  }
  if (!packageJSON.scripts || !packageJSON.scripts.start) {
    if (!packageJSON.scripts) {
      packageJSON.scripts = {};
    }
    packageJSON.scripts.start = 'node scr/createHttpServer.mjs';
  }
  if (JSON.stringify(JSON.parse(packageStr)) !== JSON.stringify(packageJSON)) {
    fs.writeFileSync(projectPackagePathname, JSON.stringify(packageJSON, null, 2));
  }
};
