import path from 'node:path';
import fs from 'node:fs';
import { spawn } from 'node:child_process';
import ora from 'ora';
import { fetchData } from '@quanxiaoxiao/about-http';
import chalk from 'chalk';
import shelljs from 'shelljs';
import {
  defer,
  from,
} from 'rxjs';
import {
  map,
  concatMap,
  tap,
  reduce,
} from 'rxjs/operators';
import extractEslintDependecies from './lib/extractEslintDependecies.mjs';
import extractBabelDependecies from './lib/extractBabelDependecies.mjs';
import getGlocalConfig from './lib/getGlobalConfig.mjs';

export default (target, config) => {
  if (shelljs.test('-d', target)) {
    console.log(`\`${chalk.red(target)}\` alreay exist`);
    process.exit(1);
  }
  console.log(`create \`${chalk.green(target)}\``);
  shelljs.mkdir(target);
  process.chdir(target);
  shelljs.exec('npm init -y', { silent: true });
  from(Object.entries(config.resources))
    .pipe(
      map(([filename, resource]) => ({
        filename,
        resource,
      })),
      concatMap((obj) => defer(async () => {
        const buf = await fetchData({
          url: `${config.url.replace(/{{[^}]+}}/, obj.resource)}`,
          match: (statusCode) => statusCode === 200,
        });
        return {
          name: obj.filename,
          buf,
        };
      })),
      tap((obj) => {
        fs.writeFileSync(path.resolve(target, obj.name), obj.buf);
        console.log(`create \`${chalk.green(path.resolve(target, obj.name))}\``);
      }),
      map((obj) => {
        if (obj.name === '.eslintrc') {
          return {
            ...obj,
            dependencies: extractEslintDependecies(obj.buf),
          };
        }
        if (obj.name === '.babelrc') {
          return {
            ...obj,
            dependencies: extractBabelDependecies(obj.buf),
          };
        }
        return {
          ...obj,
          dependencies: [],
        };
      }),
      reduce((acc, cur) => [...acc, ...cur.dependencies], []),
    )
    .subscribe(
      (dependencies) => {
        const npm = spawn('npm', ['install', '--save-dev', ...dependencies]);
        const spinner = ora(`npm install --save-dev ${dependencies.join('  ')}`).start();
        npm.stdout.on('data', (chunk) => {
          process.stdin.write(chunk);
        });
        npm.stderr.on('data', (chunk) => {
          process.stderr.write(chunk);
        });
        npm.on('error', (error) => {
          console.error(error.message);
        });
        npm.on('close', (code) => {
          spinner.stop();
          fs.writeFileSync(path.join(target, '.tplconfig'), JSON.stringify({
            url: config.url,
            resources: config.resources,
          }, null, 2));
          process.exit(code);
        });
      },
      (error) => {
        console.error(error.message);
      },
    );
};
