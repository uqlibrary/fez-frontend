import React from 'react';
import PropTypes from 'prop-types';

import MenuItem from '@mui/material/MenuItem';

import { SelectField } from 'modules/SharedComponents/Toolbox/SelectField';

import { validation } from 'config';
import { MAXIMUM_SECURITY_PUBLIC, TOP_LEVEL_SECURITY_POLICIES } from 'config/general';

export const PolicyDropdown = ({
    fieldName,
    disabled,
    fieldLabel,
    displayPrompt,
    policyList,
    prompt,
    inheritedSecurity,
    policyDropdownId,
    ...props
}) => (
    <SelectField
        disabled={disabled}
        name={fieldName}
        label={fieldLabel}
        required
        validation={[validation.required]}
        selectFieldId={`${policyDropdownId}`}
        {...props}
    >
        {displayPrompt && (
            <MenuItem value="" disabled>
                {prompt}
            </MenuItem>
        )}
        {policyList.map((policy, index) => (
            <MenuItem key={index} value={policy.value} disabled={policy.value > inheritedSecurity}>
                {policy.label}
            </MenuItem>
        ))}
    </SelectField>
);

PolicyDropdown.propTypes = {
    disabled: PropTypes.bool,
    fieldName: PropTypes.string,
    fieldLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    displayPrompt: PropTypes.bool,
    policyList: PropTypes.array,
    prompt: PropTypes.string,
    inheritedSecurity: PropTypes.number,
    policyDropdownId: PropTypes.string.isRequired,
};

PolicyDropdown.defaultProps = {
    displayPrompt: false,
    policyList: TOP_LEVEL_SECURITY_POLICIES,
    fieldLabel: 'Work level policy to apply to this PID',
    inheritedSecurity: MAXIMUM_SECURITY_PUBLIC,
};
