/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';

import MaterialTable, { MTableBodyRow, MTableAction } from 'material-table';
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
            field: 'buj_started',
            editable: 'never',
            render: rowData => (
                <Typography data-testid="buj-started" id="buj-started" className={classes.text}>
                    {rowData.buj_started}
                </Typography>
            ),
        },
        {
            title: bulkUpdatesList.columns.user.title,
            field: 'buj_user',
            editable: 'never',
            render: rowData => (
                <Typography data-testid="buj-user" id="buj-user" className={classes.text}>
                    {rowData.buj_user}
                </Typography>
            ),
        },
        {
            title: bulkUpdatesList.columns.name.title,
            field: 'buj_name',
            editable: 'never',
            render: rowData => (
                <Typography data-testid="buj-name" id="buj-name" className={classes.text}>
                    {rowData.buj_name}
                </Typography>
            ),
        },
        {
            title: bulkUpdatesList.columns.progress.title,
            field: 'buj_progress',
            editable: 'never',
            render: rowData => (
                <Typography data-testid="buj-progress" id="buj-progress" className={classes.text}>
                    {rowData.buj_progress}
                </Typography>
            ),
        },
        {
            title: bulkUpdatesList.columns.message.title,
            field: 'buj_message',
            editable: 'never',
            render: rowData => (
                <Typography data-testid="buj-message" id="buj-message" className={classes.text}>
                    {rowData.buj_message}
                </Typography>
            ),
        },
        {
            title: bulkUpdatesList.columns.lastHeartbeat.title,
            field: 'buj_last_heartbeat',
            editable: 'never',
            render: rowData => (
                <Typography data-testid="buj-last-heartbeat" id="buj-last-heartbeat" className={classes.text}>
                    {rowData.buj_last_heartbeat}
                </Typography>
            ),
        },
        {
            title: bulkUpdatesList.columns.status.title,
            field: 'buj_status',
            editable: 'never',
            render: rowData => (
                <Typography data-testid="buj-status" id="buj-status" className={classes.text}>
                    {rowData.buj_status}
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
                Action: props => {
                    const { icon: Icon, tooltip, ...restAction } =
                        (typeof props.action === 'function' && props.action(props.data)) || props.action;
                    return (
                        <MTableAction
                            {...props}
                            action={{
                                ...restAction,
                                tooltip,
                                icon: () => (
                                    <Icon
                                        id={`bulk-updates-list-item-${
                                            props.data.tableData.id
                                        }-${tooltip.toLowerCase()}`}
                                        data-testid={`bulk-updates-list-item-${
                                            props.data.tableData.id
                                        }-${tooltip.toLowerCase()}`}
                                    />
                                ),
                            }}
                        />
                    );
                },
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
