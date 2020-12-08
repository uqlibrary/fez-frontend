/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import MaterialTable, { MTableAction, MTableBodyRow, MTableEditRow } from 'material-table';
import moment from 'moment';

import { tableIcons } from './MyEditorialAppointmentsListIcons';
import Typography from '@material-ui/core/Typography';
import { KeyboardDatePicker } from '@material-ui/pickers';

import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { RoleField } from 'modules/SharedComponents/LookupFields';
import { default as locale } from 'locale/components';

import { EDITORIAL_ROLE_MAP, EDITORIAL_ROLE_OPTIONS } from 'config/general';

export const getColumns = () => {
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
                startYearLabel,
                // startYearHint,
                endYearLabel,
                // endYearHint,
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
                return (
                    <TextField
                        autoFocus
                        value={props.value}
                        onChange={e => props.onChange(e.target.value)}
                        textFieldId="eap-journal-name"
                        error={(rowData.eap_journal_name || '').length === 0}
                        label={journalNameLabel}
                        placeholder={journalNameHint}
                        required
                        fullWidth
                    />
                );
            },
            validate: rowData => !!rowData.eap_journal_name && rowData.eap_journal_name !== '',
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
                    {rowData.eap_role_name}
                </Typography>
            ),
            editComponent: props => {
                const { rowData } = props;
                const handleChange = selectedItem => {
                    const newValue = {
                        eap_role_name: selectedItem,
                        eap_role_cvo_id: Object.keys(EDITORIAL_ROLE_MAP).find(
                            key => EDITORIAL_ROLE_MAP[key] === selectedItem,
                        ),
                    };
                    props.onRowDataChange({ ...rowData, ...newValue });
                };
                const handleClear = () =>
                    props.onRowDataChange({ ...rowData, eap_role_name: null, eap_role_cvo_id: null });

                return (
                    <RoleField
                        {...props}
                        autoCompleteSelectFieldId="eap-role-name"
                        fullWidth
                        clearable
                        key={`editorial-appointment-role-${rowData.eap_role_cvo_id}`}
                        id="editorial-appointment-role"
                        floatingLabelText={editorialRoleLabel}
                        hintText={editorialRoleHint}
                        onChange={handleChange}
                        onClear={handleClear}
                        itemsList={EDITORIAL_ROLE_OPTIONS}
                        required
                        autoComplete="off"
                        error={(rowData.eap_role_name || '').trim().length === 0}
                        value={rowData.eap_role_name}
                    />
                );
            },
            validate: rowData => !!rowData.eap_role_name && rowData.eap_role_name !== null,
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
                    <KeyboardDatePicker
                        value={props.value || null}
                        onChange={value => props.onChange((!!value && value.format('YYYY')) || null)}
                        error={!moment(props.value || null).isValid() || moment(props.value).isAfter(moment(), 'year')}
                        autoOk
                        variant="inline"
                        disableToolbar
                        views={['year']}
                        id="eap-start-year"
                        required
                        label={startYearLabel}
                        disableFuture
                        inputProps={{
                            id: 'eap-start-year-input',
                            'data-testid': 'eap-start-year-input',
                            label: startYearLabel,
                            'aria-label': startYearLabel,
                            'aria-labelledby': 'eap-start-year-label',
                        }}
                        InputLabelProps={{
                            id: 'eap-start-year-label',
                            'data-testid': 'eap-start-year-label',
                            htmlFor: 'eap-start-year-input',
                        }}
                    />
                );
            },
            validate: rowData => !!rowData.eap_start_year && rowData.eap_start_year !== '',
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
                    {rowData.eap_end_year}
                </Typography>
            ),
            editComponent: props => {
                const minDate = new Date();
                minDate.setDate(1);
                minDate.setMonth(0);
                return (
                    <KeyboardDatePicker
                        value={props.value || null}
                        onChange={value => props.onChange((!!value && value.format('YYYY')) || null)}
                        error={
                            !moment(props.value || null).isValid() ||
                            !moment(props.value).isSameOrAfter(moment(), 'year')
                        }
                        autoOk
                        variant="inline"
                        disableToolbar
                        views={['year']}
                        id="eap-end-year"
                        required
                        label={endYearLabel}
                        minDate={minDate}
                        inputProps={{
                            id: 'eap-end-year-input',
                            'data-testid': 'eap-end-year-input',
                            label: endYearLabel,
                            'aria-label': endYearLabel,
                            'aria-labelledby': 'eap-end-year-label',
                        }}
                        InputLabelProps={{
                            id: 'eap-end-year-label',
                            'data-testid': 'eap-end-year-label',
                            htmlFor: 'eap-end-year-input',
                        }}
                    />
                );
            },
            validate: rowData =>
                !!rowData.eap_end_year &&
                rowData.eap_end_year !== '' &&
                moment(rowData.eap_end_year).isSameOrAfter(moment(), 'year'),
        },
    ];
};

export const MyEditorialAppointmentsList = ({ disabled, handleRowAdd, handleRowDelete, handleRowUpdate, list }) => {
    const materialTableRef = React.createRef();
    const columns = React.createRef();
    columns.current = getColumns();

    const [data, setData] = React.useState(list);

    return (
        <MaterialTable
            tableRef={materialTableRef}
            columns={columns.current}
            components={{
                Container: props => (
                    <div {...props} id="my-editorial-appointments-list" data-testid="my-editorial-appointments-list" />
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
                        id={`my-editorial-appointments-list-edit-row-${props.index}`}
                        data-testid={`my-editorial-appointments-list-edit-row-${props.index}`}
                    />
                ),
                Action: props => {
                    if (
                        typeof props.action !== 'function' &&
                        !props.action.action &&
                        props.action.position !== 'toolbar'
                    ) {
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
                                                'add'}-${tooltip.toLowerCase()}`}
                                            data-testid={`my-editorial-appointments-${(!!props.data.tableData &&
                                                props.data.tableData.editing) ||
                                                'add'}-${tooltip.toLowerCase()}`}
                                        />
                                    ),
                                }}
                            />
                        );
                    } else if (typeof props.action === 'function') {
                        const { icon: Icon, tooltip, ...restAction } = props.action(props.data);
                        return (
                            <MTableAction
                                {...props}
                                action={{
                                    ...restAction,
                                    tooltip,
                                    icon: () => (
                                        <Icon
                                            disabled={disabled}
                                            id={`my-editorial-appointments-list-row-${
                                                props.data.tableData.id
                                            }-${tooltip.toLowerCase()}`}
                                            data-testid={`my-editorial-appointments-list-row-${
                                                props.data.tableData.id
                                            }-${tooltip.toLowerCase()}`}
                                        />
                                    ),
                                }}
                            />
                        );
                    } else {
                        //  Add actions
                        const { icon: Icon, tooltip, ...restAction } = props.action;
                        return (
                            <MTableAction
                                {...props}
                                action={{
                                    ...restAction,
                                    icon: () => (
                                        <Icon
                                            id={`my-editorial-appointments-${tooltip.toLowerCase()}`}
                                            data-testid={`my-editorial-appointments-${tooltip.toLowerCase()}`}
                                        />
                                    ),
                                }}
                            />
                        );
                    }
                },
            }}
            data={data}
            icons={tableIcons}
            title=""
            editable={{
                onRowUpdateCancelled: () => {},
                onRowAdd: newData => {
                    return handleRowAdd(newData)
                        .then(() => {
                            setData(prevState => {
                                return [...prevState, newData];
                            });
                        })
                        .catch(() => setData(prevState => prevState));
                },
                onRowUpdate: (newData, oldData) => {
                    return handleRowUpdate(newData, oldData)
                        .then(() => {
                            setData(prevState => {
                                const data = [...prevState];
                                data[data.indexOf(oldData)] = newData;
                                return data;
                            });
                        })
                        .catch(() => setData(prevState => prevState));
                },
                onRowDelete: oldData => {
                    return handleRowDelete(oldData).then(() => {
                        setData(prevState => {
                            const data = [...prevState];
                            data.splice(data.indexOf(oldData), 1);
                            return data;
                        });
                    });
                },
            }}
            options={{
                actionsColumnIndex: -1,
                addRowPosition: 'first',
                paging: false,
                search: data.length > 10,
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
