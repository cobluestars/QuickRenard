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
        useDFS?: (mutation: string) => boolean; // DFS 사용 여부를 결정하는 사용자 정의 함수
        useBFS?: (mutation: string) => boolean; // BFS 사용 여부를 결정하는 사용자 정의 함수
    };
}

export declare function initializeStore(schema: StateSchema): void;
export declare function getState(query: string): any;
export declare function setStateMutation(mutation: string, newValue: any, useDFSCondition?: (mutation: string) => boolean, useBFSCondition?: (mutation: string) => boolean): void;
export declare function subscribeStateChange(stateName: string, callback: (newState: any) => void): () => void;
export declare function getCacheObject(): Record<string, any>;

// 상태 종속성 설정 함수 선언
export declare function setStateDependencies(dependencies: StateDependencies): void;

// DFS 및 BFS 업데이트 함수 선언
export declare function updateStateDFS(stateKey: string, newValue: any): void;
export declare function updateStateBFS(stateKey: string, newValue: any): void;
export {};