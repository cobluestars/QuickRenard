// stateStore.d.ts

interface StateSchema {
    [key: string]: {
        type: string;
        defaultValue: any;
        min?: number;
        max?: number;
        minLength?: number;
        maxLength?: number;
    };
}

export declare function initializeStore(schema: StateSchema): void;
export declare function getState(query: string): any;
export declare function setStateMutation(mutation: string, newValue: any): void;
export declare function subscribeStateChange(stateName: string, callback: (newState: any) => void): () => void;
export {};