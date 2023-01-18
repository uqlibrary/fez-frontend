import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/immutable';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { PolicyDropdown } from './PolicyDropdown';
import SelectedSecurityPolicyDescription from './SelectedSecurityPolicyDescription';

export const SecuritySelector = ({ disabled, text, securityPolicy, fieldName, securitySelectorId }) => (
    <Grid container spacing={1}>
        {!!text.description && (
            <Grid item xs={12}>
                <Typography variant="body2" component="p">
                    {text.description}
                </Typography>
            </Grid>
        )}
        <Grid item xs={12}>
            <Field
                component={PolicyDropdown}
                name={fieldName}
                fieldLabel={text.fieldLabel}
                displayPrompt
                prompt={text.prompt}
                disabled={disabled}
                policyDropdownId={`${securitySelectorId}`}
            />
        </Grid>
        {!!securityPolicy && (
            <SelectedSecurityPolicyDescription title={text.selectedTitle} selectedPolicyKey={securityPolicy} />
        )}
    </Grid>
);

SecuritySelector.propTypes = {
    disabled: PropTypes.bool,
    fieldName: PropTypes.string,
    text: PropTypes.object,
    securityPolicy: PropTypes.number,
    securitySelectorId: PropTypes.string.isRequired,
};

export default React.memo(SecuritySelector);
