import React from 'react';
import PropTypes from 'prop-types';

import Checkbox from '@material-ui/core/Checkbox';
import propFilter from '../../helpers/_filterProps';

const CheckboxWrapper = props => {
    const filteredProps = propFilter(props, Checkbox.propTypes);
    filteredProps.onChange = (event, isInputChecked) => props.input.onChange(isInputChecked);
    delete filteredProps.errorText;
    return (
        <div
            style={{ position: 'relative', width: '100%' }}
            className={props.meta && props.meta.error ? 'error-checkbox' : {}}
        >
            <Checkbox {...filteredProps} />
        </div>
    );
};

CheckboxWrapper.propTypes = {
    ...Checkbox.propTypes,
    help: PropTypes.shape({
        title: PropTypes.string,
        text: PropTypes.any,
        buttonLabel: PropTypes.string,
    }),
};

export default CheckboxWrapper;
