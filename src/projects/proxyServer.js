const path = require('path');
const create = require('./create');

module.exports = (projectName) => {
  create(projectName, [
    path.resolve(__dirname, '..', '..', 'templates', 'node-config'),
    path.resolve(__dirname, '..', '..', 'templates', 'proxy-server'),
  ]);
};
