import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/lib/immutable';

import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { PolicyDropdown } from './PolicyDropdown';
import SelectedSecurityPolicyDescription from './SelectedSecurityPolicyDescription';

export const SecuritySelector = ({ disabled, text, recordType, securityPolicy, fieldName }) => (
    <Grid container spacing={8}>
        {
            !!text.description &&
            <Grid item xs={12}>
                <Typography variant="body2" component="p">
                    {text.description}
                </Typography>
            </Grid>
        }
        <Grid item xs={12}>
            <Field
                component={PolicyDropdown}
                name={fieldName}
                fieldLabel={`${recordType} level policy to apply to this PID`}
                displayPrompt
                prompt={text.prompt}
                disabled={disabled}
            />
        </Grid>
        {
            !!securityPolicy &&
            <SelectedSecurityPolicyDescription
                title={text.selectedTitle}
                selectedPolicyKey={securityPolicy}
            />
        }
    </Grid>
);

SecuritySelector.propTypes = {
    disabled: PropTypes.bool,
    fieldName: PropTypes.string,
    text: PropTypes.object,
    recordType: PropTypes.string,
    securityPolicy: PropTypes.number
};

export default React.memo(SecuritySelector);
