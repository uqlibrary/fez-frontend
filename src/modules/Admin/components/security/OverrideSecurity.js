import React from 'react';
import PropTypes from 'prop-types';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

/**
 * Redux-form normalize callback
 */
export const overrideSecurityValueNormaliser = value => (value === true || value === 0 ? 0 : 1);

export const OverrideSecurity = ({ label, input, disabled, overrideSecurityId }) => {
    const normalisedValue = overrideSecurityValueNormaliser(input.value);
    return (
        <FormControlLabel
            control={
                <Checkbox
                    inputProps={{
                        'data-analyticsid': `${overrideSecurityId}-input`,
                        'data-testid': `${overrideSecurityId}-input`,
                        id: `${overrideSecurityId}-input`,
                    }}
                    disabled={disabled}
                    onChange={e => {
                        input.onChange(overrideSecurityValueNormaliser(e.target.checked));
                    }}
                    checked={normalisedValue === 0}
                />
            }
            {...{ label }}
        />
    );
};

OverrideSecurity.propTypes = {
    label: PropTypes.string,
    input: PropTypes.object,
    disabled: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]),
    overrideSecurityId: PropTypes.string,
};

export default React.memo(OverrideSecurity);
