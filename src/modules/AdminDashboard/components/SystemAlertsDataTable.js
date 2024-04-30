import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { DataGrid } from '@mui/x-data-grid';

const columns = users => [
    { field: 'created_date', headerName: 'Created', width: 150 },
    { field: 'topic', headerName: 'Topic' },
    {
        field: 'status',
        headerName: 'Status',
        width: 160,
        valueGetter: (value, row) =>
            !!row.assigned_to ? users.find(user => user.id === row.assigned_to)?.name ?? 'Unknown' : 'Unassigned',
    },
];

const SystemAlertsDataTable = () => {
    const { adminDashboardConfigData } = useSelector(state => state.get('adminDashboardConfigReducer'));
    const { adminDashboardSystemAlertsData } = useSelector(state => state.get('adminDashboardSystemAlertsReducer'));

    return (
        <DataGrid
            rows={adminDashboardSystemAlertsData}
            columns={columns(adminDashboardConfigData.admin_users)}
            initialState={{
                pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                },
            }}
            pageSizeOptions={[10, 25, 50, 100]}
        />
    );
};

SystemAlertsDataTable.propTypes = {
    param: PropTypes.any,
};

export default React.memo(SystemAlertsDataTable);
