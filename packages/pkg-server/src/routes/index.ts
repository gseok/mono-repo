import { Context, Next } from 'koa';
import Router from 'koa-router';

import SSRRoute from './ssr';

const router = new Router();

router.get(
  '/',
  async (ctx: Context, next: Next) => {
    const { ssr } = ctx.request.query;

    if (!ssr) {
      ctx.body = 'No SSR, ?ssr=true needed..!!';
      return;
    }
    next();
  },
  SSRRoute
);
export default router;
