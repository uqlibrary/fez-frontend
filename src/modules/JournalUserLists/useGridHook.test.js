import { renderHook, act } from 'test-utils';
import { useGrid } from './useGridHook';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
}));

const createAction = jest.fn();
const updateAction = jest.fn();
const deleteAction = jest.fn();

const existingRow = { id: '1', label: 'List one', is_public: true };
const newRowData = { id: 'new-1', label: 'New list', is_public: false, isNew: true };

const setupHook = () => renderHook(() => useGrid({ createAction, updateAction, deleteAction }));

describe('useGrid', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('handleUpdateRow', () => {
        it('should replace only the matching row when creating succeeds, leaving others untouched', async () => {
            createAction.mockReturnValue({ type: 'CREATE' });
            mockDispatch.mockResolvedValue({ data: { id: '2', label: 'New list', is_public: false } });
            const { result } = setupHook();

            act(() => {
                result.current.setRows([existingRow, newRowData]);
            });

            await act(async () => {
                await result.current.handleUpdateRow(newRowData, newRowData);
            });

            expect(result.current.rows).toEqual([existingRow, { id: '2', label: 'New list', is_public: false }]);
        });

        it('should remove the row on create failure', async () => {
            createAction.mockReturnValue({ type: 'CREATE' });
            mockDispatch.mockRejectedValue(new Error('create failed'));
            const { result } = setupHook();

            act(() => {
                result.current.setRows([newRowData]);
            });

            let returned;
            await act(async () => {
                returned = await result.current.handleUpdateRow(newRowData, newRowData);
            });

            expect(returned).toEqual(newRowData);
            expect(result.current.rows).toEqual([]);
        });

        it('should update an existing row on success', async () => {
            updateAction.mockReturnValue({ type: 'UPDATE' });
            mockDispatch.mockResolvedValue(undefined);
            const { result } = setupHook();

            const newData = { ...existingRow, label: 'Updated label' };
            let updated;
            await act(async () => {
                updated = await result.current.handleUpdateRow(newData, existingRow);
            });

            expect(updateAction).toHaveBeenCalledWith(newData);
            expect(updated).toEqual(newData);
        });

        it('should return oldData on update failure', async () => {
            updateAction.mockReturnValue({ type: 'UPDATE' });
            mockDispatch.mockRejectedValue(new Error('update failed'));
            const { result } = setupHook();

            const newData = { ...existingRow, label: 'Updated label' };
            let returned;
            await act(async () => {
                returned = await result.current.handleUpdateRow(newData, existingRow);
            });

            expect(returned).toEqual(existingRow);
        });

        it('should toggle processing while updating', async () => {
            updateAction.mockReturnValue({ type: 'UPDATE' });
            let resolveDispatch;
            mockDispatch.mockReturnValue(
                new Promise(res => {
                    resolveDispatch = res;
                }),
            );
            const { result } = setupHook();

            let updatePromise;
            act(() => {
                updatePromise = result.current.handleUpdateRow(existingRow, existingRow);
            });

            expect(result.current.processing).toBe(true);

            await act(async () => {
                resolveDispatch(undefined);
                await updatePromise;
            });

            expect(result.current.processing).toBe(false);
        });
    });

    describe('handleDeleteRow', () => {
        it('should do nothing if row is not found', async () => {
            const { result } = setupHook();

            await act(async () => {
                await result.current.handleDeleteRow('missing-id');
            });

            expect(deleteAction).not.toHaveBeenCalled();
        });

        it('should call deleteAction and remove row on success for existing row', async () => {
            deleteAction.mockReturnValue({ type: 'DELETE' });
            mockDispatch.mockResolvedValue(undefined);
            const { result } = setupHook();

            act(() => {
                result.current.setRows([existingRow]);
            });

            await act(async () => {
                await result.current.handleDeleteRow(existingRow.id);
            });

            expect(deleteAction).toHaveBeenCalledWith(existingRow.id);
            expect(result.current.rows).toEqual([]);
            expect(result.current.deleteRowId).toBeNull();
        });

        it('should log error and reset deleteRowId on delete failure', async () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            deleteAction.mockReturnValue({ type: 'DELETE' });
            mockDispatch.mockRejectedValue(new Error('delete failed'));
            const { result } = setupHook();

            act(() => {
                result.current.setRows([existingRow]);
                result.current.setDeleteRowId(existingRow.id);
            });

            await act(async () => {
                await result.current.handleDeleteRow(existingRow.id);
            });

            expect(consoleErrorSpy).toHaveBeenCalled();
            expect(result.current.rows).toEqual([existingRow]);
            expect(result.current.deleteRowId).toBeNull();

            consoleErrorSpy.mockRestore();
        });
    });
});
