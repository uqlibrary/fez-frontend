/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import MaterialTable, { MTableAction, MTableBodyRow } from 'material-table';

import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/styles';

import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { tableIcons } from './ManageAuthorsListIcons';

import ColumnTitle from './partials/ColumnTitle';
import ColumnData from './partials/ColumnData';

import AuthorHeader from './newPartials/AuthorHeader';
import LeastAuthorData from './newPartials/LeastAuthorData';
import FullAuthorDetails from './newPartials/FullAuthorDetails';

import { default as locale } from 'locale/components';
import { default as pageLocale } from 'locale/pages';
import { loadAuthorList } from 'actions';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

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
            cellStyle: (value, rowData) => {
                if (rowData.tableData.editing === 'update') {
                    return {
                        display: 'block',
                    };
                } else {
                    return {
                        width: '6%',
                        maxWidth: '6%',
                    };
                }
            },
            // editable: 'never',
            editComponent: () => <div />,
        },
        {
            title: <AuthorHeader />,
            field: 'author',
            sorting: false,
            render: rowData => <LeastAuthorData rowData={rowData} />,
            // editComponent: ({ onRowDataChange, rowData, ...props }) => {
            //     const handleChange = (name, value) => {
            //         onRowDataChange({
            //             ...rowData,
            //             [name]: value,
            //         });
            //     };
            //     return (
            //         <ScrollToSection scrollToSection>
            //             <FullAuthorDetails {...props} rowData={rowData} onChange={handleChange} />
            //         </ScrollToSection>
            //     );
            // },
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
            cellStyle: (value, rowData) => {
                if (rowData.tableData.editing === 'update') {
                    return {
                        display: 'block',
                    };
                } else {
                    return {
                        width: '100%',
                        maxWidth: '100%',
                    };
                }
            },
        },
        // {
        //     title: <ColumnTitle title="Username & IDs" />,
        //     field: 'identifiers-usernames',
        //     render: rowData => (
        //         <UsernameIdColumnData rowData={rowData} key="viewable-identifiers-usernames-column-data" />
        //     ),
        //     editComponent: ({ onRowDataChange, rowData, ...props }) => {
        //         const handleChange = (name, value) => {
        //             onRowDataChange({
        //                 ...rowData,
        //                 [name]: value,
        //             });
        //         };
        //         return (
        //             <EditableContext.Provider value={{ editable: true }}>
        //                 <UsernameIdColumnData
        //                     {...props}
        //                     rowData={rowData}
        //                     onChange={handleChange}
        //                     key="editable-identifiers-usernames-column-data"
        //                 />
        //             </EditableContext.Provider>
        //         );
        //     },
        //     cellStyle: {
        //         width: '25%',
        //         maxWidth: '25%',
        //     },
        //     headerStyle: {
        //         width: '25%',
        //         maxWidth: '25%',
        //     },
        // },

        // {
        //     title: <ColumnTitle title="Researcher Identifiers" />,
        //     field: 'researcher-identifiers',
        //     render: rowData => (
        //         <ResearcherIdentifierColumnData rowData={rowData}
        // key="viewable-researcher-identifiers-column-data" />
        //     ),
        //     editComponent: ({ onRowDataChange, rowData, ...props }) => {
        //         const handleChange = (name, value) => {
        //             onRowDataChange({
        //                 ...rowData,
        //                 [name]: value,
        //             });
        //         };
        //         return (
        //             <EditableContext.Provider value={{ editable: true }}>
        //                 <ResearcherIdentifierColumnData
        //                     {...props}
        //                     rowData={rowData}
        //                     onChange={handleChange}
        //                     key="editable-researcher-identifiers-column-data"
        //                 />
        //             </EditableContext.Provider>
        //         );
        //     },
        // },
        // {
        //     title: <ColumnTitle title={createdDate.title} />,
        //     field: 'aut_created_date',
        //     render: rowData => (
        //         <ColumnData data={rowData.aut_created_date}
        // columnDataId={`aut-created-date-${rowData.tableData.id}`} />
        //     ),
        //     cellStyle: {
        //         width: '10%',
        //         maxWidth: '10%',
        //     },
        //     headerStyle: {
        //         width: '10%',
        //         maxWidth: '10%',
        //     },
        // },
    ];
};

const useStyles = makeStyles(() => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

export const ManageAuthorsList = ({ onRowAdd, onRowDelete, onRowUpdate, list }) => {
    const dispatch = useDispatch();
    const materialTableRef = React.createRef();
    const columns = React.createRef();
    columns.current = getColumns();

    const classes = useStyles();

    const [pageSize, setPageSize] = React.useState(20);

    const {
        form: {
            locale: { addButtonTooltip, editButtonTooltip, deleteButtonTooltip },
        },
    } = locale.components.manageAuthors;

    // eslint-disable-next-line no-unused-vars
    const [_, setData] = React.useState(list);

    return (
        <React.Fragment>
            <MaterialTable
                tableRef={materialTableRef}
                columns={columns.current}
                components={{
                    Container: props => <div {...props} id="authors-list" data-testid="authors-list" />,
                    OverlayLoading: () => (
                        <Modal open className={classes.modal}>
                            <StandardCard noHeader standardCardId="loading-authors">
                                <InlineLoader message={pageLocale.pages.authors.loadingMessage} />
                            </StandardCard>
                        </Modal>
                    ),
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
                        if (
                            typeof props.action !== 'function' &&
                            !props.action.action &&
                            props.action.position !== 'toolbar'
                        ) {
                            //  Save or Cancel actions for Add/Edit/Delete actions
                            const { icon: Icon, tooltip, ...restAction } = props.action;
                            return (
                                <MTableAction
                                    {...props}
                                    action={{
                                        ...restAction,
                                        icon: () => (
                                            <Icon
                                                id={`authors-${(!!props.data.tableData &&
                                                    props.data.tableData.editing) ||
                                                    'add'}-${tooltip.toLowerCase().replace(/ /g, '-')}`}
                                                data-testid={`authors-${(!!props.data.tableData &&
                                                    props.data.tableData.editing) ||
                                                    'add'}-${tooltip.toLowerCase().replace(/ /g, '-')}`}
                                            />
                                        ),
                                    }}
                                    size="small"
                                />
                            );
                        } else if (typeof props.action === 'function') {
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
                                setData(prevState => {
                                    return [data, ...prevState];
                                });
                            })
                            .catch(() => setData(prevState => prevState)),
                    onRowUpdate: (newData, oldData) =>
                        onRowUpdate(newData, oldData)
                            .then(data => {
                                setData(prevState => {
                                    const list = [...prevState];
                                    list[list.indexOf(oldData)] = data;
                                    return list;
                                });
                            })
                            .catch(() => setData(prevState => prevState)),
                    onRowDelete: oldData =>
                        onRowDelete(oldData).then(() => {
                            setData(prevState => {
                                const data = [...prevState];
                                data.splice(data.indexOf(oldData), 1);
                                return data;
                            });
                        }),
                }}
                options={{
                    actionsColumnIndex: -1,
                    addRowPosition: 'first',
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
    list: PropTypes.array,
};

export default React.memo(ManageAuthorsList);
