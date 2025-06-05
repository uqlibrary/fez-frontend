/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { GridRowModes, DataGrid, GridActionsCellItem } from '@mui/x-data-grid';

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
    h6text: {
        display: 'block',
        marginBlockStart: '2.33em',
        marginBlockEnd: '2.33em',
        marginInlineStart: '0px',
        marginInlineEnd: '0px',
        fontWeight: 400,
        fontSize: 20,
    },
};

export const FavouriteSearchList = ({ handleRowDelete, handleRowUpdate, list }) => {
    const {
        components: { favouriteSearchList },
    } = componentsLocale;
    const [loading, setLoading] = React.useState(false);
    const [rows, setRows] = React.useState(list);
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [deleteRowId, setDeleteRowId] = React.useState(null);

    const processRowUpdate = (newData, oldData) => {
        setLoading(true);
        const res = handleRowUpdate(newData, oldData)
            .then(() => {
                return new Promise(resolve => {
                    setLoading(false);
                    resolve(newData);
                });
            })
            .catch(e => {
                console.error('Error updating row:', e);
                setLoading(false);
                return oldData;
            });
        return res;
    };

    const handleRowModesModelChange = newRowModesModel => {
        setRowModesModel(newRowModesModel);
    };

    const handleEditClick = id => () => {
        setRowModesModel({
            [id]: { mode: GridRowModes.Edit },
        });
    };

    const handleSaveClick = id => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteRow = id => () => {
        setLoading(true);
        const oldData = rows.find(row => row.fvs_id === id);
        handleRowDelete(oldData)
            .then(() => {
                setRows(rows.filter(row => row.fvs_id !== id));
                setDeleteRowId(null);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                setDeleteRowId(null);
                setRows(prevRows => prevRows);
            });
    };

    const handleDeleteClick = id => () => {
        setDeleteRowId(id);
    };

    const handleCancelClick = id => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        setDeleteRowId(null);
    };

    const columns = [
        {
            field: 'fvs_search_parameters',
            headerName: favouriteSearchList.columns.realLink.title,
            editable: !!deleteRowId,
            renderCell: props => {
                const index = rows.findIndex(row => row.fvs_id === props.id);
                if (!!deleteRowId && props.row.fvs_id === deleteRowId) {
                    return (
                        <Typography
                            data-testid={`delete-row-${index}`}
                            id={`delete-row-${index}`}
                            sx={{ ...classes.h6text }}
                            component={'h6'}
                        >
                            {favouriteSearchList.deleteConfirmLabel}
                        </Typography>
                    );
                }

                return (
                    <ExternalLink
                        id={`fvs-search-parameters-${index}`}
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
            colSpan: (value, row) => {
                if (row.fvs_id === deleteRowId) return 4;
                return undefined;
            },
        },
        {
            field: 'fvs_description',
            headerName: favouriteSearchList.columns.description.title,
            editable: true,
            renderCell: props => {
                const index = rows.findIndex(row => row.fvs_id === props.id);
                return (
                    <Typography
                        data-testid={`fvs-description-${index}`}
                        id={`fvs-description-${index}`}
                        sx={{ ...classes.text }}
                    >
                        {props.value}
                    </Typography>
                );
            },
            renderEditCell: props => {
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
        },
        {
            headerName: favouriteSearchList.columns.aliasedLink.title,
            field: 'fvs_alias_link',
            editable: false,
            renderCell: props => {
                const index = rows.findIndex(row => row.fvs_id === props.id);
                return (
                    <ExternalLink
                        key={props.value}
                        id={`fvs-alias-${index}`}
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
                );
            },
            flex: 1,
            cellClassName: 'cell-styled',
        },
        {
            headerName: favouriteSearchList.columns.alias.title,
            field: 'fvs_alias',
            editable: true,
            renderCell: props => {
                const index = rows.findIndex(row => row.fvs_id === props.id);
                return (
                    <Typography>
                        <Box
                            component={'span'}
                            sx={{ ...classes.text }}
                            data-testid={`fvs-alias-${index}`}
                            id={`fvs-alias-${index}`}
                        >
                            {props.value}
                        </Box>
                    </Typography>
                );
            },
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
                    error={props.error}
                    errorText={props.error ? favouriteSearchList.columns.alias.validationMessage.invalid : ''}
                />
            ),
            preProcessEditCellProps: params => {
                return {
                    ...params.props,
                    error:
                        params.props.value !== '' &&
                        !new RegExp(favouriteSearchList.columns.alias.regex).test(params.props.value),
                };
            },
            flex: 1,
            cellClassName: 'cell-styled',
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 96,
            cellClassName: 'cell-styled',
            getActions: params => {
                const isAnyInEditMdode = Object.values(rowModesModel).some(
                    rowMode => rowMode.mode === GridRowModes.Edit,
                );
                const isAnyDeleting = !!deleteRowId;
                const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
                const isDeleting = params.id === deleteRowId;
                const index = rows.findIndex(row => row.fvs_id === params.id);
                if (isInEditMode || isDeleting) {
                    return [
                        <GridActionsCellItem
                            icon={<tableIcons.Check />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={!isDeleting ? handleSaveClick(params.id) : handleDeleteRow(params.id)}
                            data-testid={`favourite-search-list-item-${index}-save`}
                        />,
                        <GridActionsCellItem
                            icon={<tableIcons.Clear />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(params.id)}
                            color="inherit"
                            data-testid={`favourite-search-list-item-${index}-cancel`}
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
                        data-testid={`favourite-search-list-item-${index}-edit`}
                        disabled={isAnyInEditMdode || isAnyDeleting}
                    />,
                    <GridActionsCellItem
                        icon={<tableIcons.Delete />}
                        label="Delete"
                        onClick={handleDeleteClick(params.id)}
                        color="inherit"
                        data-testid={`favourite-search-list-item-${index}-delete`}
                        disabled={isAnyInEditMdode || isAnyDeleting}
                    />,
                ];
            },
        },
    ];

    return (
        <Paper
            sx={{
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <DataGrid
                id="favourite-search-list"
                data-testid="favourite-search-list"
                rows={rows}
                getRowId={row => row.fvs_id}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                loading={loading}
                onRowModesModelChange={handleRowModesModelChange}
                processRowUpdate={processRowUpdate}
                localeText={{ noRowsLabel: favouriteSearchList.noRowsLabel }}
                sx={{
                    border: 0,
                    '& .cell-styled': {
                        paddingY: 2,
                        lineHeight: 1.43,
                        alignContent: 'center',
                        ...classes.text,
                    },
                }}
                disableDensitySelector
                disableColumnMenu
                disableColumnFilter
                disableColumnSelector
                disableSelectionOnClick
                disableRowSelectionOnClick
            />
        </Paper>
    );
};

FavouriteSearchList.propTypes = {
    handleRowDelete: PropTypes.func,
    handleRowUpdate: PropTypes.func,
    list: PropTypes.array,
};

export default React.memo(FavouriteSearchList);
