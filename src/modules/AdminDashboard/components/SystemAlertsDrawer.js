import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

import { ExternalLink } from 'modules/SharedComponents/ExternalLink';

const StyledDivider = styled(Divider)(({ theme }) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));

const SystemAlertsDrawer = ({ locale, row, open, onCloseDrawer, onSystemAlertUpdate }) => {
    const txt = locale.drawer;
    const users = useSelector(
        state => state.get('adminDashboardConfigReducer')?.adminDashboardConfigData?.admin_users ?? [],
    );
    const { adminDashboardSystemAlertsUpdating } = useSelector(state => state.get('adminDashboardSystemAlertsReducer'));

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const adminUsers = React.useMemo(() => [{ id: 0, name: locale.alertStatus.UNASSIGNED }, ...users], [users]);

    let buttonLabel;
    if (!!!row?.sat_assigned_to || !!row?.sat_resolved_by) buttonLabel = null;
    else if (!!row?.sat_assigned_to && !row?.sat_resolved_by) {
        buttonLabel = !adminDashboardSystemAlertsUpdating ? txt.markResolved : txt.updating;
    }

    const handleCloseDrawer = props => {
        if (!adminDashboardSystemAlertsUpdating) onCloseDrawer(props);
    };

    const handleAssignedChange = (_, newValue) => {
        onSystemAlertUpdate('assign', newValue);
    };

    const handleResolveButtonClick = () => {
        onSystemAlertUpdate('resolve', row);
    };

    return (
        !!row && (
            <Drawer anchor="right" open={open} onClose={handleCloseDrawer} id="system-alert-detail">
                <Box
                    sx={{ width: [320, 500] }}
                    role="presentation"
                    padding={2}
                    boxSizing={'border-box'}
                    display={'flex'}
                    flex={1}
                    flexDirection={'column'}
                >
                    <Typography fontSize={'1.45rem'} fontWeight={500}>
                        {row.sat_title}
                    </Typography>
                    <ExternalLink
                        id={'system-alert-detail-link'}
                        data-testid={'system-alert-detail-link'}
                        href={row.sat_link}
                    >
                        {row.sat_link}
                    </ExternalLink>
                    <StyledDivider />
                    <Grid container spacing={1}>
                        <Grid item xs={4}>
                            <Typography fontWeight={400}>{txt.alertId}</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            {row.sat_id}
                        </Grid>
                        <Grid item xs={4}>
                            <Typography fontWeight={400}>{txt.received}</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            {row.sat_created_date}
                        </Grid>
                    </Grid>
                    <StyledDivider />
                    <Typography>{row.sat_content}</Typography>
                    <StyledDivider />
                    <Autocomplete
                        id="alert-detail-user"
                        fullWidth
                        variant="standard"
                        renderInput={params => (
                            <TextField
                                {...params}
                                label={txt.status}
                                helperText={txt.statusHelpText}
                                variant="standard"
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <React.Fragment>
                                            {adminDashboardSystemAlertsUpdating ? (
                                                <CircularProgress color="inherit" size={20} />
                                            ) : null}
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                    ),
                                }}
                            />
                        )}
                        options={adminUsers}
                        getOptionLabel={option => option.name}
                        value={
                            !!row.sat_assigned_to
                                ? adminUsers.find(user => user.id === row.sat_assigned_to)
                                : adminUsers[0]
                        }
                        onChange={handleAssignedChange}
                        disabled={adminDashboardSystemAlertsUpdating || !!row.sat_resolved_by}
                    />
                    {!!buttonLabel && (
                        <Box display={'flex'} flex={1} flexDirection={'column'} justifyContent={'flex-end'}>
                            <Button
                                fullWidth
                                color="primary"
                                variant="contained"
                                disabled={
                                    adminDashboardSystemAlertsUpdating ||
                                    !!!row.sat_assigned_to ||
                                    !!row.sat_resolved_by
                                }
                                onClick={handleResolveButtonClick}
                            >
                                {buttonLabel}
                            </Button>
                        </Box>
                    )}
                </Box>
            </Drawer>
        )
    );
};

SystemAlertsDrawer.propTypes = {
    locale: PropTypes.object.isRequired,
    row: PropTypes.object,
    open: PropTypes.bool.isRequired,
    onCloseDrawer: PropTypes.func.isRequired,
    onSystemAlertUpdate: PropTypes.func.isRequired,
};

export default React.memo(SystemAlertsDrawer);
