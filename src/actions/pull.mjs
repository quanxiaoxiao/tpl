import { writeFileSync } from 'node:fs';
import shelljs from 'shelljs';
import fetchModifedResources from '../fetchModifedResources.mjs';
import print from '../diffPrint.mjs';

export default async (config) => {
  const modifedList = await fetchModifedResources(config);
  for (let i = 0; i < modifedList.length; i++) {
    const obj = modifedList[i];
    if (obj.origin) {
      if (!shelljs.test('-d', obj.path)) {
        shelljs.mkdir('-p', obj.path);
      }
      if (!obj.raw || !obj.raw.equals(obj.origin)) {
        writeFileSync(obj.path, obj.origin);
      }
    }
    print(obj);
  }
};
