import { renderHook } from '@testing-library/react';
import { useControlledVocabs } from './useControlledVocabs';
import { useSelector } from 'react-redux';
import { useDispatchOnce } from './useDispatchOnce';
import { loadVocabulariesList } from '../actions';

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
}));

jest.mock('./useDispatchOnce', () => ({
    useDispatchOnce: jest.fn(),
}));

jest.mock('../actions', () => ({
    loadVocabulariesList: jest.fn(),
}));

describe('useControlledVocabs', () => {
    let defaultState;
    let cvoId;

    const mockUseSelector = (cvoId, state) => {
        const mockGlobalState = {
            get: jest.fn(reducerName => reducerName === 'controlledVocabulariesReducer' && { [cvoId]: state }),
        };
        useSelector.mockImplementation(selectorCallback => selectorCallback(mockGlobalState));
        return mockGlobalState;
    };

    beforeEach(() => {
        cvoId = 42;
        defaultState = {
            rawData: [],
            itemsLoaded: false,
            itemsLoading: false,
            itemsKeyValueList: [],
        };
        jest.clearAllMocks();
    });

    it('should use default values when selector returns undefined', () => {
        useSelector.mockReturnValue(undefined);
        const mockFetch = jest.fn();
        useDispatchOnce.mockReturnValue(mockFetch);

        const { result } = renderHook(() => useControlledVocabs(cvoId));

        expect(result.current.raw).toEqual(defaultState.rawData);
        expect(result.current.items).toEqual(defaultState.itemsKeyValueList);
        expect(result.current.itemsLoaded).toBe(defaultState.itemsLoaded);
        expect(result.current.itemsLoading).toBe(defaultState.itemsLoading);
        expect(useDispatchOnce).toHaveBeenCalledWith(defaultState.itemsLoaded, expect.any(Function));
        expect(result.current.fetch).toBe(mockFetch);
    });

    it('should use values returned by selector', () => {
        const state = {
            // This is the state for the specific cvoId
            rawData: [1, 2, 3],
            itemsLoaded: true,
            itemsLoading: false,
            itemsKeyValueList: ['a', 'b'],
        };
        const mockGlobalState = mockUseSelector(cvoId, state);
        const mockFetch = jest.fn();
        useDispatchOnce.mockReturnValue(mockFetch);

        const { result } = renderHook(() => useControlledVocabs(cvoId));

        expect(result.current.raw).toEqual(state.rawData);
        expect(result.current.items).toEqual(state.itemsKeyValueList);
        expect(result.current.itemsLoaded).toBe(state.itemsLoaded);
        expect(result.current.itemsLoading).toBe(state.itemsLoading);
        expect(useDispatchOnce).toHaveBeenCalledWith(state.itemsLoaded, expect.any(Function));
        expect(result.current.fetch).toBe(mockFetch);
        expect(mockGlobalState.get).toHaveBeenCalledWith('controlledVocabulariesReducer');
    });

    it('should use given transformer (raw)', () => {
        const state = {
            rawData: [1, 2, 3],
            itemsLoaded: true,
            itemsLoading: false,
            itemsKeyValueList: ['a', 'b'],
        };
        mockUseSelector(cvoId, state);
        const mockFetch = jest.fn();
        useDispatchOnce.mockReturnValue(mockFetch);
        const transformer = raw => raw.map(x => x * 2);

        const { result } = renderHook(() => useControlledVocabs(cvoId, transformer));

        expect(result.current.raw).toEqual(state.rawData);
        expect(result.current.items).toEqual([2, 4, 6]);
    });

    it('should use given transformer (itemsKeyValueList)', () => {
        const state = {
            rawData: [1, 2, 3],
            itemsLoaded: true,
            itemsLoading: false,
            itemsKeyValueList: [
                { key: 1, value: 'a' },
                { key: 2, value: 'b' },
            ],
        };
        mockUseSelector(cvoId, state);
        const mockFetch = jest.fn();
        useDispatchOnce.mockReturnValue(mockFetch);
        const transformer = (raw, itemsKeyValueList) => itemsKeyValueList.map(item => ({ ...item, key: item.key * 2 }));

        const { result } = renderHook(() => useControlledVocabs(cvoId, transformer));

        expect(result.current.raw).toEqual(state.rawData);
        expect(result.current.items).toEqual([
            { key: 2, value: 'a' },
            { key: 4, value: 'b' },
        ]);
    });

    it('should use given getDispatchable when fetch is invoked', () => {
        mockUseSelector(cvoId, defaultState);
        useDispatchOnce.mockImplementation((flag, getDispatchable) => {
            // simulate calling the callback
            const action = getDispatchable();
            return () => action;
        });
        loadVocabulariesList.mockReturnValue({ type: 'LOAD', id: cvoId });

        const { result } = renderHook(() => useControlledVocabs(cvoId));

        const returnedAction = result.current.fetch();
        expect(loadVocabulariesList).toHaveBeenCalledWith(cvoId);
        expect(returnedAction).toEqual({ type: 'LOAD', id: cvoId });
    });
});
