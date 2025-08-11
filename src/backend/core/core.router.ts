import { Hono } from 'hono';

const coreRouter = new Hono();

coreRouter.get('/health', (c) => c.text('OK'));

export default coreRouter;
