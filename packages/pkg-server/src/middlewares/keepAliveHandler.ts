import { Context, Next } from 'koa';

let isDisableKeepAlive: boolean;

const keepAliveHandler = async (ctx: Context, next: Next) => {
  if (isDisableKeepAlive) {
    ctx.set('Connection', 'close');
  }
  await next();
};

process.on('SIGINT', () => {
  isDisableKeepAlive = true;
});

export default keepAliveHandler;
