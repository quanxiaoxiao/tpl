import chalk from 'chalk';
import shelljs from 'shelljs';

import loadResource from './loadResource.mjs';

export default async () => {
  if (!shelljs.test('-d', 'src')) {
    shelljs.mkdir('src');
    console.warn(`create dir: ${chalk.green('src')}`);
  }
  if (!shelljs.test('-d', 'src/store')) {
    shelljs.mkdir('-p', 'src/store');
    console.warn(`create dir: ${chalk.green('src/store')}`);
  }
  if (!shelljs.test('-f', 'src/logger.mjs')) {
    await loadResource('nodejsLogger');
  }
  if (!shelljs.test('-f', 'src/createHttpServer.mjs')) {
    await loadResource('createHttpServer');
  }
  if (!shelljs.test('-f', 'src/store/store.mjs')) {
    await loadResource('nodejsStore');
  }
  if (!shelljs.test('-f', 'src/store/initialState.mjs')) {
    await loadResource('nodejsInitialState');
  }
  if (!shelljs.test('-f', 'src/store/selector.mjs')) {
    await loadResource('nodejsSelector');
  }
};
