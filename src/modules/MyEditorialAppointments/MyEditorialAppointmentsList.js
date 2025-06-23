/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import moment from 'moment';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import {
    GridRowModes,
    DataGrid,
    GridActionsCellItem,
    useGridApiRef,
    GridToolbarContainer,
    useGridApiContext,
} from '@mui/x-data-grid';

import { tableIcons } from './MyEditorialAppointmentsListIcons';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { TextField as SharedTextField } from 'modules/SharedComponents/Toolbox/TextField';
import { RoleField, JournalIdField } from 'modules/SharedComponents/LookupFields';
import { default as locale } from 'locale/components';

import {
    EDITORIAL_APPOINTMENT_MAX_YEAR,
    EDITORIAL_APPOINTMENT_MIN_YEAR,
    EDITORIAL_ROLE_MAP,
    EDITORIAL_ROLE_OPTIONS,
    EDITORIAL_ROLE_OTHER,
} from 'config/general';

import { useDataGrid } from 'hooks';
import { NEWROWID } from 'hooks/useDataGrid';

const classes = {
    h6text: {
        display: 'block',
        marginBlockStart: 0,
        marginBlockEnd: 0,
        marginInlineStart: 0,
        marginInlineEnd: 0,
        fontWeight: 400,
        fontSize: 20,
    },
};

const StyledToolbar = styled(Typography)(() => ({
    margin: '8px',
    cursor: 'pointer',
    flexDirection: 'column',
    gridColumn: 2,
}));

export const CustomToolbar = props => {
    return (
        <StyledToolbar
            variant="h6"
            align="center"
            onClick={() => {
                props.onChange(moment(new Date(), 'YYYY'));
            }}
            id="eap-end-year-current"
            data-testid="eap-end-year-current"
        >
            {locale.components.myEditorialAppointmentsList.form.locale.endYearCurrentYearLabel}
        </StyledToolbar>
    );
};

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        minWidth: '120px',
    },
}));

const StyledResponsiveWrapper = styled('div')(({ theme }) => ({
    padding: 2,
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('md')]: {
        '& [class*="MuiToolbar-root"]': {
            padding: 0,
            display: 'block',
            marginBlockEnd: '12px',

            '& > div:first-of-type': {
                display: 'none',
            },
        },

        '& [class*="MuiTable-root"]': {
            '& thead': {
                display: 'none',
            },

            '& tr[class*="MuiTableRow-root"]': {
                display: 'block',
                width: '100%',
                boxSizing: 'border-box',

                '& td[class*="MuiTableCell-root"]:last-of-type': {
                    display: 'block',
                    clear: 'both',
                    width: '100% !important',
                    boxSizing: 'border-box',
                },
            },
            '& tr[class*="MuiTableRow-root"]:not(:last-of-type)': {
                marginBottom: '12px',
            },
        },

        '& button#my-editorial-appointments-add-new-editorial-appointment': {
            width: '100%',
        },
    },
}));

const CustomEditCell = ({ children, ...props }) => {
    const apiRef = useGridApiContext();

    useLayoutEffect(() => {
        if (props.hasFocus) {
            apiRef.current.setCellFocus(props.id, props.field);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (props.row?.isNew) {
            apiRef.current.setEditCellValue({ id: props.id, field: props.field, value: '' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <>{children}</>;
};

export const MyEditorialAppointmentsList = ({ disabled, handleRowAdd, handleRowDelete, handleRowUpdate, list }) => {
    const theme = useTheme();
    const matchesMd = useMediaQuery(theme.breakpoints.up('md'));
    const apiRef = useGridApiRef();
    const rowIdentifier = 'eap_id';

    const {
        header: {
            columns: { journalName, role, startYear, endYear },
        },
        form: {
            locale: {
                journalNameLabel,
                journalNameHint,
                editorialRoleLabel,
                editorialRoleHint,
                otherRoleLabel,
                otherRoleHint,
                startYearLabel,
                endYearLabel,
                endYearHint,
                endYearErrorMessage,
                addButtonTooltip,
                editButtonTooltip,
                deleteButtonTooltip,
            },
        },
        row: {
            locale: { deleteConfirmLabel },
            noRowsLabel,
        },
    } = locale.components.myEditorialAppointmentsList;

    const _handleRowAdd = useCallback(
        (newData, oldData) => {
            delete newData.isNew; // Remove isNew flag before sending to the server
            delete newData.eap_id; // Remove eap_id if it exists, as it will be generated by the server
            return handleRowAdd(newData)
                .then(data => {
                    return new Promise(resolve => {
                        resolve(data);
                    });
                })
                .catch(() => {
                    return oldData;
                });
        },
        [handleRowAdd],
    );
    const _handleRowUpdate = useCallback(
        (newData, oldData) =>
            handleRowUpdate(newData, oldData)
                .then(() => {
                    return new Promise(resolve => {
                        resolve(newData);
                    });
                })
                .catch(() => {
                    return oldData;
                }),
        [handleRowUpdate],
    );

    const _handleRowDelete = useCallback(
        ({ rows, rowToDelete, rowIdentifier }) => {
            if (!rowToDelete?.isNew) {
                return handleRowDelete(rowToDelete)
                    .then(() => {
                        return new Promise(resolve => {
                            const newRows = rows.filter(row => row[rowIdentifier] !== rowToDelete[rowIdentifier]);
                            console.log('newRows', newRows);
                            resolve(newRows);
                        });
                    })
                    .catch(() => {
                        return rows;
                    });
            } else {
                return new Promise(resolve => {
                    resolve(rows);
                });
            }
        },

        [handleRowDelete],
    );

    const {
        loading,
        deleteRowId,
        rows,
        rowModesModel,
        addNewRow,
        handleUpdateRow,
        handleDeleteRow,
        handleRowModesModelChange,
        handleEditClick,
        handleSaveClick,
        handleDeleteClick,
        handleCancelClick,
    } = useDataGrid({
        list,
        handleRowAdd: _handleRowAdd,
        handleRowUpdate: _handleRowUpdate,
        handleRowDelete: _handleRowDelete,
    });

    const EditToolbar = props => {
        const { apiRef } = props;

        const handleClick = async () => {
            const id = NEWROWID;
            addNewRow({
                [rowIdentifier]: id,
                eap_journal_name: '',
                eap_jnl_id: '',
                eap_role_cvo_id: '',
                eap_start_year: '',
                eap_end_year: '',
            });
            apiRef.current.startRowEditMode({ id, fieldToFocus: 'eap_journal_name' });
        };

        return (
            <GridToolbarContainer>
                <Button
                    id="my-editorial-appointments-add-new-editorial-appointment"
                    data-testid="my-editorial-appointments-add-new-editorial-appointment"
                    variant="contained"
                    color="primary"
                    onClick={handleClick}
                >
                    {addButtonTooltip}
                </Button>
            </GridToolbarContainer>
        );
    };

    const columns = [
        {
            field: 'eap_journal_name',
            headerName: journalName.title,
            headerClassName: 'header-styled',
            editable: true,
            renderCell: params => {
                const index = rows.findIndex(row => row[rowIdentifier] === params.id);
                if (!!deleteRowId && params.row[rowIdentifier] === deleteRowId) {
                    console.log('deleteRowId', deleteRowId);
                    return (
                        <Typography
                            data-testid={`delete-row-${index}`}
                            id={`delete-row-${index}`}
                            sx={{ ...classes.h6text }}
                            component={'h6'}
                        >
                            {deleteConfirmLabel}
                        </Typography>
                    );
                }

                return (
                    <Typography
                        variant="body2"
                        data-testid={`eap-journal-name-${params.id}`}
                        id={`eap-journal-name-${params.id}`}
                    >
                        {params.value}
                    </Typography>
                );
            },
            renderEditCell: params => {
                return (
                    <CustomEditCell {...params}>
                        <JournalIdField
                            autoFocus
                            journalIdFieldId="eap-journal-name"
                            value={
                                !!params.row.eap_jnl_id
                                    ? { id: params.row.eap_jnl_id, value: params.value }
                                    : { value: params.value }
                            }
                            onChange={async selectedItem => {
                                await params.api.updateRows([
                                    {
                                        ...params.row,
                                        eap_jnl_id: selectedItem?.jnl_jid,
                                    },
                                ]);
                                await params.api.setEditCellValue({
                                    id: params.id,
                                    field: params.field,
                                    value: selectedItem?.jnl_title || selectedItem?.value,
                                });
                            }}
                            error={(params.row.eap_journal_name || '').length === 0}
                            label={journalNameLabel}
                            placeholder={journalNameHint}
                            required
                            fullWidth
                            allowFreeText
                            clearOnInputClear
                            floatingLabelText="Journal name"
                        />
                    </CustomEditCell>
                );
            },
            preProcessEditCellProps: params => {
                return {
                    ...params.props,
                    error: !(!!params.props.value && params.props.value !== ''),
                };
            },
            cellClassName: () => 'cell-styled',
            flex: 3,
            colSpan: (value, row) => {
                if (row[rowIdentifier] === deleteRowId) return 4;
                return undefined;
            },
        },
        {
            field: 'eap_role_cvo_id',
            headerName: role.title,
            headerClassName: 'header-styled',
            editable: true,
            renderCell: params => (
                <Typography
                    variant="body2"
                    id={`eap-role-name-${params.id}`}
                    data-testid={`eap-role-name-${params.id}`}
                >
                    {`${EDITORIAL_ROLE_MAP[params.row.eap_role_cvo_id]}${
                        !!params.value ? ' (' + params.value + ')' : ''
                    }`}
                </Typography>
            ),
            renderEditCell: params => {
                return (
                    <CustomEditCell {...params}>
                        <RoleField
                            autoCompleteSelectFieldId="eap-role-cvo-id"
                            fullWidth
                            clearable
                            key={`eap-role-${params.value}`}
                            id="eap-role-cvo-id"
                            floatingLabelText={editorialRoleLabel}
                            hintText={editorialRoleHint}
                            onChange={async selectedItem => {
                                await params.api.updateRows([
                                    {
                                        ...params.row,
                                        eap_role_name: null,
                                    },
                                ]);

                                params.api.setEditCellValue({
                                    id: params.id,
                                    field: params.field,
                                    value: selectedItem,
                                });
                            }}
                            onClear={async () => {
                                await params.api.updateRows([
                                    {
                                        ...params.row,
                                        eap_role_name: null,
                                    },
                                ]);

                                params.api.setEditCellValue({
                                    id: params.id,
                                    field: params.field,
                                    value: null,
                                });
                            }}
                            itemsList={EDITORIAL_ROLE_OPTIONS}
                            required
                            autoComplete="off"
                            error={!params.value}
                            value={
                                !!params.value
                                    ? {
                                          value: String(params.value),
                                          text: EDITORIAL_ROLE_MAP[String(params.value)],
                                      }
                                    : null
                            }
                        />
                        {String(params.value) === EDITORIAL_ROLE_OTHER && (
                            <SharedTextField
                                value={apiRef.current.getCellValue(params.id, 'eap_role_name') || ''}
                                onChange={async e => {
                                    await params.api.updateRows([
                                        {
                                            ...params.row,
                                            eap_role_name: e.target.value,
                                        },
                                    ]);
                                    await params.api.setEditCellValue({
                                        id: params.id,
                                        field: params.field,
                                        value: EDITORIAL_ROLE_OTHER,
                                    });
                                }}
                                textFieldId="eap-role-name"
                                error={!apiRef.current.getCellValue(params.id, 'eap_role_name')}
                                label={otherRoleLabel}
                                placeholder={otherRoleHint}
                                required
                                fullWidth
                            />
                        )}
                    </CustomEditCell>
                );
            },
            preProcessEditCellProps: params => {
                const eapRoleName = apiRef.current.getRowWithUpdatedValues(params.id, '').eap_role_name;
                return {
                    ...params.props,
                    error: !(
                        !!params.props.value &&
                        (String(params.props.value) === EDITORIAL_ROLE_OTHER ? !!eapRoleName : true)
                    ),
                };
            },
            cellClassName: () => 'cell-styled',
            flex: 2,
        },
        {
            field: 'eap_start_year',
            headerName: startYear.title,
            headerClassName: 'header-styled',
            editable: true,
            renderCell: params => (
                <Typography
                    variant="body2"
                    id={`eap-start-year-${params.id}`}
                    data-testid={`eap-start-year-${params.id}`}
                >
                    {params.value}
                </Typography>
            ),
            renderEditCell: params => {
                return (
                    <CustomEditCell {...params}>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <StyledDatePicker
                                value={(!!params.value && moment(String(params.value), 'YYYY')) || null}
                                onChange={async value => {
                                    await params.api.setEditCellValue({
                                        id: params.id,
                                        field: params.field,
                                        value: (!!value && value.format('YYYY')) || null,
                                    });
                                }}
                                views={['year']}
                                openTo="year"
                                disableFuture
                                slotProps={{
                                    textField: ownerState => {
                                        const value = ownerState.value ?? /* istanbul ignore next */ null;
                                        return {
                                            inputProps: {
                                                id: 'eap-start-year-input',
                                                'data-testid': 'eap-start-year-input',
                                                label: startYearLabel,
                                                'aria-label': startYearLabel,
                                                'aria-labelledby': 'eap-start-year-label',
                                            },
                                            id: 'eap-start-year',
                                            variant: 'standard',
                                            required: true,
                                            label: startYearLabel,
                                            InputLabelProps: {
                                                id: 'eap-start-year-label',
                                                'data-testid': 'eap-start-year-label',
                                                htmlFor: 'eap-start-year-input',
                                            },
                                            error:
                                                !value ||
                                                !moment(String(value), 'YYYY').isValid() ||
                                                !moment(String(value), 'YYYY').isSameOrBefore(moment(), 'year'),
                                        };
                                    },
                                }}
                            />
                        </LocalizationProvider>
                    </CustomEditCell>
                );
            },
            preProcessEditCellProps: params => {
                const startYearMoment = moment(String(params.props.value), 'YYYY');
                return {
                    ...params.props,
                    error: !(
                        startYearMoment.isValid() &&
                        startYearMoment.isSameOrBefore(moment(), 'year') &&
                        startYearMoment.isSameOrAfter(moment(EDITORIAL_APPOINTMENT_MIN_YEAR, 'YYYY'))
                    ),
                };
            },
            cellClassName: 'cell-styled',
            flex: 1,
        },
        {
            field: 'eap_end_year',
            headerName: endYear.title,
            headerClassName: 'header-styled',
            editable: true,
            renderCell: params => (
                <Typography variant="body2" id={`eap-end-year-${params.id}`} data-testid={`eap-end-year-${params.id}`}>
                    {moment(String(params.value), 'YYYY').format('YYYY') === moment(new Date()).format('YYYY')
                        ? locale.components.myEditorialAppointmentsList.form.locale.endYearCurrentYearLabel
                        : params.value}
                </Typography>
            ),
            renderEditCell: ({ value, row, ...params }) => {
                const minDate = new Date();
                minDate.setFullYear(parseInt(row.eap_start_year, 10));
                minDate.setDate(1);
                minDate.setMonth(0);
                return (
                    <CustomEditCell {...params}>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <StyledDatePicker
                                value={(!!value && moment(String(value), 'YYYY')) || null}
                                onChange={async value => {
                                    await params.api.setEditCellValue({
                                        id: params.id,
                                        field: params.field,
                                        value: (!!value && value.format('YYYY')) || null,
                                    });
                                }}
                                {...((!!value &&
                                    moment(String(value), 'YYYY').format('YYYY') === moment().format('YYYY') && {
                                        format: `[${locale.components.myEditorialAppointmentsList.form.locale.endYearCurrentYearLabel}]`,
                                    }) ||
                                    {})}
                                views={['year']}
                                openTo="year"
                                closeOnSelect
                                minDate={minDate && moment(minDate)}
                                slots={{
                                    toolbar: CustomToolbar,
                                }}
                                slotProps={{
                                    openPickerButton: {
                                        id: 'eap-end-year-button-input',
                                        'data-testid': 'eap-end-year-button-input',
                                    },
                                    toolbar: {
                                        hidden: false,
                                    },
                                    textField: ownerState => {
                                        const displayValue = ownerState.value ?? /* istanbul ignore next */ null;
                                        return {
                                            inputProps: {
                                                id: 'eap-end-year-input',
                                                'data-testid': 'eap-end-year-input',
                                                label: endYearLabel,
                                                'aria-label': endYearLabel,
                                                'aria-labelledby': 'eap-end-year-label',
                                                placeholder: endYearHint,
                                            },
                                            value: displayValue,
                                            id: 'eap-end-year',
                                            variant: 'standard',
                                            required: true,
                                            helperText:
                                                !!value &&
                                                (!moment(String(value), 'YYYY').isValid() ||
                                                    moment(String(value), 'YYYY').isBefore(
                                                        moment(String(row.eap_start_year), 'YYYY'),
                                                    ))
                                                    ? endYearErrorMessage
                                                    : '',
                                            label: endYearLabel,
                                            InputLabelProps: {
                                                id: 'eap-end-year-label',
                                                'data-testid': 'eap-end-year-label',
                                                htmlFor: 'eap-end-year-input',
                                            },
                                            error:
                                                !moment(String(value), 'YYYY').isValid() ||
                                                moment(String(value), 'YYYY').isBefore(
                                                    moment(String(row.eap_start_year), 'YYYY'),
                                                ),
                                        };
                                    },
                                }}
                            />
                        </LocalizationProvider>
                    </CustomEditCell>
                );
            },
            preProcessEditCellProps: params => {
                const endYearMoment = moment(String(params.props.value), 'YYYY');
                return {
                    ...params.props,
                    error: !(
                        endYearMoment.isValid() &&
                        endYearMoment.isSameOrBefore(moment(EDITORIAL_APPOINTMENT_MAX_YEAR, 'YYYY')) &&
                        endYearMoment.isSameOrAfter(
                            moment(String(params.otherFieldsProps.eap_start_year.value), 'YYYY'),
                        )
                    ),
                };
            },
            cellClassName: 'cell-styled',
            flex: 1,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 96,
            cellClassName: 'cell-styled',
            getActions: params => {
                // console.log(params);
                const isAnyInEditMdode = Object.values(rowModesModel).some(
                    rowMode => rowMode.mode === GridRowModes.Edit,
                );
                const isAnyDeleting = !!deleteRowId;
                const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
                const isDeleting = params.id === deleteRowId;
                const index = rows.findIndex(row => row[rowIdentifier] === params.id);
                if (isInEditMode || isDeleting) {
                    return [
                        <GridActionsCellItem
                            icon={<tableIcons.Check />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={
                                !isDeleting
                                    ? handleSaveClick(params.id)
                                    : handleDeleteRow(params.id, rows, rowIdentifier)
                            }
                            data-testid={`my-editorial-appointments-list-row-${index}-save`}
                        />,
                        <GridActionsCellItem
                            icon={<tableIcons.Clear />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick({ apiRef, params })}
                            color="inherit"
                            data-testid={`my-editorial-appointments-list-row-${index}-cancel`}
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
                        data-testid={`my-editorial-appointments-list-row-${index}-edit`}
                        disabled={isAnyInEditMdode || isAnyDeleting}
                    />,
                    <GridActionsCellItem
                        icon={<tableIcons.Delete />}
                        label="Delete"
                        onClick={handleDeleteClick(params.id)}
                        color="inherit"
                        data-testid={`my-editorial-appointments-list-row-${index}-delete`}
                        disabled={isAnyInEditMdode || isAnyDeleting}
                    />,
                ];
            },
        },
    ];
    return (
        <StyledResponsiveWrapper id="my-editorial-appointments-list" data-testid="my-editorial-appointments-list">
            <DataGrid
                apiRef={apiRef}
                id="favourite-search-list"
                data-testid="favourite-search-list"
                rows={rows}
                getRowId={row => row[rowIdentifier]}
                getRowHeight={() => 'auto'}
                columns={columns}
                loading={loading}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                processRowUpdate={handleUpdateRow}
                localeText={{ noRowsLabel }}
                slots={{
                    toolbar: EditToolbar,
                    footer: () => <></>,
                }}
                slotProps={{
                    toolbar: { apiRef },
                }}
                sx={theme => ({
                    border: 0,
                    '& .cell-styled': {
                        alignContent: 'center',
                        padding: 2,
                        flexDirection: 'column',
                        ...classes.text,
                        '&.MuiDataGrid-cell--editing': {
                            paddingY: 1,
                            paddingX: 2,
                        },
                    },
                    '& .header-styled': {
                        ...theme.typography.caption,
                        ...theme.palette.secondary.main,
                        paddingY: 1,
                        paddingX: 2,
                    },
                    '& .row-error-styled': {
                        borderLeft: '4px solid red',
                    },
                    '& .MuiDataGrid-toolbarContainer': {
                        justifyContent: 'flex-end',
                    },
                })}
                getRowClassName={params =>
                    moment(String(params.row.eap_end_year), 'YYYY').isBefore(moment(), 'year') && 'row-error-styled'
                }
                onCellEditStop={(params, event) => {
                    event.defaultMuiPrevented = true;
                }}
                onRowEditStop={(params, event) => {
                    // if (event.reason === GridCellEditStopReasons.cellFocusOut) {
                    event.defaultMuiPrevented = true;
                    //  }
                }}
                onProcessRowUpdateError={error => {
                    console.error('Error processing row update:', error);
                }}
                disableColumnResize
                disableColumnMenu
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                disableSelectionOnClick
                disableRowSelectionOnClick
                disableVirtualization
            />
        </StyledResponsiveWrapper>
    );
};

MyEditorialAppointmentsList.propTypes = {
    disabled: PropTypes.bool,
    handleRowAdd: PropTypes.func,
    handleRowUpdate: PropTypes.func,
    handleRowDelete: PropTypes.func,
    list: PropTypes.array,
};

export default React.memo(MyEditorialAppointmentsList);
