/** src/stateStore.ts */

// 상태의 기본값과 타입을 정의하는 인터페이스
interface StateSchema {
    [key: string]: {
      type: string;
      defaultValue: any;
      min?: number;
      max?: number;
      minLength?: number;
      maxLength?: number;
      // ... 추가적인 유효성 검사를 위한 속성들
    };
}

// 초기 상태 저장소 (Redux - Store와 같은 개념)
const stateStore: { [key: string]: any } = {};

// 상태 변화를 구독하는 콜백 함수들을 저장하는 객체
const subscribers: { [key: string]: Array<(newState: any) => void> } = {};

// 상태 스키마 저장 변수
let stateSchema: StateSchema;

// 초기 상태 저장소 설정 함수
export function initializeStore(schema: StateSchema) {
    stateSchema = schema; // 스키마 저장

    for (let key in schema) {
      stateStore[key] = schema[key].defaultValue;
      subscribers[key] = []; // 각 상태마다 구독 리스트 초기화
    }
}

// 주어진 쿼리를 통해 상태를 반환하는 함수
export function getState(query: string) {
    return stateStore[query];
}

// 타입 검증 함수
function isValidType(value: any, type: string): boolean {
    switch (type) {
        case 'string':
            return typeof value === 'string';
        case 'number':
            return typeof value === 'number';
        case 'object':
            return typeof value === 'object' && !Array.isArray(value);
        case 'array':
            return Array.isArray(value);
        // ... 기타 타입들에 대한 검증 로직 추가
        default:
            return false;
    }
}

// 변이를 통해 상태를 변경하는 함수
export function setStateMutation(mutation: string, newValue: any) {
    const schemaEntry = stateSchema[mutation];

    if (!schemaEntry) {
        throw new Error(`Unknown state: ${mutation}`);
    }

    // 타입 검증
    if (!isValidType(newValue, schemaEntry.type)) {
        throw new Error(`Invalid type for state: ${mutation}. Expected ${schemaEntry.type} but received ${typeof newValue}.`);
    }

    // 값 범위 검사 (숫자 타입)
    if (schemaEntry.type === 'number') {
        if (schemaEntry.min !== undefined && newValue < schemaEntry.min) {
            throw new Error(`Invalid value for state: ${mutation}. Expected a number greater than or equal to ${schemaEntry.min}.`);
        }
        if (schemaEntry.max !== undefined && newValue > schemaEntry.max) {
            throw new Error(`Invalid value for state: ${mutation}. Expected a number less than or equal to ${schemaEntry.max}.`);
        }
    }

    // 문자열 길이 검사
    if (schemaEntry.type === 'string') {
        if (schemaEntry.minLength !== undefined && newValue.length < schemaEntry.minLength) {
            throw new Error(`Invalid string length for state: ${mutation}. Expected string length greater than or equal to ${schemaEntry.minLength}.`);
        }
        if (schemaEntry.maxLength !== undefined && newValue.length > schemaEntry.maxLength) {
            throw new Error(`Invalid string length for state: ${mutation}. Expected string length less than or equal to ${schemaEntry.maxLength}.`);
        }
    }

    // TODO: 추가적인 복잡한 구조의 상태 검사 로직 추가 가능

    stateStore[mutation] = newValue;

    // 상태 변경을 구독하고 있는 콜백 함수들을 실행
    subscribers[mutation].forEach(callback => callback(newValue));
}

// 상태 변경을 구독하는 함수
export function subscribeStateChange(stateName: string, callback: (newState: any) => void) {
    if (!subscribers[stateName]) {
        subscribers[stateName] = [];
    }
    subscribers[stateName].push(callback);

    // 구독 취소 함수를 반환
    return () => {
      const index = subscribers[stateName].indexOf(callback);
      if (index > -1) {
          subscribers[stateName].splice(index, 1);
      }
    };
}

