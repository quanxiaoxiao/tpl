const config = require('../config');

module.exports = async (ctx, next) => {
  if (/^\/resource(?:\/?|$)/.test(ctx.path)) {
    const name = ctx.get(config.resourceHeaderName);
    if (!name) {
      ctx.throw(401);
    }
    const projectItem = config.projests[name];
    if (!projectItem || projectItem.key !== ctx.get(config.resourceHeaderKey)) {
      ctx.throw(401);
    }
    ctx.resourceName = name;
  }
  await next();
};
