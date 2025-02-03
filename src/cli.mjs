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
      _.options({
        type: {
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
        diff: {
          type: 'boolean',
        },
        push: {
          type: 'boolean',
        },
      });
    },
    (argv) => {
      if (argv.diff) {
        diffResource(argv.type, path.resolve(os.homedir(), '.quan.config.json'));
      } else {
        loadResource(argv.type, path.resolve(os.homedir(), '.quan.config.json'));
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
          choices: ['memo', 'reducer'],
          default: 'memo',
        },
      });
    },
    (argv) => {
      const { path, type } = argv;
      generateTypeByReact({
        path,
        type,
      });
    },
  )
  .command(
    'node [name]',
    'create nodejs project',
    (_) => {
      _.options({
        name: {
          demandOption: true,
          type: 'string',
        },
        http: {
          type: 'boolean',
          default: false,
        },
      });
    },
    (argv) => {
      // generateTypeByNodejs(argv.name, argv.http);
    },
  )
  .demandCommand(1)
  .version(getPackageInfo().version)
  .parse();
