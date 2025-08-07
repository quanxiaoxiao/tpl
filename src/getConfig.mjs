import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';

import chalk from 'chalk';
import shelljs from 'shelljs';

let config;

export default () => {
  if (config) {
    return config;
  }
  const configPathname = path.resolve(os.homedir(), '.quan.config.json');
  if (!shelljs.test('-f', configPathname)) {
    console.log(`config ${chalk.red(configPathname)} not found`);
    process.exit(1);
  }
  config = JSON.parse(fs.readFileSync(configPathname));
  return config;
};
