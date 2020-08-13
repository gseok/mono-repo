import Koa from 'koa';
import cors from '@koa/cors';
import expressToKoa from 'express-to-koa';
import swStats from 'swagger-stats';
import commonErrorHandler from './middlewares/commonErrorHandler';
import pageNotFound from './middlewares/pageNotFound';
import router from './routes';
import keepAliveHandler from './middlewares/keepAliveHandler';

const app: Koa = new Koa();

app.use(
  cors({
    credentials: true,
  }),
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use(expressToKoa(swStats.getMiddleware({ metricsPrefix: 'node_' }) as any));

app.use(commonErrorHandler);
app.use(keepAliveHandler);

app.use(router.routes());
app.use(pageNotFound);

export default app;
