import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import nunjucks from 'nunjucks';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const isDev = process.env.NODE_ENV !== 'production';

export default function playgroundServ() {
  const app = new Hono();
  let manifest;

  app.use('/css/*', serveStatic({ root: './templates' }));
  app.use('/js/*', serveStatic({ root: './templates' }));
  app.use('/assets/*', serveStatic({ root: './templates' }));
  app.use('/favicon.png', serveStatic({ path: './templates/favicon.png' }));
  app.get('/demo', (c) => {
    const html = nunjucks.render('./templates/demo.njk', { isDev, manifest });
    return c.html(html);
  });
  app.get('/', (c) => {
    const html = nunjucks.render('./templates/landing.njk', { manifest });
    return c.html(html);
  });

  return {
    name: 'vite:playground-serv',
    async buildStart() {
      const manifestPath = path.resolve(process.cwd(), 'src/manifest.yaml');
      const content = fs.readFileSync(manifestPath, 'utf8');
      manifest = yaml.load(content, 'utf8');
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const request = new Request(`http://localhost${req.url}`, {
          method: req.method,
          headers: req.headers,
        });
        const response = await app.fetch(request);
        if (!response.ok) {
          next();
          return;
        }
        res.statusCode = response.status;
        response.headers.forEach((value, key) => {
          res.setHeader(key, value);
        });
        const body = await response.arrayBuffer();
        res.end(Buffer.from(body));
      });
    },
  };
}
