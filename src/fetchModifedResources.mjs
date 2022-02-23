import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import * as Diff from 'diff';
import chalk from 'chalk';
import { fetchData } from '@quanxiaoxiao/about-http';
import shelljs from 'shelljs';
import getLocalConfig from './getLocalConfig.mjs';

export default async (diffCompare = (raw, origin) => [raw, origin]) => {
  const { resources, url } = getLocalConfig();
  const result = [];
  await Object
    .entries(resources)
    .map(([filename, resource]) => ({
      name: filename,
      resource,
    }))
    .reduce(async (acc, cur) => {
      await acc;
      const localResourcePathname = resolve(process.cwd(), cur.name);
      if (!shelljs.test('-f', localResourcePathname)) {
        console.log(`\`${chalk.red(localResourcePathname)}\` not found`);
        return;
      }
      const raw = readFileSync(resolve(process.cwd(), cur.name));
      if (cur.resource == null) {
        console.log(`\`${chalk.red(localResourcePathname)}\` resource unset`);
        return;
      }
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
        if (diff.length > 1) {
          result.push({
            resource: cur.resource,
            name: cur.name,
            raw,
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
