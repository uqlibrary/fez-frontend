import React from 'react';
import {
    GridRowModes,
    DataGrid as MuiDataGrid,
    GridToolbarContainer,
    GridRowModesModel,
    GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import Add from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { locale } from 'locale';
import { Row, useGrid } from './useGridHook';
import { useColumns } from './useColumns';
import { FezJournalUserList } from 'types/models/FezJournalUserList';
import { Box } from '@mui/material';

interface DataGridProps {
    data?: { data: FezJournalUserList[] };
    createAction: (payload: Partial<Row>) => unknown;
    updateAction: (payload: Partial<FezJournalUserList>) => unknown;
    deleteAction: (id: number) => unknown;
}

export const DataGrid = ({ data, createAction, updateAction, deleteAction }: DataGridProps) => {
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

    const onAddClick = React.useCallback(() => {
        const newRow: Row = {
            fjl_id: -(rows.length + 1), // set temp id as a negative number to avoid collisions
            fjl_label: '',
            fjl_is_public: false,
            isNew: true,
        };
        setEditingLabel('');
        setRows(prev => [newRow, ...prev]);
        setRowModesModel(prev => ({
            ...prev,
            [newRow.fjl_id]: { mode: GridRowModes.Edit, fieldToFocus: 'fjl_label' },
        }));
    }, [rows]);

    const onEditClick = React.useCallback(
        (id: number) => () => {
            const row = rows.find(r => r.fjl_id === id);
            setEditingLabel(row?.fjl_label ?? /* istanbul ignore next */ '');
            setRowModesModel({
                [id]: { mode: GridRowModes.Edit, fieldToFocus: 'fjl_label' },
            });
        },
        [rows],
    );

    const onSaveClick = React.useCallback(
        (id: number) => () => setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } }),
        [rowModesModel],
    );

    const onDeleteClick = React.useCallback((id: number) => () => setDeleteRowId(id), []);

    const onCancelClick = React.useCallback(
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
                onCancelClick(Number(params.id))();
            }
        },
        [onCancelClick],
    );

    const columns = useColumns({
        txt: txt.grid,
        deleteRowId,
        editingLabel,
        setEditingLabel,
        onCancelClick,
        onDeleteClick,
        handleDeleteRow,
        onEditClick,
        onSaveClick,
        rowModesModel,
        rows,
    });

    const Toolbar = () => (
        <GridToolbarContainer
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 1,
                width: '100%',
            }}
        >
            <GridToolbarQuickFilter
                debounceMs={300}
                data-testid="journal-user-lists-quicksearch"
                sx={{
                    width: { xs: '100%', sm: 240 },
                }}
            />

            <Box sx={{ flexGrow: 1 }} />

            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={onAddClick}
                sx={{
                    mr: 1,
                    mb: 1,
                    width: { xs: '100%', sm: 'auto' },
                }}
                data-testid="journal-user-lists-add"
                disabled={
                    Object.values(rowModesModel).some(rowMode => rowMode.mode === GridRowModes.Edit) || !!deleteRowId
                }
            >
                Add new list
            </Button>
        </GridToolbarContainer>
    );

    return (
        <MuiDataGrid
            data-testid="journal-user-lists-grid"
            rowHeight={38}
            initialState={{
                pagination: {
                    paginationModel: {
                        page: 0,
                        pageSize: 10,
                    },
                },
            }}
            pageSizeOptions={[10, 25, 50, 100]}
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
            slotProps={{
                toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: {
                        debounceMs: 300,
                    },
                },
            }}
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
        />
    );
};

export default React.memo(DataGrid);
