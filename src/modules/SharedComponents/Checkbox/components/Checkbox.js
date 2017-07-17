import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import PropTypes from 'prop-types';

import propFilter from '../../helpers/_filterProps';
import {HelpIcon} from 'uqlibrary-react-toolbox';

const CheckboxWrapper = props => {
    const filteredProps = propFilter(props, Checkbox.propTypes);
    filteredProps.onCheck = (event, isInputChecked) => props.input.onChange(isInputChecked);
    delete filteredProps.errorText;

    return (
        <div style={{position: 'relative', width: '100%'}} className={props.meta && props.meta.error ? 'error-checkbox' : {}}>
            <Checkbox {...filteredProps} />
            {props.helpText && (
                <HelpIcon title={props.helpTitle} text={props.helpText} buttonLabel="Ok" />
            )}
        </div>
    );
};

CheckboxWrapper.propTypes = {
    ...Checkbox.propTypes,
    helpTitle: PropTypes.string,
    helpText: PropTypes.any
};

export default CheckboxWrapper;
