import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';

import { template } from '@quanxiaoxiao/utils';
import shelljs from 'shelljs';

import fetchResource from './fetchResource.mjs';
import resources from './resources.mjs';

export default async (resourceTypeName, configPathname, pathname) => {
  if (!pathname && !resources[resourceTypeName].filename) {
    process.eixt(1);
  }
  let name;
  let targetPathname;
  if (pathname) {
    targetPathname = path.resolve(
      process.cwd(),
      pathname,
    );
    name = path.basename(pathname);
    if (resources[resourceTypeName].filename) {
      targetPathname = path.resolve(
        path.dirname(targetPathname),
        template(resources[resourceTypeName].filename)({ name }),
      );
    }
  } else {
    assert(resources[resourceTypeName] && resources[resourceTypeName].localPath);
    targetPathname = template(resources[resourceTypeName].localPath)({
      home: os.homedir(),
      pwd: process.cwd(),
    });
  }
  const data = await fetchResource(resourceTypeName, configPathname);
  if (!shelljs.test('-d', path.dirname(targetPathname))) {
    shelljs.mkdir('-p', path.dirname(targetPathname));
  }
  if (name) {
    fs.writeFileSync(targetPathname, template(data)({ name }));
  } else {
    fs.writeFileSync(targetPathname, data);
  }
  if (resources[resourceTypeName].load) {
    await resources[resourceTypeName].load();
  }
};
