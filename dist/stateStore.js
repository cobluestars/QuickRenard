// stateStore.js

import get from 'lodash/get';
import set from 'lodash/set';

// 초기 상태 저장소 (Redux - Store와 같은 개념)
const stateStore = {};
// 상태 변화를 구독하는 콜백 함수들을 저장하는 객체
const subscribers = {};
// 상태 스키마 저장 변수
let stateSchema;

// 주어진 쿼리를 통해 상태를 반환하는 함수
function deepGet(obj, path) {
    return get(obj, path);
}

// 주어진 쿼리에 값을 설정하는 함수
function deepSet(obj, path, value) {
    set(obj, path, value);
}

function isValidType(value, schemaEntry) {
    const type = schemaEntry.type;

    switch (type) {
        case 'string':
            // 문자열 검사
            if (typeof value !== 'string') {
                // console.debug("Failed string check", value); // 디버깅
                return false;
            }
            // Enum 검증: 해당 값이 허용된 문자열 집합에 속하는지 검사
            if (schemaEntry.enum && !schemaEntry.enum.includes(value)) {
                console.error(`Invalid enum value for state: Expected one of ${schemaEntry.enum.join(', ')}.`);
                return false;
            }
            break;
        case 'number':
            return typeof value === 'number' && !isNaN(value);
        case 'object':
            if (!value || value === null) return false;  // null 검사 추가

            // 객체 속성 검증: 객체의 각 속성의 유형을 검사
            if (schemaEntry.properties) {
                for (const key in schemaEntry.properties) {
                    if (!isValidType(value[key], schemaEntry.properties[key])) {
                        return false;
                    }
                }
            }
            return true;
        case 'array':
            if (!Array.isArray(value)) return false;

            // 배열 타입 검증: 배열의 각 항목의 유형을 검사
            if (schemaEntry.items) {
                return value.every(item => isValidType(item, schemaEntry.items));
            }
            return true;
        default:
            console.error("Unhandled schema type:", schemaEntry.type); // 디버깅용 로그 추가
            return false;
    }    
    return true; // 모든 검증이 통과하면 true 반환
}    

// 상태 저장소와 구독자 목록을 초기화하는 함수
function initializeState(obj, schema) {
    for (let key in schema) {
        // 스키마에서 기본값으로 상태 저장소 초기화
        deepSet(obj, key, schema[key].defaultValue);
        // 각 상태 항목에 대한 구독자 목록 초기화
        subscribers[key] = [];
    }
}

// 상태 저장소와 스키마 초기화 함수
export function initializeStore(schema) {
    stateSchema = schema;  // 스키마 설정
    initializeState(stateStore, schema);  // 저장소 초기화

    // 초기화 로그 출력
    // console.log(`Setting up subscribers for: ${Object.keys(subscribers).join(', ')}`);
    // console.log("Initialized state store:", stateStore);
    // console.log("Initialized state schema:", stateSchema);
}

export function getState(query) {
    return deepGet(stateStore, query);
}

export function setStateMutation(mutation, newValue) {
    // console.log(`setStateMutation called with mutation: ${mutation} and newValue: ${newValue}`); // 로그 추가
    // console.log(`Type of newValue: ${typeof newValue}, value: ${newValue}`);    //로그 추가

    // 스키마 항목 가져오기
    const schemaEntry = deepGet(stateSchema, mutation);

    // console.log(`Fetched schema entry for mutation "${mutation}":`, schemaEntry); // 로그 추가

    if (!schemaEntry) {
        console.error(`Unknown state: ${mutation}`);
        return;
    }
    
    // 타입 검증
    if (!isValidType(newValue, schemaEntry)) {  // schemaEntry.type 대신 schemaEntry
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
    // 상태 검증 및 저장 부분
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
