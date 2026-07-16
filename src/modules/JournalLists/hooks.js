import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

export const useGrid = ({ createAction, updateAction, deleteAction }) => {
    const dispatch = useDispatch();
    const [rows, setRows] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [rowModesModel, setRowModesModel] = useState({});
    const [deleteRowId, setDeleteRowId] = useState(null);
    const [editingLabel, setEditingLabel] = useState('');

    const withProcessing = useCallback(async fn => {
        setProcessing(true);
        try {
            return await fn();
        } finally {
            setProcessing(false);
        }
    }, []);

    const handleUpdateRow = useCallback(
        async (newData, oldData) =>
            withProcessing(async () => {
                const { tableData, isNew, ...updates } = newData;

                if (isNew) {
                    const { fjl_id, ...payload } = updates;

                    return dispatch(createAction(payload))
                        .then(created => {
                            const newRow = created?.data ?? created;
                            setRows(prev => prev.map(row => (row.fjl_id === oldData.fjl_id ? newRow : row)));
                            return newRow;
                        })
                        .catch(() => {
                            setRows(prev => prev.filter(row => row.fjl_id !== oldData.fjl_id));
                            return oldData;
                        });
                }

                return dispatch(updateAction(updates))
                    .then(() => newData)
                    .catch(() => oldData);
            }),
        [dispatch, withProcessing],
    );

    const handleDeleteRow = useCallback(
        async id => {
            const row = rows.find(r => r.fjl_id === id);

            if (!row) return;

            if (row.isNew) {
                setRows(prev => prev.filter(r => r.fjl_id !== id));
                setDeleteRowId(null);
                return;
            }

            await withProcessing(async () => {
                try {
                    await dispatch(deleteAction(id));
                    setRows(prev => prev.filter(r => r.fjl_id !== id));
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
