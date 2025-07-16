export type EventType =
    | 'ready';

// export type EventCallback<T> = T extends 'insuranceComplete'
//     ? (payload: SuccessPayload) => void
//     : T extends 'insuranceReady'
//         ? (payload: InitPayload) => void
//         : T extends 'insuranceChange'
//             ? (payload: string) => void
//             : () => void;
export type EventCallback<T> = T extends 'ready' ? (data: (text:string) => void) => void : () => void;

export type EventMap = { [K in EventType]: EventCallback<K> };

export type InitPayload = {
    setData: (data: SetupDataPayload) => void;
};

export type SuccessPayload = {
    selectedInsurance: string;
    insurancePrice?: number;
    insuranceData: any;
};

export type SetupDataPayload = {
    selectedCountryCode: string;
    email: string;
    destination: string;
    value?: string;
    insuranceRequestPayload: any;
};

const usePublish = <T>(namespace: string, eventType: string) => {
    return (host: HTMLElement) => {
        return (payload: T): void => {
            host.dispatchEvent(new CustomEvent(`${namespace}.${eventType}`, {
                detail: payload,
                bubbles: true,
                composed: true,
            }))
        }
    }
}

let eventStore: EventMap;
const eventMap = (host: HTMLElement) => ({
    ready: usePublish<(text:string) => void>('namespace', 'ready')(host),
});

export const events = {
    setHost: (host: HTMLElement) => eventStore = eventMap(host),
    publish: () => eventStore,
};