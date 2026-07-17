import React from 'react';
import { GridRowModes, DataGrid as MuiDataGrid, GridToolbarContainer, GridRowModesModel } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import Add from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { locale } from 'locale';
import { Row, useGrid } from './hooks';
import { useColumns } from './columns';
import { FezJournalUserList } from 'types/models/FezJournalUserList';

interface DataGridProps {
    data?: { data: FezJournalUserList[] };
    error?: string;
    createAction: (payload: Partial<Row>) => unknown;
    updateAction: (payload: Partial<FezJournalUserList>) => unknown;
    deleteAction: (id: number) => unknown;
}

export const DataGrid = ({ data, error, createAction, updateAction, deleteAction }: DataGridProps) => {
    const txt = locale.components.journalUserLists;
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
        setRows(data?.data ?? /* istanbul ignore next */ []);
    }, [data?.data]);

    const handleRowModesModelChange = React.useCallback(
        (fezJournalUserListModesModel: GridRowModesModel) => setRowModesModel(fezJournalUserListModesModel),
        [],
    );

    const handleAddClick = React.useCallback(() => {
        const newRow: Row = {
            fjl_id: -(rows.length + 1), // set temp id as a negative number to avoid collisions
            fjl_label: '',
            fjl_private: true,
            isNew: true,
        };
        setEditingLabel('');
        setRows(prev => [newRow, ...prev]);
        setRowModesModel(prev => ({
            ...prev,
            [newRow.fjl_id]: { mode: GridRowModes.Edit, fieldToFocus: 'fjl_label' },
        }));
    }, [rows]);

    const handleEditClick = React.useCallback(
        (id: number) => () => {
            const row = rows.find(r => r.fjl_id === id);
            setEditingLabel(row?.fjl_label ?? /* istanbul ignore next */ '');
            setRowModesModel({
                [id]: { mode: GridRowModes.Edit, fieldToFocus: 'fjl_label' },
            });
        },
        [rows],
    );

    const handleSaveClick = React.useCallback(
        (id: number) => () => setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } }),
        [rowModesModel],
    );

    const handleDeleteClick = React.useCallback((id: number) => () => setDeleteRowId(id), []);

    const handleCancelClick = React.useCallback(
        (id: number) => () => {
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
        (
            params: { id: number | string; row?: Row },
            event: React.KeyboardEvent & { defaultMuiPrevented?: boolean },
        ) => {
            if (event.key === 'Escape' && params.row?.isNew) {
                event.defaultMuiPrevented = true;
                handleCancelClick(Number(params.id))();
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
                    data-testid="journal-user-lists-error"
                    sx={{ flexGrow: 1, m: 1 }}
                >
                    {error}
                </Typography>
            )}
            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddClick}
                data-testid="journal-user-lists-add"
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
            data-testid="journal-user-lists-grid"
            rows={rows}
            getRowId={row => row.fjl_id}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            loading={processing}
            onRowModesModelChange={handleRowModesModelChange}
            processRowUpdate={handleUpdateRow}
            onCellKeyDown={handleCellKeyDown}
            onProcessRowUpdateError={/* istanbul ignore next */ (err: unknown) => console.error(err)}
            localeText={{ noRowsLabel: txt.grid.noRowsLabel }}
            slots={{ toolbar: Toolbar }}
            sx={{
                border: 0,
                '& .cell-styled': {
                    lineHeight: 1.43,
                    alignContent: 'center',
                },
                '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
                    outline: 'none !important',
                },
            }}
            disableDensitySelector
            disableColumnMenu
            disableColumnFilter
            disableColumnSelector
            disableRowSelectionOnClick
            disableVirtualization
        />
    );
};

export default React.memo(DataGrid);
