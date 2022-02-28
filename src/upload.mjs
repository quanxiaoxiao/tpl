/* eslint no-param-reassign: 0 */
import { readFileSync, writeFileSync } from 'node:fs';
import { parse } from 'node:url';
import chalk from 'chalk';
import { fetchData } from '@quanxiaoxiao/about-http';
import parseConfig from './lib/parseConfig.mjs';
import getLocalConfig from './getLocalConfig.mjs';

const merge = (orgin, values) => {
  const keys = Object.keys(values);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = values[key];
    const type = typeof value;
    if (orgin[key] == null) {
      orgin[key] = type === 'object' ? {} : value;
    }
    if (type === 'object') {
      merge(orgin[key], value);
    }
  }
};

export default async () => {
  const {
    resources,
    url,
    entry,
    path,
  } = getLocalConfig();

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

  await parseConfig(resources)
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

  writeFileSync(path, JSON.stringify({
    ...JSON.parse(readFileSync(path)),
    resources,
  }, null, 2));
};