import shelljs from 'shelljs';
import chalk from 'chalk';

export default async (pathname) => {
  if (shelljs.test('-d', pathname)) {
    console.log(`dir \`${chalk.red(pathname)}\` already exist`);
    process.exit(1);
  }
  shelljs.mkdir('-p', pathname);
  console.log(`mkdir \`${chalk.green(pathname)}\``);
};
