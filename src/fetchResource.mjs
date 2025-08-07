import { $ } from 'zx';

import getResourceUrl from './getResourceUrl.mjs';

export default async (name) => {
  const requestUrl = getResourceUrl(name);
  const resultWithRequest = await $`curl -s ${requestUrl}`;
  return resultWithRequest.stdout;
};
