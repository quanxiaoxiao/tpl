import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'node:url';
import chalk from 'chalk';
import _ from 'lodash';
import { fetchData } from '@quanxiaoxiao/about-http';
import getLocalConfig from './getLocalConfig.mjs';

export default async () => {
  const {
    resources,
    url,
    entry,
    path,
  } = getLocalConfig();

  const list = Object
    .keys(resources)
    .filter((key) => resources[key] === null)
    .map((key) => ({
      name: key,
      path: resolve(process.cwd(), key),
      buf: readFileSync(resolve(process.cwd(), key)),
    }));

  const { host, protocol } = parse(url);

  const modifies = {};
  await list.reduce(async (acc, cur) => {
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
    console.log(`\`${chalk.green(cur.name)}\` -> \`${chalk.green(_id)}\``);
    modifies[cur.name] = _id;
  }, Promise.resolve);

  if (!_.isEmpty(modifies)) {
    writeFileSync(path, JSON.stringify({
      ...JSON.parse(readFileSync(path)),
      resources: {
        ...resources,
        ...modifies,
      },
    }, null, 2));
  }
};
