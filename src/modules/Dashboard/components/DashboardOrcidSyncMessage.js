import Grid from '@mui/material/GridLegacy';
import Button from '@mui/material/Button';
import React from 'react';
import PropTypes from 'prop-types';
import DoneIcon from '@mui/icons-material/Done';

const DashboardOrcidSyncMessage = ({
    StatusIcon,
    disableRequest,
    lastSyncMessage,
    locale,
    primaryClick,
    secondaryClick,
    status,
    statusIconStyle,
}) => (
    <Grid container spacing={4} style={{ marginTop: '0' }} data-testid="orcid-help-panel">
        <Grid item data-testid="orcid-help-panel-message">
            <Grid container direction="row" alignItems="flex-start" spacing={2}>
                <Grid item xs={2}>
                    <DoneIcon
                        color="action"
                        style={{ color: 'green', position: 'relative', marginBottom: '-0.25em' }}
                    />
                </Grid>
                <Grid item xs>
                    {lastSyncMessage}
                </Grid>
            </Grid>
            <Grid container direction="row" alignItems="flex-start" spacing={2}>
                <Grid item xs={2}>
                    <StatusIcon size={24} style={statusIconStyle} />
                </Grid>
                <Grid item xs>
                    {status}
                </Grid>
            </Grid>
        </Grid>
        <Grid item>
            <Button
                aria-label={locale.actionButtonLabel}
                children={locale.actionButtonLabel}
                color="primary"
                data-analyticsid="orcid-upload-start-button"
                data-testid="orcid-upload-start-button"
                disabled={disableRequest}
                fullWidth
                onClick={primaryClick}
                variant="contained"
            />
        </Grid>
        <Grid item style={{ paddingTop: 12 }}>
            <Button
                aria-label={locale.alternateActionButtonLabel}
                children={locale.alternateActionButtonLabel}
                color="secondary"
                data-analyticsid="orcid-view-works-button"
                data-testid="orcid-view-works-button"
                fullWidth
                onClick={secondaryClick}
                variant="contained"
            />
        </Grid>
    </Grid>
);

DashboardOrcidSyncMessage.propTypes = {
    StatusIcon: PropTypes.any,
    disableRequest: PropTypes.bool,
    lastSyncMessage: PropTypes.string,
    locale: PropTypes.object,
    primaryClick: PropTypes.func,
    secondaryClick: PropTypes.func,
    status: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    statusIconStyle: PropTypes.object,
};

export default DashboardOrcidSyncMessage;
