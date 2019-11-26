const path = require('path');
const chalk = require('chalk');
const shelljs = require('shelljs');
const copy = require('./lib/copy');

module.exports = (pathname, type) => {
  const componentPathname = path.resolve(process.cwd(), pathname);
  if (shelljs.test('-d', componentPathname)) {
    console.log(`component: ${chalk.red(pathname)} already exist`);
    process.exit(1);
  }
  const { base: componentName } = path.parse(pathname);
  if (!/^[A-Z][0-9A-Za-z]*$/.test(componentName)) {
    console.log(`component name: ${chalk.red(componentName)} invalid`);
    process.exit(1);
  }
  shelljs.mkdir('-p', componentPathname);
  const typeMap = {
    taro: [path.resolve(__dirname, '..', 'templates', 'react-taro-component')],
    react: [path.resolve(__dirname, '..', 'templates', 'react-component')],
  };
  const pathList = [
    ...typeMap[type],
  ];
  copy(pathList, componentName, componentPathname, pathname);
};
