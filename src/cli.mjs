import os from 'node:os';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';
import shelljs from 'shelljs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { CONFIG_NAME } from './constants.mjs';
import create from './create.mjs';
import pull from './pull.mjs';
import diff from './diff.mjs';
import push from './push.mjs';
import upload from './upload.mjs';
import getLocalConfig from './lib/getLocalConfig.mjs';

const pkg = JSON.parse(readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '..', 'package.json'), 'utf-8'));

if (!shelljs.test('-f', resolve(os.homedir(), CONFIG_NAME))) {
  console.log(`global config \`${chalk.red(CONFIG_NAME)}\` not found`);
  process.exit(1);
}

yargs(hideBin(process.argv))
  .command(
    'node [name]',
    'create node project',
    (_) => {
      _.option('name', {
        demandOption: true,
        type: 'string',
        describe: 'project name',
      });
    },
    (argv) => {
      const data = JSON.parse(readFileSync(resolve(os.homedir(), CONFIG_NAME)));
      if (!data.resources.node) {
        console.log(`no match config \`${chalk.red('node')}\``);
        process.exit(1);
      }
      create(
        resolve(process.cwd(), argv.name),
        {
          ...data,
          resources: data.resources.node,
        },
      );
    },
  )
  .command(
    'pull',
    'pull resource',
    () => {
      const locationConfig = getLocalConfig();
      pull(locationConfig);
    },
  )
  .command(
    'upload',
    'upload local resource',
    () => {
      const locationConfig = getLocalConfig();
      upload(locationConfig, (resourcesNew) => {
        writeFileSync(locationConfig.path, JSON.stringify({
          ...JSON.parse(readFileSync(locationConfig.path)),
          resources: resourcesNew,
        }, null, 2));
      });
    },
  )
  .command(
    'diff',
    'compare resource at store',
    () => {
      const locationConfig = getLocalConfig();
      diff(locationConfig);
    },
  )
  .command(
    'push',
    'upload resource to store',
    () => {
      const locationConfig = getLocalConfig();
      push(locationConfig);
    },
  )
  .demandCommand(1)
  .version(pkg.version)
  .parse();
