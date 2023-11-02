// functionStore.d.ts

// 제네릭을 사용하여 함수의 인자와 반환 타입을 추론할 수 있도록 함. T: type, R: return
type StoredFunction<T extends any[], R> = (...args: T) => R;

// 구독시 사용할 콜백 함수 타입
type SubscriberCallback<R> = (result: R) => void;

// 함수 저장소 인터페이스 정의
interface FunctionStore {
  [functionName: string]: StoredFunction<any[], any>;
}

// 함수 구독을 위한 구독자 관리 인터페이스
interface Subscribers {
  [functionName: string]: SubscriberCallback<any>[];
}

// 함수 등록 메서드
export declare function registerFunction<T extends any[], R>(
  name: string,
  func: StoredFunction<T, R>
): void;

// 함수 호출 메서드
export declare function callFunction<T extends any[], R>(
  name: string,
  ...args: T
): R;

// 함수 구독 메서드
export declare function subscribeFunction<R>(
  name: string,
  callback: SubscriberCallback<R>
): () => void;

export {};