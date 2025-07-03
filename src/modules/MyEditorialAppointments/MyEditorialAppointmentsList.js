/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

// eslint-disable-next-line camelcase
import { MaterialReactTable, useMaterialReactTable, MRT_EditActionButtons } from 'material-react-table';
import moment from 'moment';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { tableIcons } from './MyEditorialAppointmentsListIcons';
import Button from '@mui/material/Button';
import { DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Box, Typography, Tooltip, IconButton } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { TextField as SharedTextField } from 'modules/SharedComponents/Toolbox/TextField';
import { RoleField, JournalIdField } from 'modules/SharedComponents/LookupFields';
import { default as locale } from 'locale/components';
import { useMrtTable } from 'hooks';
import { validationRules } from './validationRules';

import { EDITORIAL_ROLE_MAP, EDITORIAL_ROLE_OPTIONS, EDITORIAL_ROLE_OTHER } from 'config/general';

const MUI_SAVE_BUTTON_CLASS = '.MuiIconButton-colorInfo';

const StyledToolbar = styled(Typography)(() => ({
    margin: '8px',
    cursor: 'pointer',
    flexDirection: 'column',
    gridColumn: 2,
}));

const StyledDatePicker = styled(DesktopDatePicker)(({ theme }) => ({
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        minWidth: '120px',
    },
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

export const MyEditorialAppointmentsList = ({ disabled, handleRowAdd, handleRowDelete, handleRowUpdate, list }) => {
    const theme = useTheme();
    const matchesMd = useMediaQuery(theme.breakpoints.up('md'));

    const {
        deleteConfirmationLocale,
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
                addButtonTooltip,
                editButtonTooltip,
                deleteButtonTooltip,
            },
        },
    } = locale.components.myEditorialAppointmentsList;

    const {
        data,
        isBusy,
        pendingDeleteRowId,
        isOpen,
        editingRow,
        validationErrors,
        setData,
        setBusy,
        setDeleteRow,
        resetDeleteRow,
        setEditRow,
        resetEditRow,
        validate,
        getValidationError,
        handleValidation,
        clearValidationErrors,
    } = useMrtTable(list, validationRules);

    const columns = React.useMemo(
        () => [
            {
                accessorKey: 'eap_journal_name',
                header: journalName.title,
                Header: ({ column }) => {
                    return (
                        <Typography variant="caption" color="secondary">
                            {column.columnDef.header}
                        </Typography>
                    );
                },
                Cell: ({ cell, row }) => {
                    const value = cell.getValue();
                    return (
                        <Typography
                            variant="body2"
                            data-testid={`eap-journal-name-${row.index}`}
                            id={`eap-journal-name-${row.index}`}
                        >
                            {value}
                        </Typography>
                    );
                },
                Edit: ({ row, column }) => {
                    const [state, setState] = React.useState({
                        eap_jnl_id: row._valuesCache.eap_jnl_id || row.original.eap_jnl_id,
                        eap_journal_name: row._valuesCache.eap_journal_name || row.original.eap_journal_name,
                    });

                    const errors = validationErrors[row.id] || [];
                    const error = getValidationError(errors, 'eap_journal_name');

                    const handleChange = selectedItem => {
                        setState({
                            eap_jnl_id: selectedItem.jnl_jid,
                            eap_journal_name: selectedItem.jnl_title || selectedItem.value,
                        });
                        row.original.eap_jnl_id = selectedItem.jnl_jid;
                        row._valuesCache[column.id] = selectedItem.jnl_title || selectedItem.value;

                        handleValidation(row, 'eap_journal_name', row._valuesCache[column.id]);
                    };

                    return (
                        <React.Fragment>
                            <JournalIdField
                                autoFocus
                                journalIdFieldId="eap-journal-name"
                                value={
                                    !!state.eap_jnl_id
                                        ? { id: state.eap_jnl_id, value: state.eap_journal_name }
                                        : { value: state.eap_journal_name }
                                }
                                onChange={handleChange}
                                error={!!error}
                                label={journalNameLabel}
                                placeholder={journalNameHint}
                                required
                                fullWidth
                                allowFreeText
                                clearOnInputClear
                                floatingLabelText="Journal name"
                            />
                        </React.Fragment>
                    );
                },
                size: 300,
                grow: true,
            },
            { accessorKey: 'eap_role_name', header: '', enableEditing: false, Edit: () => null },
            {
                accessorKey: 'eap_role_cvo_id',
                header: role.title,
                Header: ({ column }) => {
                    return (
                        <Typography variant="caption" color="secondary">
                            {column.columnDef.header}
                        </Typography>
                    );
                },
                Cell: ({ cell, row }) => {
                    const value = cell.getValue();
                    return (
                        <Typography
                            variant="body2"
                            id={`eap-role-name-${row.index}`}
                            data-testid={`eap-role-name-${row.index}`}
                        >
                            {`${EDITORIAL_ROLE_MAP[value]}${
                                !!(row._valuesCache.eap_role_name || row.original.eap_role_name)
                                    ? ` (${row._valuesCache.eap_role_name || row.original.eap_role_name})`
                                    : ''
                            }`}
                        </Typography>
                    );
                },
                Edit: ({ row, column }) => {
                    const [state, setState] = React.useState({
                        eap_role_cvo_id: row._valuesCache.eap_role_cvo_id || row.original.eap_role_cvo_id,
                        eap_role_name: row._valuesCache.eap_role_name || row.original.eap_role_name || '',
                    });

                    const errors = validationErrors[row.id] || [];
                    const error = getValidationError(errors, 'eap_role_cvo_id');
                    const errorRoleName = getValidationError(errors, 'eap_role_name');

                    const handleChange = selectedItem => {
                        setState(prev => ({
                            ...prev,
                            eap_role_cvo_id: selectedItem,
                            eap_role_name: null,
                        }));
                        row._valuesCache[column.id] = selectedItem;
                        row._valuesCache.eap_role_name = null;
                        handleValidation(row, 'eap_role_cvo_id', row._valuesCache[column.id]);
                        handleValidation(row, 'eap_role_name', null);
                    };

                    const handleClear = () => {
                        setState(prev => ({ ...prev, eap_role_cvo_id: null, eap_role_name: null }));
                        row._valuesCache[column.id] = null;
                        row._valuesCache.eap_role_name = null;
                        handleValidation(row, 'eap_role_cvo_id', row._valuesCache[column.id]);
                    };

                    const handleRoleNameChangeForOther = e => {
                        setState(prev => ({
                            ...prev,
                            eap_role_name: e.target.value,
                        }));
                        row._valuesCache.eap_role_name = e.target.value;

                        handleValidation(row, 'eap_role_name', row._valuesCache.eap_role_name);
                    };

                    return (
                        <React.Fragment>
                            <RoleField
                                autoCompleteSelectFieldId="eap-role-cvo-id"
                                fullWidth
                                clearable
                                key={`eap-role-${state.eap_role_cvo_id}`}
                                id="eap-role-cvo-id"
                                floatingLabelText={editorialRoleLabel}
                                hintText={editorialRoleHint}
                                onChange={handleChange}
                                onClear={handleClear}
                                itemsList={EDITORIAL_ROLE_OPTIONS}
                                required
                                autoComplete="off"
                                error={!!error}
                                value={
                                    !!state.eap_role_cvo_id
                                        ? {
                                              value: String(state.eap_role_cvo_id),
                                              text: EDITORIAL_ROLE_MAP[String(state.eap_role_cvo_id)],
                                          }
                                        : null
                                }
                            />
                            {String(state.eap_role_cvo_id) === EDITORIAL_ROLE_OTHER && (
                                <SharedTextField
                                    value={state.eap_role_name || ''}
                                    onChange={handleRoleNameChangeForOther}
                                    textFieldId="eap-role-name"
                                    error={!!errorRoleName}
                                    label={otherRoleLabel}
                                    placeholder={otherRoleHint}
                                    required
                                    fullWidth
                                />
                            )}
                        </React.Fragment>
                    );
                },
                size: 200,
                grow: true,
            },
            {
                accessorKey: 'eap_start_year',
                header: startYear.title,
                Header: ({ column }) => {
                    return (
                        <Typography variant="caption" color="secondary">
                            {column.columnDef.header}
                        </Typography>
                    );
                },
                Cell: ({ cell, row }) => {
                    const value = cell.getValue();
                    return (
                        <Typography
                            variant="body2"
                            id={`eap-start-year-${row.index}`}
                            data-testid={`eap-start-year-${row.index}`}
                        >
                            {value}
                        </Typography>
                    );
                },
                Edit: ({ row, column }) => {
                    const currentValue = row._valuesCache.eap_start_year || row.original.eap_start_year;
                    const errors = validationErrors[row.id] || [];
                    const error = getValidationError(errors, 'eap_start_year');

                    return (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <StyledDatePicker
                                value={(!!currentValue && moment(String(currentValue), 'YYYY')) || null}
                                onChange={value => {
                                    row._valuesCache = {
                                        ...row._valuesCache,
                                        [column.id]: (!!value && value.format('YYYY')) || null,
                                    };
                                    handleValidation(row, 'eap_start_year', value?.format('YYYY') || null);
                                    // Re-validate end date when start date changes
                                    const currentEndDate = row._valuesCache.eap_end_year || row.original.eap_end_year;
                                    if (currentEndDate) {
                                        handleValidation(row, 'eap_end_year', currentEndDate);
                                    }
                                }}
                                format="YYYY"
                                views={['year']}
                                openTo="year"
                                disableFuture
                                closeOnSelect
                                slotProps={{
                                    textField: () => {
                                        return {
                                            inputProps: {
                                                id: 'eap-start-year-input',
                                                'data-testid': 'eap-start-year-input',
                                                label: startYearLabel,
                                                'aria-label': startYearLabel,
                                                'aria-labelledby': 'eap-start-year-label',
                                                readOnly: false,
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
                                            error: !!error,
                                        };
                                    },
                                }}
                            />
                        </LocalizationProvider>
                    );
                },
                size: 100,
                grow: false,
            },
            {
                accessorKey: 'eap_end_year',
                header: endYear.title,
                Header: ({ column }) => {
                    return (
                        <Typography variant="caption" color="secondary">
                            {column.columnDef.header}
                        </Typography>
                    );
                },
                Cell: ({ cell, row }) => {
                    const value = cell.getValue();
                    return (
                        <Typography
                            variant="body2"
                            id={`eap-end-year-${row.index}`}
                            data-testid={`eap-end-year-${row.index}`}
                        >
                            {moment(String(value), 'YYYY').format('YYYY') === moment(new Date()).format('YYYY')
                                ? locale.components.myEditorialAppointmentsList.form.locale.endYearCurrentYearLabel
                                : value}
                        </Typography>
                    );
                },
                Edit: ({ row, column }) => {
                    const startYearValue = row._valuesCache.eap_start_year || row.original.eap_start_year;

                    const errors = validationErrors[row.id] || [];
                    const error = getValidationError(errors, 'eap_end_year');
                    const currentValue = row._valuesCache.eap_end_year || row.original.eap_end_year;

                    const minDate = new Date();
                    minDate.setFullYear(parseInt(startYearValue, 10));
                    minDate.setDate(1);
                    minDate.setMonth(0);
                    return (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <StyledDatePicker
                                value={(!!currentValue && moment(String(currentValue), 'YYYY')) || null}
                                onChange={value => {
                                    row._valuesCache = {
                                        ...row._valuesCache,
                                        [column.id]: (!!value && value.format('YYYY')) || null,
                                    };
                                    handleValidation(row, 'eap_end_year', value?.format('YYYY') || null);
                                }}
                                {...((!!currentValue &&
                                    moment(String(currentValue), 'YYYY').format('YYYY') === moment().format('YYYY') && {
                                        format: `[${locale.components.myEditorialAppointmentsList.form.locale.endYearCurrentYearLabel}]`,
                                    }) ||
                                    {})}
                                format="YYYY"
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
                                                readOnly: false,
                                            },
                                            value: displayValue,
                                            id: 'eap-end-year',
                                            variant: 'standard',
                                            required: true,
                                            helperText: !!currentValue && !!error ? error : '',
                                            label: endYearLabel,
                                            InputLabelProps: {
                                                id: 'eap-end-year-label',
                                                'data-testid': 'eap-end-year-label',
                                                htmlFor: 'eap-end-year-input',
                                            },
                                            error: !!error,
                                        };
                                    },
                                }}
                            />
                        </LocalizationProvider>
                    );
                },
                size: 100,
                grow: false,
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [getValidationError, handleValidation, validationErrors],
    );

    const handleCreate = ({ values, table, row }) => {
        const newValues = { ...row.original, ...row._valuesCache, ...values };
        const errors = validate(newValues);
        /* istanbul ignore if  */
        if (!!errors) {
            return;
        }

        setBusy();
        handleRowAdd(newValues)
            .then(data => {
                setData(prevState => {
                    return [...prevState, data];
                });
            })
            .catch(() => setData(prevState => [...prevState]))
            .finally(() => {
                table.setCreatingRow(null);
                resetEditRow();
                setBusy(false);
            });
    };

    const handleEdit = ({ values, table, row }) => {
        const newValues = { ...row.original, ...row._valuesCache, ...values };
        const errors = validate(newValues);
        /* istanbul ignore if  */
        if (!!errors) {
            return;
        }
        setBusy();
        handleRowUpdate(newValues, row.original)
            .then(data => {
                setData(prevState => {
                    const list = [...prevState];
                    const target = list.find(el => el.eap_id === row.original.eap_id);
                    const index = list.indexOf(target);
                    list[index] = data;
                    return list;
                });
            })
            .catch(() => {
                setData(prevState => [...prevState]);
            })
            .finally(() => {
                table.setEditingRow(null);
                resetEditRow();
                setBusy(false);
            });
    };

    const handleDeleteApproved = () => {
        const row = data.find(row => row.eap_id === pendingDeleteRowId);
        setBusy();
        handleRowDelete(row)
            .then(() => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        const dataDelete = [...data];
                        const target = dataDelete.find(el => el.eap_id === row.eap_id);
                        const index = dataDelete.indexOf(target);
                        dataDelete.splice(index, 1);
                        setData([...dataDelete]);
                        resolve();
                    }, 1000);
                });
            })
            .finally(() => setBusy(false));
    };

    // DELETE action
    const openDeleteConfirmModal = id => () => {
        setDeleteRow(id);
    };

    const cancelDeleteConfirmModal = () => {
        resetDeleteRow();
    };

    const table = useMaterialReactTable({
        columns,
        data,
        getRowId: row => row.eap_id,
        createDisplayMode: matchesMd ? 'row' : 'modal',
        editDisplayMode: matchesMd ? 'row' : 'modal',
        enableEditing: true,
        enableColumnDragging: false,
        enableColumnResizing: false,
        enableRowDragging: false,
        enableRowSelection: false,
        enableColumnActions: false,
        enableColumnFilterModes: false,
        enablePagination: false,
        enableToolbarInternalActions: false,
        positionActionsColumn: 'last',
        state: {
            showAlertBanner: false,
            showLoadingOverlay: isBusy,
        },
        displayColumnDefOptions: { 'mrt-row-actions': { minSize: 80 } },
        renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
            <Box
                id={`my-editorial-appointments-dialog-${addButtonTooltip.toLowerCase().replace(/ /g, '-')}`}
                data-testid={`my-editorial-appointments-dialog-${addButtonTooltip.toLowerCase().replace(/ /g, '-')}`}
            >
                <DialogTitle variant="h5">{addButtonTooltip}</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {internalEditComponents}
                </DialogContent>
                <DialogActions>
                    <MRT_EditActionButtons
                        variant="text"
                        table={table}
                        row={row}
                        sx={{ flexDirection: 'column', flexGrow: 1 }}
                    />
                </DialogActions>
            </Box>
        ),
        renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
            <Box
                id={`my-editorial-appointments-dialog-${editButtonTooltip.toLowerCase().replace(/ /g, '-')}`}
                data-testid={`my-editorial-appointments-dialog-${editButtonTooltip.toLowerCase().replace(/ /g, '-')}`}
            >
                <DialogTitle variant="h5">{editButtonTooltip}</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {internalEditComponents}
                </DialogContent>
                <DialogActions>
                    <MRT_EditActionButtons
                        variant="text"
                        table={table}
                        row={row}
                        sx={{ flexDirection: 'column', flexGrow: 1 }}
                    />
                </DialogActions>
            </Box>
        ),
        renderTopToolbarCustomActions: ({ table }) => (
            <Button
                id={`my-editorial-appointments-${addButtonTooltip.toLowerCase().replace(/ /g, '-')}`}
                data-testid={`my-editorial-appointments-${addButtonTooltip.toLowerCase().replace(/ /g, '-')}`}
                disabled={disabled}
                variant="contained"
                color="primary"
                children={addButtonTooltip}
                onClick={() => {
                    resetEditRow();
                    table.setEditingRow(null);
                    table.setCreatingRow(true);
                    // immediately force validation of new row
                    handleValidation({ id: 'mrt-row-create' }, columns[0].accessorKey, '');
                }}
                sx={{ marginLeft: 'auto' }}
            />
        ),
        renderRowActions: ({ row }) => {
            return (
                <Box sx={{ display: 'flex', flexWrap: 'nowrap' }}>
                    <Tooltip title={editButtonTooltip}>
                        <IconButton
                            onClick={() => {
                                setEditRow(row);
                                table.setCreatingRow(null);
                                table.setEditingRow(row);
                            }}
                            disabled={!!pendingDeleteRowId || !!isBusy || !!editingRow}
                            id={`my-editorial-appointments-list-row-${
                                row.index
                            }-${editButtonTooltip.toLowerCase().replace(/ /g, '-')}`}
                            data-testid={`my-editorial-appointments-list-row-${
                                row.index
                            }-${editButtonTooltip.toLowerCase().replace(/ /g, '-')}`}
                        >
                            <tableIcons.Edit />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={deleteButtonTooltip}>
                        <IconButton
                            onClick={openDeleteConfirmModal(row.id)}
                            disabled={!!pendingDeleteRowId || !!isBusy || !!editingRow}
                            id={`my-editorial-appointments-list-row-${
                                row.index
                            }-${deleteButtonTooltip.toLowerCase().replace(/ /g, '-')}`}
                            data-testid={`my-editorial-appointments-list-row-${
                                row.index
                            }-${deleteButtonTooltip.toLowerCase().replace(/ /g, '-')}`}
                        >
                            <tableIcons.Delete />
                        </IconButton>
                    </Tooltip>
                </Box>
            );
        },
        onCreatingRowCancel: () => {
            resetEditRow();
            clearValidationErrors();
        },
        onCreatingRowSave: handleCreate,
        onEditingRowSave: handleEdit,
        onEditingRowCancel: () => setEditRow(null),
        initialState: {
            expanded: true,
            columnVisibility: { eap_role_name: false },
            columnPinning: { ['right']: ['mrt-row-actions'] },
            sorting: [{ id: 'eap_role_cvo_id', desc: true }],
        },
        icons: {
            SaveIcon: props => (
                <tableIcons.Check
                    id={`my-editorial-appointments-${!!editingRow ? 'edit' : 'add'}-save`}
                    data-testid={`my-editorial-appointments-${!!editingRow ? 'edit' : 'add'}-save`}
                    color="secondary"
                    {...props}
                />
            ),
            CancelIcon: props => (
                <tableIcons.Clear
                    id={`my-editorial-appointments-${!!editingRow ? 'edit' : 'add'}-cancel`}
                    data-testid={`my-editorial-appointments-${!!editingRow ? 'edit' : 'add'}-cancel`}
                    color="secondary"
                    {...props}
                />
            ),
        },
        muiTableProps: {
            sx: {
                borderCollapse: 'collapse',
            },
        },
        muiTableBodyCellProps: {
            sx: {
                '&:last-of-type > div': {
                    gap: 0,
                    [`&:has(${MUI_SAVE_BUTTON_CLASS})`]: { flexDirection: 'row-reverse', justifyContent: 'flex-end' },
                },
                '&:not(:last-child)': { alignContent: 'flex-start' },
            },
        },
        muiTableBodyRowProps: ({ row }) => ({
            id: `my-editorial-appointments-list-row-${row.index === -1 ? 'add' : row.index}`,
            'data-testid': `my-editorial-appointments-list-row-${row.index === -1 ? 'add' : row.index}`,
            ...(moment(String(row._valuesCache.eap_end_year || row.original.eap_end_year), 'YYYY').isBefore(
                moment(),
                'year',
            )
                ? { style: { borderLeft: '8px solid red' } }
                : {}),
        }),
    });

    return (
        <Box
            id="my-editorial-appointments-list"
            data-testid="my-editorial-appointments-list"
            sx={{ '& .MuiPaper-root': { border: 0, boxShadow: 0 } }}
        >
            <ConfirmationBox
                confirmationBoxId="my-editorial-appointments-delete-appointment-confirmation"
                onAction={handleDeleteApproved}
                onClose={cancelDeleteConfirmModal}
                isOpen={isOpen}
                locale={deleteConfirmationLocale}
            />
            <MaterialReactTable table={table} />
        </Box>
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
