/** hooks.ts */
import { useEffect } from 'react';
// 상태를 저장하는 중앙 저장소
const centralState = {};
const stateSchema = {
    user: {
        type: 'object',
        defaultValue: { name: '', age: 0 },
    },
};
// useStateQuery: 주어진 쿼리에 해당하는 상태를 반환하는 Hook
function useStateQuery(query) {
    var _a;
    return centralState[query] || ((_a = stateSchema[query]) === null || _a === void 0 ? void 0 : _a.defaultValue);
}
// useStateMutation: 주어진 변이를 실행하는 함수와 상태를 반환하는 Hook
function useStateMutation(mutation) {
    var _a;
    const applyMutation = (newValue) => {
        const schemaEntry = stateSchema[mutation];
        if (!schemaEntry) {
            throw new Error(`Unknown mutation: ${mutation}`);
        }
        // 유효성 검사
        if (schemaEntry.type === 'number') {
            if (schemaEntry.min !== undefined && newValue < schemaEntry.min) {
                throw new Error(`Expected a number greater than or equal to ${schemaEntry.min}.`);
            }
            if (schemaEntry.max !== undefined && newValue > schemaEntry.max) {
                throw new Error(`Expected a number less than or equal to ${schemaEntry.max}.`);
            }
        }
        else if (schemaEntry.type === 'string') {
            if (schemaEntry.minLength !== undefined && newValue.length < schemaEntry.minLength) {
                throw new Error(`Expected string length greater than or equal to ${schemaEntry.minLength}.`);
            }
            if (schemaEntry.maxLength !== undefined && newValue.length > schemaEntry.maxLength) {
                throw new Error(`Expected string length less than or equal to ${schemaEntry.maxLength}.`);
            }
        }
        centralState[mutation] = newValue;
    };
    return [applyMutation, centralState[mutation] || ((_a = stateSchema[mutation]) === null || _a === void 0 ? void 0 : _a.defaultValue)];
}
// useStateSubscription: 주어진 상태의 변화를 구독하는 Hook
function useStateSubscription(stateName, callback) {
    useEffect(() => {
        callback();
    }, [centralState[stateName]]);
}
export { useStateQuery, useStateMutation, useStateSubscription };
