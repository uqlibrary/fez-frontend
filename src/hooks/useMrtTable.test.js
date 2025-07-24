import { renderHook, act } from 'test-utils';

import { useMrtTable } from './useMrtTable';

// Mock useConfirmationState
jest.mock('./index', () => ({
    useConfirmationState: jest.fn(() => [false, jest.fn(), jest.fn()]),
}));

describe('useMrtTable', () => {
    const sampleList = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
    ];

    const rules = [
        {
            validate: row => {
                if (!row.name) return { field: 'name', message: 'Name required' };
                return null;
            },
        },
        {
            validate: row => {
                if (row.age && row.age < 18) return { field: 'age', message: 'Must be 18+' };
                return null;
            },
        },
    ];

    it('initializes with provided list', () => {
        const { result } = renderHook(() => useMrtTable(sampleList, rules));
        expect(result.current.data).toEqual(sampleList);
    });

    it('setBusy updates busy state', () => {
        const { result } = renderHook(() => useMrtTable(sampleList, rules));
        act(() => result.current.setBusy(true));
        expect(result.current.isBusy).toBe(true);
        act(() => result.current.setBusy(false));
        expect(result.current.isBusy).toBe(false);
    });

    it('setDeleteRow and resetDeleteRow update pendingDeleteRowId', () => {
        const { result } = renderHook(() => useMrtTable(sampleList, rules));
        act(() => result.current.setDeleteRow(2));
        expect(result.current.pendingDeleteRowId).toBe(2);
        act(() => result.current.resetDeleteRow());
        expect(result.current.pendingDeleteRowId).toBe(null);
    });

    it('setEditRow and resetEditRow update editingRow', () => {
        const { result } = renderHook(() => useMrtTable(sampleList, rules));
        act(() => result.current.setEditRow({ id: 1 }));
        expect(result.current.editingRow).toEqual({ id: 1 });
        act(() => result.current.resetEditRow());
        expect(result.current.editingRow).toBe(null);
    });

    it('validate returns errors array if validation fails', () => {
        const { result } = renderHook(() => useMrtTable(sampleList, rules));
        const invalidRow = { name: '', age: 15 };
        const errors = result.current.validate(invalidRow);
        expect(Array.isArray(errors)).toBe(true);
        expect(errors).toEqual([
            { field: 'name', message: 'Name required' },
            { field: 'age', message: 'Must be 18+' },
        ]);
    });

    it('validate returns null if validation passes', () => {
        const { result } = renderHook(() => useMrtTable(sampleList, rules));
        const validRow = { name: 'John', age: 20 };
        const errors = result.current.validate(validRow);
        expect(errors).toBeNull();
    });

    it('getValidationError returns correct message for field', () => {
        const { result } = renderHook(() => useMrtTable(sampleList, rules));
        const errors = [
            { field: 'name', message: 'Name required' },
            { field: 'age', message: 'Must be 18+' },
        ];
        expect(result.current.getValidationError(errors, 'name')).toBe('Name required');
        expect(result.current.getValidationError(errors, 'age')).toBe('Must be 18+');
        expect(result.current.getValidationError(errors, 'other')).toBeUndefined();
    });

    it('handleValidation sets validationErrors', () => {
        const { result } = renderHook(() => useMrtTable(sampleList, rules));
        const row = { id: 1, original: { name: '', age: 15 }, _valuesCache: {} };
        act(() => {
            result.current.handleValidation(row, 'name', '');
        });
        expect(result.current.validationErrors[1]).toEqual([
            { field: 'name', message: 'Name required' },
            { field: 'age', message: 'Must be 18+' },
        ]);
    });

    it('clearValidationErrors resets validationErrors', () => {
        const { result } = renderHook(() => useMrtTable(sampleList, rules));
        const row = { id: 1, original: { name: '', age: 15 }, _valuesCache: {} };
        act(() => {
            result.current.handleValidation(row, 'name', '');
        });
        expect(result.current.validationErrors[1]).toBeDefined();
        act(() => {
            result.current.clearValidationErrors();
        });
        expect(result.current.validationErrors).toEqual({});
    });

    it('hasValidationErrors returns true if errors exist for id', () => {
        const { result } = renderHook(() => useMrtTable(sampleList, rules));
        act(() => {
            result.current.setData([{ id: 1, name: '' }]);
            result.current.handleValidation({ id: 1, original: { name: '' }, _valuesCache: {} }, 'name', '');
        });
        expect(result.current.hasValidationErrors(1)).toBe(true);
    });

    it('hasValidationErrors returns false if no errors for id', () => {
        const { result } = renderHook(() => useMrtTable(sampleList, rules));
        expect(result.current.hasValidationErrors(1)).toBe(false);
    });
});
