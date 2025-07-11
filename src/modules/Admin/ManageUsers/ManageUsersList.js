/* eslint-disable react/prop-types */
import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { upperFirst } from 'lodash';

// eslint-disable-next-line camelcase
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

import { debounce } from 'throttle-debounce';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';

import { tableIcons } from './ManageUsersListIcons';
import FullUserDetails from './partials/FullUserDetails';

import ColumnTitle from './partials/ColumnTitle';
import ColumnData from './partials/ColumnData';
import { default as locale } from 'locale/components';
import { loadUserList } from 'actions';
import { BULK_DELETE_USER_SUCCESS } from 'config/general';
import { clearAlerts } from './helpers';

import { useMrtTable, useServerData } from 'hooks';

export const ManageUsersList = ({ onRowAdd, onRowDelete, onRowUpdate, onBulkRowDelete }) => {
    const disabled = false;
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');

    React.useEffect(() => {
        return () => {
            clearAlerts(dispatch);
        };
    }, [dispatch]);

    const {
        tablePageSizeOptions,
        tablePageSizeDefault,
        header: {
            columns: { id, fullName, username, email, status, isAdmin, isSuperAdmin },
        },
        form: {
            locale: { addButtonTooltip, bulkDeleteButtonTooltip, editButtonTooltip, deleteButtonTooltip },
            deleteConfirmationLocale,
            bulkDeleteConfirmationLocale,
        },
    } = locale.components.manageUsers;

    const actions = useMemo(
        () => ({
            read: loadUserList,
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

    const columns = React.useMemo(
        () => [
            {
                accessorKey: 'usr_id',
                header: id.title,
                Header: ({ column }) => <ColumnTitle title={column.columnDef.header} />,
                Cell: ({ cell, row }) => <ColumnData data={cell.getValue()} columnDataId={`usr-id-${row.id}`} />,
                size: 100,
            },
            {
                accessorKey: 'usr_full_name',
                header: fullName.title,
                Header: ({ column }) => <ColumnTitle title={column.columnDef.header} />,
                Cell: ({ cell, row }) => (
                    <ColumnData data={cell.getValue()} columnDataId={`usr-full-name-${row.id}`} copiable />
                ),
                size: 300,
                grow: true,
            },
            {
                accessorKey: 'usr_username',
                header: username.title,
                Header: ({ column }) => <ColumnTitle title={column.columnDef.header} />,
                Cell: ({ cell, row }) => (
                    <React.Fragment>
                        <ColumnData data={cell.getValue()} columnDataId={`usr-username-${row.id}`} copiable />
                        <Tooltip title="Last login date">
                            <Typography
                                variant="caption"
                                id={`usr-last-login-date-${row.id}`}
                                data-testid={`usr-last-login-date-${row.id}`}
                            >
                                {!!row.original.usr_last_login_date &&
                                moment(row.original.usr_created_date).format('YYYY-MM-DD HH:mm') !==
                                    moment(row.original.usr_last_login_date).format('YYYY-MM-DD HH:mm')
                                    ? moment(row.original.usr_last_login_date).format('YYYY-MM-DD HH:mm:ss')
                                    : 'Never'}
                            </Typography>
                        </Tooltip>
                    </React.Fragment>
                ),
                size: 200,
            },
            {
                accessorKey: 'usr_email',
                header: email.title,
                Header: ({ column }) => <ColumnTitle title={column.columnDef.header} />,
                Cell: ({ cell, row }) => <ColumnData data={cell.getValue()} columnDataId={`usr-email-${row.id}`} />,
                grow: true,
                size: 300,
            },
            {
                accessorKey: 'usr_status',
                header: status.title,
                Header: ({ column }) => <ColumnTitle title={column.columnDef.header} />,
                Cell: ({ cell, row }) => (
                    <ColumnData data={upperFirst(cell.getValue())} columnDataId={`usr-status-${row.id}`} />
                ),
                size: 50,
            },
            {
                accessorKey: 'usr_administrator',
                header: isAdmin.title,
                Header: ({ column }) => <ColumnTitle title={column.columnDef.header} />,
                Cell: ({ cell, row }) => (
                    <ColumnData data={!!cell.getValue() ? 'Yes' : 'No'} columnDataId={`usr-administrator-${row.id}`} />
                ),
                size: 50,
            },
            {
                accessorKey: 'usr_super_administrator',
                header: isSuperAdmin.title,
                Header: ({ column }) => <ColumnTitle title={column.columnDef.header} />,
                Cell: ({ cell, row }) => (
                    <ColumnData
                        data={!!cell.getValue() ? 'Yes' : 'No'}
                        columnDataId={`usr-super-administrator-${row.id}`}
                    />
                ),
                size: 50,
            },
        ],
        [email.title, fullName.title, id.title, isAdmin.title, isSuperAdmin.title, status.title, username.title],
    );

    const handleSave = table => (mode, newData, oldData) => {
        setBusy();
        if (mode === 'add') {
            onRowAdd(newData)
                .then(data => {
                    setData(prev => [...prev, data]);
                })
                .catch(() => setData(prev => [...prev]))
                .finally(() => {
                    setBusy(false);
                    table.setCreatingRow(null);
                    resetEditRow();
                });
        } else if (mode === 'update') {
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
                    message === BULK_DELETE_USER_SUCCESS &&
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
        getRowId: row => row.eap_id,
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
        icons: {
            SaveIcon: props => (
                <tableIcons.Check
                    id={`users-list-row-${!!editingRow ? 'edit' : 'add'}-save`}
                    data-testid={`users-list-row-${!!editingRow ? 'edit' : 'add'}-save`}
                    color="secondary"
                    {...props}
                />
            ),
            CancelIcon: props => (
                <tableIcons.Clear
                    id={`users-list-row-${!!editingRow ? 'edit' : 'add'}-cancel`}
                    data-testid={`users-list-row-${!!editingRow ? 'edit' : 'add'}-cancel`}
                    color="secondary"
                    {...props}
                />
            ),
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
        onRowSelectionChange: setSelectedRows,
        onPaginationChange: onPaginationChange,
        renderCreateRowDialogContent: ({ table, row }) => (
            <FullUserDetails
                data={row.original}
                mode="add"
                id="users-list-edit-row"
                data-testid="users-list-edit-row"
                onEditingApproved={handleSave(table)}
                onEditingCanceled={handleCancel(table)}
            />
        ),
        renderEditRowDialogContent: ({ table, row }) => (
            <FullUserDetails
                data={row.original}
                mode="update"
                id="users-list-edit-row"
                data-testid="users-list-edit-row"
                onEditingApproved={handleSave(table)}
                onEditingCanceled={handleCancel(table)}
            />
        ),
        renderTopToolbarCustomActions: ({ table }) => (
            <Box
                sx={{
                    display: 'flex',
                    backgroundColor: 'inherit',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flexGrow: 1,
                    gap: 1,
                    padding: '24px 16px',
                    '@media max-width: 768px': {
                        flexDirection: 'column',
                    },
                }}
            >
                <TextField
                    title=""
                    placeholder="Search users"
                    variant="standard"
                    inputProps={{ inputMode: 'search' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton disabled={!!!searchTerm} onClick={() => handleSearch()}>
                                    <ClearIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    sx={{ width: '300px' }}
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <Button
                    id={`users-${(hasSelectedRows ? bulkDeleteButtonTooltip : addButtonTooltip)
                        .toLowerCase()
                        .replace(/ /g, '-')}`}
                    data-testid={`users-${(hasSelectedRows ? bulkDeleteButtonTooltip : addButtonTooltip)
                        .toLowerCase()
                        .replace(/ /g, '-')}`}
                    disabled={disabled}
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
                            id={`users-list-row-list-row-${row.index}-${editButtonTooltip
                                .toLowerCase()
                                .replace(/ /g, '-')}`}
                            data-testid={`users-list-row-list-row-${
                                row.index
                            }-${editButtonTooltip.toLowerCase().replace(/ /g, '-')}`}
                        >
                            <tableIcons.Edit />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={deleteButtonTooltip}>
                        <IconButton
                            onClick={openDeleteConfirmModal(row.index)}
                            disabled={isPendingDelete || !!isBusy || !!editingRow}
                            id={`users-list-row-list-row-${row.index}-${deleteButtonTooltip
                                .toLowerCase()
                                .replace(/ /g, '-')}`}
                            data-testid={`users-list-row-list-row-${
                                row.index
                            }-${deleteButtonTooltip.toLowerCase().replace(/ /g, '-')}`}
                        >
                            <tableIcons.Delete />
                        </IconButton>
                    </Tooltip>
                </Box>
            );
        },
        muiTableBodyRowProps: ({ row }) => ({
            id: `users-list-row-list-row-${row.index === -1 ? 'add' : row.index}`,
            'data-testid': `users-list-row-list-row-${row.index === -1 ? 'add' : row.index}`,
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
            <MaterialReactTable table={table} />
        </Box>
    );
};

ManageUsersList.propTypes = {
    onBulkRowDelete: PropTypes.func,
    onRowAdd: PropTypes.func,
    onRowUpdate: PropTypes.func,
    onRowDelete: PropTypes.func,
};

export default React.memo(ManageUsersList);
