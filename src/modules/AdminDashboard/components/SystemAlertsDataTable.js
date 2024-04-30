import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import Chip from '@mui/material/Chip';
import { DataGrid } from '@mui/x-data-grid';

import SystemAlertsDrawer from './SystemAlertsDrawer';

const ALERTSTATUS = {
    UNASSIGNED: 'Unassigned',
    UNKNOWN: 'Unknown',
};
const alertStatusOption = Object.values(ALERTSTATUS);

const columns = users => [
    { field: 'created_date', headerName: 'Created', width: 150 },
    { field: 'topic', headerName: 'Topic', flex: 1 },
    {
        field: 'status',
        headerName: 'Status',
        width: 160,
        valueGetter: (value, row) =>
            !!row.assigned_to
                ? users.find(user => user.id === row.assigned_to)?.name ?? ALERTSTATUS.UNKNOWN
                : ALERTSTATUS.UNASSIGNED,
        renderCell: params => (
            <Chip
                data-testid={`alert-status-${params.id}`}
                label={params.value}
                variant="outlined"
                size="small"
                color={alertStatusOption.includes(params.value) ? 'default' : 'primary'}
            />
        ),
    },
];

const SystemAlertsDataTable = () => {
    const [open, setOpen] = React.useState(false);
    const [row, setRow] = React.useState(null);
    const { adminDashboardConfigData } = useSelector(state => state.get('adminDashboardConfigReducer'));
    const { adminDashboardSystemAlertsData } = useSelector(state => state.get('adminDashboardSystemAlertsReducer'));

    const handleRowClick = params => {
        setRow(params.row);
        setOpen(true);
    };
    const handleCloseDrawer = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <DataGrid
                rows={adminDashboardSystemAlertsData}
                columns={columns(adminDashboardConfigData.admin_users)}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                }}
                pageSizeOptions={[10, 25, 50, 100]}
                onRowClick={handleRowClick}
            />
            <SystemAlertsDrawer open={open} row={row} onCloseDrawer={handleCloseDrawer} />
        </React.Fragment>
    );
};

SystemAlertsDataTable.propTypes = {
    param: PropTypes.any,
};

export default React.memo(SystemAlertsDataTable);
