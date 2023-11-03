// stateStore.js

// 초기 상태 저장소 (Redux - Store와 같은 개념)
const stateStore = {};
// 상태 변화를 구독하는 콜백 함수들을 저장하는 객체
const subscribers = {};
// 상태 스키마 저장 변수
let stateSchema;

// 주어진 쿼리를 통해 상태를 반환하는 함수
function deepGet(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

// 주어진 쿼리에 값을 설정하는 함수
function deepSet(obj, path, value) {
    const parts = path.split('.');
    const last = parts.pop();
    const target = parts.reduce((acc, part) => acc[part] = acc[part] || {}, obj);
    target[last] = value;
}

// 타입 검증 함수
function isValidType(value, type) {
    switch (type) {
        case 'string':
            return typeof value === 'string';
        case 'number':
            return typeof value === 'number' && !isNaN(value);
        case 'object':
            return typeof value === 'object' && value !== null && !Array.isArray(value);
        case 'array':
            return Array.isArray(value);
        // 추후 다른 타입들에 대한 검증을 추가할 수 있습니다.
        default:
            return false;
    }
}

// 초기 상태 저장소 설정 함수
export function initializeStore(schema) {
    stateSchema = schema;
    for (let key in schema) {
        deepSet(stateStore, key, schema[key].defaultValue);
        subscribers[key] = [];
    }
}

export function getState(query) {
    return deepGet(stateStore, query);
}

export function setStateMutation(mutation, newValue) {
    const schemaEntry = deepGet(stateSchema, mutation);
    if (!schemaEntry) {
        console.error(`Unknown state: ${mutation}`);
        return;
    }
    
    // 타입 검증
    if (!isValidType(newValue, schemaEntry.type)) {
        console.error(`Invalid type for state: ${mutation}. Expected ${schemaEntry.type} but received ${typeof newValue}.`);
        return;
    }
    
    // 값 범위 검사 (숫자 타입)
    if (schemaEntry.type === 'number') {
        if (schemaEntry.min !== undefined && newValue < schemaEntry.min) {
            console.error(`Invalid value for state: ${mutation}. Expected a number greater than or equal to ${schemaEntry.min}.`);
            return;
        }
        if (schemaEntry.max !== undefined && newValue > schemaEntry.max) {
            console.error(`Invalid value for state: ${mutation}. Expected a number less than or equal to ${schemaEntry.max}.`);
            return;
        }
    }
    
    // 문자열 길이 검사
    if (schemaEntry.type === 'string') {
        if (schemaEntry.minLength !== undefined && newValue.length < schemaEntry.minLength) {
            console.error(`Invalid string length for state: ${mutation}. Expected string length greater than or equal to ${schemaEntry.minLength}.`);
            return;
        }
        if (schemaEntry.maxLength !== undefined && newValue.length > schemaEntry.maxLength) {
            console.error(`Invalid string length for state: ${mutation}. Expected string length less than or equal to ${schemaEntry.maxLength}.`);
            return;
        }
    }
    
    // 상태 저장 및 콜백 호출
    deepSet(stateStore, mutation, newValue);
    (subscribers[mutation] || []).forEach(callback => callback(newValue));
}

export function setState(mutation, newValue) {
    // 상태 검증 및 저장 부분은 유지
    setStateMutation(mutation, newValue);
}

export function subscribeStateChange(stateName, callback) {
    if (!subscribers[stateName]) {
        subscribers[stateName] = [];
    }
    subscribers[stateName].push(callback);
    return () => {
        const index = subscribers[stateName].indexOf(callback);
        if (index > -1) {
            subscribers[stateName].splice(index, 1);
        }
    };
}
