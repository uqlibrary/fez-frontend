import React from 'react';
import PropTypes from 'prop-types';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export const OverrideSecurity = ({ label, input, disabled, overrideSecurityId }) => {
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
                    onChange={input.onChange}
                    checked={!!Number(input.value)}
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
    overrideSecurityId: PropTypes.string,
};

export default React.memo(OverrideSecurity);
