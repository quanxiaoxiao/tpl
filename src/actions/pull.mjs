import { writeFileSync } from 'node:fs';
import fetchModifedResources from '../fetchModifedResources.mjs';
import print from '../diffPrint.mjs';

export default async (config) => {
  const modifedList = await fetchModifedResources(config);
  for (let i = 0; i < modifedList.length; i++) {
    const obj = modifedList[i];
    if (obj.origin) {
      writeFileSync(obj.path, obj.origin);
    }
    print(obj);
  }
};
