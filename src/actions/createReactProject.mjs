import fs from 'node:fs';
import path from 'node:path';
import shelljs from 'shelljs';
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
  switchMap,
} from 'rxjs/operators';
import mkdir from '../lib/mkdir.mjs';
import parseConfig from '../lib/parseConfig.mjs';
import installPackage from '../lib/installPackage.mjs';
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
      switchMap((devDependencies) => defer(async () => {
        await installPackage([
          '@pmmmwh/react-refresh-webpack-plugin',
          'babel-loader',
          'eslint-import-resolver-webpack',
          'file-loader',
          'html-webpack-plugin',
          'raw-loader',
          'react-hot-loader',
          'react-refresh',
          'terser-webpack-plugin',
          'url-loader',
          'webpack',
          'webpack-cli',
          'webpack-hot-middleware',
          'webpack-merge',
          ...devDependencies,
        ], true);
        await installPackage([
          'react',
          'react-dom',
          'react-style-proptype',
          'wouter',
          'qs',
          'prop-types',
          'path-to-regexp',
          'lodash',
          'is-hotkey',
          'dayjs',
          '@emotion/react',
          'chroma-js',
        ]);
      })),
      switchMap(() => defer(async () => {
        const buf = await fetchData({
          url: `${config.url.replace(/{{[^}]+}}/, config.resources['.tpljsx'])}`,
          match: (statusCode) => statusCode === 200,
        });
        return buf.toString();
      })),
    )
    .subscribe(
      async (content) => {
        content
          .split(/@@=+@@/)
          .map((str) => str.trim())
          .map((str) => {
            const matchs = str.match(/^@@([^@]+)@@/);
            if (!matchs) {
              return null;
            }
            return {
              pathname: matchs[1],
              content: str.slice(matchs[0].length).trim(),
            };
          })
          .filter((d) => !!d)
          .forEach((d) => {
            const pathname = path.join(target, 'src', d.pathname);
            const dirname = path.dirname(pathname);
            if (!shelljs.test('-d', dirname)) {
              shelljs.mkdir('-p', dirname);
            }
            fs.writeFileSync(pathname, d.content);
            console.log(`create \`${chalk.green(pathname)}\``);
          });
      },
      (error) => {
        console.error(error.message);
      },
    );
};
