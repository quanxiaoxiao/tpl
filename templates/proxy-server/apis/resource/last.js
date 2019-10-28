
const config = require('../../config');

module.exports = (ctx) => {
  const resourceName = ctx.get(config.resourceHeaderName);
  const list = ctx
    .db
    .get('records')
    .filter({
      name: resourceName,
    })
    .value();
  if (list.length === 0) {
    ctx.throw(404);
  }
  const last = list[list.length - 1];
  ctx
    .db
    .set(`current.${resourceName}`, last._id)
    .write();
  return last._id;
};
