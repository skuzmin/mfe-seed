import type { CatResponse } from '../../types';

const CAT_URL = 'https://api.thecatapi.com/v1/images/search';

export async function getCats(
  controller: AbortController,
): Promise<CatResponse[]> {
  const response = await fetch(CAT_URL, {
    signal: controller.signal,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}
