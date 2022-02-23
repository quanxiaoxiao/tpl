import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { fetchData } from '@quanxiaoxiao/about-http';
import fetchModifedResources from './fetchModifedResources.mjs';
import print from './diffPrint.mjs';
import config from './config.mjs';

export default async () => {
  const modifedList = await fetchModifedResources((raw, origin) => [origin, raw]);
  for (let i = 0; i < modifedList.length; i++) {
    const obj = modifedList[i];
    print(obj);
  }
  const target = resolve(process.cwd(), config.configName);
  const { url } = JSON.parse(readFileSync(target));
  await modifedList.reduce(async (acc, cur) => {
    await acc;
    await fetchData({
      url: `${url.replace(/{{[^}]+}}/, cur.resource)}`,
      method: 'POST',
      body: cur.raw,
    });
  }, Promise.resolve);
};
