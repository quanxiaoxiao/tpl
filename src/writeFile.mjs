import { writeFileSync } from 'node:fs';

import { template } from '@quanxiaoxiao/utils';
import chalk from 'chalk';
import shelljs from 'shelljs';

export default (target, str, name) => {
  if (!shelljs.test('-f', target)) {
    writeFileSync(target, template(str)({ name }));
    console.log(`generate file \`${chalk.green(target)}\``);
  } else {
    console.log(`file \`${chalk.red(target)}\` already exit`);
  }
};
