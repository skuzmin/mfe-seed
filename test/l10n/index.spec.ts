import { describe, it, expect, beforeEach } from 'vitest';
import { l10n } from '../../src/l10n';
import type { Locale } from '../../src/types';

type CustomResource = {
  hello: string;
  user: {
    name: string;
  };
  count: (n: number) => string;
};

const customResources: Record<Locale, CustomResource> = {
  en_GB: {
    hello: 'Hello {{name}}',
    user: {
      name: 'User Name',
    },
    count: (n) => `${n} item${n === 1 ? '' : 's'}`,
  },
  uk_UA: {
    hello: 'Привіт {{name}}',
    user: {
      name: 'Імʼя користувача',
    },
    count: (n) => `${n} предмет${n === 1 ? '' : 'и'}`,
  },
};

describe('l10n module', () => {
  beforeEach(() => {
    l10n.initialize('en_GB', customResources);
  });

  describe('initialize', () => {
    it('uses default resources if none provided (fallback works)', () => {
      l10n.initialize('en_GB');
    });

    it('initializes correctly with custom resources', () => {
      expect(l10n.t('hello' as any, { name: 'John' })).toBe('Hello John');
    });

    it('falls back to empty object if locale is missing in resources', () => {
      const incompleteResources = {
        fr: {
          hello: 'Bonjour {{name}}',
          user: { name: 'Nom' },
          count: (n: number) => `${n} article${n === 1 ? '' : 's'}`,
        },
      };

      l10n.initialize('en_GB', incompleteResources as any);

      expect(l10n.t('hello' as any)).toBe('');
    });
  });

  describe('t', () => {
    it('returns translated string with interpolation', () => {
      const result = l10n.t('hello' as any, { name: 'Jane' });
      expect(result).toBe('Hello Jane');
    });

    it('returns nested translation', () => {
      expect(l10n.t('user.name' as any)).toBe('User Name');
    });

    it('returns empty string if key is missing', () => {
      expect(l10n.t('non.existent.key' as any)).toBe('');
    });

    it('returns raw string if no opts passed', () => {
      expect(l10n.t('hello' as any)).toBe('Hello {{name}}');
    });
  });

  describe('plural', () => {
    it('calls pluralization function correctly', () => {
      expect(l10n.plural('count' as never, 1)).toBe('1 item');
      expect(l10n.plural('count' as never, 3)).toBe('3 items');
    });

    it('returns empty string for invalid/missing plural key', () => {
      expect(l10n.plural('non.existent' as never, 5)).toBe('');
    });
  });

  describe('currency', () => {
    it('should make currency formatting', () => {
      const result = l10n.currency(1000, 'EUR', { minimumFractionDigits: 0 });
      expect(result).not.toContain('.00');
    });
  });
});
