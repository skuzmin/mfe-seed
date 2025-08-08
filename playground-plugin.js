import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import nunjucks from 'nunjucks';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import MarkdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import hljs from 'highlight.js/lib/common';

const isDev = process.env.NODE_ENV === 'development';

export default function playgroundServ(root) {
  const app = new Hono();
  let manifest;

  nunjucks.configure('templates', {
    autoescape: true,
    watch: isDev,
    noCache: true,
  });

  app.use('/css/*', serveStatic({ root: './templates' }));
  app.use('/js/*', serveStatic({ root: './templates' }));
  app.use('/assets/*', serveStatic({ root: './templates' }));
  app.use('/favicon.png', serveStatic({ path: './templates/favicon.png' }));

  app.get('/prerender', async (c) => {
    const html = nunjucks.render('./pages/prerender.njk', { manifest });
    return c.html(html);
  });
  app.get('/demo', (c) => {
    const html = nunjucks.render('./pages/demo.njk', { manifest });
    return c.html(html);
  });
  app.get('/documentation', (c) => {
    const md = MarkdownIt({
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return (
              '<pre><code class="hljs">' +
              hljs.highlight(str, { language: lang, ignoreIllegals: true })
                .value +
              '</code></pre>'
            );
          } catch {}
        }
        return (
          '<pre><code class="hljs">' +
          md.utils.escapeHtml(str) +
          '</code></pre>'
        );
      },
    });
    md.use(markdownItAnchor);
    const mdPath = path.resolve(`${root}/openmfe/index.md`);
    const mdRaw = fs.readFileSync(mdPath, 'utf8');
    const text = md.render(mdRaw);
    const html = nunjucks.render('./pages/docs.njk', { text, manifest });
    return c.html(html);
  });
  app.get('/', (c) => {
    const html = nunjucks.render('./pages/landing.njk', { manifest });
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
