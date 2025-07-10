/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { upperFirst } from 'lodash';

// eslint-disable-next-line camelcase
import { MaterialReactTable, useMaterialReactTable, MRT_EditActionButtons } from 'material-react-table';

import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { DialogActions, DialogContent, DialogTitle } from '@mui/material';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';

import { tableIcons } from './ManageUsersListIcons';
import FullUserDetails from './partials/FullUserDetails';

import ColumnTitle from './partials/ColumnTitle';
import ColumnData from './partials/ColumnData';
import { default as locale } from 'locale/components';
import { loadUserList } from 'actions';
import { BULK_DELETE_USER_SUCCESS } from 'config/general';
import UserDetailsRow from './partials/UserDetailsRow';
import UserDetailsHeader from './partials/UserDetailsHeader';
import { clearAlerts } from './helpers';

import { useMrtTable } from 'hooks';

const MUI_SAVE_BUTTON_CLASS = '.MuiIconButton-colorInfo';
const TABLE_PAGE_SIZE_OPTIONS = [10, 20, 40];
const TABLE_PAGE_SIZE_DEFAULT = 20;

const useServerData = ({ actions, pageSize = TABLE_PAGE_SIZE_DEFAULT, pageIndex = 0 }) => {
    const [state, setState] = useState({
        data: [],
        pageIndex,
        pageSize,
        search: '',
        resultCount: 0,
    });
    const dispatch = useDispatch();
    const {
        userListLoading,
        userListLoadingError,
        userListItemUpdating,
        userListItemUpdateSuccess,
        userListItemUpdateError,
        userListItemDeleting,
        userListItemDeleteSuccess,
        userListItemDeleteError,
        userAdding,
        userAddSuccess,
        userAddError,
        bulkUserDeleteMessages,
    } = useSelector(state => state?.get('manageUsersReducer'));

    const read = useCallback(
        payload => {
            console.log('request', payload);
            dispatch(actions.read({ page: payload.pageIndex, pageSize: payload.pageSize, search: payload.search }))
                .then(response => {
                    console.log(response);
                    setState(prev => ({
                        ...prev,
                        data: response.data,
                        pageIndex: response.page,
                        pageSize: response.size,
                        resultCount: response.totalCount ?? (response.data?.length + 1 || 0),
                    }));
                })
                .catch(e => {
                    console.error(e);
                });
        },
        [actions, dispatch],
    );

    const onPaginationChange = updater => {
        // Updater can be a function or a value
        const newPagination =
            typeof updater === 'function' ? updater({ pageIndex: state.pageIndex, pageSize: state.pageSize }) : updater;
        read(newPagination);
    };

    const onSetPageSize = size => {
        read({ ...state, pageSize: size });
    };

    useEffect(() => {
        read(state);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [read]);

    return {
        onPaginationChange,
        onSetPageSize,
        userListLoading,
        userListLoadingError,
        userListItemUpdating,
        userListItemUpdateSuccess,
        userListItemUpdateError,
        userListItemDeleting,
        userListItemDeleteSuccess,
        userListItemDeleteError,
        userAdding,
        userAddSuccess,
        userAddError,
        bulkUserDeleteMessages,
        ...state,
    };
};
useServerData.propTypes = {
    actions: PropTypes.shape({
        read: PropTypes.func.isRequired,
        update: PropTypes.func,
        delete: PropTypes.func,
    }).isRequired,
    pageSize: PropTypes.number,
    pageIndex: PropTypes.number,
};

export const ManageUsersList = ({ onRowAdd, onRowDelete, onRowUpdate, onBulkRowDelete }) => {
    const disabled = false;
    const dispatch = useDispatch();

    React.useEffect(() => {
        return () => {
            clearAlerts(dispatch);
        };
    }, [dispatch]);

    const {
        loadingText,
        header: {
            columns: { id, fullName, username, email, status, isAdmin, isSuperAdmin },
        },
        form: {
            locale: { addButtonTooltip, bulkDeleteButtonTooltip, editButtonTooltip, deleteButtonTooltip },
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
        pageIndex,
        pageSize,
        resultCount,
        data: list,
        onPaginationChange,
    } = useServerData({ actions });

    const {
        data,
        isBusy,
        pendingDeleteRowId,
        isOpen,
        editingRow,
        validationErrors,
        setData,
        setBusy,
        setDeleteRow,
        resetDeleteRow,
        setEditRow,
        resetEditRow,
        validate,
        getValidationError,
        handleValidation,
        clearValidationErrors,
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
        // materialTable.setState(prevState => {
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
                    table.setCreatingRow(null);
                    resetEditRow();
                });
        }
        // else {
        //     const index = oldData.tableData.id;
        //     materialTable.props.editable
        //         .onRowDelete(oldData)
        //         .then(() => {
        //             materialTable.setState(prevState => {
        //                 materialTable.dataManager.setData([
        //                     ...prevState.data.slice(0, index),
        //                     ...prevState.data.slice(index + 1),
        //                 ]);
        //                 return {
        //                     ...materialTable.dataManager.getRenderState(),
        //                     showAddRow: false,
        //                 };
        //             });
        //         })
        //         .catch(() => {
        //             materialTable.setState(prevState => {
        //                 materialTable.dataManager.setData([...prevState.data]);
        //                 return {
        //                     ...materialTable.dataManager.getRenderState(),
        //                     showAddRow: false,
        //                 };
        //             });
        //         });
        // }
    };

    // const handleBulkDelete = () => {
    //     const rowsSelected = materialTable.dataManager.data.filter(row => !!row.tableData.checked);
    //     onBulkRowDelete(rowsSelected)
    //         .then(response => {
    //             materialTable.setState(
    //                 prevState => {
    //                     const newList = [...prevState.data];
    //                     for (const [userId, message] of Object.entries(response)) {
    //                         message === BULK_DELETE_USER_SUCCESS &&
    //                             newList.splice(
    //                                 newList.findIndex(user => String(user.usr_id) === String(userId)),
    //                                 1,
    //                             );
    //                     }
    //                     materialTable.dataManager.changeAllSelected(false);
    //                     materialTable.dataManager.setData(newList);
    //                     return {
    //                         ...materialTable.dataManager.getRenderState(),
    //                     };
    //                 },
    //                 () => materialTable.onSelectionChange(),
    //             );
    //         })
    //         .catch(() => {
    //             materialTable.setState(prevState => {
    //                 materialTable.dataManager.changeAllSelected(false);
    //                 materialTable.dataManager.setData([...prevState.data]);
    //                 return {
    //                     ...materialTable.dataManager.getRenderState(),
    //                 };
    //             });
    //         });
    // };

    const handleCancel = table => () => {
        console.log('cancel', editingRow);
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

    const table = useMaterialReactTable({
        getRowId: row => row.eap_id,
        columns,
        data,
        createDisplayMode: 'modal',
        editDisplayMode: 'modal',
        enableEditing: true,
        enableColumnDragging: false,
        enableColumnResizing: false,
        enableRowDragging: false,
        enableRowSelection: true,
        enableColumnActions: false,
        enableColumnFilterModes: false,
        enableSorting: false,
        enableToolbarInternalActions: false,
        enableSelectAll: true,
        positionActionsColumn: 'last',
        manualPagination: true,
        rowCount: resultCount,
        autoResetPageIndex: false,
        displayColumnDefOptions: { 'mrt-row-actions': { minSize: 80 } },
        initialState: {
            expanded: true,
            columnPinning: { left: ['mrt-row-select'], right: ['mrt-row-actions'] },
        },
        state: {
            showAlertBanner: false,
            isLoading: userListLoading || userListItemUpdating || userListItemDeleting || userAdding || isBusy,
            showLoadingOverlay: userListLoading || userListItemUpdating || userListItemDeleting || userAdding || isBusy,
            pagination: { pageSize, pageIndex },
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
            rowsPerPageOptions: TABLE_PAGE_SIZE_OPTIONS,
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
            <Button
                id={`users-${addButtonTooltip.toLowerCase().replace(/ /g, '-')}`}
                data-testid={`users-${addButtonTooltip.toLowerCase().replace(/ /g, '-')}`}
                disabled={disabled}
                variant="contained"
                color="primary"
                children={addButtonTooltip}
                onClick={() => {
                    resetEditRow();
                    table.setEditingRow(null);
                    table.setCreatingRow(true);
                    // immediately force validation of new row
                    handleValidation({ id: 'mrt-row-create' }, columns[0].accessorKey, '');
                }}
                sx={{ marginLeft: 'auto' }}
            />
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
                            disabled={!!pendingDeleteRowId || !!isBusy || !!editingRow}
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
                            onClick={openDeleteConfirmModal(row.id)}
                            disabled={!!pendingDeleteRowId || !!isBusy || !!editingRow}
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
                confirmationBoxId="bulk-delete-users-confirmation"
                onAction={() => {}}
                onClose={cancelDeleteConfirmModal}
                isOpen={isOpen}
                locale={bulkDeleteConfirmationLocale}
            />

            <MaterialReactTable table={table} />
            {/*
            <MaterialTable
                tableRef={materialTableRef}
                columns={columns.current}
                components={{
                    Container: props => <div {...props} id="users-list" data-testid="users-list" />,
                    OverlayLoading: props => (
                        <Backdrop
                            {...props}
                            open
                            sx={{ position: 'absolute', zIndex: 9999, color: 'rgba(0, 0, 0, 0.2)' }}
                        >
                            <StandardCard noHeader standardCardId="loading-users">
                                <InlineLoader message={loadingText} />
                            </StandardCard>
                        </Backdrop>
                    ),
                    Row: props => (
                        <MTableBodyRow
                            {...props}
                            {...(props.hasAnyEditingRow
                                ? {
                                      onRowClick: null,
                                      hover: false,
                                  }
                                : { hover: true })}
                            hover
                            id={`users-list-row-${props.index}`}
                            data-testid={`users-list-row-${props.index}`}
                        />
                    ),
                    EditRow: props => {
                        return (
                            <FullUserDetails
                                {...props}
                                initialValues={props.data}
                                id="users-list-edit-row"
                                data-testid="users-list-edit-row"
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
                                                id={`users-list-row-${
                                                    props.data.tableData.id
                                                }-${tooltip.toLowerCase().replace(/ /g, '-')}`}
                                                data-testid={`users-list-row-${
                                                    props.data.tableData.id
                                                }-${tooltip.toLowerCase().replace(/ /g, '-')}`}
                                                {...restAction.iconProps}
                                            />
                                        ),
                                    }}
                                    size="small"
                                />
                            );
                        } else {
                            //  Add action
                            const { tooltip } = props.action;
                            return (
                                <Button
                                    id={`users-${tooltip.toLowerCase().replace(/ /g, '-')}`}
                                    data-analyticsid={`users-${tooltip.toLowerCase().replace(/ /g, '-')}`}
                                    data-testid={`users-${tooltip.toLowerCase().replace(/ /g, '-')}`}
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
                    return dispatch(loadUserList(query));
                }}
                onRowClick={(event, rowData) => {
                    materialTableRef.current.dataManager.changeRowEditing(rowData, 'update');
                    materialTableRef.current.setState({
                        ...materialTableRef.current.dataManager.getRenderState(),
                        showAddRow: false,
                    });
                }}
                onRowsPerPageChange={pageSize => {
                    return setPageSize(pageSize);
                }}
                icons={tableIcons}
                title=""
                localization={{
                    body: {
                        addTooltip: addButtonTooltip,
                        editTooltip: editButtonTooltip,
                        deleteTooltip: deleteButtonTooltip,
                    },
                    toolbar: {
                        searchAriaLabel: 'Search users',
                        searchPlaceholder: 'Search users',
                    },
                }}
                editable={{
                    onRowUpdateCancelled: () => {},
                    onRowAdd: newData => onRowAdd(newData),
                    onRowUpdate: (newData, oldData) => onRowUpdate(newData, oldData),
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
                    sorting: false,
                    showSelectAllCheckbox: false,
                    selectionProps: rowData => ({
                        inputProps: {
                            id: `select-user-${rowData.tableData.id}`,
                            'data-testid': `select-user-${rowData.tableData.id}`,
                        },
                    }),
                }}
                actions={[
                    {
                        icon: 'delete',
                        tooltip: bulkDeleteButtonTooltip,
                        onClick: showConfirmation,
                    },
                ]}
            />
            */}
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
