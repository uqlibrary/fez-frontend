import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router';
import {
    GridActionsCellItem,
    GridEditInputCell,
    GridRowModes,
    GridRowModesModel,
    GridColDef,
    GridRenderCellParams,
    GridRenderEditCellParams,
    GridPreProcessEditCellProps,
} from '@mui/x-data-grid';
import Clear from '@mui/icons-material/Clear';
import Check from '@mui/icons-material/Check';
import Switch from '@mui/material/Switch';
import { APP_URL, pathConfig } from '../../config';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import { Row } from './useGridHook';
import { locale } from 'locale';
import FormatListBulleted from '@mui/icons-material/FormatListBulleted';
import Share from '@mui/icons-material/Share';
import Visibility from '@mui/icons-material/Visibility';
import Done from '@mui/icons-material/Done';
import Grid from '@mui/material/Grid';
import classNames from 'classnames';

interface UseColumnsParams {
    txt: typeof locale.components.journalUserLists.grid;
    deleteRowId: number | null;
    editingLabel: string;
    setEditingLabel: (value: string) => void;
    onCancelClick: (id: number) => () => void;
    onDeleteClick: (id: number) => () => void;
    handleDeleteRow: (id: number) => void;
    onShareListClick: (url: string) => void;
    onEditClick: (id: number) => () => void;
    onSaveClick: (id: number) => () => void;
    rowModesModel: GridRowModesModel;
    rows: Row[];
}

export const createListUrl = (id: string | number) =>
    `${pathConfig.journals.search}?${encodeURI(`activeFacets[filters][ShowFavouritedOnly]=${id}&keywords[Keyword-all-journals][type]=Keyword&keywords[Keyword-all-journals][text]=all+journals&keywords[Keyword-all-journals][id]=Keyword-all-journals&keywords[Keyword-all-journals][operand]=AND#/journals/search/?activeFacets[filters][ShowFavouritedOnly]=true&page=1&keywords[Keyword-all-journals][type]=Keyword&keywords[Keyword-all-journals][text]=all+journals&keywords[Keyword-all-journals][id]=Keyword-all-journals&keywords[Keyword-all-journals][operand]=AND`)}`;

export const createListSharingUrl = (id: string | number) =>
    `${APP_URL.replace(/\/#?\/?$/, window.location.hash ? /* istanbul ignore next */ '/#' : '')}${createListUrl(id)}`;

export const useColumns = ({
    txt,
    deleteRowId,
    editingLabel,
    setEditingLabel,
    onCancelClick,
    onDeleteClick,
    handleDeleteRow,
    onShareListClick,
    onEditClick,
    onSaveClick,
    rowModesModel,
    rows,
}: UseColumnsParams): GridColDef[] => {
    const navigate = useNavigate();
    const isAnyInEditMode = Object.values(rowModesModel).some(rowMode => rowMode.mode === GridRowModes.Edit);

    return useMemo(
        () => [
            {
                field: 'label',
                headerName: txt.columns.label.title,
                editable: true,
                resizable: false,
                renderCell: (props: GridRenderCellParams) => (
                    <span data-testid={`fjl-label-${props.id}`}>{props.value}</span>
                ),
                renderEditCell: (props: GridRenderEditCellParams) => {
                    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                        props.api.setEditCellValue({ id: props.id, field: props.field, value: e.target.value });
                        setEditingLabel(e.target.value);
                    };
                    return (
                        <GridEditInputCell
                            {...props}
                            error={!props.value}
                            placeholder="This field is required"
                            onChange={handleChange}
                            data-testid={`fjl-label-${props.id}`}
                            inputProps={{
                                'data-testid': `fjl-label-${props.id}-input`,
                                maxLength: 255,
                            }}
                            sx={{
                                border: '1px solid transparent',
                                '&.Mui-error': {
                                    border: '1px solid red',
                                },
                            }}
                        />
                    );
                },
                preProcessEditCellProps: (params: GridPreProcessEditCellProps) => ({
                    ...params.props,
                    error: params.props.value === '',
                }),
                minWidth: 250,
                flex: 1,
                cellClassName: 'cell-styled',
            },
            {
                field: 'is_public',
                headerName: txt.columns.isPublic.title,
                editable: true,
                resizable: false,
                headerAlign: 'center',
                align: 'center',
                renderCell: (props: GridRenderCellParams) => (
                    <span data-testid={`fjl-is-public-${props.id}`}>{(props.value && <Done />) || '-'}</span>
                ),
                renderEditCell: (props: GridRenderEditCellParams) => (
                    <Switch
                        checked={props.value}
                        data-testid={`fjl-is-public-${props.id}-input`}
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
                maxWidth: 110,
                flex: 1,
                cellClassName: 'cell-styled',
            },
            {
                field: 'id',
                headerName: txt.columns.links.title,
                editable: false,
                sortable: false,
                resizable: false,
                headerAlign: 'center',
                align: 'center',
                renderCell: (props: GridRenderCellParams) => {
                    const disabled = isAnyInEditMode || deleteRowId;
                    const isSharable = props.row.is_public;
                    const url = disabled ? '' : createListUrl(props.value);
                    const viewDisabled = disabled;
                    const shareDisabled = disabled || !isSharable;

                    return (
                        <span>
                            <Grid spacing={3} container alignItems="center" justifyContent="center" sx={{ pt: 1 }}>
                                <Link
                                    title={txt.columns.links.view.title}
                                    aria-label={txt.columns.links.view.title}
                                    data-testid={`fjl-view-link-${props.id}`}
                                    to={viewDisabled ? '' : url}
                                    className={classNames('fjl-link', { disabled: viewDisabled })}
                                >
                                    <Visibility style={{ width: 16 }} />
                                </Link>
                                <Link
                                    title={shareDisabled ? '' : txt.columns.links.sharable.title}
                                    aria-label={txt.columns.links.sharable.title}
                                    data-testid={`fjl-sharable-link-${props.id}`}
                                    to={shareDisabled ? '' : url}
                                    className={classNames('fjl-link', { disabled: shareDisabled })}
                                    onClick={e => {
                                        e.preventDefault();
                                        if (shareDisabled) return;
                                        onShareListClick(createListSharingUrl(props.value));
                                    }}
                                >
                                    <Share style={{ width: 16 }} />
                                </Link>
                            </Grid>
                        </span>
                    );
                },
                width: 100,
                cellClassName: 'cell-styled',
            },
            {
                field: 'actions',
                type: 'actions',
                headerName: 'Actions',
                width: 110,
                cellClassName: 'cell-styled',
                getActions: params => {
                    const rowId = params.id as number;
                    const index = rows.findIndex(row => row.id === rowId);

                    const isInEditMode = rowModesModel[rowId]?.mode === GridRowModes.Edit;
                    const isDeleting = rowId === deleteRowId;

                    if (isInEditMode || isDeleting) {
                        return [
                            <GridActionsCellItem
                                icon={<Check />}
                                title={isDeleting ? 'Delete' : 'Save'}
                                label={isDeleting ? 'Delete' : 'Save'}
                                sx={{ color: 'primary.main' }}
                                disabled={isInEditMode && !editingLabel.trim()}
                                onClick={!isDeleting ? onSaveClick(rowId) : () => handleDeleteRow(rowId)}
                                data-testid={`journal-user-lists-item-${index}-save`}
                            />,
                            <GridActionsCellItem
                                icon={<Clear />}
                                title="Cancel"
                                label="Cancel"
                                className="textPrimary"
                                onClick={onCancelClick(rowId)}
                                color="inherit"
                                data-testid={`journal-user-lists-item-${index}-cancel`}
                            />,
                        ];
                    }

                    const isAnyDeleting = !!deleteRowId;
                    return [
                        <GridActionsCellItem
                            icon={<FormatListBulleted />}
                            title={txt.columns.actions.items.title}
                            label="items"
                            onClick={() => navigate(pathConfig.journals.favourites(String(rowId)))}
                            color="inherit"
                            data-testid={`journal-user-lists-item-${index}-items`}
                            disabled={isAnyInEditMode || isAnyDeleting}
                        />,
                        <GridActionsCellItem
                            icon={<Edit />}
                            title={txt.columns.actions.edit.title}
                            label="edit"
                            className="textPrimary"
                            onClick={onEditClick(rowId)}
                            color="inherit"
                            data-testid={`journal-user-lists-item-${index}-edit`}
                            disabled={isAnyInEditMode || isAnyDeleting}
                        />,
                        <GridActionsCellItem
                            icon={<Delete />}
                            title={txt.columns.actions.delete.title}
                            label="delete"
                            onClick={onDeleteClick(rowId)}
                            color="inherit"
                            data-testid={`journal-user-lists-item-${index}-delete`}
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
            onCancelClick,
            onDeleteClick,
            handleDeleteRow,
            onEditClick,
            onSaveClick,
            rowModesModel,
            rows,
        ],
    );
};
