/**hooks.js */
import { useEffect } from 'react';
import { getState, setState, subscribeStateChange } from './stateStore.js'; // stateStore에서 함수를 가져옴.

/**
 * 주어진 쿼리를 통해 상태를 조회하는 훅
 * 
 * @param {string} query - 조회하려는 상태의 이름 또는 경로
 * @returns 조회된 상태값
 */
function useStateQuery(query) {
    return getState(query); // stateStore에서 상태 조회
}

/**
 * 주어진 뮤테이션을 통해 상태를 변경하는 훅
 * 
 * @param {string} mutation - 변경하려는 상태의 이름 또는 경로
 * @returns 배열 [상태 변경 함수, 현재 상태값]
 */
function useStateMutation(mutation) {
    const applyMutation = (newValue) => {
        setState(mutation, newValue); // stateStore에서 상태 변경
    };

    return [applyMutation, getState(mutation)];
}

/**
 * 상태의 변화를 구독하는 훅
 * 
 * @param {string} stateName - 구독하려는 상태의 이름 또는 경로
 * @param {Function} callback - 상태 변화 시 호출되는 콜백 함수
 */
function useStateSubscription(stateName, callback) {
    useEffect(() => {
        const unsubscribe = subscribeStateChange(stateName, callback); // stateStore에서 상태 변화 구독
        return () => {
            unsubscribe(); // 구독 취소
        }
    }, [stateName, callback]);
}

export { useStateQuery, useStateMutation, useStateSubscription };