/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
// import MaterialTable, { MTableBodyRow, MTableEditRow, MTableAction, MTableToolbar } from '@material-table/core';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { GridRowModes, DataGrid, GridActionsCellItem, GridRowEditStopReasons } from '@mui/x-data-grid';

import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { tableIcons } from './FavouriteSearchListIcons';

import locale from 'locale/global';
import { APP_URL, PATH_PREFIX } from 'config';
import componentsLocale from 'locale/components';

const classes = {
    text: {
        fontSize: 13,
    },
};

// export const getColumns = classes => {
//     const {
//         components: { favouriteSearchList },
//     } = componentsLocale;
//     return [
//         {
//             field: 'fvs_search_parameters',
//             headerName: favouriteSearchList.columns.realLink.title,
//             editable: false,
//             renderCell: rowData => (
//                 <ExternalLink
//                     id={`fvs-search-parameters-${rowData.tableData.id}`}
//                     key={rowData.value}
//                     href={`${APP_URL}${PATH_PREFIX}${rowData.value.replace('/', '')}`}
//                  aria-label={locale.global.linkWillOpenInNewWindow.replace('[destination]', rowData.fvs_description)}
//                 >
//                     {favouriteSearchList.columns.realLink.cellText}
//                 </ExternalLink>
//             ),
//         },
//         {
//             field: 'fvs_description',
//             headerName: favouriteSearchList.columns.description.title,
//             editable: true,
//             renderCell: rowData => (
//                 <Typography
//                     data-testid={`fvs-description-${rowData.tableData.id}`}
//                     id={`fvs-description-${rowData.tableData.id}`}
//                     sx={{ ...classes.text }}
//                 >
//                     {rowData.value}
//                 </Typography>
//             ),
//             renderEditCell: props => (
//                 <TextField
//                     {...props}
//                     InputProps={{
//                         style: {
//                             fontSize: 13,
//                         },
//                     }}
//                     value={props.value}
//                     onChange={e => props.onChange(e.target.value)}
//                     textFieldId="fvs-description"
//                     // errorText={props.helperText}
//                 />
//             ),
//             preProcessEditCellProps: rowData => ({ ...rowData.props, error: rowData.value === '' }),
//             // ? { isValid: false, helperText: favouriteSearchList.columns.description.validationMessage.empty }
//             // : true,
//         },
//         {
//             headerName: favouriteSearchList.columns.aliasedLink.title,
//             field: 'fvs_alias',
//             editable: false,
//             renderCell: props => (
//                 <ExternalLink
//                     key={props.value}
//                     id={`fvs-alias-${props.tableData.id}`}
//                     href={`${APP_URL}${PATH_PREFIX}${props.value}`}
//                 aria-label={locale.global.linkWillOpenInNewWindow.replace('[destination]', props.fvs_description)}
//                 >
//                     <Box component={'span'} sx={{ ...classes.text }}>
//                         {props.value}
//                     </Box>
//                 </ExternalLink>
//             ),
//         },
//         {
//             headerName: favouriteSearchList.columns.alias.title,
//             field: 'fvs_alias',
//             editable: true,
//             renderCell: rowData => (
//                 <Typography>
//                     <Box
//                         component={'span'}
//                         sx={{ ...classes.text }}
//                         data-testid={`fvs-alias-${rowData.tableData.id}`}
//                         id={`fvs-alias-${rowData.tableData.id}`}
//                     >
//                         {rowData.value}
//                     </Box>
//                 </Typography>
//             ),
//             renderEditCell: props => (
//                 <TextField
//                     {...props}
//                     InputProps={{
//                         style: {
//                             fontSize: 13,
//                         },
//                     }}
//                     value={props.value || ''}
//                     onChange={e => props.onChange(e.target.value)}
//                     textFieldId="fvs-alias"
//                     errorText={props.helperText}
//                 />
//             ),
//             preProcessEditCellProps: rowData => ({
//                 ...rowData.props,
//         error: rowData.value !== '' && !new RegExp(favouriteSearchList.columns.alias.regex).test(rowData.value),
//             }),

//             //     {
//             //     return rowData.fvs_alias !== '' &&
//             //         !new RegExp(favouriteSearchList.columns.alias.regex).test(rowData.fvs_alias)
//             //         ? { isValid: false, helperText: favouriteSearchList.columns.alias.validationMessage.invalid }
//             //         : true;
//             // },
//         },
//     ];
/*
    return [
        {
            title: favouriteSearchList.columns.realLink.title,
            field: 'fvs_search_parameters',
            editable: 'never',
            render: rowData => (
                <ExternalLink
                    id={`fvs-search-parameters-${rowData.tableData.id}`}
                    key={rowData.fvs_search_parameters}
                    href={`${APP_URL}${PATH_PREFIX}${rowData.fvs_search_parameters.replace('/', '')}`}
                    aria-label={locale.global.linkWillOpenInNewWindow.replace('[destination]', rowData.fvs_description)}
                >
                    {favouriteSearchList.columns.realLink.cellText}
                </ExternalLink>
            ),
        },
        {
            title: favouriteSearchList.columns.description.title,
            field: 'fvs_description',
            render: rowData => (
                <Typography
                    data-testid={`fvs-description-${rowData.tableData.id}`}
                    id={`fvs-description-${rowData.tableData.id}`}
                    sx={{ ...classes.text }}
                >
                    {rowData.fvs_description}
                </Typography>
            ),
            editComponent: props => (
                <TextField
                    {...props}
                    InputProps={{
                        style: {
                            fontSize: 13,
                        },
                    }}
                    value={props.value}
                    onChange={e => props.onChange(e.target.value)}
                    textFieldId="fvs-description"
                    errorText={props.helperText}
                />
            ),
            validate: rowData =>
                rowData.fvs_description === ''
                    ? { isValid: false, helperText: favouriteSearchList.columns.description.validationMessage.empty }
                    : true,
        },
        {
            title: favouriteSearchList.columns.aliasedLink.title,
            field: 'fvs_alias',
            editable: 'never',
            render: rowData => (
                <ExternalLink
                    key={rowData.fvs_alias}
                    id={`fvs-alias-${rowData.tableData.id}`}
                    href={`${APP_URL}${PATH_PREFIX}${rowData.fvs_alias}`}
                    aria-label={locale.global.linkWillOpenInNewWindow.replace('[destination]', rowData.fvs_description)}
                >
                    <Box component={'span'} sx={{ ...classes.text }}>
                        {rowData.fvs_alias}
                    </Box>
                </ExternalLink>
            ),
        },
        {
            title: favouriteSearchList.columns.alias.title,
            field: 'fvs_alias',
            render: rowData => (
                <Typography>
                    <Box
                        component={'span'}
                        sx={{ ...classes.text }}
                        data-testid={`fvs-alias-${rowData.tableData.id}`}
                        id={`fvs-alias-${rowData.tableData.id}`}
                    >
                        {rowData.fvs_alias}
                    </Box>
                </Typography>
            ),
            editComponent: props => (
                <TextField
                    {...props}
                    InputProps={{
                        style: {
                            fontSize: 13,
                        },
                    }}
                    value={props.value || ''}
                    onChange={e => props.onChange(e.target.value)}
                    textFieldId="fvs-alias"
                    errorText={props.helperText}
                />
            ),
            validate: rowData => {
                return rowData.fvs_alias !== '' &&
                    !new RegExp(favouriteSearchList.columns.alias.regex).test(rowData.fvs_alias)
                    ? { isValid: false, helperText: favouriteSearchList.columns.alias.validationMessage.invalid }
                    : true;
            },
        },
    ];
    */
// };

export const FavouriteSearchList = ({ /* handleRowDelete, handleRowUpdate,*/ list }) => {
    const {
        components: { favouriteSearchList },
    } = componentsLocale;
    console.log('FavouriteSearchList', list);
    const [rows, setRows] = React.useState(list);
    const [rowModesModel, setRowModesModel] = React.useState({});

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = id => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = id => () => {
        console.log('handleSaveClick', id, rowModesModel);
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = id => () => {
        setRows(rows.filter(row => row.id !== id));
    };

    const handleCancelClick = id => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find(row => row.id === id);
        if (editedRow?.isNew) {
            setRows(rows.filter(row => row.id !== id));
        }
    };

    const processRowUpdate = newRow => {
        // here, figure out why editing a row causes every row to duplicate to this row
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map(row => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = newRowModesModel => {
        setRowModesModel(newRowModesModel);
    };

    const columns = [
        {
            field: 'fvs_search_parameters',
            headerName: favouriteSearchList.columns.realLink.title,
            editable: false,
            renderCell: props => {
                console.log(props);
                return (
                    <ExternalLink
                        id={`fvs-search-parameters-${props.id}`}
                        key={props.value}
                        href={`${APP_URL}${PATH_PREFIX}${props.value.replace('/', '')}`}
                        aria-label={locale.global.linkWillOpenInNewWindow.replace(
                            '[destination]',
                            props.row.fvs_description,
                        )}
                    >
                        {favouriteSearchList.columns.realLink.cellText}
                    </ExternalLink>
                );
            },
            flex: 1,
            cellClassName: 'cell-styled',
        },
        {
            field: 'fvs_description',
            headerName: favouriteSearchList.columns.description.title,
            editable: true,
            renderCell: props => (
                <Typography
                    data-testid={`fvs-description-${props.id}`}
                    id={`fvs-description-${props.id}`}
                    sx={{ ...classes.text }}
                >
                    {props.value}
                </Typography>
            ),
            renderEditCell: props => {
                console.log(props);
                return (
                    <TextField
                        InputProps={{
                            style: {
                                fontSize: 13,
                            },
                        }}
                        value={props.value}
                        textFieldId="fvs-description"
                        error={props.error}
                        errorText={props.error ? favouriteSearchList.columns.description.validationMessage.empty : ''}
                        onChange={e => {
                            props.api.setEditCellValue({
                                id: props.id,
                                field: props.field,
                                value: e.target.value,
                            });
                        }}
                    />
                );
            },
            preProcessEditCellProps: params => ({
                ...params.props,
                error: params.props.value === '',
            }),
            flex: 1,
            cellClassName: 'cell-styled',
            // ? { isValid: false, helperText:  }
            // : true,
        },
        {
            headerName: favouriteSearchList.columns.aliasedLink.title,
            field: 'fvs_alias_link',
            editable: false,
            renderCell: props => (
                <ExternalLink
                    key={props.value}
                    id={`fvs-alias-${props.id}`}
                    href={`${APP_URL}${PATH_PREFIX}${props.row.fvs_alias}`}
                    aria-label={locale.global.linkWillOpenInNewWindow.replace(
                        '[destination]',
                        props.row.fvs_description,
                    )}
                >
                    <Box component={'span'} sx={{ ...classes.text }}>
                        {props.row.fvs_alias}
                    </Box>
                </ExternalLink>
            ),
            flex: 1,
            cellClassName: 'cell-styled',
        },
        {
            headerName: favouriteSearchList.columns.alias.title,
            field: 'fvs_alias',
            editable: true,
            renderCell: props => (
                <Typography>
                    <Box
                        component={'span'}
                        sx={{ ...classes.text }}
                        data-testid={`fvs-alias-${props.id}`}
                        id={`fvs-alias-${props.id}`}
                    >
                        {props.value}
                    </Box>
                </Typography>
            ),
            renderEditCell: props => (
                <TextField
                    InputProps={{
                        style: {
                            fontSize: 13,
                        },
                    }}
                    value={props.value || ''}
                    textFieldId="fvs-alias"
                    onChange={e => {
                        props.api.setEditCellValue({
                            id: props.id,
                            field: props.field,
                            value: e.target.value,
                        });
                    }}
                    errorText={props.error ? favouriteSearchList.columns.alias.validationMessage.invalid : ''}
                />
            ),
            preProcessEditCellProps: params => {
                console.log(params);
                return {
                    ...params.props,
                    error:
                        params.props.value !== '' &&
                        !new RegExp(favouriteSearchList.columns.alias.regex).test(params.props.value),
                };
            },
            flex: 1,
            cellClassName: 'cell-styled',

            //     {
            //     return rowData.fvs_alias !== '' &&
            //         !new RegExp(favouriteSearchList.columns.alias.regex).test(rowData.fvs_alias)
            //         ? { isValid: false, helperText: favouriteSearchList.columns.alias.validationMessage.invalid }
            //         : true;
            // },
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 96,
            cellClassName: 'cell-styled',
            getActions: params => {
                console.log(params);
                const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<tableIcons.Check />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(params.id)}
                        />,
                        <GridActionsCellItem
                            icon={<tableIcons.Clear />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(params.id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<tableIcons.Edit />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(params.id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<tableIcons.Delete />}
                        label="Delete"
                        onClick={handleDeleteClick(params.id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    // const materialTableRef = React.createRef();
    // const columns = React.createRef();
    // columns.current = getColumns(classes);

    // const [data, setData] = React.useState(list);

    return (
        <Paper
            sx={{
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                '& .cell-styled': {
                    paddingY: 2,
                    alignContent: 'center',
                },
            }}
        >
            <DataGrid
                rows={rows}
                getRowId={row => row.fvs_id}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                sx={{ border: 0 }}
                autosizeOnMount
                disableDensitySelector
                disableColumnMenu
                disableColumnFilter
                disableColumnSelector
                disableSelectionOnClick
                pagination={false}
            />
        </Paper>
        // <MaterialTable
        //     tableRef={materialTableRef}
        //     columns={columns.current}
        //     components={{
        //         Container: props => <Paper {...props} style={{ padding: 16 }} />,
        //         Toolbar: props => <MTableToolbar {...props} style={{ minHeight: 64 }} />,
        //         Row: props => (
        //             <MTableBodyRow
        //                 {...props}
        //                 sx={{ ...classes.text }}
        //                 id={`favourite-search-list-item-${props.index}`}
        //                 data-testid={`favourite-search-list-item-${props.index}`}
        //             />
        //         ),
        //         EditRow: props => (
        //             <MTableEditRow
        //                 {...props}
        //                 id={`favourite-search-list-edit-item-${props.data.tableData.id}`}
        //                 data-testid={`favourite-search-list-edit-item-${props.data.tableData.id}`}
        //             />
        //         ),
        //         Action: props => {
        //             const { icon: Icon, tooltip, ...restAction } =
        //                 (typeof props.action === 'function' && props.action(props.data)) || props.action;
        //             return (
        //                 <MTableAction
        //                     {...props}
        //                     action={{
        //                         ...restAction,
        //                         tooltip,
        //                         icon: () => (
        //                             <Icon
        //                                 data-testid={`favourite-search-list-item-${
        //                                     props.data.tableData.id
        //                                 }-${tooltip.toLowerCase()}`}
        //                             />
        //                         ),
        //                     }}
        //                 />
        //             );
        //         },
        //     }}
        //     data={data}
        //     icons={tableIcons}
        //     title={favouriteSearchList.tableTitle}
        //     editable={{
        //         onRowUpdate: (newData, oldData) => {
        //             return handleRowUpdate(newData, oldData)
        //                 .then(() => {
        //                     return new Promise(resolve => {
        //                         setTimeout(() => {
        //                             const dataUpdate = [...data];
        //                             const target = dataUpdate.find(el => el.fvs_id === oldData.fvs_id);
        //                             const index = dataUpdate.indexOf(target);
        //                             const newValue = { ...newData };
        //                             delete newValue.tableData;
        //                             dataUpdate[index] = newValue;
        //                             setData([...dataUpdate]);
        //                             resolve();
        //                         }, 1000);
        //                     });
        //                 })
        //                 .catch(() => {
        //                     setData(prevState => prevState);
        //                 });
        //         },
        //         onRowDelete: oldData => {
        //             return handleRowDelete(oldData).then(() => {
        //                 return new Promise(resolve => {
        //                     setTimeout(() => {
        //                         const dataDelete = [...data];
        //                         const target = dataDelete.find(el => el.fvs_id === oldData.fvs_id);
        //                         const index = dataDelete.indexOf(target);
        //                         dataDelete.splice(index, 1);
        //                         setData([...dataDelete]);
        //                         resolve();
        //                     }, 1000);
        //                 });
        //             });
        //         },
        //     }}
        //     options={{
        //         actionsColumnIndex: -1,
        //         grouping: false,
        //         draggable: false,
        //         paging: false,
        //         search: false,
        //         headerStyle: {
        //             padding: 16,
        //         },
        //     }}
        // />
    );
};

FavouriteSearchList.propTypes = {
    handleRowDelete: PropTypes.func,
    handleRowUpdate: PropTypes.func,
    list: PropTypes.array,
};

export default React.memo(FavouriteSearchList);
