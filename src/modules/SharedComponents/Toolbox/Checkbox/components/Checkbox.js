import React from 'react';
import PropTypes from 'prop-types';

import Checkbox from 'material-ui/Checkbox';
import propFilter from '../../helpers/_filterProps';
import {HelpIcon} from '../../HelpDrawer';

const CheckboxWrapper = props => {
    const filteredProps = propFilter(props, Checkbox.propTypes);
    filteredProps.onCheck = (event, isInputChecked) => props.input.onChange(isInputChecked);
    delete filteredProps.errorText;

    return (
        <div style={{position: 'relative', width: '100%'}} className={props.meta && props.meta.error ? 'error-checkbox' : {}}>
            <Checkbox {...filteredProps} />
            {props.help && props.help.text && (
                <HelpIcon {...props.help} />
            )}
        </div>
    );
};

CheckboxWrapper.propTypes = {
    ...Checkbox.propTypes,
    help: PropTypes.shape({
        title: PropTypes.string,
        text: PropTypes.any,
        buttonLabel: PropTypes.string
    })
};

export default CheckboxWrapper;
