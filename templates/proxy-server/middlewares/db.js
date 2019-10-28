const low = module.require('lowdb');
const FileSync = module.require('lowdb/adapters/FileSync');
const shelljs = module.require('shelljs');

const config = require('../config');

if (!shelljs.test('-d', config.dbPath)) {
  shelljs.mkdir('-p', config.dbPath);
}

const adapter = new FileSync(config.dbPathName);

const db = low(adapter);

db
  .defaults({
    current: Object.keys(config.projests).reduce((acc, key) => ({
      ...acc,
      [key]: null,
    }), {}),
    records: [],
  })
  .write();

module.exports = async (ctx, next) => {
  ctx.db = db;
  await next();
};
