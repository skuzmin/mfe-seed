import { serve } from '@hono/node-server';
import { Hono } from 'hono';

const port = parseInt(process.env.BACKEND_PORT ?? '3000', 10);
const app = new Hono();

app.get('/', (c) => c.text('Hello Node.js!'));

const server = serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server listening on ${info.address}:${info.port}`);
});

process.on('SIGINT', () => {
  server.close();
  process.exit(0);
});
process.on('SIGTERM', () => {
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
});
