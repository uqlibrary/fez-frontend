import React from 'react';
import { GridRowModes, DataGrid as MuiDataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import Add from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { locale } from 'locale';
import { useGrid } from './hooks';
import { classes, useColumns } from './columns';

// eslint-disable-next-line react/prop-types
export const DataGrid = ({ data, error, createAction, updateAction, deleteAction }) => {
    const txt = locale.components.journalLists;
    const {
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
    } = useGrid({ createAction, updateAction, deleteAction });

    React.useEffect(() => {
        setRows(data?.data);
    }, [data?.data]);

    const handleRowModesModelChange = React.useCallback(newRowModesModel => setRowModesModel(newRowModesModel), []);

    const handleAddClick = React.useCallback(() => {
        const id = `new-${Date.now()}`;
        const newRow = { fjl_id: id, fjl_label: '', fjl_private: true, isNew: true };
        setEditingLabel('');
        setRows(prev => [newRow, ...prev]);
        setRowModesModel(prev => ({
            ...prev,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'fjl_label' },
        }));
    }, []);

    const handleEditClick = React.useCallback(
        id => () => {
            const row = rows.find(r => r.fjl_id === id);
            setEditingLabel(row?.fjl_label ?? '');
            setRowModesModel({
                [id]: { mode: GridRowModes.Edit },
            });
        },
        [rows],
    );

    const handleSaveClick = React.useCallback(
        id => () => setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } }),
        [rowModesModel],
    );

    const handleDeleteClick = React.useCallback(id => () => setDeleteRowId(id), []);

    const handleCancelClick = React.useCallback(
        id => () => {
            setRowModesModel({
                ...rowModesModel,
                [id]: { mode: GridRowModes.View, ignoreModifications: true },
            });
            setDeleteRowId(null);
            setRows(prev => prev.filter(row => !(row.fjl_id === id && row.isNew)));
        },
        [rowModesModel],
    );

    const handleCellKeyDown = React.useCallback(
        (params, event) => {
            if (event.key === 'Escape' && params.row?.isNew) {
                event.defaultMuiPrevented = true;
                handleCancelClick(params.id)();
            }
        },
        [handleCancelClick],
    );

    const columns = useColumns({
        txt: txt.grid,
        deleteRowId,
        editingLabel,
        setEditingLabel,
        handleCancelClick,
        handleDeleteClick,
        handleDeleteRow,
        handleEditClick,
        handleSaveClick,
        rowModesModel,
        rows,
    });

    const Toolbar = () => (
        <GridToolbarContainer sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            {error?.trim?.() && (
                <Typography
                    color="error"
                    variant="caption"
                    data-testid="journal-lists-error"
                    sx={{ flexGrow: 1, m: 1 }}
                >
                    {error}
                </Typography>
            )}
            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddClick}
                data-testid="favourite-search-list-add"
                disabled={
                    Object.values(rowModesModel).some(rowMode => rowMode.mode === GridRowModes.Edit) || !!deleteRowId
                }
            >
                {'Add new list'}
            </Button>
        </GridToolbarContainer>
    );

    return (
        <MuiDataGrid
            id="favourite-search-list"
            data-testid="favourite-search-list"
            rows={rows}
            getRowId={row => row.fjl_id}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            loading={processing}
            onRowModesModelChange={handleRowModesModelChange}
            processRowUpdate={handleUpdateRow}
            onCellKeyDown={handleCellKeyDown}
            onProcessRowUpdateError={error => console.error(error)}
            localeText={{ noRowsLabel: txt.grid.noRowsLabel }}
            slots={{ toolbar: Toolbar }}
            sx={{
                border: 0,
                '& .cell-styled': {
                    lineHeight: 1.43,
                    alignContent: 'center',
                    ...classes.text,
                },
                '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
                    outline: 'none !important',
                },
            }}
            disableDensitySelector
            disableColumnMenu
            disableColumnFilter
            disableColumnSelector
            disableSelectionOnClick
            disableRowSelectionOnClick
            disableVirtualization
        />
    );
};

export default React.memo(DataGrid);
