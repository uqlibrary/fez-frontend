import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';

import { DEFAULT_DATE_FORMAT_WITH_TIME_24H, SYSTEM_ALERT_ACTION, getFormattedServerDate, isUrl } from '../config';

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

const rootId = 'system-alert-detail';
const StyledDivider = styled(Divider)(({ theme }) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));

const SystemAlertsDrawer = ({ locale, row, open, onCloseDrawer, onSystemAlertUpdate }) => {
    const config = useSelector(
        state => state.get('adminDashboardConfigReducer')?.adminDashboardConfigData || /* istanbul ignore next */ {},
    );
    const users = React.useMemo(() => config.admin_users ?? /* istanbul ignore next */ [], [config.admin_users]);

    const getAdminUserList = () => {
        const unassignedOptionLabel = locale.alertStatus.UNASSIGNED;
        const currentUser = config.logged_in_user || /* istanbul ignore next */ {};
        const defaultOption = { id: 0, preferred_name: unassignedOptionLabel };
        // Sort user's names alphabetically
        /* istanbul ignore next */
        users.sort((a, b) => {
            const nameA = a.preferred_name.toUpperCase(); // ignore upper and lowercase
            const nameB = b.preferred_name.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }

            return 0;
        });
        const activeUser = users.find(user => user.id === currentUser?.id);
        const updatedUsers = users.filter(user => user.id !== activeUser?.id);

        // e2e tests can result in the activeUser object being unpopulated,
        // so always filter out any element in the array that is undefined.
        return [defaultOption, activeUser, ...updatedUsers].filter(item => !!item);
    };
    const [adminUsers] = React.useState(getAdminUserList);

    const txt = locale.drawer;
    const { adminDashboardSystemAlertsUpdating } = useSelector(state => state.get('adminDashboardSystemAlertsReducer'));

    let buttonLabel;
    if (!!!row?.sat_assigned_to || !!row?.sat_resolved_by) buttonLabel = null;
    else {
        /* istanbul ignore else */
        if (!!row?.sat_assigned_to && !row?.sat_resolved_by) {
            buttonLabel = !adminDashboardSystemAlertsUpdating ? txt.markResolved : txt.updating;
        }
    }

    const handleCloseDrawer = props => {
        /* istanbul ignore else */
        if (!adminDashboardSystemAlertsUpdating) onCloseDrawer(props);
    };

    const handleAssignedChange = (_, newValue) => {
        onSystemAlertUpdate(SYSTEM_ALERT_ACTION.ASSIGN, { sat_id: row.sat_id, sat_assigned_to: newValue.id });
    };

    const handleResolveButtonClick = () => {
        onSystemAlertUpdate(SYSTEM_ALERT_ACTION.RESOLVE, row);
    };

    const content = row?.sat_content ?? '';

    return (
        !!row && (
            <Drawer anchor="right" open={open} onClose={handleCloseDrawer} id={rootId} data-testid={rootId}>
                <Box
                    sx={{ width: [320, 500] }}
                    role="presentation"
                    padding={2}
                    boxSizing={'border-box'}
                    display={'flex'}
                    flex={1}
                    flexDirection={'column'}
                >
                    <Typography component={'h2'} fontSize={'1.45rem'} fontWeight={500} data-testid={`${rootId}-title`}>
                        {row.sat_title}
                    </Typography>
                    {isUrl(row.sat_link) && (
                        <ExternalLink id={rootId} href={row.sat_link}>
                            {row.sat_link}
                        </ExternalLink>
                    )}
                    <StyledDivider />
                    <Grid container spacing={1}>
                        <Grid item xs={4}>
                            <Typography fontWeight={400} data-testid={`${rootId}-id-label`}>
                                {txt.alertId}
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography fontWeight={'normal'} data-testid={`${rootId}-id`}>
                                {row.sat_id}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography fontWeight={400} data-testid={`${rootId}-date-created-label`}>
                                {txt.received}
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography fontWeight={'normal'} data-testid={`${rootId}-date-created`}>
                                {getFormattedServerDate(row.sat_created_date, DEFAULT_DATE_FORMAT_WITH_TIME_24H)}
                            </Typography>
                        </Grid>
                    </Grid>
                    <StyledDivider />

                    <Box data-testid={`${rootId}-description`}>
                        <Box
                            component={'pre'}
                            sx={{
                                whiteSpace: 'pre-wrap',
                                wordWrap: 'break-word',
                            }}
                            data-testid={`${rootId}-pre-content`}
                        >
                            {content}
                        </Box>
                    </Box>
                    <StyledDivider />
                    <Box id={`${rootId}-assignee`} data-testid={`${rootId}-assignee`}>
                        <Autocomplete
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
                                    inputProps={{
                                        ...params.inputProps,
                                        id: `${rootId}-assignee-input`,
                                        'data-analyticsid': `${rootId}-assignee-input`,
                                        'data-testid': `${rootId}-assignee-input`,
                                    }}
                                    InputLabelProps={{
                                        'data-testid': `${rootId}-assignee-label`,
                                    }}
                                />
                            )}
                            ListboxProps={{
                                id: `${rootId}-options`,
                                'data-analyticsid': `${rootId}-options`,
                                'data-testid': `${rootId}-options`,
                            }}
                            options={adminUsers}
                            getOptionLabel={option => option.preferred_name}
                            value={
                                !!row.sat_assigned_to
                                    ? adminUsers.find(user => user.id === row.sat_assigned_to)
                                    : adminUsers[0]
                            }
                            onChange={handleAssignedChange}
                            disabled={adminDashboardSystemAlertsUpdating || !!row.sat_resolved_by}
                        />
                    </Box>
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
                                id={`${rootId}-action-button`}
                                data-testid={`${rootId}-action-button`}
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
    open: PropTypes.bool,
    onCloseDrawer: PropTypes.func,
    onSystemAlertUpdate: PropTypes.func,
};

export default React.memo(SystemAlertsDrawer);
