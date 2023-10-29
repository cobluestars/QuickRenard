/** hooks.ts */

import { useState, useEffect } from 'react';

// 상태를 저장하는 중앙 저장소
const centralState: Record<string, any> = {};

// 상태 스키마 정의
interface StateSchema {
  [key: string]: {
    type: string;
    defaultValue: any;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
  };
}

const stateSchema: StateSchema = {
  user: {
    type: 'object',
    defaultValue: { name: '', age: 0 },
  },
};

// useStateQuery: 주어진 쿼리에 해당하는 상태를 반환하는 Hook
function useStateQuery(query: string) {
  return centralState[query] || stateSchema[query]?.defaultValue;
}

// useStateMutation: 주어진 변이를 실행하는 함수와 상태를 반환하는 Hook
function useStateMutation(mutation: string) {
  const applyMutation = (newValue: any) => {
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
    } else if (schemaEntry.type === 'string') {
      if (schemaEntry.minLength !== undefined && newValue.length < schemaEntry.minLength) {
        throw new Error(`Expected string length greater than or equal to ${schemaEntry.minLength}.`);
      }
      if (schemaEntry.maxLength !== undefined && newValue.length > schemaEntry.maxLength) {
        throw new Error(`Expected string length less than or equal to ${schemaEntry.maxLength}.`);
      }
    }

    centralState[mutation] = newValue;
  };

  return [applyMutation, centralState[mutation] || stateSchema[mutation]?.defaultValue];
}

// useStateSubscription: 주어진 상태의 변화를 구독하는 Hook
function useStateSubscription(stateName: string, callback: () => void) {
  useEffect(() => {
    callback();
  }, [centralState[stateName]]);
}

export { useStateQuery, useStateMutation, useStateSubscription };
