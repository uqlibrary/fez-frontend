import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { useAccountContext } from 'context';
import * as actions from 'actions';

import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import { DataGrid } from '@mui/x-data-grid';

import SystemAlertsDrawer from './SystemAlertsDrawer';
import { transformSystemAlertRequest } from '../transformers';

const columns = (locale, users) => {
    const alertStatus = locale.alertStatus;
    const alertStatusOption = Object.values(alertStatus);
    return [
        { field: 'created_date', headerName: locale.columns.createdDate, width: 150 },
        { field: 'topic', headerName: locale.columns.topic, flex: 1 },
        {
            field: 'status',
            headerName: locale.columns.status,
            width: 160,
            valueGetter: (_, row) =>
                !!row.assigned_to
                    ? users.find(user => user.id === row.assigned_to)?.name ?? alertStatus.UNKNOWN
                    : alertStatus.UNASSIGNED,
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
};

const SystemAlertsDataTable = ({ locale }) => {
    const { account } = useAccountContext();
    const dispatch = useDispatch();

    const [open, setOpen] = React.useState(false);
    const [row, setRow] = React.useState(null);

    const { adminDashboardConfigData } = useSelector(state => state.get('adminDashboardConfigReducer'));
    const {
        adminDashboardSystemAlertsData,
        adminDashboardSystemAlertsLoading,
        adminDashboardSystemAlertsFailed,
    } = useSelector(state => state.get('adminDashboardSystemAlertsReducer'));

    React.useEffect(() => {
        if (!!adminDashboardConfigData) dispatch(actions.loadAdminDashboardSystemAlerts());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRowClick = params => {
        setRow(params.row);
        setOpen(true);
    };
    const handleCloseDrawer = () => {
        setOpen(false);
    };
    const handleSystemAlertUpdate = (action, row) => {
        console.log(account, action, row);

        const wrappedRequest = transformSystemAlertRequest(action, row);

        dispatch(actions.adminDashboardSystemAlerts(wrappedRequest))
            .then(() => {
                dispatch(actions.loadAdminDashboardSystemAlerts());
            })
            .catch(error => {
                console.error(error);
            });
    };
    if (!!!adminDashboardSystemAlertsData && adminDashboardSystemAlertsLoading) {
        return (
            <Skeleton
                animation="wave"
                height={50}
                width={'100%'}
                id={'admin-dashboard-systemalerts-skeleton'}
                data-testid={'admin-dashboard-systemalerts-skeleton'}
            />
        );
    }

    return (
        <React.Fragment>
            {adminDashboardSystemAlertsFailed && locale.updateFailed}

            <DataGrid
                rows={adminDashboardSystemAlertsData ?? []}
                columns={columns(locale, adminDashboardConfigData.admin_users)}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                }}
                pageSizeOptions={[10, 25, 50, 100]}
                onRowClick={handleRowClick}
                autoHeight
            />
            <SystemAlertsDrawer
                open={open}
                row={row}
                onCloseDrawer={handleCloseDrawer}
                onSystemAlertUpdate={handleSystemAlertUpdate}
                locale={locale}
            />
        </React.Fragment>
    );
};

SystemAlertsDataTable.propTypes = {
    locale: PropTypes.object.isRequired,
};

export default React.memo(SystemAlertsDataTable);
