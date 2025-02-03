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
};
