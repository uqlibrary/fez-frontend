import React, { useMemo } from 'react';
import Typography from '@mui/material/Typography';
import { ExternalLink } from '../SharedComponents/ExternalLink';
import { GridActionsCellItem, GridEditInputCell, GridRowModes } from '@mui/x-data-grid';
import Clear from '@mui/icons-material/Clear';
import Check from '@mui/icons-material/Check';
import Switch from '@mui/material/Switch';
import { pathConfig } from '../../config';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';

export const classes = {
    text: {
        lineHeight: 1.43,
    },
};

const createListUrl = id =>
    `${pathConfig.journals.search}?${encodeURI(`activeFacets[filters][UserList]=${id}&keywords[Keyword-all-journals][type]=Keyword&keywords[Keyword-all-journals][text]=all+journals&keywords[Keyword-all-journals][id]=Keyword-all-journals&keywords[Keyword-all-journals][operand]=AND#/journals/search/?keywords[Keyword-all-journals][type]=Keyword&keywords[Keyword-all-journals][text]=all+journals&keywords[Keyword-all-journals][id]=Keyword-all-journals&keywords[Keyword-all-journals][operand]=AND`)}`;

export const useColumns = ({
    txt,
    deleteRowId,
    editingLabel,
    setEditingLabel,
    handleCancelClick,
    handleDeleteClick,
    handleDeleteRow,
    handleEditClick,
    handleSaveClick,
    rowModesModel,
    rows,
}) =>
    useMemo(
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
                headerName: txt.columns.label.title,
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
                field: 'fjl_ids',
                headerName: 'Items',
                editable: false,
                resizable: false,
                align: 'center',
                renderCell: props => (
                    <Typography data-testid={`fjl-id-${props.id}`} id={`fjl-id-${props.id}`} sx={{ ...classes.text }}>
                        {(props.value || []).length}
                    </Typography>
                ),
                width: 80,
                cellClassName: 'cell-styled',
            },
            {
                field: 'fjl_private',
                headerName: txt.columns.private.title,
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
                    const isAnyInEditMode = Object.values(rowModesModel).some(
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
                            disabled={isAnyInEditMode || isAnyDeleting}
                        />,
                        <GridActionsCellItem
                            icon={<Delete />}
                            label="Delete"
                            onClick={handleDeleteClick(params.id)}
                            color="inherit"
                            data-testid={`favourite-search-list-item-${index}-delete`}
                            disabled={isAnyInEditMode || isAnyDeleting}
                        />,
                    ];
                },
            },
        ],
        [
            txt,
            deleteRowId,
            editingLabel,
            setEditingLabel,
            handleCancelClick,
            handleDeleteClick,
            handleDeleteRow,
            handleEditClick,
            handleSaveClick,
            rowModesModel,
            rows,
        ],
    );
