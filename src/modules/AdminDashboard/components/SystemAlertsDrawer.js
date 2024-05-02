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

const SystemAlertsDrawer = ({ row, open, onCloseDrawer, onSystemAlertUpdate }) => {
    const users = useSelector(
        state => state.get('adminDashboardConfigReducer')?.adminDashboardConfigData?.admin_users ?? [],
    );
    const { adminDashboardSystemAlertsUpdating } = useSelector(state => state.get('adminDashboardSystemAlertsReducer'));

    const adminUsers = React.useMemo(() => [{ id: 0, name: 'Unassigned' }, ...users], [users]);

    let buttonLabel;
    if (!!!row?.assigned_to || !!row?.resolved_by) buttonLabel = null;
    else if (!!row?.assigned_to && !row?.resolved_by) {
        buttonLabel = !adminDashboardSystemAlertsUpdating ? 'Mark as resolved' : 'Updating...';
    }

    const handleCloseDrawer = props => {
        if (!adminDashboardSystemAlertsUpdating) onCloseDrawer(props);
    };

    const handleAssignedChange = (_, newValue) => {
        // console.log(newValue);
        // setSystemAlert({ ...row, assigned_to: newValue.id === 0 ? null : newValue.id });
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
                        {row.topic}
                    </Typography>
                    <ExternalLink
                        id={'system-alert-detail-link'}
                        data-testid={'system-alert-detail-link'}
                        href={row.link}
                    >
                        {row.link}
                    </ExternalLink>
                    <StyledDivider />
                    <Grid container spacing={1}>
                        <Grid item xs={4}>
                            <Typography fontWeight={400}>Alert ID</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            {row.id}
                        </Grid>
                        <Grid item xs={4}>
                            <Typography fontWeight={400}>Received</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            {row.created_date}
                        </Grid>
                    </Grid>
                    <StyledDivider />
                    <Typography>{row.content}</Typography>
                    <StyledDivider />
                    <Autocomplete
                        id="alert-detail-user"
                        fullWidth
                        variant="standard"
                        renderInput={params => (
                            <TextField
                                {...params}
                                label="Status"
                                helperText="Assign a staff member to this issue"
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
                        value={!!row.assigned_to ? adminUsers.find(user => user.id === row.assigned_to) : adminUsers[0]}
                        onChange={handleAssignedChange}
                        disabled={adminDashboardSystemAlertsUpdating || !!row.resolved_by}
                    />
                    {!!buttonLabel && (
                        <Box display={'flex'} flex={1} flexDirection={'column'} justifyContent={'flex-end'}>
                            <Button
                                fullWidth
                                color="primary"
                                variant="contained"
                                disabled={adminDashboardSystemAlertsUpdating || !!!row.assigned_to || !!row.resolved_by}
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
    row: PropTypes.object,
    open: PropTypes.bool.isRequired,
    onCloseDrawer: PropTypes.func.isRequired,
    onSystemAlertUpdate: PropTypes.func.isRequired,
};

export default React.memo(SystemAlertsDrawer);
