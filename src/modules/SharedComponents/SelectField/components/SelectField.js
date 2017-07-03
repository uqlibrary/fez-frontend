import React from 'react';
import SelectField from 'material-ui/SelectField';
import PropTypes from 'prop-types';
import {HelpIcon} from 'uqlibrary-react-toolbox';
import propFilter from '../../_filterProps';

export default function SelectFieldWrapper(props) {
    const filteredProps = propFilter(props, SelectField.propTypes);

    filteredProps.onChange = filteredProps.onBlur = (event, index, value) => {
        if (props.onChange && typeof props.onChange === 'function') {
            props.onChange(value);
        } else {
            props.input.onChange(value);
        }
    };
    return (
        <div className="selectField" style={{position: 'relative', width: '100%'}}>
            <SelectField {...filteredProps} />

            {props.helpText && (
                <div style={{position: 'absolute', top: 20, right: 30}}>
                    <HelpIcon title={props.helpTitle} text={props.helpText} buttonLabel={props.helpButtonLabel} />
                </div>
            )}
        </div>
    );
}

SelectFieldWrapper.propTypes = {
    ...SelectField.propTypes,
    helpTitle: PropTypes.string,
    helpText: PropTypes.any,
    helpButtonLabel: PropTypes.string
};

SelectFieldWrapper.defaultProps = {
    dropDownMenuProps: {animated: false},
    maxHeight: 250,
    helpButtonLabel: 'OK'
};
