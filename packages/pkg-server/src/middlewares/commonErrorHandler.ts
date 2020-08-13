import { Context, Next } from 'koa';

const commonErrorHandler = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (err) {
    const { message, stack } = err;
    ctx.status = err.statusCode || err.status || 500;
    if (message || stack) {
      ctx.body = message || stack;
    } else {
      ctx.type = 'html';
      ctx.body = '<p><em>Internal Server Error</em></p>';
    }
    ctx.app.emit('error', err, ctx);

    // TODO: Implements push server log to log system
  }
};

export default commonErrorHandler;
