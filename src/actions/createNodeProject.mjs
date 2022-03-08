import path from 'node:path';
import fs from 'node:fs';
import { spawn } from 'node:child_process';
import _ from 'lodash';
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
import extractEslintDependecies from '../lib/extractEslintDependecies.mjs';
import extractBabelDependecies from '../lib/extractBabelDependecies.mjs';
import parseConfig from '../lib/parseConfig.mjs';
import mkdir from '../lib/mkdir.mjs';

export default (target, config, dependencies = []) => {
  mkdir(target);
  process.chdir(target);
  shelljs.exec('npm init -y', { silent: true });
  from(parseConfig(config.resources))
    .pipe(
      concatMap((obj) => defer(async () => {
        const buf = await fetchData({
          url: `${config.url.replace(/{{[^}]+}}/, obj.resource)}`,
          match: (statusCode) => statusCode === 200,
        });
        return {
          ...obj,
          buf,
        };
      })),
      tap((obj) => {
        if (!shelljs.test('-d', obj.dirname)) {
          shelljs.mkdir('-p', obj.dirname);
        }
        fs.writeFileSync(obj.path, obj.buf);
        console.log(`create \`${chalk.green(obj.path)}\``);
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
      (devDependencies) => {
        const npm = spawn('npm', [
          'install',
          ..._.isEmpty(dependencies) ? [] : ['--save', ...dependencies],
          '--save-dev',
          ...devDependencies,
        ]);
        const spinner = ora(`npm install ${_.isEmpty(dependencies) ? '' : `--save ${dependencies.join(' ')}\n`}--save-dev ${devDependencies.join(' ')}`).start();
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
            _: config.resources,
          }, null, 2));
          process.exit(code);
        });
      },
      (error) => {
        console.error(error.message);
      },
    );
};
