import { resolve, basename } from 'node:path';
import { writeFileSync } from 'node:fs';
import shelljs from 'shelljs';
import chalk from 'chalk';
import { fetchData } from '@quanxiaoxiao/about-http';
import parseConfig from '../lib/parseConfig.mjs';
import mkdir from '../lib/mkdir.mjs';

export default async (componentPathname, config) => {
  const name = basename(componentPathname);
  if (!/^[A-Z][0-9A-Za-z]*$/.test(name)) {
    console.log(`component name \`${chalk.red(name)}\` invalid`);
    process.exit(1);
  }
  mkdir(componentPathname);
  await parseConfig(config.resources, componentPathname).reduce(async (acc, cur) => {
    await acc;
    try {
      const buf = await fetchData({
        url: `${config.url.replace(/{{[^}]+}}/, cur.resource)}`,
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
      if (!shelljs.test('-d', cur.dirname)) {
        shelljs.mkdir('-p', cur.dirname);
      }
      writeFileSync(resolve(cur.dirname, cur.name.replace(/^_(?=\.)/, name)), buf.toString().replace(/{{[^}]+?}}/g, name));
    } catch (error) {
      if (error.statusCode === 404) {
        console.log(`\`${cur.name}\` -> \`${chalk.red(cur.resource)}\` Not Found`);
      } else {
        console.log(chalk.red(error.message));
      }
    }
  }, Promise.resolve);
};
