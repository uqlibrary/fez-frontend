import { useCallback, useState } from 'react';
import { GridRowModes } from '@mui/x-data-grid';

/**
 *
 * @param {Array} list Array of items to show in the DataGrid
 * @param {function} handleRowUpdate Function to call when updating a row in the DataGrid.
 * This function will be called with the arguments newData nad oldData, and should return the next state's list array.
 * @param {function} handleRowDelete Function to call when deleting a row in the DataGrid.
 * This function will be called with an object argument including rows, rowToDelete & rowIdentifier,
 * and should return the next state's list array.
 * Should supply the parameters id, rows & rowIdentifier.
 * @returns {Object} {
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
 */
export const useDataGrid = (list, handleRowUpdate, handleRowDelete) => {
    const [rows, setRows] = useState(list);
    const [busy, setBusy] = useState(false);
    const [rowModesModel, setRowModesModel] = useState({});
    const [deleteRowId, setDeleteRowId] = useState(null);

    const handleUpdateRow = useCallback(
        async (newData, oldData) => {
            setBusy(true);
            const res = await handleRowUpdate(newData, oldData);
            setBusy(false);
            return res;
        },
        [handleRowUpdate],
    );

    const handleDeleteRow = useCallback(
        (id, rows, rowIdentifier) => async () => {
            setBusy(true);
            const rowToDelete = rows.find(row => row[rowIdentifier] === id);
            const newRows = await handleRowDelete({ rows, rowToDelete, rowIdentifier });
            setRows(newRows);
            setDeleteRowId(null);
            setBusy(false);
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
        loading: busy,
        deleteRowId,
        rows,
        setRows,
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
