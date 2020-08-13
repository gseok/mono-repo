/* eslint-disable func-style */
/* eslint-disable @typescript-eslint/no-unused-vars */
import path from 'path';
import { Middleware, Context } from 'koa';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ChunkExtractor } from '@loadable/server';
import logger from '../helpers/logger';

const ssr: Middleware = async (ctx: Context) => {
  const nodeStats = path.resolve(__dirname, '../../../../dist/pkg-client/node/loadable-stats.json');
  const webStats = path.resolve(__dirname, '../../../../dist/pkg-client/web/loadable-stats.json');
  const nodeExtractor = new ChunkExtractor({ statsFile: nodeStats });
  const { default: App } = nodeExtractor.requireEntrypoint();
  const webExtractor = new ChunkExtractor({ statsFile: webStats });

  // redux for ssr
  logger.debug('Server Side Init Data: ', ctx.state);

  const jsx = webExtractor.collectChunks(<App />);

  logger.logs('SSR > string...!!!!!');
  const html = renderToString(jsx);
  const template = `
    <!DOCTYPE html>
    <html lang="en">
      <body>
        <!-- ssr rendering...!!! -->
        <div id="root">${html}</div>
        ${webExtractor.getScriptTags()}
      </body>
    </html>
  `;
  ctx.body = template;
};

export default ssr;
