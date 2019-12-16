const path = require('path');

const config = {
  dist: {
    projects: {
      main: {
        key: 'ssssss',
        prefix: '',
        pathList: [
          '/',
        ],
      },
    },
    dbPathName: path.resolve(__dirname, '..', 'db.json'),
    staticPath: path.resolve(__dirname, '..', 'dist'),
  },
  loggerPath: path.resolve(__dirname, '..', 'logs'),
  port: 3088,
};

module.exports = config;
