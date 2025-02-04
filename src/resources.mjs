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

      await $`npm install --save-dev ${devDependencies} --proxy http://127.0.0.1:4001`;
    },
  },
  gitignore: {
    filename: '.gitignore',
    pathname: ['template', 'gitignore'],
  },
  editorconfig: {
    filename: '.editorconfig',
    pathname: ['template', '.editorconfig'],
  },
  dockerfile: {
    filename: 'Dockfile',
    pathname: ['template', 'nodejs', 'dockfile'],
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
};
