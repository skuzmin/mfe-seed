import { Hono } from 'hono';
import { getCats } from './cats.controller.ts';

const catsRouter = new Hono();

catsRouter.get('/cats', getCats);

export default catsRouter;
