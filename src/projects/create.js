const path = require('path');
const shelljs = require('shelljs');
const chalk = require('chalk');
const copy = require('../lib/copy');

module.exports = (projectName, pathList) => {
  const projectPathname = path.resolve(process.cwd(), projectName);
  if (shelljs.test('-d', projectPathname)) {
    console.log(`project: ${chalk.red(projectName)} already exist`);
    process.exit(1);
  }
  shelljs.mkdir(projectName);
  pathList = [
    path.resolve(__dirname, '..', '..', 'templates', 'base-config'),
    ...pathList,
  ];
  copy(pathList, projectName, projectPathname);
  process.chdir(projectName);
  const { stdout } = shelljs.exec('npm info eslint-config-airbnb peerDependencies --json', { silent: true });
  const eslintDependencyPackages = [
    'eslint-config-airbnb',
    'babel-eslint',
    ...Object.keys(JSON.parse(stdout)),
  ];
  console.log(`npm install --save-dev ${chalk.green(eslintDependencyPackages.join(' '))}`);
  shelljs.exec(`npm install --save-dev ${eslintDependencyPackages.join(' ')}`);
};
