const config = require('../../config');
const pick = require('./lib/pick');

module.exports = (ctx) => {
  const name = ctx.get(config.resourceHeaderName);
  const current = ctx
    .db
    .get(`current.${name}`)
    .value();
  if (!current) {
    ctx.throw(404);
  }

  const currentItem = ctx
    .db
    .get('records')
    .find({
      _id: current,
    })
    .value();

  if (!currentItem) {
    ctx.throw(404);
  }

  return pick(currentItem);
};
