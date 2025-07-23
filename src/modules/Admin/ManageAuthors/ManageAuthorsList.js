/* eslint-disable react/prop-types */
import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';

// eslint-disable-next-line camelcase
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

import { debounce } from 'throttle-debounce';

import { tableIcons } from './ManageAuthorsListIcons';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import ColumnTitle from './partials/ColumnTitle';
import ColumnData from './partials/ColumnData';
import FullAuthorDetails from './partials/FullAuthorDetails';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';

import { default as locale } from 'locale/components';
import { loadAuthorList } from 'actions';
import { useConfirmationState } from 'hooks';
import { BULK_DELETE_AUTHOR_SUCCESS, SCOPUS_INGESTED_AUTHORS } from 'config/general';

import { useMrtTable, useServerData } from 'hooks';

export const ManageAuthorsList = ({ onBulkRowDelete, onRowAdd, onRowDelete, onRowUpdate, onScopusIngest }) => {
    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down('md'));
    const [searchTerm, setSearchTerm] = useState('');
    const [isScopusIngestOpen, showScopusIngestConfirmation, hideScopusIngestConfirmation] = useConfirmationState();

    const scopusIngestAuthor = React.useRef();

    const {
        tablePageSizeOptions,
        tablePageSizeDefault,
        header: {
            columns: { id, displayName, uqUsername },
        },
        form: {
            locale: {
                addButtonTooltip,
                bulkDeleteButtonTooltip,
                editButtonTooltip,
                deleteButtonTooltip,
                scopusIngestButtonTooltip,
                searchAriaLabel,
                searchPlaceholder,
            },
            deleteConfirmationLocale,
            bulkDeleteConfirmationLocale,
            scopusIngestConfirmationLocale,
        },
    } = locale.components.manageAuthors;

    const actions = useMemo(
        () => ({
            read: loadAuthorList,
        }),
        [],
    );

    const { authorListLoading, authorListItemUpdating, authorListItemDeleting, authorAdding } = useSelector(state =>
        state?.get('manageAuthorsReducer'),
    );

    const { data: list, pagination, request, onPaginationChange } = useServerData({
        actions,
        pageSize: tablePageSizeDefault,
    });

    const {
        data,
        isBusy,
        pendingDeleteRowId: pendingDeleteRowIndex,
        isOpen,
        editingRow,
        isPendingDelete,
        selectedRows,
        hasSelectedRows,
        setData,
        setBusy,
        setDeleteRow,
        resetDeleteRow,
        setEditRow,
        resetEditRow,
        setSelectedRows,
        resetSelectedRows,
        showConfirmation,
        hideConfirmation,
    } = useMrtTable(list);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'aut_id',
                header: id.title,
                Header: ({ column }) => <ColumnTitle title={column.columnDef.header} />,
                Cell: ({ cell, row }) => (
                    <ColumnData data={cell.getValue()} columnDataId={`aut-id-${row.id}`} copiable />
                ),
                size: 100,
            },
            {
                accessorKey: 'aut_display_name',
                header: displayName.title,
                Header: ({ column }) => <ColumnTitle title={column.columnDef.header} />,
                Cell: ({ cell, row }) => (
                    <ColumnData data={cell.getValue()} columnDataId={`aut-display-name-${row.id}`} />
                ),
                size: 300,
                grow: true,
            },
            {
                accessorKey: 'aut_org_username',
                header: uqUsername.title,
                Header: ({ column }) => <ColumnTitle title={column.columnDef.header} />,
                Cell: ({ cell, row }) => (
                    <ColumnData
                        data={cell.getValue() || row.original.aut_student_username}
                        columnDataId={`${(row._valuesCache.aut_org_username && 'aut-org-username') ||
                            (row.original.aut_student_username && 'aut-student-username') ||
                            'aut-org-username'}-${row.id}`}
                    />
                ),
                size: 300,
                grow: true,
            },
        ],
        [displayName.title, id.title, uqUsername.title],
    );

    const handleSave = table => (mode, newData, oldData) => {
        setBusy();
        if (mode === 'add') {
            onRowAdd(newData)
                .then(data => {
                    setData(prev => [data, ...prev]);
                })
                .catch(() => setData(prev => [...prev]))
                .finally(() => {
                    setBusy(false);
                    table.setCreatingRow(null);
                    resetEditRow();
                });
        } else {
            // update
            onRowUpdate(newData, oldData)
                .then(data => {
                    setData(prev => {
                        const index = prev.findIndex(row => row.aut_id === oldData.aut_id);
                        return [...prev.slice(0, index), data, ...prev.slice(index + 1)];
                    });
                })
                .catch(() => setData(prev => [...prev]))
                .finally(() => {
                    setBusy(false);
                    table.setEditingRow(null);
                    resetEditRow();
                });
        }
    };
    const handleDelete = () => {
        const row = data[pendingDeleteRowIndex];
        setBusy();
        onRowDelete(row)
            .then(() => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        const dataDelete = [...data];
                        dataDelete.splice(pendingDeleteRowIndex, 1);
                        setData(dataDelete);
                        resolve();
                    }, 1000);
                });
            })
            .catch(() => setData(prev => [...prev]))
            .finally(() => {
                setBusy(false);
                resetDeleteRow();
            });
    };

    const handleBulkDelete = () => {
        setBusy();
        const selectedRowIndexes = Object.keys(selectedRows);
        const rowsSelected = data.filter((_, index) => selectedRowIndexes.includes(String(index)));

        onBulkRowDelete(rowsSelected)
            .then(response => {
                const newList = [...data];
                for (const [authorId, message] of Object.entries(response)) {
                    message === BULK_DELETE_AUTHOR_SUCCESS &&
                        newList.splice(
                            newList.findIndex(author => String(author.aut_id) === String(authorId)),
                            1,
                        );
                }
                setData(newList);
                resetSelectedRows();
            })
            .catch(() => setData(prev => [...prev]))
            .finally(() => {
                setBusy(false);
                hideConfirmation();
            });
    };

    const handleShowScopusIngestConfirmation = id => () => {
        scopusIngestAuthor.current = id;
        showScopusIngestConfirmation();
    };

    const handleHideScopusIngestConfirmation = () => hideScopusIngestConfirmation();

    const handleScopusIngest = () => {
        const autId = scopusIngestAuthor.current;
        onScopusIngest(autId)
            .then(() => {
                Cookies.set(`${SCOPUS_INGESTED_AUTHORS}_${autId}`, autId, { expires: 7 });
            })
            .catch(() => {})
            .finally(() => {
                scopusIngestAuthor.current = null;
            });
    };

    const debouncedReadRequest = useMemo(() => {
        return debounce(400, request, { atBegin: false });
    }, [request]);

    const onSearchTermChange = term => {
        setSearchTerm(term);
        debouncedReadRequest({ ...pagination, searchTerm: term });
    };

    const handleSearch = e => {
        onSearchTermChange(e?.target?.value || '');
    };

    const handleCancel = table => () => {
        resetEditRow();
        table.setCreatingRow(null);
        table.setEditingRow(null);
    };

    // DELETE action
    const openDeleteConfirmModal = id => () => {
        setDeleteRow(id);
    };

    const cancelDeleteConfirmModal = () => {
        resetDeleteRow();
    };

    const onCreateRecord = table => () => {
        resetEditRow();
        table.setEditingRow(null);
        table.setCreatingRow(true);
    };

    const table = useMaterialReactTable({
        columns,
        data,
        createDisplayMode: 'modal',
        editDisplayMode: 'modal',
        enableEditing: true,
        enableRowSelection: true,
        enableSelectAll: true,
        enableColumnDragging: false,
        enableColumnResizing: false,
        enableRowDragging: false,
        enableColumnActions: false,
        enableColumnFilterModes: false,
        enableSorting: false,
        enableToolbarInternalActions: false,
        positionActionsColumn: 'last',
        manualPagination: true,
        rowCount: pagination.resultCount,
        autoResetPageIndex: false,
        displayColumnDefOptions: { 'mrt-row-actions': { minSize: 80 } },
        initialState: {
            expanded: true,
            columnPinning: { left: ['mrt-row-select'], right: ['mrt-row-actions'] },
        },
        state: {
            showAlertBanner: false,
            isLoading: authorListLoading,
            showLoadingOverlay:
                authorListLoading || authorListItemUpdating || authorListItemDeleting || authorAdding || isBusy,
            pagination,
            rowSelection: selectedRows,
        },
        muiPaginationProps: {
            rowsPerPageOptions: tablePageSizeOptions,
        },
        muiEditRowDialogProps: {
            scroll: 'paper',
            maxWidth: 'lg',
            fullWidth: true,
            fullScreen: isMobileView,
            onClose: (e, reason) => {
                /* istanbul ignore else */
                if (reason !== 'backdropClick') {
                    handleCancel(table)();
                }
            },
            '& .MuiDialog-paper': {
                margin: { xs: 0, lg: 4 },
            },
        },
        muiTableProps: {
            sx: {
                borderCollapse: 'collapse',
            },
        },
        muiTableHeadCellProps: {
            sx: {
                padding: 1,
            },
        },
        muiTableBodyCellProps: {
            sx: {
                padding: 1,
            },
        },
        muiTableBodyRowProps: ({ row }) => ({
            id: `authors-list-row-${row.index}`,
            'data-testid': `authors-list-row-${row.index}`,
        }),
        muiSelectCheckboxProps: ({ row }) => ({
            id: `select-author-${row.id}`,
            'data-testid': `select-author-${row.id}`,
        }),
        onRowSelectionChange: setSelectedRows,
        onPaginationChange: onPaginationChange,
        renderCreateRowDialogContent: ({ table, row }) => (
            <FullAuthorDetails
                data={row.original}
                mode="add"
                id="authors-list-create-row"
                data-testid="authors-list-create-row"
                onEditingApproved={handleSave(table)}
                onEditingCanceled={handleCancel(table)}
            />
        ),
        renderEditRowDialogContent: ({ table, row }) => (
            <FullAuthorDetails
                data={row.original}
                mode="update"
                id="authors-list-edit-row"
                data-testid="authors-list-edit-row"
                onEditingApproved={handleSave(table)}
                onEditingCanceled={handleCancel(table)}
            />
        ),
        renderTopToolbarCustomActions: ({ table }) => (
            <Box
                sx={theme => ({
                    display: 'flex',
                    backgroundColor: 'inherit',
                    justifyContent: 'space-between',
                    flexGrow: 1,
                    gap: 1,
                    padding: '24px 16px',
                    flexDirection: 'row',
                    [theme.breakpoints.down('md')]: {
                        flexDirection: 'column',
                    },
                })}
            >
                <TextField
                    id={'authors-search-input'}
                    title=""
                    placeholder={searchPlaceholder}
                    variant="standard"
                    inputProps={{
                        inputMode: 'search',
                        'data-testid': 'authors-search-input',
                        'aria-label': searchAriaLabel,
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <tableIcons.Search />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton disabled={!!!searchTerm} onClick={() => handleSearch()}>
                                    <tableIcons.Clear />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    sx={{ width: { md: '300px' } }}
                    value={searchTerm}
                    onChange={handleSearch}
                    disabled={table.getState().creatingRow !== null}
                />
                <Button
                    id={`authors-${(hasSelectedRows ? bulkDeleteButtonTooltip : addButtonTooltip)
                        .toLowerCase()
                        .replace(/ /g, '-')}`}
                    data-testid={`authors-${(hasSelectedRows ? bulkDeleteButtonTooltip : addButtonTooltip)
                        .toLowerCase()
                        .replace(/ /g, '-')}`}
                    disabled={table.getState().creatingRow !== null}
                    variant="contained"
                    color="primary"
                    children={hasSelectedRows ? bulkDeleteButtonTooltip : addButtonTooltip}
                    onClick={hasSelectedRows ? showConfirmation : onCreateRecord(table)}
                />
            </Box>
        ),
        renderRowActions: ({ row }) => {
            const isCookieSet = !!Cookies.get(`${SCOPUS_INGESTED_AUTHORS}_${row.original.aut_id}`);
            return (
                <Box sx={{ display: 'flex', flexWrap: 'nowrap' }}>
                    <Tooltip title={scopusIngestButtonTooltip}>
                        <IconButton
                            onClick={handleShowScopusIngestConfirmation(row.original.aut_id)}
                            disabled={
                                isCookieSet ||
                                !(
                                    !!row.original.aut_orcid_id ||
                                    (!!row.original.aut_scopus_id && row.original.aut_is_scopus_id_authenticated === 1)
                                )
                            }
                            id={`authors-list-row-${row.index}-${scopusIngestButtonTooltip
                                .toLowerCase()
                                .replace(/ /g, '-')}`}
                            data-testid={`authors-list-row-${
                                row.index
                            }-${scopusIngestButtonTooltip.toLowerCase().replace(/ /g, '-')}`}
                        >
                            <tableIcons.Download />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={editButtonTooltip}>
                        <IconButton
                            onClick={() => {
                                setEditRow(row);
                                table.setCreatingRow(null);
                                table.setEditingRow(row);
                            }}
                            disabled={isPendingDelete || !!isBusy || !!editingRow}
                            id={`authors-list-row-${row.index}-${editButtonTooltip.toLowerCase().replace(/ /g, '-')}`}
                            data-testid={`authors-list-row-${row.index}-${editButtonTooltip
                                .toLowerCase()
                                .replace(/ /g, '-')}`}
                        >
                            <tableIcons.Edit />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={deleteButtonTooltip}>
                        <IconButton
                            onClick={openDeleteConfirmModal(row.index)}
                            disabled={isPendingDelete || !!isBusy || !!editingRow}
                            id={`authors-list-row-${row.index}-${deleteButtonTooltip.toLowerCase().replace(/ /g, '-')}`}
                            data-testid={`authors-list-row-${row.index}-${deleteButtonTooltip
                                .toLowerCase()
                                .replace(/ /g, '-')}`}
                        >
                            <tableIcons.Delete />
                        </IconButton>
                    </Tooltip>
                </Box>
            );
        },
    });

    return (
        <Box
            id="authors-list"
            data-testid="authors-list"
            sx={{
                '& >.MuiPaper-root': { boxShadow: 'none' },
            }}
        >
            <ConfirmationBox
                confirmationBoxId={
                    isPendingDelete ? 'authors-delete-this-author-confirmation' : 'bulk-delete-authors-confirmation'
                }
                onAction={isPendingDelete ? handleDelete : handleBulkDelete}
                onClose={cancelDeleteConfirmModal}
                isOpen={isOpen}
                locale={isPendingDelete ? deleteConfirmationLocale : bulkDeleteConfirmationLocale}
            />
            <ConfirmationBox
                confirmationBoxId="scopus-ingest-confirmation"
                onAction={handleScopusIngest}
                onClose={handleHideScopusIngestConfirmation}
                isOpen={isScopusIngestOpen}
                locale={scopusIngestConfirmationLocale}
            />
            <MaterialReactTable table={table} />
        </Box>
    );
};

ManageAuthorsList.propTypes = {
    onBulkRowDelete: PropTypes.func,
    onRowAdd: PropTypes.func,
    onRowUpdate: PropTypes.func,
    onRowDelete: PropTypes.func,
    onSelectionChange: PropTypes.func,
};

export default React.memo(ManageAuthorsList);
