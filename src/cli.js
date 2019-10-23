const yargs = require('yargs');
const nodeProject = require('./projects/node');
const reactProject = require('./projects/react');
const reactComponent = require('./reactComponent');

const pkg = require('../package.json');

const projectMap = {
  react: (name) => {
    reactProject(name);
  },
  node: (name) => {
    nodeProject(name);
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
        choices: ['node', 'react'],
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
    'react',
    'make a react component',
    (ys) => ys.options({
      pathname: {
        alias: 'p',
        describe: 'component path name',
        type: 'string',
        demandOption: true,
      },
    }),
    (argv) => {
      if (argv.pathname) {
        reactComponent(argv.pathname);
      }
    },
  )
  .version(pkg.version)
  .argv;
