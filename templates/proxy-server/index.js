const compress = module.require('koa-compress');
const conditional = module.require('koa-conditional-get');
const etag = module.require('koa-etag');
const cors = module.require('@koa/cors');
const dbMiddeware = require('./middlewares/db');
const wwwMiddleware = require('./middlewares/www');
const resourceAuthMiddleware = require('./middlewares/resourceAuth');
const loggerMiddleware = require('./middlewares/logger');

module.exports = {
  middlewares: [
    compress(),
    conditional(),
    etag(),
    cors(),
    loggerMiddleware,
    dbMiddeware,
    wwwMiddleware,
    resourceAuthMiddleware,
  ],
  api: require('./apis'),
};
