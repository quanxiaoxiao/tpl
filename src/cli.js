const yargs = require('yargs');
const nodeProject = require('./projects/node');
const reactProject = require('./projects/react');
const serverProject = require('./projects/server');
const reactComponent = require('./reactComponent');

const pkg = require('../package.json');

const projectMap = {
  react: (name) => {
    reactProject(name);
  },
  node: (name) => {
    nodeProject(name);
  },
  server: (name) => {
    serverProject(name);
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
        choices: ['node', 'react', 'server'],
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
    'comp',
    'make a react component',
    {
      type: {
        alias: 't',
        type: 'string',
        describe: 'set component type',
        choices: ['taro', 'react', 'reducer', 'memo'],
        default: 'react',
      },
    },
    (argv) => {
      const [, pathname] = argv._;
      if (pathname) {
        reactComponent(pathname, argv.type);
      }
    },
  )
  .version(pkg.version)
  .argv;
