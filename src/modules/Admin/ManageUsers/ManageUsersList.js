/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import MaterialTable, { MTableAction, MTableBodyRow } from '@material-table/core';
import { tableIcons } from './ManageUsersListIcons';

import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import FullUserDetails from './partials/FullUserDetails';

import { default as locale } from 'locale/components';
import { loadUserList } from 'actions';
import { useConfirmationState } from 'hooks';
import { BULK_DELETE_USER_SUCCESS } from 'config/general';
import UserDetailsRow from './partials/UserDetailsRow';
import UserDetailsHeader from './partials/UserDetailsHeader';
import { clearAlerts } from './helpers';

export const getColumns = () => {
    return [
        {
            title: <UserDetailsHeader />,
            field: 'user',
            sorting: false,
            render: rowData => <UserDetailsRow rowData={rowData} />,
        },
    ];
};

export const ManageUsersList = ({ onRowAdd, onRowDelete, onRowUpdate, onBulkRowDelete }) => {
    const dispatch = useDispatch();
    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();

    const materialTableRef = React.createRef();
    const columns = React.createRef();
    columns.current = getColumns();

    const [pageSize, setPageSize] = React.useState(20);

    React.useEffect(() => {
        return () => {
            clearAlerts(dispatch);
        };
    }, [dispatch]);

    const {
        loadingText,
        form: {
            locale: { addButtonTooltip, bulkDeleteButtonTooltip, editButtonTooltip, deleteButtonTooltip },
            bulkDeleteConfirmationLocale,
        },
    } = locale.components.manageUsers;

    const handleSave = (mode, newData, oldData) => {
        const materialTable = materialTableRef.current;

        console.log('handleSave', mode, newData, oldData);

        // materialTable.setState(prevState => {
        if (mode === 'add') {
            materialTable.props.editable
                .onRowAdd(newData)
                .then(data => {
                    materialTable.setState(prevState => {
                        const prev = [...prevState.data];
                        prev.forEach(item => delete item.tableData);
                        materialTable.dataManager.setData([data, ...prev]);
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
                .catch(() => {
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
                });
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
                        for (const [userId, message] of Object.entries(response)) {
                            message === BULK_DELETE_USER_SUCCESS &&
                                newList.splice(
                                    newList.findIndex(user => String(user.usr_id) === String(userId)),
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

    return (
        <React.Fragment>
            <ConfirmationBox
                confirmationBoxId="bulk-delete-users-confirmation"
                onAction={handleBulkDelete}
                onClose={hideConfirmation}
                isOpen={isOpen}
                locale={bulkDeleteConfirmationLocale}
            />
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
        </React.Fragment>
    );
};

ManageUsersList.propTypes = {
    onBulkRowDelete: PropTypes.func,
    onRowAdd: PropTypes.func,
    onRowUpdate: PropTypes.func,
    onRowDelete: PropTypes.func,
};

export default React.memo(ManageUsersList);
