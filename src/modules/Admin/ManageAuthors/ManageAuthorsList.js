/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import makeStyles from '@material-ui/styles/makeStyles';
import MaterialTable, { MTableAction, MTableBodyRow } from 'material-table';
import { tableIcons } from './ManageAuthorsListIcons';

import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';

import ColumnTitle from './partials/ColumnTitle';
import ColumnData from './partials/ColumnData';
import AuthorHeader from './partials/AuthorHeader';
import LeastAuthorData from './partials/LeastAuthorData';
import FullAuthorDetails from './partials/FullAuthorDetails';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import { default as locale } from 'locale/components';
import { loadAuthorList } from 'actions';
import { useConfirmationState } from 'hooks';
import { BULK_DELETE_AUTHOR_SUCCESS } from 'config/general';

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
            columns: { id },
        },
    } = locale.components.manageAuthors;
    return [
        {
            title: <ColumnTitle title={id.title} />,
            field: 'aut_id',
            render: rowData => (
                <ColumnData data={rowData.aut_id} columnDataId={`aut-id-${rowData.tableData.id}`} copiable />
            ),
            cellStyle: {
                width: '13%',
                maxWidth: '13%',
            },
        },
        {
            title: <AuthorHeader />,
            field: 'author',
            sorting: false,
            render: rowData => <LeastAuthorData rowData={rowData} />,
            cellStyle: {
                width: '100%',
                maxWidth: '100%',
            },
        },
    ];
};

export const ManageAuthorsList = ({ onBulkRowDelete, onRowAdd, onRowDelete, onRowUpdate }) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();

    const materialTableRef = React.createRef();
    const columns = React.createRef();
    columns.current = getColumns();

    const [pageSize, setPageSize] = React.useState(20);

    const {
        loadingText,
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
        },
    } = locale.components.manageAuthors;

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
                    /* istanbul ignore next */ () => {
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

    return (
        <React.Fragment>
            <ConfirmationBox
                confirmationBoxId="bulk-delete-authors-confirmation"
                onAction={handleBulkDelete}
                onClose={hideConfirmation}
                isOpen={isOpen}
                locale={bulkDeleteConfirmationLocale}
            />
            <MaterialTable
                tableRef={materialTableRef}
                columns={columns.current}
                components={{
                    Container: props => <div {...props} id="authors-list" data-testid="authors-list" />,
                    OverlayLoading: props => (
                        <Backdrop {...props} open className={classes.backdrop}>
                            <StandardCard noHeader standardCardId="loading-authors">
                                <InlineLoader message={loadingText} />
                            </StandardCard>
                        </Backdrop>
                    ),
                    Row: props => (
                        <MTableBodyRow
                            {...props}
                            {...(props.hasAnyEditingRow ? { onRowClick: false, hover: false } : { hover: true })}
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
                            // } else if (props.action.isScopusIngest) {
                            //     const { icon: Icon, tooltip, ...restAction } = props.action;
                            //     return (
                            //         <MTableAction
                            //             {...props}
                            //             action={{
                            //                 ...restAction,
                            //                 tooltip,
                            //                 disabled:
                            //                     !props.data.aut_scopus_id ||
                            //                     props.data.aut_is_scopus_id_authenticated === 0,
                            //                 icon: () => (
                            //                     <Icon
                            //                         id={`authors-list-row-${
                            //                             props.data.tableData.id
                            //                         }-${tooltip.toLowerCase().replace(/ /g, '-')}`}
                            //                         data-testid={`authors-list-row-${
                            //                             props.data.tableData.id
                            //                         }-${tooltip.toLowerCase().replace(/ /g, '-')}`}
                            //                         {...restAction.iconProps}
                            //                     />
                            //                 ),
                            //                 onClick: () => console.log(props.data),
                            //             }}
                            //             size="small"
                            //         />
                            //     );
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
                onChangeRowsPerPage={pageSize => setPageSize(pageSize)}
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
                    selectionProps: rowData => ({
                        inputProps: {
                            id: `select-author-${rowData.tableData.id}`,
                            'data-testid': `select-author-${rowData.tableData.id}`,
                        },
                    }),
                    headerSelectionProps: {
                        inputProps: {
                            id: 'select-all-authors',
                            'data-testid': 'select-all-authors',
                        },
                    },
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
                        tooltip: scopusIngestButtonTooltip,
                    },
                ]}
            />
        </React.Fragment>
    );
};

ManageAuthorsList.propTypes = {
    onBulkRowDelete: PropTypes.func,
    onRowAdd: PropTypes.func,
    onRowUpdate: PropTypes.func,
    onRowDelete: PropTypes.func,
};

export default React.memo(ManageAuthorsList);
