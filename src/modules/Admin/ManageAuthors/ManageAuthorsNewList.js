/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import MaterialTable, { MTableAction, MTableBodyRow } from 'material-table';

import Button from '@material-ui/core/Button';
import { tableIcons } from './ManageAuthorsListIcons';

import ColumnTitle from './partials/ColumnTitle';
import ColumnData from './partials/ColumnData';

import AuthorHeader from './newPartials/AuthorHeader';
import LeastAuthorData from './newPartials/LeastAuthorData';
import FullAuthorDetails from './newPartials/FullAuthorDetails';

import { default as locale } from 'locale/components';
import { loadAuthorList } from 'actions';

export const getColumns = () => {
    const {
        header: {
            columns: { id },
        },
    } = locale.components.manageAuthors;
    return [
        {
            title: <ColumnTitle title={id.label} />,
            field: 'aut_id',
            render: rowData => <ColumnData data={rowData.aut_id} columnDataId={`aut-id-${rowData.tableData.id}`} />,
            cellStyle: {
                width: '6%',
                maxWidth: '6%',
            },
        },
        {
            title: <AuthorHeader />,
            field: 'author',
            sorting: false,
            render: rowData => <LeastAuthorData rowData={rowData} />,
            validate: rowData => {
                let errorObject = {};

                if (!rowData.aut_fname || rowData.aut_fname === '') {
                    errorObject = {
                        ...errorObject,
                        aut_fname: {
                            error: true,
                            errorText: 'Required',
                        },
                    };
                }

                if (!rowData.aut_lname || rowData.aut_lname === '') {
                    errorObject = {
                        ...errorObject,
                        aut_lname: {
                            error: true,
                            errorText: 'Required',
                        },
                    };
                }

                return Object.keys(errorObject).length === 0 ? true : JSON.stringify(errorObject);
            },
            cellStyle: {
                width: '100%',
                maxWidth: '100%',
            },
        },
    ];
};

export const ManageAuthorsList = ({ onRowAdd, onRowDelete, onRowUpdate }) => {
    const dispatch = useDispatch();
    const materialTableRef = React.createRef();
    const columns = React.createRef();
    columns.current = getColumns();

    const [pageSize, setPageSize] = React.useState(20);

    const {
        form: {
            locale: { addButtonTooltip, editButtonTooltip, deleteButtonTooltip },
        },
    } = locale.components.manageAuthors;

    return (
        <React.Fragment>
            <MaterialTable
                tableRef={materialTableRef}
                columns={columns.current}
                components={{
                    Container: props => <div {...props} id="authors-list" data-testid="authors-list" />,
                    Row: props => (
                        <MTableBodyRow
                            {...props}
                            hover
                            id={`authors-list-row-${props.index}`}
                            data-testid={`authors-list-row-${props.index}`}
                        />
                    ),
                    EditRow: props => {
                        return (
                            <FullAuthorDetails
                                {...props}
                                id="authors-list-edit-row"
                                data-testid="authors-list-edit-row"
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
                        } else {
                            //  Add action
                            const { tooltip } = props.action;
                            return (
                                <Button
                                    id={`authors-${tooltip.toLowerCase().replace(/ /g, '-')}`}
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
                    return dispatch(loadAuthorList(query));
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
                    onRowAdd: newData =>
                        onRowAdd(newData)
                            .then(data => {
                                materialTableRef.current.setData(prevState => {
                                    return [data, ...prevState];
                                });
                            })
                            .catch(() => materialTableRef.current.setData(prevState => prevState)),
                    onRowUpdate: (newData, oldData) =>
                        onRowUpdate(newData, oldData)
                            .then(data => {
                                materialTableRef.current.setData(prevState => {
                                    const list = [...prevState];
                                    list[list.indexOf(oldData)] = data;
                                    return list;
                                });
                            })
                            .catch(() => materialTableRef.current.setData(prevState => prevState)),
                    onRowDelete: oldData =>
                        onRowDelete(oldData).then(() => {
                            materialTableRef.current.setData(prevState => {
                                const data = [...prevState];
                                data.splice(data.indexOf(oldData), 1);
                                return data;
                            });
                        }),
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
                }}
            />
        </React.Fragment>
    );
};

ManageAuthorsList.propTypes = {
    onRowAdd: PropTypes.func,
    onRowUpdate: PropTypes.func,
    onRowDelete: PropTypes.func,
};

export default React.memo(ManageAuthorsList);
