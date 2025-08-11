import * as Utils from './utils';

describe('commitRowChanges', () => {
    it('should call onCreatingRowSave when creatingRow exists', async () => {
        const mockOnCreatingRowSave = jest.fn();
        const table = {
            getState: jest.fn().mockReturnValue({
                creatingRow: { _valuesCache: { foo: 'bar' } },
                editingRow: null,
            }),
            options: {
                onCreatingRowSave: mockOnCreatingRowSave,
            },
        };
        await Utils.commitRowChanges(table);
        expect(mockOnCreatingRowSave).toHaveBeenCalledWith({
            table,
            row: { _valuesCache: { foo: 'bar' } },
            values: { foo: 'bar' },
        });
    });

    it('should call onEditingRowSave when editingRow exists', async () => {
        const mockOnEditingRowSave = jest.fn();
        const table = {
            getState: jest.fn().mockReturnValue({
                creatingRow: null,
                editingRow: { _valuesCache: { baz: 'qux' } },
            }),
            options: {
                onEditingRowSave: mockOnEditingRowSave,
            },
        };
        await Utils.commitRowChanges(table);
        expect(mockOnEditingRowSave).toHaveBeenCalledWith({
            table,
            row: { _valuesCache: { baz: 'qux' } },
            values: { baz: 'qux' },
        });
    });

    it('should not call any save function if no row exists', async () => {
        const table = {
            getState: jest.fn().mockReturnValue({
                creatingRow: null,
                editingRow: null,
            }),
            options: {},
        };
        await Utils.commitRowChanges(table);
        // No save function should be called
        expect(table.options.onCreatingRowSave).toBeUndefined();
        expect(table.options.onEditingRowSave).toBeUndefined();
    });

    it('should handle missing _valuesCache gracefully', async () => {
        const mockOnEditingRowSave = jest.fn();
        const table = {
            getState: jest.fn().mockReturnValue({
                creatingRow: null,
                editingRow: {},
            }),
            options: {
                onEditingRowSave: mockOnEditingRowSave,
            },
        };
        await Utils.commitRowChanges(table);
        expect(mockOnEditingRowSave).toHaveBeenCalledWith({
            table,
            row: {},
            values: {},
        });
    });

    it('should not throw if save functions are missing', async () => {
        const table = {
            getState: jest.fn().mockReturnValue({
                creatingRow: { _valuesCache: { foo: 'bar' } },
                editingRow: null,
            }),
            options: {},
        };
        await expect(Utils.commitRowChanges(table)).resolves.toBeUndefined();
    });
});
