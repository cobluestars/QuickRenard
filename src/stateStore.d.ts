// stateStore.d.ts

interface StateSchema {
    [key: string]: {
        type: 'string' | 'number' | 'object' | 'array';
        defaultValue: any;
        enum?: string[]; // Enum: 허용된 문자열 집합을 정의
        min?: number;
        max?: number;
        minLength?: number;
        maxLength?: number;
        properties?: { // 객체의 각 속성에 대한 스키마를 정의
            [key: string]: StateSchema;
        };
        items?: StateSchema; // 배열의 각 항목에 대한 스키마를 정의
    };
}

export declare function initializeStore(schema: StateSchema): void;
export declare function getState(query: string): any;
export declare function setStateMutation(mutation: string, newValue: any): void;
export declare function subscribeStateChange(stateName: string, callback: (newState: any) => void): () => void;
export {};