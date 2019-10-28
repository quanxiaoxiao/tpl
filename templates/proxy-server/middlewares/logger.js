const DailyRotateFile = module.require('winston-daily-rotate-file');
const winston = module.require('winston');
const path = require('path');


const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.simple(),
  ),
  transports: [
    new DailyRotateFile({
      filename: path.resolve(__dirname, '..', 'logs', 'logger.log'),
    }),
  ],
});

module.exports = async (ctx, next) => {
  const { method, originalUrl } = ctx;
  if (/\/tiles\//.test(originalUrl)) {
    await next();
    return;
  }
  logger.info(`<-- ${method} ${originalUrl} user-agent: ${ctx.get('user-agent')}`);
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
};
