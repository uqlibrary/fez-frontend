import React from 'react';
import PropTypes from 'prop-types';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export const overrideSecurityValueNormaliser = value => (value === true || value === 0 ? 0 : 1);

export const OverrideSecurity = ({ label, value, onChange, disabled, overrideSecurityId }) => {
    const normalisedValue = overrideSecurityValueNormaliser(value);
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
                    onChange={e => onChange(overrideSecurityValueNormaliser(e.target.checked))}
                    checked={normalisedValue === 0}
                />
            }
            {...{ label }}
        />
    );
};

OverrideSecurity.propTypes = {
    label: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]),
    overrideSecurityId: PropTypes.string,
};

export default React.memo(OverrideSecurity);
