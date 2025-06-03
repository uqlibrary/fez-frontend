/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DataGrid } from '@mui/x-data-grid';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import componentsLocale from 'locale/components';

const classes = {
    text: {
        fontSize: 13,
        py: 2,
    },
};

const {
    components: { bulkUpdatesList },
} = componentsLocale;

const getColumns = () => {
    const getDateTime = date =>
        !!date
            ? moment
                  .utc(date, 'YYYY-MM-DD HH:mm:ss')
                  .local()
                  .format('YYYY-MM-DD HH:mm:ss')
            : '-';

    return [
        {
            headerName: bulkUpdatesList.columns.createdAt.title,
            field: 'buj_created_at',
            disableColumnMenu: true,
            minWidth: 120,
            renderCell: params => (
                <Typography data-testid="buj-created-at" id="buj-created-at" sx={{ ...classes.text }}>
                    {getDateTime(params.value)}
                </Typography>
            ),
        },
        {
            headerName: bulkUpdatesList.columns.startedAt.title,
            field: 'buj_started_at',
            disableColumnMenu: true,
            minWidth: 120,
            renderCell: params => (
                <Typography data-testid="buj-started-at" id="buj-started-at" sx={{ ...classes.text }}>
                    {getDateTime(params.value)}
                </Typography>
            ),
        },
        {
            headerName: bulkUpdatesList.columns.finishedAt.title,
            field: 'buj_finished_at',
            disableColumnMenu: true,
            minWidth: 120,
            renderCell: params => (
                <Typography data-testid="buj-finished-at" id="buj-finished-at" sx={{ ...classes.text }}>
                    {getDateTime(params.value)}
                </Typography>
            ),
        },
        {
            headerName: bulkUpdatesList.columns.user.title,
            field: 'user',
            disableColumnMenu: true,
            minWidth: 100,
            valueGetter: (params, row) => row.fez_user.usr_username,
            renderCell: params => (
                <Typography data-testid="fez-user-username" id="fez-user-username" sx={{ ...classes.text }}>
                    {params.value}
                </Typography>
            ),
        },
        {
            headerName: bulkUpdatesList.columns.name.title,
            field: 'name',
            disableColumnMenu: true,
            minWidth: 120,
            valueGetter: (params, row) => row.fez_user.usr_full_name,
            renderCell: params => (
                <Typography data-testid="fez-user-fullname" id="fez-user-fullname" sx={{ ...classes.text }}>
                    {params.value}
                </Typography>
            ),
        },
        {
            headerName: bulkUpdatesList.columns.status.title,
            field: 'buj_status',
            disableColumnMenu: true,
            minWidth: 65,
            renderCell: params => (
                <Typography data-testid="buj-status" id="buj-status" sx={{ ...classes.text }}>
                    {params.value}
                </Typography>
            ),
        },
        {
            headerName: bulkUpdatesList.columns.failedRecords.title,
            field: 'buj_failed_records',
            disableColumnMenu: true,
            minWidth: 100,
            renderCell: params => (
                <Typography data-testid="buj-failed-records" id="buj-failed-records" sx={{ ...classes.text }}>
                    {params.value}
                </Typography>
            ),
        },
        {
            headerName: bulkUpdatesList.columns.processedCount.title,
            field: 'buj_processed_count',
            disableColumnMenu: true,
            minWidth: 50,
            renderCell: params => (
                <Typography data-testid="buj-processed-count" id="buj-processed-count" sx={{ ...classes.text }}>
                    {params.value}
                </Typography>
            ),
        },
        {
            headerName: bulkUpdatesList.columns.totalCount.title,
            field: 'buj_total_count',
            disableColumnMenu: true,
            minWidth: 50,
            renderCell: params => (
                <Typography data-testid="buj-total-count" id="buj-total-count" sx={{ ...classes.text }}>
                    {params.value}
                </Typography>
            ),
        },
    ];
};

export const BulkUpdatesList = ({ list }) => {
    const [data] = React.useState(list);

    return (
        <Paper
            id="bulk-updates-list"
            data-testid="bulk-updates-list"
            sx={{ display: 'flex', flexDirection: 'column', p: 2 }}
        >
            <DataGrid
                columns={getColumns()}
                rows={data}
                getRowId={row => row.buj_id}
                sortingOrder={['asc', 'desc']}
                hideFooter
                autosizeOnMount
                autoSizeOptions={{
                    includeOutliers: true,
                    includeHeaders: true,
                }}
                sx={{
                    border: 0,
                    '& .MuiDataGrid-columnHeaderTitle': {
                        whiteSpace: 'normal',
                        lineHeight: 'normal',
                    },
                }}
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'buj_created_at', sort: 'desc' }],
                    },
                }}
                localeText={{
                    noRowsLabel: bulkUpdatesList.noRowLabel,
                }}
            />
        </Paper>
    );
};

BulkUpdatesList.propTypes = {
    list: PropTypes.array,
};

export default React.memo(BulkUpdatesList);
