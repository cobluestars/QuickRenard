// stateStore.js

/** 상태 저장소는 해시 테이블 구조로 되어 있으며, 키-값 쌍으로 상태를 저장
subscribers 객체는 이벤트 구독 패턴을 사용하여 상태 변화를 구독하는 콜백들을 관리
이는 각 상태의 키에 대응하는 콜백 배열을 해시 테이블 형태로 저장

상태 캐싱을 위한 객체도 해시 테이블 형태로 키-값 쌍을 저장하여 빠른 검색이 가능 */

import get from 'lodash/get';
import set from 'lodash/set';

const stateStore = {}; // 초기 상태 저장소 (Redux Store와 유사)
const subscribers = {}; // 상태 변화를 구독하는 콜백 함수들을 저장하는 객체
let stateSchema = {}; // 상태 스키마 저장 변수
const stateCache = {}; // 상태 캐싱을 위한 객체

function deepGet(obj, path) {
  // 캐시된 값을 먼저 확인
  const cachedValue = stateCache[path];
  if (cachedValue !== undefined) {
    return cachedValue; // 캐시된 값이 있으면 반환
  }
  // lodash의 get 함수를 사용하여 값을 가져옴
  const value = get(obj, path);
  stateCache[path] = value; // 값을 캐시에 저장
  return value;
}

function deepSet(obj, path, value) {
  // lodash의 set 함수를 사용하여 값을 설정
  set(obj, path, value);
  stateCache[path] = value; // 새로운 값을 캐시에도 저장
}

function isValidType(value, schemaEntry) {
    if (!schemaEntry) {
        console.error("스키마 항목이 정의되지 않음. state schema가 올바르게 초기화되었는지 확인하시길...");
        return false;
      }

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
                    /** 객체 속성 검증을 위한 재귀 알고리즘 사용
                    재귀 알고리즘: 함수가 자기 자신을 호출하여 문제를 해결하는 방식.
                    이 경우 객체의 각 속성에 대해 isValidType 함수를 재귀적으로 호출하여
                    중첩된 객체 내부의 유효성도 검증함. */
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
                /** 배열 내 각 항목의 타입을 검증하기 위한 재귀 알고리즘 사용
                이 경우, 배열의 각 항목에 대해 isValidType 함수를 재귀적으로 호출하여
                배열의 항목이 또 다른 배열이나 객체일 때 그 안을 검사함.
                중첩된 배열의 각 항목을 검사하므로,
                2차원 이상의 고차원 배열 역시 처리할 수 있음.*/
            }
            return true;
        default:
            console.error("Unhandled schema type:", schemaEntry.type); 
            // 알 수 없는 타입일 시, 디버깅용 로그 추가
            return false;
    }    
    return true; // 모든 검증이 통과하면 true 반환
}    

// 상태 저장소와 구독자 목록을 초기화하는 함수
function initializeState(schema) {
    Object.keys(schema).forEach((key) => {
      deepSet(stateStore, key, schema[key].defaultValue);
      subscribers[key] = []; // 각 상태 항목에 대한 구독자 목록 초기화
    });
}
  
// 상태 저장소와 스키마를 초기화하는 함수
export function initializeStore(schema) {
    stateSchema = schema; // 스키마 설정
    initializeState(schema); // 저장소 초기화
    // 초기화 로그 출력
    console.log('Setting up subscribers for:', Object.keys(subscribers));
    console.log('Initialized state store:', stateStore);
    console.log('Initialized state schema:', stateSchema);
}

// 캐시 만료 시간을 15분으로 설정
const CACHE_EXPIRATION_TIME = 900000; // milliseconds

// 캐시된 상태의 만료 시간을 추적하는 객체
const cacheExpirationRecords = {};

// 상태를 캐시에 저장하는 함수
function setCache(key, value) {
  stateCache[key] = {
    value: value,
    expirationTime: performance.now() + CACHE_EXPIRATION_TIME
  };
}

// 상태 캐시를 가져오는 함수
function getCache(key) {
  const record = stateCache[key];
  if (record && performance.now() < record.expirationTime) {
    return record.value; // 캐시된 값이 만료되지 않았으면 반환
  }
  // 캐시 만료 시 캐시에서 해당 항목 삭제
  delete stateCache[key];
  return undefined; // 만료되었거나 캐시가 없는 경우 undefined 반환
}

// 상태를 가져오는 함수
export function getState(query) {
  const cachedValue = getCache(query);
  if (cachedValue !== undefined) {
    return cachedValue; // 캐시된 값이 있으면 반환
  }
  // 캐시에 값이 없으면 상태 저장소에서 값을 가져옴
  const value = deepGet(stateStore, query);
  setCache(query, value); // 가져온 값을 캐시에 저장
  return value;
}


  export function setStateMutation(mutation, newValue) {
    // 스키마 항목 가져오기 - stateSchema에서 직접 가져옴
    const schemaEntry = stateSchema[mutation];
    console.log(`Mutation '${mutation}' schema entry:`, schemaEntry);
    
    // 스키마 항목이 없거나, 타입 정보가 없는 경우 에러 처리
    if (!schemaEntry || typeof schemaEntry.type === 'undefined') {
        console.error(`스키마 항목을 찾을 수 없거나 타입 정보가 없습니다: ${mutation}. 스키마 정의를 확인하세요.`);
        return;
    }
          
    // 타입 검증
    if (!isValidType(newValue, schemaEntry)) {
        console.error(`잘못된 타입의 상태입니다: ${mutation}. 기대 타입: ${schemaEntry.type}, 받은 타입: ${typeof newValue}.`);
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
    // 상태 저장 및 캐시 업데이트
    deepSet(stateStore, mutation, newValue);
    setCache(mutation, newValue); // 캐시에도 새로운 값을 저장
    // 구독자에게 변경 알림
    subscribers[mutation]?.forEach((callback) => callback(newValue)); // 구독자에게 변경 알림
}

// 만료된 캐시 항목을 삭제하는 함수
function clearExpiredCache() {
    const currentTime = performance.now();
    Object.keys(stateCache).forEach(key => {
        if (stateCache[key] && currentTime >= stateCache[key].expirationTime) {
            delete stateCache[key];
        }
    });
}

// 만료된 캐시 항목을 삭제하는 로직을 주기적으로 실행할 수 있는 함수
function cleanupCache() {
    // 현재 시간을 기준으로 만료된 캐시 항목 제거
    clearExpiredCache();
    // 다음 정리를 위한 타이머 설정
    setTimeout(cleanupCache, CACHE_EXPIRATION_TIME);
}

// 캐시 정리 함수 초기 호출
cleanupCache();

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
