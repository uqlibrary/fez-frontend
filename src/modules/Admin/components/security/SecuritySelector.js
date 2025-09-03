import React from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { PolicyDropdown } from './PolicyDropdown';
import SelectedSecurityPolicyDescription from './SelectedSecurityPolicyDescription';
import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';

export const SecuritySelector = ({ disabled, text, securityPolicy, fieldName, securitySelectorId }) => {
    const form = useFormContext();
    return (
        <Grid container spacing={1}>
            {!!text.description && (
                <Grid size={12}>
                    <Typography variant="body2" component="p">
                        {text.description}
                    </Typography>
                </Grid>
            )}
            <Grid size={12}>
                <Field
                    control={form.control}
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
};

SecuritySelector.propTypes = {
    disabled: PropTypes.bool,
    fieldName: PropTypes.string,
    text: PropTypes.object,
    securityPolicy: PropTypes.number,
    securitySelectorId: PropTypes.string.isRequired,
};

export default React.memo(SecuritySelector);
