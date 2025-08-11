import catsService from './cats.service.ts';
import type { Context } from 'hono';

export async function getCats(c: Context): Promise<void | Response> {
  try {
    const data = await catsService.getCats();
    return c.json(data);
  } catch {
    console.error('Cant retrieve any cat');
  }
}
