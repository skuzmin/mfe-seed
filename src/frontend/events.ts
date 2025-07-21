import { namespace } from './config';
import type { CatResponse } from '../types';

export type EventType = 'ready' | 'loaded';

export type EventCallback<T> = T extends 'ready'
  ? (payload: string) => void
  : T extends 'loaded'
    ? (payload: Array<CatResponse>) => void
    : () => void;

export type EventMap = { [K in EventType]: EventCallback<K> };

const usePublish = <T>(namespace: string, eventType: EventType) => {
  return (host: HTMLElement) => {
    return (payload: T): void => {
      host.dispatchEvent(
        new CustomEvent(`${namespace}.${eventType}`, {
          detail: payload,
          bubbles: true,
          composed: true,
        }),
      );
    };
  };
};

let eventStore: EventMap;
const eventMap = (host: HTMLElement) => ({
  ready: usePublish<string>(namespace, 'ready')(host),
  loaded: usePublish<CatResponse[]>(namespace, 'loaded')(host),
});

export const events = {
  setHost: (host: HTMLElement) => (eventStore = eventMap(host)),
  publish: () => eventStore,
};
