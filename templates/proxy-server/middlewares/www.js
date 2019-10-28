const pathToRegexp = module.require('path-to-regexp');
const path = require('path');
const fs = require('fs');
const config = require('../config');

const pageList = Object
  .entries(config.projests)
  .map(([key, value]) => {
    const pageRegList = Object
      .keys(value.pages)
      .map((pathname) => ({
        regexp: pathToRegexp(pathname),
        fn: value.pages[pathname],
      }));

    return {
      name: key,
      list: pageRegList,
    };
  })
  .reduce((acc, cur) => [
    ...acc,
    ...cur.list.map((item) => ({
      name: cur.name,
      ...item,
    })),
  ], []);

module.exports = async (ctx, next) => {
  const page = pageList.find((pageItem) => pageItem.regexp.exec(ctx.path));
  if (page) {
    const current = ctx.db.get(`current.${page.name}`).value();
    if (!current) {
      ctx.throw(404);
    }
    const filePathnme = page.fn(page.regexp.exec(ctx.path));
    const pathname = path.join(
      config.resourcePath,
      current,
      filePathnme,
    );
    if (pathname.indexOf(path.join(config.resourcePath, current)) !== 0) {
      ctx.trhow(400);
    }
    ctx.type = path.extname(pathname);
    ctx.body = fs.createReadStream(pathname);
  } else {
    await next();
  }
};
