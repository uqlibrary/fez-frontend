/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { upperFirst } from 'lodash';
import MaterialTable, { MTableAction, MTableBodyRow } from 'material-table';

import Button from '@material-ui/core/Button';
import { tableIcons } from './ManageUsersListIcons';

import ColumnTitle from './partials/ColumnTitle';
import ColumnData from './partials/ColumnData';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import FullUserDetails from './partials/FullUserDetails';

import { default as locale } from 'locale/components';
import { loadUserList } from 'actions';
import Backdrop from '@material-ui/core/Backdrop';

import makeStyles from '@material-ui/styles/makeStyles';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

export const useStyles = makeStyles(() => ({
    backdrop: {
        position: 'absolute',
        zIndex: 9999,
        color: 'rgba(0, 0, 0, 0.2)',
    },
}));

export const getColumns = () => {
    const {
        header: {
            columns: { id, fullName, username, email, status, isAdmin, isSuperAdmin },
        },
        editRow: {
            validation: { usernameError, emailError, fullNameError },
        },
    } = locale.components.manageUsers;

    return [
        {
            title: <ColumnTitle title={id.title} />,
            field: 'usr_id',
            editable: 'never',
            render: rowData => <ColumnData data={rowData.usr_id} columnDataId={`usr-id-${rowData.tableData.id}`} />,
            cellStyle: {
                width: '5%',
                maxWidth: '5%',
            },
            headerStyle: {
                width: '5%',
                maxWidth: '5%',
            },
        },
        {
            title: <ColumnTitle title={fullName.title} />,
            field: 'usr_full_name',
            render: rowData => (
                <ColumnData data={rowData.usr_full_name} columnDataId={`usr-full-name-${rowData.tableData.id}`} />
            ),
            validate: rowData => (!!rowData.usr_full_name ? undefined : { error: true, errorText: fullNameError }),
            cellStyle: {
                width: '30%',
                maxWidth: '30%',
            },
            headerStyle: {
                width: '30%',
                maxWidth: '30%',
            },
        },
        {
            title: <ColumnTitle title={username.title} />,
            field: 'usr_username',
            render: rowData => (
                <ColumnData data={rowData.usr_username} columnDataId={`usr-username-${rowData.tableData.id}`} />
            ),
            validate: rowData => (!!rowData.usr_username ? undefined : { error: true, errorText: usernameError }),
            cellStyle: {
                width: '7%',
                maxWidth: '7%',
            },
            headerStyle: {
                width: '7%',
                maxWidth: '7%',
            },
        },
        {
            title: <ColumnTitle title={email.title} />,
            field: 'usr_email',
            render: rowData => (
                <ColumnData data={rowData.usr_email} columnDataId={`usr-email-${rowData.tableData.id}`} />
            ),
            validate: rowData => (!!rowData.usr_email ? undefined : { error: true, errorText: emailError }),
            cellStyle: {
                width: '30%',
                maxWidth: '30%',
            },
            headerStyle: {
                width: '30%',
                maxWidth: '30%',
            },
        },
        {
            title: <ColumnTitle title={status.title} />,
            field: 'usr_status',
            render: rowData => (
                <ColumnData data={upperFirst(rowData.usr_status)} columnDataId={`usr-status-${rowData.tableData.id}`} />
            ),
        },
        {
            title: <ColumnTitle title={isAdmin.title} />,
            field: 'usr_administrator',
            render: rowData => (
                <ColumnData
                    data={rowData.usr_administrator ? 'Yes' : 'No'}
                    columnDataId={`usr-administrator-${rowData.tableData.id}`}
                />
            ),
        },
        {
            title: <ColumnTitle title={isSuperAdmin.title} />,
            field: 'usr_super_administrator',
            render: rowData => (
                <ColumnData
                    data={rowData.usr_super_administrator ? 'Yes' : 'No'}
                    columnDataId={`usr-super-administrator-${rowData.tableData.id}`}
                />
            ),
        },
    ];
};

export const ManageUsersList = ({ onRowAdd, onRowDelete, onRowUpdate }) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const materialTableRef = React.createRef();
    const columns = React.createRef();
    columns.current = getColumns();

    const [pageSize, setPageSize] = React.useState(20);

    const {
        loadingText,
        form: {
            locale: { addButtonTooltip, editButtonTooltip, deleteButtonTooltip },
        },
    } = locale.components.manageUsers;

    const handleSave = (mode, newData, oldData) => {
        const materialTable = materialTableRef.current;

        // materialTable.setState(prevState => {
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

    return (
        <MaterialTable
            tableRef={materialTableRef}
            columns={columns.current}
            components={{
                Container: props => <div {...props} id="users-list" data-testid="users-list" />,
                OverlayLoading: props => (
                    <Backdrop {...props} open className={classes.backdrop}>
                        <StandardCard noHeader standardCardId="loading-users">
                            <InlineLoader message={loadingText} />
                        </StandardCard>
                    </Backdrop>
                ),
                Row: props => (
                    <MTableBodyRow
                        {...props}
                        hover
                        id={`users-list-row-${props.index}`}
                        data-testid={`users-list-row-${props.index}`}
                    />
                ),
                EditRow: props => {
                    return (
                        <FullUserDetails
                            {...props}
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
            onChangeRowsPerPage={pageSize => setPageSize(pageSize)}
            icons={tableIcons}
            title=""
            localization={{
                body: {
                    addTooltip: addButtonTooltip,
                    editTooltip: editButtonTooltip,
                    deleteTooltip: deleteButtonTooltip,
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
            }}
            actions={[
                {
                    tooltip: 'Delete selected users',
                    onClick: (evt, data) => console.log(data),
                },
            ]}
        />
    );
};

ManageUsersList.propTypes = {
    onRowAdd: PropTypes.func,
    onRowUpdate: PropTypes.func,
    onRowDelete: PropTypes.func,
};

export default React.memo(ManageUsersList);
