import { useEffect, useState } from 'react';
import { getState, setState, subscribeStateChange } from './stateStore.js';

/**
 * 주어진 쿼리를 통해 상태를 조회하는 훅
 * 
 * @param {string} query - 조회하려는 상태의 이름 또는 경로
 * @returns 조회된 상태값
 */
function useStateQuery(query) {
    const [state, setStateLocal] = useState(getState(query));

    // 상태 변화를 감지하여 해당 컴포넌트를 리렌더링
    useEffect(() => {
        const unsubscribe = subscribeStateChange(query, (newState) => {
            setStateLocal(newState);
        });

        // 구독 해제 (컴포넌트가 언마운트될 때)
        return () => {
            unsubscribe();
        };
    }, [query]);

    return state;
}

/**
 * 주어진 뮤테이션을 통해 상태를 변경하는 훅
 * 
 * @param {string} mutation - 변경하려는 상태의 이름 또는 경로
 * @returns 배열 [상태 변경 함수, 현재 상태값]
 */
function useStateMutation(mutation) {
    const [state, setStateLocal] = useState(getState(mutation));

    // 상태를 변경하면 해당 컴포넌트도 함께 리렌더링
    const applyMutation = (newValue) => {
        setState(mutation, newValue);
        setStateLocal(newValue);
    };

    return [applyMutation, state];
}

/**
 * 상태의 변화를 구독하는 훅
 * 
 * @param {string} stateName - 구독하려는 상태의 이름 또는 경로
 * @param {Function} callback - 상태 변화 시 호출되는 콜백 함수
 */
function useStateSubscription(stateName, callback) {
    // 상태 변화를 감지하면 콜백 함수가 호출
    useEffect(() => {
        const unsubscribe = subscribeStateChange(stateName, callback);

        // 구독 해제 (컴포넌트가 언마운트될 때)
        return () => {
            unsubscribe();
        };
    }, [stateName, callback]);
}

export { useStateQuery, useStateMutation, useStateSubscription };