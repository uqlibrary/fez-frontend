import { useCallback, useState } from 'react';
import { GridRowModes } from '@mui/x-data-grid';

export const NEWROWID = 0;
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
export const useDataGrid = ({ list, handleRowAdd, handleRowUpdate, handleRowDelete }) => {
    const [rows, setRows] = useState(list);
    const [busy, setBusy] = useState(false);
    const [rowModesModel, setRowModesModel] = useState({});
    const [deleteRowId, setDeleteRowId] = useState(null);

    const addNewRow = useCallback(newRow => {
        setRows(prevRows => [
            {
                ...newRow,
                isNew: true,
            },
            ...prevRows,
        ]);
    }, []);

    const handleUpdateRow = useCallback(
        async (newData, oldData) => {
            setBusy(true);

            const res = newData?.isNew ? await handleRowAdd(newData, rows) : await handleRowUpdate(newData, oldData);
            // if (!res)
            //     setRows(res);
            console.log(res);
            setBusy(false);
            if (!res) {
                if (newData?.isNew) {
                    return null;
                }
                return oldData;
            }

            return newData?.isNew ? { ...res, _action: 'delete' } : res;
        },
        [handleRowAdd, handleRowUpdate, rows],
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
        ({ apiRef, params }) => async () => {
            if (params.row?.isNew) {
                apiRef.current.stopRowEditMode({ id: params.id, ignoreModifications: true });
            } else {
                setRowModesModel({
                    ...rowModesModel,
                    [params.id]: { mode: GridRowModes.View, ignoreModifications: true },
                });
            }
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
        addNewRow,
        handleUpdateRow,
        handleDeleteRow,
        handleRowModesModelChange,
        handleEditClick,
        handleSaveClick,
        handleDeleteClick,
        handleCancelClick,
    };
};
