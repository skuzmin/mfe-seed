import { vi, describe, it, expect } from 'vitest';
import { getCats } from '../../src/frontend/services';

const mockData = [{ id: '1', name: 'Eren' }];

describe('getCats', () => {
  it('should fetch cats and return JSON', async () => {
    const controller = new AbortController();

    // Mock global fetch
    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockData),
    }) as any;

    const result = await getCats(controller);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    expect(result).toEqual(mockData);
  });

  it('should propagate fetch error', async () => {
    const controller = new AbortController();

    global.fetch = vi.fn().mockRejectedValue(new Error('Network error')) as any;

    await expect(getCats(controller)).rejects.toThrow('Network error');
  });

  it('should throw on aborted request', async () => {
    const controller = new AbortController();
    controller.abort();

    global.fetch = vi
      .fn()
      .mockImplementation(() =>
        Promise.reject(new DOMException('Aborted', 'AbortError')),
      ) as any;

    await expect(getCats(controller)).rejects.toThrow('Aborted');
  });
});
