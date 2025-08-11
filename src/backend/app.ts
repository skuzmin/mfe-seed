import { Hono } from 'hono';
import { cors } from 'hono/cors';

import catsRouter from './cats/cats.router.ts';
import coreRouter from './core/core.router.ts';

const app = new Hono();

app.use('/api/*', cors());

app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json({ error: 'Internal Server Error' }, 500);
});

app.route('/api', coreRouter);
app.route('/api', catsRouter);

export default app;
