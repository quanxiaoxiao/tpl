import { spawn } from 'node:child_process';
import ora from 'ora';

export default (dependencies, isDev) => {
  const npm = spawn('npm', [
    'install',
    isDev ? '--save-dev' : '--save',
    ...dependencies,
  ]);
  const spinner = ora(`npm install ${isDev ? '--save-dev' : '--save'} ${dependencies.join(' ')}`).start();
  return new Promise((resolve, reject) => {
    npm.stdout.on('data', (chunk) => {
      process.stdin.write(chunk);
    });
    npm.stderr.on('data', (chunk) => {
      process.stderr.write(chunk);
    });
    npm.on('error', (error) => {
      console.error(error.message);
    });
    npm.on('close', (code) => {
      spinner.stop();
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`close at code ${code}`));
      }
    });
  });
};
