import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import type { GridRowModesModel } from '@mui/x-data-grid';
import { AnyAction } from 'redux';
import { FezJournalUserList } from 'types/models/FezJournalUserList';

export interface Row extends FezJournalUserList {
    isNew?: boolean;
    tableData?: unknown;
}

interface UseGridParams {
    createAction: (payload: Partial<Row>) => unknown;
    updateAction: (payload: Partial<FezJournalUserList>) => unknown;
    deleteAction: (id: number) => unknown;
}

export const useGrid = ({ createAction, updateAction, deleteAction }: UseGridParams) => {
    const dispatch = useDispatch();
    const [rows, setRows] = useState<Row[]>([]);
    const [processing, setProcessing] = useState(false);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [deleteRowId, setDeleteRowId] = useState<number | null>(null);
    const [editingLabel, setEditingLabel] = useState('');

    const withProcessing = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
        setProcessing(true);
        try {
            return await fn();
        } finally {
            setProcessing(false);
        }
    }, []);

    const handleUpdateRow = useCallback(
        async (newRow: Row, oldData: Row): Promise<Row> =>
            withProcessing(async () => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { tableData, isNew, ...updates } = newRow;
                // update
                if (!isNew) {
                    return (
                        dispatch(updateAction(updates) as AnyAction)
                            .then(() => updates as Row)
                            // rollback updates
                            .catch(() => oldData)
                    );
                }

                // eslint-disable-next-line @typescript-eslint/no-unused-vars,camelcase
                const { id, ...payload } = updates;
                // add new
                return dispatch(createAction(payload) as AnyAction)
                    .then((created: unknown) => {
                        // @ts-expect-error TODO fix when adding response type
                        const newRow = created?.data;
                        // replace temp row with definitive one
                        setRows(prev => prev.map(row => (row.id === oldData.id ? newRow : row)));
                        return newRow;
                    })
                    .catch(() => {
                        // rollback new row addition
                        setRows(prev => prev.filter(row => row.id !== oldData.id));
                        return oldData;
                    });
            }),
        [dispatch, withProcessing],
    );

    const handleDeleteRow = useCallback(
        async (id: number) => {
            const row = rows.find(r => r.id === id);
            if (!row) return;

            await withProcessing(async () => {
                try {
                    await dispatch(deleteAction(id) as AnyAction);
                    setRows(prev => prev.filter(r => r.id !== id));
                } catch (e) {
                    console.error(e);
                } finally {
                    setDeleteRowId(null);
                }
            });
        },
        [dispatch, rows, withProcessing],
    );

    return {
        rows,
        setRows,
        processing,
        rowModesModel,
        setRowModesModel,
        deleteRowId,
        setDeleteRowId,
        editingLabel,
        setEditingLabel,
        handleUpdateRow,
        handleDeleteRow,
    };
};
