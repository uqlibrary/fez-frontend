/* eslint-disable react/prop-types */
import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';

// eslint-disable-next-line camelcase
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

import { debounce } from 'throttle-debounce';

import { tableIcons } from './ManageAuthorsListIcons';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

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
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [isScopusIngestOpen, showScopusIngestConfirmation, hideScopusIngestConfirmation] = useConfirmationState();

    const materialTableRef = React.createRef();
    const scopusIngestAuthor = React.useRef();

    const [pageSize, setPageSize] = React.useState(20);

    const {
        loadingText,
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

    const {
        userListLoading,
        userListItemUpdating,
        userListItemDeleting,
        userAdding,
        data: list,
        pagination,
        request,
        onPaginationChange,
    } = useServerData({ actions, pageSize: tablePageSizeDefault });

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
                        data={cell.getValue()}
                        columnDataId={`${(row._valuesCache.aut_org_username && 'aut-org-username') ||
                            (row._valuesCache.aut_student_username && 'aut-student-username') ||
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
                        const index = prev.findIndex(row => row.usr_id === oldData.usr_id);
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
                for (const [userId, message] of Object.entries(response)) {
                    message === BULK_DELETE_AUTHOR_SUCCESS &&
                        newList.splice(
                            newList.findIndex(user => String(user.usr_id) === String(userId)),
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
    /*
    const handleSave = (mode, newData, oldData) => {
        const materialTable = materialTableRef.current;

        if (mode === 'add') {
            materialTable.props.editable
                .onRowAdd(newData)
                .then(data => {
                    materialTable.setState(prevState => {
                        materialTable.dataManager.setData([data, ...prevState.data]);
                        return {
                            ...materialTable.dataManager.getRenderState(),
                            showAddRow: false,
                        };
                    });
                })
                .catch(() => {
                    materialTable.setState(prevState => {
                        materialTable.dataManager.setData([...prevState.data]);
                        return {
                            ...materialTable.dataManager.getRenderState(),
                            showAddRow: false,
                        };
                    });
                });
        } else if (mode === 'update') {
            const index = oldData.tableData.id;
            materialTable.props.editable
                .onRowUpdate(newData, oldData)
                .then(data => {
                    materialTable.setState(prevState => {
                        materialTable.dataManager.changeRowEditing(oldData);
                        materialTable.dataManager.setData([
                            ...prevState.data.slice(0, index),
                            data,
                            ...prevState.data.slice(index + 1),
                        ]);
                        return {
                            ...materialTable.dataManager.getRenderState(),
                            showAddRow: false,
                        };
                    });
                })
                .catch(
                     istanbul ignore next  () => {
                        materialTable.setState(prevState => {
                            materialTable.dataManager.changeRowEditing(oldData);
                            materialTable.dataManager.setData([
                                ...prevState.data.slice(0, index),
                                oldData,
                                ...prevState.data.slice(index + 1),
                            ]);
                            return {
                                ...materialTable.dataManager.getRenderState(),
                                showAddRow: false,
                            };
                        });
                    },
                );
        } else {
            const index = oldData.tableData.id;
            materialTable.props.editable
                .onRowDelete(oldData)
                .then(() => {
                    materialTable.setState(prevState => {
                        materialTable.dataManager.setData([
                            ...prevState.data.slice(0, index),
                            ...prevState.data.slice(index + 1),
                        ]);
                        return {
                            ...materialTable.dataManager.getRenderState(),
                            showAddRow: false,
                        };
                    });
                })
                .catch(() => {
                    materialTable.setState(prevState => {
                        materialTable.dataManager.setData([...prevState.data]);
                        return {
                            ...materialTable.dataManager.getRenderState(),
                            showAddRow: false,
                        };
                    });
                });
        }
    };

    const handleBulkDelete = () => {
        const materialTable = materialTableRef.current;
        const rowsSelected = materialTable.dataManager.data.filter(row => !!row.tableData.checked);
        onBulkRowDelete(rowsSelected)
            .then(response => {
                materialTable.setState(
                    prevState => {
                        const newList = [...prevState.data];
                        for (const [authorId, message] of Object.entries(response)) {
                            message === BULK_DELETE_AUTHOR_SUCCESS &&
                                newList.splice(
                                    newList.findIndex(author => String(author.aut_id) === String(authorId)),
                                    1,
                                );
                        }
                        materialTable.dataManager.changeAllSelected(false);
                        materialTable.dataManager.setData(newList);
                        return {
                            ...materialTable.dataManager.getRenderState(),
                        };
                    },
                    () => materialTable.onSelectionChange(),
                );
            })
            .catch(() => {
                materialTable.setState(prevState => {
                    materialTable.dataManager.changeAllSelected(false);
                    materialTable.dataManager.setData([...prevState.data]);
                    return {
                        ...materialTable.dataManager.getRenderState(),
                    };
                });
            });
    };
*/
    const handleShowScopusIngestConfirmation = data => {
        scopusIngestAuthor.current = data.aut_id;
        showScopusIngestConfirmation();
    };

    const handleHideScopusIngestConfirmation = () => hideScopusIngestConfirmation();

    const handleScopusIngest = () => {
        const materialTable = materialTableRef.current;
        const autId = scopusIngestAuthor.current;
        onScopusIngest(autId)
            .then(() => {
                Cookies.set(`${SCOPUS_INGESTED_AUTHORS}_${autId}`, autId, { expires: 7 });
                materialTable.setState(() => ({
                    ...materialTable.dataManager.getRenderState(),
                }));
            })
            .catch(() => {
                materialTable.setState(() => ({
                    ...materialTable.dataManager.getRenderState(),
                }));
            });
        scopusIngestAuthor.current = null;
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
    /*
            <MaterialTable
                tableRef={materialTableRef}
                columns={columns.current}
                components={{
                    Container: props => <div {...props} id="authors-list" data-testid="authors-list" />,
                    OverlayLoading: props => (
                        <Backdrop
                            {...props}
                            open
                            sx={{ position: 'absolute', zIndex: 9999, color: 'rgba(0, 0, 0, 0.2)' }}
                        >
                            <StandardCard noHeader standardCardId="loading-authors">
                                <InlineLoader message={loadingText} />
                            </StandardCard>
                        </Backdrop>
                    ),
                    Row: props => (
                        <MTableBodyRow
                            {...props}
                            {...(props.hasAnyEditingRow ? { onRowClick: null, hover: false } : { hover: true })}
                            id={`authors-list-row-${props.index}`}
                            data-testid={`authors-list-row-${props.index}`}
                        />
                    ),
                    EditRow: props => {
                        return (
                            <FullAuthorDetails
                                {...props}
                                initialValues={props.data}
                                id="authors-list-edit-row"
                                data-testid="authors-list-edit-row"
                                onEditingApproved={handleSave}
                            />
                        );
                    },
                    Action: props => {
                        if (typeof props.action === 'function') {
                            const { icon: Icon, tooltip, ...restAction } = props.action(props.data);
                            return (
                                <MTableAction
                                    {...props}
                                    action={{
                                        ...restAction,
                                        tooltip,
                                        icon: () => (
                                            <Icon
                                                disabled={props.disabled}
                                                id={`authors-list-row-${
                                                    props.data.tableData.id
                                                }-${tooltip.toLowerCase().replace(/ /g, '-')}`}
                                                data-testid={`authors-list-row-${
                                                    props.data.tableData.id
                                                }-${tooltip.toLowerCase().replace(/ /g, '-')}`}
                                                {...restAction.iconProps}
                                            />
                                        ),
                                    }}
                                    size="small"
                                />
                            );
                        } else if (props.action.isScopusIngest) {
                            const { icon: Icon, tooltip, ...restAction } = props.action;
                            const isCookieSet = !!Cookies.get(`${SCOPUS_INGESTED_AUTHORS}_${props.data.aut_id}`);

                            return (
                                <MTableAction
                                    {...props}
                                    action={{
                                        ...restAction,
                                        tooltip,
                                        disabled:
                                            isCookieSet ||
                                            !(
                                                !!props.data.aut_orcid_id ||
                                                (!!props.data.aut_scopus_id &&
                                                    props.data.aut_is_scopus_id_authenticated === 1)
                                            ),
                                        icon: () => (
                                            <Icon
                                                id={`authors-list-row-${
                                                    props.data.tableData.id
                                                }-${tooltip.toLowerCase().replace(/ /g, '-')}`}
                                                data-testid={`authors-list-row-${
                                                    props.data.tableData.id
                                                }-${tooltip.toLowerCase().replace(/ /g, '-')}`}
                                                {...restAction.iconProps}
                                            />
                                        ),
                                        onClick: () => props.action.onClick(props.data),
                                    }}
                                    size="small"
                                />
                            );
                        } else {
                            //  Add action
                            const { tooltip } = props.action;
                            return (
                                <Button
                                    id={`authors-${tooltip.toLowerCase().replace(/ /g, '-')}`}
                                    data-analyticsid={`authors-${tooltip.toLowerCase().replace(/ /g, '-')}`}
                                    data-testid={`authors-${tooltip.toLowerCase().replace(/ /g, '-')}`}
                                    disabled={props.disabled}
                                    variant="contained"
                                    color="primary"
                                    children={tooltip}
                                    onClick={event => props.action.onClick(event, props.data)}
                                />
                            );
                        }
                    },
                }}
                data={query => {
                    materialTableRef.current.dataManager.changeRowEditing();
                    materialTableRef.current.setState({
                        ...materialTableRef.current.dataManager.getRenderState(),
                        showAddRow: false,
                    });
                    return dispatch(loadAuthorList(query));
                }}
                onRowClick={(event, rowData) => {
                    materialTableRef.current.dataManager.changeRowEditing(rowData, 'update');
                    materialTableRef.current.setState({
                        ...materialTableRef.current.dataManager.getRenderState(),
                        showAddRow: false,
                    });
                }}
                onRowsPerPageChange={pageSize => setPageSize(pageSize)}
                icons={tableIcons}
                title=""
                localization={{
                    body: {
                        addTooltip: addButtonTooltip,
                        editTooltip: editButtonTooltip,
                        deleteTooltip: deleteButtonTooltip,
                    },
                    toolbar: {
                        searchAriaLabel: searchAriaLabel,
                        searchPlaceholder: searchPlaceholder,
                    },
                }}
                editable={{
                    onRowAdd: newData => onRowAdd(newData),
                    onRowUpdate: newData => onRowUpdate(newData),
                    onRowDelete: oldData => onRowDelete(oldData),
                }}
                options={{
                    actionsColumnIndex: -1,
                    addRowPosition: 'first',
                    debounceInterval: 400,
                    grouping: false,
                    draggable: false,
                    emptyRowsWhenPaging: true,
                    pageSize: pageSize,
                    pageSizeOptions: [20, 50, 100],
                    padding: 'dense',
                    overflowY: 'auto',
                    searchFieldAlignment: 'left',
                    selection: true,
                    showSelectAllCheckbox: false,
                    selectionProps: rowData => ({
                        inputProps: {
                            id: `select-author-${rowData.tableData.id}`,
                            'data-testid': `select-author-${rowData.tableData.id}`,
                        },
                    }),
                }}
                actions={[
                    {
                        icon: 'delete',
                        tooltip: bulkDeleteButtonTooltip,
                        onClick: showConfirmation,
                        isFreeAction: false,
                    },
                    {
                        icon: tableIcons.Download,
                        isScopusIngest: true,
                        position: 'row',
                        onClick: handleShowScopusIngestConfirmation,
                        tooltip: scopusIngestButtonTooltip,
                    },
                ]}
            />*/
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
            isLoading: userListLoading,
            showLoadingOverlay: userListLoading || userListItemUpdating || userListItemDeleting || userAdding || isBusy,
            pagination,
            rowSelection: selectedRows,
        },
        muiPaginationProps: {
            rowsPerPageOptions: tablePageSizeOptions,
        },
        muiEditRowDialogProps: {
            sx: {
                '& .MuiDialog-paper': {
                    maxWidth: { xs: '100%', lg: '60vw' },
                    margin: { xs: 0, lg: 4 },
                    width: '100%',
                    display: 'table',
                },
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
        muiSelectCheckboxProps: ({ row }) => ({
            id: `select-user-${row.id}`,
            'data-testid': `select-user-${row.id}`,
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
                    id={'users-search-input'}
                    title=""
                    placeholder="Search users"
                    variant="standard"
                    inputProps={{ inputMode: 'search', 'data-testid': 'users-search-input' }}
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
                    id={`users-${(hasSelectedRows ? bulkDeleteButtonTooltip : addButtonTooltip)
                        .toLowerCase()
                        .replace(/ /g, '-')}`}
                    data-testid={`users-${(hasSelectedRows ? bulkDeleteButtonTooltip : addButtonTooltip)
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
            return (
                <Box sx={{ display: 'flex', flexWrap: 'nowrap' }}>
                    <Tooltip title={editButtonTooltip}>
                        <IconButton
                            onClick={() => {
                                setEditRow(row);
                                table.setCreatingRow(null);
                                table.setEditingRow(row);
                            }}
                            disabled={isPendingDelete || !!isBusy || !!editingRow}
                            id={`users-list-row-${row.index}-${editButtonTooltip.toLowerCase().replace(/ /g, '-')}`}
                            data-testid={`users-list-row-${row.index}-${editButtonTooltip
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
                            id={`users-list-row-${row.index}-${deleteButtonTooltip.toLowerCase().replace(/ /g, '-')}`}
                            data-testid={`users-list-row-${row.index}-${deleteButtonTooltip
                                .toLowerCase()
                                .replace(/ /g, '-')}`}
                        >
                            <tableIcons.Delete />
                        </IconButton>
                    </Tooltip>
                </Box>
            );
        },
        muiTableBodyRowProps: ({ row }) => ({
            id: `users-list-row-${row.index}`,
            'data-testid': `users-list-row-${row.index}`,
        }),
    });

    return (
        <Box
            id="users-list"
            data-testid="users-list"
            sx={{
                '& >.MuiPaper-root': { boxShadow: 'none' },
            }}
        >
            <ConfirmationBox
                confirmationBoxId={
                    isPendingDelete ? 'users-delete-this-user-confirmation' : 'bulk-delete-users-confirmation'
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
