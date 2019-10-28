const path = require('path');

module.exports = {
  dbPath: path.resolve(__dirname, 'db'),
  dbPathName: path.resolve(__dirname, 'db', 'index.json'),
  tmpPath: path.resolve(__dirname, 'tmp'),
  resourcePath: path.resolve(__dirname, 'db'),
  resourceHeaderName: 'x-quan-name',
  resourceHeaderKey: 'x-quan-key',
  projests: {
    test: {
      key: '2FCOoKM7zZN4qjkpDf8IwWEaieUH1uYJ',
      pages: {
        '/test': () => 'index.html',
        '/static/test/(.*)': (matches) => matches[1],
      },
    },
  },
};
