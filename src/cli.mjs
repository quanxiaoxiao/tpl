import {
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';
import shelljs from 'shelljs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const pkg = JSON.parse(readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '..', 'package.json'), 'utf-8'));

const configBase = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'templates');

const config = {
  templates: {
    index: resolve(configBase, 'index.js'),
    component: resolve(configBase, 'Component.js'),
    context: resolve(configBase, 'Component.js'),
    useStore: resolve(configBase, 'Context.js'),
    reducer: resolve(configBase, 'reducer.js'),
    useRedux: resolve(configBase, 'useRedux.js'),
  },
};

const generateFile = (target, str, name) => {
  if (!shelljs.test('-f', target)) {
    writeFileSync(target, str.replace(/{{[^}]+}}/g, name), 'utf-8');
    console.log(`generate file \`${chalk.green(target)}\``);
  } else {
    console.log(`file \`${chalk.red(target)}\` already exit`);
  }
};

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
      const { path } = argv;
      const fileNameMatches = path.match(/\/?([A-Z]\w+)$/);
      if (!fileNameMatches) {
        console.warn(`\`${chalk.red(path)}\` invalid`);
        process.exit(1);
      }
      const name = fileNameMatches[1];
      const dir = path.slice(0, path.length - name.length).replace(/\/$/, '');
      const target = dir[0] === '/' ? dir : resolve(process.cwd(), dir);
      if (shelljs.test('-d', target)) {
        console.warn(`\`${chalk.red(target)}\` alread exist`);
      } else {
        shelljs.mkdir('-p', target);
        console.log(`create dir \`${chalk.green(target)}\``);
      }
      generateFile(
        resolve(target, 'index.js'),
        readFileSync(config.templates.index, 'utf-8'),
        name,
      );
      generateFile(
        resolve(target, `${name}.js`),
        readFileSync(config.templates.component, 'utf-8'),
        name,
      );
      if (argv.type === 'reducer') {
        generateFile(
          resolve(target, 'Context.js'),
          readFileSync(config.templates.context, 'utf-8'),
          name,
        );
        generateFile(
          resolve(target, 'useStore.js'),
          readFileSync(config.templates.useStore, 'utf-8'),
          name,
        );
        generateFile(
          resolve(target, 'reducer.js'),
          readFileSync(config.templates.reducer, 'utf-8'),
          name,
        );
        generateFile(
          resolve(target, 'useRedux.js'),
          readFileSync(config.templates.useRedux, 'utf-8'),
          name,
        );
      }
    },
  )
  .demandCommand(1)
  .version(pkg.version)
  .parse();
