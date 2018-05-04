import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'material-ui/DatePicker';

import propFilter from '../../helpers/_filterProps';
import {HelpIcon} from '../../HelpDrawer';

export default function DatePickerWrapper(props) {
    const filteredProps = propFilter(props, DatePicker.propTypes);
    filteredProps.name = props.input ? props.input.name : props.name;
    filteredProps.floatingLabelText = props.floatingLabelText;
    filteredProps.floatingLabelFixed = props.floatingLabelFixed;

    filteredProps.value = filteredProps.value instanceof Date ? filteredProps.value : new Date();
    filteredProps.onChange = (e, value) => props.input.onChange(value);
    delete filteredProps.onBlur;

    return (
        <div style={{position: 'relative', width: '100%'}}>
            <DatePicker {...filteredProps} />
            {props.help && props.help.text && (
                <div style={{position: 'absolute', top: '20px', right: 0}}>
                    <HelpIcon {...props.help} />
                </div>
            )}
        </div>
    );
}

DatePickerWrapper.propTypes = {
    ...DatePicker.propTypes,
    help: PropTypes.shape({
        title: PropTypes.string,
        text: PropTypes.any,
        buttonLabel: PropTypes.string
    })
};
