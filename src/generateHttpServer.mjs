import chalk from 'chalk';
import shelljs from 'shelljs';

import loadResource from './loadResource.mjs';

export default async () => {
  [
    'src',
    'src/store',
    'src/routes',
  ]
    .forEach((dirPahtname) => {
      if (!shelljs.test('-d', dirPahtname)) {
        shelljs.mkdir(dirPahtname);
        console.warn(`create dir: ${chalk.green(dirPahtname)}`);
      }
    });

  [
    {
      pathname: 'src/logger.mjs',
      resourceName: 'nodejsLogger',
    },
    {
      pathname: 'src/createHttpServer.mjs',
      resourceName: 'createHttpServer',
    },
    {
      pathname: 'src/connectMongo.mjs',
      resourceName: 'connectMongo',
    },
    {
      pathname: 'src/store/store.mjs',
      resourceName: 'nodejsStore',
    },
    {
      pathname: 'src/store/initialState.mjs',
      resourceName: 'nodejsInitialState',
    },
    {
      pathname: 'src/store/selector.mjs',
      resourceName: 'nodejsSelector',
    },
    {
      pathname: 'src/routes/index.mjs',
      resourceName: 'nodejsRoute',
    },
  ]
    .reduce(async (acc, cur) => {
      await acc;
      if (!shelljs.test('-f', cur.pathname)) {
        await loadResource(cur.resourceName);
      }
    }, Promise.resolve);
};
