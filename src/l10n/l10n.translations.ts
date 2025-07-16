import type { Locale } from '../frontend/types.ts';

export type Resource = typeof en_GB;

const en_GB = {
    general: {
        success: 'Success',
        error: 'There was an error loading your data',
    },
};

const uk_UA = {
    general: {
        success: 'Вітаннячко!',
        error: 'Лишенько, у нас помилка',
    },
}

export const resources: Record<Locale, Resource> = {
    en_GB,
    uk_UA,
};
