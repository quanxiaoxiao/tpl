const path = require('path');
const shelljs = require('shelljs');
const chalk = require('chalk');
const create = require('./create');

module.exports = (projectName) => {
  create(projectName, [
    path.resolve(__dirname, '..', '..', 'templates', 'react-project'),
  ]);
  const dependencies = [
    '@babel/polyfill',
    '@emotion/core',
    '@emotion/styled',
    'emotion-normalize',
    'history',
    'lodash',
    'prop-types',
    'react',
    'react-dom',
    'react-router-dom',
    'react-style-proptype',
  ];
  const devDependencies = [
    '@babel/core',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-pipeline-operator',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-runtime',
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/runtime',
    '@emotion/babel-preset-css-prop',
    'babel-loader',
    'eslint-import-resolver-webpack',
    'babel-plugin-emotion',
    'babel-plugin-transform-react-remove-prop-types',
    'eslint-plugin-emotion',
    'eslint-plugin-react',
    'html-webpack-plugin',
    'raw-loader',
    'react-hot-loader',
    'terser-webpack-plugin',
    'url-loader',
    'webpack',
    'webpack-cli',
    'webpack-hot-middleware',
    'webpack-merge',
  ];
  console.log(`npm install --save-dev ${chalk.green(dependencies.join(' '))}`);
  shelljs.exec(`npm install --save ${dependencies.join(' ')}`);
  console.log(`npm install --save-dev ${chalk.green(devDependencies.join(' '))}`);
  shelljs.exec(`npm install --save-dev ${devDependencies.join(' ')}`);
};
