import { $ } from 'zx';

export default {
  eslint: {
    filename: 'eslint.config.mjs',
    localPath: '{{pwd}}/eslint.config.mjs',
    pathname: ['template', 'nodejs', 'eslint.config.mjs'],
    load: async () => {
      const devDependencies = [
        '@eslint/js',
        'eslint',
        'eslint-plugin-simple-import-sort',
        'globals',
      ];

      await $`npm install --save-dev ${devDependencies}`;
    },
  },
  gitignore: {
    filename: '.gitignore',
    localPath: '{{pwd}}/.gitignore',
    pathname: ['template', 'gitignore'],
  },
  editorconfig: {
    filename: '.editorconfig',
    localPath: '{{pwd}}/.editorconfig',
    pathname: ['template', 'editorconfig'],
  },
  dockerfile: {
    filename: 'Dockfile',
    localPath: '{{pwd}}/Dockfile',
    pathname: ['template', 'nodejs', 'dockfile'],
  },
  tmux: {
    filename: '.tmux.conf',
    localPath: '{{home}}/.tmux.conf',
    pathname: ['template', 'tmux'],
  },
  nodejsTest: {
    filename: '{{name}}.test.mjs',
    pathname: ['template', 'nodejs', 'nodejs-test'],
  },
  nodejsTestMongo: {
    filename: '{{name}}.test.mjs',
    pathname: ['template', 'nodejs', 'nodejs-test-mongo'],
  },
  nodejsModel: {
    filename: '{{name}}.mjs',
    pathname: ['template', 'nodejs', 'nodejs-mongo-model'],
  },
  nodejsStore: {
    localPath: '{{pwd}}/src/store/store.mjs',
    pathname: ['template', 'nodejs', 'store'],
    load: async () => {
      await $`npm install --save @quanxiaoxiao/store`;
    },
  },
  nodejsInitialState: {
    localPath: '{{pwd}}/src/store/initialState.mjs',
    pathname: ['template', 'nodejs', 'initialState'],
    load: async () => {
      await $`npm install --save @quanxiaoxiao/datav dotenv`;
    },
  },
  nodejsSelector: {
    localPath: '{{pwd}}/src/store/selector.mjs',
    pathname: ['template', 'nodejs', 'selector'],
  },
  createHttpServer: {
    localPath: '{{pwd}}/src/createHttpServer.mjs',
    pathname: ['template', 'nodejs', 'createHttpServer'],
    load: async () => {
      await $`npm install --save @quanxiaoxiao/httttp`;
    },
  },
  nodejsLogger: {
    localPath: '{{pwd}}/src/logger.mjs',
    pathname: ['template', 'nodejs', 'logger'],
    load: async () => {
      await $`npm install --save @quanxiaoxiao/logger @quanxiaoxiao/node-utils`;
    },
  },
  'docker-compose': {
    filename: 'docker-compose.yml',
    localPath: '{{pwd}}/docker-compose.yml',
    pathname: ['template', 'nodejs', 'docker-compose'],
  },
  vimrc: {
    filename: '.vimrc',
    localPath: '{{home}}/.vimrc',
    pathname: ['template', 'vimrc'],
  },
  zshrc: {
    filename: '.zshrc',
    localPath: '{{home}}/.zshrc',
    pathname: ['template', 'zshrc'],
  },
  reactComponentIndex: {
    filename: 'index.js',
    pathname: ['template', 'react', 'component-index'],
  },
  reactComponent: {
    filename: '{{name}}.js',
    pathname: ['template', 'react', 'component'],
  },
  reactContainer: {
    filename: '{{name}}.js',
    pathname: ['template', 'react', 'container'],
  },
  reactUseStore: {
    filename: 'useStore.js',
    pathname: ['template', 'react', 'use-store'],
  },
  reactUseRedux: {
    filename: 'useRedux.js',
    pathname: ['template', 'react', 'use-redux'],
  },
  reactContext: {
    filename: 'Context.js',
    pathname: ['template', 'react', 'context'],
  },
};
