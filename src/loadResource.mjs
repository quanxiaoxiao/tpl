import fs from 'node:fs';
import path from 'node:path';

import fetchResource from './fetchResource.mjs';
import resources from './resources.mjs';

export default async (type, configPathname) => {
  const data = await fetchResource(type, configPathname);
  const targetPathname = path.resolve(process.cwd(), resources[type].filename);
  /*
  try {
    await $`test -f ${targetPathname}`;
    console.log(data);
  } catch (error) {
    console.log(error);
  }
  */
  fs.writeFileSync(targetPathname, data);
  if (resources[type].load) {
    await resources[type].load();
  }
};
