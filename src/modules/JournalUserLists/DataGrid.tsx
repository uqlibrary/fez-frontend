import React, { useState } from 'react';
import {
    GridRowModes,
    DataGrid as MuiDataGrid,
    GridToolbarContainer,
    GridRowModesModel,
    GridToolbarQuickFilter,
    GridCellParams,
    useGridApiRef,
} from '@mui/x-data-grid';
import Add from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { locale } from 'locale';
import { Row, useGrid } from './useGridHook';
import { useColumns } from './useColumns';
import { FezJournalUserList } from 'types/models/FezJournalUserList';
import { Box } from '@mui/material';
import CopyToClipboardDialog from 'modules/SharedComponents/Toolbox/CopyToClipboardDialog';
import { useCopyToClipboard } from 'usehooks-ts';

interface DataGridProps {
    data?: { data: FezJournalUserList[] };
    createAction: (payload: Partial<Row>) => unknown;
    updateAction: (payload: Partial<FezJournalUserList>) => unknown;
    deleteAction: (id: number) => unknown;
    loading: boolean;
}

export const DataGrid = ({ data, loading, createAction, updateAction, deleteAction }: DataGridProps) => {
    const txt = locale.components.journalUserLists;
    const apiRef = useGridApiRef();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, copyToClipboard] = useCopyToClipboard();
    const [linkToBeCopied, setLinkToBeCopied] = useState('');
    const [isCopyLinkDialogOpen, setIsCopyLinkDialogOpen] = useState(false);
    const {
        rows,
        setRows,
        processing,
        rowModesModel,
        setRowModesModel,
        deleteRowId,
        setDeleteRowId,
        editingLabel,
        paginationModel,
        setPaginationModel,
        setEditingLabel,
        handleUpdateRow,
        handleDeleteRow,
        handleResetPagination,
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
            id: -(rows.length + 1), // set temp id as a negative number to avoid collisions
            label: '',
            is_public: false,
            isNew: true,
        };
        setEditingLabel('');
        setRows(prev => [newRow, ...prev]);
        setRowModesModel(prev => ({
            ...prev,
            [newRow.id]: { mode: GridRowModes.Edit, fieldToFocus: 'label' },
        }));
        handleResetPagination();
    }, [rows]);

    const onEditClick = React.useCallback(
        (id: number) => () => {
            const row = rows.find(r => r.id === id);
            setEditingLabel(row?.label ?? /* istanbul ignore next */ '');
            setRowModesModel({
                [id]: { mode: GridRowModes.Edit, fieldToFocus: 'label' },
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
            setRows(prev => prev.filter(row => !(row.id === id && row.isNew)));
        },
        [rowModesModel],
    );

    const handleCellKeyDown = React.useCallback(
        (params: GridCellParams, event: React.KeyboardEvent & { defaultMuiPrevented?: boolean }) => {
            // for new rows only - the grid already take care of the below for existing rows
            if (!params.row.isNew) return;

            // cancel row adding on esc key
            if (event.key === 'Escape') {
                event.defaultMuiPrevented = true;
                onCancelClick(Number(params.id))();
                return;
            }

            // avoid empty rows from being added
            /* istanbul ignore else */
            if (event.key === 'Enter') {
                // apiRef has to be used, as `params.row` is stale
                const row = apiRef.current.getRowWithUpdatedValues(params.id, '');
                /* istanbul ignore else */
                if (!row.label?.trim?.()) {
                    event.defaultMuiPrevented = true;
                }
            }
        },
        [onCancelClick],
    );

    const onShareListClick = (url: string) => {
        setLinkToBeCopied(url);
        setIsCopyLinkDialogOpen(true);
    };

    const onCopiedLink = async () => {
        await copyToClipboard(linkToBeCopied);
        setIsCopyLinkDialogOpen(false);
    };

    const onCloseCopyLinkDialog = () => setIsCopyLinkDialogOpen(false);

    const columns = useColumns({
        txt: txt.grid,
        deleteRowId,
        editingLabel,
        setEditingLabel,
        onCancelClick,
        onDeleteClick,
        handleDeleteRow,
        onShareListClick,
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
                slotProps={{ htmlInput: { 'data-testid': 'journal-user-lists-quicksearch-input' } }}
                disabled={processing || loading}
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
                    Object.values(rowModesModel).some(rowMode => rowMode.mode === GridRowModes.Edit) ||
                    !!deleteRowId ||
                    processing ||
                    loading
                }
            >
                Add new list
            </Button>
        </GridToolbarContainer>
    );

    return (
        <>
            <CopyToClipboardDialog
                title={txt.grid.columns.links.sharable.copyLink.title}
                open={isCopyLinkDialogOpen}
                text={linkToBeCopied}
                onCopy={onCopiedLink}
                onClose={onCloseCopyLinkDialog}
            />
            <MuiDataGrid
                apiRef={apiRef}
                data-testid="journal-user-lists-grid"
                rowHeight={38}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[10, 25, 50, 100]}
                rows={rows}
                getRowId={row => row.id}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                loading={processing || loading}
                disableColumnResize={processing || loading}
                disableColumnSorting={processing || loading}
                onRowModesModelChange={handleRowModesModelChange}
                processRowUpdate={handleUpdateRow}
                onCellKeyDown={handleCellKeyDown}
                onCellDoubleClick={(_, event) => event.stopPropagation()}
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
        </>
    );
};

export default React.memo(DataGrid);
