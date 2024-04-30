import React, { useState } from 'react';
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

import { ExternalLink } from 'modules/SharedComponents/ExternalLink';

const StyledDivider = styled(Divider)(({ theme }) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));

const SystemAlertsDrawer = ({ row, open, onCloseDrawer }) => {
    const [systemAlert, setSystemAlert] = useState({});
    const [busy] = useState(false);

    const users = useSelector(
        state => state.get('adminDashboardConfigReducer')?.adminDashboardConfigData?.admin_users ?? [],
    );
    const adminUsers = [{ id: 0, name: 'Unassigned' }, ...users];

    React.useEffect(() => {
        setSystemAlert(row);
    }, [row, setSystemAlert]);

    let buttonLabel;
    if (!!systemAlert?.assigned_to && !systemAlert?.resolved_by) {
        buttonLabel = !busy ? 'Mark as resolved' : 'Resolving...';
    } else if (!systemAlert?.assigned_to || !!systemAlert?.resolved_by) {
        buttonLabel = 'Mark as resolved';
    }

    return (
        !!systemAlert && (
            <Drawer anchor="right" open={open} onClose={onCloseDrawer} id="system-alert-detail">
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
                        {systemAlert.topic}
                    </Typography>
                    <ExternalLink
                        id={'system-alert-detail-link'}
                        data-testid={'system-alert-detail-link'}
                        href={systemAlert.link}
                    >
                        {systemAlert.link}
                    </ExternalLink>
                    <StyledDivider />
                    <Grid container spacing={1}>
                        <Grid item xs={4}>
                            <Typography fontWeight={400}>Alert ID</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            {systemAlert.id}
                        </Grid>
                        <Grid item xs={4}>
                            <Typography fontWeight={400}>Received</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            {systemAlert.created_date}
                        </Grid>
                    </Grid>
                    <StyledDivider />
                    <Typography>{systemAlert.content}</Typography>
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
                            />
                        )}
                        options={adminUsers}
                        getOptionLabel={option => option.name}
                        value={
                            !!systemAlert.assigned_to
                                ? adminUsers.find(user => user.id === systemAlert.assigned_to)
                                : adminUsers[0]
                        }
                        onChange={(_, newValue) => {
                            console.log(newValue);
                            setSystemAlert({ ...row, assigned_to: newValue.id });
                        }}
                    />
                    {!!buttonLabel && (
                        <Box display={'flex'} flex={1} flexDirection={'column'} justifyContent={'flex-end'}>
                            <Button
                                fullWidth
                                color="primary"
                                variant="contained"
                                disabled={busy || !!!systemAlert.assigned_to}
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
};

export default React.memo(SystemAlertsDrawer);
