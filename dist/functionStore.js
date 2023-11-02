// functionStore.js

// 함수를 저장하는 저장소
const functionStore = {};

// 구독하는 콜백들을 저장하는 객체
const subscribers = {};

/**
 * 함수를 등록하는 메서드
 * @param {string} name - 함수의 고유 이름
 * @param {Function} func - 저장소에 등록할 함수
 * 
 * 관리할 수 있는 대표적인 함수 유형 목록:
 * - 순수 함수: 동일한 인자에 대해 항상 동일한 결과를 반환하고, 외부 상태를 변경하지 않는 함수입니다.
 * - 유틸리티 함수: 문자열 처리, 날짜 계산, 숫자 포맷팅 등 재사용 가능한 기능을 제공합니다.
 * - 헬퍼 함수: 반복적으로 사용되는 로직을 추상화한 함수입니다 (예: API 요청).
 * 
 * 이 함수 저장소는 이러한 유형의 함수를 효과적으로 관리할 수 있으나, 다음의 주의점이 필요합니다:
 * 
 * - 사이드 이펙트: 함수가 외부 시스템의 상태에 영향을 주거나 그로부터 영향을 받는 경우,
 *  (예시: 데이터베이스에 접근하거나 외부 API를 호출하는 함수) 예측하지 못한 결과를 초래할 수 있습니다.
 * 
 * - 상태 의존성: 함수가 내부 상태에 의존하는 경우, 그 상태의 변화가 함수의 결과에 영향을 줄 수 있습니다.
 * 
 * - 스코프와 클로저: 함수가 특정 스코프의 변수를 사용하는 경우, 이러한 의존성을 관리해야 합니다.
 *
 * - 동시성 제어: 여러 구독자가 동일한 함수의 결과를 구독할 때 발생하는 동시성 이슈를 관리해야 합니다.
 */
function registerFunction(name, func) {
  functionStore[name] = func;
  // 함수 등록 시 해당 함수에 대한 구독자 리스트 초기화
  subscribers[name] = [];
}

/**
 * 등록된 함수를 호출하는 메서드
 * @param {string} name - 호출할 함수의 이름
 * @param {...any} args - 함수에 전달할 인자들
 * @returns {*} - 함수의 실행 결과
 * 
 * 함수가 존재하지 않을 때는 에러를 발생시킵니다.
 */
function callFunction(name, ...args) {
  const func = functionStore[name];
  if (func) {
    const result = func(...args);
    // 호출 후에 구독자에게 결과 알림
    notifySubscribers(name, result);
    return result;
  } else {
    throw new Error(`Function ${name} not found.`);
  }
}

/**
 * 함수의 결과에 대해 구독하는 메서드
 * @param {string} name - 구독할 함수의 이름
 * @param {Function} callback - 결과를 받을 콜백 함수
 * @returns {Function} - 구독 취소 함수
 * 
 * 구독하려는 함수가 없으면 에러를 발생시킵니다.
 */
function subscribeFunction(name, callback) {
  if (subscribers[name]) {
    subscribers[name].push(callback);
    return () => {
      // 구독 취소 로직
      unsubscribeFunction(name, callback);
    };
  } else {
    throw new Error(`Function ${name} not found for subscription.`);
  }
}

// 구독을 취소하는 메서드
function unsubscribeFunction(name, callback) {
  const index = subscribers[name].indexOf(callback);
  if (index > -1) {
    subscribers[name].splice(index, 1);
  }
}

// 구독자에게 결과를 알리는 메서드
function notifySubscribers(name, data) {
  if (subscribers[name]) {
    subscribers[name].forEach(callback => callback(data));
  }
}

// 외부로 공개할 메서드들
export { registerFunction, callFunction, subscribeFunction };
