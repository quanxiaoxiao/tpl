/* eslint no-param-reassign: 0 */
import { readFileSync } from 'node:fs';
import { parse } from 'node:url';
import chalk from 'chalk';
import { fetchData } from '@quanxiaoxiao/about-http';
import parseConfig from '../lib/parseConfig.mjs';
import merge from '../lib/mergeObj.mjs';

export default async (config, cb) => {
  const {
    resources,
    url,
    entry,
    base,
  } = config;

  const { host, protocol } = parse(url);

  const walk = (name, value, arr) => {
    if (arr.length === 0) {
      return {
        [name]: value,
      };
    }
    const [current, ...other] = arr;
    return {
      [current]: walk(name, value, other),
    };
  };

  await parseConfig(resources, base)
    .filter((d) => !d.resource)
    .map((d) => ({
      ...d,
      buf: readFileSync(d.path),
    }))
    .reduce(async (acc, cur) => {
      await acc;
      const ret = await fetchData({
        url: `${protocol}//${host}/${entry}/upload?name=${encodeURIComponent(cur.name)}`,
        method: 'POST',
        body: cur.buf,
        match: (statusCode) => {
          if (statusCode === 200) {
            return true;
          }
          return false;
        },
      });
      const { _id } = JSON.parse(ret);
      console.log(`\`${chalk.green([...cur.navList, cur.name].join('/'))}\` -> \`${chalk.green(_id)}\``);
      merge(resources, walk(cur.name, _id, cur.navList));
    }, Promise.resolve);

  cb(resources);
};
