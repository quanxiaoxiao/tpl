import process from 'node:process';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import diffResource from './diffResource.mjs';
import generateHttpServer from './generateHttpServer.mjs';
import getPackageInfo from './getPackageInfo.mjs';
import loadResource from './loadResource.mjs';
import generateTypeByNodejs from './nodejs.mjs';
import generateTypeByReact from './react.mjs';
import resources from './resources.mjs';
import uploadResource from './uploadResource.mjs';

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
              ...Object
                .keys(resources)
                .filter((name) => resources[name].localPath),
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
        diffResource(argv.name);
      } else if (argv.push) {
        uploadResource(argv.name);
      } else if (argv.pull) {
        loadResource(argv.name);
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
  .command(
    'nodejs [path]',
    'handle code with nodejs',
    (_) => {
      _.options({
        path: {
          type: 'string',
        },
        test: {
          type: 'boolean',
        },
        httpServer: {
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
        .conflicts('test', 'httpServer')
        .conflicts('test', 'testMongo')
        .conflicts('testMongo', 'httpServer')
        .conflicts('testMongo', 'model')
        .conflicts('httpServer', 'model');
    },
    (argv) => {
      if (!argv.httpServer) {
        if (!argv.path) {
          console.warn('path unset');
          process.exit(1);
        }
      }
      if (argv.httpServer) {
        generateHttpServer();
      } else if (argv.test) {
        loadResource(
          'nodejsTest',
          argv.path,
        );
      } else if (argv.model) {
        loadResource(
          'nodejsModel',
          argv.path,
        );
      } else if (argv.testMongo) {
        loadResource(
          'nodejsTestMongo',
          argv.path,
        );
      } else {
        generateTypeByNodejs(argv.path);
      }
    },
  )
  .demandCommand(1)
  .version(getPackageInfo().version)
  .parse();
