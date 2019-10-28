const config = require('../../config');

module.exports = (ctx) => {
  const resourceName = ctx.get(config.resourceHeaderName);
  const id = ctx.matchs[1];
  const item = ctx
    .db
    .get('records')
    .find({
      _id: id,
      name: resourceName,
    })
    .value();
  if (!item) {
    ctx.throw(404);
  }
  ctx
    .db
    .set(`current.${resourceName}`, id)
    .write();
  return id;
};
