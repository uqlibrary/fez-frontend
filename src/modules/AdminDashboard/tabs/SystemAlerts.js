import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import locale from 'locale/components';

import * as actions from 'actions';

import Grid from '@mui/material/GridLegacy';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import CircularProgress from '@mui/material/CircularProgress';
import { DataGrid } from '@mui/x-data-grid';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

import { getDefaultSorting, SYSTEM_ALERT_ACTION } from '../config';
import { transformSystemAlertRequest } from '../transformers';
import {
    useSystemAlertDrawer,
    useAlertStatus,
    useSystemAlertColumns,
    useAdminDashboardConfig,
    useAdminUserOptions,
} from '../hooks';

import SystemAlertsDrawer from '../components/SystemAlertsDrawer';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const SystemAlerts = () => {
    const txt = locale.components.adminDashboard.tabs.systemalerts;

    const adminDashboardConfigData = useAdminDashboardConfig();

    const {
        adminDashboardSystemAlertsData,
        adminDashboardSystemAlertsLoading,
        adminDashboardSystemAlertsFailed,
        adminDashboardSystemAlertsUpdateFailed,
    } = useSelector(state => state.get('adminDashboardSystemAlertsReducer'));

    const { adminDashboardSystemAlertsBatchAssignUpdating, adminDashboardSystemAlertsBatchAssignFailed } = useSelector(
        state => state.get('adminDashboardSystemAlertsBatchAssignReducer'),
    );

    const dispatch = useDispatch();

    const { open, row, openDrawer, closeDrawer } = useSystemAlertDrawer(adminDashboardSystemAlertsData);

    const [alertIsVisible, hideAlert] = useAlertStatus({
        message:
            adminDashboardSystemAlertsFailed ||
            adminDashboardSystemAlertsUpdateFailed ||
            adminDashboardSystemAlertsBatchAssignFailed,
        hideAction: actions.adminDashboardSystemAlertsUpdateClear,
    });

    const [selectionModel, setSelectionModel] = React.useState([]);
    const [assignValue, setAssignValue] = React.useState(null);

    const selectedRows = React.useMemo(() => {
        if (!adminDashboardSystemAlertsData) return [];

        const selectedIds = new Set(selectionModel);
        return adminDashboardSystemAlertsData.filter(r => selectedIds.has(r.sat_id));
    }, [selectionModel, adminDashboardSystemAlertsData]);

    const canAssign = React.useMemo(() => {
        return selectedRows.length > 0 && selectedRows.every(r => !r.sat_resolved_by);
    }, [selectedRows]);

    const assignOptions = useAdminUserOptions();

    React.useEffect(() => {
        dispatch(actions.loadAdminDashboardSystemAlerts());
        dispatch(actions.adminDashboardSystemAlertsBatchAssignClear());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const columns = useSystemAlertColumns(txt);

    const handleRowClick = params => {
        openDrawer(params.row);
    };
    const handleCloseDrawer = () => {
        closeDrawer();
    };

    const refreshData = () => {
        dispatch(actions.loadAdminDashboardSystemAlerts());
        dispatch(actions.loadAdminDashboardToday());
    };

    const handleSystemAlertUpdate = (action, row) => {
        const wrappedRequest = transformSystemAlertRequest({
            user: adminDashboardConfigData.logged_in_user,
            action,
            row,
        });

        dispatch(actions.adminDashboardSystemAlerts(row.sat_id, wrappedRequest))
            .then(() => {
                /* istanbul ignore else */
                if (action === SYSTEM_ALERT_ACTION.RESOLVE) {
                    closeDrawer();
                }
                refreshData();
            })
            .catch(
                /* istanbul ignore next */ error => {
                    /* istanbul ignore next */
                    console.error(error);
                },
            );
    };

    const handleBatchAssign = userId => {
        /* istanbul ignore next */
        if (!userId) return;

        const payload = {
            ids: [...selectionModel],
            sat_assigned_to: userId,
        };

        dispatch(actions.adminDashboardSystemAlertsBatchAssign(payload))
            .then(() => {
                setSelectionModel([]);
                refreshData();
            })
            .catch(/* istanbul ignore next */ () => {});
    };

    const defaultSorting = getDefaultSorting('alerts');

    return (
        <StandardCard noHeader>
            <Typography
                sx={{
                    fontSize: '1.25rem',
                    fontWeight: '300',
                }}
            >
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
                            {selectionModel.length > 0 && (
                                <Box sx={{ mb: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <Typography>{selectionModel.length} selected</Typography>

                                    <Autocomplete
                                        size="small"
                                        sx={{ minWidth: 180 }}
                                        options={assignOptions}
                                        value={assignValue}
                                        getOptionLabel={option => option.preferred_name}
                                        onChange={(_, selectedUser) => {
                                            /* istanbul ignore next */
                                            if (!selectedUser) return;

                                            handleBatchAssign(selectedUser.id);
                                            setAssignValue(null); // reset after action
                                        }}
                                        renderInput={params => <TextField {...params} label="Assign" size="small" />}
                                        disabled={!canAssign || adminDashboardSystemAlertsBatchAssignUpdating}
                                    />
                                    {adminDashboardSystemAlertsBatchAssignUpdating && <CircularProgress size={16} />}
                                </Box>
                            )}
                            <DataGrid
                                rows={adminDashboardSystemAlertsData ?? /* istanbul ignore next */ []}
                                columns={columns}
                                sortingOrder={['asc', 'desc']}
                                initialState={{
                                    pagination: {
                                        paginationModel: { page: 0, pageSize: 25 },
                                    },
                                    sorting: {
                                        sortModel: defaultSorting,
                                    },
                                }}
                                pageSizeOptions={[10, 25, 50, 100]}
                                onRowClick={handleRowClick}
                                autoHeight
                                getRowId={row => row.sat_id}
                                disableColumnSelector
                                checkboxSelection
                                disableRowSelectionOnClick
                                rowSelectionModel={selectionModel}
                                onRowSelectionModelChange={setSelectionModel}
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
