// stateStore.js

/** 상태 저장소는 해시 테이블 구조로 되어 있으며, 키-값 쌍으로 상태를 저장
subscribers 객체는 이벤트 구독 패턴을 사용하여 상태 변화를 구독하는 콜백들을 관리
이는 각 상태의 키에 대응하는 콜백 배열을 해시 테이블 형태로 저장

상태 캐싱을 위한 객체도 해시 테이블 형태로 키-값 쌍을 저장하여 빠른 검색이 가능 */

const stateStore = {}; // 초기 상태 저장소 (Redux Store와 유사)
const subscribers = {}; // 상태 변화를 구독하는 콜백 함수들을 저장하는 객체
let stateSchema = {}; // 상태 스키마 저장 변수
const stateCache = {}; // 상태 캐싱을 위한 객체

function deepGet(obj, path) {
    // 캐시된 값이 있는지 먼저 확인
    const cachedValue = stateCache[path];
    if (cachedValue !== undefined) {
      return cachedValue; // 캐시된 값이 있으면 반환
    }
  
    // 입력된 obj가 객체가 아니거나, path가 문자열이 아니면 undefined 반환
    if (!obj || typeof obj !== 'object' || typeof path !== 'string') {
      return undefined;
    }
  
    // 배열 인덱스 (예: [0])를 점 표기법으로 변환 (예: .0)
    const segments = path.replace(/\[(\w+)\]/g, '.$1').split('.');
  
    let current = obj;
  
    // 경로의 각 세그먼트를 순회
    for (const segment of segments) {
      // 현재 세그먼트가 객체에 존재하면 해당 값으로 이동
      if (segment in current) {
        current = current[segment];
      } else {
        // 존재하지 않으면 undefined 반환
        return undefined;
      }
    }
  
    stateCache[path] = current; // 캐시에 값을 저장
    return current; // 최종적으로 찾은 값을 반환
}

function deepSet(obj, path, value) {
    // 입력된 obj가 객체가 아니거나, path가 문자열이 아니면 함수 종료
    if (!obj || typeof obj !== 'object' || typeof path !== 'string') {
      return;
    }
  
    // 배열 인덱스 (예: [0])를 점 표기법으로 변환 (예: .0)
    const segments = path.replace(/\[(\w+)\]/g, '.$1').split('.');
  
    let current = obj;
  
    // 경로의 마지막 세그먼트를 제외하고 순회
    for (let i = 0; i < segments.length - 1; i++) {
      const segment = segments[i];
  
      // 현재 세그먼트가 존재하지 않으면 새로운 객체 또는 배열 생성
      if (!(segment in current)) {
        // 다음 세그먼트가 숫자면 배열, 아니면 객체 생성
        current[segment] = /^\d+$/.test(segments[i + 1]) ? [] : {};
      }
  
      // 다음 세그먼트로 이동
      current = current[segment];
    }
  
    // 마지막 세그먼트에 값을 설정
    current[segments[segments.length - 1]] = value;
    stateCache[path] = value; // 캐시에 새로운 값을 저장
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

/** 캐시 객체를 외부에 노출하는 함수 */

export function getCacheObject() {
    return stateCache;
} 

/** 주의: 위 함수는 라이브러리의 내부 상태를 외부에 노출합니다.
 * - 위 함수는 개발 및 디버깅 목적으로 사용해야 합니다.
 * - 외부에서 캐시 객체를 변경하면 라이브러리에 예기치 않은 문제가 발생할 수 있습니다.
 * - 캐시 객체를 직접 수정하는 대신, 라이브러리가 제공하는 API를 통해 상태를 변경해 주십시오.
 * - 캐시 객체의 내용을 읽고 모니터링하는 것은 가능하지만, 이를 변경하는 것은 권장하지 않습니다.
 */

// 캐시 만료 시간을 15분으로 설정
let CACHE_EXPIRATION_TIME = 900000; // milliseconds

// 캐시 만료 시간을 설정하는 함수 (milliseconds 단위)
export function setCacheExpirationTime(milliseconds) {
    CACHE_EXPIRATION_TIME = milliseconds;
 }

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

// 상태 저장소와 구독자 목록을 초기화하는 함수
function initializeState(schema) {
    Object.keys(schema).forEach((key) => {
      deepSet(stateStore, key, schema[key].defaultValue);
      subscribers[key] = []; // 각 상태 항목에 대한 구독자 목록 초기화
    });
}
  
// 상태 저장소와 스키마를 초기화하는 함수
export function initializeStore(schema, options = {}) {
    stateSchema = schema; // 스키마 설정
    initializeState(schema); // 저장소 초기화

    // 사용자가 캐시 만료 시간을 설정한 경우 적용
    if (options.cacheExpirationTime) {
        setCacheExpirationTime(options.cacheExpirationTime);
    }

    // 초기화 로그 출력
    // console.log('Setting up subscribers for:', Object.keys(subscribers));
    // console.log('Initialized state store:', stateStore);
    // console.log('Initialized state schema:', stateSchema);
}

/** 🦊Ver 2.6.0🦊: 상태 간의 종속성을, 그래프 탐색 알고리즘을 활용해 효과적으로 관리
 *  각 상태는 그래프의 노드로 표현, 상태 간의 종속성은 노드 간의 간선으로 표현
 * 
 * 뉴비 풀스택 개발자인지라 아직 여러모로 배우고 공부하는 입장입니다.
 * 주석이 길어도 쓸데없는 기능이 보여도 너그러운 양해 부탁드립니다.
 */

// 초기 stateDependencies 객체
let stateDependencies = {};

/**
 * 사용자가 정의한 종속성을 설정하는 함수
 * @param {Object} dependencies - 상태 간의 종속성을 정의한 객체
 */
export function setStateDependencies(dependencies) {
    stateDependencies = dependencies;
}

/**
 * 주어진 상태 키에 종속된 상태들을 찾는 함수
 * @param {string} stateKey - 종속 상태를 찾을 상태 키
 * @returns {string[]} 종속된 상태들의 키 배열
 */
function findDependentStates(stateKey) {
    return stateDependencies[stateKey] || [];
}

// 🦊Ver 2.8.1🦊: DFS를 비동기적으로 처리
/**
 * DFS(깊이 우선 탐색)를 사용하여 상태를 업데이트하는 비동기 함수.
 * DFS는 시작 노드에서 가능한 한 깊게 탐색하는 알고리즘.
 * 스택을 사용하여 현재 노드에서 가능한 한 깊은 노드로 이동하며,
 * 더 이상 탐색할 노드가 없을 때 마지막으로 방문한 노드로 되돌아감.
 * 이를 통해 상태와 그에 종속된 상태들을 깊이 우선 방식으로 업데이트.
 * 
 * @param {string} stateKey 업데이트할 상태의 키.
 * @param {any} newValue 상태에 설정할 새로운 값.
 * @returns {Promise} 상태 업데이트 완료를 알리는 Promise.
 */
function updateStateDFS(stateKey, newValue) {
    return new Promise((resolve, reject) => {
        try {
            const visited = new Set(); // 방문한 노드를 추적하기 위한 집합
            const stack = [stateKey];  // 스택을 사용하여 탐색 순서를 관리

            while (stack.length > 0) {
                const currentKey = stack.pop(); // 스택의 가장 위에 있는 요소를 가져옴
                if (!visited.has(currentKey)) {
                    setStateMutation(currentKey, newValue); // 상태 업데이트
                    visited.add(currentKey); // 현재 노드를 방문한 것으로 표시

                    // 종속된 상태들을 가져와 스택에 추가
                    findDependentStates(currentKey).forEach(dependentKey => {
                        if (!visited.has(dependentKey)) {
                            stack.push(dependentKey);
                        }
                    });
                }
            }
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

// 🦊Ver 2.8.1🦊: BFS를 비동기적으로 처리
/**
 * BFS(너비 우선 탐색)를 사용하여 상태를 업데이트하는 비동기 함수.
 * BFS는 시작 노드에서 가장 가까운 노드를 먼저 탐색하는 알고리즘입니다.
 * 큐를 사용하여 현재 노드에서 가장 가까운 노드부터 차례대로 탐색하며,
 * 모든 인접한 노드를 방문한 후에 더 먼 노드로 이동합니다.
 * 이를 통해 상태와 그에 종속된 상태들을 너비 우선 방식으로 업데이트합니다.
 * 
 * @param {string} stateKey 업데이트할 상태의 키.
 * @param {any} newValue 상태에 설정할 새로운 값.
 * @returns {Promise} 상태 업데이트 완료를 알리는 Promise.
 */
function updateStateBFS(stateKey, newValue) {
    return new Promise((resolve, reject) => {
        try {
            const visited = new Set(); // 방문한 노드를 추적하기 위한 집합
            const queue = [stateKey];  // 큐를 사용하여 탐색 순서를 관리

            while (queue.length > 0) {
                const currentKey = queue.shift(); // 큐의 가장 앞에 있는 요소를 가져옴
                if (!visited.has(currentKey)) {
                    setStateMutation(currentKey, newValue); // 상태 업데이트
                    visited.add(currentKey); // 현재 노드를 방문한 것으로 표시

                    // 종속된 상태들을 가져와 큐에 추가
                    findDependentStates(currentKey).forEach(dependentKey => {
                        if (!visited.has(dependentKey)) {
                            queue.push(dependentKey);
                        }
                    });
                }
            }
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * 사용자가 제공한 조건에 따라 DFS를 사용할지 여부를 결정
 *
 * @param {string} mutation 상태 변화의 키
 * @param {Function} condition 사용자 정의 조건 함수
 * @returns {boolean} DFS 사용 여부
 */
function useDFSCondition(mutation, condition) {
    // 사용자가 제공한 조건에 따라 DFS 사용 여부를 결정
    return condition(mutation);
}

/**
 * 사용자가 제공한 조건에 따라 BFS를 사용할지 여부를 결정
 *
 * @param {string} mutation 상태 변화의 키
 * @param {Function} condition 사용자 정의 조건 함수
 * @returns {boolean} BFS 사용 여부
 */
function useBFSCondition(mutation, condition) {
    // 사용자가 제공한 조건에 따라 BFS 사용 여부를 결정
    return condition(mutation);
}

/**
 * 주어진 상태에 대해 DFS 또는 BFS를 사용할지 결정하는 함수
 * @param {string} stateKey - 분석할 상태 키
 * @returns {string} 'DFS' 또는 'BFS'
 */
function determineSearchStrategy(stateKey) {
    const dependencies = stateDependencies[stateKey];
    
    if (dependencies && dependencies.length) {
        // DFS 조건: 종속된 상태가 다른 상태에 종속될 경우
        for (let dependent of dependencies) {
            if (stateDependencies[dependent] && stateDependencies[dependent].length) {
                return 'DFS';
            }
        }

        // BFS 조건: 상태에 둘 이상의 종속된 상태들이 있는 경우
        if (dependencies.length >= 2) {
            return 'BFS';
        }
    }

    // 기본적으로는 DFS 사용
    return 'DFS';
}

// 🦊Ver 2.8.1🦊: 상태 업데이트를 비동기적으로 처리
/**
 * 상태를 업데이트하는 함수.
 * 주어진 상태와 그에 종속된 상태들을 DFS 또는 BFS 전략에 따라 업데이트.
 * 비동기적으로 처리되며, 상태 업데이트가 완료될 때까지 기다릴 수 있음.
 *
 * @param {string} stateKey 업데이트할 상태의 키.
 * @param {any} newValue 상태에 설정할 새로운 값.
 * @returns {Promise} 상태 업데이트 완료를 알리는 Promise.
 */
export function updateState(stateKey, newValue) {
    return new Promise((resolve, reject) => {
        try {
            const strategy = determineSearchStrategy(stateKey);
            if (strategy === 'DFS') {
                updateStateDFS(stateKey, newValue).then(resolve).catch(reject);
            } else {
                updateStateBFS(stateKey, newValue).then(resolve).catch(reject);
            }
        } catch (err) {
            reject(err);
        }
    });
}


/** 🦊Ver 2.6.0🦊: 상태 간의 종속성을, 그래프 탐색 알고리즘을 활용해 효과적으로 관리*/
/**
 * 🦊Ver 2.8.1🦊:
 * 주어진 상태의 변화를 설정하는 함수.
 * 이 함수는 상태의 유효성을 검사하고, 상태 저장소 및 캐시에 값을 저장.
 * 또한, DFS나 BFS 조건에 따라 관련 상태의 업데이트를 비동기적으로 수행.
 * 
 * @param {string} mutation 상태 변화의 키.
 * @param {any} newValue 상태에 설정할 새로운 값.
 * @param {Function} useDFSCondition DFS 사용 조건 함수.
 * @param {Function} useBFSCondition BFS 사용 조건 함수.
 * @returns {Promise} 상태 변화 완료를 알리는 Promise.
 */

export function setStateMutation(mutation, newValue, useDFSCondition, useBFSCondition) {
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
    // 비동기 업데이트를 위한 Promise 반환
    return new Promise((resolve, reject) => {
        try {
            // 상태 저장 및 캐시 업데이트
            deepSet(stateStore, mutation, newValue);
            setCache(mutation, newValue); // 캐시에도 새로운 값을 저장

            const useDFS = typeof useDFSCondition === 'function' ? useDFSCondition(mutation) : false;
            const useBFS = typeof useBFSCondition === 'function' ? useBFSCondition(mutation) : false;

            if (useDFS) {
                updateStateDFS(mutation, newValue).then(resolve).catch(reject);
            } else if (useBFS) {
                updateStateBFS(mutation, newValue).then(resolve).catch(reject);
            } else {
                resolve(); // 조건이 충족되지 않는 경우, resolve 호출
            }

            // 구독자에게 변경 알림
            subscribers[mutation]?.forEach((callback) => callback(newValue));
        } catch (err) {
            reject(err);
        }
    });
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

// cleanupCache 함수에 의해 설정된 타이머 ID를 저장할 전역변수
let cleanupTimer;

// 만료된 캐시 항목을 삭제하는 로직을 주기적으로 실행할 수 있는 함수
function cleanupCache() {
    // 현재 시간을 기준으로 만료된 캐시 항목 제거
    clearExpiredCache();
    // 다음 정리를 위한 타이머 설정
    cleanupTimer = setTimeout(cleanupCache, CACHE_EXPIRATION_TIME);
}

// 캐시 정리 함수 초기 호출
cleanupCache();

// cleanup 함수 구현
export function cleanup() {
    // 타이머 정리
    clearTimeout(cleanupTimer);
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