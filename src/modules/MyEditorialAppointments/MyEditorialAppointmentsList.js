/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import MaterialTable, { MTableAction, MTableBodyRow, MTableEditRow } from '@material-table/core';
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

export const CustomToolbar = props => {
    return (
        <Typography
            variant="h6"
            align="center"
            style={{
                margin: '8px',
                cursor: 'pointer',
            }}
            onClick={() => {
                props.onChange(moment(new Date(), 'YYYY'));
            }}
            id="eap-end-year-current"
            data-testid="eap-end-year-current"
        >
            {locale.components.myEditorialAppointmentsList.form.locale.endYearCurrentYearLabel}
        </Typography>
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

            '& > div:first-child': {
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

export const GetColumns = () => {
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
    return [
        {
            title: (
                <Typography variant="caption" color="secondary">
                    {journalName.title}
                </Typography>
            ),
            field: 'eap_journal_name',
            render: rowData => (
                <Typography
                    variant="body2"
                    data-testid={`eap-journal-name-${rowData.tableData.id}`}
                    id={`eap-journal-name-${rowData.tableData.id}`}
                >
                    {rowData.eap_journal_name}
                </Typography>
            ),
            editComponent: props => {
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
            validate: rowData => !!rowData.eap_journal_name && rowData.eap_journal_name !== '',
            cellStyle: matchesMd
                ? {
                      width: '45%',
                      maxWidth: '45%',
                  }
                : {
                      display: 'block',
                      width: '100%',
                      boxSizing: 'border-box',
                  },
            headerStyle: {
                width: '45%',
                maxWidth: '45%',
            },
        },
        {
            title: (
                <Typography variant="caption" color="secondary">
                    {role.title}
                </Typography>
            ),
            field: 'eap_role_name',
            render: rowData => (
                <Typography
                    variant="body2"
                    id={`eap-role-name-${rowData.tableData.id}`}
                    data-testid={`eap-role-name-${rowData.tableData.id}`}
                >
                    {`${EDITORIAL_ROLE_MAP[rowData.eap_role_cvo_id]}${
                        !!rowData.eap_role_name ? ' (' + rowData.eap_role_name + ')' : ''
                    }`}
                </Typography>
            ),
            editComponent: props => {
                const { rowData } = props;

                const handleChange = selectedItem => {
                    props.onRowDataChange({
                        ...rowData,
                        eap_role_cvo_id: selectedItem,
                    });
                };

                const handleClear = () =>
                    props.onRowDataChange({ ...rowData, eap_role_name: null, eap_role_cvo_id: null });

                const handleRoleNameChangeForOther = e =>
                    props.onRowDataChange({ ...rowData, eap_role_name: e.target.value });

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
                                          value: rowData.eap_role_cvo_id,
                                          text: EDITORIAL_ROLE_MAP[rowData.eap_role_cvo_id],
                                      }
                                    : null
                            }
                        />
                        {rowData.eap_role_cvo_id === EDITORIAL_ROLE_OTHER && (
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
            validate: rowData =>
                !!rowData.eap_role_cvo_id &&
                (rowData.eap_role_cvo_id === EDITORIAL_ROLE_OTHER ? !!rowData.eap_role_name : true),
            cellStyle: matchesMd
                ? {
                      width: '25%',
                      maxWidth: '25%',
                  }
                : {
                      display: 'block',
                      width: '100%',
                      boxSizing: 'border-box',
                  },
            headerStyle: {
                width: '25%',
                maxWidth: '25%',
            },
        },
        {
            title: (
                <Typography variant="caption" color="secondary">
                    {startYear.title}
                </Typography>
            ),
            field: 'eap_start_year',
            render: rowData => (
                <Typography
                    variant="body2"
                    id={`eap-start-year-${rowData.tableData.id}`}
                    data-testid={`eap-start-year-${rowData.tableData.id}`}
                >
                    {rowData.eap_start_year}
                </Typography>
            ),
            editComponent: props => {
                return (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <StyledDatePicker
                            value={(!!props.value && moment(String(props.value), 'YYYY')) || null}
                            onChange={value => props.onChange((!!value && value.format('YYYY')) || null)}
                            views={['year']}
                            openTo="year"
                            disableFuture
                            inputProps={{
                                id: 'eap-start-year-input',
                                'data-testid': 'eap-start-year-input',
                                label: startYearLabel,
                                'aria-label': startYearLabel,
                                'aria-labelledby': 'eap-start-year-label',
                            }}
                            renderInput={params => {
                                const value = params.inputProps?.value ?? /* istanbul ignore next */ null;
                                return (
                                    <TextField
                                        {...params}
                                        id="eap-start-year"
                                        variant="standard"
                                        required
                                        label={startYearLabel}
                                        InputLabelProps={{
                                            id: 'eap-start-year-label',
                                            'data-testid': 'eap-start-year-label',
                                            htmlFor: 'eap-start-year-input',
                                        }}
                                        error={
                                            !value ||
                                            !moment(String(value), 'YYYY').isValid() ||
                                            !moment(String(value), 'YYYY').isSameOrBefore(moment(), 'year')
                                        }
                                    />
                                );
                            }}
                        />
                    </LocalizationProvider>
                );
            },
            validate: rowData => {
                const startYearMoment = moment(String(rowData.eap_start_year), 'YYYY');
                return (
                    startYearMoment.isValid() &&
                    startYearMoment.isSameOrBefore(moment(), 'year') &&
                    startYearMoment.isSameOrAfter(moment(EDITORIAL_APPOINTMENT_MIN_YEAR, 'YYYY'))
                );
            },
            cellStyle: matchesMd
                ? {
                      width: '15%',
                      maxWidth: '15%',
                      float: 'none',
                  }
                : {
                      width: '100%',
                      display: 'block',
                      boxSizing: 'border-box',
                  },
            headerStyle: {
                width: '15%',
                maxWidth: '15%',
            },
        },
        {
            title: (
                <Typography variant="caption" color="secondary">
                    {endYear.title}
                </Typography>
            ),
            field: 'eap_end_year',
            render: rowData => (
                <Typography
                    variant="body2"
                    id={`eap-end-year-${rowData.tableData.id}`}
                    data-testid={`eap-end-year-${rowData.tableData.id}`}
                >
                    {moment(String(rowData.eap_end_year), 'YYYY').format('YYYY') === moment(new Date()).format('YYYY')
                        ? locale.components.myEditorialAppointmentsList.form.locale.endYearCurrentYearLabel
                        : rowData.eap_end_year}
                </Typography>
            ),
            editComponent: ({ value, rowData, onChange }) => {
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
                                    inputFormat: `[${locale.components.myEditorialAppointmentsList.form.locale.endYearCurrentYearLabel}]`,
                                }) ||
                                {})}
                            views={['year']}
                            openTo="year"
                            closeOnSelect
                            minDate={minDate}
                            showToolbar
                            ToolbarComponent={CustomToolbar}
                            OpenPickerButtonProps={{
                                id: 'eap-end-year-button-input',
                                'data-testid': 'eap-end-year-button-input',
                            }}
                            inputProps={{
                                id: 'eap-end-year-input',
                                'data-testid': 'eap-end-year-input',
                                label: endYearLabel,
                                'aria-label': endYearLabel,
                                'aria-labelledby': 'eap-end-year-label',
                                placeholder: endYearHint,
                            }}
                            renderInput={params => {
                                const displayValue = params.inputProps?.value ?? /* istanbul ignore next */ null;

                                return (
                                    <TextField
                                        {...params}
                                        value={displayValue}
                                        id="eap-end-year"
                                        variant="standard"
                                        required
                                        helperText={
                                            !!value &&
                                            (!moment(String(value), 'YYYY').isValid() ||
                                                moment(String(value), 'YYYY').isBefore(
                                                    moment(String(rowData.eap_start_year), 'YYYY'),
                                                ))
                                                ? endYearErrorMessage
                                                : ''
                                        }
                                        label={endYearLabel}
                                        InputLabelProps={{
                                            id: 'eap-end-year-label',
                                            'data-testid': 'eap-end-year-label',
                                            htmlFor: 'eap-end-year-input',
                                        }}
                                        error={
                                            !moment(String(value), 'YYYY').isValid() ||
                                            moment(String(value), 'YYYY').isBefore(
                                                moment(String(rowData.eap_start_year), 'YYYY'),
                                            )
                                        }
                                    />
                                );
                            }}
                        />
                    </LocalizationProvider>
                );
            },
            validate: rowData => {
                const endYearMoment = moment(String(rowData.eap_end_year), 'YYYY');
                return (
                    endYearMoment.isValid() &&
                    endYearMoment.isSameOrBefore(moment(EDITORIAL_APPOINTMENT_MAX_YEAR, 'YYYY')) &&
                    endYearMoment.isSameOrAfter(moment(String(rowData.eap_start_year), 'YYYY'))
                );
            },
            cellStyle: matchesMd
                ? {
                      width: '15%',
                      maxWidth: '15%',
                      float: 'none',
                  }
                : {
                      width: '100%',
                      display: 'block',
                      boxSizing: 'border-box',
                  },
            headerStyle: {
                width: '15%',
                maxWidth: '15%',
            },
        },
    ];
};

export const MyEditorialAppointmentsList = ({ disabled, handleRowAdd, handleRowDelete, handleRowUpdate, list }) => {
    const materialTableRef = React.createRef();
    const columns = React.createRef();
    columns.current = GetColumns();

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

    return (
        <MaterialTable
            tableRef={materialTableRef}
            columns={columns.current}
            components={{
                Container: props => (
                    <StyledResponsiveWrapper
                        {...props}
                        id="my-editorial-appointments-list"
                        data-testid="my-editorial-appointments-list"
                    />
                ),
                Row: props => (
                    <MTableBodyRow
                        {...props}
                        id={`my-editorial-appointments-list-row-${props.index}`}
                        data-testid={`my-editorial-appointments-list-row-${props.index}`}
                    />
                ),
                EditRow: props => (
                    <MTableEditRow
                        {...props}
                        id={`my-editorial-appointments-list-${props.mode}-row`}
                        data-testid={`my-editorial-appointments-list-${props.mode}-row`}
                        onEditingApproved={handleEditingApproved(props)}
                        sx={{
                            '& td:not(:last-of-type)': {
                                verticalAlign: 'top',
                            },
                        }}
                    />
                ),
                Action: props => {
                    if (typeof props.action === 'function') {
                        const { icon: Icon, tooltip, ...restAction } = props.action(props.data);
                        return (
                            <MTableAction
                                {...props}
                                action={{
                                    ...restAction,
                                    tooltip,
                                    icon: () => (
                                        <Icon
                                            disabled={props.disabled}
                                            id={`my-editorial-appointments-list-row-${
                                                props.data.tableData.id
                                            }-${tooltip.toLowerCase().replace(/ /g, '-')}`}
                                            data-testid={`my-editorial-appointments-list-row-${
                                                props.data.tableData.id
                                            }-${tooltip.toLowerCase().replace(/ /g, '-')}`}
                                            {...restAction.iconProps}
                                        />
                                    ),
                                }}
                                size="small"
                            />
                        );
                    } else if (!!props.action.icon) {
                        //  Save or Cancel actions for Add/Edit/Delete actions
                        const { icon: Icon, tooltip, ...restAction } = props.action;
                        return (
                            <MTableAction
                                {...props}
                                action={{
                                    ...restAction,
                                    icon: () => (
                                        <Icon
                                            id={`my-editorial-appointments-${(!!props.data.tableData &&
                                                props.data.tableData.editing) ||
                                                'add'}-${tooltip.toLowerCase().replace(/ /g, '-')}`}
                                            data-testid={`my-editorial-appointments-${(!!props.data.tableData &&
                                                props.data.tableData.editing) ||
                                                'add'}-${tooltip.toLowerCase().replace(/ /g, '-')}`}
                                        />
                                    ),
                                }}
                            />
                        );
                    } else if (!!props.action.tooltip) {
                        //  Add action
                        const { tooltip } = props.action;
                        return (
                            <Button
                                id={`my-editorial-appointments-${tooltip.toLowerCase().replace(/ /g, '-')}`}
                                data-testid={`my-editorial-appointments-${tooltip.toLowerCase().replace(/ /g, '-')}`}
                                disabled={props.disabled || disabled}
                                variant="contained"
                                color="primary"
                                children={tooltip}
                                onClick={event => props.action.onClick(event, props.data)}
                            />
                        );
                    } /* istanbul ignore next */ else {
                        // Catch for erronious "Buttons" on rows after editing
                        /* istanbul ignore next */
                        return <React.Fragment />;
                    }
                },
            }}
            data={data}
            icons={tableIcons}
            title=""
            localization={{
                body: {
                    addTooltip: addButtonTooltip,
                    editTooltip: editButtonTooltip,
                    deleteTooltip: deleteButtonTooltip,
                },
            }}
            editable={{
                onRowUpdateCancelled: () => {},
                onRowAdd: newData => {
                    return handleRowAdd(newData)
                        .then(data => {
                            setData(prevState => {
                                return [...prevState, data];
                            });
                        })
                        .catch(() => setData(prevState => prevState));
                },
                onRowUpdate: (newData, oldData) => {
                    return handleRowUpdate(newData, oldData)
                        .then(data => {
                            setData(prevState => {
                                const list = [...prevState];
                                const target = list.find(el => el.eap_id === oldData.eap_id);
                                const index = list.indexOf(target);
                                list[index] = data;
                                return list;
                            });
                        })
                        .catch(() => setData(prevState => prevState));
                },
                onRowDelete: oldData => {
                    return handleRowDelete(oldData).then(() => {
                        return new Promise(resolve => {
                            setTimeout(() => {
                                const dataDelete = [...data];
                                const target = dataDelete.find(el => el.eap_id === oldData.eap_id);
                                const index = dataDelete.indexOf(target);
                                dataDelete.splice(index, 1);
                                setData([...dataDelete]);
                                resolve();
                            }, 1000);
                        });
                    });
                },
            }}
            options={{
                actionsColumnIndex: -1,
                addRowPosition: 'first',
                paging: false,
                search: data.length > 10,
                rowStyle: rowData => ({
                    borderLeft: moment(String(rowData.eap_end_year), 'YYYY').isBefore(moment(), 'year')
                        ? '8px solid red'
                        : '',
                }),
            }}
        />
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
