import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import locale from 'locale/components';
import * as actions from 'actions';

import SystemAlertsDataTable from '../components/SystemAlertsDataTable';

const SystemAlerts = () => {
    const txt = locale.components.adminDashboard.systemalerts;

    const dispatch = useDispatch();
    const { adminDashboardConfigSuccess } = useSelector(state => state.get('adminDashboardConfigReducer'));
    const {
        adminDashboardSystemAlertsData,
        adminDashboardSystemAlertsLoading,
        adminDashboardSystemAlertsSuccess,
    } = useSelector(state => state.get('adminDashboardSystemAlertsReducer'));

    useEffect(() => {
        if (adminDashboardConfigSuccess) dispatch(actions.loadAdminDashboardSystemAlerts());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!adminDashboardConfigSuccess) {
        return (
            <Typography fontSize={'1rem'} fontWeight={400} textAlign={'center'}>
                {txt.loading.noconfig}
            </Typography>
        );
    }

    if (!!!adminDashboardSystemAlertsData && adminDashboardSystemAlertsSuccess) {
        return (
            <Typography fontSize={'1rem'} fontWeight={400} textAlign={'center'}>
                {txt.loading.nodata}
            </Typography>
        );
    }

    return (
        <Box>
            <Typography fontSize={'1.25rem'} fontWeight={'300'}>
                {txt.title(adminDashboardSystemAlertsData?.length ?? 0)}
            </Typography>
            <Grid container>
                <Grid item xs={12}>
                    {!!adminDashboardSystemAlertsLoading && (
                        <Skeleton
                            animation="wave"
                            height={50}
                            width={'100%'}
                            id={'admin-dashboard-systemalerts-skeleton'}
                            data-testid={'admin-dashboard-systemalerts-skeleton'}
                        />
                    )}
                    {adminDashboardSystemAlertsSuccess && <SystemAlertsDataTable />}
                </Grid>
            </Grid>
        </Box>
    );
};

export default React.memo(SystemAlerts);
