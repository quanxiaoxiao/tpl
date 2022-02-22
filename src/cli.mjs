import fs from 'node:fs';
import os from 'node:os';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import shelljs from 'shelljs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import config from './config.mjs';
import create from './create.mjs';

const pkg = JSON.parse(fs.readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '..', 'package.json'), 'utf-8'));

if (!shelljs.test('-f', resolve(os.homedir(), config.configName))) {
  console.log(`\`${config.configName}\` is not found`);
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
      create(
        resolve(process.cwd(), argv.name),
        JSON.parse(fs.readFileSync(resolve(os.homedir(), config.configName))),
      );
    },
  )
  .demandCommand(1)
  .version(pkg.version)
  .parse();
