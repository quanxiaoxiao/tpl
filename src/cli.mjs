import os from 'node:os';
import path from 'node:path';
import process from 'node:process';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import diffResource from './diffResource.mjs';
import getPackageInfo from './getPackageInfo.mjs';
import loadResource from './loadResource.mjs';
import generateTypeByNodejs from './nodejs.mjs';
import generateTypeByReact from './react.mjs';
import uploadResource from './uploadResource.mjs';

const configPathname = path.resolve(os.homedir(), '.quan.config.json');

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
          pull: {
            type: 'boolean',
          },
          diff: {
            type: 'boolean',
          },
          push: {
            type: 'boolean',
          },
        })
        .conflicts('pull', 'diff')
        .conflicts('diff', 'push')
        .conflicts('pull', 'push');
    },
    (argv) => {
      if (argv.diff) {
        diffResource(argv.name, configPathname);
      } else if (argv.push) {
        uploadResource(argv.name, configPathname);
      } else if (argv.pull) {
        loadResource(argv.name, configPathname);
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
        configPathname,
      });
    },
  )
  .command(
    'nodejs [path]',
    'create nodejs project',
    (_) => {
      _.options({
        path: {
          demandOption: true,
          type: 'string',
        },
        test: {
          type: 'boolean',
        },
        testMongo: {
          type: 'boolean',
        },
        model: {
          type: 'boolean',
        },
      })
        .conflicts('test', 'model')
        .conflicts('testMongo', 'model')
        .conflicts('test', 'testMongo');
    },
    (argv) => {
      if (argv.test) {
        loadResource(
          'nodejsTest',
          configPathname,
          argv.path,
        );
      } else if (argv.model) {
        loadResource(
          'nodejsModel',
          configPathname,
          argv.path,
        );
      } else if (argv.testMongo) {
        loadResource(
          'nodejsTestMongo',
          configPathname,
          argv.path,
        );
      } else {
        generateTypeByNodejs({
          path: argv.path,
          configPathname,
        });
      }
    },
  )
  .demandCommand(1)
  .version(getPackageInfo().version)
  .parse();
