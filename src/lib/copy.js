const fs = require('fs');
const path = require('path');
const fp = require('lodash/fp');
const chalk = require('chalk');
const shelljs = require('shelljs');
const handlebars = require('handlebars');
const detectCharacterEncoding = require('detect-character-encoding');
const getFileList = require('./getFileList');

module.exports = (pathList, name, destRoot, base) => {
  pathList
    .map((pathItem) => {
      const fileList = getFileList(pathItem);
      return fileList
        .map((filenameItem) => ({
          sourceRoot: pathItem,
          destRoot,
          ...fp.compose(
            (_) => ({
              name: _.base,
              dir: _.dir,
              path: path.join(_.dir, _.base),
            }),
            path.parse,
          )(filenameItem.slice(pathItem.length + 1)),
        }))
        .map((item) => ({
          ...item,
        }));
    })
    .reduce((acc, cur) => [...acc, ...cur], [])
    .reduce((acc, cur) => {
      const index = acc.findIndex((item) => item.path === cur.path);
      if (index !== -1) {
        acc.splice(index, 1);
        return [...acc, cur];
      }
      return [...acc, cur];
    }, [])
    .forEach((item) => {
      const destDir = path.join(item.destRoot, item.dir);
      if (!shelljs.test('-d', destDir)) {
        shelljs.mkdir('-p', destDir);
      }
      const source = path.join(item.sourceRoot, item.path);
      const fileBuffer = fs.readFileSync(source);

      const charsetMatch = detectCharacterEncoding(fileBuffer);
      const filename = item.name.replace(/^_(?=\.)/, name);
      const dest = path.join(destDir, filename);
      const isTextPlain = [
        'ISO-8859-1',
        'ISO-8859-2',
        'ISO-8859-3',
        'ISO-8859-4',
        'ISO-8859-5',
        'ISO-8859-6',
        'ISO-8859-7',
        'ISO-8859-8',
        'ISO-8859-9',
        'UTF-8',
      ].includes(charsetMatch.encoding);
      if (isTextPlain) {
        try {
          const content = handlebars.compile(fileBuffer.toString('utf-8'))({
            name,
          });
          fs.writeFileSync(dest, content, 'utf-8');
        } catch (error) {
          console.error(dest, error);
          fs.writeFileSync(dest, fileBuffer);
        }
      } else {
        fs.writeFileSync(dest, fileBuffer);
      }
      console.log(`add ${chalk.green(base ? path.join(base, filename) : path.join(item.dir, filename))}`);
    });
};
