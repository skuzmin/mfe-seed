import { type Resource, resources } from './l10n.translations';
import type { Locale } from '../types.ts';

/* eslint-disable */
type PathInto<T extends Record<string, any>, V = string> = keyof {
  [K in keyof T as T[K] extends V
    ? K
    : T[K] extends Record<string, any>
      ? `${K & string}.${PathInto<T[K], V> & string}`
      : never]: any;
};

type GetFieldType<Obj, Path> = Path extends `${infer Left}.${infer Right}`
  ? Left extends keyof Obj
    ?
        | GetFieldType<Exclude<Obj[Left], undefined>, Right>
        | Extract<Obj[Left], undefined>
    : undefined
  : Path extends keyof Obj
    ? Obj[Path]
    : undefined;

export function get<
  TData,
  TPath extends string,
  TDefault = GetFieldType<TData, TPath>,
>(
  data: TData,
  path: TPath,
  defaultValue?: TDefault,
): GetFieldType<TData, TPath> | TDefault {
  const value = path
    .split('.')
    .reduce<
      GetFieldType<TData, TPath>
    >((value, key) => (value as any)?.[key], data as any);

  return value !== undefined ? value : (defaultValue as TDefault);
}

let translations: Resource;
let activeLocale: Locale;

const initialize = <T extends Record<Locale, any> = Record<Locale, Resource>>(
  locale: Locale,
  res: T = resources as T,
) => {
  activeLocale = locale;
  translations = res[locale] ?? {};
};

function applyOpts(str: string, opts?: Record<string, string>): string {
  if (opts) {
    Object.entries(opts).forEach(([k, v]) => {
      str = str.replaceAll(`{{${k}}}`, v);
    });
  }

  return str;
}

export const t = (
  key: PathInto<Resource, string>,
  opts?: Record<string, string>,
): string => {
  const result = get(translations, key, '');

  return applyOpts(result, opts);
};

export const plural = (
  key: PathInto<Resource, Function>,
  count: number,
  opts?: Record<string, string>,
): string => {
  const pluralFn = get(translations, key) as Function;
  if (!pluralFn || typeof pluralFn !== 'function') {
    return '';
  }

  const result = pluralFn(count);
  return applyOpts(result, opts);
};

const currency = (
  amount: number,
  currency = 'EUR',
  options: Intl.NumberFormatOptions = {},
) => {
  const formatter = new Intl.NumberFormat(activeLocale.replace('_', '-'), {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    ...options,
  });

  return formatter.format(amount);
};

export const l10n = { initialize, t, plural, currency };
