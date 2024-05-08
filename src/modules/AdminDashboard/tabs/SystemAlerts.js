import React from 'react';
import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import locale from 'locale/components';

import SystemAlertsDataTable from '../components/SystemAlertsDataTable';

const SystemAlerts = () => {
    const txt = locale.components.adminDashboard.systemalerts;

    const { adminDashboardConfigSuccess } = useSelector(state => state.get('adminDashboardConfigReducer'));
    const { adminDashboardSystemAlertsData, adminDashboardSystemAlertsLoading } = useSelector(state =>
        state.get('adminDashboardSystemAlertsReducer'),
    );

    if (!adminDashboardConfigSuccess) {
        return (
            <Typography fontSize={'1rem'} fontWeight={400} textAlign={'center'}>
                {txt.loading.noconfig}
            </Typography>
        );
    }

    return (
        <Box>
            <Typography fontSize={'1.25rem'} fontWeight={'300'}>
                {txt.title(adminDashboardSystemAlertsData?.length ?? '')}
                {!!adminDashboardSystemAlertsData && !!adminDashboardSystemAlertsLoading && (
                    <CircularProgress color="inherit" size={20} sx={{ marginInlineStart: 1 }} />
                )}
            </Typography>
            <Grid container>
                <Grid item xs={12}>
                    <SystemAlertsDataTable locale={txt} />
                </Grid>
            </Grid>
        </Box>
    );
};

export default React.memo(SystemAlerts);
