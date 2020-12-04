/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import MaterialTable, { MTableBodyRow } from 'material-table';

import { tableIcons } from './MyEditorialAppointmentsListIcons';
import Typography from '@material-ui/core/Typography';

import { default as locale } from 'locale/components';

export const getColumns = () => {
    const {
        header: {
            columns: { journalName, role, startYear, endYear },
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
            render: rowData => rowData.eap_journal_name,
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
                    id={`my-editorial-appointment-list-row-${rowData.tableData.id}-role-name`}
                    data-testid={`my-editorial-appointment-list-row-${rowData.tableData.id}-role-name`}
                >
                    {rowData.eap_role_name}
                </Typography>
            ),
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
                    id={`my-editorial-appointment-list-row-${rowData.tableData.id}-start-year`}
                    data-testid={`my-editorial-appointment-list-row-${rowData.tableData.id}-start-year`}
                >
                    {rowData.eap_start_year}
                </Typography>
            ),
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
                    id={`my-editorial-appointment-list-row-${rowData.tableData.id}-end-year`}
                    data-testid={`my-editorial-appointment-list-row-${rowData.tableData.id}-end-year`}
                >
                    {rowData.eap_end_year}
                </Typography>
            ),
        },
    ];
};

export const MyEditorialAppointmentsList = ({ list, locale }) => {
    const materialTableRef = React.createRef();
    const columns = React.createRef();
    columns.current = getColumns({ locale });

    const [data] = React.useState(list);

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
            }}
            data={data}
            icons={tableIcons}
            title=""
            options={{
                search: false,
                paging: false,
            }}
        />
    );
};

MyEditorialAppointmentsList.propTypes = {
    list: PropTypes.array,
    locale: PropTypes.object,
};

export default React.memo(MyEditorialAppointmentsList);
