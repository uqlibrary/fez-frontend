import { useCallback, useState } from 'react';
import { GridRowModes } from '@mui/x-data-grid';

export const useDecoratedDataGrid = (list, handleRowUpdate, handleRowDelete) => {
    const [rows, setRows] = useState(list);
    const [loading, setLoading] = useState(false);
    const [rowModesModel, setRowModesModel] = useState({});
    const [deleteRowId, setDeleteRowId] = useState(null);

    const handleUpdateRow = useCallback(
        async (newData, oldData) => {
            setLoading(true);
            const res = await handleRowUpdate(newData, oldData);
            setLoading(false);
            return res;
        },
        [handleRowUpdate],
    );

    const handleDeleteRow = useCallback(
        (id, rows) => async () => {
            setLoading(true);
            const rowToDelete = rows.find(row => row.fvs_id === id);
            const newRows = await handleRowDelete(rows, rowToDelete);
            setRows(newRows);
            setDeleteRowId(null);
            setLoading(false);
        },
        [handleRowDelete],
    );

    const handleRowModesModelChange = useCallback(newRowModesModel => {
        setRowModesModel(newRowModesModel);
    }, []);

    const handleEditClick = useCallback(
        id => () => {
            setRowModesModel({
                [id]: { mode: GridRowModes.Edit },
            });
        },
        [],
    );

    const handleSaveClick = useCallback(
        id => () => {
            setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
        },
        [rowModesModel],
    );

    const handleDeleteClick = useCallback(
        id => () => {
            setDeleteRowId(id);
        },
        [],
    );

    const handleCancelClick = useCallback(
        id => () => {
            setRowModesModel({
                ...rowModesModel,
                [id]: { mode: GridRowModes.View, ignoreModifications: true },
            });

            setDeleteRowId(null);
        },
        [rowModesModel],
    );

    return {
        loading,
        deleteRowId,
        rows,
        rowModesModel,
        handleUpdateRow,
        handleDeleteRow,
        handleRowModesModelChange,
        handleEditClick,
        handleSaveClick,
        handleDeleteClick,
        handleCancelClick,
    };
};
