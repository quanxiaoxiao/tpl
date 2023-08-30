import {
  readFileSync,
} from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import generateTypeByReact from './react.mjs';
import generateTypeByNodejs from './nodejs.mjs';

const pkg = JSON.parse(readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '..', 'package.json'), 'utf-8'));

yargs(hideBin(process.argv))
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
      });
    },
    (argv) => {
      generateTypeByNodejs(argv.name);
    },
  )
  .demandCommand(1)
  .version(pkg.version)
  .parse();
