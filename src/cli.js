const yargs = require('yargs');
const nodeProject = require('./projects/node');
const reactProject = require('./projects/react');
const proxyServerProject = require('./projects/proxyServer');
const reactComponent = require('./reactComponent');

const pkg = require('../package.json');

const projectMap = {
  react: (name) => {
    reactProject(name);
  },
  node: (name) => {
    nodeProject(name);
  },
  proxy: (name) => {
    proxyServerProject(name);
  },
};

yargs // eslint-disable-line
  .command(
    'project',
    'make a project',
    (ys) => ys.options({
      name: {
        alias: 'n',
        describe: 'set project name',
        demandOption: true,
        type: 'string',
      },
      type: {
        alias: 't',
        describe: 'set project type',
        choices: ['node', 'react', 'proxy'],
        default: 'node',
        type: 'string',
      },
    }),
    (argv) => {
      const { name, type } = argv;
      if (name) {
        projectMap[type](name);
      }
    },
  )
  .command(
    'component',
    'make a react component',
    {},
    (argv) => {
      const [, pathname] = argv._;
      if (pathname) {
        reactComponent(pathname);
      }
    },
  )
  .version(pkg.version)
  .argv;
