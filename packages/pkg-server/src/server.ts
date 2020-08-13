import { spawn } from 'child_process';
import app from './app';
import logger from './helpers/logger';
import { currentPhase } from './setting';

const PORT = 3131;

const runCommand = (command: string, options: string[]) => {
  return new Promise((resolve, reject) => {
    const cProcess = spawn(command, options);
    let hasError = false;
    let commandResult = '';

    cProcess.stdout.setEncoding('utf8');
    cProcess.stderr.setEncoding('utf8');
    // eslint-disable-next-line no-console
    cProcess.stdout.on('data', (data) => {
      commandResult += data;
    });
    cProcess.stderr.on('data', (data) => {
      hasError = true;
      // eslint-disable-next-line no-console
      console.error(data);
    });
    cProcess.on('close', () => {
      if (hasError) return reject();
      return resolve(commandResult.trim());
    });
    cProcess.on('error', reject);
  });
};

const server = app.listen(PORT, () => {
  logger.logs('----------------------------------------------------------');
  logger.logs(`Server is running at http://127.0.0.1:${PORT}`);
  logger.logs('Press CTRL-C to stop');
  logger.logs('----------------------------------------------------------');
  logger.logs('logs...0');
  logger.error('error...1');
  logger.warn('warn....2');
  logger.info('info....3');
  logger.debug('debug...4');
  logger.logs(`server started at ${new Date().toString()}!!`);
  logger.logs('----------------------------------------------------------');

  if (process.send) {
    process.send('ready');
  }
});

process.on('SIGINT', () => {
  const closeServer = () => {
    server.close((e) => {
      if (e) {
        logger.debug('Shutdown', e);
        return process.exit(1);
      }
      return process.exit(0);
    });
  };

  // NOTE: local개발 환경에서는 debug port가 open되어 close되지 않는 문제가 있다.
  // 따라서, sigint가 왔을때, debug port도 kill하여 준다.
  if (currentPhase === 'local') {
    runCommand('lsof', ['-t', '-i:9331'])
      .then((pid) => {
        if (pid) return runCommand('kill', [`${pid}`]);
        return null;
      })
      .then(closeServer);
  } else {
    closeServer();
  }
});
