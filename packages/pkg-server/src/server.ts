import app from './app';
import logger from './helpers/logger';

const PORT = 3131;

app.listen(PORT, () => {
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
