import React, { useMemo } from 'react';
import Typography from '@mui/material/Typography';
import { ExternalLink } from '../SharedComponents/ExternalLink';
import { Link } from 'react-router';
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
import { pathConfig } from '../../config';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import { Row } from './useGridHook';
import { locale } from 'locale';
import { FormatListBulleted, Public } from '@mui/icons-material';
import { JOURNAL_FAVOURITE_LIST_ID } from 'config/general';

const createListUrl = (id: string) =>
    `${pathConfig.journals.search}?${encodeURI(`activeFacets[filters][UserList]=${id}&keywords[Keyword-all-journals][type]=Keyword&keywords[Keyword-all-journals][text]=all+journals&keywords[Keyword-all-journals][id]=Keyword-all-journals&keywords[Keyword-all-journals][operand]=AND#/journals/search/?keywords[Keyword-all-journals][type]=Keyword&keywords[Keyword-all-journals][text]=all+journals&keywords[Keyword-all-journals][id]=Keyword-all-journals&keywords[Keyword-all-journals][operand]=AND`)}`;

interface UseColumnsParams {
    txt: typeof locale.components.journalUserLists.grid;
    deleteRowId: number | null;
    editingLabel: string;
    setEditingLabel: (value: string) => void;
    onCancelClick: (id: number) => () => void;
    onDeleteClick: (id: number) => () => void;
    handleDeleteRow: (id: number) => void;
    onEditClick: (id: number) => () => void;
    onSaveClick: (id: number) => () => void;
    rowModesModel: GridRowModesModel;
    rows: Row[];
}

export const useColumns = ({
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
}: UseColumnsParams): GridColDef[] =>
    useMemo(
        () => [
            {
                field: 'fjl_id',
                headerName: txt.columns.link.title,
                editable: false,
                sortable: false,
                resizable: false,
                align: 'center',
                renderCell: (props: GridRenderCellParams) => (
                    <Typography data-testid={`fjl-id-${props.id}`}>
                        <ExternalLink id={String(props.id)} href={createListUrl(props.value)} children={undefined} />
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
                            data-testid={`fjl-label-${props.id}-input`}
                            inputProps={{ maxLength: 255 }}
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
                field: 'fjl_is_public',
                headerName: txt.columns.isPublic.title,
                editable: true,
                resizable: false,

                align: 'center',
                renderCell: (props: GridRenderCellParams) => (
                    <span data-testid={`fjl-label-${props.id}`}>{props.value && <Public />}</span>
                ),
                renderEditCell: (props: GridRenderEditCellParams) => (
                    <Switch
                        checked={props.value}
                        data-testid={`fjl-is-public${props.id}`}
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
                preProcessEditCellProps: (params: GridPreProcessEditCellProps) => ({
                    ...params.props,
                    error: params.props.value === '',
                }),
                maxWidth: 110,
                flex: 1,
                cellClassName: 'cell-styled',
            },
            {
                field: 'link_to_items',
                headerName: txt.columns.items.title,
                editable: false,
                resizable: false,
                sortable: false,
                align: 'center',
                renderCell: props => (
                    <span data-testid={`fjl-items-${props.id}`}>
                        <Link
                            target="user-list-tab"
                            title={txt.columns.items.link.title}
                            to={
                                props.row.fjl_label === JOURNAL_FAVOURITE_LIST_ID
                                    ? pathConfig.journals.favourites
                                    : pathConfig.journals.list(String(props.id), props.row.fjl_label)
                            }
                        >
                            <FormatListBulleted />
                        </Link>
                    </span>
                ),
                width: 80,
                cellClassName: 'cell-styled',
            },
            {
                field: 'actions',
                type: 'actions',
                headerName: 'Actions',
                width: 96,
                cellClassName: 'cell-styled',
                getActions: params => {
                    const rowId = params.id as number;
                    const isAnyInEditMode = Object.values(rowModesModel).some(
                        rowMode => rowMode.mode === GridRowModes.Edit,
                    );
                    const isAnyDeleting = !!deleteRowId;
                    const isInEditMode = rowModesModel[rowId]?.mode === GridRowModes.Edit;
                    const isDeleting = rowId === deleteRowId;
                    const index = rows.findIndex(row => row.fjl_id === rowId);
                    if (isInEditMode || isDeleting) {
                        return [
                            <GridActionsCellItem
                                icon={<Check />}
                                label="Save"
                                sx={{ color: 'primary.main' }}
                                disabled={isInEditMode && !editingLabel.trim()}
                                onClick={!isDeleting ? onSaveClick(rowId) : () => handleDeleteRow(rowId)}
                                data-testid={`journal-user-lists-item-${index}-save`}
                            />,
                            <GridActionsCellItem
                                icon={<Clear />}
                                label="Cancel"
                                className="textPrimary"
                                onClick={onCancelClick(rowId)}
                                color="inherit"
                                data-testid={`journal-user-lists-item-${index}-cancel`}
                            />,
                        ];
                    }

                    return [
                        <GridActionsCellItem
                            icon={<Edit />}
                            label="Edit"
                            className="textPrimary"
                            onClick={onEditClick(rowId)}
                            color="inherit"
                            data-testid={`journal-user-lists-item-${index}-edit`}
                            disabled={isAnyInEditMode || isAnyDeleting}
                        />,
                        <GridActionsCellItem
                            icon={<Delete />}
                            label="Delete"
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
