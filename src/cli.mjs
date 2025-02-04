import os from 'node:os';
import path from 'node:path';
import process from 'node:process';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import diffResource from './diffResource.mjs';
// import generateTypeByNodejs from './nodejs.mjs';
import getPackageInfo from './getPackageInfo.mjs';
import loadResource from './loadResource.mjs';
import generateTypeByReact from './react.mjs';

yargs(hideBin(process.argv))
  .command(
    'config',
    'config...',
    (_) => {
      _
        .options({
          name: {
            type: 'string',
            choices: [
              'eslint',
              'gitignore',
              'editorconfig',
              'dockerfile',
              'docker-compose',
              'vimrc',
              'tmux.conf',
            ],
            demandOption: true,
          },
          load: {
            type: 'boolean',
          },
          diff: {
            type: 'boolean',
          },
          push: {
            type: 'boolean',
          },
        })
        .conflicts('load', 'diff')
        .conflicts('diff', 'push')
        .conflicts('load', 'push');
    },
    (argv) => {
      if (argv.diff) {
        diffResource(argv.name, path.resolve(os.homedir(), '.quan.config.json'));
      } else if (argv.push) {
        // ignore
      } else {
        loadResource(argv.name, path.resolve(os.homedir(), '.quan.config.json'));
      }
    },
  )
  .command(
    'comp [path]',
    'create react component',
    (_) => {
      _.options({
        path: {
          demandOption: true,
          type: 'string',
        },
        type: {
          type: 'string',
          choices: ['memo', 'redux'],
          default: 'memo',
        },
      });
    },
    (argv) => {
      generateTypeByReact({
        path: argv.path,
        type: argv.type,
      });
    },
  )
  .demandCommand(1)
  .version(getPackageInfo().version)
  .parse();
