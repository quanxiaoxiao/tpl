import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import * as Diff from 'diff';
import { fetchData } from '@quanxiaoxiao/about-http';
import shelljs from 'shelljs';
import config from './config.mjs';

export default async (diffCompare = (raw, origin) => [raw, origin]) => {
  const target = resolve(process.cwd(), config.configName);
  if (!shelljs.test('-f', target)) {
    console.error(`config \`${target}\` is not found`);
    process.exit(1);
  }
  const { resources, url } = JSON.parse(readFileSync(target));
  const result = [];
  await Object
    .entries(resources)
    .map(([filename, resource]) => ({
      name: filename,
      resource,
    }))
    .reduce(async (acc, cur) => {
      await acc;
      const origin = await fetchData({
        url: `${url.replace(/{{[^}]+}}/, cur.resource)}`,
        match: (statusCode) => statusCode === 200,
      });
      const raw = readFileSync(resolve(process.cwd(), cur.name));
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
    }, Promise.resolve);
  return result;
};
