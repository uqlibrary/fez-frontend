/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import moment from 'moment';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { tableIcons } from './MyEditorialAppointmentsListIcons';
import Button from '@mui/material/Button';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Box, Typography, Tooltip, IconButton } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { TextField as SharedTextField } from 'modules/SharedComponents/Toolbox/TextField';
import { RoleField, JournalIdField } from 'modules/SharedComponents/LookupFields';
import { useConfirmationState } from 'hooks';
import { default as locale } from 'locale/components';

import {
    EDITORIAL_APPOINTMENT_MAX_YEAR,
    EDITORIAL_APPOINTMENT_MIN_YEAR,
    EDITORIAL_ROLE_MAP,
    EDITORIAL_ROLE_OPTIONS,
    EDITORIAL_ROLE_OTHER,
} from 'config/general';

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

// const StyledResponsiveWrapper = styled('div')(({ theme }) => ({
//     [theme.breakpoints.down('md')]: {
//         '& [class*="MuiToolbar-root"]': {
//             padding: 0,
//             display: 'block',
//             marginBlockEnd: '12px',

//             '& > div:first-of-type': {
//                 display: 'none',
//             },
//         },

//         '& [class*="MuiTable-root"]': {
//             '& thead': {
//                 display: 'none',
//             },

//             '& tr[class*="MuiTableRow-root"]': {
//                 display: 'block',
//                 width: '100%',
//                 boxSizing: 'border-box',

//                 '& td[class*="MuiTableCell-root"]:last-of-type': {
//                     display: 'block',
//                     clear: 'both',
//                     width: '100% !important',
//                     boxSizing: 'border-box',
//                 },
//             },
//             '& tr[class*="MuiTableRow-root"]:not(:last-of-type)': {
//                 marginBottom: '12px',
//             },
//         },

//         '& button#my-editorial-appointments-add-new-editorial-appointment': {
//             width: '100%',
//         },
//     },
// }));

const useTable = list => {
    const [data, setData] = useState(list);
    const [state, setState] = useState({ busy: false, deleteRowId: null, editingRow: null });
    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();
    const [validationErrors, setValidationErrors] = useState({});

    const setBusy = (isBusy = true) => setState(prev => ({ ...prev, busy: isBusy }));
    const setDeleteRow = id => {
        setState(prev => ({ ...prev, deleteRowId: id }));
        showConfirmation();
    };
    const resetDeleteRow = () => {
        setState(prev => ({ ...prev, deleteRowId: null }));
        hideConfirmation();
    };
    const setEditRow = row => setState(prev => ({ ...prev, editingRow: row }));
    const resetEditRow = () => setState(prev => ({ ...prev, editingRow: null }));

    return {
        data,
        setData,
        isBusy: state.busy,
        setBusy,
        pendingDeleteRowId: state.deleteRowId,
        setDeleteRow,
        resetDeleteRow,
        editingRow: state.editingRow,
        setEditRow,
        resetEditRow,
        isOpen,
        showConfirmation,
        hideConfirmation,
        validationErrors,
        setValidationErrors,
    };
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
                endYearErrorMessage,
                addButtonTooltip,
                editButtonTooltip,
                deleteButtonTooltip,
            },
        },
    } = locale.components.myEditorialAppointmentsList;

    const {
        data,
        setData,
        isBusy,
        setBusy,
        pendingDeleteRowId,
        setDeleteRow,
        resetDeleteRow,
        editingRow,
        setEditRow,
        resetEditRow,
        isOpen,
        validationErrors,
        setValidationErrors,
    } = useTable(list);

    const handleCreate = ({ values, table, row }) => {
        const newValues = { ...row.original, ...row._valuesCache, ...values };
        setBusy();
        return handleRowAdd(newValues)
            .then(data => {
                setData(prevState => {
                    return [...prevState, data];
                });
            })
            .catch(() => setData(prevState => prevState))
            .finally(() => {
                table.setCreatingRow(false);
                setBusy(false);
            });
    };

    const handleEdit = ({ values, table, row }) => {
        // const invalid = props.columns.some(column => !column.validate(newData));
        // /* istanbul ignore if  */
        // if (invalid) {
        //     return;
        // }
        const newValues = { ...row.original, ...row._valuesCache, ...values };
        setBusy();
        handleRowUpdate(newValues, row.original)
            .then(data => {
                table.setEditingRow(null);
                setData(prevState => {
                    const list = [...prevState];
                    const target = list.find(el => el.eap_id === row.original.eap_id);
                    const index = list.indexOf(target);
                    list[index] = data;
                    return list;
                });
            })
            .catch(() => setData(prevState => prevState))
            .finally(() => setBusy(false));
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

    const columns = [
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
                        data-testid={`eap-journal-name-${row.id}`}
                        id={`eap-journal-name-${row.id}`}
                    >
                        {value}
                    </Typography>
                );
            },
            Edit: ({ row, column }) => {
                const handleChange = selectedItem => {
                    row._valuesCache[column.id] = selectedItem.jnl_title || selectedItem.value;
                    row.original.eap_jnl_id = selectedItem.jnl_jid;
                };

                return (
                    <React.Fragment>
                        <JournalIdField
                            autoFocus
                            journalIdFieldId="eap-journal-name"
                            value={
                                !!row.original.eap_jnl_id
                                    ? { id: row.original.eap_jnl_id, value: row._valuesCache[column.id] }
                                    : { value: row._valuesCache[column.id] }
                            }
                            onChange={handleChange}
                            error={(row._valuesCache[column.id] || '').length === 0}
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
            // muiTableHeadCellProps: () => ({
            //     sx: {
            //         width: '45%',
            //         maxWidth: '45%',
            //     },
            // }),
            // validate: rowData => !!rowData.eap_journal_name && rowData.eap_journal_name !== '',
            // cellStyle: matchesMd
            //     ? {
            //           width: '45%',
            //           maxWidth: '45%',
            //       }
            //     : {
            //           display: 'block',
            //           width: '100%',
            //           boxSizing: 'border-box',
            //       },
            // headerStyle: {
            //     width: '45%',
            //     maxWidth: '45%',
            // },
        },
        { accessorKey: 'eap_role_name', header: '', enableEditing: true },
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
                    <Typography variant="body2" id={`eap-role-name-${row.id}`} data-testid={`eap-role-name-${row.id}`}>
                        {`${EDITORIAL_ROLE_MAP[value]}${
                            !!row._valuesCache.eap_role_name ? ' (' + row._valuesCache.eap_role_name + ')' : ''
                        }`}
                    </Typography>
                );
            },
            Edit: ({ row, column, cell }) => {
                const [state, setState] = React.useState({
                    eap_role_cvo_id: cell.getValue(),
                    eap_role_name: row.original.eap_role_name || '',
                });

                const handleChange = selectedItem => {
                    setState(prev => ({
                        ...prev,
                        eap_role_cvo_id: selectedItem,
                        eap_role_name: null,
                    }));
                    row._valuesCache[column.id] = selectedItem;
                    row._valuesCache.eap_role_name = null;
                };

                const handleClear = () => {
                    setState({
                        eap_role_cvo_id: null,
                        eap_role_name: null,
                    });
                    row._valuesCache[column.id] = null;
                    row._valuesCache.eap_role_name = null;
                };

                const handleRoleNameChangeForOther = e => {
                    setState(prev => ({
                        ...prev,
                        eap_role_name: e.target.value,
                    }));
                    row._valuesCache.eap_role_name = e.target.value;
                };

                return (
                    <React.Fragment>
                        {console.log(state)}
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
                            error={!state.eap_role_cvo_id}
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
                                error={!state.eap_role_name}
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
            // muiTableHeadCellProps: () => ({
            //     sx: {
            //         width: '25%',
            //         maxWidth: '25%',
            //     },
            // }),
            // validate: rowData =>
            //     !!rowData.eap_role_cvo_id &&
            //     (String(rowData.eap_role_cvo_id) === EDITORIAL_ROLE_OTHER ? !!rowData.eap_role_name : true),
            // cellStyle: matchesMd
            //     ? {
            //           width: '25%',
            //           maxWidth: '25%',
            //       }
            //     : {
            //           display: 'block',
            //           width: '100%',
            //           boxSizing: 'border-box',
            //       },
            // headerStyle: {
            //     width: '25%',
            //     maxWidth: '25%',
            // },
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
                        id={`eap-start-year-${row.id}`}
                        data-testid={`eap-start-year-${row.id}`}
                    >
                        {value}
                    </Typography>
                );
            },
            Edit: ({ row, column }) => {
                return (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <StyledDatePicker
                            value={
                                (!!row._valuesCache[column.id] &&
                                    moment(String(row._valuesCache[column.id]), 'YYYY')) ||
                                null
                            }
                            onChange={value =>
                                (row._valuesCache[column.id] = (!!value && value.format('YYYY')) || null)
                            }
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
                );
            },

            size: 100,
            grow: false,
            // muiTableHeadCellProps: () => ({
            //     sx: {
            //         width: '15%',
            //         maxWidth: '15%',
            //     },
            // }),
            // validate: rowData => {
            //     const startYearMoment = moment(String(rowData.eap_start_year), 'YYYY');
            //     return (
            //         startYearMoment.isValid() &&
            //         startYearMoment.isSameOrBefore(moment(), 'year') &&
            //         startYearMoment.isSameOrAfter(moment(EDITORIAL_APPOINTMENT_MIN_YEAR, 'YYYY'))
            //     );
            // },
            // cellStyle: matchesMd
            //     ? {
            //           width: '15%',
            //           maxWidth: '15%',
            //           float: 'none',
            //       }
            //     : {
            //           width: '100%',
            //           display: 'block',
            //           boxSizing: 'border-box',
            //       },
            // headerStyle: {
            //     width: '15%',
            //     maxWidth: '15%',
            // },
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
                    <Typography variant="body2" id={`eap-end-year-${row.id}`} data-testid={`eap-end-year-${row.id}`}>
                        {moment(String(value), 'YYYY').format('YYYY') === moment(new Date()).format('YYYY')
                            ? locale.components.myEditorialAppointmentsList.form.locale.endYearCurrentYearLabel
                            : value}
                    </Typography>
                );
            },
            Edit: ({ cell, row, column }) => {
                const value = cell.getValue();
                const startYearValue = row._valuesCache.eap_start_year || row.original.eap_start_year;
                const minDate = new Date();
                minDate.setFullYear(parseInt(startYearValue, 10));
                minDate.setDate(1);
                minDate.setMonth(0);
                return (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <StyledDatePicker
                            value={(!!value && moment(String(value), 'YYYY')) || null}
                            onChange={value => {
                                row._valuesCache[column.id] = (!!value && value.format('YYYY')) || null;
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
                                                    moment(String(startYearValue), 'YYYY'),
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
                                                moment(String(startYearValue), 'YYYY'),
                                            ),
                                    };
                                },
                            }}
                        />
                    </LocalizationProvider>
                );
            },
            size: 100,
            grow: false,
            // muiTableHeadCellProps: () => ({
            //     sx: {
            //         width: '15%',
            //         maxWidth: '15%',
            //     },
            // }),
            // validate: rowData => {
            //     const endYearMoment = moment(String(rowData.eap_end_year), 'YYYY');
            //     return (
            //         endYearMoment.isValid() &&
            //         endYearMoment.isSameOrBefore(moment(EDITORIAL_APPOINTMENT_MAX_YEAR, 'YYYY')) &&
            //         endYearMoment.isSameOrAfter(moment(String(rowData.eap_start_year), 'YYYY'))
            //     );
            // },
            // cellStyle: matchesMd
            //     ? {
            //           width: '15%',
            //           maxWidth: '15%',
            //           float: 'none',
            //       }
            //     : {
            //           width: '100%',
            //           display: 'block',
            //           boxSizing: 'border-box',
            //       },
            // headerStyle: {
            //     width: '15%',
            //     maxWidth: '15%',
            // },
        },
    ];
    const table = useMaterialReactTable({
        columns,
        data,
        getRowId: row => row.eap_id,
        createDisplayMode: 'row', // ('modal', and 'custom' are also available)
        editDisplayMode: 'row', // ('modal', 'cell', 'table', and 'custom' are also available)
        enableEditing: true,
        enableColumnDragging: false,
        enableColumnResizing: false,
        enableRowDragging: false,
        enableRowSelection: false,
        enableColumnActions: false,
        enableColumnFilterModes: false,
        enablePagination: false,
        enableToolbarInternalActions: false,
        positionActionsColumn: !matchesMd ? 'first' : 'last',
        state: {
            showAlertBanner: false,
            showLoadingOverlay: isBusy,
        },
        displayColumnDefOptions: { 'mrt-row-actions': { minSize: 80 } },
        renderTopToolbarCustomActions: ({ table }) => (
            <Button
                id={`my-editorial-appointments-${addButtonTooltip.toLowerCase().replace(/ /g, '-')}`}
                data-testid={`my-editorial-appointments-${addButtonTooltip.toLowerCase().replace(/ /g, '-')}`}
                disabled={disabled}
                variant="contained"
                color="primary"
                children={addButtonTooltip}
                onClick={() => {
                    setEditRow({});
                    table.setCreatingRow(true);
                }}
                sx={{ marginLeft: 'auto' }}
            />
        ),
        renderRowActions: ({ row }) => {
            return (
                <>
                    <Tooltip title={editButtonTooltip}>
                        <IconButton
                            onClick={() => {
                                setEditRow(row);
                                table.setEditingRow(row);
                            }}
                            disabled={!!pendingDeleteRowId || !!isBusy || !!editingRow}
                            id={`my-editorial-appointments-list-row-${row.id}-${editButtonTooltip
                                .toLowerCase()
                                .replace(/ /g, '-')}`}
                            data-testid={`my-editorial-appointments-list-row-${
                                row.id
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
                                row.id
                            }-${deleteButtonTooltip.toLowerCase().replace(/ /g, '-')}`}
                            data-testid={`my-editorial-appointments-list-row-${
                                row.id
                            }-${deleteButtonTooltip.toLowerCase().replace(/ /g, '-')}`}
                        >
                            <tableIcons.Delete />
                        </IconButton>
                    </Tooltip>
                </>
            );
        },
        onCreatingRowCancel: () => {
            setEditRow(null);
            setValidationErrors({});
        },
        onCreatingRowSave: handleCreate,
        onEditingRowSave: handleEdit,
        onEditingRowCancel: () => setEditRow(null),
        initialState: {
            expanded: true,
            columnVisibility: { eap_role_name: false },
            columnPinning: { [!matchesMd ? 'left' : 'right']: ['mrt-row-actions'] },
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
        },
    });

    return (
        <Box
            id="my-editorial-appointments-list"
            data-testid="my-editorial-appointments-list"
            sx={{ '& .MuiPaper-root': { border: 0, boxShadow: 0 } }}
        >
            <ConfirmationBox
                confirmationBoxId="bulk-delete-users-confirmation"
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
