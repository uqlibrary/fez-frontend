/* eslint-disable no-unused-vars */
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
    const users = useSelector(
        state => state.get('adminDashboardConfigReducer')?.adminDashboardConfigData?.admin_users ?? [],
    );
    const adminUsers = [{ id: 0, name: 'Unassigned' }, ...users];
    return (
        !!row && (
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
                            />
                        )}
                        options={adminUsers}
                        getOptionLabel={option => option.name}
                        defaultValue={
                            !!row.assigned_to ? adminUsers.find(user => user.id === row.assigned_to) : adminUsers[0]
                        }
                    />
                    <Box display={'flex'} flex={1} flexDirection={'column'} justifyContent={'flex-end'}>
                        <Button fullWidth color="primary" variant="contained" disabled={!!!row.assigned_to}>
                            Mark as resolved
                        </Button>
                    </Box>
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
