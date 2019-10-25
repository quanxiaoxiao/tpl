const path = require('path');
const shelljs = require('shelljs');
const create = require('./create');

module.exports = (projectName) => {
  create(projectName, [
    path.resolve(__dirname, '..', '..', 'templates', 'node-config'),
  ]);
  shelljs.mkdir('src');
};
