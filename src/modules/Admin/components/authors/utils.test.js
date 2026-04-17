import { commitRowChanges } from './utils';

describe('commitRowChanges', () => {
    it('does nothing when neither creatingRow nor editingRow exist', () => {
        const table = {
            getState: jest.fn(() => ({ creatingRow: null, editingRow: null })),
            options: {
                onCreatingRowSave: jest.fn(),
                onEditingRowSave: jest.fn(),
            },
        };

        commitRowChanges(table);

        expect(table.options.onCreatingRowSave).not.toHaveBeenCalled();
        expect(table.options.onEditingRowSave).not.toHaveBeenCalled();
    });

    it('calls onCreatingRowSave when creatingRow exists', () => {
        const row = { _valuesCache: { a: 1, b: 'x' } };
        const table = {
            getState: jest.fn(() => ({ creatingRow: row, editingRow: null })),
            options: {
                onCreatingRowSave: jest.fn(),
                onEditingRowSave: jest.fn(),
            },
        };

        commitRowChanges(table);

        expect(table.options.onCreatingRowSave).toHaveBeenCalledTimes(1);
        const arg = table.options.onCreatingRowSave.mock.calls[0][0];
        expect(arg.table).toBe(table);
        expect(arg.row).toBe(row);
        expect(arg.values).toEqual({ a: 1, b: 'x' });
        expect(table.options.onEditingRowSave).not.toHaveBeenCalled();
    });

    it('calls onEditingRowSave when editingRow exists', () => {
        const row = { _valuesCache: { c: 3 } };
        const table = {
            getState: jest.fn(() => ({ creatingRow: null, editingRow: row })),
            options: {
                onCreatingRowSave: jest.fn(),
                onEditingRowSave: jest.fn(),
            },
        };

        commitRowChanges(table);

        expect(table.options.onEditingRowSave).toHaveBeenCalledTimes(1);
        const arg = table.options.onEditingRowSave.mock.calls[0][0];
        expect(arg.table).toBe(table);
        expect(arg.row).toBe(row);
        expect(arg.values).toEqual({ c: 3 });
        expect(table.options.onCreatingRowSave).not.toHaveBeenCalled();
    });

    it('prefers creatingRow when both creatingRow and editingRow exist', () => {
        const creating = { _valuesCache: { create: true } };
        const editing = { _valuesCache: { edit: true } };
        const table = {
            getState: jest.fn(() => ({ creatingRow: creating, editingRow: editing })),
            options: {
                onCreatingRowSave: jest.fn(),
                onEditingRowSave: jest.fn(),
            },
        };

        commitRowChanges(table);

        expect(table.options.onCreatingRowSave).toHaveBeenCalledTimes(1);
        const arg = table.options.onCreatingRowSave.mock.calls[0][0];
        expect(arg.row).toBe(creating);
        expect(arg.values).toEqual({ create: true });
        expect(table.options.onEditingRowSave).not.toHaveBeenCalled();
    });

    it('passes empty values object when _valuesCache is missing', () => {
        const row = {}; // no _valuesCache
        const table = {
            getState: jest.fn(() => ({ creatingRow: null, editingRow: row })),
            options: {
                onCreatingRowSave: jest.fn(),
                onEditingRowSave: jest.fn(),
            },
        };

        commitRowChanges(table);

        const arg = table.options.onEditingRowSave.mock.calls[0][0];
        expect(arg.values).toEqual({});
    });

    it('does not throw if handlers are undefined', () => {
        const row = { _valuesCache: { a: 1 } };
        const table = {
            getState: jest.fn(() => ({ creatingRow: row, editingRow: null })),
            options: {}, // no handlers
        };

        expect(() => commitRowChanges(table)).not.toThrow();
    });
});
