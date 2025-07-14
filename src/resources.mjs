import { $ } from 'zx';

export default {
  eslint: {
    filename: 'eslint.config.mjs',
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
    pathname: ['template', 'gitignore'],
  },
  editorconfig: {
    filename: '.editorconfig',
    pathname: ['template', 'editorconfig'],
  },
  dockerfile: {
    filename: 'Dockfile',
    pathname: ['template', 'nodejs', 'dockfile'],
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
  'docker-compose': {
    filename: 'docker-compose.yml',
    pathname: ['template', 'nodejs', 'docker-compose'],
  },
  vimrc: {
    filename: '.vimrc',
    pathname: ['template', 'vimrc'],
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
