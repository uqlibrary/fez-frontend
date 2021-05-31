/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import MaterialTable, { MTableAction, MTableBodyRow, MTableEditRow } from 'material-table';
import moment from 'moment';

import { tableIcons } from './MyEditorialAppointmentsListIcons';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { KeyboardDatePicker } from '@material-ui/pickers';

import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { RoleField, JournalIdField } from 'modules/SharedComponents/LookupFields';
import { default as locale } from 'locale/components';

import { EDITORIAL_ROLE_MAP, EDITORIAL_ROLE_OPTIONS, EDITORIAL_ROLE_OTHER } from 'config/general';

export const CustomToolbar = props => {
    return (
        <Typography
            variant="h6"
            align="center"
            style={{
                margin: '8px',
                cursor: 'pointer',
            }}
            onClick={() => props.onChange(moment(new Date(), 'YYYY'))}
        >
            {locale.components.myEditorialAppointmentsList.form.locale.endYearCurrentYearLabel}
        </Typography>
    );
};

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
                otherRoleLabel,
                otherRoleHint,
                startYearLabel,
                startYearErrorMessage,
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
            cellStyle: {
                width: '45%',
                maxWidth: '45%',
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
                            <TextField
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
            cellStyle: {
                width: '25%',
                maxWidth: '25%',
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
                    <KeyboardDatePicker
                        value={(!!props.value && moment(String(props.value), 'YYYY')) || null}
                        onChange={value => props.onChange((!!value && value.format('YYYY')) || null)}
                        error={
                            !moment(String(props.value), 'YYYY').isValid() ||
                            !moment(String(props.value), 'YYYY').isSameOrBefore(moment(), 'year')
                        }
                        autoOk
                        variant="inline"
                        disableToolbar
                        views={['year']}
                        id="eap-start-year"
                        required
                        label={startYearLabel}
                        disableFuture
                        maxDateMessage={startYearErrorMessage}
                        invalidDateMessage={startYearErrorMessage}
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
            validate: rowData =>
                moment(String(rowData.eap_start_year), 'YYYY').isValid() &&
                moment(String(rowData.eap_start_year), 'YYYY').isSameOrBefore(moment(), 'year'),
            cellStyle: {
                width: '15%',
                maxWidth: '15%',
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
                    {rowData.eap_end_year}
                </Typography>
            ),
            editComponent: props => {
                const minDate = new Date();
                minDate.setDate(1);
                minDate.setMonth(0);
                return (
                    <KeyboardDatePicker
                        value={(!!props.value && moment(String(props.value), 'YYYY')) || null}
                        onChange={value => props.onChange((!!value && value.format('YYYY')) || null)}
                        error={
                            !moment(String(props.value), 'YYYY').isValid() ||
                            !moment(String(props.value), 'YYYY').isSameOrAfter(moment(), 'year')
                        }
                        autoOk
                        variant="inline"
                        views={['year']}
                        id="eap-end-year"
                        required
                        label={endYearLabel}
                        minDate={minDate}
                        minDateMessage={endYearErrorMessage}
                        invalidDateMessage={endYearErrorMessage}
                        inputProps={{
                            id: 'eap-end-year-input',
                            'data-testid': 'eap-end-year-input',
                            label: endYearLabel,
                            'aria-label': endYearLabel,
                            'aria-labelledby': 'eap-end-year-label',
                            placeholder: endYearHint,
                        }}
                        InputLabelProps={{
                            id: 'eap-end-year-label',
                            'data-testid': 'eap-end-year-label',
                            htmlFor: 'eap-end-year-input',
                        }}
                        ToolbarComponent={CustomToolbar}
                    />
                );
            },
            validate: rowData =>
                moment(String(rowData.eap_end_year), 'YYYY').isValid() &&
                moment(String(rowData.eap_end_year), 'YYYY').isSameOrAfter(moment(), 'year'),
            cellStyle: {
                width: '15%',
                maxWidth: '15%',
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
    columns.current = getColumns();

    const {
        form: {
            locale: { addButtonTooltip, editButtonTooltip, deleteButtonTooltip },
        },
    } = locale.components.myEditorialAppointmentsList;

    const [data, setData] = React.useState(list);

    const handleEditingApproved = props => (action, newData, oldData) => {
        const invalid = props.columns.some(column => !column.validate(newData));

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
                        onEditingApproved={handleEditingApproved(props)}
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
                                                'add'}-${tooltip.toLowerCase().replace(/ /g, '-')}`}
                                            data-testid={`my-editorial-appointments-${(!!props.data.tableData &&
                                                props.data.tableData.editing) ||
                                                'add'}-${tooltip.toLowerCase().replace(/ /g, '-')}`}
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
                                            }-${tooltip.toLowerCase().replace(/ /g, '-')}`}
                                            data-testid={`my-editorial-appointments-list-row-${
                                                props.data.tableData.id
                                            }-${tooltip.toLowerCase().replace(/ /g, '-')}`}
                                        />
                                    ),
                                }}
                            />
                        );
                    } else {
                        //  Add actions
                        const { tooltip } = props.action;
                        return (
                            <Button
                                id={`my-editorial-appointments-${tooltip.toLowerCase().replace(/ /g, '-')}`}
                                data-testid={`my-editorial-appointments-${tooltip.toLowerCase().replace(/ /g, '-')}`}
                                disabled={props.disabled}
                                variant="contained"
                                color="primary"
                                children={tooltip}
                                onClick={event => props.action.onClick(event, props.data)}
                            />
                        );
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
                                list[list.indexOf(oldData)] = data;
                                return list;
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
