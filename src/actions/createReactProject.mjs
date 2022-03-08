import shelljs from 'shelljs';
import fs from 'node:fs';
import { fetchData } from '@quanxiaoxiao/about-http';
import chalk from 'chalk';
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
import mkdir from '../lib/mkdir.mjs';
import parseConfig from '../lib/parseConfig.mjs';
import extractEslintDependecies from '../lib/extractEslintDependecies.mjs';
import extractBabelDependecies from '../lib/extractBabelDependecies.mjs';

export default (target, config) => {
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
            dependencies: [
              '@emotion/eslint-plugin',
              ...extractEslintDependecies(obj.buf),
            ],
          };
        }
        if (obj.name === '.babelrc') {
          return {
            ...obj,
            dependencies: [
              ...extractBabelDependecies(obj.buf),
            ],
          };
        }
        return {
          ...obj,
          dependencies: [],
        };
      }),
      reduce((acc, cur) => [...acc, ...cur.dependencies], []),
    )
    .subscribe((devDependencies) => {
      console.log(devDependencies);
    });
};
