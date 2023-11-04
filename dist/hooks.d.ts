/**
 * 주어진 쿼리를 통해 상태를 조회하는 훅
 *
 * @param {string} query - 조회하려는 상태의 이름 또는 경로
 * @returns 조회된 상태값
 */
export function useStateQuery(query: string): any;
/**
 * 주어진 뮤테이션을 통해 상태를 변경하는 훅
 *
 * @param {string} mutation - 변경하려는 상태의 이름 또는 경로
 * @returns 배열 [상태 변경 함수, 현재 상태값]
 */
export function useStateMutation(mutation: string): any[];
/**
 * 상태의 변화를 구독하는 훅
 *
 * @param {string} stateName - 구독하려는 상태의 이름 또는 경로
 * @param {Function} callback - 상태 변화 시 호출되는 콜백 함수
 */
export function useStateSubscription(stateName: string, callback: Function): void;
