import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import moment from 'moment';

import locale from 'locale/components';

import * as actions from 'actions';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import CircularProgress from '@mui/material/CircularProgress';
import { DataGrid } from '@mui/x-data-grid';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import { DEFAULT_DATE_FORMAT } from '../config';
import SystemAlertsDrawer from '../components/SystemAlertsDrawer';
import { transformSystemAlertRequest } from '../transformers';

const columns = (locale, users) => {
    const alertStatus = locale.alertStatus;
    const alertStatusOption = Object.values(alertStatus);
    return [
        {
            field: 'created_date',
            headerName: locale.columns.createdDate,
            width: 150,
            valueGetter: value => moment(value).format(DEFAULT_DATE_FORMAT),
        },
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

const SystemAlerts = () => {
    const txt = locale.components.adminDashboard.systemalerts;

    const { adminDashboardConfigData } = useSelector(state => state.get('adminDashboardConfigReducer'));
    const {
        adminDashboardSystemAlertsData,
        adminDashboardSystemAlertsLoading,
        adminDashboardSystemAlertsFailed,
    } = useSelector(state => state.get('adminDashboardSystemAlertsReducer'));

    const dispatch = useDispatch();

    const [open, setOpen] = React.useState(false);
    const [row, setRow] = React.useState(null);

    React.useEffect(() => {
        dispatch(actions.loadAdminDashboardSystemAlerts());
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
        const wrappedRequest = transformSystemAlertRequest(action, row);

        dispatch(actions.adminDashboardSystemAlerts(wrappedRequest))
            .then(() => {
                dispatch(actions.loadAdminDashboardSystemAlerts());
            })
            .catch(error => {
                console.error(error);
            });
    };
    return (
        <StandardCard noHeader>
            <Typography fontSize={'1.25rem'} fontWeight={'300'}>
                {txt.title(adminDashboardSystemAlertsData?.length ?? '')}
                {!!adminDashboardSystemAlertsData && !!adminDashboardSystemAlertsLoading && (
                    <CircularProgress color="inherit" size={20} sx={{ marginInlineStart: 1 }} />
                )}
            </Typography>

            {!!!adminDashboardSystemAlertsData && adminDashboardSystemAlertsLoading && (
                <Skeleton
                    animation="wave"
                    height={50}
                    width={'100%'}
                    id={'admin-dashboard-systemalerts-skeleton'}
                    data-testid={'admin-dashboard-systemalerts-skeleton'}
                />
            )}
            <Grid container>
                <Grid item xs={12}>
                    {adminDashboardSystemAlertsFailed && txt.updateFailed}
                    {!!adminDashboardSystemAlertsData && (
                        <>
                            <DataGrid
                                rows={adminDashboardSystemAlertsData ?? []}
                                columns={columns(txt, adminDashboardConfigData.admin_users)}
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
                                locale={txt}
                            />
                        </>
                    )}
                </Grid>
            </Grid>
        </StandardCard>
    );
};

export default React.memo(SystemAlerts);
