const fs = require('fs');
const config = require('../../config');
const pick = require('./lib/pick');

module.exports = (ctx) => {
  const resourceName = ctx.get(config.resourceHeaderName);
  const list = ctx
    .db
    .get('records')
    .filter({
      name: resourceName,
    })
    .value();
  return list.map(pick);
};
