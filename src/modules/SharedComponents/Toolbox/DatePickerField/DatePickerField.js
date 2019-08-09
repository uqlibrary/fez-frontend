import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'material-ui-pickers/DatePicker';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Event from '@material-ui/icons/Event';
import { GENERIC_DATE_FORMAT } from 'config/general';

export default function DatePickerField(fieldProps) {
    const { error, errorText, ...props } = fieldProps;
    return (
        <DatePicker
            value={(!!fieldProps.input && fieldProps.input.value) || (!!fieldProps && fieldProps.value) || undefined}
            onChange={(!!fieldProps.input && fieldProps.input.onChange) || fieldProps.onChange}
            error={(!!fieldProps.meta && !!fieldProps.meta.error) || !!error}
            helperText={(!!fieldProps.meta && fieldProps.meta.error) || errorText}
            leftArrowIcon={<KeyboardArrowLeft />}
            rightArrowIcon={<KeyboardArrowRight />}
            keyboardIcon={<Event />}
            keyboard
            allowKeyboardControl
            autoOk
            {...props}
        />
    );
}

DatePickerField.propTypes = {
    format: PropTypes.string,
    errorText: PropTypes.string,
};

DatePickerField.defaultProps = {
    format: GENERIC_DATE_FORMAT,
    errorText: '',
};
