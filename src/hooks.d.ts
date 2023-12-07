/** hooks.d.ts */

// useStateQuery에서 반환하는 타입을 정의
interface StateQueryResult<T> {
    data: T;        // 데이터 로딩 결과
    loading: boolean; // 데이터 로딩 중 여부
    error: Error | null; // 데이터 로딩 중 발생한 오류, 없을 경우 null
}

// useStateQuery
// 쿼리 문자열을 받아 StateQueryResult 객체를 반환
declare function useStateQuery<T>(query: string): StateQueryResult<T>;

interface StateMutationResult<T> {
    // 상태를 변경하는 함수. 비동기 작업을 처리하므로 Promise를 반환
    mutate: (newValue: T) => Promise<void>;

    // 현재 상태 값을 저장
    state: T;

    // 현재 비동기 작업이 진행 중인지를 나타내는 플래그
    loading: boolean;

    // 비동기 작업 중 발생한 오류를 저장, 오류가 없는 경우 null
    error: Error | null;
}

// useStateMutation
// 상태의 이름(문자열)을 입력받아 StateMutationResult 객체를 반환
declare function useStateMutation<T>(mutation: string): StateMutationResult<T>;

declare function useStateSubscription(stateName: string, callback: () => void): void;

export { useStateQuery, useStateMutation, useStateSubscription };
