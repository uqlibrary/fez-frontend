import React from 'react';
import DatePicker from 'material-ui-pickers/DatePicker';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Event from '@material-ui/icons/Event';

export default function DatePickerField(fieldProps) {
    return (
        <DatePicker
            value={!!fieldProps.input.value && fieldProps.input.value || undefined}
            format="DD/MM/YYYY"
            onChange={fieldProps.input.onChange}
            error={!!fieldProps.meta.error}
            helperText={fieldProps.meta.error}
            leftArrowIcon={<KeyboardArrowLeft/>}
            rightArrowIcon={<KeyboardArrowRight/>}
            keyboardIcon={<Event/>}
            keyboard
            allowKeyboardControl
            autoOk
            { ...fieldProps }
        />
    );
}
