import { Context } from 'koa';
import Router from 'koa-router';

const router = new Router();

router.get(
  '/',
  async (ctx: Context) => {
    const { ssr } = ctx.request.query;

    if (ssr) {
      ctx.body = 'ssr @@@';
      return;
    }

    ctx.body = 'No SSR, ?ssr=true needed..!!';
  },
);
export default router;
