/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';

import MaterialTable, { MTableBodyRow, MTableEditRow } from 'material-table';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { tableIcons } from './BulkUpdatesListIcons';

import componentsLocale from 'locale/components';

export const useStyles = makeStyles(() => ({
    text: {
        fontSize: 13,
    },
}));

export const getColumns = classes => {
    const {
        components: { bulkUpdatesList },
    } = componentsLocale;
    return [
        {
            title: bulkUpdatesList.columns.started.title,
            field: 'bul_started',
            editable: 'never',
            render: rowData => (
                <Typography data-testid="bul-started" id="bul-started" className={classes.text}>
                    {rowData.bul_started}
                </Typography>
            ),
        },
        {
            title: bulkUpdatesList.columns.user.title,
            field: 'bul_user',
            editable: 'never',
            render: rowData => (
                <Typography data-testid="bul-user" id="bul-user" className={classes.text}>
                    {rowData.bul_user}
                </Typography>
            ),
        },
        {
            title: bulkUpdatesList.columns.name.title,
            field: 'bul_name',
            editable: 'never',
            render: rowData => (
                <Typography data-testid="bul-name" id="bul-name" className={classes.text}>
                    {rowData.bul_name}
                </Typography>
            ),
        },
        {
            title: bulkUpdatesList.columns.progress.title,
            field: 'bul_progress',
            editable: 'never',
            render: rowData => (
                <Typography data-testid="bul-progress" id="bul-progress" className={classes.text}>
                    {rowData.bul_progress}
                </Typography>
            ),
        },
        {
            title: bulkUpdatesList.columns.message.title,
            field: 'bul_message',
            editable: 'never',
            render: rowData => (
                <Typography data-testid="bul-message" id="bul-message" className={classes.text}>
                    {rowData.bul_message}
                </Typography>
            ),
        },
        {
            title: bulkUpdatesList.columns.lastHeartbeat.title,
            field: 'bul_last_heartbeat',
            editable: 'never',
            render: rowData => (
                <Typography data-testid="bul-last-heartbeat" id="bul-last-heartbeat" className={classes.text}>
                    {rowData.bul_last_heartbeat}
                </Typography>
            ),
        },
        {
            title: bulkUpdatesList.columns.status.title,
            field: 'bul_status',
            editable: 'never',
            render: rowData => (
                <Typography data-testid="bul-status" id="bul-status" className={classes.text}>
                    {rowData.bul_status}
                </Typography>
            ),
        },
    ];
};

export const BulkUpdatesList = ({ list }) => {
    const classes = useStyles();
    const {
        components: { bulkUpdatesList },
    } = componentsLocale;

    const materialTableRef = React.createRef();
    const columns = React.createRef();
    columns.current = getColumns(classes);

    const [data] = React.useState(list);

    return (
        <MaterialTable
            id="bulk-updates-list"
            tableRef={materialTableRef}
            columns={columns.current}
            components={{
                Container: props => <Paper {...props} style={{ padding: 16 }} />,
                Row: props => (
                    <MTableBodyRow
                        {...props}
                        className={classes.text}
                        id={`bulk-updates-list-item-${props.index}`}
                        data-testid={`bulk-updates-list-item-${props.index}`}
                    />
                ),
            }}
            data={data}
            icons={tableIcons}
            title={bulkUpdatesList.tableTitle}
            options={{
                actionsColumnIndex: -1,
                grouping: false,
                draggable: false,
                paging: false,
                search: false,
            }}
        />
    );
};

BulkUpdatesList.propTypes = {
    list: PropTypes.array,
};

export default React.memo(BulkUpdatesList);
