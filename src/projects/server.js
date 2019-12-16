const path = require('path');
const shelljs = require('shelljs');
const chalk = require('chalk');
const create = require('./create');

module.exports = (projectName) => {
  create(projectName, [
    path.resolve(__dirname, '..', '..', 'templates', 'node-config'),
    path.resolve(__dirname, '..', '..', 'templates', 'server'),
  ]);
  const dependencies = [
    'koa',
    'koa-compress',
    'koa-conditional-get',
    '@koa/cors',
    'koa-etag',
    'moment',
    '@quanxiaoxiao/router',
    '@quanxiaoxiao/www',
    'winston',
  ];
  console.log(`npm install --save-dev ${chalk.green(dependencies.join(' '))}`);
  shelljs.exec(`npm install --save ${dependencies.join(' ')}`);
};
