import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import locale from 'locale/components';

import * as actions from 'actions';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import CircularProgress from '@mui/material/CircularProgress';
import { DataGrid } from '@mui/x-data-grid';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

import { getSystemAlertColumns, getDefaultSorting, SYSTEM_ALERT_ACTION } from '../config';
import { transformSystemAlertRequest } from '../transformers';
import { useSystemAlertDrawer, useAlertStatus } from '../hooks';

import SystemAlertsDrawer from '../components/SystemAlertsDrawer';

const SystemAlerts = () => {
    const txt = locale.components.adminDashboard.tabs.systemalerts;

    const { adminDashboardConfigData } = useSelector(state => state.get('adminDashboardConfigReducer'));

    const {
        adminDashboardSystemAlertsData,
        adminDashboardSystemAlertsLoading,
        adminDashboardSystemAlertsFailed,
        adminDashboardSystemAlertsUpdateFailed,
    } = useSelector(state => state.get('adminDashboardSystemAlertsReducer'));

    const dispatch = useDispatch();

    const { open, row, openDrawer, closeDrawer } = useSystemAlertDrawer(adminDashboardSystemAlertsData);

    const [alertIsVisible, hideAlert] = useAlertStatus({
        message: adminDashboardSystemAlertsFailed || adminDashboardSystemAlertsUpdateFailed,
        hideAction: actions.adminDashboardSystemAlertsUpdateClear,
    });

    React.useEffect(() => {
        dispatch(actions.loadAdminDashboardSystemAlerts());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const columns = React.useMemo(
        () => getSystemAlertColumns(txt, adminDashboardConfigData.admin_users),
        [adminDashboardConfigData.admin_users, txt],
    );

    const handleRowClick = params => {
        openDrawer(params.row);
    };
    const handleCloseDrawer = () => {
        closeDrawer();
    };
    const handleSystemAlertUpdate = (action, row) => {
        const wrappedRequest = transformSystemAlertRequest({
            user: adminDashboardConfigData.logged_in_user,
            action,
            row,
        });

        dispatch(actions.adminDashboardSystemAlerts(wrappedRequest))
            .then(() => {
                /* istanbul ignore else */
                if (action === SYSTEM_ALERT_ACTION.RESOLVE) {
                    closeDrawer();
                }
                dispatch(actions.loadAdminDashboardSystemAlerts());
                dispatch(actions.loadAdminDashboardToday());
            })
            .catch(
                /* istanbul ignore next */ error => {
                    /* istanbul ignore next */
                    console.error(error);
                },
            );
    };
    const defaultSorting = getDefaultSorting('alerts');

    return (
        <StandardCard noHeader>
            <Typography fontSize={'1.25rem'} fontWeight={'300'}>
                {txt.title(adminDashboardSystemAlertsData?.length ?? /* istanbul ignore next */ '')}
                {!!adminDashboardSystemAlertsData && !!adminDashboardSystemAlertsLoading && (
                    <CircularProgress color="inherit" size={20} sx={{ marginInlineStart: 1 }} />
                )}
            </Typography>

            {alertIsVisible && (
                <Grid item xs={12} sx={{ mb: 1 }}>
                    <Alert
                        type="error_outline"
                        title={txt.error.title}
                        message={!!adminDashboardSystemAlertsUpdateFailed ? txt.error.updateFailed : txt.error.general}
                        {...(!!adminDashboardSystemAlertsUpdateFailed
                            ? {
                                  allowDismiss: true,
                                  dismissAction: () => {
                                      hideAlert();
                                  },
                              }
                            : {})}
                    />
                </Grid>
            )}
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
                    {!!adminDashboardSystemAlertsData && (
                        <>
                            <DataGrid
                                rows={adminDashboardSystemAlertsData ?? /* istanbul ignore next */ []}
                                columns={columns}
                                sortingOrder={['asc', 'desc']}
                                initialState={{
                                    pagination: {
                                        paginationModel: { page: 0, pageSize: 10 },
                                    },
                                    sorting: {
                                        sortModel: defaultSorting,
                                    },
                                }}
                                pageSizeOptions={[10, 25, 50, 100]}
                                onRowClick={handleRowClick}
                                autoHeight
                                getRowId={row => row.sat_id}
                                disableColumnMenu
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
