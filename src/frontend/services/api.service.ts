import type { CatResponse } from '../../types';

const apiUrl: string = import.meta.env.VITE_BACKEND_URL;

export async function getCats(
  controller: AbortController,
): Promise<CatResponse[]> {
  const response = await fetch(`${apiUrl}/api/cats`, {
    signal: controller.signal,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}
