import assert from 'node:assert';
import fs from 'node:fs';

import {
  getValueOfPathList,
  hasDataKey,
  template,
} from '@quanxiaoxiao/utils';
import { $ } from 'zx';

import resources from './resources.mjs';

export default async (type, configPathname) => {
  await $`test -f ${configPathname}`;
  let config = JSON.parse(fs.readFileSync(configPathname));
  assert(hasDataKey(resources, type));
  const requestUrl = template(getValueOfPathList(resources[type].pathname)(config))(config);
  assert(requestUrl);
  const resultWithRequest = await $`curl -s ${requestUrl}`;
  const data = JSON.parse(resultWithRequest).data;
  assert(data);
  return data;
};
