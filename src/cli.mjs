import process from 'node:process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import generateTypeByReact from './react.mjs';
import generateTypeByNodejs from './nodejs.mjs';
import getPackageInfo from './getPackageInfo.mjs';


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
        http: {
          type: 'boolean',
          default: false,
        },
      });
    },
    (argv) => {
      generateTypeByNodejs(argv.name, argv.http);
    },
  )
  .demandCommand(1)
  .version(getPackageInfo().version)
  .parse();
