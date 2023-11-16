import { initializeStore, getState, setState, subscribeStateChange, getCacheObject, cleanup } from './stateStore';

// 상태 스키마 정의
const stateSchema = {
    count: { type: 'number', defaultValue: 0 },
    message: { type: 'string', defaultValue: 'hello world!' }
};

describe('stateStore Tests', () => {
    beforeEach(() => {
        initializeStore(stateSchema);
    });

    afterEach(() => {
        // 테스트 후 정리 작업 수행
        cleanup();
    });

    test('should initialize state correctly', () => {
        expect(getState('count')).toBe(0);
        expect(getState('message')).toBe('hello world!');
    });

    test('should update state correctly', () => {
        setState('count', 1);
        expect(getState('count')).toBe(1);

        setState('message', 'world');
        expect(getState('message')).toBe('world');
    });

    test('should call subscribed callbacks on state change', () => {
        const callback = jest.fn();
        subscribeStateChange('count', callback);

        setState('count', 10);
        expect(callback).toHaveBeenCalledWith(10);
    });

    test('should cache state values', () => {
        setState('count', 5);
        const cacheObject = getCacheObject();
        expect(cacheObject['count'].value).toBe(5); // 'value' 프로퍼티를 사용하여 검증
    });
});
