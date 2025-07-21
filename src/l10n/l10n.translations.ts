import type { Locale } from '../types.ts';

export type Resource = typeof en_GB;

const en_GB = {
  general: {
    title: 'Cat inspector',
    btnText: 'Another one',
    success: 'Success',
    error: 'There was an error loading your data',
  },
};

const uk_UA = {
  general: {
    title: 'Котячий інспектор',
    btnText: 'Інший',
    success: 'Вітаннячко!',
    error: 'Лишенько, у нас помилка',
  },
};

export const resources: Record<Locale, Resource> = {
  en_GB,
  uk_UA,
};
