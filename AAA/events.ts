export type EventType =
    | 'insuranceReady'
    | 'insuranceComplete'
    | 'insuranceInvalid'
    | 'insuranceEdit'
    | 'insuranceChange';

export type EventCallback<T> = T extends 'insuranceComplete'
    ? (payload: SuccessPayload) => void
    : T extends 'insuranceReady'
        ? (payload: InitPayload) => void
        : T extends 'insuranceChange'
            ? (payload: string) => void
            : () => void;

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
