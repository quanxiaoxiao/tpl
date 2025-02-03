import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

import {
  getValueOfPathList,
  hasDataKey,
  template,
} from '@quanxiaoxiao/utils';
import { $ } from 'zx';

const resourcePathnamesMap = {
  eslint: {
    filename: 'eslint.config.mjs',
    pathname: ['template', 'nodejs', 'eslint.config.mjs'],
    fn: async () => {
      const devDependencies = [
        '@eslint/js',
        'eslint',
        'eslint-plugin-simple-import-sort',
        'globals',
      ];

      await $`npm install --save-dev ${devDependencies} --proxy http://127.0.0.1:4001`;
    },
  },
};

export default async (type, configPathname) => {
  await $`test -f ${configPathname}`;
  let config = JSON.parse(fs.readFileSync(configPathname));
  assert(hasDataKey(resourcePathnamesMap, type));
  const requestUrl = template(getValueOfPathList(resourcePathnamesMap[type].pathname)(config))(config);
  assert(requestUrl);
  const resultWithRequest = await $`curl -s ${requestUrl}`;
  const data = JSON.parse(resultWithRequest).data;
  assert(data);
  const targetPathname = path.resolve(process.cwd(), resourcePathnamesMap[type].filename);
  /*
  try {
    await $`test -f ${targetPathname}`;
    console.log(data);
  } catch (error) {
    console.log(error);
  }
  */
  fs.writeFileSync(targetPathname, data);
  if (resourcePathnamesMap[type].fn) {
    await resourcePathnamesMap[type].fn();
  }
};
