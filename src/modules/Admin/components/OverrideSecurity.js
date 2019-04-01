import React from 'react';
import PropTypes from 'prop-types';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export const OverrideSecurity = React.memo(({label, input}) => (
    <FormControlLabel
        control={<Checkbox
            onChange={input.onChange}
        />}
        label={label}
    />
));

OverrideSecurity.propTypes = {
    label: PropTypes.string,
    input: PropTypes.object
};
