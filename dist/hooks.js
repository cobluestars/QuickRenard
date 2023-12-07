/**hooks.js */
import { useRef, useState, useEffect } from 'react';
import { getState, setState, subscribeStateChange } from './stateStore.js'; // stateStore에서 함수를 가져옴.

/**
 * 주어진 쿼리를 통해 상태를 조회하는 훅.
 * 
 * @param {string} query - 조회하려는 상태의 이름 또는 경로
 * @returns {object} - 조회된 데이터, 로딩 상태, 에러 상태
 */
function useStateQuery(query) {
    // 상태 데이터
    const [data, setData] = useState(getState(query));
    // 로딩 상태
    const [loading, setLoading] = useState(false);
    // 에러 상태
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        try {
            // 상태 저장소에서 직접 데이터를 가져옴
            const result = getState(query);
            setData(result);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [query]);

    return { data, loading, error };
}

/**
 * 주어진 뮤테이션을 통해 상태를 변경하는 훅.
 * 
 * @param {string} mutation - 변경하려는 상태의 이름 또는 경로.
 * @returns {object} 상태 변경 함수, 현재 상태값, 로딩 상태, 에러 상태를 포함하는 객체.
 */
function useStateMutation(mutation) {
    // 현재 상태 값을 관리하는 state 훅
    const [state, setStateHook] = useState(getState(mutation));

    // 로딩 상태를 관리하는 state 훅 (비동기 작업의 진행 상태를 나타냄)
    const [loading, setLoading] = useState(false);

    // 에러를 관리하는 state 훅 (비동기 작업 중 발생한 오류를 저장)
    const [error, setError] = useState(null);

    // 상태 변경을 수행하는 함수
    const applyMutation = async (newValue) => {
        setLoading(true); // 로딩 상태를 true로 설정
        setError(null); // 이전의 에러 상태를 초기화

        try {
            // 비동기 상태 변경 로직 수행
            // 여기서 setState는 비동기 함수라고 가정 (예: API 호출)
            await setState(mutation, newValue);

            // 상태 변경 후, 최신 상태를 가져와서 로컬 상태를 업데이트
            setStateHook(getState(mutation));
        } catch (err) {
            // 오류 발생 시 에러 상태를 설정
            setError(err);
        } finally {
            // 작업 완료 후 로딩 상태를 false로 설정
            setLoading(false);
        }
    };

    // 훅에서 반환하는 객체
    // mutate: 상태 변경하는 함수
    // state: 현재 상태 값
    // loading: 로딩 상태 (비동기 작업 진행 중 여부)
    // error: 오류 상태 (비동기 작업 중 발생한 오류)
    return { mutate: applyMutation, state, loading, error };
}

/**
 * 상태의 변화를 구독하는 훅. 상태가 변경될 때마다 콜백 함수를 호출합니다.
 * 
 * @param {string} stateName - 구독하려는 상태의 이름 또는 경로
 * @param {Function} callback - 상태 변화 시 호출되는 콜백 함수
 */
function useStateSubscription(stateName, callback) {
    // 현재 콜백 함수를 참조하는 ref
    const callbackRef = useRef(callback);

    // 콜백 함수가 변경될 때마다 ref를 업데이트
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    // 상태 변화를 구독하고, 변화가 있을 때 콜백 함수를 호출
    useEffect(() => {
        const handleStateChange = (newState) => {
            if (callbackRef.current) {
                callbackRef.current(newState);
            }
        };

        // 상태 변경을 구독하고, 구독 해제 함수를 반환
        const unsubscribe = subscribeStateChange(stateName, handleStateChange);
        return () => {
            unsubscribe();
        };
    }, [stateName]);
}

export { useStateQuery, useStateMutation, useStateSubscription };