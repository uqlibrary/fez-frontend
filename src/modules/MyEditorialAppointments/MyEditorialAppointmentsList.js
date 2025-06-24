/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import moment from 'moment';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

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

export const MyEditorialAppointmentsList = ({ disabled, handleRowAdd, handleRowDelete, handleRowUpdate, list }) => {
    const theme = useTheme();
    const matchesMd = useMediaQuery(theme.breakpoints.up('md'));

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
            },
        },
    } = locale.components.myEditorialAppointmentsList;

    const {
        form: {
            locale: { addButtonTooltip, editButtonTooltip, deleteButtonTooltip },
        },
    } = locale.components.myEditorialAppointmentsList;

    const [data, setData] = React.useState(list);
    const handleEditingApproved = props => (action, newData, oldData) => {
        const invalid = props.columns.some(column => !column.validate(newData));
        /* istanbul ignore if  */
        if (invalid) {
            return;
        }
        props.onEditingApproved(action, newData, oldData);
    };

    const columns = [
        {
            accessorKey: 'eap_journal_name',
            header: journalName.title,
            Cell: ({ row }) => (
                <Typography
                    variant="body2"
                    data-testid={`eap-journal-name-${row.id}`}
                    id={`eap-journal-name-${row.id}`}
                >
                    {row.eap_journal_name}
                </Typography>
            ),
            Edit: props => {
                const { rowData } = props;
                const handleChange = selectedItem => {
                    props.onRowDataChange({
                        ...rowData,
                        eap_jnl_id: selectedItem.jnl_jid,
                        eap_journal_name: selectedItem.jnl_title || selectedItem.value,
                    });
                };

                return (
                    <React.Fragment>
                        <JournalIdField
                            autoFocus
                            journalIdFieldId="eap-journal-name"
                            value={
                                !!rowData.eap_jnl_id
                                    ? { id: rowData.eap_jnl_id, value: props.value }
                                    : { value: props.value }
                            }
                            onChange={handleChange}
                            error={(rowData.eap_journal_name || '').length === 0}
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
        {
            accessorKey: 'eap_role_name',
            header: role.title,
            Cell: ({ row }) => (
                <Typography variant="body2" id={`eap-role-name-${row.id}`} data-testid={`eap-role-name-${row.id}`}>
                    {`${EDITORIAL_ROLE_MAP[row.eap_role_cvo_id]}${
                        !!row.eap_role_name ? ' (' + row.eap_role_name + ')' : ''
                    }`}
                </Typography>
            ),
            Edit: props => {
                const { rowData } = props;

                const handleChange = selectedItem => {
                    props.onRowDataChange({
                        ...rowData,
                        eap_role_cvo_id: selectedItem,
                        eap_role_name: null,
                    });
                };

                const handleClear = () =>
                    props.onRowDataChange({ ...rowData, eap_role_name: null, eap_role_cvo_id: null });

                const handleRoleNameChangeForOther = e => {
                    props.onRowDataChange({ ...rowData, eap_role_name: e.target.value });
                };

                return (
                    <React.Fragment>
                        <RoleField
                            {...props}
                            autoCompleteSelectFieldId="eap-role-cvo-id"
                            fullWidth
                            clearable
                            key={`eap-role-${rowData.eap_role_cvo_id}`}
                            id="eap-role-cvo-id"
                            floatingLabelText={editorialRoleLabel}
                            hintText={editorialRoleHint}
                            onChange={handleChange}
                            onClear={handleClear}
                            itemsList={EDITORIAL_ROLE_OPTIONS}
                            required
                            autoComplete="off"
                            error={!rowData.eap_role_cvo_id}
                            value={
                                !!rowData.eap_role_cvo_id
                                    ? {
                                          value: String(rowData.eap_role_cvo_id),
                                          text: EDITORIAL_ROLE_MAP[String(rowData.eap_role_cvo_id)],
                                      }
                                    : null
                            }
                        />
                        {String(rowData.eap_role_cvo_id) === EDITORIAL_ROLE_OTHER && (
                            <SharedTextField
                                value={rowData.eap_role_name || ''}
                                onChange={handleRoleNameChangeForOther}
                                textFieldId="eap-role-name"
                                error={!rowData.eap_role_name}
                                label={otherRoleLabel}
                                placeholder={otherRoleHint}
                                required
                                fullWidth
                            />
                        )}
                    </React.Fragment>
                );
            },
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
            Cell: ({ row }) => (
                <Typography variant="body2" id={`eap-start-year-${row.id}`} data-testid={`eap-start-year-${row.id}`}>
                    {row.eap_start_year}
                </Typography>
            ),
            Edit: props => {
                return (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <StyledDatePicker
                            value={(!!props.value && moment(String(props.value), 'YYYY')) || null}
                            onChange={value => props.onChange((!!value && value.format('YYYY')) || null)}
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
            Cell: ({ row }) => (
                <Typography variant="body2" id={`eap-end-year-${row.id}`} data-testid={`eap-end-year-${row.id}`}>
                    {moment(String(row.eap_end_year), 'YYYY').format('YYYY') === moment(new Date()).format('YYYY')
                        ? locale.components.myEditorialAppointmentsList.form.locale.endYearCurrentYearLabel
                        : row.eap_end_year}
                </Typography>
            ),
            Edit: ({ value, rowData, onChange }) => {
                const minDate = new Date();
                minDate.setFullYear(parseInt(rowData.eap_start_year, 10));
                minDate.setDate(1);
                minDate.setMonth(0);
                return (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <StyledDatePicker
                            value={(!!value && moment(String(value), 'YYYY')) || null}
                            onChange={value => {
                                onChange((!!value && value.format('YYYY')) || null);
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
                                                    moment(String(rowData.eap_start_year), 'YYYY'),
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
                                                moment(String(rowData.eap_start_year), 'YYYY'),
                                            ),
                                    };
                                },
                            }}
                        />
                    </LocalizationProvider>
                );
            },
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
        state: {
            isLoading: false,
            isSaving: false,
            showAlertBanner: false,
            showProgressBars: false,
        },
    });

    return <MaterialReactTable table={table} />;
};

MyEditorialAppointmentsList.propTypes = {
    disabled: PropTypes.bool,
    handleRowAdd: PropTypes.func,
    handleRowUpdate: PropTypes.func,
    handleRowDelete: PropTypes.func,
    list: PropTypes.array,
};

export default React.memo(MyEditorialAppointmentsList);
