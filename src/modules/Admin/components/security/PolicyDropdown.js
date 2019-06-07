import React from 'react';
import PropTypes from 'prop-types';

import MenuItem from '@material-ui/core/MenuItem';

import {SelectField} from 'modules/SharedComponents/Toolbox/SelectField';

import {validation} from 'config';
import {TOP_LEVEL_SECURITY_POLICIES} from 'config/general';

export const PolicyDropdown = ({ fieldName, disabled, fieldLabel, displayPrompt, policyList, prompt, ...props }) => (
    <SelectField
        disabled={disabled}
        name={fieldName}
        label={fieldLabel}
        required
        validation={[validation.required]}
        {...props}
    >
        {
            displayPrompt &&
            <MenuItem value="" disabled>
                {prompt}
            </MenuItem>
        }
        {
            policyList.map((policy, index) => (
                <MenuItem
                    key={index}
                    value={policy.value}
                >
                    {policy.label}
                </MenuItem>
            ))
        }
    </SelectField>
);

PolicyDropdown.propTypes = {
    disabled: PropTypes.bool,
    fieldName: PropTypes.string,
    fieldLabel: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]),
    displayPrompt: PropTypes.bool,
    policyList: PropTypes.array,
    prompt: PropTypes.string,
};

PolicyDropdown.defaultProps = {
    displayPrompt: false,
    policyList: TOP_LEVEL_SECURITY_POLICIES,
    fieldLabel: 'Record level policy to apply to this PID'
};
