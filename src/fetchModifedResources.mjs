import { readFileSync } from 'node:fs';
import * as Diff from 'diff';
import chalk from 'chalk';
import { fetchData } from '@quanxiaoxiao/about-http';
import shelljs from 'shelljs';
import parseConfig from './lib/parseConfig.mjs';

export default async (config, diffCompare = (raw, origin) => [raw, origin], isPull = true) => {
  const { resources, url, base } = config;
  const result = [];
  await parseConfig(resources, base)
    .reduce(async (acc, cur) => {
      await acc;
      const localResourcePathname = cur.path;
      if (cur.resource == null) {
        console.log(`\`${chalk.red(localResourcePathname)}\` resource unset`);
        return;
      }
      const isLocalResourceExisted = shelljs.test('-f', localResourcePathname);
      if (!isPull && !isLocalResourceExisted) {
        console.log(`\`${chalk.red(localResourcePathname)}\` not found`);
        return;
      }
      const raw = isLocalResourceExisted ? readFileSync(localResourcePathname) : Buffer.from([]);
      try {
        const origin = await fetchData({
          url: `${url.replace(/{{[^}]+}}/, cur.resource)}`,
          match: (statusCode) => {
            if (statusCode === 200) {
              return true;
            }
            if (statusCode === 404) {
              const error = new Error('Not Found');
              error.statusCode = 404;
              throw error;
            }
            return false;
          },
        });
        const diff = Diff.diffLines(...diffCompare(raw.toString(), origin.toString()));
        if (!isLocalResourceExisted || diff.length > 1 || diff[0].added || diff[0].removed) {
          result.push({
            dirname: cur.dirname,
            path: cur.path,
            resource: cur.resource,
            name: cur.name,
            raw: isLocalResourceExisted ? raw : null,
            origin,
            diff,
          });
        }
      } catch (error) {
        if (error.statusCode === 404) {
          console.log(`\`${cur.name}\` -> \`${chalk.red(cur.resource)}\` Not Found`);
        } else {
          console.log(chalk.red(error.message));
        }
      }
    }, Promise.resolve);
  return result;
};
