const path = require('path');
const http = require('http');
const moment = require('moment');
const Koa = require('koa');
const winston = require('winston');
const router = require('@quanxiaoxiao/router');
const www = require('@quanxiaoxiao/www');
const compress = require('koa-compress');
const conditional = require('koa-conditional-get');
const etag = require('koa-etag');
const cors = require('@koa/cors');
const config = require('./config');

const isDev = process.env.NODE_ENV === 'development';


const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.simple(),
  ),
  transports: [
    new winston.transports.File({
      filename: path.resolve(config.loggerPath, 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.resolve(config.loggerPath, 'combined.log'),
    }),
  ],
});

if (isDev) {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

const app = new Koa();

app.use(async (ctx, next) => {
  const { method, originalUrl } = ctx;
  ctx.logger = logger;
  logger.info(`<-- ${method} ${originalUrl}  ${ctx.ip} ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
  try {
    await next();
  } catch (error) {
    logger.error(`${method} ${originalUrl} ${error.message}`);
    throw error;
  }
  const { res } = ctx;
  const onfinish = done.bind(null, 'finish'); // eslint-disable-line
  const onclose = done.bind(null, 'close'); // eslint-disable-line

  function done(event) {
    res.removeListener('finish', onfinish);
    res.removeListener('close', onclose);
    logger.info(`${event === 'close' ? '-x-' : '-->'} ${method} ${originalUrl} statusCode: ${ctx.status}`);
  }

  res.once('finish', onfinish);
  res.once('close', onclose);
});
app.use(compress());
app.use(conditional());
app.use(etag());
app.use(cors());

app.use(router({
  ...www(
    Object
      .entries(config.dist.projects)
      .reduce((acc, [projectName, value]) => ({
        ...acc,
        [projectName]: {
          key: value.key,
          pages: {
            ...value.pathList.reduce((pathes, pathname) => ({
              ...pathes,
              [pathname]: () => 'index.html',
            }), {}),
            '/static/(.*)': (matchs) => decodeURIComponent(matchs[1]),
          },
        },
      }), {}),
    config.dist.dbPathName,
    config.dist.staticPath,
  ),
  '/test': {
    get: {
      body: {
        name: 'quan',
      },
    },
  },
}, logger));

const server = http.createServer({}, app.callback());

server.listen(config.port, () => {
  console.log(`server listen at port: ${config.port}`);
});
