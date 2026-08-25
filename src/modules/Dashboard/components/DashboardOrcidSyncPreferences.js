import React from 'react';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { locale as pagesLocale } from '../../../locale';

const DashboardOrcidSyncPreferences = ({ checked, disabled, onChange }) => {
    return (
        <Grid container spacing={4} style={{ marginTop: '0' }} data-testid="orcid-sync-preferences-panel">
            <Grid size={12}>
                <FormControlLabel
                    control={
                        <Switch checked={checked} onChange={e => onChange(e.target.checked)} disabled={disabled} />
                    }
                    id="orcid-sync-preferences-switch-input"
                    data-testid="orcid-sync-preferences-switch-input"
                    label={pagesLocale.pages.dashboard.header.dashboardOrcidSyncPreferences.labels.switch}
                />
            </Grid>
        </Grid>
    );
};

DashboardOrcidSyncPreferences.propTypes = {
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
};

export default DashboardOrcidSyncPreferences;
