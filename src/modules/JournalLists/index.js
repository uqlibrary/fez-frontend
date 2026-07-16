import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/GridLegacy';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import {
    GridRowModes,
    DataGrid as MuiDataGrid,
    GridActionsCellItem,
    GridEditInputCell,
    GridToolbarContainer,
} from '@mui/x-data-grid';

import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { loadJournalLists, createJournalList, updateJournalList, deleteJournalList } from 'actions';
import { locale } from 'locale';
import Add from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Check from '@mui/icons-material/Check';
import Clear from '@mui/icons-material/Clear';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import { ExternalLink } from '../SharedComponents/ExternalLink';
import { pathConfig } from '../../config';

const classes = {
    text: {
        lineHeight: 1.43,
    },
};

const createListUrl = id =>
    `${pathConfig.journals.search}?${encodeURI(`activeFacets[filters][UserList]=${id}&keywords[Keyword-all-journals][type]=Keyword&keywords[Keyword-all-journals][text]=all+journals&keywords[Keyword-all-journals][id]=Keyword-all-journals&keywords[Keyword-all-journals][operand]=AND#/journals/search/?keywords[Keyword-all-journals][type]=Keyword&keywords[Keyword-all-journals][text]=all+journals&keywords[Keyword-all-journals][id]=Keyword-all-journals&keywords[Keyword-all-journals][operand]=AND`)}`;

export const JournalLists = () => {
    const dispatch = useDispatch();
    const txt = locale.components.journalLists;
    const gridTxt = txt.grid;
    const { loading, data, error } = useSelector(state => state.get('journalListsReducer'));

    const [rows, setRows] = React.useState(data?.data);
    const [gridLoading, setGridLoading] = React.useState(false);
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [deleteRowId, setDeleteRowId] = React.useState(null);
    const [editingLabel, setEditingLabel] = React.useState('');
    const [hasLoadedOnce, setHasLoadedOnce] = React.useState(false);

    React.useEffect(() => {
        dispatch(loadJournalLists()).finally(() => setHasLoadedOnce(true));
    }, []);

    React.useEffect(() => {
        setRows(data?.data);
    }, [data?.data]);

    const handleAddClick = React.useCallback(() => {
        const id = `new-${Date.now()}`;
        const newRow = { fjl_id: id, fjl_label: '', fjl_private: true, isNew: true };
        setEditingLabel('');
        setRows(prev => [newRow, ...prev]);
        setRowModesModel(prev => ({
            ...prev,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'fjl_label' },
        }));
    }, []);

    const handleUpdateRow = React.useCallback(
        async (newData, oldData) => {
            setGridLoading(true);
            const { tableData, isNew, ...updates } = newData;

            if (isNew) {
                // exclude client-generated temp id from create payload
                const { fjl_id, ...payload } = updates;
                const res = await dispatch(createJournalList(payload))
                    .then(created => {
                        const newRow = created?.data ?? created;
                        setRows(prev => (prev ?? []).map(row => (row.fjl_id === oldData.fjl_id ? newRow : row)));
                        return newRow;
                    })
                    .catch(() => {
                        setRows(prev => (prev ?? []).filter(row => row.fjl_id !== oldData.fjl_id));
                        return oldData;
                    });
                setGridLoading(false);
                return res;
            }

            const res = await dispatch(updateJournalList(updates))
                .then(() => newData)
                .catch(() => oldData);
            setGridLoading(false);
            return res;
        },
        [dispatch],
    );

    const handleDeleteRow = React.useCallback(
        id => {
            setRows(currentRows => {
                const rowToDelete = currentRows.find(row => row.fjl_id === id);

                if (rowToDelete?.isNew) {
                    setDeleteRowId(null);
                    return currentRows.filter(row => row.fjl_id !== id);
                }

                setGridLoading(true);
                dispatch(deleteJournalList(rowToDelete.fjl_id))
                    .then(() => {
                        setRows(prev => (prev ?? []).filter(row => row.fjl_id !== id));
                    })
                    .catch(err => console.error(err))
                    .finally(() => {
                        setDeleteRowId(null);
                        setGridLoading(false);
                    });

                return currentRows;
            });
        },
        [dispatch],
    );

    const handleRowModesModelChange = React.useCallback(newRowModesModel => setRowModesModel(newRowModesModel), []);

    const handleEditClick = React.useCallback(
        id => () => {
            const row = rows.find(r => r.fjl_id === id);
            setEditingLabel(row?.fjl_label ?? '');
            setRowModesModel({
                [id]: { mode: GridRowModes.Edit },
            });
        },
        [rows],
    );

    const handleSaveClick = React.useCallback(
        id => () => setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } }),
        [rowModesModel],
    );

    const handleDeleteClick = React.useCallback(id => () => setDeleteRowId(id), []);

    const handleCancelClick = React.useCallback(
        id => () => {
            setRowModesModel({
                ...rowModesModel,
                [id]: { mode: GridRowModes.View, ignoreModifications: true },
            });
            setDeleteRowId(null);
            setRows(prev => prev.filter(row => !(row.fjl_id === id && row.isNew)));
        },
        [rowModesModel],
    );

    const columns = React.useMemo(
        () => [
            {
                field: 'fjl_id',
                headerName: 'URL',
                editable: false,
                sortable: false,
                resizable: false,
                align: 'center',
                renderCell: props => (
                    <Typography data-testid={`fjl-id-${props.id}`} id={`fjl-id-${props.id}`} sx={{ ...classes.text }}>
                        <ExternalLink id={props.id} href={createListUrl(props.value)} />
                    </Typography>
                ),
                width: 50,
                cellClassName: 'cell-styled',
            },
            {
                field: 'fjl_label',
                headerName: gridTxt.columns.label.title,
                editable: true,
                resizable: false,
                renderCell: props => (
                    <Typography
                        data-testid={`fjl-label-${props.id}`}
                        id={`fjl-label-${props.id}`}
                        sx={{ ...classes.text }}
                    >
                        {props.value}
                    </Typography>
                ),
                renderEditCell: props => {
                    const handleChange = e => {
                        props.api.setEditCellValue({ id: props.id, field: props.field, value: e.target.value });
                        setEditingLabel(e.target.value);
                    };
                    return (
                        <GridEditInputCell
                            {...props}
                            error={!props.value}
                            placeholder="This field is required"
                            onChange={handleChange}
                            sx={{
                                border: '1px solid transparent',
                                '&.Mui-error': {
                                    border: '1px solid red',
                                },
                            }}
                        />
                    );
                },
                preProcessEditCellProps: params => ({
                    ...params.props,
                    error: params.props.value === '',
                }),
                minWidth: 250,
                flex: 1,
                cellClassName: 'cell-styled',
            },
            {
                field: 'fjl_private',
                headerName: gridTxt.columns.private.title,
                editable: true,
                resizable: false,
                align: 'center',
                renderCell: props => (
                    <Typography
                        data-testid={`fjl-label-${props.id}`}
                        id={`fjl-label-${props.id}`}
                        sx={{ ...classes.text }}
                    >
                        {props.value && <Check />}
                    </Typography>
                ),
                renderEditCell: props => (
                    <Switch
                        checked={props.value}
                        textFieldId="fjl-private"
                        onChange={e =>
                            props.api.setEditCellValue({
                                id: props.id,
                                field: props.field,
                                value: e.target.checked,
                            })
                        }
                        sx={{ alignSelf: 'center' }}
                    />
                ),
                preProcessEditCellProps: params => ({
                    ...params.props,
                    error: params.props.value === '',
                }),
                maxWidth: 100,
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
                    const index = rows.findIndex(row => row.fjl_id === params.id);
                    if (isInEditMode || isDeleting) {
                        return [
                            <GridActionsCellItem
                                icon={<Check />}
                                label="Save"
                                sx={{ color: 'primary.main' }}
                                disabled={isInEditMode && !editingLabel.trim()}
                                onClick={!isDeleting ? handleSaveClick(params.id) : () => handleDeleteRow(params.id)}
                                data-testid={`favourite-search-list-item-${index}-save`}
                            />,
                            <GridActionsCellItem
                                icon={<Clear />}
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
                            icon={<Edit />}
                            label="Edit"
                            className="textPrimary"
                            onClick={handleEditClick(params.id)}
                            color="inherit"
                            data-testid={`favourite-search-list-item-${index}-edit`}
                            disabled={isAnyInEditMdode || isAnyDeleting}
                        />,
                        <GridActionsCellItem
                            icon={<Delete />}
                            label="Delete"
                            onClick={handleDeleteClick(params.id)}
                            color="inherit"
                            data-testid={`favourite-search-list-item-${index}-delete`}
                            disabled={isAnyInEditMdode || isAnyDeleting}
                        />,
                    ];
                },
            },
        ],
        [
            deleteRowId,
            editingLabel,
            gridTxt,
            handleCancelClick,
            handleDeleteClick,
            handleDeleteRow,
            handleEditClick,
            handleSaveClick,
            rowModesModel,
            rows,
        ],
    );

    const Toolbar = () => (
        <GridToolbarContainer sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            {error?.trim?.() && (
                <Typography
                    color="error"
                    variant="caption"
                    data-testid="journal-lists-error"
                    sx={{ flexGrow: 1, m: 1 }}
                >
                    {error}
                </Typography>
            )}
            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddClick}
                data-testid="favourite-search-list-add"
                disabled={
                    Object.values(rowModesModel).some(rowMode => rowMode.mode === GridRowModes.Edit) || !!deleteRowId
                }
            >
                {'Add new list'}
            </Button>
        </GridToolbarContainer>
    );

    if (loading && !hasLoadedOnce) {
        return <InlineLoader message={txt.loadingMessage} />;
    }

    return (
        <StandardPage title={txt.title}>
            {!!data && (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <div style={{ width: '100%' }}>
                            <Paper sx={{ padding: 2, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ flexGrow: 1 }}>
                                    <MuiDataGrid
                                        id="favourite-search-list"
                                        data-testid="favourite-search-list"
                                        rows={rows}
                                        getRowId={row => row.fjl_id}
                                        columns={columns}
                                        editMode="row"
                                        rowModesModel={rowModesModel}
                                        loading={gridLoading}
                                        onRowModesModelChange={handleRowModesModelChange}
                                        processRowUpdate={handleUpdateRow}
                                        onProcessRowUpdateError={error => console.error(error)}
                                        localeText={{ noRowsLabel: gridTxt.noRowsLabel }}
                                        slots={{ toolbar: Toolbar }}
                                        sx={{
                                            border: 0,
                                            '& .cell-styled': {
                                                lineHeight: 1.43,
                                                alignContent: 'center',
                                                ...classes.text,
                                            },
                                            '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
                                                outline: 'none !important',
                                            },
                                        }}
                                        disableDensitySelector
                                        disableColumnMenu
                                        disableColumnFilter
                                        disableColumnSelector
                                        disableSelectionOnClick
                                        disableRowSelectionOnClick
                                        disableVirtualization
                                    />
                                </div>
                            </Paper>
                        </div>
                    </Grid>
                </Grid>
            )}
        </StandardPage>
    );
};

export default React.memo(JournalLists);
